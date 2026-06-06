import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { familyColors } from "../lib/constants";
import type { Strain } from "../types/strain";
import { StrainRail } from "./StrainRail";
import "./orbit-styles.css";

const FAMILY_ORDER = ["Red", "Orange", "Yellow", "Green", "Blue", "Black", "Brown", "White"];

interface FamilyOrbitExplorerProps {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

export function FamilyOrbitExplorer({ visibleStrains, onSelect }: FamilyOrbitExplorerProps) {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);

  const families = useMemo(() => {
    const grouped = new Map<string, Strain[]>();
    for (const strain of visibleStrains) {
      if (strain.family === "Natural") continue;
      if (!grouped.has(strain.family)) grouped.set(strain.family, []);
      grouped.get(strain.family)!.push(strain);
    }
    return Array.from(grouped.keys())
      .sort((a, b) => FAMILY_ORDER.indexOf(a) - FAMILY_ORDER.indexOf(b))
      .map((family) => ({
        family,
        strains: grouped.get(family) ?? [],
        color: familyColors[family] ?? "#888",
      }));
  }, [visibleStrains]);

  const activeStrains = activeFamily
    ? (families.find((f) => f.family === activeFamily)?.strains ?? [])
    : [];

  const centerStrain = visibleStrains.find((s) => s.family === "Natural") ?? null;
  const R = 68;
  const VB = 110;

  return (
    <div className="orbit-explorer">
      {/* Subtle radial glow background */}
      <div className="orbit-bg-glow" aria-hidden="true" />

      <svg
        className="orbit-svg"
        viewBox={`-${VB} -${VB} ${VB * 2} ${VB * 2}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Radiale Karte der Neocaridina Farbfamilien"
      >
        {/* Orbit ring */}
        <circle
          cx="0" cy="0" r={R}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="0.4"
          strokeDasharray="3 5"
          opacity="0.35"
        />
        {/* Second subtle ring */}
        <circle
          cx="0" cy="0" r={R * 0.5}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="0.25"
          strokeDasharray="1 6"
          opacity="0.2"
        />

        {/* Connector lines from center to nodes */}
        {families.map((item, i) => {
          const angle = (i / families.length) * 2 * Math.PI - Math.PI / 2;
          const x = Math.cos(angle) * R;
          const y = Math.sin(angle) * R;
          const isActive = activeFamily === item.family;
          const isDimmed = activeFamily !== null && !isActive;
          return (
            <line
              key={`line-${item.family}`}
              x1="0" y1="0"
              x2={x} y2={y}
              stroke={item.color}
              strokeWidth={isActive ? "0.6" : "0.3"}
              opacity={isDimmed ? 0.08 : isActive ? 0.5 : 0.18}
              strokeDasharray={isActive ? "none" : "2 3"}
            />
          );
        })}

        {/* Family nodes */}
        {families.map((item, i) => {
          const angle = (i / families.length) * 2 * Math.PI - Math.PI / 2;
          const x = Math.cos(angle) * R;
          const y = Math.sin(angle) * R;
          const isActive = activeFamily === item.family;
          const isDimmed = activeFamily !== null && !isActive;
          const isLight = ["White", "Yellow"].includes(item.family);

          return (
            <motion.g
              key={item.family}
              transform={`translate(${x},${y})`}
              animate={{
                opacity: isDimmed ? 0.2 : 1,
                scale: isActive ? 1.18 : 1,
              }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              style={{ cursor: "pointer", transformOrigin: `${x}px ${y}px` }}
              onClick={() => setActiveFamily(activeFamily === item.family ? null : item.family)}
              role="button"
              aria-label={`${item.family} family, ${item.strains.length} strains`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveFamily(activeFamily === item.family ? null : item.family);
                }
              }}
            >
              {/* Pulse ring for active */}
              {isActive && (
                <motion.circle
                  r="18"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="0.8"
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ scale: 1.7, opacity: 0 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              {/* Outer glow disc */}
              <circle r="15" fill={item.color} opacity={isActive ? 0.18 : 0.1} />
              {/* Main node circle */}
              <circle
                r="12"
                fill={item.color}
                stroke={isActive ? "var(--color-bg)" : item.color}
                strokeWidth={isActive ? "1.5" : "0"}
                opacity={isActive ? 1 : 0.85}
              />
              {/* Count badge */}
              <circle r="6.5" cx="9" cy="-9" fill="var(--color-bg)" stroke={item.color} strokeWidth="0.7" />
              <text x="9" y="-9" textAnchor="middle" dominantBaseline="central"
                fontSize="4.5" fontWeight="700"
                fill={item.color}
              >
                {item.strains.length}
              </text>
              {/* Family label */}
              <text
                x="0" y="19"
                textAnchor="middle"
                fontSize="5.5"
                fontWeight={isActive ? "700" : "500"}
                fill={isActive ? item.color : "var(--color-text)"}
                opacity={isDimmed ? 0.3 : 1}
              >
                {item.family}
              </text>
              {/* Letter initial inside node */}
              <text
                x="0" y="0"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="8"
                fontWeight="800"
                fill={isLight ? "#333" : "white"}
                opacity="0.9"
              >
                {item.family[0]}
              </text>
            </motion.g>
          );
        })}

        {/* Center node */}
        <motion.g
          style={{ cursor: "pointer" }}
          animate={{ scale: activeFamily ? 0.92 : 1, opacity: activeFamily ? 0.6 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          onClick={() => {
            setActiveFamily(null);
            if (centerStrain) onSelect(centerStrain.id);
          }}
          role="button"
          aria-label="Wildform – Natural strain"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setActiveFamily(null);
              if (centerStrain) onSelect(centerStrain.id);
            }
          }}
        >
          {/* Slow rotating outer ring */}
          <motion.circle
            r="20"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="0.4"
            strokeDasharray="4 6"
            opacity="0.4"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          />
          <circle r="16" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="0.8" opacity="0.9" />
          <circle r="13" fill="var(--color-bg)" />
          <text y="-3" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="var(--color-text)">Wildform</text>
          <text y="4.5" textAnchor="middle" fontSize="4" fontStyle="italic" fill="var(--color-text-muted)">N. davidi</text>
          <text y="11" textAnchor="middle" fontSize="3.5" fill="var(--color-text-faint)">
            {visibleStrains.filter((s) => s.family === "Natural").length > 0 ? "tap" : ""}
          </text>
        </motion.g>
      </svg>

      {/* Strain detail rail */}
      <AnimatePresence>
        {activeFamily && (
          <motion.div
            key="rail"
            className="orbit-rail-wrapper"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
