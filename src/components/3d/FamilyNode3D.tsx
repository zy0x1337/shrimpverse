import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useRef, useState } from "react";
import * as THREE from "three";
import type { Mesh } from "three";

export type PlanetMaterial = "rocky" | "icy" | "metallic" | "ringed" | "gas" | "organic";

interface MaterialParams {
  roughness: number;
  metalness: number;
  opacity: number;
  emissiveMult: number;
  sizeMult: number;
}

const MATERIAL_PARAMS: Record<PlanetMaterial, MaterialParams> = {
  rocky:    { roughness: 0.72, metalness: 0.18, opacity: 1.00, emissiveMult: 1.00, sizeMult: 1.00 },
  icy:      { roughness: 0.04, metalness: 0.06, opacity: 0.78, emissiveMult: 1.55, sizeMult: 0.92 },
  metallic: { roughness: 0.04, metalness: 0.96, opacity: 1.00, emissiveMult: 0.72, sizeMult: 0.98 },
  ringed:   { roughness: 0.58, metalness: 0.28, opacity: 1.00, emissiveMult: 1.30, sizeMult: 0.85 },
  gas:      { roughness: 0.92, metalness: 0.00, opacity: 1.00, emissiveMult: 0.78, sizeMult: 1.50 },
  organic:  { roughness: 0.88, metalness: 0.04, opacity: 1.00, emissiveMult: 0.85, sizeMult: 1.00 },
};

interface Props {
  position: [number, number, number];
  color: string;
  family: string;
  strainCount: number;
  isActive: boolean;
  isDimmed: boolean;
  isMobile: boolean;
  materialType?: PlanetMaterial;
  onClick: () => void;
}

export function FamilyNode3D({
  position,
  color,
  family,
  strainCount,
  isActive,
  isDimmed,
  isMobile,
  materialType = "rocky",
  onClick,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<Mesh>(null);
  const satRing1Ref = useRef<Mesh>(null);
  const satRing2Ref = useRef<Mesh>(null);

  const mat = MATERIAL_PARAMS[materialType];
  const baseR = isMobile ? 0.62 : 0.46;
  const sphereR = baseR * mat.sizeMult;

  const { scale } = useSpring({
    scale: isActive ? 1.38 : hovered ? 1.12 : isDimmed ? 0.82 : 1.0,
    config: { tension: 280, friction: 26 },
  });

  const { emissiveIntensity } = useSpring({
    emissiveIntensity: isActive
      ? 2.4 * mat.emissiveMult
      : hovered
      ? 1.6 * mat.emissiveMult
      : isDimmed
      ? 0.0
      : 0.55 * mat.emissiveMult,
    config: { tension: 180, friction: 32 },
  });

  const { opacity } = useSpring({
    opacity: isDimmed ? 0.28 * mat.opacity : mat.opacity,
    config: { tension: 180, friction: 32 },
  });

  useFrame((state, delta) => {
    if (ringRef.current && isActive) {
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.4;
      ringRef.current.rotation.z += delta * 0.5;
    }
    // Sulawesi rings slowly drift
    if (satRing1Ref.current) {
      satRing1Ref.current.rotation.z += delta * 0.12;
    }
    if (satRing2Ref.current) {
      satRing2Ref.current.rotation.z -= delta * 0.07;
    }
  });

  const labelColor = isActive
    ? color
    : isDimmed
    ? "rgba(221,216,204,0.10)"
    : hovered
    ? "rgba(221,216,204,0.9)"
    : "rgba(221,216,204,0.45)";

  const labelSize = isMobile
    ? (isActive ? 0.34 : 0.26)
    : (isActive ? 0.27 : 0.20);

  const segments = isMobile ? 32 : 48;

  return (
    <Float
      speed={0.8}
      rotationIntensity={isActive ? 0.0 : 0.08}
      floatIntensity={isActive ? 0.12 : 0.32}
    >
      <animated.group
        position={position}
        scale={scale}
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
        {/* Active selection ring */}
        {isActive && (
          <mesh ref={ringRef}>
            <torusGeometry args={[sphereR * 1.7, 0.008, 6, 80]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
        )}

        {/* === Special layers beneath main sphere === */}

        {/* Icy inner glowing core */}
        {materialType === "icy" && (
          <mesh>
            <sphereGeometry args={[sphereR * 0.58, isMobile ? 20 : 32, isMobile ? 20 : 32]} />
            <meshBasicMaterial
              color="#d8f4ff"
              transparent
              opacity={isDimmed ? 0.08 : isActive ? 0.55 : 0.38}
            />
          </mesh>
        )}

        {/* Gas giant outer atmospheric shell */}
        {materialType === "gas" && (
          <mesh>
            <sphereGeometry args={[sphereR * 1.12, isMobile ? 18 : 28, isMobile ? 18 : 28]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isDimmed ? 0.02 : 0.11}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* === Main planet sphere === */}
        <animated.mesh>
          <sphereGeometry args={[sphereR, segments, segments]} />
          <animated.meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            roughness={mat.roughness}
            metalness={mat.metalness}
            transparent={mat.opacity < 1}
            opacity={opacity}
          />
        </animated.mesh>

        {/* === Saturn-style rings for Sulawesi === */}
        {materialType === "ringed" && (
          <>
            <mesh ref={satRing1Ref} rotation={[1.1, 0.08, 0.18]}>
              <torusGeometry args={[sphereR * 2.05, sphereR * 0.19, 3, 90]} />
              <animated.meshBasicMaterial
                color={color}
                transparent
                opacity={isDimmed ? 0.07 : 0.42}
              />
            </mesh>
            <mesh ref={satRing2Ref} rotation={[1.1, 0.08, 0.18]}>
              <torusGeometry args={[sphereR * 2.72, sphereR * 0.09, 3, 90]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={isDimmed ? 0.03 : 0.16}
              />
            </mesh>
          </>
        )}

        {/* Strain count when active */}
        {isActive && (
          <Text
            position={[0, 0, sphereR + 0.08]}
            fontSize={isMobile ? 0.25 : 0.19}
            color="rgba(255,255,255,0.7)"
            anchorX="center"
            anchorY="middle"
            renderOrder={2}
            depthOffset={-1}
          >
            {strainCount}
          </Text>
        )}
      </animated.group>

      <Text
        position={[position[0], position[1] + (isMobile ? 1.12 : 0.88), position[2]]}
        fontSize={labelSize}
        color={isMobile && !isDimmed ? (isActive ? color : "rgba(221,216,204,0.7)") : labelColor}
        anchorX="center"
        anchorY="middle"
        letterSpacing={isActive ? 0.04 : 0.08}
        renderOrder={1}
      >
        {family}
      </Text>
    </Float>
  );
}
