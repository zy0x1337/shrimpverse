import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { emptyVariants, fadeTransition, withReducedMotion } from "../lib/motion";
import type { Strain } from "../types/strain";
import { StrainCard } from "./StrainCard";

interface StrainGridProps {
  strains: Strain[];
  onSelect: (id: string) => void;
}

export function StrainGrid({ strains, onSelect }: StrainGridProps) {
  const reduced = useReducedMotion();

  return (
    <section className="strain-grid" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {strains.length ? (
          strains.map((strain) => <StrainCard key={strain.id} strain={strain} onSelect={onSelect} />)
        ) : (
          <motion.div
            key="empty"
            className="empty-state"
            variants={emptyVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={withReducedMotion(reduced, fadeTransition)}
          >
            No strain matches the current filters.
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
