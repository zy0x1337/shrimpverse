export type KeeperLevel = "Beginner" | "Intermediate" | "Collector";
export type WaterType = "hard" | "soft" | "neutral";
export type Genus = "Neocaridina" | "Caridina" | "Atyopsis" | "Atya";

export interface WaterProfile {
  gh:   string;  // e.g. "6–10"
  kh:   string;  // e.g. "2–6"
  ph:   string;  // e.g. "7.0–7.5"
  tds:  string;  // e.g. "150–250"
  temp: string;  // e.g. "18–26 °C"
}

export type CrossStability = "stable" | "unstable" | "stabilizing" | "impossible";
export type TaxonomyStatus = "accepted" | "disputed" | "synonym" | "uncertain";

export interface CrossResult {
  with:       string;           // family name, e.g. "Taiwan Bee"
  withId?:    string;           // strain id for precise arc targeting
  offspring:  string;           // e.g. "Panda / King Kong"
  stability:  CrossStability;
  note?:      string;
}

export interface Strain {
  id:           string;
  name:         string;
  family:       string;
  pattern:      string;
  line:         string;
  level:        KeeperLevel;
  popularity:   number;
  stable:       boolean;
  colors:       [string, string, string];
  summary:      string;
  breeding:     string;
  tags:         string[];
  genus?:       Genus;
  species?:     string;
  waterType?:   WaterType;
  /** Detailed water chemistry parameters */
  waterProfile?: WaterProfile;
  /** Known crossing results with other families */
  compatible?:  CrossResult[];
  /** A single memorable fact, max ~15 words. Used for flip-card in StrainRail. */
  factoid?:     string;
  /** Taxonomy validity per WoRMS / peer-reviewed sources */
  taxonomyStatus?: TaxonomyStatus;
  /** True for cultivar lines with confirmed hybrid origin (e.g. Taiwan Bee) */
  hybridOrigin?:   boolean;
  /** Conservation status label, e.g. "Critically Endangered (IUCN)" or "Endemic — Sulawesi lakes" */
  conservationStatus?: string;
  /** Explanatory note shown alongside the conservation status (expert mode) */
  conservationNote?:   string;
}

export interface FilterState {
  family:      string;
  pattern:     string;
  level:       string;
  query:       string;
  popularOnly: boolean;
  stableOnly:  boolean;
  waterType:   string;
  /** Show cross-breeding outcome labels on the orbit map */
  showBreedingArcs:  boolean;
  /** Show extended expert sections (taxonomy, genetics, conservation) in the strain profile */
  showExpertDetails: boolean;
}
