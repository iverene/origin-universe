"use client";

import { useFrame } from "@react-three/fiber";
import { smoothstep } from "@/utils/easing";
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
  const earthPosition = useMemo(
    () => new THREE.Vector3(Math.cos(earthAngle) * 15.5, 0, Math.sin(earthAngle) * 15.5),
    [earthAngle],
  );
  const planetData = useMemo(
    () => [
      { radius: 8.4, size: 0.35, color: "#a58b72", speed: 0.18 },
      { radius: 11.2, size: 0.46, color: "#d6b17a", speed: 0.13 },
      { radius: 15.5, size: 0.58, color: "#5e99d9", speed: 0.1 },
      { radius: 20.5, size: 0.42, color: "#bb6a54", speed: 0.075 },
      { radius: 30.5, size: 1.5, color: "#d4ad7a", speed: 0.045 },
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
      <pointLight color="#fff2cf" distance={80} intensity={5.5 * visibility} position={[0, 0, 0]} />
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial color="#ffd89a" transparent opacity={0.85 * visibility} />
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

        return (
          <mesh key={planet.radius} ref={isEarth ? earthRef : undefined} position={[x, 0, z]}>
            <sphereGeometry args={[planet.size * focusedEarthSize, 32, 32]} />
            <meshStandardMaterial
              color={planet.color}
              emissive={isEarth ? "#0a285c" : "#130d08"}
              emissiveIntensity={isEarth ? 0.28 + earthFocus * 0.4 : 0.08}
              roughness={0.72}
              transparent
              opacity={visibility}
            />
          </mesh>
        );
      })}

      {earthFocus > 0.001 ? (
        <group position={earthPosition}>
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[0.58 * (1 + earthFocus * 2.2) * 1.018, 32, 32]} />
            <meshBasicMaterial
              blending={THREE.AdditiveBlending}
              color="#ffffff"
              opacity={visibility * earthFocus * 0.16}
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
            <sphereGeometry args={[0.18 + earthFocus * 0.18, 18, 18]} />
            <meshStandardMaterial color="#c9c7bd" roughness={0.9} transparent opacity={visibility * earthFocus} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
