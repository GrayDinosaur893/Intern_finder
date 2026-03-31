import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

import { TornadoState } from './TornadoManager';
import Tornado from './Tornado';
import CityObject from './CityObject';
import Ground from './Ground';
import CameraDirector from './CameraDirector';

function SkyDome() {
  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[800, 32, 32]} />
      <shaderMaterial 
        side={THREE.BackSide}
        vertexShader={`
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vPosition;
          void main() {
            float h = normalize(vPosition).y;

            vec3 zenith      = vec3(0.008, 0.04, 0.18);  // #020b2e near black navy
            vec3 midsky      = vec3(0.04,  0.16, 0.43);  // #0a2a6e deep blue
            vec3 horizon     = vec3(0.91,  0.96, 1.0);   // #e8f4ff near white
            vec3 belowground = vec3(0.0,   0.0,  0.0);   // #000000 pure black

            vec3 color;
            if (h > 0.3) {
              color = mix(midsky, zenith, (h - 0.3) / 0.7);
            } else if (h > 0.0) {
              color = mix(horizon, midsky, h / 0.3);
            } else {
              color = mix(horizon, belowground, clamp(-h * 3.0, 0.0, 1.0));
            }

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

window.CityStatsMap = new Array(80).fill('EMPTY');
window.CityStats = { 
  totalSpawned: 0,
  cycle: 0 
};

export default function StudentCity() {
  const [objects, setObjects] = useState([]);
  
  const instancedTrunkRef = useRef();
  const instancedCanopyRef = useRef();

  // HUD DOM Refs mapped outside React render loop (kept for state logic)
  const aliveRef = useRef();
  const destroyedRef = useRef();
  const rebuildingRef = useRef();
  const spawnedRef = useRef();

  // Autonomous 1000ms procedural spawn loop
  useEffect(() => {
    const interval = setInterval(() => {
      setObjects(prev => {
        const pool = [...prev];
        let targetIndex = -1;
        
        if (pool.length < 80) targetIndex = pool.length;
        else {
            for(let i=0; i < 80; i++){
               if(window.CityStatsMap[i] === 'DESTROYED'){
                  targetIndex = i; break;
               }
            }
        }

        if (targetIndex !== -1) {
            const rand = Math.random();
            let type = 'HOUSE';
            if (rand > 0.5 && rand <= 0.8) type = 'TREE';
            if (rand > 0.8) type = 'CAR';

            const newObject = {
               id: targetIndex,
               type,
               position: [(Math.random() - 0.5) * 90, 0, (Math.random() - 0.5) * 90]
            };
            
            window.CityStatsMap[targetIndex] = 'ALIVE';
            window.CityStats.totalSpawned++;
            
            pool[targetIndex] = newObject;
            return pool;
        }
        return pool;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Performance rule: A single requestAnimationFrame loop outside React reads 
  // window.CityStats and injects values into DOM refs directly.
  useEffect(() => {
    let frameId;
    const loop = () => {
       let a = 0, d = 0, r = 0;
       for(let i = 0; i < 80; i++) {
           const status = window.CityStatsMap[i];
           if (status === 'ALIVE' || status === 'SUCKED') a++;
           else if (status === 'DESTROYED') d++;
           else if (status === 'REBUILDING') r++;
       }
       if (aliveRef.current) aliveRef.current.innerText = a; 
       if (destroyedRef.current) destroyedRef.current.innerText = d;
       if (rebuildingRef.current) rebuildingRef.current.innerText = r;
       if (spawnedRef.current) spawnedRef.current.innerText = window.CityStats.totalSpawned;
       
       frameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <>
      <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.4) 75%, rgba(0, 0, 0, 0.85) 90%, #000000 100%)',
          pointerEvents: 'none', zIndex: 5
      }}></div>

      <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          overflow: 'hidden', zIndex: -1
      }}>
        <Canvas onCreated={({ gl }) => gl.setClearColor('#000000', 1)} scene={{ background: null }} style={{ width: '100vw', height: '100vh', display: 'block' }}>
          <SkyDome />
          <CameraDirector />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 50, 20]} intensity={1.5} />

          <Ground />
          <Tornado />

          {/* Fences/Trees strictly defined inside InstancedMesh wrapper hooks via Drei bypass */}
          <instancedMesh ref={instancedTrunkRef} args={[null, null, 80]}>
             <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
             <meshStandardMaterial color="#78350f" />
          </instancedMesh>
          <instancedMesh ref={instancedCanopyRef} args={[null, null, 80]}>
             <sphereGeometry args={[1.2, 16, 16]} />
             <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.6} />
          </instancedMesh>

          {objects.map((obj) => (
             <CityObject 
                key={obj.id} 
                id={obj.id}
                type={obj.type}
                position={obj.position}
                instancedTrunkRef={instancedTrunkRef}
                instancedCanopyRef={instancedCanopyRef}
             />
          ))}

          <EffectComposer>
            <Bloom intensity={1.8} luminanceThreshold={0.25} radius={0.6} mipmapBlur={false} />
          </EffectComposer>
        </Canvas>
      </div>

      <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          pointerEvents: 'none', overflow: 'hidden',
          zIndex: 100,
          fontFamily: 'Courier New, monospace'
      }}>
          <div style={{
              position: 'absolute', top: '20px', width: '100%',
              textAlign: 'center', color: '#00ffff',
              letterSpacing: '4px', textShadow: '0 0 10px #00ffff',
              fontSize: '24px', fontWeight: 'bold'
          }}>
              ⬡ VORTEX ACTIVE ⬡
          </div>

          {/* Stats panel removed - UI cleaned */}
          
          {/* MANUAL OVERRIDE button removed */}
          
          {/* Agent Prompt Ref block removed */}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.4);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </>
  );
}