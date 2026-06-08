interface Props {
  mode: "2d" | "3d";
  onChange: (mode: "2d" | "3d") => void;
}

export function ViewToggle({ mode, onChange }: Props) {
  return (
    <div className="view-toggle" role="group" aria-label="View mode">
      <button
        className={`view-toggle-btn${mode === "2d" ? " active" : ""}`}
        onClick={() => onChange("2d")}
        aria-pressed={mode === "2d"}
        title="Classic orbit map"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="10" cy="10" r="7" />
          <circle cx="10" cy="10" r="2.5" />
          <line x1="10" y1="3" x2="10" y2="7" />
          <line x1="10" y1="13" x2="10" y2="17" />
          <line x1="3" y1="10" x2="7" y2="10" />
          <line x1="13" y1="10" x2="17" y2="10" />
        </svg>
        2D Orbit
      </button>
      <button
        className={`view-toggle-btn${mode === "3d" ? " active" : ""}`}
        onClick={() => onChange("3d")}
        aria-pressed={mode === "3d"}
        title="3D Universe"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2l7 4v8l-7 4-7-4V6l7-4z" />
          <path d="M10 2v16M3 6l7 4 7-4" />
        </svg>
        3D Universe
        <span className="view-toggle-badge">NEW</span>
      </button>
    </div>
  );
}
