"use client";

import BlankIntroExperience from "@/components/Scene/BlankIntroExperience";
import dynamic from "next/dynamic";

const UniverseExperience = dynamic(() => import("./Scene/UniverseExperience"), {
  ssr: false,
  loading: () => <BlankIntroExperience />,
});

export default function UniverseExperienceLoader() {
  return <UniverseExperience />;
}
