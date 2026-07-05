"use client";

import dynamic from "next/dynamic";

const BlankIntroExperience = dynamic(() => import("./Scene/BlankIntroExperience"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />,
});

export default function UniverseExperienceLoader() {
  return <BlankIntroExperience />;
}
