export type CosmicEra = {
  id: string;
  start: number;
  marker: string;
  subtitle: string;
};

export const cosmicEras: CosmicEra[] = [
  {
    id: "before-everything",
    start: 0,
    marker: "Infinity",
    subtitle: "Before light... before matter... before time itself, there was only silence.",
  },
  {
    id: "big-bang",
    start: 0.07,
    marker: "13.8 Billion Years Ago",
    subtitle:
      "From an unimaginably small beginning,\nspace itself began to expand.\n\nEvery star...\nEvery galaxy...\nEvery planet...\nEvery atom of your body...\n\nbegan here.",
  },
  {
    id: "inflation",
    start: 0.14,
    marker: "Fractions of a Second",
    subtitle:
      "In less than the blink of an eye, the newborn universe expanded faster than light, stretching beyond imagination.",
  },
  {
    id: "birth-of-matter",
    start: 0.2,
    marker: "First Seconds",
    subtitle:
      "As the universe cooled, the first particles emerged, laying the foundation for everything we know today.",
  },
  {
    id: "first-atoms",
    start: 0.27,
    marker: "380,000 Years Later",
    subtitle: "Light was finally free to travel, revealing the universe for the very first time.",
  },
  {
    id: "dark-ages",
    start: 0.34,
    marker: "Millions of Years Later",
    subtitle:
      "For millions of years, the universe waited in silence, filled with invisible clouds of hydrogen and endless darkness.",
  },
  {
    id: "first-stars",
    start: 0.42,
    marker: "100 Million Years Later",
    subtitle:
      "Gravity gathered the first clouds of gas until the darkness was pierced by the universe's earliest stars.",
  },
  {
    id: "galaxies",
    start: 0.5,
    marker: "Hundreds of Millions of Years Later",
    subtitle:
      "Stars joined together, weaving magnificent galaxies that would shape the architecture of the cosmos.",
  },
  {
    id: "galaxy-clusters",
    start: 0.58,
    marker: "Billions of Years Later",
    subtitle:
      "Galaxies gathered into enormous families, connected by invisible threads stretching across the universe.",
  },
  {
    id: "milky-way",
    start: 0.65,
    marker: "13.6 Billion Years Ago",
    subtitle: "Among countless galaxies, one spiral galaxy quietly took shape... our home.",
  },
  {
    id: "solar-system",
    start: 0.72,
    marker: "4.6 Billion Years Ago",
    subtitle:
      "Around an ordinary young star, dust and rock slowly came together to form a new family of worlds.",
  },
  {
    id: "earth",
    start: 0.78,
    marker: "4.5 Billion Years Ago",
    subtitle: "A small blue world formed within the vast darkness, carrying the possibility of life.",
  },
  {
    id: "life",
    start: 0.83,
    marker: "Billions of Years Pass",
    subtitle:
      "From the simplest organisms to civilizations reaching for the stars, life found a way to flourish on a tiny pale blue dot.",
  },
  {
    id: "today",
    start: 0.88,
    marker: "Present Day",
    subtitle:
      "Everything you have ever known exists within this fragile world suspended in the endless universe.",
  },
  {
    id: "beyond-humanity",
    start: 0.92,
    marker: "Millions of Years Ahead",
    subtitle: "Long after civilizations fade, the universe continues its silent journey through time.",
  },
  {
    id: "far-future",
    start: 0.96,
    marker: "Trillions of Years Later",
    subtitle: "Stars grow cold. Galaxies drift apart. The universe slowly returns to darkness.",
  },
  {
    id: "final",
    start: 0.985,
    marker: "Silence",
    subtitle:
      "We are made of stardust, born from a universe billions of years in the making. For a brief moment in its endless story... we were here.",
  },
];

export function getActiveEra(progress: number) {
  for (let index = cosmicEras.length - 1; index >= 0; index--) {
    if (progress >= cosmicEras[index].start) {
      return cosmicEras[index];
    }
  }

  return cosmicEras[0];
}

export function getNextEraStart(era: CosmicEra) {
  const index = cosmicEras.findIndex((candidate) => candidate.id === era.id);
  return cosmicEras[index + 1]?.start ?? 1;
}
