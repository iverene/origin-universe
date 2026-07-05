"use client";

import { Canvas } from "@react-three/fiber";
import { useAmbientDrone } from "@/components/Audio/useAmbientDrone";
import { IntroOverlay } from "@/components/UI/IntroOverlay";
import { UniverseScene } from "@/components/Universe/UniverseScene";
import { useLenisAndScrollFade } from "@/hooks/useLenisAndScrollFade";

export default function UniverseExperience() {
  const uiHidden = useLenisAndScrollFade();
  useAmbientDrone();

  return (
    <main className="relative min-h-[190vh] overflow-x-hidden bg-black text-white">
      <div className="fixed inset-0">
        <div className="absolute inset-0 z-[1] animate-[blackAwakening_6s_ease-out_forwards] bg-black" />
        <Canvas
          camera={{ position: [0, 0, 18], fov: 72, near: 0.1, far: 1400 }}
          dpr={[1, 1.75]}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
        >
          <UniverseScene />
        </Canvas>
      </div>
      <IntroOverlay hidden={uiHidden} />
      <div aria-hidden className="absolute bottom-0 h-20 w-full bg-gradient-to-b from-transparent to-black/70" />
    </main>
  );
}
