import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { familyColors } from "../lib/constants";
import type { Strain } from "../types/strain";
import { StrainRail } from "./StrainRail";

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

const VB = 520;
const R = 185;
const NODE_R = 28;

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

        {families.map((item, i) => {
          const angle = (i / families.length) * 2 * Math.PI - Math.PI / 2;
          const nx = Math.cos(angle) * R;
          const ny = Math.sin(angle) * R;
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
          const nx = Math.cos(angle) * R;
          const ny = Math.sin(angle) * R;
          const isActive = activeFamily === item.family;
          const isHov = hovered === item.family;
          const isDimmed = activeFamily !== null && !isActive;

          const labelDist = R + NODE_R + 20;
          const lx = Math.cos(angle) * labelDist;
          const ly = Math.sin(angle) * labelDist;
          const anchor = Math.abs(nx) < 10 ? "middle" : nx < 0 ? "end" : "start";

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
                  cx={nx} cy={ny} r={NODE_R + 6}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="0.8"
                  initial={{ r: NODE_R + 4, opacity: 0.8 }}
                  animate={{ r: NODE_R + 18, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {(isActive || isHov) && (
                <circle
                  cx={nx} cy={ny} r={NODE_R + 5}
                  fill={item.color}
                  opacity={isActive ? 0.18 : 0.1}
                  filter={`url(#glow-${item.family})`}
                />
              )}

              <circle
                cx={nx} cy={ny} r={NODE_R}
                fill={item.color}
                stroke={isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}
                strokeWidth={isActive ? 1.2 : 0.5}
                filter={isActive || isHov ? `url(#glow-${item.family})` : undefined}
              />

              <text
                x={nx} y={ny}
                textAnchor="middle" dominantBaseline="central"
                fontSize="9" fontWeight="700"
                fontFamily="'IBM Plex Sans', sans-serif"
                fill={item.textColor} opacity="0.95"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {item.family[0]}
              </text>

              <circle
                cx={nx + NODE_R - 2} cy={ny - NODE_R + 2} r={5}
                fill="#080c10" stroke={item.color} strokeWidth="0.6"
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
