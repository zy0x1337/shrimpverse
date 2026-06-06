import strainsData from "../data/strains.json";
import type { Strain } from "../types/strain";

export const strains = strainsData as Strain[];

export const families = ["All", ...new Set(strains.map((strain) => strain.family))];

export const patterns = [...new Set(strains.map((strain) => strain.pattern))].sort();

export const familyColors: Record<string, string> = {
  Natural: "#b7a27d",
  Red: "#e51023",
  Yellow: "#ffd526",
  Orange: "#f47b20",
  Green: "#4ec47e",
  Blue: "#328fd4",
  Black: "#6b7072",
  Brown: "#9b6445",
  White: "#f3f7f4",
};
