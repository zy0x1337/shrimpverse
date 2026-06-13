import { useId, type CSSProperties } from "react";
import type { Strain } from "../types/strain";

interface ShrimpVisualProps {
  strain: Strain;
  className?: string;
}

type BodySection = "head" | "mid" | "tail";

function sectionOpacity(strain: Strain, section: BodySection): number {
  if (strain.pattern === "Rili") {
    if (section === "mid") return 0.22;
    return 0.95;
  }
  if (strain.pattern === "Translucent") return section === "mid" ? 0.42 : 0.62;
  return 0.96;
}

/**
 * Canonical pose (shared by MiniShrimp & ShrimpLogoMark): side profile facing
 * LEFT — arched cephalothorax over the head, six abdominal segment plates
 * curling down-and-right into a uropod fan tail, rostrum spiking forward-up,
 * antennae sweeping up-left, stalked eye at the front.
 *
 * The six abdominal segments live here as data so the Rili "window" overlay
 * can trace a real segment instead of a hand-copied near-duplicate, and the
 * head→mid→tail colour mapping stays in one place.
 */
const ABDOMEN_SEGMENTS: { d: string; section: BodySection }[] = [
  { d: "M142 74 C142 64 194 64 194 74 C190 108 146 108 142 74 Z", section: "mid" },
  { d: "M171 72 C171 62 221 62 221 72 C217 104 175 104 171 72 Z", section: "mid" },
  { d: "M200 74 C200 64 248 64 248 74 C244 104 204 104 200 74 Z", section: "mid" },
  { d: "M229 80 C229 70 273 70 273 80 C269 108 233 108 229 80 Z", section: "tail" },
  { d: "M257 90 C257 80 297 80 297 90 C293 114 261 114 257 90 Z", section: "tail" },
  { d: "M282 102 C282 92 318 92 318 102 C314 122 286 122 282 102 Z", section: "tail" },
];
// The Rili mid-body window traces this segment (a "mid" plate).
const RILI_WINDOW_INDEX = 2;
// Dorsal ridge — shared by the carapace sheen highlight and the Back-stripe overlay.
const DORSAL_LINE = "M62 62 C96 44 140 44 174 64 C206 82 232 86 258 96";

export function ShrimpVisual({ strain, className }: ShrimpVisualProps) {
  const uid = useId().replace(/:/g, "");
  const isMottled = strain.pattern === "Mottled";
  const isBackStripe = strain.pattern === "Back stripe";
  const orangeEyes = strain.id.includes("oe-");

  const shell = (section: BodySection) => {
    const base = strain.colors[section === "tail" ? 2 : section === "mid" ? 1 : 0];
    const opacity = sectionOpacity(strain, section);
    return `color-mix(in srgb, ${base} ${Math.round(opacity * 100)}%, transparent)`;
  };

  const style = {
    "--shrimp-shadow": strain.colors[2],
    "--shrimp-highlight": strain.colors[1],
  } as CSSProperties;

  return (
    <svg
      className={className ? `shrimp-visual ${className}` : "shrimp-visual"}
      style={style}
      viewBox="0 0 420 190"
      role="img"
      aria-label={`${strain.name} specimen illustration`}
    >
      <defs>
        <linearGradient id={`${uid}-sheen`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={`${uid}-ground`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={strain.colors[2]} stopOpacity="0.35" />
          <stop offset="100%" stopColor={strain.colors[0]} stopOpacity="0.12" />
        </linearGradient>
        <filter id={`${uid}-soft`} x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0f1a18" floodOpacity="0.22" />
        </filter>
      </defs>

      <ellipse cx="210" cy="156" rx="118" ry="10" fill={`url(#${uid}-ground)`} />

      <g filter={`url(#${uid}-soft)`}>
        {/* Antennae — sweeping up-left from the head, behind the body */}
        <g className="shrimp-antennae" stroke={strain.colors[2]} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.8">
          <path d="M50 82C24 60 10 38 6 14M58 88C34 70 18 50 12 30" />
          <path d="M64 78C46 60 34 42 28 24M70 82C52 66 40 50 34 34" />
        </g>

        {/* Pereiopods — walking legs, two-jointed, peeking below the belly */}
        <g className="shrimp-legs" stroke={strain.colors[2]} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.72">
          <path d="M88 110 L82 130 L88 148" />
          <path d="M112 116 L106 136 L114 150" />
          <path d="M136 118 L132 138 L140 150" />
          <path d="M160 116 L158 136 L166 148" />
          <path d="M180 110 L184 128 L190 142" />
        </g>

        {/* Pleopods — swimmerets under the abdomen curl */}
        <g className="shrimp-swimmerets" fill={shell("mid")} opacity="0.82">
          <ellipse cx="198" cy="112" rx="5" ry="10" transform="rotate(-16 198 112)" />
          <ellipse cx="224" cy="116" rx="5" ry="10" transform="rotate(-12 224 116)" />
          <ellipse cx="250" cy="120" rx="5" ry="9" transform="rotate(-8 250 120)" />
          <ellipse cx="274" cy="124" rx="4.5" ry="8" transform="rotate(-4 274 124)" />
          <ellipse cx="296" cy="128" rx="4" ry="7" transform="rotate(0 296 128)" />
        </g>

        {/* Uropod fan tail */}
        <path
          className="shrimp-tail-fan"
          d="M316 96 C350 86 382 90 394 104 C384 119 360 128 334 126 C322 124 312 114 316 96 Z"
          fill={shell("tail")}
        />
        <g stroke={strain.colors[2]} strokeWidth="1.6" strokeLinecap="round" opacity="0.45" fill="none">
          <path d="M322 100 L386 98" />
          <path d="M322 108 L388 110" />
          <path d="M324 116 L380 122" />
        </g>

        {/* Abdomen — six overlapping segment plates, posterior drawn first so each
            anterior segment overlaps the next */}
        {ABDOMEN_SEGMENTS.map((_, i) => {
          const s = ABDOMEN_SEGMENTS[ABDOMEN_SEGMENTS.length - 1 - i];
          return <path key={i} className="shrimp-segment" d={s.d} fill={shell(s.section)} />;
        })}

        {/* Carapace (cephalothorax) */}
        <path
          className="shrimp-carapace"
          d="M38 100 C42 66 74 44 118 42 C148 41 170 52 178 74 C182 88 178 102 166 108 C140 122 92 122 60 108 C46 102 38 100 38 100 Z"
          fill={shell("head")}
        />

        {/* Rostrum — serrated snout spiking forward-up */}
        <path
          className="shrimp-rostrum"
          d="M46 84 C30 74 14 62 6 50 C4 58 6 72 16 82 C26 90 38 90 46 84 Z"
          fill={shell("head")}
        />

        {/* Dorsal sheen ridge */}
        <path
          className="shrimp-carapace-sheen"
          d={DORSAL_LINE}
          fill="none"
          stroke={`url(#${uid}-sheen)`}
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Eye on a short stalk */}
        <path d="M62 98 L77 88" stroke={strain.colors[2]} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <circle cx="78" cy="86" r="6" fill={orangeEyes ? "#d97706" : "#101615"} />
        <circle cx="79.8" cy="84.2" r="1.8" fill="#ffffff" opacity="0.85" />

        {/* Back stripe */}
        {isBackStripe ? (
          <path
            d={DORSAL_LINE}
            fill="none"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        ) : null}

        {/* Mottled wild pattern */}
        {isMottled
          ? [
              { cx: 92, cy: 84, rx: 10, ry: 6 },
              { cx: 128, cy: 72, rx: 12, ry: 7 },
              { cx: 158, cy: 90, rx: 9, ry: 5 },
              { cx: 116, cy: 104, rx: 8, ry: 5 },
            ].map((spot, index) => (
              <ellipse
                key={index}
                cx={spot.cx}
                cy={spot.cy}
                rx={spot.rx}
                ry={spot.ry}
                fill={strain.colors[index % 2 === 0 ? 1 : 2]}
                opacity="0.35"
              />
            ))
          : null}

        {/* Rili mid-body window — traces a real mid segment */}
        {strain.pattern === "Rili" ? (
          <path
            d={ABDOMEN_SEGMENTS[RILI_WINDOW_INDEX].d}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.5"
          />
        ) : null}
      </g>
    </svg>
  );
}
