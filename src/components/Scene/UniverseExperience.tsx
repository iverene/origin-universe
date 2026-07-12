"use client";

import { Canvas } from "@react-three/fiber";
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
