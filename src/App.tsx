import { useMemo, useState } from "react";
import { FilterPanel } from "./components/FilterPanel";
import { FamilyOrbitExplorer } from "./components/FamilyOrbitExplorer";
import { StrainDialog } from "./components/StrainDialog";
import { useStrainFilters } from "./hooks/useStrainFilters";
import { strains } from "./lib/constants";

export default function App() {
  const {
    state,
    visibleStrains,
    stats,
    setFamily,
    setPattern,
    setLevel,
    setQuery,
    setPopularOnly,
    setStableOnly,
  } = useStrainFilters();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selectedStrain = useMemo(
    () => strains.find((s) => s.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <>
      <main className="app-shell">
        <section className="workspace" aria-label="Neocaridina davidi strain map">

          <div className={`filter-container${filtersOpen ? " open" : ""}`}>
            <FilterPanel
              state={state}
              stats={stats}
              onFamilyChange={setFamily}
              onPatternChange={setPattern}
              onLevelChange={setLevel}
              onQueryChange={setQuery}
              onPopularOnlyChange={setPopularOnly}
              onStableOnlyChange={setStableOnly}
            />
          </div>

          <section className="content-panel">
            <div className="toolbar">
              <div>
                <p className="eyebrow">Reference Atlas</p>
                <h2>Color families and documented strains</h2>
              </div>
              <div className="toolbar-actions">
                <button
                  className="icon-button mobile-filter-toggle"
                  type="button"
                  aria-label="Toggle filters"
                  onClick={() => setFiltersOpen((v) => !v)}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="view-stage">
              <FamilyOrbitExplorer visibleStrains={visibleStrains} onSelect={setSelectedId} />
            </div>
          </section>

        </section>
      </main>

      <StrainDialog strain={selectedStrain} onClose={() => setSelectedId(null)} />
    </>
  );
}
