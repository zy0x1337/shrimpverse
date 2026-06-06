import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { FilterPanel } from "./components/FilterPanel";
import { StrainAtlas } from "./components/StrainAtlas";
import { StrainDialog } from "./components/StrainDialog";
import { StrainGrid } from "./components/StrainGrid";
import { useStrainFilters } from "./hooks/useStrainFilters";
import { strains } from "./lib/constants";
import { fadeTransition, viewVariants, withReducedMotion } from "./lib/motion";

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
    setCatalogView,
  } = useStrainFilters();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const selectedStrain = useMemo(
    () => strains.find((strain) => strain.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <>
      <main className="app-shell">
        <section className="workspace" aria-label="Neocaridina davidi strain map">
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

          <section className="content-panel">
            <div className="toolbar">
              <div>
                <p className="eyebrow">Reference Atlas</p>
                <h2>Color families and documented strains</h2>
              </div>
              <div className="toolbar-actions">
                <button
                  className={`icon-button ${!state.catalogView ? "active" : ""}`}
                  type="button"
                  aria-label="Show atlas view"
                  title="Atlas view"
                  onClick={() => setCatalogView(false)}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  className={`icon-button ${state.catalogView ? "active" : ""}`}
                  type="button"
                  aria-label="Show catalog view"
                  title="Catalog view"
                  onClick={() => setCatalogView(true)}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M3 7h7v7H3V7Zm11 0h7v7h-7V7ZM3 17h7v4H3v-4Zm11 0h7v4h-7v-4Z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="view-stage">
              <AnimatePresence mode="wait" initial={false}>
                {!state.catalogView ? (
                  <motion.div
                    key="atlas-view"
                    className="view-panel"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={withReducedMotion(reduced, fadeTransition)}
                  >
                    <StrainAtlas visibleStrains={visibleStrains} onSelect={setSelectedId} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="catalog-view"
                    className="view-panel"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={withReducedMotion(reduced, fadeTransition)}
                  >
                    <StrainGrid strains={visibleStrains} onSelect={setSelectedId} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </section>
      </main>

      <StrainDialog strain={selectedStrain} onClose={() => setSelectedId(null)} />
    </>
  );
}
