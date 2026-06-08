import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Points } from "three";

interface Props {
  isMobile?: boolean;
}

export function UniverseBackground({ isMobile = false }: Props) {
  const starsRef = useRef<Points>(null);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <Stars
      ref={starsRef}
      // Fewer stars on mobile — still looks great, much lighter
      count={isMobile ? 1200 : 2800}
      radius={80}
      depth={60}
      factor={3}
      saturation={0.15}
      fade
      speed={0.4}
    />
  );
}
