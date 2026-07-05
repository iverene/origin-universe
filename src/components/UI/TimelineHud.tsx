"use client";

import { type CosmicEra, getNextEraStart } from "@/lib/timeline";
import { clamp, smoothstep } from "@/utils/easing";

type TimelineHudProps = {
  activeEra: CosmicEra;
  progress: number;
};

export function TimelineHud({ activeEra, progress }: TimelineHudProps) {
  const nextStart = getNextEraStart(activeEra);
  const eraLength = Math.max(0.001, nextStart - activeEra.start);
  const localProgress = clamp((progress - activeEra.start) / eraLength);
  const subtitleOpacity =
    activeEra.id === "final"
      ? smoothstep(0.08, 0.28, localProgress)
      : smoothstep(0.06, 0.2, localProgress) * (1 - smoothstep(0.68, 0.92, localProgress));
  const markerOpacity = smoothstep(0.035, 0.08, progress);

  return (
    <>
      <div className="pointer-events-none fixed left-1/2 top-7 z-40 -translate-x-1/2 text-center md:top-9">
        <p
          className="font-science text-[0.68rem] uppercase tracking-[0.24em] text-white/52 md:text-xs"
          data-science-value
          style={{ opacity: markerOpacity }}
        >
          {activeEra.marker}
        </p>
      </div>

      <div className="pointer-events-none fixed bottom-10 left-1/2 z-40 w-full max-w-4xl -translate-x-1/2 px-6 text-center md:bottom-14">
        <p
          className="font-body mx-auto max-w-3xl whitespace-pre-line text-pretty text-sm leading-7 text-white/72 transition-opacity duration-700 md:text-base md:leading-8"
          style={{ opacity: subtitleOpacity }}
        >
          {activeEra.subtitle}
        </p>
      </div>
    </>
  );
}
