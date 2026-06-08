import { Stars, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Points } from "three";

export function UniverseBackground() {
  const starsRef = useRef<Points>(null);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.006;
    }
  });

  return (
    <>
      {/* Water-particle dust — like suspended algae spores */}
      <Sparkles
        count={180}
        scale={28}
        size={1.4}
        speed={0.25}
        color="#2fc4b5"
        opacity={0.55}
      />
      {/* Secondary warm sparkles — shrimp bio-luminescence */}
      <Sparkles
        count={60}
        scale={14}
        size={2.2}
        speed={0.15}
        color="#ffcc44"
        opacity={0.2}
      />
      {/* Deep starfield */}
      <Stars
        ref={starsRef}
        radius={80}
        depth={55}
        count={2800}
        factor={3}
        saturation={0.35}
        fade
        speed={0.4}
      />
    </>
  );
}
