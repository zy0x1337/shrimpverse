# Shrimpverse — Implementierungsplan
### Ein Geschenk an die Shrimp-Community. Vier Phasen, keine AI-Slop-Ästhetik.

***

## Übersicht

Basis: 49 Strains, 14 Familien, vollständige `waterType`/`genus`/`species`-Daten bereits vorhanden.  
Stack: React + TypeScript + Framer Motion + Vite.  
Philosophie: Kein einziges Feature das "cool" ist aber nichts lehrt. Jede Zeile Code muss entweder einladen, erklären oder begeistern.

| Phase | Titel | Dateien | Aufwand | Status |
|-------|-------|---------|---------|--------|
| 1 | Stimme & Kontext | `strain.ts`, `strains.json`, `StrainDialog.tsx` | ~3h | ✅ Abgeschlossen |
| 2 | Intuition & Navigation | `FilterPanel.tsx`, `FamilyOrbitExplorer.tsx` | ~4h | ✅ Abgeschlossen |
| 3 | Orbit als Wissensraum | `FamilyOrbitExplorer.tsx` (Arcs) | ~5h | 🔜 Als nächstes |
| 4 | Lebendigkeit & Tiefe | `StrainRail.tsx`, `styles.css`, Token-System | ~4h | ⏳ Ausstehend |
| R | Roadmap (kein Datum) | Neue Komponenten | offen | ⏳ Ausstehend |

***

## ✅ Phase 1 — Stimme & Kontext
**Status: Abgeschlossen** — Commits `e9e5202`, `e87e7bf` auf `main`.

**Was wurde gebaut:**
- `strain.ts` — `WaterProfile`, `CrossResult`, `factoid` Interfaces
- `strains.json` — alle 49 Strains mit `waterProfile`, `compatible[]`, `factoid` befüllt
- `StrainDialog.tsx` — **5-Spalten Wasserprofil-Grid** (GH / KH / pH / TDS / Temp) mit Teal-Akzent, **Compatibility-Sektion** mit `compat-badge--{stability}`-Styling, Tags als klickbare Filter
- `App.tsx` — `handleTagFilter` + `handleApplyPreset` vollständig verdrahtet
- `styles.css` — `.dialog-water-profile`, `.water-cell`, `.compat-badge--stable/unstable/impossible`

**Entscheidungen:**
- `temp` als String (display-only) — falls programmatische Vergleiche nötig werden: `tempMin`/`tempMax: number` ergänzen
- `"impossible"` in `CrossResult.stability` hat echte semantische Funktion: unterscheidet "keine Kreuzung" von "keine Daten"
- Mobile-Breakpoint: Wasserprofil-Grid fällt auf 3+2 Layout (`@media max-width: 768px`)

***

## ✅ Phase 2 — Intuition & Navigation
**Status: Abgeschlossen** — bereits vor Phase 1 committed, in `main` enthalten.

**Was wurde gebaut:**
- `FilterPanel.tsx` — `GUIDED_PATHS` mit 3 Preset-Buttons (`🌱 Just starting out`, `🔬 Ready for more`, `🌊 Deep water`), Toggle-Deselect-Logik, `onApplyPreset`-Prop
- `ButtonGroup`-Komponente — inline in `FilterPanel.tsx`, ersetzt native `<select>`, `role="group"`, `aria-pressed`
- `FamilyOrbitExplorer.tsx` — First-Visit Hint (pulsierender dashed ring + SVG-Text `CLICK ANY PLANET TO EXPLORE`, verschwindet nach erstem Interact via `hasInteracted` State)
- Stats-Bar als Satz (`orbit-stats-sentence`): `{neoCount} Neocaridina · {caridineCount} Caridina`
- Gift Note Footer: `"A free, open-source gift to the freshwater shrimp community."`

***

## 🔜 Phase 3 — Orbit als Wissensraum
**Ziel:** Die Karte zeigt nicht nur Familien — sie zeigt ihre Beziehungen.

### 3.1 Breeding Lines als SVG-Arcs

```typescript
const FAMILY_ARCS: Array<{
  from: string; to: string;
  type: 'crosses' | 'hybrid' | 'impossible';
  label: string;
}> = [
  { from: 'Crystal',    to: 'Taiwan Bee', type: 'crosses',    label: 'Crystal × TB → Panda/King Kong' },
  { from: 'Crystal',    to: 'Tiger',      type: 'hybrid',     label: 'Crystal × Tiger → Taitibee' },
  { from: 'Taiwan Bee', to: 'Tiger',      type: 'hybrid',     label: 'TB × Tiger → Mischung' },
  { from: 'Sulawesi',   to: 'Crystal',    type: 'impossible', label: 'Keine Kreuzung möglich' },
  { from: 'Sulawesi',   to: 'Taiwan Bee', type: 'impossible', label: 'Keine Kreuzung möglich' },
];
```

> **Hinweis:** `from`/`to`-Strings müssen exakt mit dem Property übereinstimmen, das `familyNodes` verwendet. Eine `familyId`-Alias-Type verhindert stille Mismatches.

**Arc-Pfad-Hilfsfunktion:**

```typescript
function getArcPath(
  fromAngle: number, toAngle: number,
  radius: number, cx: number, cy: number,
  curvature = 0.35
): string {
  const x1 = cx + radius * Math.cos(fromAngle);
  const y1 = cy + radius * Math.sin(fromAngle);
  const x2 = cx + radius * Math.cos(toAngle);
  const y2 = cy + radius * Math.sin(toAngle);
  // Kontrollpunkt nach außen — verhindert inward-collapse bei benachbarten Nodes
  const midAngle = (fromAngle + toAngle) / 2;
  const mx = cx + radius * (1 + curvature) * Math.cos(midAngle);
  const my = cy + radius * (1 + curvature) * Math.sin(midAngle);
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}
```

> **Mathematik-Hinweis:** `radius * (1 + curvature)` schiebt den Kontrollpunkt nach außen. Die ursprüngliche Formel `radius * curvature` zog ihn zur Mitte — Arcs bogen einwärts, besonders bei benachbarten Familien.

**Arc-Render im SVG:**

```tsx
{FAMILY_ARCS.map(arc => {
  const fromNode = familyNodes.find(n => n.family === arc.from);
  const toNode   = familyNodes.find(n => n.family === arc.to);
  if (!fromNode || !toNode) return null;

  const arcColor = {
    crosses:    'rgba(47, 196, 181, 0.25)',
    hybrid:     'rgba(255, 196, 80, 0.20)',
    impossible: 'rgba(180, 60, 60, 0.15)',
  }[arc.type];

  const isHighlighted = activeFamily === arc.from || activeFamily === arc.to;

  return (
    <g key={`${arc.from}-${arc.to}`}>
      <motion.path
        d={getArcPath(fromNode.angle, toNode.angle, OUTER_RING_RADIUS * 0.85, CENTER, CENTER)}
        stroke={arcColor}
        strokeWidth={isHighlighted ? 1.5 : 0.8}
        fill="none"
        strokeDasharray={arc.type === 'impossible' ? '4 4' : undefined}
        opacity={activeFamily && !isHighlighted ? 0.2 : 1}
        whileHover={{ strokeWidth: 2, opacity: 1 }}
      />
      <title>{arc.label}</title>
    </g>
  );
})}
```

**Arc-Legende** (inline SVG unterhalb des Orbits):

```tsx
<div className="orbit-arc-legend" aria-hidden="true">
  <span className="arc-legend-item arc-legend--crosses">crossable</span>
  <span className="arc-legend-item arc-legend--hybrid">hybrid</span>
  <span className="arc-legend-item arc-legend--impossible">incompatible</span>
</div>
```

### 3.2 Wasserprofil-Hintergrundringe

```tsx
<defs>
  <radialGradient id="neo-water" cx="0" cy="0" r={INNER_RING_RADIUS + 18}
    gradientUnits="userSpaceOnUse">
    <stop offset="30%" stopColor="transparent" />
    <stop offset="70%" stopColor="rgba(180, 140, 60, 0.07)" />
    <stop offset="100%" stopColor="rgba(180, 140, 60, 0.0)" />
  </radialGradient>
  <radialGradient id="cari-water" cx="0" cy="0" r={OUTER_RING_RADIUS + 18}
    gradientUnits="userSpaceOnUse">
    <stop offset="55%" stopColor="transparent" />
    <stop offset="85%" stopColor="rgba(47, 130, 196, 0.07)" />
    <stop offset="100%" stopColor="rgba(47, 130, 196, 0.0)" />
  </radialGradient>
</defs>

<circle cx="0" cy="0" r={INNER_RING_RADIUS + 18} fill="url(#neo-water)" />
<circle cx="0" cy="0" r={OUTER_RING_RADIUS + 18} fill="url(#cari-water)" />
```

> **Hinweis:** `gradientUnits="userSpaceOnUse"` mit `cx="0" cy="0"` ist zwingend — der SVG-Viewport ist auf `(-320, -320, 640, 640)` zentriert. `objectBoundingBox` (Default) verhält sich auf `<circle>` browserübergreifend unzuverlässig.

***

## Phase 4 — Lebendigkeit & Tiefe
**Ziel:** Die kleinen Momente die jemanden innehalten lassen.

### 4.1 Flip-Cards im StrainRail

```tsx
const [flipped, setFlipped] = useState(false);

<motion.div
  className="strain-card"
  onHoverStart={() => strain.factoid && setFlipped(true)}
  onHoverEnd={() => setFlipped(false)}
>
  <AnimatePresence mode="wait">
    {!flipped ? (
      <motion.div key="front" className="strain-card-front"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
      >
        {/* bestehender Card-Inhalt */}
      </motion.div>
    ) : (
      <motion.div key="back" className="strain-card-back"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
      >
        <p className="strain-factoid">"{strain.factoid}"</p>
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
```

> **Hinweis:** `rotateY` via Framer Motion + `transformStyle: preserve-3d` ist nicht zuverlässig. Opacity + Scale ist die robustere Alternative. Flip nur wenn `strain.factoid` vorhanden.

### 4.2 Swatch-Chips mit Hover-Label

```tsx
{strain.colors.map((color, i) => (
  <div key={i} className="dialog-swatch-wrapper" title={color}>
    <div className="dialog-swatch" style={{ background: color }} />
    <span className="dialog-swatch-hex">{color}</span>
  </div>
))}
```

```css
.dialog-swatch-hex {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.15s, transform 0.15s;
}
.dialog-swatch-wrapper:hover .dialog-swatch-hex {
  opacity: 1;
  transform: translateY(0);
}
```

### 4.3 CSS Token-Konsolidierung

```css
:root {
  --font-body:    'IBM Plex Sans', system-ui, sans-serif;
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-mono:    'IBM Plex Mono', 'Fira Code', monospace;
  --color-teal:   #2fc4b5;
  --color-amber:  #ffc450;
  --color-danger: #b43c3c;
  --color-muted:  #9a9590;
  --color-surface: #1a1917;
  --color-border: rgba(255, 255, 255, 0.08);
}
```

Globales Suchen-Ersetzen aller hardcoded Hex-Werte (`#2fc4b5`, `rgba(47, 196, 181`, etc.) durch Token.

***

## CLAUDE.md Update-Reminder

Nach Abschluss jeder Phase `CLAUDE.md` aktualisieren:

- **Phase 1 ✅:** `WaterProfile`, `CrossResult`, `factoid` in Strain-Interface; `dialog-water-profile` Grid + `compat-badge--*` CSS
- **Phase 2 ✅:** `ButtonGroup`-Komponente, `GUIDED_PATHS`-Konstante, `hasInteracted`-State, `orbit-stats-sentence`
- **Phase 3 🔜:** `FAMILY_ARCS`-Konstante, `getArcPath`-Hilfsfunktion
- **Phase 4 ⏳:** Flip-Card-Pattern in StrainCard
