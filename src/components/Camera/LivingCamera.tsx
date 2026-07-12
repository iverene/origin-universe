"use client";

import { useFrame, useThree } from "@react-three/fiber";

type LivingCameraProps = {
  progress: number;
};

export function LivingCamera({ progress }: LivingCameraProps) {
  const { camera, pointer } = useThree();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const eraPulse = Math.sin(progress * Math.PI * 16) * 0.55;
    camera.position.set(
      Math.sin(progress * Math.PI * 5.5) * 6 + Math.sin(time * 0.045) * 2.8 + pointer.x * 1.6,
      Math.cos(progress * Math.PI * 4) * 3 + Math.sin(time * 0.032) * 1.45 - pointer.y * 1.1,
      18 - progress * 180 + Math.sin(time * 0.018) * 1.2 + eraPulse,
    );
    camera.rotation.set(
      Math.sin(time * 0.034) * 0.012 + pointer.y * 0.008,
      Math.sin(time * 0.026) * 0.018 - pointer.x * 0.012,
      Math.sin(time * 0.02) * 0.012 + Math.sin(progress * Math.PI * 3) * 0.018,
    );
  });

  return null;
}
