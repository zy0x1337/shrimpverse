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
          onClick={() => onChange(opt.value)}
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
  onClose,
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
      </div>

      {/* Filters */}
      <div className="filter-panel">
        {/* Search */}
        <div className="filter-section">
          <div className="filter-label">Search</div>
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
          <div className="filter-label">Family</div>
          <div className="family-pills">
            {families.map((fam) => {
              const isActive = state.family === fam;
              const col = fam === "All" ? null : familyColors[fam];
              return (
                <button
                  key={fam}
                  className={`family-pill${isActive ? " active" : ""}`}
                  onClick={() => onFamilyChange(fam)}
                  style={
                    isActive && col
                      ? {
                          background: col,
                          borderColor: col,
                          color: ["Yellow", "White"].includes(fam)
                            ? "#1a1a1a"
                            : "#ffffff",
                          boxShadow: `0 0 10px ${col}55`,
                        }
                      : isActive
                      ? {
                          background: "rgba(232,160,32,0.8)",
                          borderColor: "var(--accent)",
                          color: "#1a1a1a",
                        }
                      : col
                      ? { borderColor: `${col}30` }
                      : {}
                  }
                  aria-pressed={isActive}
                >
                  {fam !== "All" && col && (
                    <span
                      className="family-pill-dot"
                      style={{ background: col }}
                      aria-hidden="true"
                    />
                  )}
                  {fam}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pattern */}
        <div className="filter-section">
          <div className="filter-label">Pattern</div>
          <ButtonGroup
            options={PATTERN_OPTIONS}
            value={state.pattern}
            onChange={onPatternChange}
          />
        </div>

        {/* Level */}
        <div className="filter-section">
          <div className="filter-label">Care level</div>
          <ButtonGroup
            options={LEVEL_OPTIONS}
            value={state.level}
            onChange={onLevelChange}
          />
        </div>

        {/* Water type */}
        <div className="filter-section">
          <div className="filter-label">Water type</div>
          <ButtonGroup
            options={WATER_OPTIONS}
            value={state.waterType}
            onChange={onWaterTypeChange}
          />
        </div>

        {/* Toggles */}
        <div className="filter-section">
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
            style={{ marginTop: "var(--s2)" }}
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
    </div>
  );
}
