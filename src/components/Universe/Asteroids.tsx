"use client";

import { useFrame } from "@react-three/fiber";
import { randomBetween } from "@/utils/random";
import { createRockTexture } from "@/utils/proceduralTextures";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type AsteroidsProps = {
  opacity?: number;
};

export function Asteroids({ opacity = 1 }: AsteroidsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const rockMap = useMemo(() => createRockTexture(44), []);
  const asteroids = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        color: new THREE.Color("#8b8275").lerp(
          new THREE.Color("#4f4a46"),
          randomBetween(0, 0.72),
        ),
        position: new THREE.Vector3(
          randomBetween(-62, 62),
          randomBetween(-34, 34),
          -randomBetween(48, 230),
        ),
        rotation: new THREE.Euler(
          randomBetween(0, Math.PI),
          randomBetween(0, Math.PI),
          randomBetween(0, Math.PI),
        ),
        drift: new THREE.Vector3(
          randomBetween(-0.018, 0.018),
          randomBetween(-0.012, 0.012),
          randomBetween(0.18, 0.42),
        ),
        spin: new THREE.Vector3(
          randomBetween(-0.12, 0.12),
          randomBetween(-0.1, 0.1),
          randomBetween(-0.08, 0.08),
        ),
        scale: randomBetween(0.14, 0.54),
      })),
    [],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    asteroids.forEach((asteroid, index) => {
      mesh.setColorAt(index, asteroid.color);
    });
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [asteroids]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    asteroids.forEach((asteroid, index) => {
      asteroid.position.addScaledVector(asteroid.drift, delta);
      asteroid.rotation.x += asteroid.spin.x * delta;
      asteroid.rotation.y += asteroid.spin.y * delta;
      asteroid.rotation.z += asteroid.spin.z * delta;

      if (asteroid.position.z > 16) {
        asteroid.position.z = -randomBetween(150, 260);
        asteroid.position.x = randomBetween(-64, 64);
        asteroid.position.y = randomBetween(-38, 38);
      }

      dummy.position.copy(asteroid.position);
      dummy.rotation.copy(asteroid.rotation);
      dummy.scale.setScalar(asteroid.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, asteroids.length]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color="#8a8175"
        emissive="#090807"
        emissiveIntensity={0.025}
        flatShading
        map={rockMap}
        metalness={0.02}
        opacity={opacity}
        roughness={0.98}
        transparent
        vertexColors
      />
    </instancedMesh>
  );
}
