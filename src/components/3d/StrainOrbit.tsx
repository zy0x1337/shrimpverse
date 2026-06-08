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
  /** Another family is currently selected — this whole orbit is dimmed */
  isDimmedByOther: boolean;
  isMobile: boolean;
  onSelectStrain: (id: string) => void;
}

export function StrainOrbit({
  strains,
  familyColor,
  center,
  isActive,
  isDimmedByOther,
  isMobile,
  onSelectStrain,
}: Props) {
  const groupRef = useRef<Group>(null);

  // On mobile, push moons further from the family planet to prevent overlap
  const orbits = computeOrbitalPositions(strains, center, isMobile ? 1.65 : 1.0);

  // Rotation only when this family is active
  useFrame((_, delta) => {
    if (!isActive || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;
  });

  // Orbit rings only when active
  const uniqueRadii = isActive
    ? Array.from(
        new Set(orbits.map((o) => Math.round(distanceToRadius(wildformDistance(o.strain)) * 100) / 100))
      )
    : [];

  return (
    <group ref={groupRef} position={center}>
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
            isDimmed={isDimmedByOther}
            isIdle={!isActive && !isDimmedByOther}
            isMobile={isMobile}
            onClick={() => isActive && onSelectStrain(o.strain.id)}
          />
        );
      })}
    </group>
  );
}
