import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import type { Mesh } from "three";

interface Props {
  isMobile: boolean;
}

export function Sun3D({ isMobile }: Props) {
  const coreRef = useRef<Mesh>(null);
  const midRef = useRef<Mesh>(null);
  const coronaRef = useRef<Mesh>(null);
  const ring1Ref = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const reduced = useReducedMotion();

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1.0 + Math.sin(t * 1.4) * 0.04);
    }
    if (midRef.current) {
      midRef.current.scale.setScalar(1.0 + Math.sin(t * 0.9 + 1.0) * 0.09);
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y += 0.003;
      coronaRef.current.rotation.x += 0.001;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += 0.004;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= 0.003;
    }
  });

  const r = isMobile ? 0.68 : 0.52;

  return (
    <group>
      {/* Warm golden key light — the solar source */}
      <pointLight color="#ffd090" intensity={isMobile ? 8 : 14} distance={40} decay={2} />
      {/* Softer amber fill */}
      <pointLight color="#ff9040" intensity={isMobile ? 2 : 3.5} distance={20} decay={2} />

      {/* Outer corona — very faint, slowly drifting */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[r * 3.2, 12, 12]} />
        <meshBasicMaterial color="#ff9020" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>

      {/* Mid atmospheric glow — pulsing */}
      <mesh ref={midRef}>
        <sphereGeometry args={[r * 1.9, 18, 18]} />
        <meshBasicMaterial color="#ffb040" transparent opacity={0.09} side={THREE.BackSide} />
      </mesh>

      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[r, isMobile ? 28 : 48, isMobile ? 28 : 48]} />
        <meshStandardMaterial
          color="#ffe060"
          emissive="#ff7010"
          emissiveIntensity={4.5}
          roughness={0.28}
          metalness={0.05}
        />
      </mesh>

      {/* Decorative corona rings */}
      <mesh ref={ring1Ref} rotation={[0.18, 0, 0]}>
        <torusGeometry args={[r * 1.55, 0.018, 8, 90]} />
        <meshBasicMaterial color="#ffc840" transparent opacity={0.28} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[0.42, 0.28, 0]}>
        <torusGeometry args={[r * 2.1, 0.009, 6, 90]} />
        <meshBasicMaterial color="#ff9030" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}
