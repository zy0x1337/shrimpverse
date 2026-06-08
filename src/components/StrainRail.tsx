import { type Strain } from "../types/strain";
import { familyColors } from "../lib/constants";

interface Props {
  family: string;
  strains: Strain[];
  onSelect: (id: string) => void;
  onClose: () => void;
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
              aria-label={`Open ${strain.name}`}
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
                <div className="strain-card-pop">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={`pop-dot${i < strain.popularity ? " filled" : ""}`} />
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
