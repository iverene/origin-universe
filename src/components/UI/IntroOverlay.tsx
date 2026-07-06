"use client";

type IntroOverlayProps = {
  hidden: boolean;
};

export function IntroOverlay({ hidden }: IntroOverlayProps) {
  return (
    <div
      className={`font-body pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black px-6 py-8 text-center transition-opacity duration-1000 md:px-12 md:py-10 ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="cosmic-text-reveal max-w-5xl px-3 opacity-0">
        <h1 className="font-heading text-balance text-4xl font-semibold leading-[1.04] text-white sm:text-6xl lg:text-7xl">
          The Origin of the Universe
        </h1>
        <p className="font-body mx-auto mt-5 max-w-2xl text-xs uppercase leading-7 tracking-[0.28em] text-slate-300 sm:text-sm sm:tracking-[0.34em]">
          A Journey Through Time and Space
        </p>
      </div>
    </div>
  );
}
