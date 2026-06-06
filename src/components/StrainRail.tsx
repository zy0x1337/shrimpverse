import { motion } from "motion/react";
import type { Strain } from "../types/strain";
import { ShrimpVisual } from "./ShrimpVisual";

interface StrainRailProps {
  family: string;
  strains: Strain[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function StrainRail({ family, strains, onSelect, onClose }: StrainRailProps) {
  return (
    <motion.div
      className="strain-rail-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
    >
      <div className="strain-rail-header">
        <div className="strain-rail-title">
          <h3>{family} Family</h3>
          <span>{strains.length} documented</span>
        </div>
        <button className="strain-rail-close" type="button" onClick={onClose} aria-label="Close family rail">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="strain-rail-scroll">
        {strains.map((strain) => (
          <button key={strain.id} className="strain-rail-card" type="button" onClick={() => onSelect(strain.id)}>
            <div className="strain-rail-card-visual">
              <ShrimpVisual strain={strain} className="h-full" />
            </div>
            <div className="strain-rail-card-info">
              <h4>{strain.name}</h4>
              <p>{strain.level} • {strain.pattern}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
