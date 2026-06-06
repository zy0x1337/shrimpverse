import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { dialogPanelVariants, fadeTransition, withReducedMotion } from "../lib/motion";
import { toneStyle } from "../lib/strainUtils";
import type { Strain } from "../types/strain";
import { ShrimpVisual } from "./ShrimpVisual";

interface StrainDialogProps {
  strain: Strain | null;
  onClose: () => void;
}

export function StrainDialog({ strain, onClose }: StrainDialogProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!strain) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [strain, onClose]);

  return (
    <AnimatePresence>
      {strain ? (
        <motion.div
          key="strain-dialog"
          className="strain-dialog-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={withReducedMotion(reduced, fadeTransition)}
        >
          <button
            type="button"
            className="strain-dialog-backdrop"
            aria-label="Close details"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className="strain-dialog"
            variants={dialogPanelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={withReducedMotion(reduced, fadeTransition)}
          >
            <div className="dialog-layout">
              <button
                className="icon-button close-button"
                type="button"
                aria-label="Close details"
                title="Close"
                onClick={onClose}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              <div className="dialog-art" style={toneStyle(strain)}>
                <ShrimpVisual strain={strain} />
              </div>
              <div className="dialog-copy">
                <p className="eyebrow">
                  {strain.family} / {strain.line}
                </p>
                <h3 id="dialog-title">{strain.name}</h3>
                <p>{strain.summary}</p>
                <div className="detail-grid">
                  <div>
                    <span>Pattern</span>
                    <strong>{strain.pattern}</strong>
                  </div>
                  <div>
                    <span>Keeper Level</span>
                    <strong>{strain.level}</strong>
                  </div>
                  <div>
                    <span>Stability</span>
                    <strong>{strain.stable ? "high" : "variable"}</strong>
                  </div>
                  <div>
                    <span>Popularity</span>
                    <strong>{strain.popularity}/5</strong>
                  </div>
                </div>
                <div className="note-box">
                  <strong>Breeding note</strong>
                  <p>{strain.breeding}</p>
                </div>
                <div className="tag-row">
                  {strain.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
