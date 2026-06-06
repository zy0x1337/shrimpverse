import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { families, familyColors, strains as allStrains } from "../lib/constants";
import { emptyVariants, fadeTransition, planetVariants, springTransition, staggerDelay, withReducedMotion } from "../lib/motion";
import { toneStyle } from "../lib/strainUtils";
import type { Strain } from "../types/strain";
import { ShrimpVisual } from "./ShrimpVisual";

interface OrbitMapProps {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

interface PlanetLayout {
  strain: Strain;
  familyIndex: number;
  strainIndex: number;
  familyStrainCount: number;
}

export function OrbitMap({ visibleStrains, onSelect }: OrbitMapProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [stageSize, setStageSize] = useState(950);
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      setStageSize(Math.min(Math.max(container.clientWidth || 950, 650), 950));
    };

    updateSize();

    let timer: number | undefined;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(updateSize, 120);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
    };
  }, []);

  const orbitFamilies = useMemo(
    () => families.filter((family) => family !== "All" && visibleStrains.some((strain) => strain.family === family)),
    [visibleStrains],
  );

  const planetLayouts = useMemo(() => {
    const layouts: PlanetLayout[] = [];

    orbitFamilies.forEach((family, familyIndex) => {
      const familyStrains = visibleStrains.filter((strain) => strain.family === family);
      familyStrains.forEach((strain, strainIndex) => {
        layouts.push({
          strain,
          familyIndex,
          strainIndex,
          familyStrainCount: familyStrains.length,
        });
      });
    });

    return layouts;
  }, [orbitFamilies, visibleStrains]);

  const maxRadius = stageSize / 2 - 72;
  const minRadius = 108;
  const radiusStep = orbitFamilies.length > 1 ? (maxRadius - minRadius) / (orbitFamilies.length - 1) : 0;
  const wildStrain = allStrains[0];

  if (!visibleStrains.length) {
    return (
      <section ref={containerRef} className="orbit-system" aria-label="Interactive Neocaridina orbit map">
        <AnimatePresence mode="wait">
          <motion.div
            key="orbit-empty"
            className="empty-state"
            variants={emptyVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={withReducedMotion(reduced, fadeTransition)}
          >
            No strain matches the current filters.
          </motion.div>
        </AnimatePresence>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="orbit-system" aria-label="Interactive Neocaridina orbit map">
      <div className="orbit-stage">
        {orbitFamilies.map((family, index) => {
          const radius = Math.round(minRadius + radiusStep * index);
          return (
            <div
              key={family}
              className="orbit-ring"
              data-family={family}
              style={
                {
                  "--radius": `${radius}px`,
                  "--ring-color": familyColors[family] || "#d9e1dc",
                } as CSSProperties
              }
            />
          );
        })}

        <div className="system-sun" style={toneStyle(wildStrain)}>
          <ShrimpVisual strain={wildStrain} />
        </div>
        <div className="system-title">Neocaridina davidi</div>

        <AnimatePresence mode="popLayout">
          {planetLayouts.map(({ strain, familyIndex, strainIndex, familyStrainCount }, index) => {
            const radius = Math.round(minRadius + radiusStep * familyIndex);
            const angle = (360 / familyStrainCount) * strainIndex + familyIndex * 21;
            const size = 23 + strain.popularity * 4;
            const duration = 56 + familyIndex * 11 + familyStrainCount * 2;
            const delay = -1 * familyIndex * 5;

            return (
              <motion.div
                key={strain.id}
                className="planet-orbit"
                layout
                style={
                  {
                    "--angle": `${angle}deg`,
                    "--radius": `${radius}px`,
                    "--duration": `${duration}s`,
                    "--delay": `${delay}s`,
                  } as CSSProperties
                }
              >
                <motion.button
                  className="planet"
                  type="button"
                  aria-label={`Open ${strain.name} details`}
                  title={strain.name}
                  layout
                  variants={planetVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={withReducedMotion(reduced, {
                    ...springTransition,
                    delay: staggerDelay(reduced, index, 0.02),
                  })}
                  style={
                    {
                      "--planet-a": strain.colors[0],
                      "--planet-b": strain.colors[1],
                      "--size": `${size}px`,
                    } as CSSProperties
                  }
                  onClick={() => onSelect(strain.id)}
                >
                  <span className="planet-name">{strain.name}</span>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div className="orbit-legend" aria-label="Color family legend">
          {orbitFamilies.map((family) => (
            <span key={family} className="legend-chip">
              <span
                className="legend-dot"
                style={{ "--legend-color": familyColors[family] || "#d9e1dc" } as CSSProperties}
              />
              {family}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
