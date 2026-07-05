"use client";

import { StarField } from "@/components/Stars/StarField";

type DustFieldProps = {
  opacity?: number;
};

export function DustField({ opacity = 1 }: DustFieldProps) {
  return <StarField count={1400} depth={160} opacity={opacity} spread={88} speed={10.5} scale={0.62} />;
}
