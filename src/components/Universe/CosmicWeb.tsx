"use client";

import { useFrame } from "@react-three/fiber";
import { smoothstep } from "@/utils/easing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type CosmicWebProps = { progress: number };

function createWeb() {
  const nodes = Array.from({ length: 38 }, (_, index) => {
    const arm = index % 5;
    const distance = 20 + Math.pow(Math.random(), 0.7) * 150;
    const angle = arm * (Math.PI * 2 / 5) + distance * 0.018 + (Math.random() - 0.5) * 0.42;
    return new THREE.Vector3(
      Math.cos(angle) * distance,
      (Math.random() - 0.5) * 72,
      -310 - Math.sin(angle) * distance - Math.random() * 180,
    );
  });

  const linePoints: THREE.Vector3[] = [];
  nodes.forEach((node, index) => {
    const neighbors = nodes
      .map((candidate, candidateIndex) => ({ candidate, candidateIndex, distance: node.distanceTo(candidate) }))
      .filter(({ candidateIndex }) => candidateIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);
    neighbors.forEach(({ candidate }) => linePoints.push(node, candidate));
  });

  return { nodes, lineGeometry: new THREE.BufferGeometry().setFromPoints(linePoints) };
}

export function CosmicWeb({ progress }: CosmicWebProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, lineGeometry } = useMemo(() => createWeb(), []);
  const visibility = smoothstep(0.565, 0.605, progress) * (1 - smoothstep(0.665, 0.715, progress));
  const formation = smoothstep(0.58, 0.65, progress);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.025) * 0.08;
    groupRef.current.scale.setScalar(0.78 + formation * 0.22);
  });

  if (visibility <= 0.001) return null;

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#72b8ff" transparent opacity={visibility * 0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      {nodes.map((node, index) => (
        <group key={index} position={node} scale={0.45 + (index % 4) * 0.13}>
          <mesh>
            <sphereGeometry args={[2.2, 18, 18]} />
            <meshBasicMaterial color={index % 3 === 0 ? "#fff0cf" : "#b6d7ff"} transparent opacity={visibility * 0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh scale={3.2}>
            <sphereGeometry args={[2.2, 14, 14]} />
            <meshBasicMaterial color="#6e9cff" transparent opacity={visibility * 0.045} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
