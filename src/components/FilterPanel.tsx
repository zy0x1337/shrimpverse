import type { ReactNode } from "react";
import type { FilterState } from "../types/strain";
import { families, patterns } from "../lib/constants";
import { familyColors } from "../lib/constants";
import { ShrimpLogoMark } from "./ShrimpLogoMark";

interface Stats {
  visible: number;
  popular: number;
  rili: number;
}

interface Props {
  state: FilterState;
  stats: Stats;
  onFamilyChange: (f: string) => void;
  onPatternChange: (p: string) => void;
  onLevelChange: (l: string) => void;
  onQueryChange: (q: string) => void;
  onPopularOnlyChange: (v: boolean) => void;
  onStableOnlyChange: (v: boolean) => void;
  onWaterTypeChange: (v: string) => void;
  onShowBreedingArcsChange: (v: boolean) => void;
  onShowTaxonomyStatusChange: (v: boolean) => void;
  onShowHybridOriginChange: (v: boolean) => void;
  onShowConservationStatusChange: (v: boolean) => void;
  onApplyPreset: (preset: Partial<FilterState>) => void;
  /** Number of active *filters* (display/Lens toggles excluded) */
  activeFilterCount: number;
  /** Reset every filter, preserving the Lens (display) toggles */
  onClearAll: () => void;
  onClose?: () => void;
}

const LEVEL_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Collector", label: "Collector" },
];

const WATER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "hard", label: "Hard", title: "Hard water — ideal for Neocaridina (Cherry, Blue Dream, etc.)" },
  { value: "soft", label: "Soft", title: "Soft water — required for Caridina & Sulawesi species" },
  { value: "neutral", label: "Neutral", title: "Neutral water — filter shrimp like Bamboo & Vampire" },
];

const PATTERN_OPTIONS = [
  { value: "all", label: "All" },
  ...patterns.map((p) => ({ value: p, label: p })),
];

type IconProps = { className?: string };
const ICON_BASE = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/**
 * Orbital-ring progression glyph — a central node with N rings around it.
 * Used to grade the guided-path presets (1 = Beginner … 3 = Collector) in the
 * same orbit language as the atlas itself, instead of stock signal bars.
 */
function OrbitRingsIcon({ rings, className }: IconProps & { rings: 1 | 2 | 3 }) {
  return (
    <svg className={className} {...ICON_BASE}>
      <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="8" cy="8" r="3.2" />
      {rings >= 2 && <circle cx="8" cy="8" r="5" opacity="0.7" />}
      {rings >= 3 && <circle cx="8" cy="8" r="6.8" opacity="0.45" />}
    </svg>
  );
}

/** Instrument reticle / lens — marks the "Lens" (reading-options) zone. */
function LensIcon({ className }: IconProps) {
  return (
    <svg className={className} {...ICON_BASE}>
      <circle cx="8" cy="8" r="5.4" />
      <circle cx="8" cy="8" r="1.4" />
      <path d="M8 0.9v2.1M8 13v2.1M0.9 8h2.1M13 8h2.1" />
    </svg>
  );
}

const GUIDED_PATHS = [
  {
    id: "beginner",
    rings: 1 as const,
    label: "Beginner",
    title: "Easy Neocaridina varieties — hard water, beginner-friendly",
    preset: { level: "Beginner", waterType: "hard", family: "All", pattern: "all", query: "" },
  },
  {
    id: "intermediate",
    rings: 2 as const,
    label: "Intermediate",
    title: "Caridina & soft-water varieties for experienced keepers",
    preset: { level: "Intermediate", waterType: "soft", family: "All", pattern: "all", query: "" },
  },
  {
    id: "collector",
    rings: 3 as const,
    label: "Collector",
    title: "Collector-level rarities — Sulawesi, Taiwan Bee, extreme grades",
    preset: { level: "Collector", waterType: "soft", family: "All", pattern: "all", query: "" },
  },
] as const;

function isPresetActive(state: FilterState, preset: Partial<FilterState>): boolean {
  return (
    state.level === preset.level &&
    state.waterType === preset.waterType &&
    state.family === preset.family &&
    state.pattern === preset.pattern
  );
}

/** Almanac-style section label with an optional catalog index marker. */
function SectionLabel({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <div className="filter-label">
      {index && <span className="filter-label-index" aria-hidden="true">{index}</span>}
      <span>{children}</span>
    </div>
  );
}

function ButtonGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; title?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="btn-group" role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`btn-group-item${value === opt.value ? " active" : ""}`}
          onClick={() => onChange(opt.value === value ? "all" : opt.value)}
          aria-pressed={value === opt.value}
          title={opt.title}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function FilterPanel({
  state, stats,
  onFamilyChange, onPatternChange, onLevelChange,
  onQueryChange, onPopularOnlyChange, onStableOnlyChange,
  onWaterTypeChange,
  onShowBreedingArcsChange, onShowTaxonomyStatusChange,
  onShowHybridOriginChange, onShowConservationStatusChange,
  onApplyPreset, activeFilterCount, onClearAll, onClose,
}: Props) {
  const activeFamilyColor =
    state.family !== "All" ? familyColors[state.family] : null;

  return (
    <div className="filter-panel-inner">
      {/* Sidebar header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <ShrimpLogoMark
            className="sidebar-logo-mark"
            accentColor={activeFamilyColor ?? "var(--teal)"}
          />
          <div style={{ flex: 1 }}>
            <div className="sidebar-subtitle">A community atlas</div>
            <div className="sidebar-title">Shrimpverse</div>
          </div>
          {/* Mobile close button */}
          {onClose && (
            <button
              className="sidebar-close-btn"
              onClick={onClose}
              aria-label="Close filters"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          )}
        </div>

        {/* Active-filter ledger line — only when something is filtering */}
        {activeFilterCount > 0 && (
          <div className="sidebar-filter-summary">
            <span className="filter-summary-count">
              <span className="filter-summary-num">{activeFilterCount}</span>
              {activeFilterCount === 1 ? "filter active" : "filters active"}
            </span>
            <button
              type="button"
              className="clear-all-btn"
              onClick={onClearAll}
              aria-label="Clear all filters"
            >
              Clear all
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filter-panel">

        {/* Guided Paths */}
        <div className="filter-section">
          <SectionLabel>Browse by level</SectionLabel>
          <div className="guided-paths" role="group" aria-label="Guided filter presets">
            {GUIDED_PATHS.map((path) => {
              const active = isPresetActive(state, path.preset);
              return (
                <button
                  key={path.id}
                  className={`guided-path-btn${active ? " active" : ""}`}
                  onClick={() => onApplyPreset(active ? { level: "all", waterType: "all", family: "All", pattern: "all", query: "" } : path.preset)}
                  aria-pressed={active}
                  title={path.title}
                >
                  <OrbitRingsIcon rings={path.rings} />
                  <span>{path.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="filter-section">
          <SectionLabel index="01">Search</SectionLabel>
          <div className="filter-search">
            <svg className="filter-search-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5l3 3" />
            </svg>
            <input
              type="search"
              placeholder="Blue Bolt, Cardinal, Cherry…"
              value={state.query}
              onChange={(e) => onQueryChange(e.target.value)}
              aria-label="Search strains"
            />
          </div>
        </div>

        {/* Color family pills */}
        <div className="filter-section">
          <SectionLabel index="02">Family</SectionLabel>
          <div className="family-pills">
            {families.map((fam) => {
              const isActive = state.family === fam;
              const col = fam === "All" ? null : familyColors[fam];
              return (
                <button
                  key={fam}
                  className="family-pill"
                  onClick={() => onFamilyChange(fam)}
                  style={col ? ({ ["--pill" as string]: col }) : undefined}
                  data-active={isActive}
                  data-dark-text={["Yellow", "White"].includes(fam)}
                  aria-pressed={isActive}
                >
                  {fam !== "All" && col && (
                    <span className="family-pill-dot" aria-hidden="true" />
                  )}
                  {fam}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pattern */}
        <div className="filter-section">
          <SectionLabel index="03">Pattern</SectionLabel>
          <ButtonGroup
            options={PATTERN_OPTIONS}
            value={state.pattern}
            onChange={onPatternChange}
          />
        </div>

        {/* Level */}
        <div className="filter-section">
          <SectionLabel index="04">Care level</SectionLabel>
          <ButtonGroup
            options={LEVEL_OPTIONS}
            value={state.level}
            onChange={onLevelChange}
          />
        </div>

        {/* Water type */}
        <div className="filter-section">
          <SectionLabel index="05">Water type</SectionLabel>
          <ButtonGroup
            options={WATER_OPTIONS}
            value={state.waterType}
            onChange={onWaterTypeChange}
          />
        </div>

        {/* Refine */}
        <div className="filter-section">
          <SectionLabel index="06">Refine</SectionLabel>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={state.popularOnly}
              onChange={(e) => onPopularOnlyChange(e.target.checked)}
            />
            Popular strains only
          </label>
          <label
            className="filter-checkbox"
            title="Hides project lines where offspring color varies widely"
          >
            <input
              type="checkbox"
              checked={state.stableOnly}
              onChange={(e) => onStableOnlyChange(e.target.checked)}
            />
            Color-stable only
          </label>
        </div>

        {/* Lens — reading/display options (do NOT change the result count) */}
        <div className="filter-lens-group">
          <div className="filter-lens-head">
            <LensIcon className="filter-lens-icon" />
            <span className="filter-lens-title">Lens</span>
            <span className="filter-lens-hint">Reading options — doesn&rsquo;t change results</span>
          </div>

          <div className="filter-lens-sublabel">On the map</div>
          <label
            className="filter-checkbox"
            title="Show cross-breeding outcome labels on the orbit arcs when two families are selected"
          >
            <input
              type="checkbox"
              checked={state.showBreedingArcs}
              onChange={(e) => onShowBreedingArcsChange(e.target.checked)}
            />
            Breeding outcome labels
          </label>

          <div className="filter-lens-sublabel">In the strain profile</div>
          <label
            className="filter-checkbox"
            title="Show the scientific classification status (accepted, disputed, synonym, uncertain) in the strain profile"
          >
            <input
              type="checkbox"
              checked={state.showTaxonomyStatus}
              onChange={(e) => onShowTaxonomyStatusChange(e.target.checked)}
            />
            Taxonomy status
          </label>
          <label
            className="filter-checkbox"
            title="Show genetics & breeding notes for cultivar lines with documented hybrid ancestry"
          >
            <input
              type="checkbox"
              checked={state.showHybridOrigin}
              onChange={(e) => onShowHybridOriginChange(e.target.checked)}
            />
            Hybrid origin
          </label>
          <label
            className="filter-checkbox"
            title="Show IUCN or endemic conservation notes in the strain profile"
          >
            <input
              type="checkbox"
              checked={state.showConservationStatus}
              onChange={(e) => onShowConservationStatusChange(e.target.checked)}
            />
            Conservation status
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="sidebar-stats">
        <div className="stat-cell" title="Strains currently matching your filters">
          <span className="stat-value">{stats.visible}</span>
          <span className="stat-label">Shown</span>
        </div>
        <div className="stat-cell" title="Well-loved strains with a popularity rating of 4 or 5 out of 5">
          <span className="stat-value">{stats.popular}</span>
          <span className="stat-label">Popular</span>
        </div>
        <div
          className="stat-cell"
          title="Rili varieties — shrimp with a transparent mid-section, leaving color only at the head and tail"
        >
          <span className="stat-value">{stats.rili}</span>
          <span className="stat-label">Rili</span>
        </div>
      </div>

      {/* Gift note — the one sentence that explains why this exists */}
      <div className="sidebar-gift-note" aria-label="About Shrimpverse">
        <svg
          className="sidebar-gift-note-icon"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 16c-3 0-5-2.5-5-5.5S8 4 10 4s5 2.5 5 5.5" />
          <path d="M10 16c1.5 0 3-1 3-2.5" />
          <path d="M7.5 5.5C6.5 4 5.5 3.5 4.5 3.5" />
          <path d="M9 5C8.5 3.5 8.5 2.5 9 2" />
        </svg>
        <p>A free, open-source gift to the freshwater shrimp community.</p>
      </div>

      {/* Mobile-only sticky action bar (HUD pill): clear + dismiss with live count */}
      {onClose && (
        <div className="filter-sticky-bar">
          {activeFilterCount > 0 && (
            <button type="button" className="filter-sticky-clear" onClick={onClearAll}>
              Clear all
            </button>
          )}
          <button
            type="button"
            className={`filter-sticky-show${stats.visible === 0 ? " is-empty" : ""}`}
            onClick={onClose}
          >
            {stats.visible === 0
              ? "No matches"
              : `Show ${stats.visible} result${stats.visible === 1 ? "" : "s"}`}
          </button>
        </div>
      )}
    </div>
  );
}
