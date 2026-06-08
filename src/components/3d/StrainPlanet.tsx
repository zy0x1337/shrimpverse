import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import type { Mesh } from "three";
import type { Strain } from "../../types/strain";

interface Props {
  strain: Strain;
  position: [number, number, number];
  orbitalRadius: number;
  isHighlighted: boolean;
  isDimmed: boolean;
  isMobile: boolean;
  onClick: () => void;
}

export function StrainPlanet({
  strain,
  position,
  orbitalRadius,
  isHighlighted,
  isDimmed,
  isMobile,
  onClick,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<Mesh>(null);
  const atmoRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (0.12 + strain.popularity * 0.035);
    }
    if (atmoRef.current) {
      const t = state.clock.elapsedTime;
      const pulse = 1.0 + Math.sin(t * 0.8 + orbitalRadius) * 0.025;
      atmoRef.current.scale.setScalar(pulse);
    }
  });

  const sizeNorm = (orbitalRadius - 0.85) / (2.55 - 0.85);
  const baseR = useMemo(() => {
    const sizeFromOrbit = 0.11 + sizeNorm * 0.10;
    const popFactor = ((strain.popularity - 3) / 2) * 0.03;
    const floor = isMobile ? 0.14 : 0.11;
    return Math.max(floor, sizeFromOrbit + popFactor);
  }, [sizeNorm, strain.popularity, isMobile]);

  const roughness = strain.stable ? 0.12 : 0.58;
  const metalness = strain.stable ? 0.82 : 0.18;
  const atmoOpacity = isHighlighted ? 0.22 : hovered ? 0.14 : 0.06;

  const { groupScale } = useSpring({
    groupScale: isHighlighted ? 1.65 : hovered ? 1.28 : isDimmed ? 0.65 : 1.0,
    config: { tension: 320, friction: 26 },
  });

  const { bodyOpacity } = useSpring({
    bodyOpacity: isDimmed ? 0.18 : 1.0,
    config: { tension: 180, friction: 30 },
  });

  const connectorGeom = useMemo(() => {
    const dist = orbitalRadius;
    const g = new THREE.CylinderGeometry(0.003, 0.003, dist, 4);
    g.translate(0, -dist / 2, 0);
    return g;
  }, [orbitalRadius]);

  const connectorRotation = useMemo(() => {
    const [px, , pz] = position;
    const angle = Math.atan2(pz, px);
    return [0, -angle + Math.PI / 2, Math.PI / 2] as [number, number, number];
  }, [position]);

  return (
    <>
      {!isDimmed && (
        <mesh geometry={connectorGeom} rotation={connectorRotation}>
          <meshBasicMaterial
            color={strain.colors[0]}
            transparent
            opacity={0.06}
          />
        </mesh>
      )}

      <animated.group
        position={position}
        scale={groupScale}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerEnter={(e) => {
          if (!isMobile) {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerLeave={() => {
          if (!isMobile) {
            setHovered(false);
            document.body.style.cursor = "default";
          }
        }}
      >
        {/* 1. Atmosphere halo */}
        <mesh ref={atmoRef}>
          <sphereGeometry args={[baseR * 1.55, 16, 16]} />
          <meshBasicMaterial
            color={strain.colors[2]}
            transparent
            opacity={atmoOpacity}
            side={THREE.BackSide}
          />
        </mesh>

        {/* 2. Planet body */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[baseR, isMobile ? 24 : 40, isMobile ? 24 : 40]} />
          <animated.meshStandardMaterial
            color={strain.colors[0]}
            emissive={strain.colors[0]}
            emissiveIntensity={isHighlighted ? 0.4 : hovered ? 0.18 : 0.05}
            roughness={roughness}
            metalness={metalness}
            transparent
            opacity={bodyOpacity}
          />
        </mesh>

        {/* 3. Equatorial band — desktop only */}
        {!isMobile && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[baseR * 1.30, baseR * 0.055, 8, 56]} />
            <animated.meshStandardMaterial
              color={strain.colors[1]}
              emissive={strain.colors[1]}
              emissiveIntensity={0.08}
              roughness={0.4}
              metalness={0.3}
              transparent
              opacity={bodyOpacity}
            />
          </mesh>
        )}

        {/* 4. Pole cap — desktop only */}
        {!isMobile && (
          <mesh position={[0, baseR * 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[baseR * 0.38, 24]} />
            <animated.meshBasicMaterial
              color={strain.colors[2]}
              transparent
              opacity={bodyOpacity}
            />
          </mesh>
        )}

        {/* 5. Canvas-texture label */}
        {(hovered || isHighlighted || isMobile) && !isDimmed && (
          <PlanetLabel
            name={strain.name}
            level={strain.level}
            r={baseR}
            isHighlighted={isHighlighted}
          />
        )}
      </animated.group>
    </>
  );
}

// Label rendered as a canvas texture billboard — no external font dep
function PlanetLabel({
  name,
  level,
  r,
  isHighlighted,
}: {
  name: string;
  level: string;
  r: number;
  isHighlighted: boolean;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 256, 64);

    ctx.font = "600 18px 'IBM Plex Sans', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.textAlign = "center";
    ctx.fillText(name, 128, 22);

    const levelColors: Record<string, string> = {
      Beginner: "rgba(100,210,140,0.75)",
      Intermediate: "rgba(240,180,60,0.75)",
      Collector: "rgba(200,100,220,0.75)",
    };
    ctx.font = "400 11px 'IBM Plex Mono', monospace, sans-serif";
    ctx.fillStyle = levelColors[level] ?? "rgba(200,200,200,0.6)";
    ctx.fillText(level.toUpperCase(), 128, 40);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [name, level]);

  return (
    <mesh position={[0, r + 0.28, 0]}>
      <planeGeometry args={[0.9, 0.22]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={isHighlighted ? 1.0 : 0.8}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
