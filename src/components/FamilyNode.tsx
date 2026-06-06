import { motion } from "motion/react";

interface FamilyNodeProps {
  family: string;
  count: number;
  color: string;
  x: number;
  y: number;
  isActive: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

export function FamilyNode({ family, count, color, x, y, isActive, isDimmed, onClick }: FamilyNodeProps) {
  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      animate={{ scale: isActive ? 1.2 : 1, opacity: isDimmed ? 0.35 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      role="button"
      aria-label={`${family} family, ${count} strains`}
      tabIndex={0}
      className="family-node"
    >
      <circle r="22" fill="transparent" />
      <circle r="7" fill={color} stroke="var(--color-bg, #171614)" strokeWidth="1.5" />
      {isActive ? <circle r="10" fill="none" stroke={color} strokeWidth="0.6" opacity="0.7" /> : null}
      <text y="16" textAnchor="middle" fontSize="6" fill="var(--color-text, #cdccca)" fontWeight="600">{family}</text>
      <text y="23" textAnchor="middle" fontSize="5" fill="var(--color-text-muted, #797876)">{count} strains</text>
    </motion.g>
  );
}
