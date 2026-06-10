import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Strain } from "../types/strain";
import { familyColors } from "../lib/constants";
import { ShrimpVisual } from "./ShrimpVisual";

interface Props {
  strain: Strain | null;
  onClose: () => void;
  /** Optional: called when user clicks a tag — propagates the tag up for filtering */
  onTagFilter?: (tag: string) => void;
}

const LEVEL_LABELS: Record<string, string> = {
  Beginner:     "Beginner",
  Intermediate: "Intermediate",
  Collector:    "Collector",
};

const LEVEL_TIPS: Record<string, string> = {
  Beginner:     "Great for first-time keepers. Tolerates a range of water parameters.",
  Intermediate: "Needs stable water chemistry and some experience to thrive.",
  Collector:    "Rare or demanding. Best kept by experienced shrimp enthusiasts.",
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

/** Glossary tooltips for meta-grid keys that may be unfamiliar to newcomers */
const META_TIPS: Record<string, string> = {
  Line:
    "A 'line' is a selectively bred strain maintained over many generations for consistent colour and pattern.",
  Pattern:
    "The visual marking style — e.g. mosura (solid head), hinomaru (red spot), or racing stripe.",
  Stability:
    "Stable lines breed true: offspring reliably inherit the parent's appearance. Project lines are still being refined.",
};

/** Human-readable colour role names shown in swatch tooltips */
const SWATCH_ROLES = ["Base colour", "Mid-tone", "Accent"];

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

/** Splits the summary into a lead sentence and the rest */
function splitSummary(text: string): { lead: string; rest: string } {
  const match = text.match(/^([^.!?]+[.!?])\s*(.*)$/s);
  if (!match) return { lead: text, rest: "" };
  return { lead: match[1].trim(), rest: match[2].trim() };
}

// ---------------------------------------------------------------------------
// Small tooltip helper
// ---------------------------------------------------------------------------
function GlossaryTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <span className="dialog-glossary-wrap">
      <button
        ref={ref}
        className="dialog-glossary-btn"
        aria-label="More information"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        onBlur={() => setOpen(false)}
        type="button"
      >
        ?
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="dialog-glossary-tip"
            role="tooltip"
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Swatch segment with hover tooltip
// ---------------------------------------------------------------------------
function SwatchSeg({ color, role }: { color: string; role: string }) {
  const [hovered, setHovered] = useState(false);
  const light = needsLightText(color);

  return (
    <div
      className="dialog-swatch-seg"
      style={{ background: color, position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="dialog-swatch-tooltip"
            style={{ color: light ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.75)" }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <span className="dialog-swatch-tooltip-role">{role}</span>
            <span className="dialog-swatch-tooltip-hex">{color.toUpperCase()}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function StrainDialog({ strain, onClose, onTagFilter }: Props) {
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

  const color      = familyColors[strain.family] ?? "#888";
  const waterType  = deriveWaterType(strain);
  const waterColor = WATER_COLOR[waterType];
  const hasTaxonomy = strain.genus || strain.species;
  const { lead, rest } = splitSummary(strain.summary ?? "");

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
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.25 }}
            onDragEnd={(_, info) => { if (info.offset.y > 80) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div className="dialog-drag-handle" aria-hidden="true" />

            {/* ── HEADER ── */}
            <div className="dialog-header">
              <div className="dialog-header-left">
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

                <h2 id="dialog-title" className="dialog-title">{strain.name}</h2>

                {hasTaxonomy && (
                  <div className="dialog-taxonomy">
                    {strain.genus  && <span className="dialog-genus">{strain.genus}</span>}
                    {strain.species && <span className="dialog-species">{strain.species}</span>}
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

            {/* ── BODY ── */}
            <div className="dialog-body">

              {/* Colour swatches — hover for tooltip */}
              <div className="dialog-swatch">
                {strain.colors.map((c, i) => (
                  <SwatchSeg key={i} color={c} role={SWATCH_ROLES[i] ?? `Colour ${i + 1}`} />
                ))}
              </div>

              {/* Meta grid */}
              <div className="dialog-meta-grid">
                {([
                  ["Family",     strain.family,                               null],
                  ["Pattern",    strain.pattern,                              META_TIPS.Pattern],
                  ["Line",       strain.line,                                 META_TIPS.Line],
                  ["Care level", LEVEL_LABELS[strain.level] ?? strain.level, LEVEL_TIPS[strain.level] ?? null],
                  ["Stability",  strain.stable ? "✦ Stable" : "◦ Project",   META_TIPS.Stability],
                  ["Water",      WATER_LABEL[waterType],                      null],
                ] as [string, string, string | null][]).map(([k, v, tip]) => (
                  <div key={k} className="dialog-meta-cell">
                    <div className="dialog-meta-key">
                      {k}
                      {tip && <GlossaryTip text={tip} />}
                    </div>
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

              {/* Description — first sentence as lead */}
              {strain.summary && (
                <div className="dialog-section">
                  <div className="dialog-section-label">Description</div>
                  <p className="dialog-summary">
                    <strong className="dialog-summary-lead">{lead}</strong>
                    {rest && ` ${rest}`}
                  </p>
                </div>
              )}

              {/* Breeding notes — visually distinct */}
              {strain.breeding && (
                <div className="dialog-section dialog-breeding">
                  <div className="dialog-section-label">
                    <svg
                      className="dialog-breeding-icon"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      {/* two interlocking circles = breeding / pairing */}
                      <circle cx="5" cy="7" r="3.5" />
                      <circle cx="9" cy="7" r="3.5" />
                    </svg>
                    Breeding notes
                  </div>
                  <p>{strain.breeding}</p>
                </div>
              )}

              {/* Tags — clickable if onTagFilter provided */}
              {strain.tags && strain.tags.length > 0 && (
                <div className="dialog-section">
                  <div className="dialog-section-label">Tags</div>
                  <div className="dialog-tags">
                    {strain.tags.map((tag) =>
                      onTagFilter ? (
                        <button
                          key={tag}
                          className="dialog-tag dialog-tag--interactive"
                          onClick={() => { onTagFilter(tag); onClose(); }}
                          type="button"
                        >
                          {tag}
                        </button>
                      ) : (
                        <span key={tag} className="dialog-tag">{tag}</span>
                      )
                    )}
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
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" style={{ width: 9, height: 9, opacity: 0.6 }}>
      <circle cx="6" cy="6" r="3.5" />
    </svg>
  );
}
