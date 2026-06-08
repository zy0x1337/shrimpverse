import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { familyColors } from "../lib/constants";
import type { Strain } from "../types/strain";
import { StrainRail } from "./StrainRail";
import { ShrimpLogoMark } from "./ShrimpLogoMark";

const FAMILY_ORDER = ["Red", "Orange", "Yellow", "Green", "Blue", "Black", "Brown", "White"];

const FAMILY_GLOW: Record<string, string> = {
  Red: "rgba(216,31,47,0.45)",
  Orange: "rgba(240,111,29,0.45)",
  Yellow: "rgba(242,194,48,0.4)",
  Green: "rgba(21,148,92,0.45)",
  Blue: "rgba(52,152,219,0.45)",
  Black: "rgba(180,180,200,0.35)",
  Brown: "rgba(180,100,40,0.45)",
  White: "rgba(220,220,240,0.4)",
  Natural: "rgba(120,180,80,0.4)",
};

const FAMILY_TEXT: Record<string, string> = {
  Red: "#fff",
  Orange: "#fff",
  Yellow: "#1a1a1a",
  Green: "#fff",
  Blue: "#fff",
  Black: "#fff",
  Brown: "#fff",
  White: "#1a1a1a",
  Natural: "#fff",
};

// 2.2: Staggered orbit radii — primary colours closer, rare/mono further out
const FAMILY_ORBIT_RADIUS: Record<string, number> = {
  Red: 178,
  Orange: 172,
  Yellow: 178,
  Green: 190,
  Blue: 178,
  Black: 200,
  Brown: 205,
  White: 200,
  Natural: 0, // centre node
};

const VB = 520;
const NODE_R_BASE = 20;
const NODE_R_MAX = 34;

function nodeRadius(count: number): number {
  return Math.max(NODE_R_BASE, Math.min(NODE_R_MAX, NODE_R_BASE + count * 2));
}

// 2.4: Pre-generated deterministic starfield — 100 stars, varied sizes & opacities
const STARS: { x: number; y: number; r: number; op: number }[] = (() => {
  const stars = [];
  // Simple LCG pseudo-random for determinism (no Math.random on every render)
  let seed = 42;
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
  for (let i = 0; i < 100; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = 230 + rand() * 30; // outside the orbit ring
    const x = Math.round(Math.cos(angle) * dist * 10) / 10;
    const y = Math.round(Math.sin(angle) * dist * 10) / 10;
    const r = rand() < 0.2 ? 1.4 : rand() < 0.5 ? 1.0 : 0.7;
    const op = 0.15 + rand() * 0.5;
    stars.push({ x, y, r, op });
  }
  return stars;
})();

interface Props {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

export function FamilyOrbitExplorer({ visibleStrains, onSelect }: Props) {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const families = useMemo(() => {
    const grouped = new Map<string, Strain[]>();
    for (const s of visibleStrains) {
      if (!grouped.has(s.family)) grouped.set(s.family, []);
      grouped.get(s.family)!.push(s);
    }
    return FAMILY_ORDER.filter((f) => grouped.has(f)).map((f) => ({
      family: f,
      strains: grouped.get(f)!,
      color: familyColors[f] ?? "#888",
      glow: FAMILY_GLOW[f] ?? "rgba(255,255,255,0.3)",
      textColor: FAMILY_TEXT[f] ?? "#fff",
      nodeR: nodeRadius(grouped.get(f)!.length),
      orbitR: FAMILY_ORBIT_RADIUS[f] ?? 185,
    }));
  }, [visibleStrains]);

  const activeStrains = activeFamily
    ? families.find((f) => f.family === activeFamily)?.strains ?? []
    : [];

  const handleFamilyClick = useCallback((family: string) => {
    setActiveFamily((prev) => (prev === family ? null : family));
  }, []);

  const handleCenterClick = useCallback(() => {
    setActiveFamily(null);
  }, []);

  const totalVisible = visibleStrains.length;
  const totalPopular = visibleStrains.filter((s) => s.popularity >= 4).length;
  const riliCount = visibleStrains.filter((s) => s.pattern?.toLowerCase().includes("rili")).length;

  // Empty state: no families to show
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
      <div className="orbit-stats" aria-label="Visible strain statistics">
        <div className="orbit-stat">
          <span className="orbit-stat-value">{totalVisible}</span>
          <span className="orbit-stat-label">Visible</span>
        </div>
        <div className="orbit-stat">
          <span className="orbit-stat-value">{totalPopular}</span>
          <span className="orbit-stat-label">Popular</span>
        </div>
        <div className="orbit-stat">
          <span className="orbit-stat-value">{riliCount}</span>
          <span className="orbit-stat-label">Rili</span>
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
          >
            {activeFamily}
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        className="orbit-svg"
        viewBox={`${-VB / 2} ${-VB / 2} ${VB} ${VB}`}
        width="100%"
        height="100%"
        aria-label="Radial map of Neocaridina colour families"
      >
        <defs>
          <radialGradient id="bg-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(47,196,181,0.05)" />
            <stop offset="100%" stopColor="rgba(47,196,181,0)" />
          </radialGradient>
          {families.map((item) => (
            <filter key={`glow-${item.family}`} id={`glow-${item.family}`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          <filter id="center-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="0" cy="0" r={VB} fill="url(#bg-grad)" />

        {/* 2.4: SVG starfield — deterministic, outside orbit ring */}
        <g aria-hidden="true">
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ddd8cc" opacity={s.op} />
          ))}
        </g>

        <motion.circle
          cx="0" cy="0" r={185}
          fill="none"
          stroke="rgba(47,196,181,0.12)"
          strokeWidth="0.6"
          strokeDasharray="4 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        />
        <motion.circle
          cx="0" cy="0" r={185 * 0.45}
          fill="none"
          stroke="rgba(47,196,181,0.06)"
          strokeWidth="0.4"
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        />

        {families.map((item, i) => {
          const angle = (i / families.length) * 2 * Math.PI - Math.PI / 2;
          const nx = Math.cos(angle) * item.orbitR;
          const ny = Math.sin(angle) * item.orbitR;
          const isActive = activeFamily === item.family;
          const isHov = hovered === item.family;
          return (
            <motion.line
              key={`spoke-${item.family}`}
              x1={0} y1={0} x2={nx} y2={ny}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: "easeOut" }}
              stroke={isActive || isHov ? item.color : "rgba(47,196,181,0.07)"}
              strokeWidth={isActive ? 0.8 : 0.35}
              style={{ transition: "all 250ms ease" }}
            />
          );
        })}

        {families.map((item, i) => {
          const angle = (i / families.length) * 2 * Math.PI - Math.PI / 2;
          const nx = Math.cos(angle) * item.orbitR;
          const ny = Math.sin(angle) * item.orbitR;
          const isActive = activeFamily === item.family;
          const isHov = hovered === item.family;
          const isDimmed = activeFamily !== null && !isActive;
          const nr = item.nodeR;

          const labelDist = item.orbitR + nr + 22;
          const lx = Math.cos(angle) * labelDist;
          const ly = Math.sin(angle) * labelDist;
          const anchor = Math.abs(nx) < 10 ? "middle" : nx < 0 ? "end" : "start";

          // 2.3: Pick the most popular strain's colors for active node swatches
          const topStrain = [...item.strains].sort((a, b) => b.popularity - a.popularity)[0];
          const swatchColors = topStrain?.colors ?? [];

          return (
            <motion.g
              key={item.family}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: isDimmed ? 0.18 : 1,
                scale: isActive ? 1.15 : isHov ? 1.08 : 1,
              }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 380, damping: 26 }}
              onClick={() => handleFamilyClick(item.family)}
              onHoverStart={() => setHovered(item.family)}
              onHoverEnd={() => setHovered(null)}
              role="button"
              aria-label={`${item.family} colour family, ${item.strains.length} strain${item.strains.length === 1 ? "" : "s"}`}
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
                  animate={{ r: nr + 20, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {(isActive || isHov) && (
                <circle
                  cx={nx} cy={ny} r={nr + 6}
                  fill={item.color}
                  opacity={isActive ? 0.18 : 0.1}
                  filter={`url(#glow-${item.family})`}
                />
              )}

              <circle
                cx={nx} cy={ny} r={nr}
                fill={item.color}
                stroke={isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}
                strokeWidth={isActive ? 1.2 : 0.5}
                filter={isActive || isHov ? `url(#glow-${item.family})` : undefined}
              />

              {/* 2.3: Three colour swatches inside node when active — three arc segments */}
              {isActive && swatchColors.length >= 3 && (
                <>
                  {swatchColors.slice(0, 3).map((col, ci) => {
                    // Each segment covers 120° of the inner ring
                    const segAngle = (2 * Math.PI) / 3;
                    const startAngle = ci * segAngle - Math.PI / 2;
                    const endAngle = startAngle + segAngle - 0.12; // small gap
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

              <text
                x={nx} y={ny}
                textAnchor="middle" dominantBaseline="central"
                fontSize={nr > 26 ? "9" : "8"}
                fontWeight="700"
                fontFamily="'IBM Plex Sans', sans-serif"
                fill={item.textColor} opacity={isActive ? 0 : 0.95}
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

              <text
                x={lx} y={ly}
                textAnchor={anchor} dominantBaseline="central"
                fontSize="5.5"
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

        {visibleStrains.find((s) => s.family === "Natural") && (
          <motion.g
            onClick={handleCenterClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            style={{ cursor: "pointer" }}
            role="button"
            aria-label="Centre — Natural line"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleCenterClick();
            }}
          >
            <circle cx="0" cy="0" r="44" fill="rgba(120,180,80,0.1)" filter="url(#center-glow)" />
            <circle cx="0" cy="0" r="32" fill={familyColors.Natural ?? "#6f8"} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <text
              x="0" y="-4"
              textAnchor="middle" fontSize="8" fontWeight="600"
              fontFamily="'Cormorant Garamond', serif" fill="#fff"
            >
              Natural
            </text>
            <text
              x="0" y="10"
              textAnchor="middle" fontSize="4.5"
              fontFamily="'IBM Plex Mono', monospace"
              fill="rgba(255,255,255,0.7)"
            >
              root line
            </text>
          </motion.g>
        )}
      </svg>

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
