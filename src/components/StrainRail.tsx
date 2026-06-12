import { useEffect, useRef } from "react";
import { type Strain } from "../types/strain";
import { familyColors } from "../lib/constants";

interface Props {
  family: string;
  strains: Strain[];
  onSelect: (id: string) => void;
  onClose: () => void;
  orientation?: "horizontal" | "vertical";
}

/**
 * MiniShrimp — a tiny 12×6 px shrimp silhouette used as a popularity pip.
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
      <path
        d="M1.5 4.5 Q2 2 5 1.5 Q8 1 9 2.8 Q9.5 4 8 4.8 Q6 5.5 4 5 Q2 4.6 1.5 4.5Z"
        fill={filled ? color : "rgba(255,255,255,0.12)"}
      />
      <path
        d="M8 4.6 Q10 4 11.5 5"
        stroke={filled ? color : "rgba(255,255,255,0.1)"}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M2.5 2.5 Q1 1 0.5 0"
        stroke={filled ? color : "rgba(255,255,255,0.1)"}
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <circle cx="2.8" cy="3.4" r="0.7" fill={filled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)"} />
    </svg>
  );
}

/** Swatch segment with hover hex-label */
function SwatchSeg({ color }: { color: string }) {
  return (
    <span
      className="strain-card-swatch-seg"
      style={{ background: color, "--swatch-hex": `"${color}"` } as React.CSSProperties}
      data-hex={color}
    />
  );
}

/** Strain card — swatch, name, level and popularity. Click opens the detail
 *  dialog directly (the factoid lives in the dialog, so nothing is lost). */
function StrainCard({
  strain,
  color,
  onSelect,
}: {
  strain: Strain;
  color: string;
  onSelect: () => void;
}) {
  return (
    <button
      className="strain-card"
      onClick={onSelect}
      aria-label={`Open ${strain.name}, popularity ${strain.popularity} of 5`}
      style={{ "--card-accent": color } as React.CSSProperties}
    >
      <div className="strain-card-face">
        <div className="strain-card-swatch">
          {strain.colors.map((c, i) => (
            <SwatchSeg key={i} color={c} />
          ))}
        </div>
        <div className="strain-card-name">{strain.name}</div>
        <div className="strain-card-meta">
          <span className="strain-card-level">{strain.level}</span>
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
      </div>
    </button>
  );
}

export function StrainRail({ family, strains, onSelect, onClose, orientation = "horizontal" }: Props) {
  const color = familyColors[family] ?? "#888";
  const isVertical = orientation === "vertical";
  const scrollRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0, top: 0, behavior: "instant" });
  }, [family]);

  return (
    <div className={`strain-rail${isVertical ? " strain-rail--vertical" : ""}`}>
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

      <div className="strain-rail-scroll-wrap">
        <ul className="strain-rail-scroll" ref={scrollRef}>
          {strains.map((strain) => (
            <li key={strain.id} style={{ listStyle: "none" }}>
              <StrainCard
                strain={strain}
                color={color}
                onSelect={() => onSelect(strain.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
