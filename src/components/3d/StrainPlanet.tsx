import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useRef, useState, useMemo } from "react";
import type { Mesh } from "three";
import type { Strain } from "../../types/strain";

interface Props {
  strain: Strain;
  /** World-space position — caller computes orbit math */
  position: [number, number, number];
  familyColor: string;
  isHighlighted: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

/**
 * A single strain rendered as a small planet.
 *
 * Visual encoding:
 *   - Base color = strain.colors[0] (dominant hue)
 *   - Equatorial band = strain.colors[1] (secondary)
 *   - Pole cap tint = strain.colors[2] (accent)
 *   - Size = mapped from popularity (1–5 → 0.10–0.22 radius)
 *   - Emissive intensity stays low — planets reflect, they don’t glow
 */
export function StrainPlanet({
  strain,
  position,
  familyColor,
  isHighlighted,
  isDimmed,
  onClick,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<Mesh>(null);

  // Slow self-rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (0.18 + strain.popularity * 0.04);
    }
  });

  const radius = useMemo(
    () => 0.1 + (strain.popularity / 5) * 0.13,
    [strain.popularity],
  );

  const { scale } = useSpring({
    scale: isHighlighted ? 1.6 : hovered ? 1.3 : isDimmed ? 0.7 : 1.0,
    config: { tension: 300, friction: 24 },
  });

  const { opacity } = useSpring({
    opacity: isDimmed ? 0.22 : 1.0,
    config: { tension: 200, friction: 30 },
  });

  const labelColor = isHighlighted
    ? "rgba(255,255,255,0.95)"
    : hovered
    ? "rgba(255,255,255,0.75)"
    : "rgba(255,255,255,0.0)";

  return (
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
      {/* Planet body — dominant color */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <animated.meshStandardMaterial
          color={strain.colors[0]}
          emissive={strain.colors[0]}
          emissiveIntensity={isHighlighted ? 0.35 : hovered ? 0.15 : 0.04}
          roughness={0.55}
          metalness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Equatorial band ring — secondary color */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.28, radius * 0.06, 6, 48]} />
        <animated.meshBasicMaterial
          color={strain.colors[1]}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Name label — only on hover/highlight */}
      <Text
        position={[0, radius + 0.14, 0]}
        fontSize={0.11}
        color={labelColor}
        anchorX="center"
        anchorY="bottom"
        renderOrder={5}
        depthOffset={-2}
        letterSpacing={0.04}
      >
        {strain.name}
      </Text>
    </animated.group>
  );
}
