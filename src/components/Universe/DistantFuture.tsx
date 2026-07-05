"use client";

import { useFrame } from "@react-three/fiber";
import { smoothstep } from "@/utils/easing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type DistantFutureProps = {
  progress: number;
};

function createRemnants(count: number) {
  return Array.from({ length: count }, () => ({
    phase: Math.random() * Math.PI * 2,
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 260,
      (Math.random() - 0.5) * 120,
      -180 - Math.random() * 620,
    ),
    scale: 0.8 + Math.random() * 2.6,
  }));
}

export function DistantFuture({ progress }: DistantFutureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const photonRef = useRef<THREE.Mesh>(null);
  const remnants = useMemo(() => createRemnants(18), []);
  const future = smoothstep(0.91, 0.98, progress);
  const remnantsOpacity = smoothstep(0.9, 0.94, progress) * (1 - smoothstep(0.965, 0.995, progress));
  const photon = smoothstep(0.972, 0.995, progress);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        const remnant = remnants[index];
        child.position.x = remnant.position.x + future * (index % 2 === 0 ? 60 : -60);
        child.position.y = remnant.position.y + Math.sin(time * 0.02 + remnant.phase) * 2;
        child.scale.setScalar(remnant.scale * (1 - future * 0.35));
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = remnantsOpacity * 0.18;
      });
    }
    if (photonRef.current) {
      photonRef.current.position.x = -70 + photon * 150;
      photonRef.current.position.z = -120 + photon * 40;
      photonRef.current.scale.setScalar(0.08 + photon * 0.5);
    }
  });

  if (future <= 0.001) return null;

  return (
    <group>
      <group ref={groupRef}>
        {remnants.map((remnant, index) => (
          <mesh key={index} position={remnant.position}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshBasicMaterial color="#02030a" transparent opacity={0} />
          </mesh>
        ))}
      </group>
      <mesh ref={photonRef} position={[-70, 0, -120]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial blending={THREE.AdditiveBlending} color="#dbeaff" transparent opacity={photon * 0.7} />
      </mesh>
      <pointLight color="#dbeaff" distance={90} intensity={photon * 2.8} position={[0, 0, -100]} />
    </group>
  );
}
