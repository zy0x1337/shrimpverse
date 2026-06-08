import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useRef, useState, useMemo } from "react";
import type { Mesh } from "three";
import type { Strain } from "../../types/strain";

interface Props {
  strain: Strain;
  position: [number, number, number];
  isHighlighted: boolean;
  isDimmed: boolean;
  isMobile: boolean;
  onClick: () => void;
}

export function StrainPlanet({
  strain,
  position,
  isHighlighted,
  isDimmed,
  isMobile,
  onClick,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (0.18 + strain.popularity * 0.04);
    }
  });

  // Mobile: floor radius at 0.14 for min tap target, desktop stays tighter
  const radius = useMemo(
    () => {
      const base = isMobile ? 0.14 : 0.10;
      const max  = isMobile ? 0.26 : 0.23;
      return base + (strain.popularity / 5) * (max - base);
    },
    [strain.popularity, isMobile],
  );

  const { scale } = useSpring({
    scale: isHighlighted ? 1.6 : hovered ? 1.3 : isDimmed ? 0.7 : 1.0,
    config: { tension: 300, friction: 24 },
  });

  const { opacity } = useSpring({
    opacity: isDimmed ? 0.22 : 1.0,
    config: { tension: 200, friction: 30 },
  });

  // Label: always visible on mobile (no hover), hidden on desktop unless hovered/highlighted
  const showLabel = isMobile ? !isDimmed : (isHighlighted || hovered);
  const labelOpacity = showLabel ? (isHighlighted ? 0.95 : 0.65) : 0.0;

  return (
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
      {/* Planet body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, isMobile ? 20 : 32, isMobile ? 20 : 32]} />
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

      {/* Equatorial ring — skip on mobile for perf */}
      {!isMobile && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 1.28, radius * 0.06, 6, 48]} />
          <animated.meshBasicMaterial
            color={strain.colors[1]}
            transparent
            opacity={opacity}
          />
        </mesh>
      )}

      <Text
        position={[0, radius + (isMobile ? 0.18 : 0.14), 0]}
        fontSize={isMobile ? 0.14 : 0.11}
        color={`rgba(255,255,255,${labelOpacity})`}
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
