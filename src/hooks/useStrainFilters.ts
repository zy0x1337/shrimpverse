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
  orbitView: true,
};

export function useStrainFilters() {
  const [state, setState] = useState<FilterState>(initialState);

  const visibleStrains = useMemo(() => filterStrains(strains, state), [state]);

  const stats = useMemo(
    () => ({
      visible: visibleStrains.length,
      popular: visibleStrains.filter((s) => s.popularity >= 4).length,
      rili: visibleStrains.filter((s) => s.pattern === "Rili").length,
    }),
    [visibleStrains],
  );

  return {
    state,
    visibleStrains,
    stats,
    setFamily: (family: string) => setState((c) => ({ ...c, family })),
    setPattern: (pattern: string) => setState((c) => ({ ...c, pattern })),
    setLevel: (level: string) => setState((c) => ({ ...c, level })),
    setQuery: (query: string) => setState((c) => ({ ...c, query })),
    setPopularOnly: (popularOnly: boolean) => setState((c) => ({ ...c, popularOnly })),
    setStableOnly: (stableOnly: boolean) => setState((c) => ({ ...c, stableOnly })),
    setCatalogView: (catalogView: boolean) =>
      setState((c) => ({ ...c, catalogView, orbitView: false })),
    setOrbitView: (orbitView: boolean) =>
      setState((c) => ({ ...c, orbitView, catalogView: orbitView ? false : c.catalogView })),
  };
}
