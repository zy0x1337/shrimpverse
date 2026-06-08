/**
 * The orbit ring: single hairline torus.
 * No glow, no gradient — just a precise geometric guide
 * that tells the eye where the nodes live.
 * Opacity is low enough that it reads as structure,
 * not as decoration.
 */
export function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI * 0.18, 0, 0]}>
      <torusGeometry args={[radius, 0.007, 4, 160]} />
      <meshBasicMaterial
        color="#2fc4b5"
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}
