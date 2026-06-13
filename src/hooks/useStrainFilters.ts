import { useMemo, useState } from "react";
import { strains } from "../lib/constants";
import { filterStrains } from "../lib/strainUtils";
import type { FilterState } from "../types/strain";

// The filter-only subset of the state (the fields that actually narrow the result
// set). The four show* flags are *display* options, not filters — they are kept
// out of this baseline so a "Clear all" never disturbs the user's reading prefs.
const FILTER_DEFAULTS = {
  family: "All",
  pattern: "all",
  level: "all",
  query: "",
  popularOnly: false,
  stableOnly: false,
  waterType: "all",
} as const;

const initialState: FilterState = {
  ...FILTER_DEFAULTS,
  showBreedingArcs: false,
  showTaxonomyStatus: false,
  showHybridOrigin: false,
  showConservationStatus: false,
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

  // How many *filters* (not display options) are currently narrowing the list.
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (state.family !== "All") n++;
    if (state.pattern !== "all") n++;
    if (state.level !== "all") n++;
    if (state.waterType !== "all") n++;
    if (state.query.trim()) n++;
    if (state.popularOnly) n++;
    if (state.stableOnly) n++;
    return n;
  }, [state]);

  return {
    state,
    visibleStrains,
    stats,
    activeFilterCount,
    // Reset every filter, but preserve the Lens (display) toggles.
    clearAllFilters: () => setState((c) => ({ ...c, ...FILTER_DEFAULTS })),
    setFamily: (family: string) => setState((c) => ({ ...c, family })),
    setPattern: (pattern: string) => setState((c) => ({ ...c, pattern })),
    setLevel: (level: string) => setState((c) => ({ ...c, level })),
    setQuery: (query: string) => setState((c) => ({ ...c, query })),
    setPopularOnly: (popularOnly: boolean) => setState((c) => ({ ...c, popularOnly })),
    setStableOnly: (stableOnly: boolean) => setState((c) => ({ ...c, stableOnly })),
    setWaterType: (waterType: string) => setState((c) => ({ ...c, waterType })),
    setShowBreedingArcs: (showBreedingArcs: boolean) => setState((c) => ({ ...c, showBreedingArcs })),
    setShowTaxonomyStatus: (showTaxonomyStatus: boolean) => setState((c) => ({ ...c, showTaxonomyStatus })),
    setShowHybridOrigin: (showHybridOrigin: boolean) => setState((c) => ({ ...c, showHybridOrigin })),
    setShowConservationStatus: (showConservationStatus: boolean) => setState((c) => ({ ...c, showConservationStatus })),
  };
}
