import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Export constants to keep House and Tornado in sync if needed, 
// though they can be hardcoded or shared.
export const ORBIT_RADIUS = 8;
export const ORBIT_SPEED = 0.5;

function Tornado({ particleCount = 3000 }) {
  const pointsRef = useRef();
  const materialRef = useRef();
  
  // Generate particle positions in a spiral/tornado shape at origin
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const sis = new Float32Array(particleCount);
    
    const color1 = new THREE.Color('#333333'); // Dark gray
    const color2 = new THREE.Color('#555555'); // Medium gray
    const color3 = new THREE.Color('#111111'); // Black
    
    for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 25; // Number of rotations
        const height = (i / particleCount) * 15; // Height from 0 to 15
        const radius = 0.5 + height * 0.3; // Radius increases with height
        const spread = Math.random() * 0.8; // Random spread
        
        const angle = t + Math.random();
        const r = radius + spread;
        
        pos[i * 3] = Math.cos(angle) * r; // x
        pos[i * 3 + 1] = height; // y
        pos[i * 3 + 2] = Math.sin(angle) * r; // z
        
        // Color gradient based on height
        const colorMix = height / 15;
        const color = color1.clone().lerp(color2, colorMix).lerp(color3, Math.sin(colorMix * Math.PI) * 0.4);
        
        cols[i * 3] = color.r;
        cols[i * 3 + 1] = color.g;
        cols[i * 3 + 2] = color.b;
        
        // Size variation
        sis[i] = 0.05 + Math.random() * 0.08;
    }
    
    return { positions: pos, colors: cols, sizes: sis };
  }, [particleCount]);
  
  useFrame((state) => {
    if (pointsRef.current) {
        // Swirl effect (self-rotation)
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        
        // Circular motion path
        const time = state.clock.elapsedTime * ORBIT_SPEED;
        pointsRef.current.position.x = ORBIT_RADIUS * Math.cos(time);
        pointsRef.current.position.z = ORBIT_RADIUS * Math.sin(time);
    }
    if (materialRef.current) {
        materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={particleCount} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.NormalBlending}
        depthWrite={false}
        uniforms={{
          time: { value: 0 },
        }}
        vertexShader={`
          attribute float size;
          varying vec3 vColor;
          uniform float time;
          
          void main() {
            vColor = color;
            vec3 pos = position;
            
            // Add subtle wave motion
            pos.x += sin(pos.y * 2.0 + time) * 0.2;
            pos.z += cos(pos.y * 2.0 + time) * 0.2;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
            float glow = 1.0 - dist * 2.0;
            gl_FragColor = vec4(vColor, alpha * glow * 0.9);
          }
        `}
      />
    </points>
  );
}

export default Tornado;
