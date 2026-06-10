# Shrimpverse — Implementierungsplan
### Ein Geschenk an die Shrimp-Community. Vier Phasen, keine AI-Slop-Ästhetik.

***

## Übersicht

Basis: 49 Strains, 14 Familien, vollständige `waterType`/`genus`/`species`-Daten bereits vorhanden.  
Stack: React + TypeScript + Framer Motion + Vite.  
Philosophie: Kein einziges Feature das "cool" ist aber nichts lehrt. Jede Zeile Code muss entweder einladen, erklären oder begeistern.

| Phase | Titel | Dateien | Aufwand | Impact |
|-------|-------|---------|---------|--------|
| 1 | Stimme & Kontext | `strain.ts`, `strains.json`, `StrainDialog.tsx` | ~3h | ★★★★★ |
| 2 | Intuition & Navigation | `FilterPanel.tsx`, `FamilyOrbitExplorer.tsx` | ~4h | ★★★★★ |
| 3 | Orbit als Wissensraum | `FamilyOrbitExplorer.tsx` (Arcs) | ~5h | ★★★★☆ |
| 4 | Lebendigkeit & Tiefe | `StrainRail.tsx`, `styles.css`, Token-System | ~4h | ★★★★☆ |
| R | Roadmap (kein Datum) | Neue Komponenten | offen | ★★★★★ |

***

## Phase 1 — Stimme & Kontext
**Ziel:** Jeder geöffnete Dialog lehrt etwas. Keine nackten Daten mehr.

### 1.1 Typ-Erweiterung: `src/types/strain.ts`

Drei neue optionale Felder zu `Strain` hinzufügen:

```typescript
export interface WaterProfile {
  gh: string;    // z.B. "6–10"
  kh: string;    // z.B. "2–6"
  ph: string;    // z.B. "7.0–7.5"
  tds: string;   // z.B. "150–250"
  temp: string;  // z.B. "20–26°C"
}

export interface CrossResult {
  with: string;        // family id, z.B. "Tiger"
  offspring: string;   // z.B. "Taitibee"
  stability: "stable" | "unstable" | "impossible";
  note?: string;
}

export interface Strain {
  // ...bestehende Felder unverändert...
  waterProfile?: WaterProfile;
  compatible?: CrossResult[];
  /** Max 15 words. Used for flip card back. */
  factoid?: string;
}
```

> **Review-Hinweis:** `temp` als String ist display-only. Falls später programmatische Vergleiche (z.B. "Kompatibel nach Temperaturbereich") geplant sind, `tempMin`/`tempMax: number` in Betracht ziehen.

**Warum:** `waterType: "soft" | "hard" | "neutral"` ist für Anfänger nutzlos. `waterProfile` ersetzt Abstraktion durch echte Zahlen.

***

### 1.2 Datenerweiterung: `src/data/strains.json`

Alle 49 Einträge um `waterProfile`, `factoid`, und wo zutreffend `compatible` ergänzen.

**Wasser-Mapping nach Genus/Family:**

```jsonc
// Neocaridina davidi (alle Hard-Water-Familien: Red, Blue, Yellow, Orange, Green, Black, Brown, White)
"waterProfile": {
  "gh": "6–10", "kh": "2–6", "ph": "7.0–7.5", "tds": "150–250", "temp": "18–26°C"
}

// Caridina cantonensis (Crystal, Taiwan Bee)
"waterProfile": {
  "gh": "4–6", "kh": "0–2", "ph": "6.0–6.8", "tds": "100–150", "temp": "20–24°C"
}

// Caridina cf. cantonensis 'Tiger'
"waterProfile": {
  "gh": "4–8", "kh": "0–4", "ph": "6.0–7.2", "tds": "100–200", "temp": "20–25°C"
}

// Sulawesi (alle 4 Strains: dennerli, spinata, sp.)
"waterProfile": {
  "gh": "4–6", "kh": "2–4", "ph": "7.5–8.5", "tds": "100–180", "temp": "27–30°C"
}

// Caridina multidentata (Amano)
"waterProfile": {
  "gh": "6–15", "kh": "1–5", "ph": "6.5–7.5", "tds": "100–250", "temp": "18–26°C"
}

// Atyopsis (Bamboo — neutral, braucht Strömung)
"waterProfile": {
  "gh": "5–12", "kh": "2–6", "ph": "6.5–7.5", "tds": "150–250", "temp": "22–28°C"
}
```

**Compatibility-Daten:**

```jsonc
// In der Crystal-Familie (alle 6 Strains):
"compatible": [
  { "with": "Taiwan Bee", "offspring": "Panda / King Kong", "stability": "unstable",
    "note": "Offspring sind spektakulär aber selten F2-stabil." }
]

// In der Taiwan-Bee-Familie:
"compatible": [
  { "with": "Crystal", "offspring": "Panda / King Kong", "stability": "unstable" }
]

// In der Tiger-Familie:
"compatible": [
  { "with": "Crystal", "offspring": "Taitibee", "stability": "unstable",
    "note": "Taitibee = Tiger × Crystal Bee. Variable Muster, selten fixierbar." }
]

// Sulawesi:
"compatible": [
  { "with": "Crystal", "offspring": "", "stability": "impossible",
    "note": "Sulawesi-Arten können nicht mit anderen Caridina gekreuzt werden." }
]
```

> **Review-Hinweis:** `"impossible"` in `CrossResult.stability` leistet echte semantische Arbeit — es verhindert, dass "keine Daten" mit "keine Kreuzung" verwechselt wird.

**Factoids:**

```jsonc
"factoid": "Red Cherry Shrimp sind die meistgehaltene Zwerggarnelenart weltweit."
"factoid": "Intensives Blau entsteht erst nach mehreren Selektionsgenerationen — keine Wildfarbe."
"factoid": "CRS wurden 1996 zufällig aus einer Mutation in einer Tigergarnelen-Zucht entdeckt."
"factoid": "Blue Bolt zeigt den Crystal-Körper, aber mit vollständig blauer Pigmentierung."
"factoid": "Amano-Garnelen wurden von Aquascape-Pionier Takashi Amano weltberühmt gemacht."
"factoid": "Bamboo Shrimp filtern Mikropartikel aus der Strömung — kein Bodenfutter nötig."
"factoid": "Cardinal Shrimp leben ausschließlich in zwei Seen Sulawesis — nirgendwo sonst auf der Welt."
"factoid": "Taitibee ist eine Hybride aus Tiger und Crystal — F2 zeigt sehr variable Muster."
```

***

### 1.3 Komponenten-Refactor: `src/components/StrainDialog.tsx`

**A) Wasserprofil-Badge**

Direkt unter dem `dialog-meta-grid`, vor dem Summary-Text:

```tsx
{strain.waterProfile && (
  <div className="dialog-water-profile">
    <span className="dialog-water-label">Water</span>
    <div className="dialog-water-grid">
      {[
        { key: 'GH', val: strain.waterProfile.gh },
        { key: 'KH', val: strain.waterProfile.kh },
        { key: 'pH', val: strain.waterProfile.ph },
        { key: 'TDS', val: strain.waterProfile.tds },
        { key: 'Temp', val: strain.waterProfile.temp },
      ].map(({ key, val }) => (
        <div key={key} className="dialog-water-cell">
          <span className="dialog-water-key">{key}</span>
          <span className="dialog-water-val">{val}</span>
        </div>
      ))}
    </div>
  </div>
)}
```

CSS:
```css
.dialog-water-profile {
  margin-top: var(--s3);
  padding: var(--s2) var(--s3);
  background: rgba(47, 196, 181, 0.06);
  border: 1px solid rgba(47, 196, 181, 0.18);
  border-radius: 8px;
}
.dialog-water-grid {
  display: flex; gap: var(--s3); flex-wrap: wrap; margin-top: var(--s1);
}
.dialog-water-cell {
  display: flex; flex-direction: column; align-items: center;
  min-width: 48px;
}
.dialog-water-key {
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--color-muted); font-family: var(--font-mono);
}
.dialog-water-val {
  font-size: 13px; font-weight: 600; color: var(--color-teal);
  font-family: var(--font-mono);
}
```

**B) Compatibility-Sektion**

```tsx
{strain.compatible && strain.compatible.length > 0 && (
  <div className="dialog-compat">
    <span className="dialog-section-label">Crossing notes</span>
    {strain.compatible.map((c) => (
      <div key={c.with} className={`dialog-compat-row compat-${c.stability}`}>
        <span className="compat-families">
          {strain.family} × {c.with}
        </span>
        {c.offspring && (
          <span className="compat-offspring">→ {c.offspring}</span>
        )}
        <span className={`compat-badge compat-badge--${c.stability}`}>
          {c.stability}
        </span>
        {c.note && <p className="compat-note">{c.note}</p>}
      </div>
    ))}
  </div>
)}

{/* Auto-Hinweis für Neocaridina davidi */}
{strain.genus === 'Neocaridina' && (
  <p className="dialog-neo-compat-note">
    Crosses freely with all Neocaridina davidi variants — isolate to keep color lines pure.
  </p>
)}
```

**C) Tags als klickbare Filter**

`StrainDialog` bekommt `onTagFilter: (tag: string) => void` Prop.  
Tags von `<span>` zu `<button>` — beim Klick: Dialog schließen + Filter setzen.  
Prop in `App.tsx`: `setFilters(f => ({ ...f, query: tag }))`.

***

## Phase 2 — Intuition & Navigation
**Ziel:** Der erste Besuch ist kein Rätsel mehr. Wer noch nie eine Garnele gehalten hat, weiß nach 10 Sekunden wo er steht.

### 2.1 Guided Paths: `src/components/FilterPanel.tsx`

```tsx
const PATHS = [
  {
    id: 'start',
    emoji: '🌱',
    label: 'Just starting out',
    hint: 'Hardy, forgiving, beautiful',
    filters: { level: 'Beginner', waterType: 'hard', family: '', query: '' },
  },
  {
    id: 'ready',
    emoji: '🔬',
    label: 'Ready for more',
    hint: 'Crystal & Taiwan Bee lines',
    filters: { level: 'Intermediate', waterType: 'soft', family: '', query: '' },
  },
  {
    id: 'deep',
    emoji: '🌊',
    label: 'Deep water',
    hint: 'Rare. Demanding. Worth it.',
    filters: { level: 'Collector', family: 'Sulawesi', query: '' },
  },
] as const;
```

> **Review-Hinweis:** `filters` als `Partial<FilterState>` typen und im `onClick` mit Defaults mergen — `as const` mit vollständigen FilterState-Shapes bricht still wenn neue Pflichtfelder hinzukommen.

```tsx
<div className="sidebar-paths">
  {PATHS.map(path => (
    <button
      key={path.id}
      className="path-btn"
      onClick={() => onFilterChange({ ...filters, ...path.filters })}
    >
      <span className="path-emoji">{path.emoji}</span>
      <span className="path-text">
        <span className="path-label">{path.label}</span>
        <span className="path-hint">{path.hint}</span>
      </span>
    </button>
  ))}
</div>
```

**ButtonGroup statt native `<select>`:**

```tsx
// src/components/ButtonGroup.tsx
interface ButtonGroupProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}

export function ButtonGroup({ label, options, value, onChange }: ButtonGroupProps) {
  return (
    <div className="btn-group-wrapper">
      <span className="btn-group-label">{label}</span>
      <div className="btn-group" role="group" aria-label={label}>
        {options.map(opt => (
          <button
            key={opt.value}
            className={`btn-group-item ${value === opt.value ? 'active' : ''}`}
            onClick={() => onChange(opt.value === value ? '' : opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

> **Review-Hinweis:** `onChange(opt.value === value ? '' : opt.value)` setzt bei Deselect einen leeren String. Sicherstellen, dass `''` in `FilterState` als "kein Filter" gültig ist — bei Umstieg auf `undefined` muss diese Logik angepasst werden.

### 2.2 First-Visit Hint: `src/components/FamilyOrbitExplorer.tsx`

```tsx
const [hasInteracted, setHasInteracted] = useState(false);

{!hasInteracted && (
  <motion.text
    x={CENTER} y={CENTER + INNER_RING_RADIUS + 40}
    textAnchor="middle"
    className="orbit-hint"
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.5, 0] }}
    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', delay: 1.5 }}
    exit={{ opacity: 0 }}
  >
    click a planet to explore
  </motion.text>
)}
```

> **Review-Hinweis:** `[0, 0.5, 0]` mit `repeatType: 'reverse'` ist gleichmäßiger als `[0, 0.6, 0.3, 0.6]` — weniger visuelles Jitter.

**Stats-Bar als Satz:**

```tsx
const neoCount = filtered.filter(s => s.genus === 'Neocaridina').length;
const caCount  = filtered.filter(s => s.genus === 'Caridina').length;

<span className="orbit-stats-sentence">
  {activeFamily
    ? `${filtered.length} ${activeFamily} strain${filtered.length !== 1 ? 's' : ''}`
    : `${filtered.length} varieties — ${neoCount} Neocaridina, ${caCount} Caridina`
  }
</span>
```

**Gift Note Footer:**

```tsx
<div className="sidebar-gift-note">
  <span>A free resource for the freshwater shrimp community.</span>
  <span>No tracking. No ads. Just shrimp.</span>
</div>
```

***

## Phase 3 — Orbit als Wissensraum
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

> **Review-Hinweis:** Die `from`/`to`-Strings müssen exakt mit dem Property übereinstimmen, das `familyNodes` verwendet. Eine `familyId`-Alias-Type verhindert stille Mismatches.

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

> **Review-Hinweis (Mathematik):** Die ursprüngliche Formel `radius * curvature` zog den Kontrollpunkt zur Mitte hin — Arcs bogen einwärts, besonders bei benachbarten Familien. `radius * (1 + curvature)` schiebt den Kontrollpunkt nach außen; alle Arcs wölben sich sichtbar um die Nodes herum.

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
        className="orbit-arc"
        whileHover={{ strokeWidth: 2, opacity: 1 }}
      />
      <title>{arc.label}</title>
    </g>
  );
})}
```

**Arc-Legende:**

```tsx
<g className="arc-legend" transform={`translate(${CENTER - 160}, ${CENTER + OUTER_RING_RADIUS + 24})`}>
  <circle cx="6" cy="6" r="4" fill="rgba(47,196,181,0.5)" />
  <text x="14" y="10" className="arc-legend-text">crossable</text>
  <circle cx="70" cy="6" r="4" fill="rgba(255,196,80,0.5)" />
  <text x="78" y="10" className="arc-legend-text">hybrid</text>
  <line x1="130" y1="6" x2="150" y2="6" stroke="rgba(180,60,60,0.5)" strokeDasharray="3 3" strokeWidth="1.5"/>
  <text x="155" y="10" className="arc-legend-text">incompatible</text>
</g>
```

### 3.2 Wasserprofil-Hintergrundringe

```tsx
<defs>
  <radialGradient id="neo-water" cx={CENTER} cy={CENTER} r={INNER_RING_RADIUS + 18}
    gradientUnits="userSpaceOnUse">
    <stop offset="30%" stopColor="transparent" />
    <stop offset="70%" stopColor="rgba(180, 140, 60, 0.07)" />
    <stop offset="100%" stopColor="rgba(180, 140, 60, 0.0)" />
  </radialGradient>
  <radialGradient id="cari-water" cx={CENTER} cy={CENTER} r={OUTER_RING_RADIUS + 18}
    gradientUnits="userSpaceOnUse">
    <stop offset="55%" stopColor="transparent" />
    <stop offset="85%" stopColor="rgba(47, 130, 196, 0.07)" />
    <stop offset="100%" stopColor="rgba(47, 130, 196, 0.0)" />
  </radialGradient>
</defs>

<circle cx={CENTER} cy={CENTER} r={INNER_RING_RADIUS + 18}
  fill="url(#neo-water)" className="water-ring neo-ring" />
<circle cx={CENTER} cy={CENTER} r={OUTER_RING_RADIUS + 18}
  fill="url(#cari-water)" className="water-ring cari-ring" />
```

> **Review-Hinweis:** `gradientUnits="userSpaceOnUse"` mit expliziten `cx/cy/r` ist zwingend — `objectBoundingBox` (SVG-Default) verhält sich auf `<circle>` browserübergreifend unzuverlässig.

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
      <motion.div
        key="front"
        className="strain-card-front"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        {/* bestehender Card-Inhalt */}
      </motion.div>
    ) : (
      <motion.div
        key="back"
        className="strain-card-back"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        <p className="strain-factoid">"{strain.factoid}"</p>
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
```

> **Review-Hinweis:** `rotateY` via Framer Motion `animate`-Prop + `transformStyle: preserve-3d` funktioniert nicht zuverlässig — FM transformiert via CSS `transform`, nicht `rotate3d`. Opacity + Scale ist die robustere Alternative.

Flip nur wenn `strain.factoid` vorhanden — kein broken State bei leeren Einträgen.

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
.dialog-swatch-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
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

**Font-Tokens:**
```css
:root {
  --font-body: 'IBM Plex Sans', system-ui, sans-serif;
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-mono: 'IBM Plex Mono', 'Fira Code', monospace;
}
```

> **Review-Hinweis:** Fonts müssen in `index.html` via Google Fonts oder `/public` self-hosted geladen werden — die CSS-Token-Deklaration allein rendert nichts.

**Farbtoken-Audit:**
```css
:root {
  --color-teal: #2fc4b5;
  --color-amber: #ffc450;
  --color-danger: #b43c3c;
  --color-muted: #9a9590;
  --color-surface: #1a1917;
  --color-border: rgba(255, 255, 255, 0.08);
}
```

Alle hardcoded Hex-Werte im CSS durch Token ersetzen. Globales Suchen-Ersetzen nach `#2fc4b5`, `rgba(47, 196, 181`, etc.

***

## CLAUDE.md Update-Reminder

Nach Abschluss jeder Phase `CLAUDE.md` aktualisieren, damit Folge-Sessions nicht neu-erfinden:

- **Phase 1:** `WaterProfile`, `CrossResult`, `factoid` in Strain-Interface
- **Phase 2:** `ButtonGroup`-Komponente, `PATHS`-Konstante
- **Phase 3:** `FAMILY_ARCS`-Konstante, `getArcPath`-Hilfsfunktion
- **Phase 4:** Flip-Card-Pattern in StrainCard
