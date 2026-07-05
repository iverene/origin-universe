import { starPalette } from "@/lib/universeConfig";
import { randomBetween } from "@/utils/random";
import * as THREE from "three";

export type PointCloudData = {
  positions: Float32Array;
  sizes: Float32Array;
  twinkles: Float32Array;
  phases: Float32Array;
  colors: Float32Array;
};

export type GalaxyPointCloudData = Omit<PointCloudData, "twinkles" | "phases">;

export function createStarData(count: number, depth: number, spread: number): PointCloudData {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const twinkles = new Float32Array(count);
  const phases = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  for (let index = 0; index < count; index++) {
    const radius = Math.sqrt(Math.random()) * spread;
    const angle = Math.random() * Math.PI * 2;
    const ySpread = spread * 0.54;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = randomBetween(-ySpread, ySpread);
    positions[index * 3 + 2] = -randomBetween(32, depth);

    const bright = Math.random() > 0.88;
    sizes[index] = bright ? randomBetween(3.8, 7.4) : randomBetween(1.1, 3.3);
    twinkles[index] = randomBetween(0.35, 1.65);
    phases[index] = randomBetween(0, Math.PI * 2);

    const color = starPalette[Math.floor(Math.random() * starPalette.length)];
    const intensity = bright ? randomBetween(1.0, 1.45) : randomBetween(0.62, 1.05);
    colors[index * 3] = color.r * intensity;
    colors[index * 3 + 1] = color.g * intensity;
    colors[index * 3 + 2] = color.b * intensity;
  }

  return { positions, sizes, twinkles, phases, colors };
}

export function createGalaxyData(count: number, spiral = true): GalaxyPointCloudData {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const warm = new THREE.Color("#ffd1a0");
  const cool = new THREE.Color("#a9c9ff");
  const core = new THREE.Color("#fff8e7");

  for (let index = 0; index < count; index++) {
    const radius = Math.pow(Math.random(), 1.8) * 38;
    const arm = spiral ? (index % 4) * (Math.PI / 2) : Math.random() * Math.PI * 2;
    const swirl = spiral ? radius * 0.18 : 0;
    const angle = arm + swirl + randomBetween(-0.34, 0.34);
    const thickness = spiral ? randomBetween(-1.2, 1.2) : randomBetween(-5, 5);

    positions[index * 3] = Math.cos(angle) * radius + randomBetween(-1.8, 1.8);
    positions[index * 3 + 1] =
      Math.sin(angle) * radius * (spiral ? 0.42 : 0.3) + thickness;
    positions[index * 3 + 2] = randomBetween(-2.5, 2.5);

    sizes[index] = randomBetween(1.2, 4.8);
    const mixAmount = Math.min(1, radius / 38);
    const color = core.clone().lerp(index % 3 === 0 ? warm : cool, mixAmount);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  return { positions, sizes, colors };
}
