import type { Strain } from "../types/strain";

/**
 * Computes a normalised distance [0–1] from the Wildform for any strain.
 *
 * The further from wild-type morphology, the higher the value:
 *
 *   Level       Beginner=0  Intermediate=1  Collector=2       (weight 1.5)
 *   Pattern     Solid=0  BackStripe=1  Translucent=1  Rili=2  (weight 1.0)
 *   Stability   stable=0  unstable=1                          (weight 1.0)
 *   Line        base lines=0  multi-lines=0.5  cross-lines=1  (weight 0.5)
 *
 * Max raw score = 2×1.5 + 2×1.0 + 1×1.0 + 1×0.5 = 6.5
 */
export function wildformDistance(s: Strain): number {
  const levelScore: Record<string, number> = {
    Beginner: 0,
    Intermediate: 1,
    Collector: 2,
  };

  const patternScore: Record<string, number> = {
    Mottled: 0,
    Solid: 0,
    "Back stripe": 1,
    Translucent: 1,
    Rili: 2,
  };

  // Lines that are single-color, stable derivations score lowest
  const baseLines = new Set(["Base", "Red", "Orange", "Yellow", "Green", "White"]);
  // Lines that blend two gene pools score highest
  const crossLines = new Set(["Mary", "Rili"]);

  const lv = levelScore[s.level] ?? 1;
  const pt = patternScore[s.pattern] ?? 0;
  const st = s.stable ? 0 : 1;
  const li = baseLines.has(s.line) ? 0 : crossLines.has(s.line) ? 1 : 0.5;

  const raw = lv * 1.5 + pt * 1.0 + st * 1.0 + li * 0.5;
  return Math.min(raw / 6.5, 1.0);
}

/**
 * Converts a normalised distance to an orbital radius (world units).
 * Closest planets orbit at MIN_R, most distant at MAX_R.
 */
const MIN_R = 0.85;
const MAX_R = 2.55;
export function distanceToRadius(d: number): number {
  return MIN_R + d * (MAX_R - MIN_R);
}

/**
 * Distributes N planets in 3-D space using a golden-angle spiral.
 * All planets orbit at their individual radius, evenly spaced in
 * angle so no two planets at similar distances cluster together.
 *
 * Each orbit is slightly inclined (sin-wave Y offset) to give 3-D depth.
 */
export function computeOrbitalPositions(
  strains: Strain[],
  center: [number, number, number],
): Array<{ strain: Strain; position: [number, number, number]; radius: number }> {
  const PHI = Math.PI * (3 - Math.sqrt(5)); // golden angle ≈ 137.5°

  return strains.map((strain, i) => {
    const d = wildformDistance(strain);
    const r = distanceToRadius(d);
    const angle = i * PHI;
    // Small inclination: planets at different angles get slight Y variation
    const inclination = Math.sin(angle * 0.5) * 0.28 * d;

    const x = center[0] + Math.cos(angle) * r;
    const y = center[1] + inclination;
    const z = center[2] + Math.sin(angle) * r;

    return { strain, position: [x, y, z] as [number, number, number], radius: r };
  });
}
