import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

export default function Ground() {
  const fencesRef = useRef();

  const fenceCount = 100;
  const FENCE_SIZE_X = 4;
  const HALF_BOUNDARY = 50;
  
  const fenceMatrices = useMemo(() => {
    const matrices = [];
    const obj = new THREE.Object3D();
    
    // Top Edge (Z = -50)
    for (let i = 0; i < 25; i++) {
       obj.position.set(-HALF_BOUNDARY + i * FENCE_SIZE_X + 2, 0.5, -HALF_BOUNDARY);
       obj.rotation.set(0, 0, 0);
       obj.updateMatrix();
       matrices.push(obj.matrix.clone());
    }
    // Bottom Edge (Z = 50)
    for (let i = 0; i < 25; i++) {
       obj.position.set(-HALF_BOUNDARY + i * FENCE_SIZE_X + 2, 0.5, HALF_BOUNDARY);
       obj.rotation.set(0, 0, 0);
       obj.updateMatrix();
       matrices.push(obj.matrix.clone());
    }
    // Left Edge (X = -50)
    for (let i = 0; i < 25; i++) {
       obj.position.set(-HALF_BOUNDARY, 0.5, -HALF_BOUNDARY + i * FENCE_SIZE_X + 2);
       obj.rotation.set(0, Math.PI / 2, 0);
       obj.updateMatrix();
       matrices.push(obj.matrix.clone());
    }
    // Right Edge (X = 50)
    for (let i = 0; i < 25; i++) {
       obj.position.set(HALF_BOUNDARY, 0.5, -HALF_BOUNDARY + i * FENCE_SIZE_X + 2);
       obj.rotation.set(0, Math.PI / 2, 0);
       obj.updateMatrix();
       matrices.push(obj.matrix.clone());
    }
    return matrices;
  }, []);

  useEffect(() => {
    if (fencesRef.current) {
        fenceMatrices.forEach((mat, i) => {
           fencesRef.current.setMatrixAt(i, mat);
        });
        fencesRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [fenceMatrices]);

  return (
    <group>
      {/* Radial Green Gradient Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <shaderMaterial 
          vertexShader={`
            varying vec3 vWorldPos;
            void main() {
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vWorldPos = worldPosition.xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vWorldPos;
            void main() {
              float dist = length(vWorldPos.xz) / 70.0;
              vec3 centerColor = vec3(0.13, 0.55, 0.13); 
              vec3 edgeColor   = vec3(0.0, 0.25, 0.05);  
              vec3 color = mix(centerColor, edgeColor, clamp(dist, 0.0, 1.0));
              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>
      
      {/* Thin Wireframe Overlay Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshBasicMaterial wireframe={true} color="#00ff88" opacity={0.15} transparent={true} depthWrite={false} />
      </mesh>
      
      {/* Dynamic Fences arrays */}
      <instancedMesh ref={fencesRef} args={[null, null, fenceCount]}>
        <boxGeometry args={[4, 1, 0.1]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" wireframe />
      </instancedMesh>
    </group>
  );
}
