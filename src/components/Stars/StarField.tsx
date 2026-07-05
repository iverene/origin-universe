"use client";

import { useFrame } from "@react-three/fiber";
import { STAR_FRAGMENT, STAR_VERTEX } from "@/lib/shaders";
import { createStarData } from "@/utils/pointCloudData";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type StarFieldProps = {
  count: number;
  depth: number;
  opacity?: number;
  spread: number;
  speed: number;
  scale: number;
};

export function StarField({ count, depth, opacity = 1, spread, speed, scale }: StarFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const data = useMemo(() => createStarData(count, depth, spread), [count, depth, spread]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uDepth: { value: depth },
          uOpacity: { value: opacity },
          uSpeed: { value: speed },
          uScale: { value: scale },
        },
        vertexShader: STAR_VERTEX,
        fragmentShader: STAR_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [depth, opacity, scale, speed],
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uOpacity.value = opacity;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
        <bufferAttribute attach="attributes-aTwinkle" args={[data.twinkles, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
      </bufferGeometry>
      <primitive ref={materialRef} object={material} attach="material" />
    </points>
  );
}
