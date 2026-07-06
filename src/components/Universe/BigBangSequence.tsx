"use client";

import { useFrame } from "@react-three/fiber";
import { BIG_BANG_PARTICLE_FRAGMENT, BIG_BANG_PARTICLE_VERTEX } from "@/lib/shaders";
import { clamp, smoothstep } from "@/utils/easing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type BigBangSequenceProps = {
  progress: number;
};

type BigBangParticleData = {
  colors: Float32Array;
  phases: Float32Array;
  positions: Float32Array;
  sizes: Float32Array;
  speeds: Float32Array;
};

const particlePalette = [
  new THREE.Color("#ffffff"),
  new THREE.Color("#bfeaff"),
  new THREE.Color("#5fb7ff"),
  new THREE.Color("#a986ff"),
  new THREE.Color("#ffd36d"),
  new THREE.Color("#ff8f4d"),
];

function createBigBangParticles(count: number): BigBangParticleData {
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let index = 0; index < count; index++) {
    const theta = Math.random() * Math.PI * 2;
    const z = Math.random() * 2 - 1;
    const radius = Math.sqrt(1 - z * z);
    const shellBias = 0.42 + Math.random() * 0.58;

    positions[index * 3] = Math.cos(theta) * radius * shellBias;
    positions[index * 3 + 1] = Math.sin(theta) * radius * shellBias;
    positions[index * 3 + 2] = z * shellBias;

    const color = particlePalette[Math.floor(Math.random() * particlePalette.length)];
    const heat = 0.78 + Math.random() * 0.58;
    colors[index * 3] = color.r * heat;
    colors[index * 3 + 1] = color.g * heat;
    colors[index * 3 + 2] = color.b * heat;
    phases[index] = Math.random() * Math.PI * 2;
    sizes[index] = 1.2 + Math.random() * 5.8;
    speeds[index] = 0.34 + Math.pow(Math.random(), 1.8) * 1.36;
  }

  return { colors, phases, positions, sizes, speeds };
}

function FirstSpark({ progress }: BigBangSequenceProps) {
  const ref = useRef<THREE.Mesh>(null);
  const spark = smoothstep(0.004, 0.052, progress) * (1 - smoothstep(0.16, 0.24, progress));
  const bloom = smoothstep(0.022, 0.14, progress);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const time = clock.getElapsedTime();
    ref.current.scale.setScalar(0.08 + spark * (0.38 + bloom * 2.6) + Math.sin(time * 1.6) * 0.015);
  });

  if (spark <= 0.001) return null;

  return (
    <mesh ref={ref} position={[0, 0, -34]}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshBasicMaterial
        blending={THREE.AdditiveBlending}
        color="#fff8dc"
        opacity={clamp(spark * 0.95)}
        transparent
      />
    </mesh>
  );
}

function ExpandingParticles({ progress }: BigBangSequenceProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const data = useMemo(() => createBigBangParticles(6200), []);
  const expansion = smoothstep(0.07, 0.26, progress);
  const opacity = smoothstep(0.055, 0.12, progress) * (1 - smoothstep(0.3, 0.43, progress));
  const motion = smoothstep(0.08, 0.24, progress);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fragmentShader: BIG_BANG_PARTICLE_FRAGMENT,
        transparent: true,
        uniforms: {
          uExpansion: { value: expansion },
          uMotion: { value: motion },
          uOpacity: { value: opacity },
          uTime: { value: 0 },
        },
        vertexShader: BIG_BANG_PARTICLE_VERTEX,
      }),
    [expansion, motion, opacity],
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uExpansion.value = expansion;
    materialRef.current.uniforms.uMotion.value = motion;
    materialRef.current.uniforms.uOpacity.value = opacity;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  if (opacity <= 0.001) return null;

  return (
    <points frustumCulled={false} position={[0, 0, -58]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[data.speeds, 1]} />
      </bufferGeometry>
      <primitive ref={materialRef} object={material} attach="material" />
    </points>
  );
}

function ShockwaveRings({ progress }: BigBangSequenceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const expansion = smoothstep(0.075, 0.27, progress);
  const opacity = smoothstep(0.065, 0.12, progress) * (1 - smoothstep(0.26, 0.38, progress));

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    groupRef.current.rotation.x = time * 0.045;
    groupRef.current.rotation.y = time * 0.035;
    groupRef.current.scale.setScalar(1 + expansion * 58);
  });

  if (opacity <= 0.001) return null;

  return (
    <group ref={groupRef} position={[0, 0, -54]}>
      {[
        { color: "#ffffff", radius: 1.2, rotation: [Math.PI / 2, 0, 0] as [number, number, number] },
        { color: "#6fc8ff", radius: 1.55, rotation: [0.2, Math.PI / 2, 0.4] as [number, number, number] },
        { color: "#d8a1ff", radius: 1.95, rotation: [0.9, 0.1, Math.PI / 2] as [number, number, number] },
      ].map((ring) => (
        <mesh key={ring.color} rotation={ring.rotation}>
          <torusGeometry args={[ring.radius, 0.012, 12, 160]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={ring.color}
            opacity={opacity * 0.32}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function PlasmaRibbons({ progress }: BigBangSequenceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const opacity = smoothstep(0.1, 0.2, progress) * (1 - smoothstep(0.28, 0.43, progress));
  const expansion = smoothstep(0.09, 0.3, progress);
  const curves = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const points = Array.from({ length: 12 }, (_point, pointIndex) => {
          const t = pointIndex / 11;
          const angle = t * Math.PI * 2.5 + index * 0.86;
          const radius = 1.8 + t * 5.6 + index * 0.22;

          return new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle * 0.74 + index) * radius * 0.34,
            Math.sin(angle) * radius,
          );
        });

        return new THREE.CatmullRomCurve3(points);
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.035;
    groupRef.current.rotation.z = Math.sin(time * 0.08) * 0.16;
    groupRef.current.scale.setScalar(1 + expansion * 10);
  });

  if (opacity <= 0.001) return null;

  return (
    <group ref={groupRef} position={[0, 0, -72]}>
      {curves.map((curve, index) => (
        <mesh key={index}>
          <tubeGeometry args={[curve, 80, 0.035 + index * 0.003, 8, false]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color={index % 3 === 0 ? "#fff4c8" : index % 3 === 1 ? "#76d8ff" : "#b48dff"}
            opacity={opacity * 0.28}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

export function BigBangSequence({ progress }: BigBangSequenceProps) {
  const glow = smoothstep(0.01, 0.16, progress) * (1 - smoothstep(0.28, 0.42, progress));

  return (
    <group>
      <pointLight color="#fff6dc" distance={260} intensity={glow * 10} position={[0, 0, -42]} />
      <pointLight color="#7bbfff" distance={300} intensity={glow * 4.8} position={[18, -12, -72]} />
      <FirstSpark progress={progress} />
      <ShockwaveRings progress={progress} />
      <PlasmaRibbons progress={progress} />
      <ExpandingParticles progress={progress} />
    </group>
  );
}
