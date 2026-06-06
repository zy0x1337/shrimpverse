import type { FilterState } from "../types/strain";
import { families, patterns } from "../lib/constants";
import { familyColors } from "../lib/constants";

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
}

export function FilterPanel({
  state, stats,
  onFamilyChange, onPatternChange, onLevelChange,
  onQueryChange, onPopularOnlyChange, onStableOnlyChange,
}: Props) {
  return (
    <div className="filter-panel-inner">
      {/* Sidebar header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg className="sidebar-logo-mark" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <circle cx="18" cy="18" r="17" stroke="rgba(47,196,181,0.3)" strokeWidth="0.8" />
            <circle cx="18" cy="18" r="12" stroke="rgba(232,160,32,0.2)" strokeWidth="0.5" strokeDasharray="2 4" />
            <path d="M10 22 Q12 16 18 14 Q24 12 26 16 Q27 20 24 22 Q20 24 16 23 Q12 22 10 22Z" fill="rgba(47,196,181,0.7)" />
            <path d="M10 22 L7 26 M10 22 L9 27 M10 22 L11 27" stroke="rgba(47,196,181,0.5)" strokeWidth="1" strokeLinecap="round" />
            <path d="M22 14 Q26 10 28 8" stroke="rgba(232,160,32,0.6)" strokeWidth="0.7" strokeLinecap="round" fill="none" />
            <path d="M20 14 Q23 9 25 7" stroke="rgba(232,160,32,0.4)" strokeWidth="0.5" strokeLinecap="round" fill="none" />
            <circle cx="23" cy="15" r="1.2" fill="rgba(232,160,32,0.8)" />
          </svg>
          <div>
            <div className="sidebar-subtitle">Neocaridina davidi</div>
            <div className="sidebar-title">Strain Map</div>
          </div>
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
              placeholder="Blue Dream, Rili, Yellow…"
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
                  style={isActive && col ? {
                    background: col,
                    borderColor: col,
                    boxShadow: `0 0 10px ${col}50`,
                  } : isActive ? {
                    background: "rgba(232,160,32,0.8)",
                    borderColor: "var(--accent)",
                  } : {}}
                  aria-pressed={isActive}
                >
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
