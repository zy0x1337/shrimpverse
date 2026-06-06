import { useMemo, useState } from "react";
import { strains } from "../lib/constants";
import { filterStrains } from "../lib/strainUtils";
import type { FilterState } from "../types/strain";

const initialState: FilterState = {
  family: "All",
  pattern: "all",
  level: "all",
  query: "",
  popularOnly: false,
  stableOnly: false,
  catalogView: false,
};

export function useStrainFilters() {
  const [state, setState] = useState<FilterState>(initialState);

  const visibleStrains = useMemo(() => filterStrains(strains, state), [state]);

  const stats = useMemo(
    () => ({
      visible: visibleStrains.length,
      popular: visibleStrains.filter((strain) => strain.popularity >= 4).length,
      rili: visibleStrains.filter((strain) => strain.pattern === "Rili").length,
    }),
    [visibleStrains],
  );

  return {
    state,
    visibleStrains,
    stats,
    setFamily: (family: string) => setState((current) => ({ ...current, family })),
    setPattern: (pattern: string) => setState((current) => ({ ...current, pattern })),
    setLevel: (level: string) => setState((current) => ({ ...current, level })),
    setQuery: (query: string) => setState((current) => ({ ...current, query })),
    setPopularOnly: (popularOnly: boolean) => setState((current) => ({ ...current, popularOnly })),
    setStableOnly: (stableOnly: boolean) => setState((current) => ({ ...current, stableOnly })),
    setCatalogView: (catalogView: boolean) => setState((current) => ({ ...current, catalogView })),
  };
}
