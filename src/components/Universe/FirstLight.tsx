"use client";

import { useFrame } from "@react-three/fiber";
import { smoothstep } from "@/utils/easing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type FirstLightProps = {
  progress: number;
};

type CloudSeed = {
  color: string;
  phase: number;
  position: THREE.Vector3;
  scale: number;
};

function createHydrogenClouds(count: number): CloudSeed[] {
  return Array.from({ length: count }, (_, index) => ({
    color: index % 3 === 0 ? "#315c8f" : index % 3 === 1 ? "#6f558e" : "#2f7a85",
    phase: Math.random() * Math.PI * 2,
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 360,
      (Math.random() - 0.5) * 150,
      -120 - Math.random() * 620,
    ),
    scale: 14 + Math.random() * 42,
  }));
}

function HydrogenClouds({ progress }: FirstLightProps) {
  const groupRef = useRef<THREE.Group>(null);
  const clouds = useMemo(() => createHydrogenClouds(36), []);
  const firstLight = smoothstep(0.255, 0.33, progress);
  const darkAge = smoothstep(0.32, 0.42, progress);
  const fade = smoothstep(0.43, 0.54, progress);
  const opacity = (firstLight * 0.2 + darkAge * 0.34) * (1 - fade * 0.55);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, index) => {
      const cloud = clouds[index];
      child.position.x = cloud.position.x + Math.sin(time * 0.025 + cloud.phase) * 4;
      child.position.y = cloud.position.y + Math.cos(time * 0.018 + cloud.phase) * 2;
      child.rotation.y = time * 0.012 + cloud.phase;
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = opacity * (0.55 + Math.sin(time * 0.04 + cloud.phase) * 0.1);
    });
  });

  if (opacity <= 0.001) return null;

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, index) => (
        <mesh key={index} position={cloud.position} scale={[cloud.scale * 1.8, cloud.scale * 0.64, cloud.scale]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={cloud.color}
            depthWrite={false}
            opacity={opacity}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function AncientLightWaves({ progress }: FirstLightProps) {
  const groupRef = useRef<THREE.Group>(null);
  const visibility = smoothstep(0.255, 0.32, progress) * (1 - smoothstep(0.36, 0.48, progress));

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(time * 0.035) * 0.08;
    groupRef.current.scale.setScalar(1 + smoothstep(0.26, 0.36, progress) * 6);
  });

  if (visibility <= 0.001) return null;

  return (
    <group ref={groupRef} position={[0, 0, -180]}>
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} rotation={[Math.PI / 2 + index * 0.18, index * 0.5, index * 0.3]}>
          <torusGeometry args={[18 + index * 8, 0.018, 10, 180]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={index % 2 === 0 ? "#f2d6a7" : "#86cfff"}
            opacity={visibility * (0.1 - index * 0.012)}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

export function FirstLight({ progress }: FirstLightProps) {
  const glow = smoothstep(0.25, 0.34, progress) * (1 - smoothstep(0.36, 0.5, progress));

  return (
    <group>
      <pointLight color="#ead7b3" distance={420} intensity={glow * 2.6} position={[-80, 30, -240]} />
      <pointLight color="#91ceff" distance={380} intensity={glow * 1.4} position={[90, -20, -360]} />
      <AncientLightWaves progress={progress} />
      <HydrogenClouds progress={progress} />
    </group>
  );
}
