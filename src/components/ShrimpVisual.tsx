import type { CSSProperties } from "react";
import type { Strain } from "../types/strain";

interface ShrimpVisualProps {
  strain: Strain;
}

export function ShrimpVisual({ strain }: ShrimpVisualProps) {
  const isRili = strain.pattern === "Rili";
  const isTranslucent = strain.pattern === "Translucent";
  const clearBody = isRili || isTranslucent;

  return (
    <svg
      className="shrimp-visual"
      style={
        {
          "--shrimp-a": strain.colors[0],
          "--shrimp-b": strain.colors[1],
        } as CSSProperties
      }
      viewBox="0 0 320 190"
      role="img"
      aria-label={`${strain.name} shrimp illustration`}
    >
      <path className="tail" d="M252 87c25-27 44-35 58-26-2 20-13 35-34 46 20 10 31 25 33 44-15 8-35-2-58-30Z" />
      <path
        className={`body ${clearBody ? "clear" : ""}`}
        d="M43 103c18-53 78-78 145-57 48 15 78 49 75 80-2 24-32 35-77 30-58-6-111-23-143-53Z"
      />
      <path className="head" d="M28 103c8-27 28-45 58-54 13 18 15 44 4 71-21 4-42-2-62-17Z" />
      <path className="stripe" d="M113 54c-10 24-12 53-5 86M151 48c-9 28-9 61 0 98M190 60c-4 25-2 52 8 80" />
      <path d="M68 80c31-35 69-48 115-39" fill="none" stroke="rgba(255,255,255,.72)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="54" cy="85" r="6" fill={strain.id.includes("oe-") ? "#f29a2d" : "#141817"} />
      <path
        d="M41 84C20 64 8 46 5 29M43 90C23 83 9 74 1 61"
        fill="none"
        stroke="rgba(20,24,23,.58)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M98 145c-15 17-25 30-31 41M139 151c-11 14-17 25-19 34M181 153c-7 12-10 22-10 31M222 145c3 12 8 22 17 32"
        fill="none"
        stroke="rgba(20,24,23,.45)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
