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
import { familyColors, familyGenus } from "../../lib/constants";
import type { Strain } from "../../types/strain";
import { UniverseBackground } from "./UniverseBackground";
import { FamilyNode3D } from "./FamilyNode3D";
import type { PlanetMaterial } from "./FamilyNode3D";
import { OrbitRing } from "./OrbitRing";
import { EffectPipeline } from "./EffectPipeline";
import { StrainOrbit } from "./StrainOrbit";
import { Sun3D } from "./Sun3D";
import { useIsMobile } from "../../hooks/useIsMobile";

// Families that orbit the outer Caridina ring
const CARIDINA_FAMILIES = new Set([
  "Crystal", "Taiwan Bee", "Tiger", "Sulawesi", "Amano", "Bamboo",
]);

const NEO_FAMILY_ORDER = [
  "Red", "Orange", "Yellow", "Green", "Blue", "Black", "Brown", "White",
];
const CARIDINA_FAMILY_ORDER = [
  "Crystal", "Taiwan Bee", "Tiger", "Sulawesi", "Amano", "Bamboo",
];
const FAMILY_ORDER = [...NEO_FAMILY_ORDER, ...CARIDINA_FAMILY_ORDER];

// Visual material profile per family
const FAMILY_MATERIAL: Record<string, PlanetMaterial> = {
  Red: "rocky", Orange: "rocky", Yellow: "rocky", Green: "organic",
  Blue: "rocky", Black: "rocky", Brown: "organic", White: "icy",
  Crystal: "icy", "Taiwan Bee": "metallic", Tiger: "rocky",
  Sulawesi: "ringed", Amano: "organic", Bamboo: "gas",
};

interface Scene {
  innerR: number;
  outerR: number;
  camPos: [number, number, number];
  fov: number;
}

const SCENE: { desktop: Scene; mobile: Scene } = {
  desktop: { innerR: 5.0, outerR: 8.8, camPos: [0, 4.5, 22], fov: 48 },
  mobile:  { innerR: 3.4, outerR: 6.2, camPos: [0, 3.2, 26], fov: 50 },
};

function getFamilyPosition(
  family: string,
  neoFamilies: string[],
  caridineFamilies: string[],
  innerR: number,
  outerR: number,
): [number, number, number] {
  const isOuter = CARIDINA_FAMILIES.has(family);
  const group = isOuter ? caridineFamilies : neoFamilies;
  const radius = isOuter ? outerR : innerR;
  const idx = group.indexOf(family);
  const total = group.length;
  const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
  const yOffset = Math.sin(angle * (isOuter ? 1.2 : 2)) * (isOuter ? 0.55 : 0.38);
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
      const isOuter = Math.sqrt(activePos[0] ** 2 + activePos[2] ** 2) > 7;
      const zOffset = isMobile ? (isOuter ? 8 : 6.5) : (isOuter ? 9.5 : 7.5);
      const xFactor = isMobile ? 0.3 : 0.42;
      ctrl.setLookAt(
        activePos[0] * xFactor,
        activePos[1] + (isMobile ? 2.0 : 2.8),
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
      minDistance={isMobile ? 6 : 4}
      maxDistance={isMobile ? 30 : 28}
      minPolarAngle={isMobile ? Math.PI * 0.28 : 0}
      maxPolarAngle={isMobile ? Math.PI * 0.72 : Math.PI}
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
          <HintRow icon="tap"   label="Tap planet" desc="open family" />
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
      materialType: FAMILY_MATERIAL[f] ?? "rocky",
    }));
  }, [visibleStrains]);

  // Ordered lists of present families per ring
  const neoPresent = useMemo(
    () => NEO_FAMILY_ORDER.filter((f) => families.some((e) => e.family === f)),
    [families],
  );
  const caridinePresent = useMemo(
    () => CARIDINA_FAMILY_ORDER.filter((f) => families.some((e) => e.family === f)),
    [families],
  );

  const handleFamilyClick = useCallback((family: string) => {
    setHintDismissed(true);
    setActiveFamily((prev) => (prev === family ? null : family));
  }, []);

  const activeFamilyEntry = families.find((f) => f.family === activeFamily);

  const activePos = useMemo((): [number, number, number] | null => {
    if (!activeFamily) return null;
    return getFamilyPosition(
      activeFamily,
      neoPresent,
      caridinePresent,
      scene.innerR,
      scene.outerR,
    );
  }, [activeFamily, neoPresent, caridinePresent, scene]);

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
          {/* Ambient + atmospheric fill */}
          <ambientLight intensity={0.04} />
          <pointLight
            position={[0, -10, 0]}
            color="#1ad4e8"
            intensity={isMobile ? 2.5 : 3.5}
            distance={28}
            decay={2}
          />
          <pointLight
            position={[0, 14, 8]}
            color="#c8e8ff"
            intensity={0.3}
            distance={35}
            decay={2}
          />

          <UniverseBackground isMobile={isMobile} />

          {/* The sun at center */}
          <Sun3D isMobile={isMobile} />

          {/* Inner orbit ring — Neocaridina */}
          <OrbitRing
            radius={scene.innerR}
            color="#2fc4b5"
            opacity={0.13}
            tilt={Math.PI * 0.15}
          />
          {/* Outer orbit ring — Caridina & exotics */}
          <OrbitRing
            radius={scene.outerR}
            color="#6090ff"
            opacity={0.09}
            tilt={Math.PI * 0.10}
          />

          {/* Family planets */}
          {families.map((item) => {
            const pos = getFamilyPosition(
              item.family,
              neoPresent,
              caridinePresent,
              scene.innerR,
              scene.outerR,
            );
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
                materialType={item.materialType}
                onClick={() => handleFamilyClick(item.family)}
              />
            );
          })}

          {/* Strain moons orbiting each family planet */}
          {families.map((item) => {
            const pos = getFamilyPosition(
              item.family,
              neoPresent,
              caridinePresent,
              scene.innerR,
              scene.outerR,
            );
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

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {activeFamily
          ? `${activeFamily} family selected, ${activeFamilyEntry?.strains.length ?? 0} varieties`
          : ""}
      </div>

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
                <>
                  <span className="universe-active-count">
                    {activeFamilyEntry.strains.length}
                  </span>
                  {familyGenus[activeFamily] && (
                    <span className="universe-active-genus">
                      {familyGenus[activeFamily]}
                    </span>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!activeFamily && (
          <>
            <div className="universe-stat">
              <span className="universe-stat-val">{visibleStrains.length}</span>
              <span className="universe-stat-lbl">Varieties</span>
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
