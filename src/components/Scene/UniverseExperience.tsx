"use client";

import { Canvas } from "@react-three/fiber";
import { useAmbientDrone } from "@/components/Audio/useAmbientDrone";
import { TimelineHud } from "@/components/UI/TimelineHud";
import { UniverseScene } from "@/components/Universe/UniverseScene";
import { useCosmicTimeline } from "@/hooks/useCosmicTimeline";
import { smoothstep } from "@/utils/easing";
import { useRef } from "react";

export default function UniverseExperience() {
  const containerRef = useRef<HTMLElement>(null);
  const { activeEra, progress } = useCosmicTimeline(containerRef);
  const finalBlackout = smoothstep(0.985, 1, progress);
  useAmbientDrone(progress);

  return (
    <main ref={containerRef} className="relative min-h-[1700vh] overflow-x-hidden bg-black text-white">
      <div className="fixed inset-0">
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
          <UniverseScene progress={progress} />
        </Canvas>
      </div>
      <TimelineHud activeEra={activeEra} progress={progress} />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30 bg-black transition-opacity duration-500"
        style={{ opacity: finalBlackout }}
      />
    </main>
  );
}
