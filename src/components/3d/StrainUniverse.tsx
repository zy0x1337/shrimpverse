import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
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

function getFamilyPosition(index: number, total: number): [number, number, number] {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const yOffset = Math.sin(angle * 2) * 0.45;
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
        camera={{ position: [0, 2.8, 13], fov: 48 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          // Logarithmic depth buffer — eliminates z-fighting on overlapping nodes
          logarithmicDepthBuffer: true,
        }}
        dpr={[1, 2]}
        style={{
          // Deep, near-black space with a barely perceptible blue tint at center
          background: "radial-gradient(ellipse 80% 60% at 50% 55%, #0a1520 0%, #04060c 100%)",
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Suspense fallback={null}>
          {/*
           * Lighting: one cool uplight (aquarium LED), one neutral fill.
           * Ambient is almost zero — we want the emissive nodes to be
           * the primary light sources in the scene.
           */}
          <ambientLight intensity={0.06} />
          <pointLight
            position={[0, -8, 0]}
            color="#1ad4e8"
            intensity={4}
            distance={22}
            decay={2}
          />
          <pointLight
            position={[0, 12, 6]}
            color="#e8f4ff"
            intensity={0.4}
            distance={30}
            decay={2}
          />

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
            dampingFactor={0.05}
            autoRotate={!activeFamily}
            autoRotateSpeed={0.28}
            minDistance={6}
            maxDistance={20}
            enablePan={false}
            maxPolarAngle={Math.PI * 0.72}
            minPolarAngle={Math.PI * 0.28}
          />

          <EffectPipeline hasActiveFamily={!!activeFamily} />
        </Suspense>
      </Canvas>

      {/* HUD — minimal, top-right, never distracts from the scene */}
      <div className="universe-hud">
        <AnimatePresence>
          {activeFamily && (
            <motion.div
              key={activeFamily}
              className="universe-active-label"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
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
