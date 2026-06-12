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

***
***

# Session 8 — Knowledge Integration & Arc Polish

> **Grundlage:** Peer-reviewed Recherche-Report (`docs/SHRIMP_KNOWLEDGE.md`, ehemals `a1f08922.md`)
> — Taxonomie mit Dispute-Flags, Wasserchemie pro Art, Farbgenetik, Cross-Matrizen,
> Breeding-Biologie, 40+ Glossar-Begriffe.
>
> **Ziel der Session:** Die wissenschaftliche Tiefe des Reports ins Produkt bringen,
> **ohne** die aufgeräumte Oberfläche zu opfern. Fokus zunächst **2D-Ansicht**.

## Leitprinzip — Intuitiv trotz Tiefe (gilt für ALLE Phasen)

Tiefe Informationsdichte darf nie zu Überforderung werden. Diese UX-Garantien sind
bindend, nicht optional:

1. **Progressive Disclosure als Grundregel.**
   Default-Ansicht bleibt exakt so ruhig wie heute. Expert Mode ist *opt-in* —
   wer nichts einschaltet, sieht keine neuen Badges, keine dichteren Labels.
2. **Eine Information pro Interaktion.**
   Arc antippen → *eine* Offspring-Info, kein Datenblatt. Planet → Monde.
   Mond → Dialog. Jede Ebene fügt genau eine Schicht hinzu.
3. **Farbe + Form tragen Bedeutung, nicht Text.**
   Arc-Typen werden über Farbe/Strichart kommuniziert; die bestehende Legende
   erklärt es einmal. Kein Label-Wust im Graph.
4. **Tooltips on-demand**, verschwinden von selbst. Nichts klebt fest.
5. **Fachbegriffe via vorhandenes `GlossaryTip`-Pattern** (`?`-Button im Dialog).
   Niemand muss Vokabular mitbringen.
6. **Expert Mode erweitert, ersetzt nie.** Gleiche Layout-Struktur, nur tiefere
   Sektionen darunter — der Nutzer verliert nie die Orientierung.

## Architektur-Entscheidungen (getroffen)

| Frage | Entscheidung | Begründung |
|-------|--------------|------------|
| Expert Mode Platzierung | **Globaler Toggle** in der Toolbar (State in `App.tsx`, `localStorage`-persistiert) | Trifft das mentale Modell „Modus" (normal vs. „show me all the shrimp info"). Speist zunächst StrainDialog + Arc-Labels, später erweiterbar. |
| Datenmodell-Tiefe | **Schlank** | Nur was Arcs + Expert-Dialog jetzt brauchen. Volle `{min,max,optimal}`-Migration von 49 Einträgen bringt keinen proportionalen Sofortnutzen, isoliert nachrüstbar. |
| Neocaridina-Cross-Netz | **Repräsentativ** | Didaktisch wichtigste Neo-Paare (z.B. Red×Blue → Wildtype-Reversion) statt voller 28er-Mesh. Hält die Ansicht lesbar. |

## Befunde aus der Code- & Datenanalyse (Ausgangslage)

- **49 Strains, alle mit `compatible[]`.** Stability-Werte in den Daten: nur
  `impossible` (25×) und `unstable` (52×) — **kein einziges `stable`**.
  Der Report sagt aber klar: Crystal × Taiwan Bee (Mischling) ist **stable**.
  → Die hardcodierte `FAMILY_ARCS` zeigt Crystal×TaiwanBee als teal „crosses",
  aber die Moon-Arcs leiten ihren Typ aus den Daten ab → werden nie teal.
  **Inkonsistenz, die Phase C behebt.**
- Report definiert 4. Level `stabilizing` (Pinto/Taitibee), das im Type fehlt.
- `getMoonArcPath` setzt den Kontrollpunkt auf `Mittelpunkt × 1.12` — schiebt vom
  SVG-Ursprung (0,0) weg, **nicht** senkrecht zur Verbindung. Bei gegenüberliegenden
  Planeten liegt der Mittelpunkt nahe 0,0 → Kurve wird fast gerade quer durchs
  Zentrum. Auf Mobile besonders unsauber. **Phase D behebt das.**
- Moon-Arcs verbinden zum *populärsten* Strain der Zielfamilie (Proxy), nicht zum
  echten kompatiblen Strain — `withId` fehlt.

## Phasen

| Phase | Titel | Dateien | Risiko | Status |
|-------|-------|---------|--------|--------|
| A | Knowledge Base ins Repo | `docs/SHRIMP_KNOWLEDGE.md` | minimal | 🔜 |
| B | Type-Erweiterungen | `strain.ts` | gering | 🔜 |
| C | Daten-Korrektur & -Vervollständigung | `strains.json` | gering | 🔜 |
| D | Arc-Rendering (Kern, mobile-first) | `FamilyOrbitExplorer.tsx` | mittel | 🔜 |
| E | Expert Mode | `App.tsx`, `FilterPanel.tsx`, `StrainDialog.tsx` | mittel | 🔜 |

### Phase A — Knowledge Base ins Repo
`a1f08922.md` → `docs/SHRIMP_KNOWLEDGE.md` (sprechender Name, canonical reference,
im Repo versioniert).

### Phase B — Type-Erweiterungen (`strain.ts`)

```ts
export type CrossStability = "stable" | "unstable" | "stabilizing" | "impossible";
export type TaxonomyStatus = "accepted" | "disputed" | "synonym" | "uncertain";

export interface CrossResult {
  with:       string;
  withId?:    string;        // NEU: strain-genaues Arc-Targeting
  offspring:  string;
  stability:  CrossStability;
  note?:      string;
}

export interface Strain {
  // … bestehend
  taxonomyStatus?: TaxonomyStatus;   // NEU — z.B. "disputed" für N. davidi-Komplex
  hybridOrigin?:   boolean;          // NEU — z.B. Taiwan Bee
}
```

### Phase C — Daten-Korrektur & -Vervollständigung (`strains.json`)
Abgeglichen gegen Report Kap. 4.1 (Cross-Compatibility-Matrix):

- **Crystal × Taiwan Bee → `stable`** (Mischling-Methode) — behebt Teal/Amber-Inkonsistenz
- **Pinto / Taitibee → `stabilizing`**
- Repräsentative Neo×Neo-Arcs als `unstable` (z.B. Red×Blue → Wildtype-Reversion)
- `withId` setzen, wo strain-genaues Targeting sinnvoll ist
- Taxonomie: `taxonomyStatus: "disputed"` für Neocaridina-Komplex,
  `hybridOrigin: true` für Taiwan Bee
- Symmetrie via vorhandene `validateCompatSymmetry` absichern (läuft im DEV-Startup)

### Phase D — Arc-Rendering (Kern, mobile-first) (`FamilyOrbitExplorer.tsx`)

1. **`getMoonArcPath` neu** — echter senkrechter Bogen statt Origin-Push:
   ```
   chord  = (x2-x1, y2-y1);  mid = ((x1+x2)/2, (y1+y2)/2)
   normal = (-chordY, chordX) / |chord|        // senkrecht zur Sehne
   bow    = clamp(|chord| * 0.18, 8, 40)       // skaliert, gedeckelt
   ctrl   = mid + normal * bow                  // konsistent gewölbt
   ```
2. **Arc-Bundling** — mehrere Arcs zwischen gleichem Paar fächern (bow-Offset inkrementell)
3. **4. Farbe** für `stabilizing` (violett/teal-blend) + Legende ergänzen
4. **`FAMILY_ARCS` aus den Daten generieren** statt hardcoded → Single Source of Truth
5. **`withId`-Targeting** ersetzt die „populärster Strain"-Proxy-Logik
6. **Mobile:** antippbare Arcs (unsichtbare breite Hitbox-Pfade) → zeigen Offspring-Label;
   sichtbare Arc-Anzahl deckeln (wichtigste gebündelt, Rest via Mond-Klick);
   Clipping-Schutz im 640er viewBox

### Phase E — Expert Mode (`App.tsx`, `FilterPanel.tsx`, `StrainDialog.tsx`)

- Globaler `expertMode`-Toggle (Toolbar, `localStorage`-persistiert)
- StrainDialog Expert-Sektionen (nur sichtbar wenn aktiv):
  Taxonomie-Status-Badge, erweiterte Genetik/Breeding-Biologie aus dem Report,
  dezenter Conservation-Hinweis (z.B. *C. dennerli* IUCN Critically Endangered)
- Arc-Labels nur im Expert Mode dauerhaft sichtbar (sonst on-tap/hover)

## Umsetzungs-Reihenfolge & Qualitätssicherung

**Reihenfolge:** A → B → C → D → E. Jede Phase einzeln committet & `npx tsc --noEmit`-geprüft.

**Sanity-Check pro sichtbarer Phase (D, E):**
Test auf 380px-Breite (mobile-first laut CLAUDE.md), bevor committet wird —
Arcs dürfen Planeten/Labels nicht überlappen, Tap-Targets ≥ 44px.

**Kern der Session:** Phase D (visuelle Arcs + Mobile) & Phase C (Datenvollständigkeit).
