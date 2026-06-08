import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { StrainPlanet } from "./StrainPlanet";
import { computeOrbitalPositions, wildformDistance, distanceToRadius } from "../../lib/orbitalDistance";
import type { Strain } from "../../types/strain";

interface Props {
  strains: Strain[];
  familyColor: string;
  center: [number, number, number];
  isActive: boolean;
  isMobile: boolean;
  onSelectStrain: (id: string) => void;
}

export function StrainOrbit({
  strains,
  familyColor,
  center,
  isActive,
  isMobile,
  onSelectStrain,
}: Props) {
  const groupRef = useRef<Group>(null);

  // Compute orbital positions once — pure function of strain data
  const orbits = computeOrbitalPositions(strains, center);

  // Slow continuous rotation of the entire system
  useFrame((_, delta) => {
    if (!isActive || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;
  });

  if (!isActive) return null;

  // Unique radii in the system for hairline orbit circles
  const uniqueRadii = Array.from(
    new Set(orbits.map((o) => Math.round(distanceToRadius(wildformDistance(o.strain)) * 100) / 100))
  );

  return (
    <group ref={groupRef} position={center}>
      {/* Hairline orbit circles — one per unique radius */}
      {uniqueRadii.map((r) => (
        <mesh key={r}>
          <torusGeometry args={[r, 0.004, 4, 128]} />
          <meshBasicMaterial
            color={familyColor}
            transparent
            opacity={isMobile ? 0.06 : 0.09}
          />
        </mesh>
      ))}

      {/* Planets at world positions, offset by center */}
      {orbits.map((o) => {
        const localPos: [number, number, number] = [
          o.position[0] - center[0],
          o.position[1] - center[1],
          o.position[2] - center[2],
        ];
        return (
          <StrainPlanet
            key={o.strain.id}
            strain={o.strain}
            position={localPos}
            orbitalRadius={o.radius}
            isHighlighted={false}
            isDimmed={false}
            isMobile={isMobile}
            onClick={() => onSelectStrain(o.strain.id)}
          />
        );
      })}
    </group>
  );
}
