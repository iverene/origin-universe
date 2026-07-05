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
  const introOpacity = 1 - smoothstep(0.001, 0.008, progress);
  const subtitleOpacity =
    activeEra.id === "final"
      ? smoothstep(0.08, 0.28, localProgress)
      : smoothstep(0.06, 0.2, localProgress) * (1 - smoothstep(0.68, 0.92, localProgress));
  const markerOpacity = smoothstep(0.035, 0.08, progress);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-28 bg-gradient-to-b from-black/70 via-black/24 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-56 bg-gradient-to-t from-black/78 via-black/36 to-transparent"
      />

      <div className="pointer-events-none fixed left-1/2 top-7 z-40 -translate-x-1/2 text-center md:top-9">
        <p
          className="font-science text-[0.68rem] uppercase tracking-[0.24em] text-white/72 [text-shadow:0_2px_14px_rgba(0,0,0,0.95)] md:text-xs"
          data-science-value
          style={{ opacity: markerOpacity }}
        >
          {activeEra.marker}
        </p>
      </div>

      <div
        className="pointer-events-none fixed left-1/2 top-1/2 z-40 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 px-6 text-center transition-opacity duration-500"
        style={{
          opacity: introOpacity,
          visibility: progress > 0.01 ? "hidden" : "visible",
        }}
      >
        <div className="animate-[cosmicReveal_3s_ease-out_forwards] opacity-0">
          <h1 className="font-heading text-balance text-4xl font-semibold leading-tight text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.98),0_0_34px_rgba(170,210,255,0.38)] sm:text-6xl lg:text-7xl">
            The Origin of the Universe
          </h1>
          <p className="font-body mx-auto mt-5 max-w-2xl text-sm font-medium uppercase tracking-[0.3em] text-slate-100/86 [text-shadow:0_2px_18px_rgba(0,0,0,0.98)] sm:text-base">
            A Journey Through Time and Space
          </p>
        </div>
      </div>

      <div
        className="animate-[cosmicReveal_4s_ease-out_forwards] pointer-events-none fixed bottom-12 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-4 px-6 text-center transition-opacity duration-500 md:bottom-16"
        style={{
          opacity: introOpacity,
          visibility: progress > 0.01 ? "hidden" : "visible",
        }}
      >
        <p className="font-body text-xs font-semibold uppercase tracking-[0.32em] text-sky-100 [text-shadow:0_2px_16px_rgba(0,0,0,0.95),0_0_22px_rgba(125,190,255,0.46)] sm:text-sm">
          Scroll to begin
        </p>
        <span
          aria-hidden
          className="h-10 w-px animate-[scrollPulse_1.7s_ease-in-out_infinite] bg-gradient-to-b from-sky-100 via-sky-300/80 to-transparent"
        />
      </div>

      <div className="pointer-events-none fixed bottom-10 left-1/2 z-40 w-full max-w-4xl -translate-x-1/2 px-6 text-center md:bottom-14">
        <p
          className="font-body mx-auto max-w-3xl whitespace-pre-line text-pretty text-sm font-medium leading-7 text-white/86 [text-shadow:0_2px_18px_rgba(0,0,0,0.98),0_0_30px_rgba(120,170,255,0.18)] transition-opacity duration-700 md:text-base md:leading-8"
          style={{ opacity: subtitleOpacity }}
        >
          {activeEra.subtitle}
        </p>
      </div>
    </>
  );
}
