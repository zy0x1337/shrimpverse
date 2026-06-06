import { families, patterns } from "../lib/constants";
import type { FilterState } from "../types/strain";

interface FilterPanelProps {
  state: FilterState;
  stats: { visible: number; popular: number; rili: number };
  onFamilyChange: (family: string) => void;
  onPatternChange: (pattern: string) => void;
  onLevelChange: (level: string) => void;
  onQueryChange: (query: string) => void;
  onPopularOnlyChange: (value: boolean) => void;
  onStableOnlyChange: (value: boolean) => void;
}

export function FilterPanel({
  state,
  stats,
  onFamilyChange,
  onPatternChange,
  onLevelChange,
  onQueryChange,
  onPopularOnlyChange,
  onStableOnlyChange,
}: FilterPanelProps) {
  return (
    <aside className="control-panel">
      <div className="brand-lockup">
        <img src="/assets/neocaridina-mark.svg" width="52" height="52" alt="" />
        <div>
          <p className="eyebrow">Neocaridina davidi</p>
          <h1>Strain Map</h1>
        </div>
      </div>

      <div className="field">
        <label htmlFor="search">Search</label>
        <div className="search-wrap">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
          </svg>
          <input
            id="search"
            type="search"
            placeholder="Blue Dream, Rili, yellow..."
            autoComplete="off"
            value={state.query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label>Color family</label>
        <div className="segmented" role="group" aria-label="Filter by color family">
          {families.map((family) => (
            <button
              key={family}
              className={`filter-chip ${state.family === family ? "active" : ""}`}
              type="button"
              onClick={() => onFamilyChange(family)}
            >
              {family}
            </button>
          ))}
        </div>
      </div>

      <div className="field split">
        <label htmlFor="patternFilter">Pattern</label>
        <select id="patternFilter" value={state.pattern} onChange={(event) => onPatternChange(event.target.value)}>
          <option value="all">All patterns</option>
          {patterns.map((pattern) => (
            <option key={pattern} value={pattern}>
              {pattern}
            </option>
          ))}
        </select>
      </div>

      <div className="field split">
        <label htmlFor="levelFilter">Keeper level</label>
        <select id="levelFilter" value={state.level} onChange={(event) => onLevelChange(event.target.value)}>
          <option value="all">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Collector">Collector</option>
        </select>
      </div>

      <div className="toggles">
        <label className="toggle-row">
          <input
            id="popularOnly"
            type="checkbox"
            checked={state.popularOnly}
            onChange={(event) => onPopularOnlyChange(event.target.checked)}
          />
          <span>Only especially popular strains</span>
        </label>
        <label className="toggle-row">
          <input
            id="stableOnly"
            type="checkbox"
            checked={state.stableOnly}
            onChange={(event) => onStableOnlyChange(event.target.checked)}
          />
          <span>Only color-stable colonies</span>
        </label>
      </div>

      <div className="quick-stats" aria-label="Current selection">
        <div>
          <strong>{stats.visible}</strong>
          <span>visible</span>
        </div>
        <div>
          <strong>{stats.popular}</strong>
          <span>popular</span>
        </div>
        <div>
          <strong>{stats.rili}</strong>
          <span>Rili</span>
        </div>
      </div>
    </aside>
  );
}
