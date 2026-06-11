import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { familyColors, familyGenus, familyDescriptions } from "../lib/constants";
import type { Strain } from "../types/strain";
import { StrainRail } from "./StrainRail";
import { ShrimpLogoMark } from "./ShrimpLogoMark";
import { useIsMobile } from "../hooks/useIsMobile";

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

// ---------------------------------------------------------------------------
// Phase 3 — Breeding relationship arcs
// ---------------------------------------------------------------------------
type ArcType = "crosses" | "hybrid" | "impossible";

const FAMILY_ARCS: Array<{
  from: string;
  to: string;
  type: ArcType;
  label: string;
}> = [
  { from: "Crystal",    to: "Taiwan Bee", type: "crosses",    label: "Crystal × TB → Panda / King Kong" },
  { from: "Crystal",    to: "Tiger",      type: "hybrid",     label: "Crystal × Tiger → Taitibee" },
  { from: "Taiwan Bee", to: "Tiger",      type: "hybrid",     label: "TB × Tiger → mixed offspring" },
  { from: "Sulawesi",   to: "Crystal",    type: "impossible", label: "No crossing possible" },
  { from: "Sulawesi",   to: "Taiwan Bee", type: "impossible", label: "No crossing possible" },
];

const ARC_COLOR: Record<ArcType, string> = {
  crosses:    "rgba(47,196,181,0.30)",
  hybrid:     "rgba(255,196,80,0.25)",
  impossible: "rgba(180,60,60,0.22)",
};

const ARC_COLOR_ACTIVE: Record<ArcType, string> = {
  crosses:    "rgba(47,196,181,0.70)",
  hybrid:     "rgba(255,196,80,0.65)",
  impossible: "rgba(220,80,80,0.65)",
};

/**
 * Quadratic Bézier arc between two points on a circle.
 * Control point is pushed OUTWARD to prevent inward-collapse on adjacent nodes.
 * curvature = fraction of radius to add beyond the ring edge.
 */
function getArcPath(
  fromAngle: number,
  toAngle: number,
  radius: number,
  curvature = 0.38,
): string {
  const x1 = radius * Math.cos(fromAngle);
  const y1 = radius * Math.sin(fromAngle);
  const x2 = radius * Math.cos(toAngle);
  const y2 = radius * Math.sin(toAngle);
  // Midpoint angle — push control point outward by (1 + curvature)
  const midAngle = (fromAngle + toAngle) / 2;
  // If the two angles are more than π apart, flip the midpoint to the near side
  const delta = ((toAngle - fromAngle + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  const effectiveMid = fromAngle + delta / 2;
  const mx = radius * (1 + curvature) * Math.cos(effectiveMid);
  const my = radius * (1 + curvature) * Math.sin(effectiveMid);
  void midAngle; // effectiveMid handles all cases including wraparound
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${mx.toFixed(2)} ${my.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Starfield (deterministic)
// ---------------------------------------------------------------------------
const STARS: { x: number; y: number; r: number; op: number }[] = (() => {
  const stars: { x: number; y: number; r: number; op: number }[] = [];
  let seed = 42;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
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
  const [railOpen, setRailOpen]         = useState(false);
  const [hovered, setHovered]           = useState<string | null>(null);
  const [sunHovered, setSunHovered]     = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const isMobile = useIsMobile();

  const families = useMemo(() => {
    const grouped = new Map<string, Strain[]>();
    for (const s of visibleStrains) {
      if (!grouped.has(s.family)) grouped.set(s.family, []);
      grouped.get(s.family)!.push(s);
    }

    const neoGroup  = NEO_ORDER.filter((f) => grouped.has(f));
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
    setHasInteracted(true);
    setActiveFamily((prev) => {
      if (prev === family) { setRailOpen(false); return null; }
      setRailOpen(false);
      return family;
    });
  }, []);

  const neoCount      = visibleStrains.filter((s) => !CARIDINA_SET.has(s.family)).length;
  const caridineCount = visibleStrains.filter((s) => CARIDINA_SET.has(s.family)).length;
  const totalCount    = visibleStrains.length;

  const firstFamily = families[0];

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

  const railAnimation = isMobile
    ? { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } }
    : { initial: { width: 0, opacity: 0 }, animate: { width: 260, opacity: 1 }, exit: { width: 0, opacity: 0 } };

  // Arc radius sits between inner (190) and outer (242) orbit rings
  const ARC_RADIUS = 213;

  return (
    <div className="orbit-layout">
      <div className="orbit-explorer" style={activeFamily && isMobile && railOpen ? { paddingBottom: "138px" } : undefined}>

        {/* Stats bar */}
        <div className="orbit-stats" aria-label="Visible strain statistics">
          <p className="orbit-stats-sentence">
            <span className="orbit-stats-neo">{neoCount}</span>
            {" Neocaridina · "}
            <span className="orbit-stats-cari">{caridineCount}</span>
            {" Caridina"}
            {totalCount < neoCount + caridineCount && (
              <span className="orbit-stats-filtered"> · {totalCount} filtered</span>
            )}
          </p>
        </div>

        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {activeFamily
            ? `${activeFamily} family selected, ${families.find(f => f.family === activeFamily)?.strains.length ?? 0} varieties`
            : ""}
        </div>

        {/* Active family HUD */}
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
              {familyDescriptions[activeFamily] && (
                <motion.span
                  className="orbit-active-desc"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.22 }}
                >
                  {familyDescriptions[activeFamily]}
                </motion.span>
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

            {/* === Phase 3: Water-type background rings === */}
            {/* Amber tint for inner Neocaridina zone (hard water) */}
            <radialGradient id="neo-water" cx="0" cy="0" r="208"
              gradientUnits="userSpaceOnUse">
              <stop offset="30%" stopColor="transparent" />
              <stop offset="70%" stopColor="rgba(180,140,60,0.06)" />
              <stop offset="100%" stopColor="rgba(180,140,60,0.0)" />
            </radialGradient>
            {/* Blue tint for outer Caridina zone (soft water / Sulawesi alkaline) */}
            <radialGradient id="cari-water" cx="0" cy="0" r="276"
              gradientUnits="userSpaceOnUse">
              <stop offset="55%" stopColor="transparent" />
              <stop offset="85%" stopColor="rgba(47,130,196,0.06)" />
              <stop offset="100%" stopColor="rgba(47,130,196,0.0)" />
            </radialGradient>

            {/* Shared glow filters */}
            <filter id="node-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="sun-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* === Phase 3: Water-type background rings (rendered first, behind everything) === */}
          <circle cx="0" cy="0" r="208" fill="url(#neo-water)"  aria-hidden="true" />
          <circle cx="0" cy="0" r="276" fill="url(#cari-water)" aria-hidden="true" />

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

          {/* === Phase 3: Breeding relationship arcs === */}
          <g aria-hidden="true">
            {FAMILY_ARCS.map((arc) => {
              const fromNode = families.find((n) => n.family === arc.from);
              const toNode   = families.find((n) => n.family === arc.to);
              if (!fromNode || !toNode) return null;

              const isHighlighted =
                activeFamily === arc.from || activeFamily === arc.to;
              const isDimmed =
                activeFamily !== null && !isHighlighted;

              return (
                <g key={`arc-${arc.from}-${arc.to}`}>
                  <motion.path
                    d={getArcPath(fromNode.angle, toNode.angle, ARC_RADIUS)}
                    stroke={isHighlighted ? ARC_COLOR_ACTIVE[arc.type] : ARC_COLOR[arc.type]}
                    strokeWidth={isHighlighted ? 1.6 : 0.9}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={arc.type === "impossible" ? "4 4" : undefined}
                    animate={{ opacity: isDimmed ? 0.12 : isHighlighted ? 1 : 0.7 }}
                    transition={{ duration: 0.25 }}
                    whileHover={{ strokeWidth: 2.2, opacity: 1 }}
                  />
                  <title>{arc.label}</title>
                </g>
              );
            })}
          </g>

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

            const topStrain    = [...item.strains].sort((a, b) => b.popularity - a.popularity)[0];
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
                {(isActive || isHov) && (
                  <circle
                    cx={nx} cy={ny} r={nr + 7}
                    fill={item.color}
                    opacity={isActive ? 0.18 : 0.10}
                    filter="url(#node-glow)"
                  />
                )}
                {item.family === "Sulawesi" && (
                  <>
                    <ellipse cx={nx} cy={ny} rx={nr * 2.2} ry={nr * 0.42}
                      fill="none" stroke={item.color} strokeWidth="1.8"
                      opacity={isDimmed ? 0.06 : isActive ? 0.60 : 0.35}
                      transform={`rotate(-18, ${nx}, ${ny})`}
                    />
                    <ellipse cx={nx} cy={ny} rx={nr * 2.85} ry={nr * 0.55}
                      fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"
                      opacity={isDimmed ? 0.03 : isActive ? 0.35 : 0.15}
                      transform={`rotate(-18, ${nx}, ${ny})`}
                    />
                  </>
                )}
                {isCaridina ? (
                  <polygon
                    points={hexPoints(nx, ny, nr)}
                    fill={item.color}
                    stroke={isActive ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)"}
                    strokeWidth={isActive ? 1.2 : 0.6}
                    filter={isActive || isHov ? "url(#node-glow)" : undefined}
                  />
                ) : (
                  <circle
                    cx={nx} cy={ny} r={nr}
                    fill={item.color}
                    stroke={isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}
                    strokeWidth={isActive ? 1.2 : 0.5}
                    filter={isActive || isHov ? "url(#node-glow)" : undefined}
                  />
                )}
                {isActive && swatchColors.length >= 3 && (
                  <>
                    {swatchColors.slice(0, 3).map((col, ci) => {
                      const segAngle   = (2 * Math.PI) / 3;
                      const startAngle = ci * segAngle - Math.PI / 2;
                      const endAngle   = startAngle + segAngle - 0.12;
                      const r2 = nr - 5;
                      const x1 = nx + r2 * Math.cos(startAngle);
                      const y1 = ny + r2 * Math.sin(startAngle);
                      const x2 = nx + r2 * Math.cos(endAngle);
                      const y2 = ny + r2 * Math.sin(endAngle);
                      return (
                        <motion.path key={ci}
                          d={`M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2}`}
                          fill="none" stroke={col} strokeWidth="3" strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.9 }}
                          transition={{ duration: 0.35, delay: ci * 0.07, ease: "easeOut" }}
                        />
                      );
                    })}
                  </>
                )}
                <text
                  x={nx} y={ny}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={nr > 26 ? "9" : "8"} fontWeight="700"
                  fontFamily="'IBM Plex Sans', sans-serif"
                  fill={item.textColor}
                  opacity={isActive ? 0 : 0.95}
                  style={{ pointerEvents: "none", userSelect: "none", transition: "opacity 200ms ease" }}
                >
                  {item.family[0]}
                </text>
                <circle cx={nx + nr - 2} cy={ny - nr + 2} r={5.5}
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
                {!isMobile && (
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
                )}
              </motion.g>
            );
          })}

          {/* First-visit onboarding hint */}
          <AnimatePresence>
            {!hasInteracted && firstFamily && (
              <motion.g
                key="onboarding-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={{ delay: 1.4, duration: 0.7 }}
                aria-hidden="true"
                style={{ pointerEvents: "none" }}
              >
                <motion.circle
                  cx={firstFamily.nx} cy={firstFamily.ny} r={firstFamily.nodeR + 16}
                  fill="none"
                  stroke="rgba(232,160,32,0.55)"
                  strokeWidth="0.8"
                  strokeDasharray="4 5"
                  animate={{
                    r: [firstFamily.nodeR + 16, firstFamily.nodeR + 28, firstFamily.nodeR + 16],
                    opacity: [0.55, 0.0, 0.55],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <text
                  x="0" y="300"
                  textAnchor="middle"
                  fontSize="5.5"
                  fontFamily="'IBM Plex Mono', monospace"
                  letterSpacing="0.14em"
                  fill="rgba(221,216,204,0.32)"
                >
                  CLICK ANY PLANET TO EXPLORE
                </text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Central golden sun */}
          <motion.g
            onClick={() => { setActiveFamily(null); setRailOpen(false); }}
            onHoverStart={() => setSunHovered(true)}
            onHoverEnd={() => setSunHovered(false)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            style={{ cursor: "pointer" }}
            role="button"
            aria-label="Shrimpverse — reset to overview"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { setActiveFamily(null); setRailOpen(false); }
            }}
          >
            <circle cx="0" cy="0" r="72" fill="url(#sun-grad)" />
            <motion.circle
              cx="0" cy="0" r="38"
              fill="none" stroke="rgba(255,210,70,0.22)" strokeWidth="1.2"
              animate={{ r: [38, 52, 38], opacity: [0.4, 0.0, 0.4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {Array.from({ length: 8 }, (_, k) => {
              const a  = (k / 8) * Math.PI * 2;
              const r1 = 32, r2 = 44;
              return (
                <line key={k}
                  x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
                  x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
                  stroke="rgba(255,215,60,0.45)" strokeWidth="1.6" strokeLinecap="round"
                />
              );
            })}
            <circle cx="0" cy="0" r="30" fill="rgba(255,190,30,0.18)" filter="url(#sun-glow)" />
            <circle cx="0" cy="0" r="24" fill="#ffe060" filter="url(#sun-glow)" />
            <circle cx="0" cy="0" r="20" fill="#fff27a" />
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
            <AnimatePresence>
              {sunHovered && activeFamily && (
                <motion.text
                  x="0" y="40"
                  textAnchor="middle"
                  fontSize="4.2"
                  fontFamily="'IBM Plex Mono', monospace"
                  letterSpacing="0.12em"
                  fill="rgba(255,220,60,0.75)"
                  initial={{ opacity: 0, y: 44 }}
                  animate={{ opacity: 1, y: 40 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.18 }}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  RESET
                </motion.text>
              )}
            </AnimatePresence>
          </motion.g>

          {/* === Phase 3: Arc legend (inside SVG, bottom of viewport) === */}
          <g
            className="arc-legend"
            transform="translate(-148, 296)"
            aria-hidden="true"
            style={{ pointerEvents: "none" }}
          >
            {/* crossable */}
            <line x1="0" y1="5" x2="12" y2="5"
              stroke="rgba(47,196,181,0.7)" strokeWidth="1.5" strokeLinecap="round" />
            <text x="16" y="9" fontSize="5.2" fontFamily="'IBM Plex Mono', monospace"
              letterSpacing="0.06em" fill="rgba(221,216,204,0.45)">crossable</text>
            {/* hybrid */}
            <line x1="74" y1="5" x2="86" y2="5"
              stroke="rgba(255,196,80,0.7)" strokeWidth="1.5" strokeLinecap="round" />
            <text x="90" y="9" fontSize="5.2" fontFamily="'IBM Plex Mono', monospace"
              letterSpacing="0.06em" fill="rgba(221,216,204,0.45)">hybrid</text>
            {/* incompatible */}
            <line x1="130" y1="5" x2="142" y2="5"
              stroke="rgba(200,70,70,0.7)" strokeWidth="1.5" strokeLinecap="round"
              strokeDasharray="3 3" />
            <text x="146" y="9" fontSize="5.2" fontFamily="'IBM Plex Mono', monospace"
              letterSpacing="0.06em" fill="rgba(221,216,204,0.45)">incompatible</text>
          </g>
        </svg>

        {/* Peek button — mobile only */}
        <AnimatePresence>
          {activeFamily && isMobile && !railOpen && activeStrains.length > 0 && (
            <motion.button
              className="orbit-rail-peek"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              onClick={() => setRailOpen(true)}
              style={{ borderColor: `${familyColors[activeFamily] ?? "var(--border-hover)"}50` }}
            >
              <span className="orbit-rail-peek-dot" style={{ background: familyColors[activeFamily] ?? "var(--accent)" }} />
              {activeStrains.length} strain{activeStrains.length !== 1 ? "s" : ""} ↑
            </motion.button>
          )}
        </AnimatePresence>

        {/* Visual encoding legend */}
        <div className="orbit-legend" aria-hidden="true">
          <span className="orbit-legend-item">
            <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4.5" fill="rgba(47,196,181,0.6)" /></svg>
            Neocaridina
          </span>
          <span className="orbit-legend-sep">·</span>
          <span className="orbit-legend-item">
            <svg width="11" height="10" viewBox="0 0 11 10">
              <polygon points={Array.from({length:6},(_,k)=>{const a=(k/6)*Math.PI*2-Math.PI/6;return`${5.5+4.5*Math.cos(a)},${5+4.5*Math.sin(a)}`}).join(" ")} fill="rgba(100,150,255,0.6)" />
            </svg>
            Caridina / Exotics
          </span>
        </div>

      </div>

      {/* Strain detail rail */}
      <AnimatePresence>
        {activeFamily && activeStrains.length > 0 && (!isMobile || railOpen) && (
          <motion.div
            className="orbit-rail-wrapper"
            {...railAnimation}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={!isMobile ? { overflow: "hidden", flexShrink: 0 } : undefined}
          >
            <StrainRail
              family={activeFamily}
              strains={activeStrains}
              onSelect={onSelect}
              onClose={isMobile ? () => setRailOpen(false) : () => setActiveFamily(null)}
              orientation={isMobile ? "horizontal" : "vertical"}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
