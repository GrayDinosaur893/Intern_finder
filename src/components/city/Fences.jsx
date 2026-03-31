import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

// Pre-calculate procedural perimeter fences targeting exactly -50 to 50
const fenceData = [];
// Perimeter z = -50 and z = 50 lines
for (let x = -50; x <= 50; x += 4) {
  fenceData.push({ position: [x, 1, -50], rotation: [0, 0, 0] });
  fenceData.push({ position: [x, 1, 50], rotation: [0, 0, 0] });
}
// Perimeter x = -50 and x = 50 lines
for (let z = -46; z <= 46; z += 4) { 
  fenceData.push({ position: [-50, 1, z], rotation: [0, Math.PI / 2, 0] });
  fenceData.push({ position: [50, 1, z], rotation: [0, Math.PI / 2, 0] });
}

export default function Fences() {
  return (
    <Instances range={fenceData.length} position={[0, 0, 0]}>
      <boxGeometry args={[4, 2, 0.2]} />
      <meshStandardMaterial color="#4ade80" emissive="#16a34a" emissiveIntensity={0.5} wireframe />
      {fenceData.map((data, i) => (
        <Instance key={i} position={data.position} rotation={data.rotation} />
      ))}
    </Instances>
  );
}
