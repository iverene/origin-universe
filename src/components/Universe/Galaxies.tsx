"use client";

import { useFrame } from "@react-three/fiber";
import { GALAXY_FRAGMENT, GALAXY_VERTEX } from "@/lib/shaders";
import { createGalaxyData } from "@/utils/pointCloudData";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type GalaxyProps = {
  opacity: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  spiral: boolean;
};

function Galaxy({ opacity, position, rotation, scale, spiral }: GalaxyProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const data = useMemo(() => createGalaxyData(spiral ? 2200 : 1500, spiral), [spiral]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uOpacity: { value: opacity }, uTime: { value: 0 } },
        vertexShader: GALAXY_VERTEX,
        fragmentShader: GALAXY_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [opacity],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = opacity;
      materialRef.current.uniforms.uTime.value = time;
    }
    if (groupRef.current) {
      groupRef.current.rotation.z = rotation[2] + Math.sin(time * 0.006) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh scale={[18, 7, 1]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={spiral ? "#ffe4bd" : "#e8d7ff"}
          depthWrite={false}
          opacity={opacity * 0.14}
          transparent
        />
      </mesh>
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

type GalaxiesProps = {
  opacity?: number;
};

export function Galaxies({ opacity = 1 }: GalaxiesProps) {
  return (
    <group>
      <Galaxy opacity={opacity} position={[-112, -26, -620]} rotation={[0.24, -0.1, -0.26]} scale={0.78} spiral />
      <Galaxy opacity={opacity} position={[118, 52, -780]} rotation={[0.1, 0.24, 0.3]} scale={1.04} spiral />
      <Galaxy
        opacity={opacity}
        position={[18, -76, -900]}
        rotation={[-0.1, 0.16, -0.08]}
        scale={1.34}
        spiral={false}
      />
      <Galaxy opacity={opacity * 0.72} position={[-210, 82, -980]} rotation={[0.45, 0.1, 0.5]} scale={0.62} spiral />
      <Galaxy opacity={opacity * 0.6} position={[220, -92, -1080]} rotation={[-0.2, 0.5, -0.35]} scale={0.74} spiral={false} />
      <Galaxy opacity={opacity * 0.52} position={[-42, 110, -1160]} rotation={[0.15, -0.45, 0.18]} scale={0.5} spiral />
    </group>
  );
}
