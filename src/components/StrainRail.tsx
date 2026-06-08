import { type Strain } from "../types/strain";
import { familyColors } from "../lib/constants";

interface Props {
  family: string;
  strains: Strain[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

/**
 * MiniShrimp — a tiny 12×6 px shrimp silhouette used as a popularity pip.
 * `filled` controls whether it uses the accent color or the faint dim color.
 */
function MiniShrimp({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* Carapace */}
      <path
        d="M1.5 4.5 Q2 2 5 1.5 Q8 1 9 2.8 Q9.5 4 8 4.8 Q6 5.5 4 5 Q2 4.6 1.5 4.5Z"
        fill={filled ? color : "rgba(255,255,255,0.12)"}
      />
      {/* Tail */}
      <path
        d="M8 4.6 Q10 4 11.5 5"
        stroke={filled ? color : "rgba(255,255,255,0.1)"}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Antenna */}
      <path
        d="M2.5 2.5 Q1 1 0.5 0"
        stroke={filled ? color : "rgba(255,255,255,0.1)"}
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      {/* Eye */}
      <circle cx="2.8" cy="3.4" r="0.7" fill={filled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)"} />
    </svg>
  );
}

export function StrainRail({ family, strains, onSelect, onClose }: Props) {
  const color = familyColors[family] ?? "#888";

  return (
    <div className="strain-rail">
      <div className="strain-rail-header">
        <div className="strain-rail-family">
          <span className="strain-rail-dot" style={{ background: color, boxShadow: `0 0 8px ${color}60` }} />
          <span className="strain-rail-name">{family}</span>
          <span className="strain-rail-count">{strains.length} strain{strains.length === 1 ? "" : "s"}</span>
        </div>
        <button
          className="rail-close"
          onClick={onClose}
          aria-label="Close strain list"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </div>

      {/* Scroll hint gradient is handled via CSS ::after */}
      <div className="strain-rail-scroll-wrap">
        <div className="strain-rail-scroll" role="list">
          {strains.map((strain) => (
            <button
              key={strain.id}
              className="strain-card"
              onClick={() => onSelect(strain.id)}
              role="listitem"
              aria-label={`Open ${strain.name}, popularity ${strain.popularity} of 5`}
              aria-pressed="false"
              style={{ "--card-accent": color } as React.CSSProperties}
            >
              <div className="strain-card-swatch">
                {strain.colors.map((c, i) => (
                  <span key={i} className="strain-card-swatch-seg" style={{ background: c }} />
                ))}
              </div>
              <div className="strain-card-name">{strain.name}</div>
              <div className="strain-card-meta">
                <span className="strain-card-level">{strain.level}</span>
                {/* Mini-shrimp popularity indicator */}
                <div
                  className="strain-card-pop"
                  role="img"
                  aria-label={`Popularity: ${strain.popularity} out of 5`}
                  style={{ display: "flex", gap: "2px", alignItems: "center", marginTop: "2px" }}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <MiniShrimp key={i} filled={i < strain.popularity} color={color} />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
