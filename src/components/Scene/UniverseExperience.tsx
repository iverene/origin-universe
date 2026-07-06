"use client";

import { Canvas } from "@react-three/fiber";
import { useAmbientDrone } from "@/components/Audio/useAmbientDrone";
import { TimelineHud } from "@/components/UI/TimelineHud";
import { UniverseScene } from "@/components/Universe/UniverseScene";
import { useCosmicTimeline } from "@/hooks/useCosmicTimeline";
import { smoothstep } from "@/utils/easing";
import { useRef } from "react";

let threeClockWarningFilterInstalled = false;

function suppressR3fClockDeprecationWarning() {
  if (threeClockWarningFilterInstalled || typeof window === "undefined") {
    return;
  }

  threeClockWarningFilterInstalled = true;
  const warn = console.warn.bind(console);

  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("THREE.Clock: This module has been deprecated")
    ) {
      return;
    }

    warn(...args);
  };
}

export default function UniverseExperience() {
  suppressR3fClockDeprecationWarning();
  const containerRef = useRef<HTMLElement>(null);
  const { activeEra, progress } = useCosmicTimeline(containerRef);
  const finalBlackout = smoothstep(0.985, 1, progress);
  const { isAudioReady, unlockAudio } = useAmbientDrone(progress);

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
      {!isAudioReady && (
        <button
          aria-label="Enable audio"
          className="font-body pointer-events-auto fixed right-5 top-5 z-50 rounded border border-white/18 bg-black/54 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/88 shadow-[0_0_24px_rgba(80,150,255,0.18)] backdrop-blur transition hover:border-sky-200/45 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-200/50"
          type="button"
          onClick={() => void unlockAudio()}
          onPointerDown={() => void unlockAudio()}
        >
          Enable audio
        </button>
      )}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30 bg-black transition-opacity duration-500"
        style={{ opacity: finalBlackout }}
      />
    </main>
  );
}
