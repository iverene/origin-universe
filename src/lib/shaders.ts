export const STAR_VERTEX = `
  attribute float aSize;
  attribute float aTwinkle;
  attribute float aPhase;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uDepth;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.z = mod(p.z + uTime * uSpeed + uDepth, uDepth) - uDepth;
    p.x += sin(uTime * 0.025 + aPhase) * 2.8;
    p.y += cos(uTime * 0.019 + aPhase * 0.7) * 2.1;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    float twinkle = 0.72 + sin(uTime * aTwinkle + aPhase) * 0.28;
    gl_PointSize = aSize * twinkle * uScale * (360.0 / max(24.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;

    vColor = aColor;
    vAlpha = twinkle;
  }
`;

export const STAR_FRAGMENT = `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.5, 0.02, d);
    float halo = smoothstep(0.5, 0.0, d) * 0.35;
    float sparkle = pow(max(0.0, 1.0 - abs(uv.x) * 9.0), 5.0) * 0.14;
    sparkle += pow(max(0.0, 1.0 - abs(uv.y) * 9.0), 5.0) * 0.14;
    float alpha = (core + halo + sparkle) * vAlpha * uOpacity;

    if (alpha < 0.015) discard;
    gl_FragColor = vec4(vColor * (0.9 + vAlpha * 0.45), alpha);
  }
`;

export const NEBULA_VERTEX = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uDrift;

  void main() {
    vUv = uv;
    vec3 p = position;
    float wave = sin((uv.x + uTime * 0.015 * uDrift) * 8.0) * cos((uv.y - uTime * 0.01) * 7.0);
    p.z += wave * 0.06;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const NEBULA_FRAGMENT = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;
  uniform float uSeed;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.55;
    for (int i = 0; i < 5; i++) {
      value += noise(p) * amp;
      p *= 2.02;
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 centered = vUv - 0.5;
    float radial = smoothstep(0.68, 0.08, length(centered * vec2(1.16, 0.82)));
    vec2 drift = vec2(uTime * 0.008, -uTime * 0.005);
    float cloud = fbm(vUv * 3.0 + drift + uSeed);
    cloud += fbm(vUv * 7.0 - drift * 0.6 + uSeed * 1.7) * 0.45;
    cloud = smoothstep(0.38, 1.1, cloud);

    vec3 color = mix(uColorA, uColorB, cloud);
    color = mix(color, uColorC, smoothstep(0.72, 1.2, cloud + centered.x * 0.22));
    float alpha = cloud * radial * uOpacity;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

export const GALAXY_VERTEX = `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.xy = mat2(cos(uTime * 0.01), -sin(uTime * 0.01), sin(uTime * 0.01), cos(uTime * 0.01)) * p.xy;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (210.0 / max(80.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    vAlpha = 0.5 + sin(uTime * 0.6 + aSize) * 0.08;
  }
`;

export const GALAXY_FRAGMENT = `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d) * vAlpha * uOpacity;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export const BIG_BANG_PARTICLE_VERTEX = `
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;
  attribute vec3 aColor;

  uniform float uExpansion;
  uniform float uMotion;
  uniform float uOpacity;
  uniform float uTime;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 direction = normalize(position);
    float pulse = sin(uTime * 1.4 + aPhase) * 0.04;
    float stretch = pow(uExpansion, 1.35) * aSpeed * 245.0;
    vec3 current = direction * (stretch + pulse * 18.0);
    current += vec3(
      sin(uTime * 0.35 + aPhase) * 4.0,
      cos(uTime * 0.28 + aPhase * 0.7) * 3.0,
      sin(uTime * 0.22 + aPhase * 1.3) * 5.0
    ) * uMotion;

    vec4 mvPosition = modelViewMatrix * vec4(current, 1.0);
    float perspective = 420.0 / max(34.0, -mvPosition.z);
    gl_PointSize = aSize * perspective * (0.6 + uExpansion * 1.4);
    gl_Position = projectionMatrix * mvPosition;

    vColor = aColor;
    vAlpha = uOpacity * (0.55 + sin(uTime * 1.2 + aPhase) * 0.16);
  }
`;

export const BIG_BANG_PARTICLE_FRAGMENT = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.42, 0.02, d);
    float halo = smoothstep(0.5, 0.0, d) * 0.32;
    float alpha = (core + halo) * vAlpha;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;
