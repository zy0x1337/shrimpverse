import type { CSSProperties } from "react";
import type { FilterState, Strain } from "../types/strain";

export function toneStyle(strain: Strain): CSSProperties {
  return {
    ["--tone-soft" as string]: `${strain.colors[1]}33`,
    ["--tone-bg" as string]: `${strain.colors[0]}22`,
  };
}

export function filterStrains(strains: Strain[], state: FilterState): Strain[] {
  const query = state.query.trim().toLowerCase();

  return strains.filter((strain) => {
    const haystack = [strain.name, strain.family, strain.pattern, strain.line, strain.summary, ...strain.tags]
      .join(" ")
      .toLowerCase();

    return (
      (state.family === "All" || strain.family === state.family) &&
      (state.pattern === "all" || strain.pattern === state.pattern) &&
      (state.level === "all" || strain.level === state.level) &&
      (!state.popularOnly || strain.popularity >= 4) &&
      (!state.stableOnly || strain.stable) &&
      (!query || haystack.includes(query))
    );
  });
}
