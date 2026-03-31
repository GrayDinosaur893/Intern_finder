import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, GradientTexture } from '@react-three/drei';
import * as THREE from 'three';

// Individual 3D card mesh
function CardMesh({ id, position, isHovered, onHover, category }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Category-based colors
  const colors = useMemo(() => ({
    web_development: '#6366f1',
    cyber_security: '#ef4444',
    game_development: '#8b5cf6',
    app_development: '#06b6d4',
    mechanical_core: '#f59e0b',
    electrical_core: '#10b981',
    business_mgmt: '#ec4899',
  }), []);

  const cardColor = colors[category] || '#6366f1';

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const targetY = hovered ? position[1] + 0.3 : position[1];
    const targetRotX = hovered ? 0.1 : 0;
    const targetRotY = hovered ? 0.1 : 0;
    
    // Smooth interpolation
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
    
    // Subtle idle animation
    if (!hovered) {
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.001;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(id);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      {/* Card plane with glow material */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2.8, 3.5, 0.1]} />
        <MeshDistortMaterial
          color={cardColor}
          emissive={hovered ? cardColor : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
          roughness={0.3}
          metalness={0.8}
          distort={hovered ? 0.1 : 0}
          speed={2}
        />
      </mesh>
      
      {/* Edge glow */}
      {hovered && (
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[2.9, 3.6]} />
          <meshBasicMaterial
            color={cardColor}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// Particle system for effects
function CardParticles({ count = 30 }) {
  const pointsRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 2,
        ],
        speed: 0.5 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    particles.forEach((particle, i) => {
      const time = state.clock.elapsedTime * particle.speed;
      pointsRef.current.positions[i * 3] = particle.position[0] + Math.sin(time + particle.offset) * 0.2;
      pointsRef.current.positions[i * 3 + 1] = particle.position[1] + Math.cos(time * 0.5 + particle.offset) * 0.2;
      pointsRef.current.positions[i * 3 + 2] = particle.position[2] + Math.sin(time * 0.3 + particle.offset) * 0.1;
    });
    
    pointsRef.current.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.length * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#aa3bff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main scene component
function Scene({ cards, hoveredCard, onHover }) {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#aa3bff" />
      
      {/* Render cards */}
      {cards.map((card, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        return (
          <CardMesh
            key={card.id}
            id={card.id}
            position={[(col - 1) * 3.2, -(row - 1) * 4, 0]}
            isHovered={hoveredCard === card.id}
            onHover={onHover}
            category={card.category}
          />
        );
      })}
      
      {/* Subtle particle effects */}
      <CardParticles count={20} />
    </>
  );
}

// Main export component
export default function ThreeCardScene({ cards }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  // Check for WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsSupported(!!gl);
    } catch (e) {
      setIsSupported(false);
    }
  }, []);

  // Fallback for slow devices
  if (!isSupported) {
    return null;
  }

  return (
    <div className="three-card-scene-container">
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene
          cards={cards}
          hoveredCard={hoveredCard}
          onHover={setHoveredCard}
        />
      </Canvas>
    </div>
  );
}