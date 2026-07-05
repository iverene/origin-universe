"use client";

import gsap from "gsap";
import Lenis from "lenis";
import { useEffect, useState } from "react";

export function useLenisAndScrollFade() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    gsap.defaults({ ease: "power2.out" });
    const lenis = new Lenis({
      anchors: true,
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.8,
    });

    const onScroll = () => {
      setHidden(window.scrollY > 48);
    };

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return hidden;
}
