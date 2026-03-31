import { useRef } from 'react';
import { Html } from '@react-three/drei';
import House from './House';
import Tree from './Tree';
import Car from './Car';

function StudentObject({ student, x, z, onClick, isSelected, studentIndex }) {
  const groupRef = useRef();

  // Branch Component logic
  const normalizedBranch = (student.branch || '').toUpperCase();
  let ObjectComponent = House;
  if (normalizedBranch.includes('ECE') || normalizedBranch.includes('ELECTRONICS')) ObjectComponent = Tree;
  if (normalizedBranch.includes('ME') || normalizedBranch.includes('MECHANICAL')) ObjectComponent = Car;

  // The intricate physics (Suck-in, Shard Fragmentation, Velocity equations) are processed 
  // natively inside House.jsx/Tree.jsx/Car.jsx iteratively using studentIndex for loop staggering.

  return (
    <group ref={groupRef} onClick={() => !student.isDummy && onClick(student)}>
      <ObjectComponent
        position={[x, 0, z]}
        student={student}
        isSelected={isSelected}
        isDummy={student.isDummy}
        studentIndex={studentIndex}
      />
      
      {!student.isDummy && (
        <Html
          position={[x, 4, z]}
          center
          distanceFactor={20}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            border: isSelected ? '1px solid #aa3bff' : '1px solid rgba(255,255,255,0.2)'
          }}>
            {student.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export default StudentObject;