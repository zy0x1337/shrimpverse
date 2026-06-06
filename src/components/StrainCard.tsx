import { motion, useReducedMotion } from "motion/react";
import { cardVariants, springTransition, staggerDelay, withReducedMotion } from "../lib/motion";
import { toneStyle } from "../lib/strainUtils";
import type { Strain } from "../types/strain";
import { ShrimpVisual } from "./ShrimpVisual";

interface StrainCardProps {
  strain: Strain;
  index: number;
  onSelect: (id: string) => void;
}

export function StrainCard({ strain, index, onSelect }: StrainCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      className="strain-card"
      type="button"
      layout
      style={toneStyle(strain)}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={withReducedMotion(reduced, {
        ...springTransition,
        delay: staggerDelay(reduced, index),
      })}
      onClick={() => onSelect(strain.id)}
    >
      <div className="card-art">
        <ShrimpVisual strain={strain} />
      </div>
      <div className="card-copy">
        <div className="card-topline">
          <span className="family-pill">{strain.family}</span>
          {strain.popularity >= 4 ? <span className="popular-mark">popular</span> : null}
        </div>
        <h3>{strain.name}</h3>
        <p>{strain.summary}</p>
        <div className="meta-list">
          <span className="tag">{strain.pattern}</span>
          <span className="tag">{strain.level}</span>
          <span className="tag">{strain.stable ? "stable" : "variable"}</span>
        </div>
      </div>
    </motion.button>
  );
}
