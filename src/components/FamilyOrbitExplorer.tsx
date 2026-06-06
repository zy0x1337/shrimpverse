import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { familyColors } from "../lib/constants";
import type { Strain } from "../types/strain";
import { StrainRail } from "./StrainRail";

const FAMILY_ORDER = ["Red", "Orange", "Yellow", "Green", "Blue", "Black", "Brown", "White"];

// Per-family glow/shadow for the bioluminescent effect
const FAMILY_GLOW: Record<string, string> = {
  Red:    "rgba(216,31,47,0.45)",
  Orange: "rgba(240,111,29,0.45)",
  Yellow: "rgba(242,194,48,0.4)",
  Green:  "rgba(21,148,92,0.45)",
  Blue:   "rgba(13,79,158,0.5)",
  Black:  "rgba(120,130,140,0.35)",
  Brown:  "rgba(91,47,32,0.5)",
  White:  "rgba(220,230,240,0.35)",
};

const FAMILY_TEXT: Record<string, string> = {
  Yellow: "#1a1508",
  White:  "#1a2030",
};

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
      if (s.family === "Natural") continue;
      if (!grouped.has(s.family)) grouped.set(s.family, []);
      grouped.get(s.family)!.push(s);
    }
    return Array.from(grouped.keys())
      .sort((a, b) => FAMILY_ORDER.indexOf(a) - FAMILY_ORDER.indexOf(b))
      .map((family) => ({
        family,
        strains: grouped.get(family) ?? [],
        color: familyColors[family] ?? "#888",
        glow: FAMILY_GLOW[family] ?? "rgba(255,255,255,0.3)",
        textColor: FAMILY_TEXT[family] ?? "#fff",
      }));
  }, [visibleStrains]);

  const activeStrains = activeFamily
    ? (families.find((f) => f.family === activeFamily)?.strains ?? [])
    : [];

  const centerStrain = visibleStrains.find((s) => s.family === "Natural") ?? null;

  const handleFamilyClick = useCallback((family: string) => {
    setActiveFamily((prev) => (prev === family ? null : family));
  }, []);

  const handleCenterClick = useCallback(() => {
    setActiveFamily(null);
    if (centerStrain) onSelect(centerStrain.id);
  }, [centerStrain, onSelect]);

  // Layout constants
  const R = 72;           // orbit radius
  const NODE_R = 13;      // node circle radius
  const VB = 108;         // viewBox half-size

  return (
    <div className="orbit-explorer">
      <svg
        className="orbit-svg"
        viewBox={`-${VB} -${VB} ${VB * 2} ${VB * 2}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Radiale Karte der Neocaridina Farbfamilien"
      >
        <defs>
          {/* Per-family glow filter */}
          {families.map((f) => (
            <filter key={`glow-${f.family}`} id={`glow-${f.family}`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor={f.color} floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          {/* Center glow */}
          <filter id="glow-center" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor="#2fc4b5" floodOpacity="0.4" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Ambient star texture */}
          <radialGradient id="bg-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a2a35" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background ambient glow */}
        <circle cx="0" cy="0" r={VB} fill="url(#bg-grad)" />

        {/* Outer dashed orbit ring */}
        <circle
          cx="0" cy="0" r={R}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
          strokeDasharray="3 6"
        />
        {/* Inner subtle ring */}
        <circle
          cx="0" cy="0" r={R * 0.42}
          fill="none"
          stroke="rgba(47,196,181,0.08)"
          strokeWidth="0.3"
        />

        {/* Spoke lines — connector from center to each node */}
        {families.map((item, i) => {
          const angle = (i / families.length) * 2 * Math.PI - Math.PI / 2;
          const nx = Math.cos(angle) * R;
          const ny = Math.sin(angle) * R;
          const isActive = activeFamily === item.family;
          const isHov = hovered === item.family;
          const isDimmed = activeFamily !== null && !isActive;

          return (
            <line
              key={`spoke-${item.family}`}
              x1="0" y1="0"
              x2={nx * 0.78} y2={ny * 0.78}
              stroke={item.color}
              strokeWidth={isActive || isHov ? 0.7 : 0.3}
              opacity={isDimmed ? 0.04 : isActive || isHov ? 0.55 : 0.18}
              strokeDasharray={isActive ? "none" : "2 4"}
              style={{ transition: "all 250ms ease" }}
            />
          );
        })}

        {/* ── FAMILY NODES ── */}
        {families.map((item, i) => {
          const angle = (i / families.length) * 2 * Math.PI - Math.PI / 2;
          const nx = Math.cos(angle) * R;
          const ny = Math.sin(angle) * R;
          const isActive = activeFamily === item.family;
          const isHov = hovered === item.family;
          const isDimmed = activeFamily !== null && !isActive;

          // Label positioning — push outward
          const labelDist = R + NODE_R + 8;
          const lx = Math.cos(angle) * labelDist;
          const ly = Math.sin(angle) * labelDist;
          const anchor = Math.abs(angle % (2 * Math.PI) - Math.PI) < 0.4
            ? (nx < 0 ? "end" : "start")
            : Math.abs(nx) < 5 ? "middle"
            : nx < 0 ? "end" : "start";

          return (
            <motion.g
              key={item.family}
              animate={{
                opacity: isDimmed ? 0.18 : 1,
                scale: isActive ? 1.15 : isHov ? 1.08 : 1,
              }}
              style={{ transformOrigin: `${nx}px ${ny}px` }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={() => handleFamilyClick(item.family)}
              onHoverStart={() => setHovered(item.family)}
              onHoverEnd={() => setHovered(null)}
              role="button"
              aria-label={`${item.family} Farbfamilie, ${item.strains.length} Stämme`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleFamilyClick(item.family);
              }}
              style={{ cursor: "pointer", transformOrigin: `${nx}px ${ny}px` }}
            >
              {/* Animated pulse when active */}
              {isActive && (
                <motion.circle
                  cx={nx} cy={ny}
                  r={NODE_R + 6}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="0.8"
                  initial={{ r: NODE_R + 4, opacity: 0.8 }}
                  animate={{ r: NODE_R + 18, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {/* Hover glow disc */}
              {(isActive || isHov) && (
                <circle
                  cx={nx} cy={ny}
                  r={NODE_R + 5}
                  fill={item.color}
                  opacity={isActive ? 0.18 : 0.1}
                  filter={`url(#glow-${item.family})`}
                />
              )}

              {/* Main filled circle */}
              <circle
                cx={nx} cy={ny}
                r={NODE_R}
                fill={item.color}
                stroke={isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}
                strokeWidth={isActive ? 1.2 : 0.5}
                filter={isActive || isHov ? `url(#glow-${item.family})` : undefined}
              />

              {/* Initial letter */}
              <text
                x={nx} y={ny}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fontWeight="700"
                fontFamily="'IBM Plex Sans', sans-serif"
                fill={item.textColor}
                opacity="0.95"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {item.family[0]}
              </text>

              {/* Count badge */}
              <circle
                cx={nx + NODE_R - 2} cy={ny - NODE_R + 2}
                r={5}
                fill="#080c10"
                stroke={item.color}
                strokeWidth="0.6"
              />
              <text
                x={nx + NODE_R - 2} y={ny - NODE_R + 2}
                textAnchor="middle" dominantBaseline="central"
                fontSize="3.8" fontWeight="700"
                fontFamily="'IBM Plex Mono', monospace"
                fill={item.color}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {item.strains.length}
              </text>

              {/* Label outside node */}
              <text
                x={lx} y={ly}
                textAnchor={anchor}
                dominantBaseline="central"
                fontSize="5.5"
                fontWeight={isActive ? "600" : "400"}
                fontFamily="'Cormorant Garamond', serif"
                letterSpacing="0.03em"
                fill={isActive ? item.color : "rgba(221,216,204,0.65)"}
                style={{ pointerEvents: "none", userSelect: "none", transition: "fill 200ms ease" }}
              >
                {item.family}
              </text>
            </motion.g>
          );
        })}

        {/* ── CENTER NODE — Wildform ── */}
        <motion.g
          animate={{ opacity: activeFamily ? 0.55 : 1 }}
          transition={{ duration: 0.25 }}
          onClick={handleCenterClick}
          onHoverStart={() => setHovered("center")}
          onHoverEnd={() => setHovered(null)}
          role="button"
          aria-label="Wildform – Natural strain"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCenterClick(); }}
          style={{ cursor: "pointer" }}
        >
          {/* Slow-rotating orbit ring */}
          <motion.circle
            cx="0" cy="0" r="22"
            fill="none"
            stroke="rgba(47,196,181,0.25)"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            animate={{ rotate: 360 }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          />
          <motion.circle
            cx="0" cy="0" r="28"
            fill="none"
            stroke="rgba(232,160,32,0.1)"
            strokeWidth="0.3"
            strokeDasharray="1.5 10"
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          />

          {/* Background disc */}
          <circle cx="0" cy="0" r="18" fill="#0d1318" stroke="rgba(47,196,181,0.25)" strokeWidth="0.7"
            filter={hovered === "center" ? "url(#glow-center)" : undefined}
          />
          {/* Inner decoration ring */}
          <circle cx="0" cy="0" r="15" fill="none" stroke="rgba(47,196,181,0.1)" strokeWidth="0.4" />

          {/* Wildform label */}
          <text x="0" y="-4" textAnchor="middle"
            fontSize="6"
            fontWeight="500"
            fontFamily="'Cormorant Garamond', serif"
            fill="rgba(221,216,204,0.9)"
            letterSpacing="0.04em"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >Wildform</text>
          <text x="0" y="3.5" textAnchor="middle"
            fontSize="3.8"
            fontStyle="italic"
            fontFamily="'Cormorant Garamond', serif"
            fill="rgba(47,196,181,0.7)"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >N. davidi</text>
          <text x="0" y="10" textAnchor="middle"
            fontSize="3"
            fontFamily="'IBM Plex Mono', monospace"
            fill="rgba(221,216,204,0.25)"
            letterSpacing="0.12em"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >NATURAL</text>
        </motion.g>
      </svg>

      {/* Strain Rail */}
      <AnimatePresence>
        {activeFamily && (
          <motion.div
            key="rail"
            className="orbit-rail-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
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
