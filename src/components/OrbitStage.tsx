import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import type { Strain } from "../types/strain";
import { OrbitBackground } from "./OrbitBackground";
import { OrbitCenter } from "./OrbitCenter";
import { OrbitNode } from "./OrbitNode";
import "./orbit-styles.css";

interface OrbitStageProps {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

const FAMILY_ORDER = ["Red", "Orange", "Yellow", "Green", "Blue", "Black", "Brown", "White"];

export function OrbitStage({ visibleStrains, onSelect }: OrbitStageProps) {
  const reduced = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const rings = useMemo(() => {
    const grouped = new Map<string, Strain[]>();
    visibleStrains.forEach((strain) => {
      if (strain.family === "Natural") return;
      if (!grouped.has(strain.family)) grouped.set(strain.family, []);
      grouped.get(strain.family)!.push(strain);
    });

    const sorted = Array.from(grouped.keys()).sort(
      (a, b) => FAMILY_ORDER.indexOf(a) - FAMILY_ORDER.indexOf(b)
    );

    return sorted.map((family, index) => ({
      family,
      radius: 160 + index * 82,
      strains: grouped.get(family)!,
    }));
  }, [visibleStrains]);

  const centerStrain = visibleStrains.find((s) => s.family === "Natural") ?? null;

  return (
    <div className="orbit-stage-container">
      <OrbitBackground />

      <svg
        className="orbit-stage-svg"
        viewBox="-500 -500 1000 1000"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Interaktive Orbit-Karte der Neocaridina-Stämme"
        role="img"
      >
        {/* Statische Ringbahnen */}
        {rings.map((ring) => (
          <circle
            key={`ring-${ring.family}`}
            cx="0"
            cy="0"
            r={ring.radius}
            className="orbit-ring"
          />
        ))}

        {/* Family-Labels auf den Ringen */}
        {rings.map((ring) => (
          <text
            key={`label-${ring.family}`}
            x={ring.radius + 8}
            y="0"
            className="orbit-family-label"
            dominantBaseline="middle"
          >
            {ring.family}
          </text>
        ))}

        {/* Rotierende Nodes-Gruppe */}
        <motion.g
          animate={reduced ? {} : { rotate: 360 }}
          transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
          style={{ originX: "0px", originY: "0px" }}
        >
          {rings.map((ring) =>
            ring.strains.map((strain, i) => {
              const angle =
                (i / ring.strains.length) * 2 * Math.PI - Math.PI / 2;
              const x = Math.cos(angle) * ring.radius;
              const y = Math.sin(angle) * ring.radius;
              return (
                <OrbitNode
                  key={strain.id}
                  strain={strain}
                  x={x}
                  y={y}
                  isHovered={hoveredId === strain.id}
                  isDimmed={hoveredId !== null && hoveredId !== strain.id}
                  onHover={setHoveredId}
                  onClick={() => onSelect(strain.id)}
                />
              );
            })
          )}
        </motion.g>

        {/* Statisches Zentrum */}
        <AnimatePresence>
          {centerStrain && (
            <OrbitCenter
              strain={centerStrain}
              isHovered={hoveredId === centerStrain.id}
              onHover={setHoveredId}
              onClick={() => onSelect(centerStrain.id)}
            />
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
