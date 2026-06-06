import { motion } from "motion/react";
import type { Strain } from "../types/strain";

interface OrbitCenterProps {
  strain: Strain;
  isActive: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

export function OrbitCenter({ strain, isActive, isDimmed, onClick }: OrbitCenterProps) {
  return (
    <motion.g
      className="orbit-center"
      animate={{ opacity: isDimmed ? 0.25 : 1, scale: isActive ? 1.04 : 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <circle r="22" fill="transparent" />
      <circle r="12" fill="var(--color-bg, #171614)" stroke={strain.colors[1]} strokeWidth="1" />
      <circle r="10" fill="none" stroke={strain.colors[2]} strokeWidth="0.25" opacity="0.4" />
      {isActive ? (
        <motion.circle
          r="14"
          fill="none"
          stroke={strain.colors[1]}
          strokeWidth="0.5"
          initial={{ opacity: 0.8, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.8 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
        />
      ) : null}
      <text y="-2.5" textAnchor="middle" fill="var(--color-text, #cdccca)" fontSize="4.5" fontWeight="700">Wildform</text>
      <text y="4" textAnchor="middle" fill="var(--color-text-muted, #797876)" fontSize="3.5" fontStyle="italic">N. davidi</text>
    </motion.g>
  );
}
