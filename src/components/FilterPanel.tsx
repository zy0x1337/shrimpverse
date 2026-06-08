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
            <div className="sidebar-subtitle">All freshwater shrimp</div>
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
          <div className="filter-label">Color Family</div>
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
          <select
            className="filter-select"
            value={state.pattern}
            onChange={(e) => onPatternChange(e.target.value)}
          >
            <option value="all">All patterns</option>
            {patterns.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div className="filter-section">
          <div className="filter-label">Care level</div>
          <select
            className="filter-select"
            value={state.level}
            onChange={(e) => onLevelChange(e.target.value)}
          >
            <option value="all">All levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Collector">Collector</option>
          </select>
        </div>

        {/* Water type */}
        <div className="filter-section">
          <div className="filter-label">Water type</div>
          <select
            className="filter-select"
            value={state.waterType}
            onChange={(e) => onWaterTypeChange(e.target.value)}
          >
            <option value="all">All water types</option>
            <option value="hard">Hard — Neocaridina</option>
            <option value="soft">Soft — Caridina &amp; Sulawesi</option>
            <option value="neutral">Neutral — Filter shrimp</option>
          </select>
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
          <label className="filter-checkbox" style={{ marginTop: "var(--s2)" }}>
            <input
              type="checkbox"
              checked={state.stableOnly}
              onChange={(e) => onStableOnlyChange(e.target.checked)}
            />
            Colour-stable colonies only
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="sidebar-stats">
        <div className="stat-cell">
          <span className="stat-value">{stats.visible}</span>
          <span className="stat-label">visible</span>
        </div>
        <div className="stat-cell">
          <span className="stat-value">{stats.popular}</span>
          <span className="stat-label">popular</span>
        </div>
        <div className="stat-cell">
          <span className="stat-value">{stats.rili}</span>
          <span className="stat-label">rili</span>
        </div>
      </div>
    </div>
  );
}
