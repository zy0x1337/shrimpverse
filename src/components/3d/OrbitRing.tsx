import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

export function OrbitRing({ radius = 5.5 }: { radius?: number }) {
  const outerRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (outerRef.current) outerRef.current.rotation.z += delta * 0.03;
    if (innerRef.current) innerRef.current.rotation.z -= delta * 0.05;
  });

  return (
    <>
      {/* Main orbit torus */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.012, 8, 160]} />
        <meshBasicMaterial color="#2fc4b5" transparent opacity={0.18} />
      </mesh>

      {/* Dashed outer marker ring */}
      <mesh ref={outerRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius + 0.45, 0.005, 4, 80]} />
        <meshBasicMaterial color="#2fc4b5" transparent opacity={0.06} />
      </mesh>

      {/* Inner reference ring */}
      <mesh ref={innerRef} rotation={[Math.PI / 2.2, 0.1, 0]}>
        <torusGeometry args={[radius * 0.45, 0.008, 4, 80]} />
        <meshBasicMaterial color="#2fc4b5" transparent opacity={0.08} />
      </mesh>

      {/* Center origin sphere */}
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color="#2fc4b5"
          emissive="#2fc4b5"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </>
  );
}
