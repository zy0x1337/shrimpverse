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

const SCENE = {
  desktop: { orbitR: 5.5, camPos: [0, 2.8, 13] as [number, number, number], fov: 48 },
  mobile:  { orbitR: 3.8, camPos: [0, 1.4, 16] as [number, number, number], fov: 50 },
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
      minDistance={isMobile ? 5 : 3}
      maxDistance={isMobile ? 22 : 22}
      minPolarAngle={isMobile ? Math.PI * 0.3 : 0}
      maxPolarAngle={isMobile ? Math.PI * 0.7 : Math.PI}
      verticalDragToForward={false}
      dollyToCursor={false}
    />
  );
}

function ControlsHint({ isMobile }: { isMobile: boolean }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="universe-controls-hint"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setVisible(false)}
      aria-label="Dismiss controls hint"
    >
      {isMobile ? (
        <>
          <HintRow icon="drag"  label="Drag" desc="rotate view" />
          <HintRow icon="pinch" label="Pinch" desc="zoom" />
          <HintRow icon="tap"   label="Tap star" desc="open family" />
        </>
      ) : (
        <>
          <HintRow icon="drag"   label="Drag"   desc="rotate" />
          <HintRow icon="scroll" label="Scroll" desc="zoom" />
          <HintRow icon="click"  label="Click"  desc="open family" />
          <HintRow icon="back"   label="Click again" desc="close" />
        </>
      )}
      <span className="universe-hint-dismiss">tap to dismiss</span>
    </motion.div>
  );
}

function HintRow({ icon, label, desc }: { icon: string; label: string; desc: string }) {
  return (
    <div className="universe-hint-row">
      <span className="universe-hint-icon">{ICONS[icon]}</span>
      <span className="universe-hint-label">{label}</span>
      <span className="universe-hint-sep">·</span>
      <span className="universe-hint-desc">{desc}</span>
    </div>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  drag: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2" />
    </svg>
  ),
  pinch: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M4 10 C4 7 12 7 12 10" />
      <path d="M6 6 L4 10 M10 6 L12 10" />
    </svg>
  ),
  scroll: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <rect x="5.5" y="2" width="5" height="9" rx="2.5" />
      <path d="M8 4v3" />
    </svg>
  ),
  tap: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M6 8V4.5a1.5 1.5 0 013 0V8" />
      <path d="M9 6.5a1.5 1.5 0 013 0v2.5a4 4 0 01-8 0V8" />
    </svg>
  ),
  click: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M5 3 C5 1.3 11 1.3 11 3 L11 9 A3 3 0 015 9Z" />
      <path d="M8 3v3" />
    </svg>
  ),
  back: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4L6 8l4 4" />
    </svg>
  ),
};

interface Props {
  visibleStrains: Strain[];
  onSelect: (id: string) => void;
}

export function StrainUniverse({ visibleStrains, onSelect }: Props) {
  const isMobile = useIsMobile();
  const scene = isMobile ? SCENE.mobile : SCENE.desktop;
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const [hintDismissed, setHintDismissed] = useState(false);

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
    (family: string) => {
      setHintDismissed(true);
      setActiveFamily((prev) => (prev === family ? null : family));
    },
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
          antialias: !isMobile,
          alpha: false,
          powerPreference: "high-performance",
          logarithmicDepthBuffer: true,
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 55%, #0a1520 0%, #04060c 100%)",
          touchAction: "none",
        }}
        onPointerDown={() => setHintDismissed(true)}
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

          {families.map((item, i) => {
            const pos = getFamilyPosition(i, families.length, scene.orbitR);
            const isActive = activeFamily === item.family;
            const isDimmedByOther = activeFamily !== null && !isActive;
            return (
              <StrainOrbit
                key={item.family}
                strains={item.strains}
                familyColor={item.color}
                center={pos}
                isActive={isActive}
                isDimmedByOther={isDimmedByOther}
                isMobile={isMobile}
                onSelectStrain={onSelect}
              />
            );
          })}

          <SceneCamera activePos={activePos} isMobile={isMobile} />
          {!isMobile && <EffectPipeline hasActiveFamily={!!activeFamily} />}
        </Suspense>
      </Canvas>

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

      <AnimatePresence>
        {!hintDismissed && !activeFamily && (
          <ControlsHint key="hint" isMobile={isMobile} />
        )}
      </AnimatePresence>

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
