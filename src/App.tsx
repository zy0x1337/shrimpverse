import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { FilterPanel } from "./components/FilterPanel";
import { OrbitMap } from "./components/OrbitMap";
import { StrainDialog } from "./components/StrainDialog";
import { StrainGrid } from "./components/StrainGrid";
import { useStrainFilters } from "./hooks/useStrainFilters";
import { fadeTransition, viewVariants, withReducedMotion } from "./lib/motion";
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
                <p className="eyebrow">Living Strain System</p>
                <h2>Color families as orbits, strains as planets</h2>
              </div>
              <div className="toolbar-actions">
                <button
                  className={`icon-button ${!state.catalogView ? "active" : ""}`}
                  type="button"
                  aria-label="Show orbit view"
                  title="Orbit view"
                  onClick={() => setCatalogView(false)}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
                    <path d="M3 12c2.3-5.8 6.1-8.1 11.2-6.7 5.2 1.4 7.8 4.4 7 8.1-.8 3.8-4.5 6.1-9.9 6.1-5.4 0-8.4-2.4-8.3-7.5Z" />
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
                    key="orbit-view"
                    className="view-panel"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={withReducedMotion(reduced, fadeTransition)}
                  >
                    <OrbitMap visibleStrains={visibleStrains} onSelect={setSelectedId} />
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
