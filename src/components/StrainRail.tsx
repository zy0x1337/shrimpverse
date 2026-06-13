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
 * MiniShrimp — a tiny 12×7 px shrimp silhouette used as a popularity pip.
 *
 * Canonical pose (shared by ShrimpLogoMark & ShrimpVisual): side profile facing
 * LEFT — arched back over the head, abdomen curling down-and-right into a fan
 * tail, antennae sweeping up-left, eye near the front. At pip size only the
 * confident comma body + notched tail fan need to read.
 */
function MiniShrimp({ filled, color }: { filled: boolean; color: string }) {
  const body = filled ? color : "rgba(255,255,255,0.12)";
  const line = filled ? color : "rgba(255,255,255,0.1)";
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* Antennae sweeping up-left from the head */}
      <path d="M2.4 3 Q1 2 0.4 0.6" stroke={line} strokeWidth="0.55" strokeLinecap="round" />
      <path d="M2.6 3.5 Q1.4 2.9 0.7 1.9" stroke={line} strokeWidth="0.5" strokeLinecap="round" />
      {/* Body: rounded head left, arched back, curling to a thin tail base */}
      <path
        d="M2 4.6 C1.6 2.7 3.4 1.7 5.3 1.6 C7.4 1.5 9.1 2.2 9.7 3.8 C9.85 4.1 9.8 4.3 9.5 4.5 C8.2 5.05 4.6 5.3 3 5 C2.4 4.9 2.1 4.85 2 4.6 Z"
        fill={body}
      />
      {/* Fan tail at the right tip */}
      <path
        d="M9.4 3.8 Q11.1 3.1 11.5 3.5 Q10.9 4 11.4 4.7 Q11.1 5 9.7 4.5 Z"
        fill={body}
      />
      {/* Abdomen segment hints — only on the filled (lit) pip */}
      {filled && (
        <>
          <path d="M6 2.1 Q6.1 3 5.8 4.6" stroke="rgba(0,0,0,0.18)" strokeWidth="0.4" strokeLinecap="round" />
          <path d="M7.4 2.4 Q7.5 3.1 7.2 4.4" stroke="rgba(0,0,0,0.18)" strokeWidth="0.4" strokeLinecap="round" />
        </>
      )}
      <circle cx="3" cy="3.4" r="0.7" fill={filled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)"} />
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
