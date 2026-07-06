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
  new THREE.Color("#e6f1ff"),
  new THREE.Color("#ffffff"),
  new THREE.Color("#b7d5ff"),
  new THREE.Color("#ffe2b3"),
  new THREE.Color("#ffb089"),
  new THREE.Color("#d7f4ff"),
];

export const nebulaConfigs: NebulaConfig[] = [
  {
    position: [-135, 42, -360],
    scale: [260, 120, 1],
    rotation: [0.08, -0.18, -0.08],
    colors: ["#071129", "#283c68", "#945f73"],
    opacity: 0.18,
    drift: 0.7,
    seed: 2.1,
  },
  {
    position: [165, -64, -520],
    scale: [320, 160, 1],
    rotation: [-0.1, 0.16, 0.18],
    colors: ["#071f29", "#26535f", "#b98561"],
    opacity: 0.14,
    drift: 1.0,
    seed: 9.6,
  },
  {
    position: [10, 72, -720],
    scale: [520, 210, 1],
    rotation: [0.04, 0.08, 0.04],
    colors: ["#050b18", "#243154", "#5f91a3"],
    opacity: 0.12,
    drift: 0.45,
    seed: 15.2,
  },
];
