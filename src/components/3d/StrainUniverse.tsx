import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { Suspense, useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { familyColors } from "../../lib/constants";
import type { Strain } from "../../types/strain";
import { UniverseBackground } from "./UniverseBackground";
import { FamilyNode3D } from "./FamilyNode3D";
import { OrbitRing } from "./OrbitRing";
import { EffectPipeline } from "./EffectPipeline";
import { StrainRail3D } from "./StrainRail3D";

const FAMILY_ORDER = ["Red", "Orange", "Yellow", "Green", "Blue", "Black", "Brown", "White"];
const ORBIT_RADIUS = 5.5;

function getFamilyPosition(
  index: number,
  total: number,
): [number, number, number] {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  // Gentle y-wave for 3D depth — not fully flat
  const yOffset = Math.sin(angle * 2) * 0.55;
  return [
    Math.cos(angle) * ORBIT_RADIUS,
    yOffset,
    Math.sin(angle) * ORBIT_RADIUS,
  ];
}

interface Props {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

export function StrainUniverse({ visibleStrains, onSelect }: Props) {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);

  const families = useMemo(() => {
    const grouped = new Map<string, Strain[]>();
    for (const s of visibleStrains) {
      if (!grouped.has(s.family)) grouped.set(s.family, []);
      grouped.get(s.family)!.push(s);
    }
    return FAMILY_ORDER.filter((f) => grouped.has(f)).map((f) => ({
      family: f,
      strains: grouped.get(f)!,
      color: familyColors[f] ?? "#888",
    }));
  }, [visibleStrains]);

  const handleFamilyClick = useCallback((family: string) => {
    setActiveFamily((prev) => (prev === family ? null : family));
  }, []);

  const activeEntry = families.find((f) => f.family === activeFamily);

  return (
    <div className="universe-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 3.5, 13.5], fov: 52 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        style={{ background: "radial-gradient(ellipse at 50% 60%, #0d1f38 0%, #05080f 100%)" }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Suspense fallback={null}>
          {/* Lighting — warm uplight like aquarium LED strip */}
          <ambientLight intensity={0.1} />
          <pointLight position={[0, -6, 0]} color="#00d4ff" intensity={3.5} />
          <pointLight position={[0, 10, 4]} color="#ffffff" intensity={0.6} />
          <pointLight position={[-8, 2, -4]} color="#2fc4b5" intensity={1.2} />

          <UniverseBackground />
          <OrbitRing radius={ORBIT_RADIUS} />

          {families.map((item, i) => {
            const pos = getFamilyPosition(i, families.length);
            return (
              <FamilyNode3D
                key={item.family}
                position={pos}
                color={item.color}
                family={item.family}
                strainCount={item.strains.length}
                isActive={activeFamily === item.family}
                isDimmed={activeFamily !== null && activeFamily !== item.family}
                onClick={() => handleFamilyClick(item.family)}
              />
            );
          })}

          {/* Floating StrainRail anchored to active node */}
          {activeEntry && (() => {
            const idx = families.findIndex((f) => f.family === activeEntry.family);
            const pos = getFamilyPosition(idx, families.length);
            return (
              <StrainRail3D
                family={activeEntry.family}
                strains={activeEntry.strains}
                position={pos}
                onSelect={onSelect}
                onClose={() => setActiveFamily(null)}
              />
            );
          })()}

          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            autoRotate={!activeFamily}
            autoRotateSpeed={0.35}
            minDistance={5}
            maxDistance={22}
            enablePan={false}
            maxPolarAngle={Math.PI * 0.75}
            minPolarAngle={Math.PI * 0.25}
          />

          <Environment preset="night" />
          <EffectPipeline hasActiveFamily={!!activeFamily} />
        </Suspense>
      </Canvas>

      {/* HUD: stats overlay */}
      <div className="universe-hud" aria-label="Universe statistics">
        <AnimatePresence>
          {activeFamily && (
            <motion.div
              key="active-label"
              className="universe-active-label"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              style={{ color: familyColors[activeFamily] }}
            >
              {activeFamily}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="universe-stat">
          <span className="universe-stat-val">{visibleStrains.length}</span>
          <span className="universe-stat-lbl">Strains</span>
        </div>
        <div className="universe-stat">
          <span className="universe-stat-val">{families.length}</span>
          <span className="universe-stat-lbl">Families</span>
        </div>
      </div>
    </div>
  );
}
