export type KeeperLevel = "Beginner" | "Intermediate" | "Collector";
export type WaterType = "hard" | "soft" | "neutral";
export type Genus = "Neocaridina" | "Caridina" | "Atyopsis" | "Atya";

export interface Strain {
  id: string;
  name: string;
  family: string;
  pattern: string;
  line: string;
  level: KeeperLevel;
  popularity: number;
  stable: boolean;
  colors: [string, string, string];
  summary: string;
  breeding: string;
  tags: string[];
  genus?: Genus;
  species?: string;
  waterType?: WaterType;
}

export interface FilterState {
  family: string;
  pattern: string;
  level: string;
  query: string;
  popularOnly: boolean;
  stableOnly: boolean;
  waterType: string;
  catalogView: boolean;
  orbitView: boolean;
}
