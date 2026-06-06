export type KeeperLevel = "Beginner" | "Intermediate" | "Collector";

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
}

export interface FilterState {
  family: string;
  pattern: string;
  level: string;
  query: string;
  popularOnly: boolean;
  stableOnly: boolean;
  catalogView: boolean;
}
