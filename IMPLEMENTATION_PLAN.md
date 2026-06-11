# Shrimpverse — Implementierungsplan
### Ein Geschenk an die Shrimp-Community. Vier Phasen, keine AI-Slop-Ästhetik.

***

## Übersicht

Basis: 49 Strains, 14 Familien, vollständige `waterType`/`genus`/`species`-Daten bereits vorhanden.  
Stack: React + TypeScript + Framer Motion + Vite.  
Philosophie: Kein einziges Feature das „cool" ist aber nichts lehrt. Jede Zeile Code muss entweder einladen, erklären oder begeistern.

| Phase | Titel | Dateien | Aufwand | Status |
|-------|-------|---------|---------|--------|
| 1 | Stimme & Kontext | `strain.ts`, `strains.json`, `StrainDialog.tsx` | ~3h | ✅ Abgeschlossen |
| 2 | Intuition & Navigation | `FilterPanel.tsx`, `FamilyOrbitExplorer.tsx` | ~4h | ✅ Abgeschlossen |
| 3 | Orbit als Wissensraum | `FamilyOrbitExplorer.tsx` (Arcs + Moons) | ~5h | ✅ Abgeschlossen |
| 4 | Lebendigkeit & Tiefe | `StrainRail.tsx`, `styles.css`, Token-System | ~4h | 🔜 Als nächstes |
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
- `"impossible"` in `CrossResult.stability` hat echte semantische Funktion: unterscheidet „keine Kreuzung" von „keine Daten"
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

## ✅ Phase 3 — Orbit als Wissensraum
**Status: Abgeschlossen** — PRs #12, #13, #14 in `main` gemergt. Letzter Commit: `36183b8`.

### 3.1 Breeding Lines als SVG-Arcs ✅
- `FAMILY_ARCS`-Konstante mit `from / to / type / label`
- `getArcPath(fromAngle, toAngle, radius, cx, cy, curvature)` — Kontrollpunkt nach außen (`radius * (1 + curvature)`)
- Arc-Farben: teal (crosses) / amber (hybrid) / rot-dashed (impossible)
- Highlight bei `activeFamily`, Dimmen der restlichen Arcs
- Arc-Legende als inline SVG unterhalb des Orbits
- Wasserprofil-Hintergrundringe via `radialGradient` + `gradientUnits="userSpaceOnUse"`

### 3.2 Dual Active Moons ✅ (feat/dual-active-moons → main, PR #14)
- `moonA` / `moonB` State — zwei gleichzeitig aktive Familien-Monde
- `buildMoons(strains, familyNodes)` — liefert `MoonNode[]` (4–6px, Orbit-Radius = nodeR + 18)
- `buildMoonArcs(moonA, moonB, moons)` — verbindet kompatible Strain-Monde über `compatible[]`
- Monde nur sichtbar wenn Familie aktiv, klickbar → `onSelect(strain.id)` → öffnet `StrainDialog`
- TS-Guard: `(strain.compatible ?? [])` in `buildMoonArcs` — Fix für TS18048

**Entscheidungen:**
- `compatible` ist optional (`compatible?: CrossResult[]`) → immer `?? []` defensiv verwenden
- Moon-Arcs verwenden dieselbe `getArcPath`-Hilfsfunktion wie Family-Arcs
- `gradientUnits="userSpaceOnUse"` zwingend (SVG-Viewport zentriert auf `0,0`)

***

## 🔜 Phase 4 — Lebendigkeit & Tiefe
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
- **Phase 3 ✅:** `FAMILY_ARCS`-Konstante, `getArcPath`-Hilfsfunktion, `buildMoons`, `buildMoonArcs`, `moonA`/`moonB` Dual-State
- **Phase 4 🔜:** Flip-Card-Pattern in StrainCard, Swatch-Chips, CSS-Token-System
