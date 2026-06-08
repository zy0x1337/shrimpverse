import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import type { Strain } from "../types/strain";
import { familyColors } from "../lib/constants";
import { ShrimpVisual } from "./ShrimpVisual";

interface Props {
  strain: Strain | null;
  onClose: () => void;
}

const LEVEL_LABELS: Record<string, string> = {
  Beginner:     "Beginner",
  Intermediate: "Intermediate",
  Collector:    "Collector",
};

const WATER_LABEL: Record<string, string> = {
  hard:    "Hard water",
  soft:    "Soft water",
  neutral: "Neutral",
};

const WATER_COLOR: Record<string, string> = {
  hard:    "#22cc66",
  soft:    "#4aa8f0",
  neutral: "#999",
};

function needsLightText(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.45;
}

function deriveWaterType(strain: Strain): "hard" | "soft" | "neutral" {
  if (strain.waterType) return strain.waterType;
  const caridina = new Set(["Crystal", "Taiwan Bee", "Tiger", "Sulawesi", "Amano"]);
  if (caridina.has(strain.family)) return "soft";
  if (strain.family === "Bamboo") return "neutral";
  return "hard";
}

export function StrainDialog({ strain, onClose }: Props) {
  useEffect(() => {
    if (!strain) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = (): HTMLElement[] => {
      const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
      if (!dialog) return [];
      return Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));
    };

    // Move focus into dialog after animation settles
    const focusTimer = setTimeout(() => getFocusable()[0]?.focus(), 60);

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", handler);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handler);
      previouslyFocused?.focus();
    };
  }, [strain, onClose]);

  if (!strain) return null;

  const color     = familyColors[strain.family] ?? "#888";
  const waterType = deriveWaterType(strain);
  const waterColor = WATER_COLOR[waterType];
  const hasTaxonomy = strain.genus || strain.species;

  return (
    <AnimatePresence>
      {strain && (
        <motion.div
          className="dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
                {/* Badge row: family + water type */}
                <div className="dialog-badges">
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
                        width: 6, height: 6,
                        borderRadius: "50%",
                        background: color,
                        boxShadow: `0 0 6px ${color}`,
                      }}
                    />
                    {strain.family}
                  </div>

                  <div
                    className="dialog-water-badge"
                    style={{
                      background: `${waterColor}18`,
                      color: waterColor,
                      border: `1px solid ${waterColor}40`,
                    }}
                  >
                    <WaterIcon type={waterType} />
                    {WATER_LABEL[waterType]}
                  </div>
                </div>

                {/* Strain name */}
                <h2 id="dialog-title" className="dialog-title">{strain.name}</h2>

                {/* Taxonomy line: Genus species */}
                {hasTaxonomy && (
                  <div className="dialog-taxonomy">
                    {strain.genus && (
                      <span className="dialog-genus">{strain.genus}</span>
                    )}
                    {strain.species && (
                      <span className="dialog-species">{strain.species}</span>
                    )}
                  </div>
                )}
              </div>

              <motion.div
                className="dialog-header-shrimp"
                aria-hidden="true"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
              >
                <ShrimpVisual strain={strain} className="dialog-shrimp-visual" />
              </motion.div>

              <button className="dialog-close" onClick={onClose} aria-label="Close">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>

            <div className="dialog-body">
              {/* Colour swatches */}
              <div className="dialog-swatch">
                {strain.colors.map((c, i) => {
                  const labels = ["Base", "Mid-tone", "Accent"];
                  const light  = needsLightText(c);
                  return (
                    <div key={i} className="dialog-swatch-seg" style={{ background: c }}>
                      <span
                        className="dialog-swatch-label"
                        style={{ color: light ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.55)" }}
                      >
                        <span className="dialog-swatch-role">{labels[i]}</span>
                        <span className="dialog-swatch-hex">{c.toUpperCase()}</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Meta grid — 6 cells */}
              <div className="dialog-meta-grid">
                {([
                  ["Family",     strain.family],
                  ["Pattern",    strain.pattern],
                  ["Line",       strain.line],
                  ["Care level", LEVEL_LABELS[strain.level] ?? strain.level],
                  ["Stability",  strain.stable ? "✦ Stable" : "◦ Project line"],
                  ["Water",      WATER_LABEL[waterType]],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="dialog-meta-cell">
                    <div className="dialog-meta-key">{k}</div>
                    <div
                      className="dialog-meta-val"
                      style={
                        k === "Stability"
                          ? { color: strain.stable ? "var(--teal)" : "var(--accent)", fontWeight: 500 }
                          : k === "Water"
                          ? { color: waterColor, fontWeight: 500 }
                          : {}
                      }
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>

              <div className="dialog-section">
                <div className="dialog-section-label">Description</div>
                <p>{strain.summary}</p>
              </div>

              {strain.breeding && (
                <div className="dialog-section">
                  <div className="dialog-section-label">Breeding notes</div>
                  <p>{strain.breeding}</p>
                </div>
              )}

              {strain.tags && strain.tags.length > 0 && (
                <div className="dialog-section">
                  <div className="dialog-section-label">Tags</div>
                  <div className="dialog-tags">
                    {strain.tags.map((tag) => (
                      <span key={tag} className="dialog-tag">{tag}</span>
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

function WaterIcon({ type }: { type: string }) {
  if (type === "soft") return (
    <svg viewBox="0 0 12 12" fill="currentColor" style={{ width: 9, height: 9 }}>
      <path d="M6 1C6 1 2 5.5 2 7.5a4 4 0 008 0C10 5.5 6 1 6 1z" />
    </svg>
  );
  if (type === "hard") return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ width: 9, height: 9 }}>
      <path d="M6 1C6 1 2 5.5 2 7.5a4 4 0 008 0C10 5.5 6 1 6 1z" />
    </svg>
  );
  // neutral
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" style={{ width: 9, height: 9, opacity: 0.6 }}>
      <circle cx="6" cy="6" r="3.5" />
    </svg>
  );
}
