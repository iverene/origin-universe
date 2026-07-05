"use client";

import { useFrame } from "@react-three/fiber";
import { GALAXY_FRAGMENT, GALAXY_VERTEX } from "@/lib/shaders";
import { smoothstep } from "@/utils/easing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type MilkyWayFocusProps = {
  progress: number;
};

function createMilkyWayPoints(count: number) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const core = new THREE.Color("#fff1d2");
  const armBlue = new THREE.Color("#a8cfff");
  const dustGold = new THREE.Color("#d8a46c");

  for (let index = 0; index < count; index++) {
    const radius = Math.pow(Math.random(), 1.7) * 56;
    const arm = (index % 5) * ((Math.PI * 2) / 5);
    const swirl = radius * 0.16;
    const angle = arm + swirl + (Math.random() - 0.5) * 0.44;
    const vertical = (Math.random() - 0.5) * (1.4 + radius * 0.035);

    positions[index * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2.4;
    positions[index * 3 + 1] = vertical;
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.72 + (Math.random() - 0.5) * 2.4;

    const color = core.clone().lerp(index % 4 === 0 ? dustGold : armBlue, Math.min(1, radius / 56));
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
    sizes[index] = 1.3 + Math.random() * 4.2;
  }

  return { colors, positions, sizes };
}

export function MilkyWayFocus({ progress }: MilkyWayFocusProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const data = useMemo(() => createMilkyWayPoints(2600), []);
  const visibility = smoothstep(0.61, 0.72, progress) * (1 - smoothstep(0.8, 0.9, progress));
  const approach = smoothstep(0.66, 0.78, progress);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fragmentShader: GALAXY_FRAGMENT,
        transparent: true,
        uniforms: { uOpacity: { value: visibility }, uTime: { value: 0 } },
        vertexShader: GALAXY_VERTEX,
      }),
    [visibility],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = visibility;
      materialRef.current.uniforms.uTime.value = time;
    }
    if (groupRef.current) {
      groupRef.current.position.set(12 - approach * 18, -5 + approach * 2, -340 + approach * 190);
      groupRef.current.rotation.set(0.84, 0.08 + time * 0.004, -0.38 + approach * 0.16);
      groupRef.current.scale.setScalar(2.4 - approach * 1.1);
    }
  });

  if (visibility <= 0.001) return null;

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
        </bufferGeometry>
        <primitive ref={materialRef} object={material} attach="material" />
      </points>
    </group>
  );
}
