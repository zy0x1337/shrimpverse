import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import type { Strain } from "../types/strain";
import { familyColors } from "../lib/constants";

interface Props {
  strain: Strain | null;
  onClose: () => void;
}

const LEVEL_LABELS: Record<string, string> = {
  Beginner: "Einsteiger",
  Intermediate: "Fortgeschritten",
  Expert: "Experte",
};

export function StrainDialog({ strain, onClose }: Props) {
  useEffect(() => {
    if (!strain) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [strain, onClose]);

  if (!strain) return null;
  const color = familyColors[strain.family] ?? "#888";

  return (
    <AnimatePresence>
      {strain && (
        <motion.div
          className="dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="dialog"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div className="dialog-header">
              <div className="dialog-header-left">
                <div
                  className="dialog-family-badge"
                  style={{
                    background: `${color}22`,
                    color: color,
                    border: `1px solid ${color}44`,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                  {strain.family}
                </div>
                <h2 id="dialog-title" className="dialog-title">
                  {strain.name}
                </h2>
              </div>
              <button className="dialog-close" onClick={onClose} aria-label="Schließen">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>

            <div className="dialog-body">
              <div className="dialog-swatch">
                {strain.colors.map((c, i) => (
                  <div key={i} className="dialog-swatch-seg" style={{ background: c }} />
                ))}
              </div>

              <div className="dialog-meta-grid">
                {[
                  ["Familie", strain.family],
                  ["Muster", strain.pattern],
                  ["Linie", strain.line],
                  ["Pflegelevel", LEVEL_LABELS[strain.level] ?? strain.level],
                ].map(([k, v]) => (
                  <div key={k} className="dialog-meta-cell">
                    <div className="dialog-meta-key">{k}</div>
                    <div className="dialog-meta-val">{v}</div>
                  </div>
                ))}
              </div>

              <div className="dialog-section">
                <div className="dialog-section-label">Beschreibung</div>
                <p>{strain.summary}</p>
              </div>

              {strain.breeding && (
                <div className="dialog-section">
                  <div className="dialog-section-label">Zuchthinweise</div>
                  <p>{strain.breeding}</p>
                </div>
              )}

              {strain.tags && strain.tags.length > 0 && (
                <div className="dialog-section">
                  <div className="dialog-section-label">Tags</div>
                  <div className="dialog-tags">
                    {strain.tags.map((tag) => (
                      <span key={tag} className="dialog-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
