import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const scratchObject = new THREE.Object3D();

export default function CityObject({ 
  id, 
  type, 
  position, 
  instancedTrunkRef, 
  instancedCanopyRef 
}) {
  const mainMeshRef = useRef();
  const shardsRef = useRef([]);

  const tracker = useRef({
    status: 'ALIVE',
    originX: position[0],
    originY: position[1],
    originZ: position[2],
    suckTimer: 0,
    rebuildTimer: 0
  });

  const shards = useRef([]);

  useEffect(() => {
    // 6 shards for House & Car, 3 shards for Tree (trunk + canopy slices)
    shards.current = Array(6).fill(0).map((_, i) => ({
      ref: { current: shardsRef.current[i] },
      vel: { x: 0, y: 0, z: 0 },
      angVel: { x: 0, y: 0, z: 0 }
    }));
    
    // Register on mount
    window.cityObjects = window.cityObjects || [];
    window.cityObjects.push({ 
        tracker, 
        mainMeshRef, 
        shards: shards.current 
    });

    return () => {
        if (window.cityObjects) {
            window.cityObjects = window.cityObjects.filter(o => o.tracker !== tracker);
        }
    };
  }, []);

  useFrame((state, delta) => {
    if (!window.tornadoPos) return;

    const tx = window.tornadoPos.x;
    const tz = window.tornadoPos.z;

    const dx = tracker.current.originX - tx;
    const dz = tracker.current.originZ - tz;
    const dist = Math.sqrt(dx * dx + dz * dz);

    const status = tracker.current.status;

    // ─── ALIVE → SUCKED ───────────────────────────────
    if (status === 'ALIVE' && dist < 8) {
      tracker.current.status = 'SUCKED';
      tracker.current.suckTimer = 0;
      if (mainMeshRef.current) mainMeshRef.current.visible = false;
      
      shards.current.forEach(shard => {
        if (!shard.ref.current) return;
        shard.ref.current.visible = true;
        shard.ref.current.position.set(
          tracker.current.originX,
          0,
          tracker.current.originZ
        );
        // random outward velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        shard.vel = {
          x: Math.cos(angle) * speed,
          y: 1 + Math.random() * 3,
          z: Math.sin(angle) * speed
        };
        shard.angVel = {
          x: (Math.random() - 0.5) * 0.3,
          y: (Math.random() - 0.5) * 0.3,
          z: (Math.random() - 0.5) * 0.3
        };
      });
      return;
    }

    // ─── SUCKED → update shards → DESTROYED ──────────
    if (status === 'SUCKED') {
      tracker.current.suckTimer += delta; // using generic delta safely
      let allGone = true;

      shards.current.forEach(shard => {
        if (!shard.ref.current || !shard.ref.current.visible) return;
        allGone = false;

        // move shard
        shard.ref.current.position.x += shard.vel.x * 0.1;
        shard.ref.current.position.y += shard.vel.y * 0.1;
        shard.ref.current.position.z += shard.vel.z * 0.1;

        // tumble shard
        shard.ref.current.rotation.x += shard.angVel.x;
        shard.ref.current.rotation.y += shard.angVel.y;
        shard.ref.current.rotation.z += shard.angVel.z;

        // gravity pull down slightly
        shard.vel.y -= 0.05;

        // once high enough scale to 0
        if (shard.ref.current.position.y > 16) {
          shard.ref.current.scale.setScalar(
            Math.max(0, shard.ref.current.scale.x - 0.05)
          );
          if (shard.ref.current.scale.x <= 0) {
            shard.ref.current.visible = false;
          }
        }
      });

      if (allGone) {
        tracker.current.status = 'DESTROYED';
      }
    }

    // ─── DESTROYED → REBUILDING ───────────────────────
    if (status === 'DESTROYED' && dist > 10) {
      tracker.current.status = 'REBUILDING';
      tracker.current.rebuildTimer = 0;
      if (mainMeshRef.current) {
          mainMeshRef.current.visible = true;
          mainMeshRef.current.scale.setScalar(0);
      }
      shards.current.forEach(shard => {
        if (!shard.ref.current) return;
        shard.ref.current.visible = false;
        shard.ref.current.scale.setScalar(1);
      });
      return;
    }

    // ─── REBUILDING → ALIVE ───────────────────────────
    if (status === 'REBUILDING') {
      tracker.current.rebuildTimer += delta;
      const progress = Math.min(tracker.current.rebuildTimer / 0.6, 1.0);

      // glitch flicker
      const glitch = Math.sin(progress * Math.PI * 6) * 0.3;
      const scale = progress + glitch * (1 - progress);
      if (mainMeshRef.current) {
         mainMeshRef.current.scale.setScalar(Math.max(0, scale));
      }

      if (progress >= 1.0) {
        if (mainMeshRef.current) mainMeshRef.current.scale.setScalar(1);
        tracker.current.status = 'ALIVE';
      }
    }

    // HUD Update Hooks
    window.CityStatsMap = window.CityStatsMap || Array(80).fill('EMPTY');
    window.CityStatsMap[id] = tracker.current.status;

    // Direct InstancedMesh Matrix Injection for Trees
    if (type === 'TREE' && instancedTrunkRef?.current && instancedCanopyRef?.current) {
        const isVisible = mainMeshRef.current ? mainMeshRef.current.visible : false;
        const scaleVal = mainMeshRef.current ? mainMeshRef.current.scale.x : 0;
        const actualScale = (isVisible && (status === 'ALIVE' || status === 'REBUILDING')) ? scaleVal : 0;
        
        scratchObject.position.set(tracker.current.originX, 1, tracker.current.originZ);
        scratchObject.rotation.set(0,0,0);
        scratchObject.scale.setScalar(actualScale);
        scratchObject.updateMatrix();
        instancedTrunkRef.current.setMatrixAt(id, scratchObject.matrix);
        
        scratchObject.position.set(tracker.current.originX, 2.5, tracker.current.originZ);
        scratchObject.updateMatrix();
        instancedCanopyRef.current.setMatrixAt(id, scratchObject.matrix);
        
        instancedTrunkRef.current.instanceMatrix.needsUpdate = true;
        instancedCanopyRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. MAIN UNIFIED MESH */}
      <group ref={mainMeshRef} position={position}>
        {type === 'HOUSE' && (
          <>
            <mesh position={[0, 1, 0]}>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color="#06b6d4" />
            </mesh>
            <mesh position={[0, 2.5, 0]}>
              <coneGeometry args={[1.5, 1.5, 4]} />
              <meshStandardMaterial color="#06b6d4" />
            </mesh>
            <mesh position={[0.6, 1.2, 1.01]}>
              <boxGeometry args={[0.3, 0.3, 0.1]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2.5} />
            </mesh>
            <mesh position={[-0.6, 1.2, 1.01]}>
              <boxGeometry args={[0.3, 0.3, 0.1]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2.5} />
            </mesh>
          </>
        )}
        {type === 'CAR' && (
          <>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[2.5, 0.6, 1.2]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh position={[0, 1, 0]}>
              <boxGeometry args={[1.2, 0.5, 1]} />
              <meshStandardMaterial color="#3b82f6" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.8, 0.3, 0.6]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.2, 16]} /><meshStandardMaterial color="#1f2937" /></mesh>
            <mesh position={[-0.8, 0.3, 0.6]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.2, 16]} /><meshStandardMaterial color="#1f2937" /></mesh>
            <mesh position={[0.8, 0.3, -0.6]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.2, 16]} /><meshStandardMaterial color="#1f2937" /></mesh>
            <mesh position={[-0.8, 0.3, -0.6]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.2, 16]} /><meshStandardMaterial color="#1f2937" /></mesh>
            <mesh position={[1.26, 0.5, 0.35]}>
              <boxGeometry args={[0.1, 0.2, 0.2]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2.5} />
            </mesh>
            <mesh position={[1.26, 0.5, -0.35]}>
              <boxGeometry args={[0.1, 0.2, 0.2]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2.5} />
            </mesh>
          </>
        )}
        {type === 'TREE' && (
          <group visible={false} />
        )}
      </group>

      {/* 2. FRAGMENTATION SHARDS */}
      <group>
         {type === 'HOUSE' && (
           <>
             <mesh ref={(el) => (shardsRef.current[0] = el)} position={[0, 0, 0]} visible={false}><coneGeometry args={[1.5, 1.5, 4]} /><meshStandardMaterial color="#06b6d4" /></mesh>
             <mesh ref={(el) => (shardsRef.current[1] = el)} position={[0, 0, 0]} visible={false}><boxGeometry args={[2, 0.2, 2]} /><meshStandardMaterial color="#06b6d4" /></mesh>
             <mesh ref={(el) => (shardsRef.current[2] = el)} position={[0, 0, 0]} visible={false}><boxGeometry args={[2, 2, 0.2]} /><meshStandardMaterial color="#06b6d4" /></mesh>
             <mesh ref={(el) => (shardsRef.current[3] = el)} position={[0, 0, 0]} visible={false}><boxGeometry args={[2, 2, 0.2]} /><meshStandardMaterial color="#06b6d4" /></mesh>
             <mesh ref={(el) => (shardsRef.current[4] = el)} position={[0, 0, 0]} visible={false}><boxGeometry args={[0.2, 2, 2]} /><meshStandardMaterial color="#06b6d4" /></mesh>
             <mesh ref={(el) => (shardsRef.current[5] = el)} position={[0, 0, 0]} visible={false}><boxGeometry args={[0.2, 2, 2]} /><meshStandardMaterial color="#06b6d4" /></mesh>
           </>
         )}
         {type === 'CAR' && (
           <>
             <mesh ref={(el) => (shardsRef.current[0] = el)} position={[0, 0, 0]} visible={false}><boxGeometry args={[2.5, 0.6, 1.2]} /><meshStandardMaterial color="#ef4444" /></mesh>
             <mesh ref={(el) => (shardsRef.current[1] = el)} position={[0, 0, 0]} visible={false}><boxGeometry args={[1.2, 0.5, 1]} /><meshStandardMaterial color="#3b82f6" transparent opacity={0.7} /></mesh>
             <mesh ref={(el) => (shardsRef.current[2] = el)} position={[0, 0, 0]} visible={false}><cylinderGeometry args={[0.3, 0.3, 0.2, 16]} /><meshStandardMaterial color="#1f2937" /></mesh>
             <mesh ref={(el) => (shardsRef.current[3] = el)} position={[0, 0, 0]} visible={false}><cylinderGeometry args={[0.3, 0.3, 0.2, 16]} /><meshStandardMaterial color="#1f2937" /></mesh>
             <mesh ref={(el) => (shardsRef.current[4] = el)} position={[0, 0, 0]} visible={false}><cylinderGeometry args={[0.3, 0.3, 0.2, 16]} /><meshStandardMaterial color="#1f2937" /></mesh>
             <mesh ref={(el) => (shardsRef.current[5] = el)} position={[0, 0, 0]} visible={false}><cylinderGeometry args={[0.3, 0.3, 0.2, 16]} /><meshStandardMaterial color="#1f2937" /></mesh>
           </>
         )}
         {type === 'TREE' && (
           <>
             <mesh ref={(el) => (shardsRef.current[0] = el)} position={[0, 0, 0]} visible={false}><cylinderGeometry args={[0.2, 0.3, 2, 8]} /><meshStandardMaterial color="#78350f" /></mesh>
             <mesh ref={(el) => (shardsRef.current[1] = el)} position={[0, 0, 0]} visible={false}><sphereGeometry args={[1.0, 8, 8]} /><meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.6} /></mesh>
             <mesh ref={(el) => (shardsRef.current[2] = el)} position={[0, 0, 0]} visible={false}><sphereGeometry args={[0.8, 8, 8]} /><meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.6} /></mesh>
           </>
         )}
      </group>
    </group>
  );
}
