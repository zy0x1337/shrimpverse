import { lazy, Suspense, useMemo, useState, useEffect, useCallback } from "react";
import { FilterPanel } from "./components/FilterPanel";
import { FamilyOrbitExplorer } from "./components/FamilyOrbitExplorer";
import { StrainDialog } from "./components/StrainDialog";
import { ViewToggle } from "./components/ViewToggle";
import { useStrainFilters } from "./hooks/useStrainFilters";
import { useIsMobile } from "./hooks/useIsMobile";
import { strains, patterns, families } from "./lib/constants";
import { validateCompatFamilies, validateCompatSymmetry } from "./lib/strains";
import type { FilterState } from "./types/strain";

// Lazy-load the heavy Three.js canvas — only fetched when user switches to 3D
const StrainUniverse = lazy(() =>
  import("./components/3d/StrainUniverse").then((m) => ({ default: m.StrainUniverse }))
);

// Tags that map directly to a care-level filter value
const LEVEL_TAGS = new Set(["beginner-friendly", "intermediate", "collector", "expert"]);
const LEVEL_TAG_MAP: Record<string, string> = {
  "beginner-friendly": "Beginner",
  "intermediate":      "Intermediate",
  "collector":         "Collector",
  "expert":            "Collector",
};

// Tags that map to a water-type filter value
const WATER_TAGS = new Set(["hard-water", "soft-water", "neutral-water"]);
const WATER_TAG_MAP: Record<string, string> = {
  "hard-water":    "hard",
  "soft-water":    "soft",
  "neutral-water": "neutral",
};

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [expertMode, setExpertMode] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("shrimpverse_expert_mode");
      return stored === "true";
    }
    return false;
  });
  const isMobile = useIsMobile();

  // Run data-integrity validators once on mount (DEV only)
  useEffect(() => {
    if (import.meta.env.DEV) {
      validateCompatFamilies(strains);
      validateCompatSymmetry(strains);
    }
  }, []);

  // Persist expert mode to localStorage
  useEffect(() => {
    localStorage.setItem("shrimpverse_expert_mode", expertMode ? "true" : "false");
  }, [expertMode]);

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

  const hasActiveFilters =
    state.family !== "All" || state.waterType !== "all" ||
    state.pattern !== "all" || state.level !== "all" ||
    state.popularOnly || state.stableOnly || !!state.query;

  /**
   * Called when user clicks a tag inside StrainDialog.
   * Routes the tag to the most appropriate filter and closes the dialog.
   * Priority: level > water > pattern > family > query fallback
   */
  const handleTagFilter = useCallback((tag: string) => {
    const lower = tag.toLowerCase();

    if (LEVEL_TAGS.has(lower)) {
      setLevel(LEVEL_TAG_MAP[lower]);
      return;
    }
    if (WATER_TAGS.has(lower)) {
      setWaterType(WATER_TAG_MAP[lower]);
      return;
    }
    // Pattern match (case-insensitive)
    const matchedPattern = patterns.find(
      (p) => p.toLowerCase() === lower || lower.includes(p.toLowerCase())
    );
    if (matchedPattern) {
      setPattern(matchedPattern);
      return;
    }
    // Family match
    const matchedFamily = families.find(
      (f) => f.toLowerCase() === lower || lower.includes(f.toLowerCase())
    );
    if (matchedFamily && matchedFamily !== "All") {
      setFamily(matchedFamily);
      return;
    }
    // Fallback: put tag text into search query
    setQuery(tag);
  }, [setLevel, setWaterType, setPattern, setFamily, setQuery]);

  /**
   * Called when user clicks a Guided Path preset button in FilterPanel.
   * Atomically sets all filter fields included in the preset.
   */
  const handleApplyPreset = useCallback((preset: Partial<FilterState>) => {
    if (preset.family      !== undefined) setFamily(preset.family);
    if (preset.pattern     !== undefined) setPattern(preset.pattern);
    if (preset.level       !== undefined) setLevel(preset.level);
    if (preset.waterType   !== undefined) setWaterType(preset.waterType);
    if (preset.query       !== undefined) setQuery(preset.query);
    if (preset.popularOnly !== undefined) setPopularOnly(preset.popularOnly);
    if (preset.stableOnly  !== undefined) setStableOnly(preset.stableOnly);
  }, [setFamily, setPattern, setLevel, setWaterType, setQuery, setPopularOnly, setStableOnly]);

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

          <div className={`filter-container${filtersOpen ? " open" : ""}${!isMobile && sidebarCollapsed ? " sidebar-collapsed" : ""}`}>
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
              onApplyPreset={handleApplyPreset}
              onClose={isMobile ? () => setFiltersOpen(false) : undefined}
            />
          </div>

          <section className="content-panel">
            <div className="toolbar">
              <div>
                <p className="eyebrow">Species Atlas</p>
                <h2>{viewMode === "3d" ? "3D Solar System" : "Genera, species & documented varieties"}</h2>
              </div>
              <div className="toolbar-actions">
                {!isMobile && (
                  <button
                    className="icon-button"
                    type="button"
                    aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    onClick={() => setSidebarCollapsed(v => !v)}
                    title={sidebarCollapsed ? "Show filters" : "Hide filters"}
                  >
                    {sidebarCollapsed ? (
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="16" height="14" rx="2" />
                        <path d="M7 3v14" />
                        <path d="M11 8l2 2-2 2" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="16" height="14" rx="2" />
                        <path d="M7 3v14" />
                        <path d="M5 8l-2 2 2 2" opacity="0.4" />
                      </svg>
                    )}
                  </button>
                )}
                <ViewToggle mode={viewMode} onChange={setViewMode} />
                <button
                  className="icon-button"
                  type="button"
                  aria-label={expertMode ? "Disable expert mode" : "Enable expert mode"}
                  aria-pressed={expertMode}
                  onClick={() => setExpertMode((v) => !v)}
                  title={expertMode ? "Expert mode: ON" : "Expert mode: OFF"}
                  style={{
                    opacity: expertMode ? 1 : 0.5,
                    transition: "opacity 200ms ease",
                  }}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a1 1 0 0 0-.894.553L8.382 6H5a3 3 0 0 0 0 6h.028a2 2 0 0 0 .2 4h9.544a2 2 0 0 0 .2-4H15a3 3 0 0 0 0-6h-3.382L10.894 2.553A1 1 0 0 0 10 2Z" opacity={expertMode ? 1 : 0.4} />
                  </svg>
                </button>
                <button
                  className="icon-button mobile-filter-toggle"
                  type="button"
                  aria-label={filtersOpen ? "Close filters" : `Open filters${hasActiveFilters ? " (active)" : ""}`}
                  aria-expanded={filtersOpen}
                  onClick={() => setFiltersOpen((v) => !v)}
                  style={{ position: "relative" }}
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
                  {hasActiveFilters && !filtersOpen && (
                    <span className="filter-active-dot" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="view-stage">
              {viewMode === "2d" ? (
                <FamilyOrbitExplorer
                  visibleStrains={visibleStrains}
                  onSelect={setSelectedId}
                  expertMode={expertMode}
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
        onTagFilter={handleTagFilter}
        expertMode={expertMode}
      />
    </>
  );
}
