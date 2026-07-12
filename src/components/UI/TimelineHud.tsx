"use client";

import { cosmicEras, type CosmicEra, getNextEraStart } from "@/lib/timeline";
import { clamp, smoothstep } from "@/utils/easing";
import type { CSSProperties } from "react";

const transitionByEra: Record<string, string> = {
  "before-everything": "era-void",
  "big-bang": "era-impact",
  inflation: "era-stretch",
  "birth-of-matter": "era-particles",
  "first-atoms": "era-focus",
  "dark-ages": "era-eclipse",
  "first-stars": "era-ignite",
  galaxies: "era-orbit",
  "galaxy-clusters": "era-depth",
  "milky-way": "era-sweep",
  "solar-system": "era-orbit",
  earth: "era-focus",
  life: "era-rise",
  today: "era-impact",
  "beyond-humanity": "era-stretch",
  "far-future": "era-eclipse",
  final: "era-final",
};

type TimelineHudProps = {
  activeEra: CosmicEra;
  progress: number;
};

export function TimelineHud({ activeEra, progress }: TimelineHudProps) {
  const nextStart = getNextEraStart(activeEra);
  const eraLength = Math.max(0.001, nextStart - activeEra.start);
  const localProgress = clamp((progress - activeEra.start) / eraLength);
  const introOpacity = 1 - smoothstep(0, 0.004, progress);
  const subtitleOpacity =
    activeEra.id === "final"
      ? smoothstep(0.04, 0.16, localProgress)
      : smoothstep(0.015, 0.1, localProgress) * (1 - smoothstep(0.72, 0.94, localProgress));
  const markerOpacity = smoothstep(0.006, 0.02, progress);
  const progressIndicatorOpacity = smoothstep(0.002, 0.012, progress);
  const lines = activeEra.subtitle.split("\n").filter(Boolean);
  const activeEraIndex = cosmicEras.findIndex((era) => era.id === activeEra.id);
  const chapterName = activeEra.id.replaceAll("-", " ");
  const progressPercent = Math.round(progress * 100);

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
      <div aria-hidden className="cosmic-horizon pointer-events-none fixed inset-0 z-20" />

      <div
        className="cosmic-progress pointer-events-none fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-700 md:block"
        role="progressbar"
        aria-label={`Cosmic journey: ${chapterName}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
        aria-hidden={progressIndicatorOpacity === 0}
        style={{
          opacity: progressIndicatorOpacity,
          visibility: progressIndicatorOpacity === 0 ? "hidden" : "visible",
        }}
      >
        <div className="mb-5">
          <div>
            <p className="font-science text-[0.56rem] uppercase tracking-[0.28em] text-sky-200/65">Cosmic journey</p>
            <p className="font-heading mt-1 max-w-36 text-sm font-medium capitalize leading-tight text-white/95">{chapterName}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative h-56 w-1.5 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
            <span className="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-white via-sky-200 to-cyan-400 shadow-[0_0_16px_rgba(125,211,252,.9)] transition-[height] duration-150" style={{ height: `${progressPercent}%` }} />
          </div>
          <div className="flex h-56 flex-col justify-between py-0.5">
            {cosmicEras.map((era, index) => (
              <span
                key={era.id}
                className={`block h-px transition-all duration-300 ${index === activeEraIndex ? "w-5 bg-sky-200 shadow-[0_0_8px_#7dd3fc]" : index < activeEraIndex ? "w-3 bg-white/45" : "w-2 bg-white/20"}`}
              />
            ))}
          </div>
        </div>


      </div>

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
          visibility: progress > 0.006 ? "hidden" : "visible",
        }}
      >
        <div className="cosmic-text-reveal opacity-0">
          <h1 className="font-heading text-balance text-4xl font-semibold leading-tight text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.98),0_0_34px_rgba(170,210,255,0.38)] sm:text-6xl lg:text-7xl">
            The Origin of the Universe
          </h1>
          <p className="font-body mx-auto mt-5 max-w-2xl text-sm font-medium uppercase tracking-[0.3em] text-slate-100/86 [text-shadow:0_2px_18px_rgba(0,0,0,0.98)] sm:text-base">
            A Journey Through Time and Space
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none fixed bottom-12 left-1/2 z-40 -translate-x-1/2 px-6 text-center transition-opacity duration-500 md:bottom-16"
        style={{
          opacity: introOpacity,
          visibility: progress > 0.006 ? "hidden" : "visible",
        }}
      >
        <div className="cosmic-scroll-reveal flex flex-col items-center gap-4">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.32em] text-sky-100 [text-shadow:0_2px_16px_rgba(0,0,0,0.95),0_0_22px_rgba(125,190,255,0.46)] sm:text-sm">
            Scroll to begin
          </p>
          <span
            aria-hidden
            className="h-10 w-px animate-[scrollPulse_1.7s_ease-in-out_infinite] bg-gradient-to-b from-sky-100 via-sky-300/80 to-transparent"
          />
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center overflow-hidden px-6 pb-10 sm:pb-12 md:pb-16">
        <div
          key={activeEra.id}
          className={`era-story ${transitionByEra[activeEra.id] ?? "era-rise"} w-full max-w-3xl`}
          style={{ opacity: subtitleOpacity }}
        >
          <div className="era-story__frame">
            <p className="font-heading text-balance text-lg font-medium leading-[1.3] text-white/92 [text-shadow:0_3px_20px_rgba(0,0,0,1),0_0_30px_rgba(130,190,255,.2)] sm:text-2xl md:text-3xl">
              {lines.map((line, index) => (
                <span className="era-story__line" style={{ "--line": index } as CSSProperties} key={`${activeEra.id}-${index}`}>
                  {line.split(" ").map((word, wordIndex) => (
                    <span className="era-story__word" style={{ "--word": wordIndex + index * 4 } as CSSProperties} key={`${activeEra.id}-${index}-${wordIndex}`}>
                      {word}
                    </span>
                  ))}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
