import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, CameraControls } from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { familyColors } from "../../lib/constants";
import type { Strain } from "../../types/strain";
import { UniverseBackground } from "./UniverseBackground";
import { FamilyNode3D } from "./FamilyNode3D";
import { OrbitRing } from "./OrbitRing";
import { EffectPipeline } from "./EffectPipeline";
import { StrainOrbit } from "./StrainOrbit";
import { useIsMobile } from "../../hooks/useIsMobile";

const FAMILY_ORDER = [
  "Red", "Orange", "Yellow", "Green",
  "Blue", "Black", "Brown", "White",
];

/**
 * Orbit radius + initial camera depend on mobile vs desktop.
 * Mobile: smaller radius, closer FOV, pulled-back Z so all
 * family stars fit on a 375-px-wide canvas without clipping.
 */
const SCENE = {
  desktop: { orbitR: 5.5, camPos: [0, 2.8, 13] as [number,number,number], fov: 48 },
  mobile:  { orbitR: 3.8, camPos: [0, 1.8, 10] as [number,number,number], fov: 58 },
};

function getFamilyPosition(
  index: number,
  total: number,
  radius: number,
): [number, number, number] {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const yOffset = Math.sin(angle * 2) * 0.45;
  return [Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius];
}

// ---------------------------------------------------------------------------
// Camera controller — flies to active family, returns home on deselect
// ---------------------------------------------------------------------------
function SceneCamera({
  activePos,
  isMobile,
}: {
  activePos: [number, number, number] | null;
  isMobile: boolean;
}) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const ctrl = controlsRef.current;
    if (!ctrl) return;

    if (activePos) {
      // On mobile pull back more — planets need room to render
      const zOffset = isMobile ? 6.5 : 7;
      const xFactor = isMobile ? 0.3 : 0.45;
      ctrl.setLookAt(
        activePos[0] * xFactor,
        activePos[1] + (isMobile ? 1.8 : 2.5),
        activePos[2] * xFactor + zOffset,
        activePos[0], activePos[1], activePos[2],
        true,
      );
    } else {
      const s = isMobile ? SCENE.mobile : SCENE.desktop;
      ctrl.setLookAt(...s.camPos, 0, 0, 0, true);
    }
  }, [activePos, isMobile]);

  return (
    <CameraControls
      ref={controlsRef}
      enabled
      dampingFactor={0.08}
      draggingDampingFactor={0.12}
      minDistance={isMobile ? 4 : 3}
      maxDistance={isMobile ? 16 : 22}
      // On mobile limit vertical tilt — portrait screens clip easily
      minPolarAngle={isMobile ? Math.PI * 0.3 : 0}
      maxPolarAngle={isMobile ? Math.PI * 0.7 : Math.PI}
      verticalDragToForward={false}
      dollyToCursor={false}
    />
  );
}

// ---------------------------------------------------------------------------
interface Props {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

export function StrainUniverse({ visibleStrains, onSelect }: Props) {
  const isMobile = useIsMobile();
  const scene = isMobile ? SCENE.mobile : SCENE.desktop;
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

  const handleFamilyClick = useCallback(
    (family: string) =>
      setActiveFamily((prev) => (prev === family ? null : family)),
    [],
  );

  const activeFamilyEntry = families.find((f) => f.family === activeFamily);
  const activeFamilyIndex = activeFamilyEntry
    ? families.indexOf(activeFamilyEntry)
    : -1;
  const activePos =
    activeFamilyIndex >= 0
      ? getFamilyPosition(activeFamilyIndex, families.length, scene.orbitR)
      : null;

  return (
    <div className="universe-canvas-wrapper">
      <Canvas
        camera={{ position: scene.camPos, fov: scene.fov }}
        gl={{
          antialias: !isMobile,       // MSAA off on mobile — big perf win
          alpha: false,
          powerPreference: "high-performance",
          logarithmicDepthBuffer: true,
        }}
        // Mobile: cap at 1.5× to spare GPU; desktop: full 2×
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 55%, #0a1520 0%, #04060c 100%)",
          touchAction: "none",        // prevent scroll-hijack on canvas
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Suspense fallback={null}>
          <ambientLight intensity={0.06} />
          <pointLight
            position={[0, -8, 0]}
            color="#1ad4e8"
            intensity={isMobile ? 3 : 4}
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

          <UniverseBackground isMobile={isMobile} />
          <OrbitRing radius={scene.orbitR} />

          {/* Family stars */}
          {families.map((item, i) => {
            const pos = getFamilyPosition(i, families.length, scene.orbitR);
            return (
              <FamilyNode3D
                key={item.family}
                position={pos}
                color={item.color}
                family={item.family}
                strainCount={item.strains.length}
                isActive={activeFamily === item.family}
                isDimmed={activeFamily !== null && activeFamily !== item.family}
                isMobile={isMobile}
                onClick={() => handleFamilyClick(item.family)}
              />
            );
          })}

          {/* Strain planets — orbit their star when family is active */}
          {families.map((item, i) => {
            const pos = getFamilyPosition(i, families.length, scene.orbitR);
            return (
              <StrainOrbit
                key={item.family}
                strains={item.strains}
                familyColor={item.color}
                center={pos}
                isActive={activeFamily === item.family}
                isMobile={isMobile}
                onSelectStrain={onSelect}
              />
            );
          })}

          <SceneCamera activePos={activePos} isMobile={isMobile} />
          {/* Post-processing: skip on low-end mobile to avoid GPU pressure */}
          {!isMobile && <EffectPipeline hasActiveFamily={!!activeFamily} />}
        </Suspense>
      </Canvas>

      {/* ---- HUD ------------------------------------------------- */}
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

        {!activeFamily && (
          <>
            <div className="universe-stat">
              <span className="universe-stat-val">{visibleStrains.length}</span>
              <span className="universe-stat-lbl">Strains</span>
            </div>
            <div className="universe-stat">
              <span className="universe-stat-val">{families.length}</span>
              <span className="universe-stat-lbl">Families</span>
            </div>
          </>
        )}
      </div>

      {/* ---- Touch hint (mobile only, first visit) --------------- */}
      {isMobile && !activeFamily && (
        <motion.div
          className="universe-touch-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="10" cy="10" r="7" strokeDasharray="3 3" />
            <path d="M10 6v4l2.5 2.5" />
          </svg>
          Tap a star · Drag to rotate
        </motion.div>
      )}

      {/* ---- Back button ----------------------------------------- */}
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
