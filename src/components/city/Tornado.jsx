import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TornadoState } from './TornadoManager';

const TORNADO_HEIGHT = 18;
const MIN_RADIUS = 0.2;
const MAX_RADIUS = 12;
const ROTATION_SPEED = 2.5;

const PALETTE = [
  new THREE.Color("#ffffff"),
  new THREE.Color("#00ffff"),
  new THREE.Color("#ff00ff"),
  new THREE.Color("#ffaa00"),
  new THREE.Color("#aa00ff")
];

function ChaoticParticleSystem({ N, isDebris }) {
  const pointsRef = useRef();
  const frameCount = useRef(0);

  const [positions, colors, sizes, meta] = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const sis = new Float32Array(N);
    const m = [];

    for (let i = 0; i < N; i++) {
        // CHAOS RAW NUMBERS
        const noiseOffset = Math.random() * 100;
        const radiusJitter = isDebris ? (Math.random() * 12 - 6) : (Math.random() * 4 - 2);
        const heightJitter = Math.random() * 0.8 - 0.4;
        const speedMult = 0.5 + Math.random() * 2.0;
        const angleDrift = Math.random() * Math.PI * 2;
        const verticalDrift = Math.random() * 0.3;
        const isEjected = !isDebris && Math.random() < 0.3; // 30% are ejected on main funnel
        const ejectHeightStatic = Math.random() * TORNADO_HEIGHT;

        m.push({
            noiseOffset,
            radiusJitter,
            heightJitter,
            speedMult,
            angleDrift,
            verticalDrift,
            isEjected,
            ejectHeightStatic
        });

        // Initialize Random Palette Color
        const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        col[i * 3]     = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;

        // Visual Size Array
        sis[i] = 0.1 + Math.random() * 0.5;
    }
    return [pos, col, sis, m];
  }, [N, isDebris]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    // RAW TORNADO POSITION EVERY FRAME
    const t = clock.getElapsedTime();
    const tx = 35 * Math.sin(t * 0.4);
    const tz = 35 * Math.sin(t * 0.2);
    
    window.tornadoPos = { x: tx, y: 0, z: tz };
    const tornado = window.tornadoPos;
    
    const positionsArray = pointsRef.current.geometry.attributes.position.array;
    const colorsArray = pointsRef.current.geometry.attributes.color.array;

    for (let i = 0; i < N; i++) {
        const {
            noiseOffset,
            radiusJitter,
            heightJitter,
            speedMult,
            angleDrift,
            verticalDrift,
            isEjected,
            ejectHeightStatic
        } = meta[i];

        const baseHeight = (i / N) * TORNADO_HEIGHT;
        const baseRadius = MIN_RADIUS + (baseHeight / TORNADO_HEIGHT) * (MAX_RADIUS - MIN_RADIUS);

        let r, h, angle;

        if (isEjected) {
            const ejectRadius = baseRadius + 3 + Math.sin(t * speedMult) * 5;
            r = Math.max(ejectRadius, 0.1);
            h = ejectHeightStatic;
            angle = angleDrift + t * speedMult * ROTATION_SPEED + Math.sin(t * 0.8 + noiseOffset) * 0.5;
        } else {
            const turbulence = Math.sin(t * speedMult * 3.0 + noiseOffset) * 2.5
                             + Math.cos(t * speedMult * 1.7 + noiseOffset * 0.5) * 1.5;
            
            r = Math.max(baseRadius + radiusJitter + turbulence, 0.1);
            h = baseHeight + heightJitter + Math.sin(t * verticalDrift * 2.0 + noiseOffset) * 1.2;
            angle = angleDrift + t * speedMult * ROTATION_SPEED + Math.sin(t * 0.8 + noiseOffset) * 0.5;
        }

        positionsArray[i * 3]     = tornado.x + r * Math.cos(angle);
        positionsArray[i * 3 + 1] = tornado.y + Math.max(0, Math.min(h, TORNADO_HEIGHT + 2)); // clamped
        positionsArray[i * 3 + 2] = tornado.z + r * Math.sin(angle);
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // VISUAL FLICKER - every 20 frames randomly reassign 10% particles
    frameCount.current++;
    if (frameCount.current % 20 === 0) {
        let colorsUpdated = false;
        for (let i = 0; i < N; i++) {
            if (Math.random() < 0.1) {
                const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
                colorsArray[i * 3]     = c.r;
                colorsArray[i * 3 + 1] = c.g;
                colorsArray[i * 3 + 2] = c.b;
                colorsUpdated = true;
            }
        }
        if (colorsUpdated) {
            pointsRef.current.geometry.attributes.color.needsUpdate = true;
        }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={N} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={N} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={N} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial 
          size={isDebris ? 0.2 : 0.3} 
          sizeAttenuation 
          vertexColors 
          transparent={true} 
          depthTest={false} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Tornado() {
  return (
    <group>
      <ChaoticParticleSystem N={2000} isDebris={false} />
      {/* 400 debris particles with massive +/- 6 jitter overrides built into the class internally */}
      <ChaoticParticleSystem N={400} isDebris={true} />
    </group>
  );
}