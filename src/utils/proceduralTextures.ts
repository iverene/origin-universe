import * as THREE from "three";

type Rgb = [number, number, number];
type Rgba = [number, number, number, number];

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smooth(value: number) {
  return value * value * (3 - 2 * value);
}

function hash(x: number, y: number, seed = 0) {
  return (
    Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123
  ) % 1;
}

function valueNoise(x: number, y: number, seed = 0) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smooth(x - ix);
  const fy = smooth(y - iy);
  const a = Math.abs(hash(ix, iy, seed));
  const b = Math.abs(hash(ix + 1, iy, seed));
  const c = Math.abs(hash(ix, iy + 1, seed));
  const d = Math.abs(hash(ix + 1, iy + 1, seed));
  const x1 = a + (b - a) * fx;
  const x2 = c + (d - c) * fx;

  return x1 + (x2 - x1) * fy;
}

function fbm(x: number, y: number, octaves: number, seed = 0) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;

  for (let octave = 0; octave < octaves; octave++) {
    value += valueNoise(x * frequency, y * frequency, seed + octave * 13.7) * amplitude;
    total += amplitude;
    amplitude *= 0.52;
    frequency *= 2.04;
  }

  return value / total;
}

function mix(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

function mixColor(a: Rgb, b: Rgb, amount: number): Rgb {
  return [
    mix(a[0], b[0], amount),
    mix(a[1], b[1], amount),
    mix(a[2], b[2], amount),
  ];
}

function toByte(value: number) {
  return Math.round(clamp01(value) * 255);
}

function makeRgbTexture(
  width: number,
  height: number,
  sampler: (u: number, v: number) => Rgb,
) {
  const data = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = sampler(x / width, y / height);
      const index = (y * width + x) * 4;
      data[index] = toByte(r);
      data[index + 1] = toByte(g);
      data[index + 2] = toByte(b);
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  return texture;
}

function makeRgbaTexture(
  width: number,
  height: number,
  sampler: (u: number, v: number) => Rgba,
) {
  const data = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = sampler(x / width, y / height);
      const index = (y * width + x) * 4;
      data[index] = toByte(r);
      data[index + 1] = toByte(g);
      data[index + 2] = toByte(b);
      data[index + 3] = toByte(a);
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  return texture;
}

export function createEarthMaps() {
  const oceanDeep: Rgb = [0.02, 0.08, 0.22];
  const oceanShelf: Rgb = [0.04, 0.23, 0.42];
  const landLow: Rgb = [0.14, 0.31, 0.12];
  const landDry: Rgb = [0.54, 0.44, 0.25];
  const ice: Rgb = [0.88, 0.94, 0.96];

  const colorMap = makeRgbTexture(1024, 512, (u, v) => {
    const latitude = Math.abs(v - 0.5) * 2;
    const continental =
      fbm(u * 4.8, v * 2.8, 6, 21) +
      fbm(u * 12.0, v * 5.5, 4, 52) * 0.34 -
      latitude * 0.28;
    const coastal = fbm(u * 36, v * 16, 3, 8) * 0.16;
    const isLand = continental + coastal > 0.58;
    const polar = smooth(Math.max(0, latitude - 0.76) / 0.24);

    if (!isLand) {
      const shelf = clamp01((continental - 0.38) / 0.24);
      return mixColor(mixColor(oceanDeep, oceanShelf, shelf), ice, polar * 0.72);
    }

    const aridity = fbm(u * 7.5 + 4, v * 4.2, 4, 7);
    const elevation = fbm(u * 26, v * 11, 4, 38);
    const land = mixColor(landLow, landDry, clamp01(aridity * 0.88 + elevation * 0.28 - 0.36));

    return mixColor(land, ice, polar);
  });

  const bumpMap = makeRgbTexture(512, 256, (u, v) => {
    const latitude = Math.abs(v - 0.5) * 2;
    const terrain = fbm(u * 24, v * 10, 5, 31) * 0.68 + fbm(u * 96, v * 34, 3, 17) * 0.32;
    const oceans = fbm(u * 7, v * 3, 5, 21);
    const height = clamp01(0.32 + terrain * 0.5 + Math.max(0, oceans - 0.62) * 0.28 - latitude * 0.1);

    return [height, height, height];
  });

  const cloudMap = makeRgbaTexture(1024, 512, (u, v) => {
    const bands = Math.sin((v - 0.5) * Math.PI * 9 + fbm(u * 9, v * 5, 4, 11) * 3.6);
    const storms = fbm(u * 18, v * 9, 6, 81);
    const wisps = fbm(u * 64, v * 28, 3, 5);
    const alpha = clamp01((storms * 0.72 + bands * 0.14 + wisps * 0.22 - 0.56) * 2.8);
    const brightness = 0.78 + wisps * 0.22;

    return [brightness, brightness, 1, alpha * 0.9];
  });

  return { bumpMap, cloudMap, colorMap };
}

export function createMoonMaps() {
  const colorMap = makeRgbTexture(512, 256, (u, v) => {
    const maria = fbm(u * 8, v * 4, 5, 93);
    const craters = fbm(u * 72, v * 28, 4, 19);
    const tone = clamp01(0.42 + maria * 0.24 + craters * 0.18);

    return [tone * 0.96, tone * 0.94, tone * 0.88];
  });

  const bumpMap = makeRgbTexture(512, 256, (u, v) => {
    const craters = fbm(u * 96, v * 44, 5, 121);
    const ridges = fbm(u * 18, v * 8, 4, 28);
    const height = clamp01(0.36 + craters * 0.44 + ridges * 0.18);

    return [height, height, height];
  });

  return { bumpMap, colorMap };
}

export function createRockTexture(seed = 0) {
  return makeRgbTexture(256, 256, (u, v) => {
    const grain = fbm(u * 34, v * 34, 5, seed);
    const strata = Math.sin((u + v * 0.35) * Math.PI * 22 + fbm(u * 8, v * 8, 3, seed + 4) * 3);
    const tone = clamp01(0.24 + grain * 0.42 + strata * 0.045);

    return [tone * 0.88, tone * 0.82, tone * 0.74];
  });
}
