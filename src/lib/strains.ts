/**
 * strains.ts
 * DEV-only validators for src/data/strains.json integrity.
 *
 * Call both functions at app startup when import.meta.env.DEV is true.
 * They are pure read-only and have no side effects beyond console warnings.
 */

import type { Strain } from "../types/strain";

// ---------------------------------------------------------------------------
// validateCompatFamilies
// ---------------------------------------------------------------------------
/**
 * Checks that every `compatible[].with` value refers to a family name
 * (or the special strain name "Blue Jelly" / "Red Blue Rili" etc.) that
 * actually exists somewhere in the dataset.
 *
 * Logs a warning for every dangling reference found.
 */
export function validateCompatFamilies(strains: Strain[]): void {
  // Collect all known family names AND all known strain names
  const knownFamilies = new Set(strains.map((s) => s.family));
  const knownNames    = new Set(strains.map((s) => s.name));

  let issues = 0;

  for (const strain of strains) {
    for (const cross of strain.compatible ?? []) {
      const target = cross.with;
      if (!knownFamilies.has(target) && !knownNames.has(target)) {
        console.warn(
          `[strains] validateCompatFamilies: "${strain.id}" references unknown target "${target}"`
        );
        issues++;
      }
    }
  }

  if (issues === 0) {
    console.log("[strains] validateCompatFamilies: OK — all compatible targets resolved.");
  } else {
    console.warn(`[strains] validateCompatFamilies: ${issues} unresolved target(s) found.`);
  }
}

// ---------------------------------------------------------------------------
// validateCompatSymmetry
// ---------------------------------------------------------------------------
/**
 * Checks that compatible cross-references are bidirectional.
 *
 * Rule: if strain A has `compatible[].with === X`, then at least one strain
 * whose family or name equals X must also have a compatible entry pointing
 * back to A's family or name.
 *
 * Impossible-stability entries are excluded — those are informational only
 * and intentionally one-directional (e.g. every Caridina lists Sulawesi as
 * impossible, but Sulawesi lists specific impossible targets).
 */
export function validateCompatSymmetry(strains: Strain[]): void {
  // Build a lookup: family → set of families/names they list as compatible
  const compatTargets = new Map<string, Set<string>>();

  for (const strain of strains) {
    const key = strain.family;
    if (!compatTargets.has(key)) {
      compatTargets.set(key, new Set());
    }
    for (const cross of strain.compatible ?? []) {
      if (cross.stability !== "impossible") {
        compatTargets.get(key)!.add(cross.with);
      }
    }
  }

  // Also build a name-level lookup for specific strain-to-strain references
  const nameTargets = new Map<string, Set<string>>();
  for (const strain of strains) {
    const key = strain.name;
    if (!nameTargets.has(key)) {
      nameTargets.set(key, new Set());
    }
    for (const cross of strain.compatible ?? []) {
      if (cross.stability !== "impossible") {
        nameTargets.get(key)!.add(cross.with);
      }
    }
  }

  let issues = 0;

  for (const strain of strains) {
    for (const cross of strain.compatible ?? []) {
      if (cross.stability === "impossible") continue;

      const target = cross.with;

      // Does the target family/name have a back-reference to this family or name?
      const targetFamilyRefs = compatTargets.get(target) ?? new Set<string>();
      const targetNameRefs   = nameTargets.get(target)   ?? new Set<string>();

      const hasBackRef =
        targetFamilyRefs.has(strain.family) ||
        targetFamilyRefs.has(strain.name)   ||
        targetNameRefs.has(strain.family)   ||
        targetNameRefs.has(strain.name);

      if (!hasBackRef) {
        console.warn(
          `[strains] validateCompatSymmetry: "${strain.id}" (family: ${strain.family}) → "${target}" — no back-reference found`
        );
        issues++;
      }
    }
  }

  if (issues === 0) {
    console.log("[strains] validateCompatSymmetry: OK — all non-impossible references are bidirectional.");
  } else {
    console.warn(`[strains] validateCompatSymmetry: ${issues} asymmetric reference(s) found.`);
  }
}
