import * as THREE from "three";

export type NebulaConfig = {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  colors: [string, string, string];
  opacity: number;
  drift: number;
  seed: number;
};

export const starPalette = [
  new THREE.Color("#dfefff"),
  new THREE.Color("#ffffff"),
  new THREE.Color("#9bc7ff"),
  new THREE.Color("#ffd8a1"),
  new THREE.Color("#ff9f7a"),
  new THREE.Color("#c7f6ff"),
];

export const nebulaConfigs: NebulaConfig[] = [
  {
    position: [-135, 42, -360],
    scale: [260, 120, 1],
    rotation: [0.08, -0.18, -0.08],
    colors: ["#182b73", "#7133a5", "#d25aa8"],
    opacity: 0.24,
    drift: 0.7,
    seed: 2.1,
  },
  {
    position: [165, -64, -520],
    scale: [320, 160, 1],
    rotation: [-0.1, 0.16, 0.18],
    colors: ["#063c4d", "#1d6f86", "#ef9a62"],
    opacity: 0.18,
    drift: 1.0,
    seed: 9.6,
  },
  {
    position: [10, 72, -720],
    scale: [520, 210, 1],
    rotation: [0.04, 0.08, 0.04],
    colors: ["#07142d", "#2b1f64", "#31b7c0"],
    opacity: 0.16,
    drift: 0.45,
    seed: 15.2,
  },
];
