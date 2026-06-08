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
    scale: isActive ? 1.45 : hovered ? 1.18 : isDimmed ? 0.75 : 1.0,
    config: { tension: 320, friction: 22 },
  });

  const { emissiveIntensity } = useSpring({
    emissiveIntensity: isActive ? 1.8 : hovered ? 0.8 : isDimmed ? 0.05 : 0.25,
    config: { tension: 200, friction: 30 },
  });

  const { opacity } = useSpring({
    opacity: isDimmed ? 0.2 : 1.0,
    config: { tension: 200, friction: 30 },
  });

  // Pulse ring rotation for active node
  useFrame((_, delta) => {
    if (ringRef.current && isActive) {
      ringRef.current.rotation.x += delta * 1.2;
      ringRef.current.rotation.z += delta * 0.7;
    }
  });

  return (
    <Float
      speed={1.2 + Math.random() * 0.8}
      rotationIntensity={isActive ? 0.05 : 0.15}
      floatIntensity={isActive ? 0.2 : 0.45}
    >
      <animated.group
        position={position}
        scale={scale}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = "default"; }}
      >
        {/* Outer halo — only when active/hovered */}
        {(isActive || hovered) && (
          <mesh>
            <sphereGeometry args={[0.95, 24, 24]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.4}
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Spinning orbit ring — visible when active */}
        {isActive && (
          <mesh ref={ringRef}>
            <torusGeometry args={[0.72, 0.012, 8, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
          </mesh>
        )}

        {/* Core sphere */}
        <animated.mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <animated.meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            roughness={0.12}
            metalness={0.85}
            transparent
            opacity={opacity}
          />
        </animated.mesh>

        {/* Family initial — centered */}
        <Text
          position={[0, 0, 0.58]}
          fontSize={0.28}
          color="white"
          anchorX="center"
          anchorY="middle"
          renderOrder={2}
          depthOffset={-1}
        >
          {family[0]}
        </Text>

        {/* Strain count badge */}
        <mesh position={[0.42, 0.42, 0.28]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial color="#080c10" />
        </mesh>
        <Text
          position={[0.42, 0.42, 0.46]}
          fontSize={0.13}
          color={color}
          anchorX="center"
          anchorY="middle"
          renderOrder={3}
          depthOffset={-1}
        >
          {strainCount}
        </Text>
      </animated.group>

      {/* Label — always visible, world-space */}
      <animated.group opacity={opacity}>
        <Text
          position={[position[0], position[1] + 1.05, position[2]]}
          fontSize={isActive ? 0.32 : 0.24}
          color={isActive ? color : "rgba(221,216,204,0.7)"}
          anchorX="center"
          anchorY="middle"
          renderOrder={1}
        >
          {family}
        </Text>
      </animated.group>
    </Float>
  );
}
