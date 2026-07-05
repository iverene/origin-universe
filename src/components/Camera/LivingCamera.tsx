"use client";

import { useFrame, useThree } from "@react-three/fiber";

type LivingCameraProps = {
  progress: number;
};

export function LivingCamera({ progress }: LivingCameraProps) {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    camera.position.set(
      Math.sin(time * 0.045) * 2.8,
      Math.sin(time * 0.032) * 1.45 + Math.cos(time * 0.021) * 0.8,
      18 - progress * 180 + Math.sin(time * 0.018) * 1.2,
    );
    camera.rotation.set(
      Math.sin(time * 0.034) * 0.012,
      Math.sin(time * 0.026) * 0.018,
      Math.sin(time * 0.02) * 0.012,
    );
  });

  return null;
}
