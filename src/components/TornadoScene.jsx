import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import ParticleTornado from './ParticleTornado';
import Houses from './Houses';

function Scene() {
  return (
    <>
      {/* Dark background and Fog for depth */}
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 0.02, 50]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#aa3bff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0.5}
        color="#ec4899"
      />
      
      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Particle Tornado */}
      <ParticleTornado particleCount={3000} />
      
      {/* Houses that get destroyed */}
      <Houses count={25} tornadoCenter={[0, 0, 0]} />
      
      {/* Slow camera movement */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.2}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
      />
    </>
  );
}

function TornadoScene() {
  return (
    <div className="tornado-scene-container" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{
          position: [12, 6, 12],
          fov: 60,
          near: 0.1,
          far: 200,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default TornadoScene;