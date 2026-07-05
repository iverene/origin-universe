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
  const moonRef = useRef<THREE.Mesh>(null);
  const visibility = smoothstep(0.69, 0.78, progress) * (1 - smoothstep(0.91, 0.98, progress));
  const earthFocus = smoothstep(0.77, 0.84, progress);
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
      groupRef.current.position.z = -70 - earthFocus * 36;
      groupRef.current.position.x = 22 - earthFocus * 18;
      groupRef.current.position.y = -5 + earthFocus * 3;
      groupRef.current.rotation.y = time * 0.025;
      groupRef.current.scale.setScalar(visibility * (0.55 + earthFocus * 0.38));
    }
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.22;
    }
    if (moonRef.current) {
      moonRef.current.position.x = Math.cos(time * 0.32) * 2.5;
      moonRef.current.position.z = Math.sin(time * 0.32) * 2.5;
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

      {planetData.map((planet, index) => {
        const angle = progress * Math.PI * 18 * planet.speed + index * 1.1;
        const x = Math.cos(angle) * planet.radius;
        const z = Math.sin(angle) * planet.radius;
        const isEarth = index === 2;

        return (
          <mesh key={planet.radius} ref={isEarth ? earthRef : undefined} position={[x, 0, z]}>
            <sphereGeometry args={[planet.size * (isEarth ? 1 + earthFocus * 1.35 : 1), 32, 32]} />
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

      <mesh ref={moonRef} position={[2.5, 0.1, 0]}>
        <sphereGeometry args={[0.16 + earthFocus * 0.12, 18, 18]} />
        <meshStandardMaterial color="#c9c7bd" roughness={0.9} transparent opacity={visibility * earthFocus} />
      </mesh>
    </group>
  );
}
