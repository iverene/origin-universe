"use client";

import { AdaptiveDpr } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { LivingCamera } from "@/components/Camera/LivingCamera";
import { DustField } from "@/components/Particles/DustField";
import { StarField } from "@/components/Stars/StarField";
import { Asteroids } from "@/components/Universe/Asteroids";
import { BigBangSequence } from "@/components/Universe/BigBangSequence";
import { Galaxies } from "@/components/Universe/Galaxies";
import { Nebulae } from "@/components/Universe/Nebulae";
import { SolarSystem } from "@/components/Universe/SolarSystem";
import { smoothstep } from "@/utils/easing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

type UniverseSceneProps = {
  progress: number;
};

export function UniverseScene({ progress }: UniverseSceneProps) {
  const firstLight = smoothstep(0.06, 0.28, progress);
  const matter = smoothstep(0.16, 0.32, progress);
  const firstStars = smoothstep(0.38, 0.5, progress);
  const galaxies = smoothstep(0.48, 0.64, progress);
  const solar = smoothstep(0.69, 0.78, progress);
  const farFuture = smoothstep(0.9, 1, progress);
  const blackout = smoothstep(0.975, 1, progress);
  const bigBangBloom = smoothstep(0.07, 0.2, progress) * (1 - smoothstep(0.29, 0.42, progress));
  const starOpacity = firstStars * (1 - farFuture * 0.82);
  const dustOpacity = matter * 0.86 * (1 - farFuture * 0.45);
  const nebulaOpacity = smoothstep(0.25, 0.54, progress) * (1 - farFuture * 0.76);
  const galaxyOpacity = galaxies * (1 - farFuture * 0.55);
  const asteroidOpacity = solar * (1 - smoothstep(0.9, 0.98, progress));

  return (
    <>
      <color attach="background" args={[firstLight < 0.08 ? "#000000" : "#000006"]} />
      <fog attach="fog" args={["#01020a", 120, 1100]} />
      <ambientLight intensity={firstLight * 0.11} color="#7284b8" />
      <pointLight position={[-38, 26, -80]} intensity={(0.4 + galaxies * 2.1) * (1 - blackout)} color="#d8e8ff" distance={260} />
      <pointLight position={[54, -30, -130]} intensity={(0.2 + nebulaOpacity * 1.3) * (1 - blackout)} color="#ffb38a" distance={260} />
      <LivingCamera progress={progress} />
      <BigBangSequence progress={progress} />
      <Nebulae opacity={nebulaOpacity} />
      <Galaxies opacity={galaxyOpacity} />
      <StarField count={5200} depth={980} opacity={starOpacity} spread={360} speed={3.2 + progress * 3.8} scale={1.0} />
      <StarField count={2400} depth={420} opacity={starOpacity * 0.85} spread={180} speed={5.8 + progress * 4.8} scale={0.8} />
      <DustField opacity={dustOpacity} />
      <Asteroids opacity={asteroidOpacity} />
      <SolarSystem progress={progress} />
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom intensity={(bigBangBloom * 1.25 + firstLight * 0.24 + nebulaOpacity * 0.18) * (1 - blackout)} luminanceThreshold={0.13} luminanceSmoothing={0.84} mipmapBlur />
        <DepthOfField focusDistance={0.025} focalLength={0.028} bokehScale={1.1} height={540} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.00035, 0.00022)}
          radialModulation={false}
        />
        <Vignette offset={0.18} darkness={0.72} eskil={false} />
      </EffectComposer>
      <AdaptiveDpr pixelated />
    </>
  );
}
