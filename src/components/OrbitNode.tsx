import { motion } from "motion/react";
import type { Strain } from "../types/strain";
import { ShrimpVisual } from "./ShrimpVisual";

interface OrbitNodeProps {
  strain: Strain;
  x: number;
  y: number;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}

export function OrbitNode({
  strain,
  x,
  y,
  isHovered,
  isDimmed,
  onHover,
  onClick,
}: OrbitNodeProps) {
  const primary = strain.colors[0];
  const surface = strain.colors[1];

  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      initial={false}
      animate={{
        scale: isHovered ? 1.15 : 1,
        opacity: isDimmed ? 0.2 : 1,
      }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      onMouseEnter={() => onHover(strain.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(strain.id)}
      onBlur={() => onHover(null)}
      onClick={onClick}
      role="button"
      aria-label={strain.name}
      tabIndex={0}
      className="orbit-node"
    >
      {/* Hover-Halo */}
      {isHovered && (
        <motion.circle
          r="18"
          fill={primary}
          opacity="0.18"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.18 }}
          style={{ filter: "blur(5px)" }}
        />
      )}

      {/* Hauptpunkt */}
      <circle
        r="11"
        fill={primary}
        stroke="var(--color-bg, #171614)"
        strokeWidth="2.5"
      />

      {/* Unstable-Marker: gestrichelte Outline */}
      {!strain.stable && (
        <circle
          r="14"
          fill="none"
          stroke={surface}
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.6"
        />
      )}

      {/* Tooltip */}
      {isHovered && (
        <motion.g
          style={{ pointerEvents: "none" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <rect
            x="-62"
            y="20"
            width="124"
            height="80"
            rx="8"
            fill="var(--color-surface, #1c1b19)"
            stroke="var(--color-border, #393836)"
            strokeWidth="1"
          />
          {/* Strain-Name */}
          <text
            x="0"
            y="38"
            textAnchor="middle"
            fill="var(--color-text, #cdccca)"
            fontSize="11"
            fontWeight="600"
          >
            {strain.name}
          </text>
          {/* Level-Badge */}
          <text
            x="0"
            y="52"
            textAnchor="middle"
            fill="var(--color-text-muted, #797876)"
            fontSize="9"
          >
            {strain.level} · {strain.pattern}
          </text>
          {/* ShrimpVisual Preview via foreignObject */}
          <foreignObject x="-44" y="56" width="88" height="38">
            <ShrimpVisual strain={strain} />
          </foreignObject>
        </motion.g>
      )}
    </motion.g>
  );
}
