"use client";

import { IntroOverlay } from "@/components/UI/IntroOverlay";

export default function BlankIntroExperience() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <IntroOverlay hidden={false} />
    </main>
  );
}
