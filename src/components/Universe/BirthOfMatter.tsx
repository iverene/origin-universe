"use client";

import { useFrame } from "@react-three/fiber";
import { MATTER_PARTICLE_FRAGMENT, MATTER_PARTICLE_VERTEX } from "@/lib/shaders";
import { clamp, smoothstep } from "@/utils/easing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type BirthOfMatterProps = {
  progress: number;
};

type MatterParticleData = {
  colorsCool: Float32Array;
  colorsHot: Float32Array;
  kinds: Float32Array;
  phases: Float32Array;
  positions: Float32Array;
  sizes: Float32Array;
  speeds: Float32Array;
};

type CollisionFlash = {
  color: string;
  phase: number;
  position: THREE.Vector3;
  scale: number;
};

const hotPalette = [
  new THREE.Color("#ffffff"),
  new THREE.Color("#86d9ff"),
  new THREE.Color("#b586ff"),
  new THREE.Color("#ffd07a"),
  new THREE.Color("#ff8c5a"),
];

const coolPalette = [
  new THREE.Color("#7bcfff"),
  new THREE.Color("#586cff"),
  new THREE.Color("#9d72d8"),
  new THREE.Color("#4cced3"),
  new THREE.Color("#244f9f"),
];

function createMatterParticles(count: number, spread: number, depth: number): MatterParticleData {
  const colorsCool = new Float32Array(count * 3);
  const colorsHot = new Float32Array(count * 3);
  const kinds = new Float32Array(count);
  const phases = new Float32Array(count);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let index = 0; index < count; index++) {
    const kind = Math.floor(Math.random() * 4);
    const radius = Math.sqrt(Math.random()) * spread;
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * spread * 0.92;
    const z = -Math.random() * depth - 24;

    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = z;

    const hot = hotPalette[(kind + Math.floor(Math.random() * hotPalette.length)) % hotPalette.length];
    const cool = coolPalette[(kind + Math.floor(Math.random() * coolPalette.length)) % coolPalette.length];
    const intensity = 0.78 + Math.random() * 0.52;

    colorsHot[index * 3] = hot.r * intensity;
    colorsHot[index * 3 + 1] = hot.g * intensity;
    colorsHot[index * 3 + 2] = hot.b * intensity;
    colorsCool[index * 3] = cool.r * intensity;
    colorsCool[index * 3 + 1] = cool.g * intensity;
    colorsCool[index * 3 + 2] = cool.b * intensity;

    kinds[index] = kind / 3;
    phases[index] = Math.random() * Math.PI * 2;
    sizes[index] = kind === 0 ? 1.25 + Math.random() * 2.4 : 1.8 + Math.random() * 4.8;
    speeds[index] = kind === 1 ? 1.25 + Math.random() * 0.8 : 0.45 + Math.random() * 0.9;
  }

  return { colorsCool, colorsHot, kinds, phases, positions, sizes, speeds };
}

function createCollisionFlashes(count: number): CollisionFlash[] {
  return Array.from({ length: count }, (_, index) => ({
    color: index % 3 === 0 ? "#ffffff" : index % 3 === 1 ? "#91e2ff" : "#d6a6ff",
    phase: Math.random() * Math.PI * 2,
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 130,
      (Math.random() - 0.5) * 70,
      -70 - Math.random() * 300,
    ),
    scale: 0.18 + Math.random() * 0.44,
  }));
}

function MatterParticleField({ progress }: BirthOfMatterProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const nearData = useMemo(() => createMatterParticles(2600, 92, 240), []);
  const farData = useMemo(() => createMatterParticles(4200, 260, 640), []);
  const emergence = smoothstep(0.185, 0.215, progress);
  const cooling = smoothstep(0.22, 0.285, progress);
  const fadeOut = smoothstep(0.285, 0.335, progress);
  const opacity = emergence * (1 - fadeOut);
  const flow = 1 - cooling * 0.52;
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fragmentShader: MATTER_PARTICLE_FRAGMENT,
        transparent: true,
        uniforms: {
          uCooling: { value: cooling },
          uFlow: { value: flow },
          uOpacity: { value: opacity },
          uTime: { value: 0 },
        },
        vertexShader: MATTER_PARTICLE_VERTEX,
      }),
    [cooling, flow, opacity],
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uCooling.value = cooling;
    materialRef.current.uniforms.uFlow.value = flow;
    materialRef.current.uniforms.uOpacity.value = opacity;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  if (opacity <= 0.001) return null;

  return (
    <>
      {[nearData, farData].map((data, index) => (
        <points key={index} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
            <bufferAttribute attach="attributes-aColorHot" args={[data.colorsHot, 3]} />
            <bufferAttribute attach="attributes-aColorCool" args={[data.colorsCool, 3]} />
            <bufferAttribute attach="attributes-aKind" args={[data.kinds, 1]} />
            <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
            <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
            <bufferAttribute attach="attributes-aSpeed" args={[data.speeds, 1]} />
          </bufferGeometry>
          <primitive ref={index === 0 ? materialRef : undefined} object={material} attach="material" />
        </points>
      ))}
    </>
  );
}

function MatterEnergyStreams({ progress }: BirthOfMatterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const visibility = smoothstep(0.18, 0.215, progress) * (1 - smoothstep(0.27, 0.32, progress));
  const cooling = smoothstep(0.22, 0.285, progress);
  const curves = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => {
        const points = Array.from({ length: 10 }, (_point, pointIndex) => {
          const t = pointIndex / 9;
          const angle = t * Math.PI * 2 + index * 0.7;
          const radius = 15 + index * 3.8 + Math.sin(t * Math.PI) * 16;

          return new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle * 0.62 + index) * 14,
            -40 - t * 220 - index * 10 + Math.sin(angle) * 24,
          );
        });

        return new THREE.CatmullRomCurve3(points);
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(time * 0.045) * 0.09;
    groupRef.current.rotation.y = time * (0.018 - cooling * 0.01);
  });

  if (visibility <= 0.001) return null;

  return (
    <group ref={groupRef}>
      {curves.map((curve, index) => (
        <mesh key={index}>
          <tubeGeometry args={[curve, 90, 0.04 + index * 0.002, 8, false]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={index % 3 === 0 ? "#66dbff" : index % 3 === 1 ? "#a67dff" : "#ffb263"}
            opacity={visibility * (0.2 - cooling * 0.08)}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function CollisionFlashes({ progress }: BirthOfMatterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const visibility = smoothstep(0.2, 0.225, progress) * (1 - smoothstep(0.265, 0.305, progress));
  const flashes = useMemo(() => createCollisionFlashes(24), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    groupRef.current.children.forEach((child, index) => {
      const flash = flashes[index];
      const pulse = Math.pow(clamp(Math.sin(time * 0.7 + flash.phase)), 10);
      child.scale.setScalar(flash.scale * (1 + pulse * 5) * visibility);
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = pulse * visibility * 0.52;
    });
  });

  if (visibility <= 0.001) return null;

  return (
    <group ref={groupRef}>
      {flashes.map((flash, index) => (
        <mesh key={index} position={flash.position}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial blending={THREE.AdditiveBlending} color={flash.color} transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

export function BirthOfMatter({ progress }: BirthOfMatterProps) {
  const light = smoothstep(0.19, 0.23, progress) * (1 - smoothstep(0.28, 0.33, progress));

  return (
    <group>
      <pointLight color="#8fdcff" distance={260} intensity={light * 3.4} position={[-24, 18, -120]} />
      <pointLight color="#b286ff" distance={300} intensity={light * 2.3} position={[36, -16, -220]} />
      <MatterEnergyStreams progress={progress} />
      <MatterParticleField progress={progress} />
      <CollisionFlashes progress={progress} />
    </group>
  );
}
