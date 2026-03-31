import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TornadoState } from './TornadoManager';

function Tree({ position }) {
  const groupRef = useRef();
  const shardsRef = useRef([]);

  const stateTracker = useRef({
    status: 'ALIVE',
    shards: [],
    scale: 1,
    originPos: new THREE.Vector3(...position),
    localCycleId: 0
  });

  useEffect(() => {
    stateTracker.current.shards = Array(4).fill(0).map(() => ({
      velocity: new THREE.Vector3(),
      angularVelocity: new THREE.Vector3(),
      currentPos: new THREE.Vector3(),
      currentRot: new THREE.Vector3(),
      active: false,
      scale: 1
    }));
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = TornadoState.getTime(state.clock);
    const tPos = TornadoState.getTornadoPosition(t);
    const physics = stateTracker.current;

    if (TornadoState.cycles > physics.localCycleId) {
       physics.localCycleId = TornadoState.cycles;
       physics.status = 'ALIVE';
       physics.scale = 1;
       groupRef.current.scale.setScalar(1);
       groupRef.current.position.copy(physics.originPos);
       groupRef.current.children[0].visible = true; 
       shardsRef.current.forEach((shard, i) => { if(shard) shard.visible = false; physics.shards[i].active = false; });
    }

    const dist = physics.originPos.distanceTo(tPos);

    if (physics.status === 'ALIVE') {
        if (dist < 8) {
           physics.status = 'SUCKED';
           
           if(groupRef.current.children[0].visible) {
             groupRef.current.children[0].visible = false; 
             physics.shards.forEach((s, i) => {
               if(!shardsRef.current[i]) return;
               s.active = true;
               shardsRef.current[i].visible = true;
               s.currentPos.setScalar(0);
               s.currentRot.setScalar(0);
               s.scale = 1;
               
               const outward = new THREE.Vector3(
                 (physics.originPos.x - tPos.x), 0, (physics.originPos.z - tPos.z)
               ).normalize();
               
               s.velocity.set(
                 outward.x * (2 + Math.random() * 4),
                 (1 + Math.random() * 2), // upward lift
                 outward.z * (2 + Math.random() * 4)
               );
               s.angularVelocity.set(
                 (Math.random() - 0.5) * 10,
                 (Math.random() - 0.5) * 10,
                 (Math.random() - 0.5) * 10
               );
             });
           }
        }
    } 
    else if (physics.status === 'SUCKED') {
        let allShardsDestroyed = true;

        physics.shards.forEach((s, i) => {
           if (!s.active || !shardsRef.current[i]) return;
           
           s.currentPos.addScaledVector(s.velocity, delta);
           s.currentRot.addScaledVector(s.angularVelocity, delta);
           
           const absoluteY = physics.originPos.y + s.currentPos.y;
           
           if (absoluteY > 16) {
              s.scale = Math.max(0, s.scale - (4 * delta));
           }
           if (s.scale > 0.05) allShardsDestroyed = false;

           shardsRef.current[i].position.copy(s.currentPos);
           shardsRef.current[i].rotation.set(s.currentRot.x, s.currentRot.y, s.currentRot.z);
           shardsRef.current[i].scale.setScalar(s.scale);
        });

        if (allShardsDestroyed) {
            physics.status = 'DESTROYED';
        }
    }
    else if (physics.status === 'DESTROYED') {
        if (dist > 10) {
            physics.status = 'REBUILDING';
            physics.scale = 0;
            groupRef.current.position.copy(physics.originPos);
            groupRef.current.children[0].visible = true;
            shardsRef.current.forEach((shard, i) => { if(shard) shard.visible = false; physics.shards[i].active = false; });
        }
    }
    else if (physics.status === 'REBUILDING') {
        if (physics.scale < 1) {
            if (Math.random() > 0.8) physics.scale += 8 * delta; 
            else physics.scale += 2 * delta; 
            
            if (physics.scale >= 1) {
                physics.scale = 1;
                physics.status = 'ALIVE';
            }
        }
        groupRef.current.scale.setScalar(physics.scale);
    }
    
    if (groupRef.current.userData) groupRef.current.userData.status = physics.status;
  });

  return (
    <group ref={groupRef} position={position} userData={{status: 'ALIVE'}}>
      {/* 1. MAIN UNIFIED MESH */}
      <group>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* 2. FRAGMENTATION SHARDS */}
      <group visible={true}>
         {/* Trunk */}
         <mesh ref={(el) => (shardsRef.current[0] = el)} position={[0, 1, 0]} visible={false}>
            <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
            <meshStandardMaterial color="#78350f" />
         </mesh>
         
         {/* Canopy Bottom */}
         <mesh ref={(el) => (shardsRef.current[1] = el)} position={[0, 2.0, 0]} visible={false}>
            <sphereGeometry args={[1.0, 8, 8]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.6} />
         </mesh>
         
         {/* Canopy Top */}
         <mesh ref={(el) => (shardsRef.current[2] = el)} position={[0, 3.0, 0]} visible={false}>
            <sphereGeometry args={[0.8, 8, 8]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.6} />
         </mesh>

         {/* Canopy Extra */}
         <mesh ref={(el) => (shardsRef.current[3] = el)} position={[0.5, 2.5, 0.5]} visible={false}>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.6} />
         </mesh>
      </group>
    </group>
  );
}

export default Tree;