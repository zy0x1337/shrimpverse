import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { StrainPlanet } from "./StrainPlanet";
import type { Strain } from "../../types/strain";

interface Props {
  strains: Strain[];
  familyColor: string;
  center: [number, number, number];
  isActive: boolean;
  onSelectStrain: (id: string) => void;
}

export function StrainOrbit({
  strains,
  familyColor,
  center,
  isActive,
  onSelectStrain,
}: Props) {
  const groupRef = useRef<Group>(null);

  const orbitalData = useMemo(() => {
    const RING_CAPACITY = [6, 10, 999];
    const RING_RADII = [1.4, 2.2, 3.0];
    const RING_INCLINATIONS = [0.18, -0.22, 0.12];
    const RING_SPEEDS = [0.22, 0.15, 0.10];

    const rings = RING_CAPACITY.map((cap) => ({ capacity: cap, count: 0 }));
    let ringIdx = 0;

    const assignments: number[] = strains.map(() => {
      if (rings[ringIdx].count >= RING_CAPACITY[ringIdx] && ringIdx < 2) {
        ringIdx++;
      }
      rings[ringIdx].count++;
      return ringIdx;
    });

    const ringCounters = [0, 0, 0];
    return strains.map((strain, i) => {
      const ring = assignments[i];
      const totalInRing = rings[ring].count;
      const posInRing = ringCounters[ring]++;
      const baseAngle = (posInRing / totalInRing) * Math.PI * 2;

      return {
        strain,
        ring,
        radius: RING_RADII[ring],
        baseAngle,
        speed: RING_SPEEDS[ring],
        inclination: RING_INCLINATIONS[ring],
      };
    });
  }, [strains]);

  const anglesRef = useRef<number[]>(orbitalData.map((d) => d.baseAngle));

  useFrame((_, delta) => {
    if (!isActive || !groupRef.current) return;
    anglesRef.current = anglesRef.current.map(
      (a, i) => a + delta * orbitalData[i].speed,
    );
  });

  if (!isActive) return null;

  return (
    <group ref={groupRef}>
      {[1.4, 2.2, 3.0]
        .filter((_, i) => orbitalData.some((d) => d.ring === i))
        .map((r, i) => (
          <mesh
            key={r}
            position={center}
            rotation={[[0.18, -0.22, 0.12][i], 0, 0] as unknown as [number, number, number]}
          >
            <torusGeometry args={[r, 0.005, 4, 120]} />
            <meshBasicMaterial
              color={familyColor}
              transparent
              opacity={0.08}
            />
          </mesh>
        ))}

      {orbitalData.map((d, i) => {
        const angle = anglesRef.current[i];
        const x = center[0] + Math.cos(angle) * d.radius;
        const y = center[1] + Math.sin(angle * 0.5) * d.radius * Math.sin(d.inclination);
        const z = center[2] + Math.sin(angle) * d.radius;

        return (
          <StrainPlanet
            key={d.strain.id}
            strain={d.strain}
            position={[x, y, z]}
            isHighlighted={false}
            isDimmed={false}
            onClick={() => onSelectStrain(d.strain.id)}
          />
        );
      })}
    </group>
  );
}
