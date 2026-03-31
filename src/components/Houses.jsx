import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ORBIT_RADIUS, ORBIT_SPEED } from './Tornado';

const SCENERY_COUNT = 32;
// "about 2 step from a house it rerenders" -> Distance ~2.5
const DESTRUCTION_THRESHOLD = 2.5;
const RESPAWN_DELAY = 4.0; // seconds

function SceneryObject({ id, x, z, isTree }) {
  const groupRef = useRef();

  // Object state holding movement & destruction info
  const state = useRef({
    x,
    y: 0,
    z,
    destroyed: false,
    scale: 1,
    destroyTime: 0,
    // Provide a random solid color (variations of brown for house/trunk, or something distinct)
    color: isTree ? '#8B4513' : new THREE.Color().setHSL(Math.random() * 0.1 + 0.05, 0.6, 0.4),
    leafColor: new THREE.Color().setHSL(0.3 + Math.random() * 0.1, 0.8, 0.4) // green
  });

  useFrame((sceneState, delta) => {
    if (!groupRef.current) return;
    const s = state.current;

    // Calculate accurate Tornado position dynamically
    const time = sceneState.clock.elapsedTime;
    const tornadoTime = time * ORBIT_SPEED;
    const tornadoX = ORBIT_RADIUS * Math.cos(tornadoTime);
    const tornadoZ = ORBIT_RADIUS * Math.sin(tornadoTime);

    // Calculate distance to tornado
    const dist = Math.sqrt(Math.pow(s.x - tornadoX, 2) + Math.pow(s.z - tornadoZ, 2));

    // Check destruction threshold
    if (dist < DESTRUCTION_THRESHOLD && !s.destroyed) {
      s.destroyed = true;
      s.destroyTime = time;
    }

    // Handle destruction animation (scale down and fly up spinning)
    if (s.destroyed) {
      if (s.scale > 0) {
        s.scale -= 2.0 * delta; // Quick shrink
        if (s.scale < 0) s.scale = 0;
      }
      groupRef.current.rotation.x += 2 * delta;
      groupRef.current.rotation.y += 3 * delta;
      s.y += 5 * delta; // Fly up
      
      // Check respawn logic (rerender)
      if (time - s.destroyTime > RESPAWN_DELAY) {
        s.destroyed = false;
        s.scale = 1;
        s.y = 0;
        groupRef.current.rotation.set(0, 0, 0);
      }
    }

    // Apply updates to group
    groupRef.current.position.set(s.x, s.y, s.z);
    groupRef.current.scale.setScalar(s.scale);
  });

  if (isTree) {
    return (
      <group ref={groupRef}>
        {/* Trunk */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 1]} />
          <meshStandardMaterial color={state.current.color} roughness={0.9} />
        </mesh>
        {/* Leaves */}
        <mesh position={[0, 1.5, 0]}>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color={state.current.leafColor} roughness={0.8} />
        </mesh>
      </group>
    );
  }

  // Otherwise it's a House (Box)
  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={state.current.color} roughness={0.7} />
      </mesh>
    </group>
  );
}

// Manager combining all objects in a circle
function Houses() {
  const objects = useMemo(() => {
    const list = [];
    for (let i = 0; i < SCENERY_COUNT; i++) {
        // Place scenery in a circular ring
        const angle = (i / SCENERY_COUNT) * Math.PI * 2;
        // Jitter radius slightly for a natural look
        const radius = ORBIT_RADIUS + (Math.random() * 2 - 1);
        
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        
        // Randomly assign as Tree or House
        const isTree = Math.random() > 0.5;
        
        list.push({ id: i, x, z, isTree });
    }
    return list;
  }, []);

  return (
    <group>
      {objects.map((obj) => (
        <SceneryObject key={obj.id} id={obj.id} x={obj.x} z={obj.z} isTree={obj.isTree} />
      ))}
    </group>
  );
}

export default Houses;