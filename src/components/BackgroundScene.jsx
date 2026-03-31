import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import Tornado, { ORBIT_RADIUS, ORBIT_SPEED } from './Tornado';
import Houses from './Houses';

function CameraController() {
  useFrame((state) => {
    // Camera moves opposite to tornado (PI phase shift)
    const time = state.clock.elapsedTime * ORBIT_SPEED;
    const cameraRadius = 16; // Further out than the tornado to see it well
    
    // Position opposite to tornado
    state.camera.position.x = cameraRadius * Math.cos(time + Math.PI);
    state.camera.position.z = cameraRadius * Math.sin(time + Math.PI);
    state.camera.position.y = 8;
    
    // Look exactly at the tornado to get its side profile
    const tornadoX = ORBIT_RADIUS * Math.cos(time);
    const tornadoZ = ORBIT_RADIUS * Math.sin(time);
    state.camera.lookAt(tornadoX, 2, tornadoZ);
  });
  return null;
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#4ade80" /> {/* Green grass */}
    </mesh>
  );
}

function BackgroundScene() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        pointerEvents: 'none', // user cant touch bg
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <CameraController />
        <Suspense fallback={null}>
          <color attach="background" args={['#ffffff']} />
          <fog attach="fog" args={['#ffffff', 10, 40]} />
          
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} />
          
          <Ground />
          <Tornado particleCount={4000} />
          <Houses />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default BackgroundScene;
