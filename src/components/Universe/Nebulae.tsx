"use client";

import { useFrame } from "@react-three/fiber";
import { NEBULA_FRAGMENT, NEBULA_VERTEX } from "@/lib/shaders";
import { nebulaConfigs, type NebulaConfig } from "@/lib/universeConfig";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function NebulaLayer({ config, opacity }: { config: NebulaConfig; opacity: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color(config.colors[0]) },
          uColorB: { value: new THREE.Color(config.colors[1]) },
          uColorC: { value: new THREE.Color(config.colors[2]) },
          uOpacity: { value: config.opacity * opacity },
          uSeed: { value: config.seed },
          uDrift: { value: config.drift },
        },
        vertexShader: NEBULA_VERTEX,
        fragmentShader: NEBULA_FRAGMENT,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    [config, opacity],
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uOpacity.value = config.opacity * opacity;
    }
  });

  return (
    <mesh position={config.position} rotation={config.rotation} scale={config.scale}>
      <planeGeometry args={[1, 1, 96, 96]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}

type NebulaeProps = {
  opacity?: number;
};

export function Nebulae({ opacity = 1 }: NebulaeProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.x = Math.sin(time * 0.012) * 4;
      groupRef.current.position.y = Math.cos(time * 0.01) * 2.2;
    }
  });

  return (
    <group ref={groupRef}>
      {nebulaConfigs.map((config) => (
        <NebulaLayer key={config.seed} config={config} opacity={opacity} />
      ))}
    </group>
  );
}
