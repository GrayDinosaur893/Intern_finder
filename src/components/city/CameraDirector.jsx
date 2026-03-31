import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { TornadoState } from './TornadoManager';

export default function CameraDirector() {
  const { camera } = useThree();

  useEffect(() => {
    camera.fov = 60;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame((state) => {
    const t = TornadoState.getTime(state.clock);
    const angle = t * 0.15; // slow continuous orbit
    const radius = 55;
    const height = 35;

    state.camera.position.x = Math.sin(angle) * radius;
    state.camera.position.z = Math.cos(angle) * radius;
    state.camera.position.y = height;
    
    state.camera.lookAt(0, 0, 0);
  });
  
  return null;
}
