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

const FAMILY_ORBIT_RADIUS: Record<string, number> = {
  Red: 175, Orange: 168, Yellow: 175, Green: 188,
  Blue: 175, Black: 198, Brown: 204, White: 198,
  Natural: 0,
  Crystal: 235, "Taiwan Bee": 248, Tiger: 228,
  Sulawesi: 258, Amano: 220, Bamboo: 216,
};

const VB         = 640;
const NODE_R_BASE = 20;
const NODE_R_MAX  = 34;
// Radius of the moon orbit ring relative to the planet centre
const MOON_ORBIT_OFFSET = 20; // px beyond nodeR

function nodeRadius(count: number): number {
  return Math.max(NODE_R_BASE, Math.min(NODE_R_MAX, NODE_R_BASE + count * 2));
}

// ---------------------------------------------------------------------------
// Phase 3 — Breeding relationship arcs (family-level)
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
  const delta = ((toAngle - fromAngle + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  const effectiveMid = fromAngle + delta / 2;
  const mx = radius * (1 + curvature) * Math.cos(effectiveMid);
  const my = radius * (1 + curvature) * Math.sin(effectiveMid);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${mx.toFixed(2)} ${my.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/**
 * Straight line arc between two absolute SVG points.
 * Used for moon-to-moon cross-family connections.
 */
function getMoonArcPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Push control point slightly outward from centre
  const cx = mx * 1.12;
  const cy = my * 1.12;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
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

// ---------------------------------------------------------------------------
// Moon position helpers
// ---------------------------------------------------------------------------
interface MoonDatum {
  strain: Strain;
  mx: number; // absolute SVG x
  my: number; // absolute SVG y
  r: number;  // moon radius
}

function buildMoons(
  strains: Strain[],
  planetNx: number,
  planetNy: number,
  nodeR: number,
): MoonDatum[] {
  const moonOrbitR = nodeR + MOON_ORBIT_OFFSET;
  return strains.map((s, i) => {
    const angle = (i / strains.length) * 2 * Math.PI - Math.PI / 2;
    const mx = planetNx + moonOrbitR * Math.cos(angle);
    const my = planetNy + moonOrbitR * Math.sin(angle);
    const r  = 2.5 + (s.popularity / 5) * 2.5; // 2.5–5 px
    return { strain: s, mx, my, r };
  });
}

// ---------------------------------------------------------------------------
// Cross-family moon arc builder
// ---------------------------------------------------------------------------
interface MoonArc {
  fromMoon: MoonDatum;
  toMoon: MoonDatum;
  type: ArcType;
  label: string;
}

function buildMoonArcs(
  familyA: string,
  moonsA: MoonDatum[],
  familyB: string,
  moonsB: MoonDatum[],
): MoonArc[] {
  const arcs: MoonArc[] = [];
  for (const moonA of moonsA) {
    for (const cross of moonA.strain.compatible) {
      // Normalise: compatible[].with is a family name (e.g. "Blue", "Taiwan Bee")
      // Check if it matches familyB
      if (cross.with !== familyB) continue;
      // Find the best-matching moon in B (highest popularity strain whose family matches)
      // For a strain-level match we'd need compatible[].withId — for now connect to the
      // most popular strain of the matching family as a visual proxy.
      const bestB = moonsB.reduce((best, m) =>
        m.strain.popularity > best.strain.popularity ? m : best
      );
      // Determine arc type from stability
      const type: ArcType =
        cross.stability === "impossible" ? "impossible" :
        cross.stability === "unstable"   ? "hybrid" :
        "crosses";
      arcs.push({
        fromMoon: moonA,
        toMoon: bestB,
        type,
        label: `${moonA.strain.name} × ${familyB}: ${cross.offspring}`,
      });
    }
  }
  // Also check B → A direction
  for (const moonB of moonsB) {
    for (const cross of moonB.strain.compatible) {
      if (cross.with !== familyA) continue;
      const bestA = moonsA.reduce((best, m) =>
        m.strain.popularity > best.strain.popularity ? m : best
      );
      const type: ArcType =
        cross.stability === "impossible" ? "impossible" :
        cross.stability === "unstable"   ? "hybrid" :
        "crosses";
      // Avoid duplicates (A→B arc might already cover this)
      const alreadyDrawn = arcs.some(
        (a) => a.fromMoon.strain.id === bestA.strain.id && a.toMoon.strain.id === moonB.strain.id,
      );
      if (!alreadyDrawn) {
        arcs.push({
          fromMoon: bestA,
          toMoon: moonB,
          type,
          label: `${moonB.strain.name} × ${familyA}: ${cross.offspring}`,
        });
      }
    }
  }
  return arcs;
}

interface Props {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

export function FamilyOrbitExplorer({ visibleStrains, onSelect }: Props) {
  // Phase 4a: dual-active Set (max 2 families)
  const [activeFamilies, setActiveFamilies] = useState<Set<string>>(new Set());
  const [railFamily, setRailFamily]         = useState<string | null>(null);
  const [railOpen, setRailOpen]             = useState(false);
  const [hovered, setHovered]               = useState<string | null>(null);
  const [sunHovered, setSunHovered]         = useState(false);
  const [hasInteracted, setHasInteracted]   = useState(false);
  const [mobileLabel, setMobileLabel]       = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Convenience: primary active family = last clicked (drives the rail)
  const activeFamily = railFamily;

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
        family: f, strains: grouped.get(f)!,
        color: familyColors[f] ?? "#888",
        glow:  FAMILY_GLOW[f]  ?? "rgba(255,255,255,0.3)",
        textColor: FAMILY_TEXT[f] ?? "#fff",
        nodeR: nodeRadius(grouped.get(f)!.length),
        orbitR, angle, nx, ny,
        isCaridina: isC,
      };
    });
  }, [visibleStrains]);

  const activeStrains = railFamily
    ? families.find((f) => f.family === railFamily)?.strains ?? []
    : [];

  const handleFamilyClick = useCallback(
    (family: string, shiftKey: boolean) => {
      setHasInteracted(true);

      if (shiftKey && activeFamilies.size > 0) {
        // Dual-active mode: toggle second family
        setActiveFamilies((prev) => {
          const next = new Set(prev);
          if (next.has(family)) {
            next.delete(family);
          } else {
            // Max 2: if already 2, replace the oldest (the one that is not railFamily)
            if (next.size >= 2) {
              const toRemove = [...next].find((f) => f !== railFamily);
              if (toRemove) next.delete(toRemove);
            }
            next.add(family);
          }
          return next;
        });
        // Don't change the rail when shift-clicking
        return;
      }

      // Normal click: toggle primary
      setActiveFamilies((prev) => {
        if (prev.has(family) && prev.size === 1) {
          setRailOpen(false);
          setRailFamily(null);
          setMobileLabel(null);
          return new Set();
        }
        const next = new Set<string>();
        next.add(family);
        return next;
      });

      setRailFamily((prev) => {
        if (prev === family && activeFamilies.size === 1) return null;
        if (isMobile) {
          setMobileLabel(family);
          setTimeout(() => { setRailOpen(true); setMobileLabel(null); }, 700);
        } else {
          setRailOpen(false);
        }
        return family;
      });
    },
    [activeFamilies, railFamily, isMobile],
  );

  // Precompute moons for every active family
  const moonsByFamily = useMemo(() => {
    const map = new Map<string, MoonDatum[]>();
    for (const item of families) {
      if (!activeFamilies.has(item.family)) continue;
      map.set(item.family, buildMoons(item.strains, item.nx, item.ny, item.nodeR));
    }
    return map;
  }, [families, activeFamilies]);

  // Precompute moon-to-moon arcs when exactly 2 families are active
  const moonArcs = useMemo((): MoonArc[] => {
    if (activeFamilies.size !== 2) return [];
    const [famA, famB] = [...activeFamilies];
    const moonsA = moonsByFamily.get(famA);
    const moonsB = moonsByFamily.get(famB);
    if (!moonsA || !moonsB) return [];
    return buildMoonArcs(famA, moonsA, famB, moonsB);
  }, [activeFamilies, moonsByFamily]);

  const neoCount      = visibleStrains.filter((s) => !CARIDINA_SET.has(s.family)).length;
  const caridineCount = visibleStrains.filter((s) =>  CARIDINA_SET.has(s.family)).length;
  const totalCount    = visibleStrains.length;
  const firstFamily   = families[0];

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

  const ARC_RADIUS = 213;

  return (
    <div className="orbit-layout">
      <div className="orbit-explorer" style={activeFamily && isMobile && railOpen ? { paddingBottom: "138px" } : undefined}>

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
          {activeFamilies.size > 0
            ? [...activeFamilies].map((f) => {
                const fc = families.find((x) => x.family === f);
                return fc ? `${f}: ${fc.strains.length} varieties` : "";
              }).join(", ")
            : ""}
        </div>

        {/* Active family HUD — shows primary family */}
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
              {/* Comparison hint when exactly one family is active */}
              {activeFamilies.size === 1 && !isMobile && (
                <motion.span
                  className="orbit-active-desc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{ opacity: 0.45, fontSize: "0.68em", letterSpacing: "0.08em" }}
                >
                  SHIFT + CLICK another planet to compare
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison badge when two families are active */}
        <AnimatePresence>
          {activeFamilies.size === 2 && (() => {
            const [famA, famB] = [...activeFamilies];
            return (
              <motion.div
                key="compare-badge"
                className="orbit-compare-badge"
                initial={{ opacity: 0, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.92 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <span style={{ color: familyColors[famA] }}>{famA}</span>
                <span style={{ opacity: 0.4, margin: "0 6px" }}>×</span>
                <span style={{ color: familyColors[famB] }}>{famB}</span>
                {moonArcs.length > 0 && (
                  <span style={{ opacity: 0.5, marginLeft: 8, fontSize: "0.8em" }}>
                    {moonArcs.length} connection{moonArcs.length > 1 ? "s" : ""}
                  </span>
                )}
                {moonArcs.length === 0 && (
                  <span style={{ opacity: 0.4, marginLeft: 8, fontSize: "0.8em" }}>no direct crosses</span>
                )}
              </motion.div>
            );
          })()}
        </AnimatePresence>

        <AnimatePresence>
          {mobileLabel && (
            <motion.div
              key="mobile-label"
              className="orbit-mobile-tap-label"
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ color: familyColors[mobileLabel] ?? "var(--accent)" }}
            >
              {mobileLabel}
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
            <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(255,220,60,0.30)" />
              <stop offset="60%"  stopColor="rgba(255,170,20,0.10)" />
              <stop offset="100%" stopColor="rgba(255,140,0,0)" />
            </radialGradient>
            <radialGradient id="neo-water" cx="0" cy="0" r="208" gradientUnits="userSpaceOnUse">
              <stop offset="30%" stopColor="transparent" />
              <stop offset="70%" stopColor="rgba(180,140,60,0.06)" />
              <stop offset="100%" stopColor="rgba(180,140,60,0.0)" />
            </radialGradient>
            <radialGradient id="cari-water" cx="0" cy="0" r="276" gradientUnits="userSpaceOnUse">
              <stop offset="55%" stopColor="transparent" />
              <stop offset="85%" stopColor="rgba(47,130,196,0.06)" />
              <stop offset="100%" stopColor="rgba(47,130,196,0.0)" />
            </radialGradient>
            <filter id="node-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="sun-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="moon-glow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <circle cx="0" cy="0" r="208" fill="url(#neo-water)"  aria-hidden="true" />
          <circle cx="0" cy="0" r="276" fill="url(#cari-water)" aria-hidden="true" />

          <g aria-hidden="true">
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ddd8cc" opacity={s.op} />
            ))}
          </g>

          <motion.circle cx="0" cy="0" r={190}
            fill="none" stroke="rgba(47,196,181,0.14)" strokeWidth="0.6" strokeDasharray="4 6"
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          />
          <motion.circle cx="0" cy="0" r={242}
            fill="none" stroke="rgba(100,150,255,0.11)" strokeWidth="0.6" strokeDasharray="3 9"
            animate={{ rotate: -360 }}
            transition={{ duration: 130, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          />

          {/* Family-level breeding arcs */}
          <g aria-hidden="true">
            {FAMILY_ARCS.map((arc) => {
              const fromNode = families.find((n) => n.family === arc.from);
              const toNode   = families.find((n) => n.family === arc.to);
              if (!fromNode || !toNode) return null;
              const isHighlighted = activeFamilies.has(arc.from) || activeFamilies.has(arc.to);
              const isDimmed = activeFamilies.size > 0 && !isHighlighted;
              return (
                <g key={`arc-${arc.from}-${arc.to}`}>
                  <motion.path
                    d={getArcPath(fromNode.angle, toNode.angle, ARC_RADIUS)}
                    stroke={isHighlighted ? ARC_COLOR_ACTIVE[arc.type] : ARC_COLOR[arc.type]}
                    strokeWidth={isHighlighted ? 1.6 : 0.9}
                    fill="none" strokeLinecap="round"
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

          {/* Moon-to-moon cross-family arcs (only when 2 families active) */}
          <g aria-hidden="true">
            {moonArcs.map((arc, i) => (
              <g key={`moon-arc-${i}`}>
                <motion.path
                  d={getMoonArcPath(arc.fromMoon.mx, arc.fromMoon.my, arc.toMoon.mx, arc.toMoon.my)}
                  stroke={ARC_COLOR_ACTIVE[arc.type]}
                  strokeWidth={1.2}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={arc.type === "impossible" ? "3 3" : undefined}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
                />
                <title>{arc.label}</title>
              </g>
            ))}
          </g>

          {/* Spoke lines */}
          {families.map((item, i) => {
            const isActive = activeFamilies.has(item.family);
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
            const isActive = activeFamilies.has(item.family);
            const isHov    = hovered === item.family;
            const isDimmed = activeFamilies.size > 0 && !isActive;
            const isPrimary = railFamily === item.family;

            const labelDist = item.orbitR + nr + 22;
            const lx     = Math.cos(item.angle) * labelDist;
            const ly     = Math.sin(item.angle) * labelDist;
            const anchor = Math.abs(nx) < 10 ? "middle" : nx < 0 ? "end" : "start";

            const topStrain    = [...item.strains].sort((a, b) => b.popularity - a.popularity)[0];
            const swatchColors = topStrain?.colors ?? [];

            const moons = moonsByFamily.get(item.family);

            return (
              <motion.g
                key={item.family}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: isDimmed ? 0.18 : 1,
                  scale: isActive ? (isPrimary ? 1.15 : 1.08) : isHov ? 1.08 : 1,
                }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 380, damping: 26 }}
                onClick={(e) => handleFamilyClick(item.family, e.shiftKey)}
                onHoverStart={() => setHovered(item.family)}
                onHoverEnd={() => setHovered(null)}
                role="button"
                aria-label={`${item.family}, ${item.strains.length} variet${item.strains.length === 1 ? "y" : "ies"}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleFamilyClick(item.family, e.shiftKey);
                }}
                style={{ cursor: "pointer", transformOrigin: `${nx}px ${ny}px` }}
              >
                {isPrimary && (
                  <motion.circle
                    cx={nx} cy={ny} r={nr + 6}
                    fill="none" stroke={item.color} strokeWidth="0.8"
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
                {/* Moon orbit ring */}
                {isActive && (
                  <circle
                    cx={nx} cy={ny}
                    r={nr + MOON_ORBIT_OFFSET}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="0.4"
                    strokeDasharray="2 4"
                    opacity={0.25}
                    aria-hidden="true"
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
                {isPrimary && swatchColors.length >= 3 && (
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

                {/* Strain moons — rendered only when this family is active */}
                {moons && moons.map((moon) => (
                  <g
                    key={`moon-${moon.strain.id}`}
                    onClick={(e) => { e.stopPropagation(); onSelect(moon.strain.id); }}
                    role="button"
                    aria-label={`Open ${moon.strain.name}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onSelect(moon.strain.id); }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <motion.circle
                      cx={moon.mx} cy={moon.my} r={moon.r}
                      fill={moon.strain.colors[0]}
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="0.5"
                      filter="url(#moon-glow)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.05 }}
                      whileHover={{ scale: 1.7 }}
                      style={{ transformOrigin: `${moon.mx}px ${moon.my}px` }}
                    />
                    <title>{moon.strain.name}</title>
                  </g>
                ))}
              </motion.g>
            );
          })}

          {/* Onboarding hint */}
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
                  fill="none" stroke="rgba(232,160,32,0.55)" strokeWidth="0.8" strokeDasharray="4 5"
                  animate={{
                    r: [firstFamily.nodeR + 16, firstFamily.nodeR + 28, firstFamily.nodeR + 16],
                    opacity: [0.55, 0.0, 0.55],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <text x="0" y="292" textAnchor="middle" fontSize="5.5"
                  fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.14em"
                  fill="rgba(221,216,204,0.32)">
                  CLICK ANY PLANET TO EXPLORE
                </text>
                <circle cx="-38" cy="308" r="4"
                  fill="rgba(47,196,181,0.35)" stroke="rgba(47,196,181,0.5)" strokeWidth="0.6" />
                <text x="-30" y="312" fontSize="4.8" fontFamily="'IBM Plex Mono', monospace"
                  letterSpacing="0.06em" fill="rgba(221,216,204,0.28)">Neocaridina</text>
                <polygon
                  points={hexPoints(32, 308, 4.5)}
                  fill="rgba(100,150,255,0.32)" stroke="rgba(100,150,255,0.45)" strokeWidth="0.6"
                />
                <text x="40" y="312" fontSize="4.8" fontFamily="'IBM Plex Mono', monospace"
                  letterSpacing="0.06em" fill="rgba(221,216,204,0.28)">Caridina</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Sun */}
          <motion.g
            onClick={() => {
              setActiveFamilies(new Set());
              setRailFamily(null);
              setRailOpen(false);
              setMobileLabel(null);
            }}
            onHoverStart={() => setSunHovered(true)}
            onHoverEnd={() => setSunHovered(false)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            style={{ cursor: "pointer" }}
            role="button"
            aria-label="Shrimpverse — reset to overview"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveFamilies(new Set());
                setRailFamily(null);
                setRailOpen(false);
                setMobileLabel(null);
              }
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
              {sunHovered && activeFamilies.size > 0 && (
                <motion.text
                  x="0" y="40"
                  textAnchor="middle" fontSize="4.2"
                  fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.12em"
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
        </svg>

        {/* Arc legend */}
        <div className="orbit-arc-legend" aria-hidden="true">
          <span className="orbit-arc-legend-item orbit-arc-legend-item--crosses">
            <svg width="14" height="4" viewBox="0 0 14 4">
              <line x1="0" y1="2" x2="14" y2="2" stroke="rgba(47,196,181,0.75)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            crossable
          </span>
          <span className="orbit-arc-legend-item orbit-arc-legend-item--hybrid">
            <svg width="14" height="4" viewBox="0 0 14 4">
              <line x1="0" y1="2" x2="14" y2="2" stroke="rgba(255,196,80,0.75)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            hybrid
          </span>
          <span className="orbit-arc-legend-item orbit-arc-legend-item--impossible">
            <svg width="14" height="4" viewBox="0 0 14 4">
              <line x1="0" y1="2" x2="14" y2="2" stroke="rgba(200,70,70,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
            </svg>
            incompatible
          </span>
        </div>

        {/* Shape legend */}
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
        {railFamily && activeStrains.length > 0 && (!isMobile || railOpen) && (
          <motion.div
            className="orbit-rail-wrapper"
            {...railAnimation}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={!isMobile ? { overflow: "hidden", flexShrink: 0 } : undefined}
          >
            <StrainRail
              family={railFamily}
              strains={activeStrains}
              onSelect={onSelect}
              onClose={isMobile ? () => setRailOpen(false) : () => {
                setRailFamily(null);
                setActiveFamilies(new Set());
              }}
              orientation={isMobile ? "horizontal" : "vertical"}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
