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
