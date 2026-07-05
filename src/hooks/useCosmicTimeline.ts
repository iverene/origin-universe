"use client";

import { cosmicEras, getActiveEra } from "@/lib/timeline";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { RefObject, useEffect, useMemo, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useCosmicTimeline(containerRef: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "instant" });

    const lenis = new Lenis({
      anchors: false,
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.82,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        setProgress(Number(self.progress.toFixed(4)));
      },
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
      gsap.ticker.remove(ticker);
      lenis.destroy();
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [containerRef]);

  const activeEra = useMemo(() => getActiveEra(progress), [progress]);

  return {
    activeEra,
    eras: cosmicEras,
    progress,
  };
}
