import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  AdaptiveDpr,
  AdaptiveEvents,
  CameraControls,
} from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { familyColors } from "../../lib/constants";
import type { Strain } from "../../types/strain";
import { UniverseBackground } from "./UniverseBackground";
import { FamilyNode3D } from "./FamilyNode3D";
import { OrbitRing } from "./OrbitRing";
import { EffectPipeline } from "./EffectPipeline";
import { StrainOrbit } from "./StrainOrbit";

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

/**
 * Scene camera controller — flies to the active family star
 * when selected, returns to orbit view when deselected.
 */
function SceneCamera({ activePos }: { activePos: [number, number, number] | null }) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;

    if (activePos) {
      // Zoom toward the family, slightly offset to see its planets
      ctrl.setLookAt(
        activePos[0] * 0.45,
        activePos[1] + 2.5,
        activePos[2] * 0.45 + 7,
        activePos[0],
        activePos[1],
        activePos[2],
        true, // animate
      );
    } else {
      // Return to default overview
      ctrl.setLookAt(0, 2.8, 13, 0, 0, 0, true);
    }
  }, [activePos]);

  return (
    <CameraControls
      ref={controlsRef}
      enabled
      dampingFactor={0.08}
      draggingDampingFactor={0.12}
      minDistance={3}
      maxDistance={22}
      verticalDragToForward={false}
      dollyToCursor={false}
    />
  );
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

  const activeFamilyEntry = families.find((f) => f.family === activeFamily);
  const activeFamilyIndex = activeFamilyEntry
    ? families.indexOf(activeFamilyEntry)
    : -1;
  const activePos =
    activeFamilyIndex >= 0
      ? getFamilyPosition(activeFamilyIndex, families.length)
      : null;

  return (
    <div className="universe-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 2.8, 13], fov: 48 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          logarithmicDepthBuffer: true,
        }}
        dpr={[1, 2]}
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 55%, #0a1520 0%, #04060c 100%)",
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Suspense fallback={null}>
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

          {/* Family stars */}
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

          {/* Strain planets — orbit their family star when active */}
          {families.map((item, i) => {
            const pos = getFamilyPosition(i, families.length);
            return (
              <StrainOrbit
                key={item.family}
                strains={item.strains}
                familyColor={item.color}
                center={pos}
                isActive={activeFamily === item.family}
                onSelectStrain={onSelect}
              />
            );
          })}

          <SceneCamera activePos={activePos} />
          <EffectPipeline hasActiveFamily={!!activeFamily} />
        </Suspense>
      </Canvas>

      {/* HUD */}
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
              {activeFamilyEntry && (
                <span className="universe-active-count">
                  {activeFamilyEntry.strains.length}
                </span>
              )}
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

      {/* Back hint when family is active */}
      <AnimatePresence>
        {activeFamily && (
          <motion.button
            className="universe-back-btn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveFamily(null)}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
            All families
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
