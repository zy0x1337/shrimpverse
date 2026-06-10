import strainsData from "../data/strains.json";
import type { Strain } from "../types/strain";

export const strains = strainsData as Strain[];

export const families = ["All", ...new Set(strains.map((strain) => strain.family))];

export const patterns = [...new Set(strains.map((strain) => strain.pattern))].sort();

export const familyColors: Record<string, string> = {
  // Neocaridina davidi color lines
  Natural:    "#d4aa6a",
  Red:        "#f01428",
  Yellow:     "#ffe033",
  Orange:     "#ff7a1a",
  Green:      "#22cc66",
  Blue:       "#1a8ce8",
  Black:      "#3a3d42",
  Brown:      "#c2733a",
  White:      "#e8eef0",
  // Caridina cantonensis
  Crystal:    "#a8d4f8",
  // Taiwan Bee / Caridina hybrids
  "Taiwan Bee": "#2a50e0",
  // Tiger Caridina
  Tiger:      "#e07820",
  // Sulawesi endemics
  Sulawesi:   "#e01828",
  // Caridina multidentata
  Amano:      "#7aaa50",
  // Filter shrimp
  Bamboo:     "#9a7040",
};

export const familyGenus: Record<string, string> = {
  Natural:      "Neocaridina",
  Red:          "Neocaridina",
  Yellow:       "Neocaridina",
  Orange:       "Neocaridina",
  Green:        "Neocaridina",
  Blue:         "Neocaridina",
  Black:        "Neocaridina",
  Brown:        "Neocaridina",
  White:        "Neocaridina",
  Crystal:      "Caridina",
  "Taiwan Bee": "Caridina",
  Tiger:        "Caridina",
  Sulawesi:     "Caridina",
  Amano:        "Caridina",
  Bamboo:       "Atyopsis",
};

// Short contextual descriptions shown below the active family label in the orbit.
// Aimed at newcomers — one line that tells you what kind of shrimp this is
// and why you might care.
export const familyDescriptions: Record<string, string> = {
  Natural:      "The wild-type look — understated, incredibly hardy",
  Red:          "Neocaridina — the classic beginner shrimp, endlessly variable",
  Orange:       "Neocaridina — warm tones, same easy care as Red",
  Yellow:       "Neocaridina — bright and cheerful, great in planted tanks",
  Green:        "Neocaridina — rare in the hobby, surprisingly vivid",
  Blue:         "Neocaridina — bold color, among the easiest to keep",
  Black:        "Neocaridina — dramatic contrast, forgiving water parameters",
  Brown:        "Neocaridina — earthy tones, often overlooked gems",
  White:        "Neocaridina — clean and striking, pairs well with dark substrate",
  Crystal:      "Caridina — soft acidic water, iconic red & white patterns",
  "Taiwan Bee": "Caridina — collector favorites, intricate patterns, delicate",
  Tiger:        "Caridina — bold stripes, closer to the wild form",
  Sulawesi:     "Ancient lake endemics — warm, mineral-rich, unlike any other",
  Amano:        "Caridina — algae specialists, the workhorses of planted tanks",
  Bamboo:       "Filter feeders — peaceful, fascinating, need flow to thrive",
};
