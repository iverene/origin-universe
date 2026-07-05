"use client";

import { useFrame } from "@react-three/fiber";
import { GALAXY_FRAGMENT, GALAXY_VERTEX } from "@/lib/shaders";
import { createGalaxyData } from "@/utils/pointCloudData";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type GalaxyProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  spiral: boolean;
};

function Galaxy({ position, rotation, scale, spiral }: GalaxyProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const data = useMemo(() => createGalaxyData(spiral ? 1200 : 850, spiral), [spiral]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: GALAXY_VERTEX,
        fragmentShader: GALAXY_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
    }
    if (groupRef.current) {
      groupRef.current.rotation.z = rotation[2] + Math.sin(time * 0.006) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
        </bufferGeometry>
        <primitive ref={materialRef} object={material} attach="material" />
      </points>
    </group>
  );
}

export function Galaxies() {
  return (
    <group>
      <Galaxy position={[-112, -26, -620]} rotation={[0.24, -0.1, -0.26]} scale={0.78} spiral />
      <Galaxy position={[118, 52, -780]} rotation={[0.1, 0.24, 0.3]} scale={1.04} spiral />
      <Galaxy
        position={[18, -76, -900]}
        rotation={[-0.1, 0.16, -0.08]}
        scale={1.34}
        spiral={false}
      />
    </group>
  );
}
