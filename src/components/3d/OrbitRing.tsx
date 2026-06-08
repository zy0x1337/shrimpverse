interface Props {
  radius: number;
  color?: string;
  opacity?: number;
  tilt?: number;
  dashScale?: number;
}

export function OrbitRing({
  radius,
  color = "#2fc4b5",
  opacity = 0.12,
  tilt = Math.PI * 0.18,
}: Props) {
  return (
    <mesh rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.007, 4, 180]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}
