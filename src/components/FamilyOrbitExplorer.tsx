import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { familyColors } from "../lib/constants";
import type { Strain } from "../types/shrimp";

const VB = 400;
const R = 155;
const NODE_R = 22;

const COLOR_FAMILIES = [
  "Natural",
  "Red",
  "Yellow",
  "Orange",
  "Green",
  "Blue",
  "Black",
  "Brown",
  "White",
];

interface Props {
  strains: Strain[];
  activeFamily: string | null;
  onFamilyClick: (family: string | null) => void;
}

function buildOrbitData(
  families: string[],
  strains: Strain[],
  familyColors: Record<string, string>
) {
  return families.map((family, i) => {
    const angle = (i / families.length) * 2 * Math.PI - Math.PI / 2;
    const familyStrains = strains.filter((s) => s.family === family);
    return {
      family,
      angle,
      color: familyColors[family] ?? "#888",
      strains: familyStrains,
      popularCount: familyStrains.filter((s) => s.isPopular).length,
    };
  });
}

export function FamilyOrbitExplorer({
  strains,
  activeFamily,
  onFamilyClick,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const orbitData = useMemo(
    () => buildOrbitData(COLOR_FAMILIES, strains, familyColors),
    [strains]
  );

  const handleFamilyClick = useCallback(
    (family: string) => {
      onFamilyClick(activeFamily === family ? null : family);
    },
    [activeFamily, onFamilyClick]
  );

  const totalVisible = strains.length;
  const totalPopular = strains.filter((s) => s.isPopular).length;
  const riliCount = strains.filter((s) =>
    s.pattern?.toLowerCase().includes("rili")
  ).length;

  return (
    <div className="orbit-explorer">
      <svg
        viewBox={`${-VB / 2} ${-VB / 2} ${VB} ${VB}`}
        width="100%"
        height="100%"
        aria-label="Radiale Karte der Neocaridina Farbfamilien"
      >
        <defs>
          <radialGradient id="bg-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(47,196,181,0.04)" />
            <stop offset="100%" stopColor="rgba(47,196,181,0)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
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

        {/* Inner ring */}
        <motion.circle
          cx="0" cy="0" r={R * 0.42}
          fill="none"
          stroke="rgba(47,196,181,0.06)"
          strokeWidth="0.4"
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0px 0px" }}
        />

        {/* Spoke lines */}
        {orbitData.map((item) => {
          const nx = Math.cos(item.angle) * R;
          const ny = Math.sin(item.angle) * R;
          const isActive = activeFamily === item.family;
          const isHov = hovered === item.family;
          return (
            <motion.line
              key={`spoke-${item.family}`}
              x1={0} y1={0}
              x2={nx} y2={ny}
              stroke={isActive || isHov ? item.color : "rgba(47,196,181,0.08)"}
              strokeWidth={isActive ? 0.8 : 0.4}
              style={{ transition: "all 250ms ease" }}
            />
          );
        })}

        {/* Family nodes */}
        {orbitData.map((item) => {
          const nx = Math.cos(item.angle) * R;
          const ny = Math.sin(item.angle) * R;
          const isActive = activeFamily === item.family;
          const isHov = hovered === item.family;
          const isDimmed = activeFamily !== null && !isActive;

          const labelDist = R + NODE_R + 18;
          const lx = Math.cos(item.angle) * labelDist;
          const ly = Math.sin(item.angle) * labelDist;
          const anchor = Math.abs(item.angle % (2 * Math.PI) - Math.PI) < 0.4
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
              {/* Animated pulse when active */}
              {isActive && (
                <motion.circle
                  cx={nx} cy={ny}
                  r={NODE_R + 6}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="0.8"
                  initial={{ r: NODE_R + 4, opacity: 0.8 }}
                  animate={{ r: NODE_R + 14, opacity: 0 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {/* Node bg */}
              <circle
                cx={nx} cy={ny}
                r={NODE_R}
                fill={isActive ? item.color : `${item.color}22`}
                stroke={item.color}
                strokeWidth={isActive ? 1.2 : 0.6}
              />

              {/* Strain count badge */}
              {item.strains.length > 0 && (
                <>
                  <circle
                    cx={nx + NODE_R - 2} cy={ny - NODE_R + 2}
                    r={7}
                    fill="#0d1318"
                    stroke={item.color}
                    strokeWidth="0.6"
                  />
                  <text
                    x={nx + NODE_R - 2} y={ny - NODE_R + 5.5}
                    textAnchor="middle"
                    fontSize="6"
                    fill={item.color}
                    fontWeight="600"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {item.strains.length}
                  </text>
                </>
              )}

              {/* Family initial */}
              <text
                x={nx} y={ny + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill={isActive ? "#0d1318" : item.color}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {item.family[0]}
              </text>

              {/* Label outside orbit */}
              <text
                x={lx} y={ly + 3}
                textAnchor={anchor}
                fontSize="9"
                fill={isActive || isHov ? item.color : "rgba(200,220,218,0.55)"}
                fontWeight={isActive ? "600" : "400"}
                style={{ pointerEvents: "none", userSelect: "none", transition: "fill 200ms ease" }}
              >
                {item.family}
              </text>
            </motion.g>
          );
        })}

        {/* Center node — Natural / all */}
        <motion.g
          role="button"
          aria-label="Wildform – Natural strain"
          tabIndex={0}
          style={{ cursor: "pointer" }}
          onClick={() => onFamilyClick(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onFamilyClick(null);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Outer ring */}
          <motion.circle
            cx="0" cy="0" r="28"
            fill="none"
            stroke="rgba(47,196,181,0.2)"
            strokeWidth="0.6"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          />
          <motion.circle
            cx="0" cy="0" r="22"
            fill="none"
            stroke="rgba(47,196,181,0.35)"
            strokeWidth="0.5"
            strokeDasharray="3 5"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          />

          <circle cx="0" cy="0" r="18" fill="#0d1318" stroke="rgba(47,196,181,0.25)" strokeWidth="0.7"
          />
          <circle cx="0" cy="0" r="15" fill="none" stroke="rgba(47,196,181,0.1)" strokeWidth="0.4" />

          <text
            x="0" y="-3"
            textAnchor="middle"
            fontSize="5.5"
            fill="rgba(47,196,181,0.5)"
            fontWeight="500"
            letterSpacing="1"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            NEO
          </text>
          <text
            x="0" y="5"
            textAnchor="middle"
            fontSize="5.5"
            fill="rgba(47,196,181,0.5)"
            fontWeight="500"
            letterSpacing="0.5"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            ALL
          </text>
        </motion.g>
      </svg>

      {/* Stats */}
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
    </div>
  );
}
