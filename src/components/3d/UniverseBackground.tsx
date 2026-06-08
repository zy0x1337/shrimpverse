import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Points } from "three";

/**
 * Background — just stars. No Sparkles, no noise.
 *
 * The stillness of deep space makes the glowing nodes
 * feel more precious by contrast. A single slow rotation
 * gives the scene life without calling attention to itself.
 */
export function UniverseBackground() {
  const ref = useRef<Points>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.006;
  });

  return (
    <Stars
      ref={ref}
      radius={90}
      depth={50}
      count={2200}
      factor={2.2}
      saturation={0.15}
      fade
      speed={0}
    />
  );
}
