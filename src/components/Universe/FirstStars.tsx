"use client";

import { useFrame } from "@react-three/fiber";
import { clamp, smoothstep } from "@/utils/easing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type FirstStarsProps = {
  progress: number;
};

type StellarSeed = {
  color: string;
  igniteAt: number;
  phase: number;
  position: THREE.Vector3;
  size: number;
};

const protostars: Array<{ color: string; position: [number, number, number]; scale: number }> = [
  { color: "#b9dcff", position: [-34, 14, -175], scale: 1.2 },
  { color: "#fff0c7", position: [48, -18, -235], scale: 0.9 },
  { color: "#ffd1a0", position: [8, 26, -310], scale: 1.45 },
];

function createStellarSeeds(count: number): StellarSeed[] {
  return Array.from({ length: count }, (_, index) => ({
    color: index % 5 === 0 ? "#9dd8ff" : index % 5 === 1 ? "#fff5d6" : index % 5 === 2 ? "#ffc987" : "#dbefff",
    igniteAt: 0.405 + Math.random() * 0.115,
    phase: Math.random() * Math.PI * 2,
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 280,
      (Math.random() - 0.5) * 120,
      -130 - Math.random() * 540,
    ),
    size: 0.26 + Math.random() * 1.35,
  }));
}

export function FirstStars({ progress }: FirstStarsProps) {
  const starsRef = useRef<THREE.Group>(null);
  const seeds = useMemo(() => createStellarSeeds(120), []);
  const nursery = smoothstep(0.38, 0.48, progress) * (1 - smoothstep(0.6, 0.72, progress));

  useFrame(({ clock }) => {
    if (!starsRef.current) return;
    const time = clock.getElapsedTime();

    starsRef.current.children.forEach((child, index) => {
      const seed = seeds[index];
      if (!seed) return;

      const ignition = smoothstep(seed.igniteAt, seed.igniteAt + 0.045, progress);
      const twinkle = 0.76 + Math.sin(time * (0.8 + index * 0.01) + seed.phase) * 0.22;
      child.scale.setScalar(seed.size * (0.2 + ignition * 2.8) * twinkle);
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = clamp(ignition * nursery);
    });
  });

  if (nursery <= 0.001) return null;

  return (
    <group>
      <group ref={starsRef}>
        {seeds.map((seed, index) => (
          <mesh key={index} position={seed.position}>
            <sphereGeometry args={[1, 18, 18]} />
            <meshBasicMaterial blending={THREE.AdditiveBlending} color={seed.color} transparent opacity={0} />
          </mesh>
        ))}
      </group>
      {protostars.map((star, index) => {
        const ignition = smoothstep(0.415 + index * 0.018, 0.455 + index * 0.018, progress);
        return (
          <group key={star.color} position={star.position} scale={star.scale * ignition}>
            <mesh>
              <sphereGeometry args={[1.15, 48, 48]} />
              <meshBasicMaterial color={star.color} />
            </mesh>
            <mesh scale={2.6}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshBasicMaterial blending={THREE.AdditiveBlending} color={star.color} depthWrite={false} opacity={nursery * 0.12} transparent />
            </mesh>
            <mesh rotation={[Math.PI / 2.5, 0.25 * index, 0]}>
              <ringGeometry args={[1.7, 5.8, 128]} />
              <meshBasicMaterial blending={THREE.AdditiveBlending} color={index === 0 ? "#86baff" : "#e3a76e"} depthWrite={false} opacity={nursery * 0.22} side={THREE.DoubleSide} transparent />
            </mesh>
            <pointLight color={star.color} distance={75} intensity={ignition * nursery * 5} />
          </group>
        );
      })}
      <pointLight color="#dbeeff" distance={360} intensity={nursery * 3.4} position={[-30, 22, -180]} />
      <pointLight color="#ffd49a" distance={300} intensity={nursery * 1.8} position={[66, -28, -280]} />
    </group>
  );
}
