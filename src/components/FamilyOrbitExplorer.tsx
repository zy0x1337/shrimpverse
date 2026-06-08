import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { familyColors, familyGenus } from "../lib/constants";
import type { Strain } from "../types/strain";
import { StrainRail } from "./StrainRail";
import { ShrimpLogoMark } from "./ShrimpLogoMark";

const NEO_ORDER    = ["Red", "Orange", "Yellow", "Green", "Blue", "Black", "Brown", "White"];
const CARIDINA_ORDER = ["Crystal", "Taiwan Bee", "Tiger", "Sulawesi", "Amano", "Bamboo"];
const FAMILY_ORDER = [...NEO_ORDER, ...CARIDINA_ORDER];

const CARIDINA_SET = new Set(CARIDINA_ORDER);

const FAMILY_GLOW: Record<string, string> = {
  Red:          "rgba(216,31,47,0.45)",
  Orange:       "rgba(240,111,29,0.45)",
  Yellow:       "rgba(242,194,48,0.4)",
  Green:        "rgba(21,148,92,0.45)",
  Blue:         "rgba(52,152,219,0.45)",
  Black:        "rgba(180,180,200,0.35)",
  Brown:        "rgba(180,100,40,0.45)",
  White:        "rgba(220,220,240,0.4)",
  Natural:      "rgba(120,180,80,0.4)",
  Crystal:      "rgba(168,212,248,0.55)",
  "Taiwan Bee": "rgba(42,80,224,0.55)",
  Tiger:        "rgba(224,120,32,0.45)",
  Sulawesi:     "rgba(224,24,40,0.60)",
  Amano:        "rgba(122,170,80,0.40)",
  Bamboo:       "rgba(154,112,64,0.40)",
};

const FAMILY_TEXT: Record<string, string> = {
  Red: "#fff", Orange: "#fff", Yellow: "#1a1a1a", Green: "#fff",
  Blue: "#fff", Black: "#fff", Brown: "#fff", White: "#1a1a1a",
  Natural: "#fff", Crystal: "#1a1a1a", "Taiwan Bee": "#fff",
  Tiger: "#fff", Sulawesi: "#fff", Amano: "#fff", Bamboo: "#fff",
};

// Inner ring: Neocaridina — outer ring: Caridina & exotics
const FAMILY_ORBIT_RADIUS: Record<string, number> = {
  Red: 175, Orange: 168, Yellow: 175, Green: 188,
  Blue: 175, Black: 198, Brown: 204, White: 198,
  Natural: 0,
  Crystal: 235, "Taiwan Bee": 248, Tiger: 228,
  Sulawesi: 258, Amano: 220, Bamboo: 216,
};

const VB      = 640;
const NODE_R_BASE = 20;
const NODE_R_MAX  = 34;

function nodeRadius(count: number): number {
  return Math.max(NODE_R_BASE, Math.min(NODE_R_MAX, NODE_R_BASE + count * 2));
}

// Deterministic starfield — two zones: between rings and outside outer ring
const STARS: { x: number; y: number; r: number; op: number }[] = (() => {
  const stars: { x: number; y: number; r: number; op: number }[] = [];
  let seed = 42;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
  // Outer ring stars
  for (let i = 0; i < 110; i++) {
    const angle = rand() * Math.PI * 2;
    const dist  = 278 + rand() * 38;
    stars.push({
      x: Math.round(Math.cos(angle) * dist * 10) / 10,
      y: Math.round(Math.sin(angle) * dist * 10) / 10,
      r: rand() < 0.2 ? 1.4 : rand() < 0.5 ? 1.0 : 0.7,
      op: 0.15 + rand() * 0.48,
    });
  }
  // Between-ring stars (sparse)
  for (let i = 0; i < 20; i++) {
    const angle = rand() * Math.PI * 2;
    const dist  = 212 + rand() * 16;
    stars.push({
      x: Math.round(Math.cos(angle) * dist * 10) / 10,
      y: Math.round(Math.sin(angle) * dist * 10) / 10,
      r: 0.5,
      op: 0.08 + rand() * 0.12,
    });
  }
  return stars;
})();

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (k / 6) * Math.PI * 2 - Math.PI / 6;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

interface Props {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

export function FamilyOrbitExplorer({ visibleStrains, onSelect }: Props) {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const [hovered, setHovered]           = useState<string | null>(null);

  // Build family entries with per-ring angle positions
  const families = useMemo(() => {
    const grouped = new Map<string, Strain[]>();
    for (const s of visibleStrains) {
      if (!grouped.has(s.family)) grouped.set(s.family, []);
      grouped.get(s.family)!.push(s);
    }

    const neoGroup = NEO_ORDER.filter((f) => grouped.has(f));
    const cariGroup = CARIDINA_ORDER.filter((f) => grouped.has(f));

    return FAMILY_ORDER.filter((f) => grouped.has(f)).map((f) => {
      const isC    = CARIDINA_SET.has(f);
      const group  = isC ? cariGroup : neoGroup;
      const idx    = group.indexOf(f);
      const total  = group.length;
      const orbitR = FAMILY_ORBIT_RADIUS[f] ?? 185;
      const angle  = total > 0 ? (idx / total) * 2 * Math.PI - Math.PI / 2 : 0;
      const nx     = Math.cos(angle) * orbitR;
      const ny     = Math.sin(angle) * orbitR;
      return {
        family:     f,
        strains:    grouped.get(f)!,
        color:      familyColors[f]  ?? "#888",
        glow:       FAMILY_GLOW[f]   ?? "rgba(255,255,255,0.3)",
        textColor:  FAMILY_TEXT[f]   ?? "#fff",
        nodeR:      nodeRadius(grouped.get(f)!.length),
        orbitR, angle, nx, ny,
        isCaridina: isC,
      };
    });
  }, [visibleStrains]);

  const activeStrains = activeFamily
    ? families.find((f) => f.family === activeFamily)?.strains ?? []
    : [];

  const handleFamilyClick = useCallback((family: string) => {
    setActiveFamily((prev) => (prev === family ? null : family));
  }, []);

  const neoCount      = visibleStrains.filter((s) => !CARIDINA_SET.has(s.family) && s.family !== "Natural").length;
  const caridineCount = visibleStrains.filter((s) => CARIDINA_SET.has(s.family)).length;
  const totalCount    = visibleStrains.length;

  if (families.length === 0) {
    return (
      <div className="orbit-explorer orbit-explorer--empty">
        <div className="orbit-empty-state">
          <ShrimpLogoMark size={52} accentColor="var(--text-faint)" />
          <p className="orbit-empty-title">No strains match</p>
          <p className="orbit-empty-hint">Try adjusting or clearing a filter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orbit-explorer">
      {/* Stats bar */}
      <div className="orbit-stats" aria-label="Visible strain statistics">
        <div className="orbit-stat">
          <span className="orbit-stat-value">{totalCount}</span>
          <span className="orbit-stat-label">Total</span>
        </div>
        <div className="orbit-stat">
          <span className="orbit-stat-value">{neoCount}</span>
          <span className="orbit-stat-label">Neocaridina</span>
        </div>
        <div className="orbit-stat">
          <span className="orbit-stat-value">{caridineCount}</span>
          <span className="orbit-stat-label">Caridina</span>
        </div>
      </div>

      <AnimatePresence>
        {activeFamily && (
          <motion.div
            key={activeFamily}
            className="orbit-active-label"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ color: familyColors[activeFamily] }}
          >
            {activeFamily}
            {familyGenus[activeFamily] && (
              <span className="orbit-active-genus">{familyGenus[activeFamily]}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        className="orbit-svg"
        viewBox={`${-VB / 2} ${-VB / 2} ${VB} ${VB}`}
        width="100%"
        height="100%"
        aria-label="Shrimpverse — freshwater shrimp species atlas"
      >
        <defs>
          {/* Sun radial gradient */}
          <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,220,60,0.30)" />
            <stop offset="60%"  stopColor="rgba(255,170,20,0.10)" />
            <stop offset="100%" stopColor="rgba(255,140,0,0)" />
          </radialGradient>
          {/* Family glow filters */}
          {families.map((item) => (
            <filter key={`glow-${item.family}`} id={`glow-${item.family}`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          <filter id="sun-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Starfield */}
        <g aria-hidden="true">
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ddd8cc" opacity={s.op} />
          ))}
        </g>

        {/* Inner Neocaridina orbit ring */}
        <motion.circle
          cx="0" cy="0" r={190}
          fill="none"
          stroke="rgba(47,196,181,0.14)"
          strokeWidth="0.6"
          strokeDasharray="4 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        />
        {/* Outer Caridina orbit ring */}
        <motion.circle
          cx="0" cy="0" r={242}
          fill="none"
          stroke="rgba(100,150,255,0.11)"
          strokeWidth="0.6"
          strokeDasharray="3 9"
          animate={{ rotate: -360 }}
          transition={{ duration: 130, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        />

        {/* Spoke lines from center to each node */}
        {families.map((item, i) => {
          const isActive = activeFamily === item.family;
          const isHov    = hovered === item.family;
          return (
            <motion.line
              key={`spoke-${item.family}`}
              x1={0} y1={0} x2={item.nx} y2={item.ny}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.55, delay: i * 0.04, ease: "easeOut" }}
              stroke={
                isActive || isHov
                  ? item.color
                  : item.isCaridina
                  ? "rgba(100,150,255,0.07)"
                  : "rgba(47,196,181,0.07)"
              }
              strokeWidth={isActive ? 0.8 : 0.35}
              style={{ transition: "all 250ms ease" }}
            />
          );
        })}

        {/* Family planet nodes */}
        {families.map((item, i) => {
          const { nx, ny, nodeR: nr, isCaridina } = item;
          const isActive = activeFamily === item.family;
          const isHov    = hovered === item.family;
          const isDimmed = activeFamily !== null && !isActive;

          const labelDist = item.orbitR + nr + 22;
          const lx     = Math.cos(item.angle) * labelDist;
          const ly     = Math.sin(item.angle) * labelDist;
          const anchor = Math.abs(nx) < 10 ? "middle" : nx < 0 ? "end" : "start";

          const topStrain   = [...item.strains].sort((a, b) => b.popularity - a.popularity)[0];
          const swatchColors = topStrain?.colors ?? [];

          return (
            <motion.g
              key={item.family}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: isDimmed ? 0.18 : 1,
                scale: isActive ? 1.15 : isHov ? 1.08 : 1,
              }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 380, damping: 26 }}
              onClick={() => handleFamilyClick(item.family)}
              onHoverStart={() => setHovered(item.family)}
              onHoverEnd={() => setHovered(null)}
              role="button"
              aria-label={`${item.family}, ${item.strains.length} variet${item.strains.length === 1 ? "y" : "ies"}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleFamilyClick(item.family);
              }}
              style={{ cursor: "pointer", transformOrigin: `${nx}px ${ny}px` }}
            >
              {/* Active pulse ring */}
              {isActive && (
                <motion.circle
                  cx={nx} cy={ny} r={nr + 6}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="0.8"
                  initial={{ r: nr + 4, opacity: 0.8 }}
                  animate={{ r: nr + 22, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {/* Hover / active glow */}
              {(isActive || isHov) && (
                <circle
                  cx={nx} cy={ny} r={nr + 7}
                  fill={item.color}
                  opacity={isActive ? 0.18 : 0.10}
                  filter={`url(#glow-${item.family})`}
                />
              )}

              {/* === Sulawesi planetary ring === */}
              {item.family === "Sulawesi" && (
                <>
                  <ellipse
                    cx={nx} cy={ny}
                    rx={nr * 2.2} ry={nr * 0.42}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="1.8"
                    opacity={isDimmed ? 0.06 : isActive ? 0.60 : 0.35}
                    transform={`rotate(-18, ${nx}, ${ny})`}
                  />
                  <ellipse
                    cx={nx} cy={ny}
                    rx={nr * 2.85} ry={nr * 0.55}
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="0.8"
                    opacity={isDimmed ? 0.03 : isActive ? 0.35 : 0.15}
                    transform={`rotate(-18, ${nx}, ${ny})`}
                  />
                </>
              )}

              {/* === Caridina: hexagon node === */}
              {isCaridina ? (
                <polygon
                  points={hexPoints(nx, ny, nr)}
                  fill={item.color}
                  stroke={isActive ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)"}
                  strokeWidth={isActive ? 1.2 : 0.6}
                  filter={isActive || isHov ? `url(#glow-${item.family})` : undefined}
                />
              ) : (
                /* === Neocaridina: circle node === */
                <circle
                  cx={nx} cy={ny} r={nr}
                  fill={item.color}
                  stroke={isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}
                  strokeWidth={isActive ? 1.2 : 0.5}
                  filter={isActive || isHov ? `url(#glow-${item.family})` : undefined}
                />
              )}

              {/* Colour swatches when active */}
              {isActive && swatchColors.length >= 3 && (
                <>
                  {swatchColors.slice(0, 3).map((col, ci) => {
                    const segAngle  = (2 * Math.PI) / 3;
                    const startAngle = ci * segAngle - Math.PI / 2;
                    const endAngle   = startAngle + segAngle - 0.12;
                    const r2 = nr - 5;
                    const x1 = nx + r2 * Math.cos(startAngle);
                    const y1 = ny + r2 * Math.sin(startAngle);
                    const x2 = nx + r2 * Math.cos(endAngle);
                    const y2 = ny + r2 * Math.sin(endAngle);
                    return (
                      <motion.path
                        key={ci}
                        d={`M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2}`}
                        fill="none"
                        stroke={col}
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.9 }}
                        transition={{ duration: 0.35, delay: ci * 0.07, ease: "easeOut" }}
                      />
                    );
                  })}
                </>
              )}

              {/* Letter label inside node */}
              <text
                x={nx} y={ny}
                textAnchor="middle" dominantBaseline="central"
                fontSize={nr > 26 ? "9" : "8"}
                fontWeight="700"
                fontFamily="'IBM Plex Sans', sans-serif"
                fill={item.textColor}
                opacity={isActive ? 0 : 0.95}
                style={{ pointerEvents: "none", userSelect: "none", transition: "opacity 200ms ease" }}
              >
                {item.family[0]}
              </text>

              {/* Strain count badge */}
              <circle
                cx={nx + nr - 2} cy={ny - nr + 2} r={5.5}
                fill="#080c10" stroke={item.color} strokeWidth="0.6"
              />
              <text
                x={nx + nr - 2} y={ny - nr + 2}
                textAnchor="middle" dominantBaseline="central"
                fontSize="3.8" fontWeight="700"
                fontFamily="'IBM Plex Mono', monospace"
                fill={item.color}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {item.strains.length}
              </text>

              {/* Family name label outside ring */}
              <text
                x={lx} y={ly}
                textAnchor={anchor} dominantBaseline="central"
                fontSize={isCaridina ? "5.2" : "5.5"}
                fontWeight={isActive ? "600" : "400"}
                fontFamily="'Cormorant Garamond', serif"
                letterSpacing="0.03em"
                fill={isActive ? item.color : "rgba(221,216,204,0.65)"}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {item.family}
              </text>
            </motion.g>
          );
        })}

        {/* ===== Central golden sun — always visible ===== */}
        <motion.g
          onClick={() => setActiveFamily(null)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          style={{ cursor: "pointer" }}
          role="button"
          aria-label="Shrimpverse — reset to overview"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setActiveFamily(null);
          }}
        >
          {/* Outer diffuse glow */}
          <circle cx="0" cy="0" r="72" fill="url(#sun-grad)" />

          {/* Pulsing corona ring */}
          <motion.circle
            cx="0" cy="0" r="38"
            fill="none"
            stroke="rgba(255,210,70,0.22)"
            strokeWidth="1.2"
            animate={{ r: [38, 52, 38], opacity: [0.4, 0.0, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Ray lines — 8 radiating outward */}
          {Array.from({ length: 8 }, (_, k) => {
            const a  = (k / 8) * Math.PI * 2;
            const r1 = 32, r2 = 44;
            return (
              <line
                key={k}
                x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
                x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
                stroke="rgba(255,215,60,0.45)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            );
          })}

          {/* Core glow halo */}
          <circle cx="0" cy="0" r="30" fill="rgba(255,190,30,0.18)" filter="url(#sun-glow)" />

          {/* Core body */}
          <circle cx="0" cy="0" r="24" fill="#ffe060" filter="url(#sun-glow)" />
          <circle cx="0" cy="0" r="20" fill="#fff27a" />

          {/* Shrimpverse wordmark */}
          <text
            x="0" y="-2"
            textAnchor="middle" dominantBaseline="central"
            fontSize="5.8" fontWeight="700"
            fontFamily="'Cormorant Garamond', serif"
            letterSpacing="0.04em"
            fill="rgba(80,40,0,0.75)"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            Shrimpverse
          </text>
        </motion.g>
      </svg>

      {/* Strain detail rail */}
      <AnimatePresence>
        {activeFamily && activeStrains.length > 0 && (
          <motion.div
            className="orbit-rail-wrapper"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <StrainRail
              family={activeFamily}
              strains={activeStrains}
              onSelect={onSelect}
              onClose={() => setActiveFamily(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
