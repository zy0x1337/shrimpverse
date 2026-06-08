import { Html } from "@react-three/drei";
import { familyColors } from "../../lib/constants";
import type { Strain } from "../../types/strain";

interface Props {
  family: string;
  strains: Strain[];
  position: [number, number, number];
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function StrainRail3D({ family, strains, position, onSelect, onClose }: Props) {
  const color = familyColors[family] ?? "#888";

  // Anchor the HTML panel slightly below and in front of the node
  const panelPos: [number, number, number] = [
    position[0],
    position[1] - 2.4,
    position[2] + 0.5,
  ];

  return (
    <Html
      position={panelPos}
      center
      distanceFactor={7}
      occlude={false}
      zIndexRange={[100, 0]}
      style={{ pointerEvents: "auto" }}
    >
      <div
        className="rail-3d-panel"
        style={{
          "--rail-accent": color,
          "--rail-glow": `${color}40`,
        } as React.CSSProperties}
      >
        <div className="rail-3d-header">
          <div className="rail-3d-family">
            <span
              className="rail-3d-dot"
              style={{ background: color, boxShadow: `0 0 10px ${color}80` }}
            />
            <span className="rail-3d-name">{family}</span>
            <span className="rail-3d-count">
              {strains.length} strain{strains.length === 1 ? "" : "s"}
            </span>
          </div>
          <button
            className="rail-3d-close"
            onClick={onClose}
            aria-label="Close strain panel"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        <div className="rail-3d-scroll" role="list">
          {strains.map((strain) => (
            <button
              key={strain.id}
              className="rail-3d-card"
              onClick={() => onSelect(strain.id)}
              role="listitem"
              aria-label={`Open ${strain.name}`}
            >
              <div className="rail-3d-swatch">
                {strain.colors.map((c, i) => (
                  <span
                    key={i}
                    className="rail-3d-swatch-seg"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <div className="rail-3d-card-body">
                <div className="rail-3d-card-name">{strain.name}</div>
                <div className="rail-3d-card-meta">
                  <span className="rail-3d-level">{strain.level}</span>
                  <div className="rail-3d-pop">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`rail-3d-pop-dot${i < strain.popularity ? " filled" : ""}`}
                        style={i < strain.popularity ? { background: color } : {}}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Html>
  );
}
