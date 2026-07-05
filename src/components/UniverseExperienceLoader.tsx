"use client";

import dynamic from "next/dynamic";

const UniverseExperience = dynamic(() => import("./Scene/UniverseExperience"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />,
});

export default function UniverseExperienceLoader() {
  return <UniverseExperience />;
}
