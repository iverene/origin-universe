"use client";

import { useFrame } from "@react-three/fiber";
import { smoothstep } from "@/utils/easing";
import { createEarthMaps, createMoonMaps } from "@/utils/proceduralTextures";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type SolarSystemProps = {
  progress: number;
};

export function SolarSystem({ progress }: SolarSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const auroraRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const visibility = smoothstep(0.69, 0.78, progress) * (1 - smoothstep(0.91, 0.98, progress));
  const diskVisibility = smoothstep(0.69, 0.74, progress) * (1 - smoothstep(0.78, 0.84, progress));
  const earthFocus = smoothstep(0.77, 0.84, progress);
  const earthAngle = progress * Math.PI * 18 * 0.1 + 2.2;
  const earthMaps = useMemo(() => createEarthMaps(), []);
  const moonMaps = useMemo(() => createMoonMaps(), []);
  const earthPosition = useMemo(
    () => new THREE.Vector3(Math.cos(earthAngle) * 15.5, 0, Math.sin(earthAngle) * 15.5),
    [earthAngle],
  );
  const planetData = useMemo(
    () => [
      { radius: 8.4, size: 0.35, color: "#8f8175", emissive: "#160f0a", roughness: 0.86, speed: 0.18 },
      { radius: 11.2, size: 0.46, color: "#d1b37c", emissive: "#1b1208", roughness: 0.94, speed: 0.13 },
      { radius: 15.5, size: 0.58, color: "#ffffff", emissive: "#071a3f", roughness: 0.58, speed: 0.1 },
      { radius: 20.5, size: 0.42, color: "#b2644f", emissive: "#180905", roughness: 0.88, speed: 0.075 },
      { radius: 30.5, size: 1.5, color: "#d8b27c", emissive: "#1a1107", roughness: 0.82, speed: 0.045 },
    ],
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (groupRef.current) {
      const cameraZ = 18 - progress * 180;
      groupRef.current.position.z = cameraZ - 82 + earthFocus * 22;
      groupRef.current.position.x = 22 - earthFocus * 18;
      groupRef.current.position.y = -5 + earthFocus * 3;
      groupRef.current.rotation.y = time * 0.014 * (1 - earthFocus * 0.7);
      groupRef.current.scale.setScalar(visibility * (0.72 + earthFocus * 0.72));
    }
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.22;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.3;
    }
    if (auroraRef.current) {
      auroraRef.current.rotation.z = time * 0.12;
      const material = auroraRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = visibility * earthFocus * (0.08 + Math.sin(time * 1.3) * 0.025);
    }
    if (moonRef.current) {
      moonRef.current.position.x = Math.cos(time * 0.32) * (2.6 + earthFocus * 0.8);
      moonRef.current.position.z = Math.sin(time * 0.32) * (2.6 + earthFocus * 0.8);
    }
  });

  if (visibility <= 0.001) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <pointLight color="#fff0c6" distance={92} intensity={7.8 * visibility} position={[0, 0, 0]} />
      <directionalLight color="#fff6dc" intensity={2.1 * visibility} position={[-12, 5, 8]} />
      <mesh>
        <sphereGeometry args={[2.3, 64, 64]} />
        <meshBasicMaterial color="#fff0bd" transparent opacity={0.96 * visibility} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.76, 64, 64]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#ffb65a"
          depthWrite={false}
          opacity={0.18 * visibility}
          transparent
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[12.5, 0.12, 12, 180]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#d6a978"
          opacity={diskVisibility * 0.22}
          transparent
        />
      </mesh>

      {planetData.map((planet, index) => {
        const angle = progress * Math.PI * 18 * planet.speed + index * 1.1;
        const x = Math.cos(angle) * planet.radius;
        const z = Math.sin(angle) * planet.radius;
        const isEarth = index === 2;
        const focusedEarthSize = isEarth ? 1 + earthFocus * 2.2 : 1;
        const planetScale = planet.size * focusedEarthSize;

        return (
          <mesh key={planet.radius} ref={isEarth ? earthRef : undefined} position={[x, 0, z]}>
            <sphereGeometry args={[planetScale, 64, 64]} />
            <meshStandardMaterial
              color={planet.color}
              emissive={planet.emissive}
              emissiveIntensity={isEarth ? 0.1 + earthFocus * 0.12 : 0.045}
              map={isEarth ? earthMaps.colorMap : undefined}
              bumpMap={isEarth ? earthMaps.bumpMap : undefined}
              bumpScale={isEarth ? 0.08 + earthFocus * 0.05 : 0}
              metalness={0}
              roughness={planet.roughness}
              transparent
              opacity={visibility}
            />
            {index === 4 ? (
              <mesh rotation={[Math.PI / 2.35, 0.24, 0.1]}>
                <ringGeometry args={[planetScale * 1.35, planetScale * 1.95, 128]} />
                <meshBasicMaterial
                  blending={THREE.AdditiveBlending}
                  color="#d7bc8e"
                  depthWrite={false}
                  opacity={visibility * 0.28}
                  side={THREE.DoubleSide}
                  transparent
                />
              </mesh>
            ) : null}
          </mesh>
        );
      })}

      {earthFocus > 0.001 ? (
        <group position={earthPosition}>
          <mesh>
            <sphereGeometry args={[0.58 * (1 + earthFocus * 2.2) * 1.035, 64, 64]} />
            <meshBasicMaterial
              blending={THREE.AdditiveBlending}
              color="#79c7ff"
              depthWrite={false}
              opacity={visibility * earthFocus * 0.11}
              side={THREE.BackSide}
              transparent
            />
          </mesh>
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[0.58 * (1 + earthFocus * 2.2) * 1.022, 64, 64]} />
            <meshBasicMaterial
              blending={THREE.AdditiveBlending}
              color="#ffffff"
              depthWrite={false}
              map={earthMaps.cloudMap}
              opacity={visibility * earthFocus * 0.42}
              transparent
            />
          </mesh>
          <mesh ref={auroraRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.98 * (1 + earthFocus * 1.1), 0.015, 8, 96]} />
            <meshBasicMaterial blending={THREE.AdditiveBlending} color="#68ffc8" transparent opacity={0} />
          </mesh>
          <mesh rotation={[0.3, 0.9, 0.1]}>
            <torusGeometry args={[0.72 * (1 + earthFocus * 1.2), 0.006, 8, 72]} />
            <meshBasicMaterial
              blending={THREE.AdditiveBlending}
              color="#ffd38a"
              opacity={visibility * earthFocus * 0.08}
              transparent
            />
          </mesh>
          <mesh ref={moonRef} position={[2.5, 0.1, 0]}>
            <sphereGeometry args={[0.18 + earthFocus * 0.18, 48, 48]} />
            <meshStandardMaterial
              bumpMap={moonMaps.bumpMap}
              bumpScale={0.04}
              color="#d4d0c6"
              map={moonMaps.colorMap}
              roughness={0.96}
              transparent
              opacity={visibility * earthFocus}
            />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
