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
    start: 0.035,
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
    marker: "A Few Seconds After the Big Bang",
    subtitle:
      "As the universe expanded and cooled,\nenergy transformed into the first particles.\n\nFrom these tiny building blocks,\nevery star,\nevery planet,\nand every living thing\nwould one day emerge.",
  },
  {
    id: "first-atoms",
    start: 0.27,
    marker: "380,000 Years After the Big Bang",
    subtitle: "The universe became transparent.\n\nLight was finally free to travel.",
  },
  {
    id: "dark-ages",
    start: 0.34,
    marker: "Millions of Years Later",
    subtitle: "Millions of years passed.\n\nThe universe waited in silence.",
  },
  {
    id: "first-stars",
    start: 0.42,
    marker: "100 Million Years Later",
    subtitle: "The first stars ignited.\n\nDarkness gave way to light.",
  },
  {
    id: "galaxies",
    start: 0.5,
    marker: "Hundreds of Millions of Years Later",
    subtitle: "Gravity became the universe's sculptor.\n\nGalaxies were born.",
  },
  {
    id: "galaxy-clusters",
    start: 0.58,
    marker: "Billions of Years Later",
    subtitle:
      "Galaxies gathered into enormous families.\n\nThe cosmic web stretched across the darkness.",
  },
  {
    id: "milky-way",
    start: 0.65,
    marker: "13.6 Billion Years Ago",
    subtitle: "Among countless galaxies,\none spiral slowly became familiar.\n\nOur cosmic home began to take shape.",
  },
  {
    id: "solar-system",
    start: 0.72,
    marker: "4.6 Billion Years Ago",
    subtitle:
      "Around an ordinary young star,\ndust and rock gathered into a new family of worlds.",
  },
  {
    id: "earth",
    start: 0.78,
    marker: "4.5 Billion Years Ago",
    subtitle: "A small blue world turned in the dark.\n\nClouds moved.\nThe Moon kept watch nearby.",
  },
  {
    id: "life",
    start: 0.83,
    marker: "Billions of Years Pass",
    subtitle:
      "On that tiny world,\nlife found a way to flourish beneath the clouds.",
  },
  {
    id: "today",
    start: 0.88,
    marker: "Present Day",
    subtitle:
      "Everything you have ever known\nexists on this fragile world\nsuspended in the endless universe.",
  },
  {
    id: "beyond-humanity",
    start: 0.92,
    marker: "Millions of Years Ahead",
    subtitle: "Long after Earth fades from view,\nthe universe continues its silent journey through time.",
  },
  {
    id: "far-future",
    start: 0.96,
    marker: "Trillions of Years Later",
    subtitle:
      "Trillions of years passed.\n\nThe universe grew quiet.\n\nBut every atom of life\n\nhad once shared\nthe same beginning.",
  },
  {
    id: "final",
    start: 0.985,
    marker: "",
    subtitle:
      "Look up tonight.\n\nEvery star you see\nis a message from the past.\n\nThe atoms that formed galaxies...\n\nformed you too.\n\nYou are not separate from the universe.\n\nYou are one of the ways\nit learned to see itself.",
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
