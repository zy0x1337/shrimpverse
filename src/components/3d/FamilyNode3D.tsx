import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useRef, useState } from "react";
import type { Mesh } from "three";

interface Props {
  position: [number, number, number];
  color: string;
  family: string;
  strainCount: number;
  isActive: boolean;
  isDimmed: boolean;
  isMobile: boolean;
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
  onClick,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<Mesh>(null);

  // Larger hit target on mobile: 0.62 vs 0.46
  const sphereR = isMobile ? 0.62 : 0.46;

  const { scale } = useSpring({
    scale: isActive ? 1.38 : hovered ? 1.12 : isDimmed ? 0.82 : 1.0,
    config: { tension: 280, friction: 26 },
  });

  const { emissiveIntensity } = useSpring({
    emissiveIntensity: isActive ? 2.2 : hovered ? 1.0 : isDimmed ? 0.0 : 0.18,
    config: { tension: 180, friction: 32 },
  });

  const { opacity } = useSpring({
    opacity: isDimmed ? 0.28 : 1.0,
    config: { tension: 180, friction: 32 },
  });

  useFrame((state, delta) => {
    if (ringRef.current && isActive) {
      ringRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.6) * 0.4;
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  const labelColor = isActive
    ? color
    : isDimmed
    ? "rgba(221,216,204,0.10)"
    : hovered
    ? "rgba(221,216,204,0.9)"
    : "rgba(221,216,204,0.45)";

  // On mobile: always show label (no hover), slightly larger
  const labelSize = isMobile
    ? (isActive ? 0.34 : 0.26)
    : (isActive ? 0.27 : 0.20);

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
        // Pointer events: desktop only (touch fires onClick natively)
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
        {isActive && (
          <mesh ref={ringRef}>
            <torusGeometry args={[sphereR * 1.7, 0.008, 6, 80]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
        )}

        <animated.mesh>
          <sphereGeometry args={[sphereR, isMobile ? 32 : 48, isMobile ? 32 : 48]} />
          <animated.meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            roughness={0.05}
            metalness={0.9}
            transparent
            opacity={opacity}
          />
        </animated.mesh>

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
