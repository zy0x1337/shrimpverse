import { motion } from "motion/react";
import type { Strain } from "../types/strain";

interface OrbitCenterProps {
  strain: Strain;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}

export function OrbitCenter({ strain, isHovered, onHover, onClick }: OrbitCenterProps) {
  return (
    <motion.g
      className="orbit-center"
      animate={{ scale: isHovered ? 1.06 : 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      onMouseEnter={() => onHover(strain.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      role="button"
      aria-label="Wildform – N. davidi"
      tabIndex={0}
    >
      {/* Ambient Pulse */}
      <motion.circle
        r="42"
        fill="none"
        stroke={strain.colors[1]}
        strokeWidth="1"
        initial={{ opacity: 0.5, scale: 0.85 }}
        animate={{ opacity: 0, scale: 1.7 }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeOut" }}
        style={{ originX: "0px", originY: "0px" }}
      />

      {/* Kern */}
      <circle
        r="40"
        fill="var(--color-bg, #171614)"
        stroke={isHovered ? strain.colors[0] : strain.colors[1]}
        strokeWidth="2"
      />

      {/* Icon-Ring innen */}
      <circle r="36" fill="none" stroke={strain.colors[2]} strokeWidth="0.5" opacity="0.4" />

      <text
        y="-4"
        textAnchor="middle"
        fill="var(--color-text, #cdccca)"
        fontSize="11"
        fontWeight="700"
        letterSpacing="0.5"
      >
        Wildform
      </text>
      <text
        y="10"
        textAnchor="middle"
        fill="var(--color-text-muted, #797876)"
        fontSize="9"
        fontStyle="italic"
      >
        N. davidi
      </text>
    </motion.g>
  );
}
