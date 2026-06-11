# Data Quality & Universe View — Fix Plan

Dieses Dokument fasst alle bekannten Datenqualitätsprobleme zusammen und beschreibt,
wie sie in der **Universe-Ansicht** (`FamilyOrbitExplorer`) behoben werden müssen.

---

## Betroffene Dateien

| Datei | Art der Änderung |
|---|---|
| `src/lib/strains.ts` | Datenfixes: Symmetrie, IDs, `compatible[]`, `stability` |
| `src/types/strain.ts` | Schema-Erweiterung: `StabilityLevel`, `compatible_type` |
| `src/lib/constants.ts` | `familyGenus`, `familyDescriptions` ergänzen |
| `src/components/FamilyOrbitExplorer.tsx` | `FAMILY_ARCS` erweitern, Intra-Arcs, Arc-Radius dynamisch |

---

## Problem 1 — Asymmetrische `compatible`-Kanten 🔴 Kritisch

### Ursache
Wenn Strain A `compatible: ["B"]` hat, aber Strain B kein `compatible: ["A"]` enthält,
bricht der Orbit-Graph beim Traversieren der Kanten ab. Jede Kante muss **bidirektional** sein.

### Auswirkung auf Universe View
`FAMILY_ARCS` zwischen zwei Familien wird nur in einer Richtung gerendert —
der Bézier-Arc erscheint, aber das Tooltip-Label zeigt eine inkonsistente Kreuzungsrichtung.
Bei gefilterten `visibleStrains` können Arcs komplett verschwinden.

### Fix in `strains.ts`

```ts
function ensureSymmetry(strains: Strain[]): void {
  const map = new Map(strains.map(s => [s.id, s]));
  for (const strain of strains) {
    for (const compatId of strain.compatible) {
      const partner = map.get(compatId);
      if (!partner) continue; // → Problem 2
      if (!partner.compatible.includes(strain.id)) {
        partner.compatible.push(strain.id);
      }
    }
  }
}
```

---

## Problem 2 — Ungültige ID-Referenzen in `compatible[]` 🔴 Kritisch

### Ursache
`compatible` enthält String-IDs, die auf nicht existierende Strains verweisen
(z. B. nach Umbenennung oder Löschung).

### Auswirkung auf Universe View
`families.find(n => n.family === arc.from)` gibt `undefined` zurück —
der Arc fällt **lautlos** weg. Kein Fehler im Log, schwer debugbar.

### Fix in `strains.ts`

```ts
function validateCompatIds(strains: Strain[]): void {
  const ids = new Set(strains.map(s => s.id));
  for (const s of strains) {
    s.compatible = s.compatible.filter(id => {
      if (!ids.has(id)) {
        console.warn(`[shrimpverse] "${s.id}": ungültige compatible-ID "${id}" entfernt`);
        return false;
      }
      return true;
    });
  }
}
```

> Beide Funktionen beim App-Start aufrufen (Dev-only Guard reicht):
> ```ts
> if (import.meta.env.DEV) {
>   validateCompatIds(strains);
>   ensureSymmetry(strains);
> }
> ```

---

## Problem 3 — Leere `compatible: []` Arrays 🟠 Hoch

### Ursache
Strains mit leerem `compatible`-Array sind entweder:
- **(a)** echte Inkompatibilität → muss als `impossible`-Arc in `FAMILY_ARCS` erscheinen
- **(b)** fehlende Daten → kompatible Strains müssen ergänzt werden

### Auswirkung auf Universe View
Familien-Nodes ohne jede Verbindung erscheinen isoliert.
Kein Arc, kein Spoke-Highlight bei Hover → wirkt wie ein Bug.

### Neue `impossible`-Arcs für `FamilyOrbitExplorer.tsx`

```ts
// Ergänzungen zu FAMILY_ARCS:
{ from: "Sulawesi",   to: "Tiger",      type: "impossible", label: "Keine Kreuzung möglich" },
{ from: "Sulawesi",   to: "Amano",      type: "impossible", label: "Keine Kreuzung möglich" },
{ from: "Amano",      to: "Crystal",    type: "impossible", label: "Amano ist steril (Meerwasser-Larven)" },
{ from: "Amano",      to: "Taiwan Bee", type: "impossible", label: "Amano ist steril" },
{ from: "Bamboo",     to: "Crystal",    type: "impossible", label: "Bamboo ist steril (Brackwasser-Larven)" },
{ from: "Bamboo",     to: "Taiwan Bee", type: "impossible", label: "Bamboo ist steril" },
```

---

## Problem 4 — Fehlende Intra-Familien-Kanten 🟡 Mittel

### Ursache
`FAMILY_ARCS` beschreibt nur Inter-Familien-Kreuzungen (z. B. Crystal × Taiwan Bee).
Kreuzungen **innerhalb** einer Familie (z. B. Red Cherry × Bloody Mary) fehlen komplett.

### Schema-Erweiterung in `FamilyOrbitExplorer.tsx`

```ts
type ArcType = "crosses" | "hybrid" | "impossible" | "intra"; // neu: intra

const ARC_COLOR: Record<ArcType, string> = {
  crosses:    "rgba(47,196,181,0.30)",
  hybrid:     "rgba(255,196,80,0.25)",
  impossible: "rgba(180,60,60,0.22)",
  intra:      "rgba(200,200,200,0.15)", // dezent — gleiche Familie
};

const ARC_COLOR_ACTIVE: Record<ArcType, string> = {
  crosses:    "rgba(47,196,181,0.70)",
  hybrid:     "rgba(255,196,80,0.65)",
  impossible: "rgba(220,80,80,0.65)",
  intra:      "rgba(200,200,200,0.55)",
};
```

### Render-Guard (nur bei aktivem Family-Node)

```tsx
{FAMILY_ARCS.map((arc) => {
  // Intra-Arcs nur einblenden wenn die betroffene Familie aktiv ist
  if (arc.type === "intra" && activeFamily !== arc.from) return null;
  // ... bestehende Logik unverändert
})}
```

### Betroffene Familien

| Familie | Intra-Kreuzung | Typ |
|---|---|---|
| Red (Neo) | Red Cherry × Bloody Mary | `intra` |
| Red (Neo) | Bloody Mary × Red Rili | `intra` / hybrid |
| Tiger (Cari) | Orange Eye Blue Tiger × Black Tiger | `intra` |
| Taiwan Bee (Cari) | Panda × King Kong | `intra` |
| Taiwan Bee (Cari) | Shadow Panda × Blue Bolt | `intra` |
| Sulawesi (Cari) | Cardinal × White Glove | `intra` |

---

## Problem 5 — Explizite Widersprüche in `compatible[]` 🟠 Hoch

### Blue Leg Poso (Sulawesi)
- Blue Leg Poso hat `compatible: ["cardinal-shrimp"]`
- Cardinal Shrimp hat `compatible: []`
- **Widerspruch**: Sulawesi-Arten verschiedener Gattungen können sich nicht kreuzen

**Fix**: `compatible: []` bei Blue Leg Poso; stattdessen:
```ts
{ from: "Sulawesi", to: "Sulawesi", type: "impossible",
  label: "Blue Leg Poso × Cardinal: unterschiedliche Gattungen" }
```

### Snowball (Neo White) vs. OE Blue Dream (Neo Blue)
- Beide haben gegenseitig `compatible`-Einträge
- F1 = 100% blau, keine stabile reinweiße Linie möglich

**Fix**: Arc-Typ von `crosses` → `hybrid` in `FAMILY_ARCS` ändern:
```ts
// Vorher:
{ from: "White", to: "Blue", type: "crosses", label: "Snowball × OE Blue Dream" }
// Nachher:
{ from: "White", to: "Blue", type: "hybrid",  label: "Snowball × OE Blue Dream → gemischte F1" }
```

### Auswirkung auf Universe View
`ARC_COLOR` rendert diese Verbindungen aktuell türkis (`crosses`), obwohl sie
amber (`hybrid`) oder gestrichelt rot (`impossible`) sein müssten.

---

## Problem 6 — Fehlende `stability`-Typen 🟢 Nice-to-have

### Schema-Erweiterung in `src/types/strain.ts`

```ts
export type StabilityLevel = "stable" | "unstable" | "line-bred" | "wild-type";

export interface Strain {
  // ... bestehende Felder
  stability?: StabilityLevel;
  compatible_type?: Record<string, "crosses" | "hybrid" | "impossible">;
}
```

### Universe-View-Nutzung: Warn-Ring bei instabilen Familien

```tsx
// In der Planet-Node-Render-Sektion — nach dem bestehenden active-pulse:
{isActive && item.strains.some(s => s.stability === "unstable") && (
  <motion.circle
    cx={nx} cy={ny} r={nr + 10}
    fill="none"
    stroke="rgba(255,160,60,0.45)"
    strokeWidth="0.8"
    strokeDasharray="2 4"
    animate={{ rotate: 360 }}
    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    style={{ transformOrigin: `${nx}px ${ny}px` }}
  />
)}
```

---

## ARC_RADIUS — Dynamisch statt fix

Der aktuelle Wert `ARC_RADIUS = 213` ist einheitlich. Für korrekte Bögen
(besonders bei Intra-Arcs) sollte er dynamisch berechnet werden:

```ts
// Inter-Familien-Arc: Midpoint der beteiligten Orbit-Radien
const arcRadius = (fromNode.orbitR + toNode.orbitR) / 2;

// Intra-Familien-Arc: kleiner Offset vom Node-Rand
const intraArcRadius = fromNode.orbitR + fromNode.nodeR + 8;
```

---

## Implementierungs-Checkliste

### Phase A — Datenfixes (Blocker)
- [ ] `ensureSymmetry()` in den Strain-Build-Prozess integrieren
- [ ] `validateCompatIds()` als Dev-only Guard beim App-Start
- [ ] Alle `compatible: []` Strains reviewen → füllen oder `impossible` dokumentieren
- [ ] Widersprüche korrigieren (Blue Leg Poso, Snowball × OE Blue Dream)

### Phase B — `FamilyOrbitExplorer.tsx`
- [ ] `ArcType` um `"intra"` erweitern
- [ ] `ARC_COLOR` / `ARC_COLOR_ACTIVE` für `"intra"` ergänzen
- [ ] `FAMILY_ARCS` um fehlende `impossible`-Arcs erweitern (Amano steril, Bamboo steril)
- [ ] Intra-Familien-Arcs hinzufügen (nur bei `activeFamily` sichtbar)
- [ ] Arc-Radius dynamisch berechnen statt Konstante `213`

### Phase C — Schema & Typen
- [ ] `StabilityLevel`-Typ in `strain.ts` einführen
- [ ] `compatible_type`-Feld (optional) für granulare per-Paar-Typen
- [ ] Bestehende Strain-Daten mit `stability`-Werten befüllen
- [ ] Orbit: `stability === "unstable"` als gestrichelten Warn-Ring rendern

---

## Prioritäten-Übersicht

| # | Problem | Priorität | Impact auf Universe View |
|---|---|---|---|
| 1 | Asymmetrische `compatible`-Kanten | 🔴 Kritisch | Arcs fehlen / zeigen falsche Richtung |
| 2 | Ungültige ID-Referenzen | 🔴 Kritisch | Stille Arc-Ausfälle, schwer debugbar |
| 5 | Explizite Widersprüche | 🟠 Hoch | Falsche Arc-Farben (crosses statt hybrid/impossible) |
| 3 | Leere `compatible[]`-Arrays | 🟠 Hoch | Isolierte Nodes, fehlende impossible-Arcs |
| 4 | Intra-Familien-Kanten | 🟡 Mittel | Feature-Gap für Züchter |
| 6 | `stability`-Typen | 🟢 Nice-to-have | Visueller Warn-Ring im Orbit |

---

## Architekturhinweis

`FamilyOrbitExplorer` erhält `visibleStrains` als Prop — alle Datenfixes aus **Phase A**
müssen **upstream** (Datenschicht / Strain-Ladelogik) angewendet werden, nicht
innerhalb der Komponente selbst. Der Explorer vertraut darauf, dass die Daten valide sind.
**Phase B–C** sind ausschließlich Änderungen in `FamilyOrbitExplorer.tsx` und `strain.ts`.
