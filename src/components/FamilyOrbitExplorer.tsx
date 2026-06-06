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
  Blue:   "rgba(52,152,219,0.45)",
  Black:  "rgba(180,180,200,0.35)",
  Brown:  "rgba(180,100,40,0.45)",
  White:  "rgba(220,220,240,0.4)",
  Natural: "rgba(120,180,80,0.4)",
};

const VB = 520;
const R  = 185;
const NODE_R = 28;

interface Props {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

export function FamilyOrbitExplorer({ visibleStrains, onSelect }: Props) {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const [hovered, setHovered]           = useState<string | null>(null);

  const families = useMemo(() => {
    const grouped = new Map<string, Strain[]>();
    for (const s of visibleStrains) {
      if (!grouped.has(s.family)) grouped.set(s.family, []);
      grouped.get(s.family)!.push(s);
    }
    // Keep canonical order, skip empties
    return FAMILY_ORDER
      .filter(f => grouped.has(f))
      .map(f => ({ family: f, strains: grouped.get(f)!, color: familyColors[f] ?? "#888" }));
  }, [visibleStrains]);

  const handleFamilyClick = useCallback((family: string) => {
    setActiveFamily(prev => prev === family ? null : family);
  }, []);

  const totalVisible = visibleStrains.length;
  const totalPopular = visibleStrains.filter(s => s.isPopular).length;
  const riliCount    = visibleStrains.filter(s => s.pattern?.toLowerCase().includes("rili")).length;

  const activeStrains = activeFamily
    ? visibleStrains.filter(s => s.family === activeFamily)
    : [];

  return (
    <div className="orbit-explorer">
      {/* SVG orbit map */}
      <svg
        viewBox={`${-VB/2} ${-VB/2} ${VB} ${VB}`}
        width="100%"
        height="100%"
        aria-label="Radiale Karte der Neocaridina Farbfamilien"
      >
        <defs>
          <radialGradient id="bg-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(47,196,181,0.05)" />
            <stop offset="100%" stopColor="rgba(47,196,181,0)" />
          </radialGradient>
          <filter id="glow-filter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <circle cx="0" cy="0" r={VB} fill="url(#bg-grad)" />

        {/* Orbit ring */}
        <motion.circle
          cx="0" cy="0" r={R}
          fill="none"
          stroke="rgba(47,196,181,0.12)"
          strokeWidth="0.6"
          strokeDasharray="4 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        />
        <motion.circle
          cx="0" cy="0" r={R * 0.45}
          fill="none"
          stroke="rgba(47,196,181,0.06)"
          strokeWidth="0.4"
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        />

        {/* Spoke lines */}
        {families.map((item, i) => {
          const angle = (i / families.length) * 2 * Math.PI - Math.PI / 2;
          const nx = Math.cos(angle) * R;
          const ny = Math.sin(angle) * R;
          const isActive = activeFamily === item.family;
          const isHov    = hovered === item.family;
          return (
            <motion.line
              key={`spoke-${item.family}`}
              x1={0} y1={0} x2={nx} y2={ny}
              stroke={isActive || isHov ? item.color : "rgba(47,196,181,0.07)"}
              strokeWidth={isActive ? 0.8 : 0.35}
              style={{ transition: "all 250ms ease" }}
            />
          );
        })}

        {/* Family nodes */}
        {families.map((item, i) => {
          const angle = (i / families.length) * 2 * Math.PI - Math.PI / 2;
          const nx = Math.cos(angle) * R;
          const ny = Math.sin(angle) * R;
          const isActive = activeFamily === item.family;
          const isHov    = hovered === item.family;
          const isDimmed = activeFamily !== null && !isActive;

          const labelDist = R + NODE_R + 20;
          const lx = Math.cos(angle) * labelDist;
          const ly = Math.sin(angle) * labelDist;
          const anchor = Math.abs(nx) < 10 ? "middle" : nx < 0 ? "end" : "start";

          return (
            <motion.g
              key={item.family}
              animate={{
                opacity: isDimmed ? 0.18 : 1,
                scale: isActive ? 1.15 : isHov ? 1.08 : 1,
              }}
              style={{ cursor: "pointer", transformOrigin: `${nx}px ${ny}px` }}
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
            >
              {isActive && (
                <motion.circle
                  cx={nx} cy={ny}
                  r={NODE_R + 6}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="0.8"
                  initial={{ r: NODE_R + 4, opacity: 0.8 }}
                  animate={{ r: NODE_R + 16, opacity: 0 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              <circle
                cx={nx} cy={ny} r={NODE_R}
                fill={isActive ? item.color : `${item.color}1a`}
                stroke={item.color}
                strokeWidth={isActive ? 1.4 : 0.7}
                filter={isActive || isHov ? "url(#glow-filter)" : undefined}
              />

              {item.strains.length > 0 && (
                <>
                  <circle
                    cx={nx + NODE_R - 3} cy={ny - NODE_R + 3}
                    r={8}
                    fill="#0d1318"
                    stroke={item.color}
                    strokeWidth="0.7"
                  />
                  <text
                    x={nx + NODE_R - 3} y={ny - NODE_R + 6.5}
                    textAnchor="middle"
                    fontSize="7"
                    fill={item.color}
                    fontWeight="600"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {item.strains.length}
                  </text>
                </>
              )}

              <text
                x={nx} y={ny + 4.5}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill={isActive ? "#0d1318" : item.color}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {item.family[0]}
              </text>

              <text
                x={lx} y={ly + 3.5}
                textAnchor={anchor}
                fontSize="9.5"
                fill={isActive || isHov ? item.color : "rgba(200,220,218,0.5)"}
                fontWeight={isActive ? "600" : "400"}
                style={{ pointerEvents: "none", userSelect: "none", transition: "fill 200ms ease" }}
              >
                {item.family}
              </text>
            </motion.g>
          );
        })}

        {/* Center — click to reset */}
        <motion.g
          role="button"
          aria-label="Alle Familien anzeigen"
          tabIndex={0}
          style={{ cursor: "pointer" }}
          onClick={() => setActiveFamily(null)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveFamily(null); }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.circle
            cx="0" cy="0" r="32"
            fill="none"
            stroke="rgba(47,196,181,0.18)"
            strokeWidth="0.6"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          />
          <motion.circle
            cx="0" cy="0" r="24"
            fill="none"
            stroke="rgba(47,196,181,0.3)"
            strokeWidth="0.5"
            strokeDasharray="3 5"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          />
          <circle cx="0" cy="0" r="20" fill="#0d1318" stroke="rgba(47,196,181,0.28)" strokeWidth="0.8" />
          <text x="0" y="-3" textAnchor="middle" fontSize="5.5" fill="rgba(47,196,181,0.5)" fontWeight="500" letterSpacing="1" style={{ pointerEvents: "none", userSelect: "none" }}>NEO</text>
          <text x="0" y="5.5" textAnchor="middle" fontSize="5.5" fill="rgba(47,196,181,0.5)" fontWeight="500" letterSpacing="0.5" style={{ pointerEvents: "none", userSelect: "none" }}>ALL</text>
        </motion.g>
      </svg>

      {/* Stats bar */}
      <div className="orbit-stats">
        <div className="orbit-stat">
          <span className="orbit-stat-value">{totalVisible}</span>
          <span className="orbit-stat-label">visible</span>
        </div>
        <div className="orbit-stat">
          <span className="orbit-stat-value">{totalPopular}</span>
          <span className="orbit-stat-label">popular</span>
        </div>
        <div className="orbit-stat">
          <span className="orbit-stat-value">{riliCount}</span>
          <span className="orbit-stat-label">Rili</span>
        </div>
      </div>

      <AnimatePresence>
        {activeFamily && (
          <motion.div
            className="orbit-active-label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{ color: familyColors[activeFamily] ?? "#2fc4b5" }}
          >
            {activeFamily}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strain rail for active family */}
      <AnimatePresence>
        {activeFamily && activeStrains.length > 0 && (
          <motion.div
            className="orbit-rail-wrapper"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            <StrainRail strains={activeStrains} onSelect={onSelect} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
