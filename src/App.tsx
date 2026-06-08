import { lazy, Suspense, useMemo, useState, useEffect } from "react";
import { FilterPanel } from "./components/FilterPanel";
import { FamilyOrbitExplorer } from "./components/FamilyOrbitExplorer";
import { StrainDialog } from "./components/StrainDialog";
import { ViewToggle } from "./components/ViewToggle";
import { useStrainFilters } from "./hooks/useStrainFilters";
import { useIsMobile } from "./hooks/useIsMobile";
import { strains } from "./lib/constants";

// Lazy-load the heavy Three.js canvas — only fetched when user switches to 3D
const StrainUniverse = lazy(() =>
  import("./components/3d/StrainUniverse").then((m) => ({ default: m.StrainUniverse }))
);

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
    setWaterType,
  } = useStrainFilters();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const isMobile = useIsMobile();

  // Close sidebar overlay when clicking outside on mobile
  useEffect(() => {
    if (!filtersOpen || !isMobile) return;
    const handler = (e: MouseEvent) => {
      const sidebar = document.querySelector(".filter-container");
      if (sidebar && !sidebar.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    };
    // slight delay so the opening tap doesn't immediately close
    const t = setTimeout(() => document.addEventListener("click", handler), 50);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", handler);
    };
  }, [filtersOpen, isMobile]);

  // Lock body scroll when mobile filter panel is open
  useEffect(() => {
    if (isMobile && filtersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, filtersOpen]);

  const selectedStrain = useMemo(
    () => strains.find((s) => s.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <>
      <main className="app-shell">
        <section className="workspace" aria-label="Shrimpverse — shrimp species explorer">

          {/* Mobile backdrop */}
          {isMobile && filtersOpen && (
            <div
              className="sidebar-backdrop"
              aria-hidden="true"
              onClick={() => setFiltersOpen(false)}
            />
          )}

          <div className={`filter-container${filtersOpen ? " open" : ""}`}>
            <FilterPanel
              state={state}
              stats={stats}
              onFamilyChange={(f) => { setFamily(f); if (isMobile) setFiltersOpen(false); }}
              onPatternChange={setPattern}
              onLevelChange={setLevel}
              onQueryChange={setQuery}
              onPopularOnlyChange={setPopularOnly}
              onStableOnlyChange={setStableOnly}
              onWaterTypeChange={setWaterType}
              onClose={isMobile ? () => setFiltersOpen(false) : undefined}
            />
          </div>

          <section className="content-panel">
            <div className="toolbar">
              <div>
                <p className="eyebrow">Species Atlas</p>
                <h2>Genera, species &amp; documented varieties</h2>
              </div>
              <div className="toolbar-actions">
                <ViewToggle mode={viewMode} onChange={setViewMode} />
                <button
                  className="icon-button mobile-filter-toggle"
                  type="button"
                  aria-label={filtersOpen ? "Close filters" : "Open filters"}
                  aria-expanded={filtersOpen}
                  onClick={() => setFiltersOpen((v) => !v)}
                >
                  {filtersOpen ? (
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M4 4l12 12M16 4L4 16" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M3 5h14M6 10h8M9 15h2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="view-stage">
              {viewMode === "2d" ? (
                <FamilyOrbitExplorer
                  visibleStrains={visibleStrains}
                  onSelect={setSelectedId}
                />
              ) : (
                <Suspense
                  fallback={
                    <div className="universe-loading">
                      <div className="universe-loading-ring" />
                      <span>Loading Universe…</span>
                    </div>
                  }
                >
                  <StrainUniverse
                    visibleStrains={visibleStrains}
                    onSelect={setSelectedId}
                  />
                </Suspense>
              )}
            </div>
          </section>

        </section>
      </main>

      <StrainDialog
        strain={selectedStrain}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
