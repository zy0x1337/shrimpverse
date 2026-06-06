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
        {/* Tail fan */}
        <path
          className="shrimp-tail-fan"
          d="M332 98c18-8 34-10 48-4-6 12-18 22-34 28-10 4-20 4-30 1 8-8 12-16 16-25Z"
          fill={shell("tail")}
        />
        <path
          className="shrimp-segment"
          d="M300 88c14 18 12 38-2 52-8 8-18 12-30 12-10 0-18-4-24-10 18-6 34-18 44-34 8-12 10-24 12-20Z"
          fill={shell("tail")}
        />
        <path
          className="shrimp-segment"
          d="M262 78c10 16 8 34-4 46-8 8-18 12-28 10 12-10 20-22 24-36 4-12 6-22 8-20Z"
          fill={shell("mid")}
        />
        <path
          className="shrimp-segment"
          d="M226 72c8 14 6 30-4 40-8 8-16 11-24 9 10-8 16-18 18-30 2-10 6-20 10-19Z"
          fill={shell("mid")}
        />

        {/* Abdomen */}
        <path
          className="shrimp-abdomen"
          d="M188 68c6 12 4 26-6 36-8 8-16 10-24 8 8-8 12-16 14-26 2-8 10-20 16-18Z"
          fill={shell("mid")}
        />

        {/* Carapace */}
        <path
          className="shrimp-carapace"
          d="M44 102c10-34 42-58 92-62 38-3 72 8 96 34 14 16 18 36 10 54-8 20-28 34-54 38-44 6-88-4-118-28-12-10-20-24-26-36Z"
          fill={shell("head")}
        />
        <path
          className="shrimp-carapace-sheen"
          d="M72 58c28-18 62-22 96-12 24 8 40 24 46 42"
          fill="none"
          stroke={`url(#${uid}-sheen)`}
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Rostrum */}
        <path
          className="shrimp-rostrum"
          d="M34 98c-16-6-28-16-36-30-2 14 4 28 16 38 8 6 18 8 28 6"
          fill={shell("head")}
        />

        {/* Legs */}
        <g className="shrimp-legs" stroke={strain.colors[2]} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.72">
          <path d="M118 118c-10 10-18 22-20 34M142 122c-8 12-12 24-12 36M166 124c-6 10-8 22-8 32M192 122c-4 10-4 20-2 28M214 118c2 8 4 16 8 22" />
          <path d="M128 132c-8 6-14 14-16 22M154 136c-6 6-10 14-10 22M180 136c-4 6-6 12-6 18" />
        </g>

        {/* Antennae */}
        <g className="shrimp-antennae" stroke={strain.colors[2]} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.8">
          <path d="M48 82C18 58 4 34 2 12M54 88C28 72 12 54 6 34" />
          <path d="M62 76C42 58 30 40 24 24M68 80C50 66 38 50 32 36" />
        </g>

        {/* Swimmerets */}
        <g className="shrimp-swimmerets" fill={shell("mid")} opacity="0.85">
          <ellipse cx="236" cy="108" rx="5" ry="9" transform="rotate(-18 236 108)" />
          <ellipse cx="258" cy="112" rx="5" ry="9" transform="rotate(-12 258 112)" />
          <ellipse cx="280" cy="114" rx="5" ry="9" transform="rotate(-8 280 114)" />
        </g>

        {/* Eye */}
        <circle cx="78" cy="86" r="5.5" fill={orangeEyes ? "#d97706" : "#101615"} />
        <circle cx="79.5" cy="84.5" r="1.6" fill="#ffffff" opacity="0.85" />

        {/* Back stripe */}
        {isBackStripe ? (
          <path
            d="M98 52c36-8 72-4 104 12 30 14 48 34 54 58"
            fill="none"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        ) : null}

        {/* Mottled wild pattern */}
        {isMottled
          ? [
              { cx: 118, cy: 88, rx: 10, ry: 6 },
              { cx: 156, cy: 76, rx: 12, ry: 7 },
              { cx: 198, cy: 82, rx: 9, ry: 5 },
              { cx: 142, cy: 102, rx: 8, ry: 5 },
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

        {/* Rili mid-body window */}
        {strain.pattern === "Rili" ? (
          <path
            d="M214 72c8 14 6 30-4 40-8 8-16 11-24 9 10-8 16-18 18-30 2-10 6-20 10-19Z"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.5"
          />
        ) : null}
      </g>
    </svg>
  );
}
