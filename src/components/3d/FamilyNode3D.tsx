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
  onClick: () => void;
}

/**
 * Node design principle: one clear shape, one clear signal.
 *
 * The core sphere is the only emissive object — tight, high-contrast.
 * No outer halo unless active. No decorative rings unless active.
 * Labels are small and muted until selected.
 *
 * When active: the node breathes with a subtle pulse ring,
 * the label sharpens, and the scale lifts — nothing more.
 */
export function FamilyNode3D({
  position,
  color,
  family,
  strainCount,
  isActive,
  isDimmed,
  onClick,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<Mesh>(null);

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

  // Slow pulse ring on active — organic, not mechanical
  useFrame((state, delta) => {
    if (ringRef.current) {
      if (isActive) {
        ringRef.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 0.6) * 0.4;
        ringRef.current.rotation.z += delta * 0.5;
      }
    }
  });

  const labelColor = isActive
    ? color
    : isDimmed
    ? "rgba(221,216,204,0.15)"
    : hovered
    ? "rgba(221,216,204,0.9)"
    : "rgba(221,216,204,0.45)";

  return (
    <Float
      speed={0.8 + Math.random() * 0.5}
      rotationIntensity={isActive ? 0.0 : 0.08}
      floatIntensity={isActive ? 0.12 : 0.32}
    >
      <animated.group
        position={position}
        scale={scale}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        {/* Active pulse ring */}
        {isActive && (
          <mesh ref={ringRef}>
            <torusGeometry args={[0.78, 0.008, 6, 80]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
          </mesh>
        )}

        {/* Core sphere — the only emissive source */}
        <animated.mesh>
          <sphereGeometry args={[0.46, 48, 48]} />
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

        {/* Strain count — only when active */}
        {isActive && (
          <Text
            position={[0, 0, 0.5]}
            fontSize={0.19}
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

      {/* Label — world-space, always rendered, opacity via color */}
      <Text
        position={[position[0], position[1] + 0.88, position[2]]}
        fontSize={isActive ? 0.27 : 0.2}
        color={labelColor}
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
