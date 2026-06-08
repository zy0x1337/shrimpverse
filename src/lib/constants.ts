import strainsData from "../data/strains.json";
import type { Strain } from "../types/strain";

export const strains = strainsData as Strain[];

export const families = ["All", ...new Set(strains.map((strain) => strain.family))];

export const patterns = [...new Set(strains.map((strain) => strain.pattern))].sort();

export const familyColors: Record<string, string> = {
  Natural: "#d4aa6a",
  Red:     "#f01428",
  Yellow:  "#ffe033",
  Orange:  "#ff7a1a",
  Green:   "#22cc66",
  Blue:    "#1a8ce8",
  Black:   "#3a3d42",
  Brown:   "#c2733a",
  White:   "#e8eef0",
};
