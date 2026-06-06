import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { families, familyColors } from "../lib/constants";
import { emptyVariants, fadeTransition, withReducedMotion } from "../lib/motion";
import type { Strain } from "../types/strain";
import { ShrimpVisual } from "./ShrimpVisual";

interface StrainAtlasProps {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

export function StrainAtlas({ visibleStrains, onSelect }: StrainAtlasProps) {
  const reduced = useReducedMotion();

  const atlasFamilies = families.filter(
    (family) => family !== "All" && visibleStrains.some((strain) => strain.family === family),
  );

  if (!visibleStrains.length) {
    return (
      <section className="strain-atlas" aria-label="Neocaridina strain atlas">
        <motion.div
          className="empty-state"
          variants={emptyVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={withReducedMotion(reduced, fadeTransition)}
        >
          No strain matches the current filters.
        </motion.div>
      </section>
    );
  }

  return (
    <section className="strain-atlas" aria-label="Neocaridina strain atlas">
      <AnimatePresence mode="wait">
        <motion.div
          key={visibleStrains.map((strain) => strain.id).join("|")}
          className="atlas-stack"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={withReducedMotion(reduced, fadeTransition)}
        >
          {atlasFamilies.map((family) => {
            const familyStrains = visibleStrains.filter((strain) => strain.family === family);

            return (
              <section key={family} className="atlas-family">
                <header className="atlas-family-header">
                  <span
                    className="atlas-family-swatch"
                    style={{ backgroundColor: familyColors[family] || "#94a3a8" }}
                    aria-hidden="true"
                  />
                  <div>
                    <h3>{family}</h3>
                    <p>{familyStrains.length} documented strain{familyStrains.length === 1 ? "" : "s"}</p>
                  </div>
                </header>

                <div className="atlas-specimens">
                  {familyStrains.map((strain) => (
                    <button
                      key={strain.id}
                      type="button"
                      className="specimen-tile"
                      onClick={() => onSelect(strain.id)}
                      aria-label={`Open ${strain.name} details`}
                    >
                      <div className="specimen-figure">
                        <ShrimpVisual strain={strain} />
                      </div>
                      <div className="specimen-meta">
                        <strong>{strain.name}</strong>
                        <span>
                          {strain.pattern} · {strain.stable ? "stable" : "variable"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
