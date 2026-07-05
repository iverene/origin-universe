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
import { Galaxies } from "@/components/Universe/Galaxies";
import { Nebulae } from "@/components/Universe/Nebulae";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

export function UniverseScene() {
  return (
    <>
      <color attach="background" args={["#000006"]} />
      <fog attach="fog" args={["#01020a", 120, 1100]} />
      <ambientLight intensity={0.12} color="#7284b8" />
      <pointLight position={[-38, 26, -80]} intensity={2.4} color="#d8e8ff" distance={260} />
      <pointLight position={[54, -30, -130]} intensity={1.2} color="#ffb38a" distance={260} />
      <LivingCamera />
      <Nebulae />
      <Galaxies />
      <StarField count={5200} depth={980} spread={360} speed={3.2} scale={1.0} />
      <StarField count={2400} depth={420} spread={180} speed={5.8} scale={0.8} />
      <DustField />
      <Asteroids />
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom intensity={0.62} luminanceThreshold={0.18} luminanceSmoothing={0.82} mipmapBlur />
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
