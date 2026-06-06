import { AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import type { Strain } from "../types/strain";
import { FamilyNode } from "./FamilyNode";
import { OrbitBackground } from "./OrbitBackground";
import { OrbitCenter } from "./OrbitCenter";
import { StrainRail } from "./StrainRail";
import "./orbit-styles.css";

const FAMILY_ORDER = ["Red", "Orange", "Yellow", "Green", "Blue", "Black", "Brown", "White"];
const FAMILY_COLORS: Record<string, string> = {
  Red: "#d81f2f",
  Orange: "#f06f1d",
  Yellow: "#f2c230",
  Green: "#15945c",
  Blue: "#0d4f9e",
  Black: "#111315",
  Brown: "#5b2f20",
  White: "#f3f7f4",
};

interface FamilyOrbitExplorerProps {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

export function FamilyOrbitExplorer({ visibleStrains, onSelect }: FamilyOrbitExplorerProps) {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);

  const families = useMemo(() => {
    const grouped = new Map<string, Strain[]>();
    visibleStrains.forEach((strain) => {
      if (strain.family === "Natural") return;
      if (!grouped.has(strain.family)) grouped.set(strain.family, []);
      grouped.get(strain.family)?.push(strain);
    });

    return Array.from(grouped.keys())
      .sort((a, b) => FAMILY_ORDER.indexOf(a) - FAMILY_ORDER.indexOf(b))
      .map((family) => ({
        family,
        strains: grouped.get(family) ?? [],
        color: FAMILY_COLORS[family] ?? "#888888",
      }));
  }, [visibleStrains]);

  const activeStrains = activeFamily
    ? families.find((item) => item.family === activeFamily)?.strains ?? []
    : [];

  const centerStrain = visibleStrains.find((strain) => strain.family === "Natural") ?? null;
  const radius = 65;

  return (
    <div className="family-orbit-container">
      <OrbitBackground />

      <div className="family-orbit-stage">
        <svg
          className="family-orbit-svg"
          viewBox="-100 -100 200 200"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Interactive radial map of Neocaridina families"
          role="img"
        >
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke="var(--color-border, #393836)"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            opacity="0.4"
          />

          {families.map((item, index) => {
            const angle = (index / families.length) * 2 * Math.PI - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isDimmed = activeFamily !== null && activeFamily !== item.family;

            return (
              <FamilyNode
                key={item.family}
                family={item.family}
                count={item.strains.length}
                color={item.color}
                x={x}
                y={y}
                isActive={activeFamily === item.family}
                isDimmed={isDimmed}
                onClick={() => setActiveFamily(activeFamily === item.family ? null : item.family)}
              />
            );
          })}

          {centerStrain ? (
            <OrbitCenter
              strain={centerStrain}
              isActive={activeFamily === null}
              isDimmed={activeFamily !== null}
              onClick={() => {
                setActiveFamily(null);
                onSelect(centerStrain.id);
              }}
            />
          ) : null}
        </svg>
      </div>

      <AnimatePresence>
        {activeFamily ? (
          <div className="strain-rail-wrapper">
            <StrainRail
              family={activeFamily}
              strains={activeStrains}
              onSelect={onSelect}
              onClose={() => setActiveFamily(null)}
            />
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
