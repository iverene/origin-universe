"use client";

import { useFrame } from "@react-three/fiber";
import { smoothstep } from "@/utils/easing";
import { useRef } from "react";
import * as THREE from "three";

type BirthEnergyProps = {
  progress: number;
};

export function BirthEnergy({ progress }: BirthEnergyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const opacity = smoothstep(0.014, 0.078, progress) * (1 - smoothstep(0.22, 0.34, progress));

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (groupRef.current) {
      const scale = 1 + smoothstep(0.032, 0.18, progress) * 45;
      groupRef.current.scale.setScalar(scale);
      groupRef.current.rotation.x = time * 0.08;
      groupRef.current.rotation.y = time * 0.11;
    }
  });

  if (opacity <= 0.001) {
    return null;
  }

  return (
    <group ref={groupRef} position={[0, 0, -42]}>
      <pointLight color="#ffd8b0" distance={180} intensity={opacity * 8} />
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#fff2ce" transparent opacity={opacity * 0.44} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.018, 12, 120]} />
        <meshBasicMaterial color="#7fd8ff" transparent opacity={opacity * 0.34} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.72, 0.014, 12, 120]} />
        <meshBasicMaterial color="#d58cff" transparent opacity={opacity * 0.26} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
