# Shrimpverse — Bug & UX Report (Session 8)

Getestet: 2D-Ansicht (Desktop + Mobile), automatisierte Browser-Tests (Chromium/Playwright)  
Datum: 2026-06-12

---

## Desktop — Arc / Verbindungs-Bugs

### Bug 1 — Mond „Red Cherry" durch Sulawesi-Planet verdeckt (nicht klickbar)

**Was passiert:** Reds oberster Mond (Red Cherry) liegt exakt hinter dem Sulawesi-Hexagon. Ein Klick auf diese Position aktiviert stattdessen Sulawesi. Der Mond ist weder klickbar noch sichtbar interagierbar.

**Warum:** Red (innen, −90°) und Sulawesi (außen, −90°) stehen beide am selben Winkel. Reds Monde orbitieren nach außen und reichen in die Sulawesi-Zone. Da Sulawesi später im SVG gerendert wird, liegt es im Z-Order darüber. Das gleiche Problem tritt strukturell bei **Green ↔ Amano** auf (beide bei +90°).

**Fundort:** `FamilyOrbitExplorer.tsx` — Reihenfolge der planet `<motion.g>` Elemente im SVG.

**Fix-Idee:** Den aktiven Planeten (inkl. seiner Monde) zuletzt rendern, sodass er immer im Z-Order oben liegt. Oder eine transparente Hit-Area auf den Mond-`<g>` Elementen via `pointerEvents="bounding-box"`.

---

### Bug 2 — Impossible Moon-Arcs erscheinen als Volllinie statt gestrichelt

**Was passiert:** Moon-to-Moon-Verbindungen vom Typ `impossible` (z.B. Sulawesi ↔ Crystal, Sulawesi ↔ Tiger) sollten als rote **gestrichelte** Linie erscheinen (`stroke-dasharray: 3 3`). Sie erscheinen stattdessen als **Volllinie** — optisch identisch mit normalen Arcs.

**Beweis (DOM-Analyse nach Animation):**
```
Erwartet:  stroke-dasharray = "3 3"
Tatsächlich: stroke-dasharray = "1 1"  ← von framer-motion überschrieben
```

**Warum:** `<motion.path animate={{ pathLength: 1 }}>` nutzt `stroke-dasharray` intern für die Zeichenanimation (path-drawing). Damit wird das explizit gesetzte `strokeDasharray="3 3"` Prop überschrieben. Nach Abschluss der Animation bleibt der framer-motion-interne Wert `"1 1"` gesetzt.

**Fundort:** `FamilyOrbitExplorer.tsx`, Moon-Arc-Rendering-Block (`moonArcs.map`).

**Fix-Idee:** Für impossible-Arcs `pathLength`-Animation weglassen und stattdessen nur `opacity` animieren (`initial={{ opacity: 0 }} animate={{ opacity: 0.85 }}`). Alternativ: `strokeDasharray` nach Animation per `onAnimationComplete` manuell setzen.

---

### Bug 3 — Neo+Caridina-Badge zeigt „no direct crosses" statt „cannot crossbreed"

**Was passiert:** Wenn ein Neocaridina-Planet (Red, Orange, Yellow, Green, Blue, Black, Brown, White) mit einem Caridina-Planeten (Crystal, Taiwan Bee, Tiger) kombiniert wird, zeigt der Vergleichs-Badge **„no direct crosses"**. Diese Aussage ist faktisch falsch — Neocaridina und Caridina können biologisch **nie** kreuzen.

**Zum Vergleich:** Sulawesi + Crystal zeigt korrekt **„cannot crossbreed"** — weil Sulawesi-Stämme explizite `compatible: [{stability: "impossible"}]`-Einträge für Crystal, Taiwan Bee und Tiger besitzen.

**Warum:** In `strains.json` fehlen bei allen Neocaridina-Familien die `impossible`-Einträge für Caridina-Familien. Der Badge-Code wertet `moonArcs` aus, die aus `compatible[]`-Daten gebaut werden — ohne Daten gibt es keine Arcs, und der Badge fällt auf den Fallback „no direct crosses" zurück.

**Betroffene Paare:** Red/Orange/Yellow/Green/Blue/Black/Brown/White × Crystal/Taiwan Bee/Tiger (alle 24 Kombinationen).

**Fundort:** `src/data/strains.json` — fehlende `compatible`-Einträge in Neo-Stämmen.

**Fix-Idee:** Mindestens einem Stamm jeder Neo-Familie folgende Einträge hinzufügen:
```json
"compatible": [
  { "with": "Crystal",    "offspring": "—", "stability": "impossible" },
  { "with": "Taiwan Bee", "offspring": "—", "stability": "impossible" },
  { "with": "Tiger",      "offspring": "—", "stability": "impossible" }
]
```

---

## Mobile — UX-Bugs & Friction

*Getestet auf: iPhone 14 Pro (390×844), Android small (360×780), iPad Mini (768×1024)*

---

### Bug 4 — Toolbar-Titel umbricht auf 3 Zeilen (Mobile)

**Was passiert:** Der Untertitel „Genera, species & documented varieties" bricht auf 390px auf **3 Zeilen** um und nimmt **140 px** der Toolbar ein (17 % des Screens). Der erste Eindruck auf Mobile wirkt wie ein kaputtes Layout — viel Text, kaum Inhalt.

**Warum:** Der `<h2>`-Text hat keine `max-width` oder Kürzung auf Mobile. Er konkurriert mit den Toolbar-Actions (ViewToggle + 2 Buttons) im Flex-Row-Layout.

**Fundort:** `src/App.tsx` (h2-Text) + `src/styles.css` (`.toolbar h2` Mobile-Styles).

**Fix-Idee:** Auf Mobile kürzeren Text verwenden, z.B. „Species Explorer" oder den h2 auf Mobile ausblenden (wie `eyebrow` bereits per `display: none` versteckt wird).

---

### Bug 5 — Zwei-Planeten-Vergleich auf Mobile kaum nutzbar

**Was passiert:** Nach dem ersten Planet-Tap öffnet sich die Rail nach **700 ms**. Danach sind Planeten in der **unteren Orbithälfte** (Amano, Bamboo, Green, Yellow) durch die Rail verdeckt und nicht mehr antippbar. Die Rail interceptiert den zweiten Tap.

**Folge:** Der Vergleichs-Badge erscheint nicht, da der zweite Planet nie aktiviert wird. In Tests: `badgeVisible: false` nach Crystal → Taiwan Bee Tap-Sequenz auf iPhone.

**Warum:** Die Rail öffnet sich automatisch mit Zeitverzögerung, ohne dass der User signalisiert hat, fertig mit Planeten-Auswahl zu sein. Es gibt keinen visuellen Hinweis, dass man nach dem ersten Tap noch einen zweiten Planeten wählen kann.

**Fundort:** `FamilyOrbitExplorer.tsx`, `handleFamilyClick` → `setTimeout(() => setRailOpen(true), 700)`.

**Fix-Idee:** Rail auf Mobile **nicht automatisch öffnen** — stattdessen einen Swipe-Up-Indicator am unteren Rand zeigen. Der User öffnet die Rail manuell, wenn er die Planetenwahl abgeschlossen hat.

---

### Bug 6 — Tablet (768px) bekommt Mobile-Layout statt Desktop-Layout

**Was passiert:** Auf einem iPad Mini (768×1024) sieht der User:
- Die Strain-Rail **unter** dem Orbit (Bottom-Sheet) statt rechts daneben
- Kein sichtbares Sidebar
- Die gesamte horizontale Breite des Tablets bleibt ungenutzt

**Warum:** `useIsMobile()` gibt bei genau 768px `true` zurück — der Schwellenwert `<= 768` inkludiert Tablets.

```ts
// src/hooks/useIsMobile.ts
window.innerWidth <= 768  // ← 768 triggert mobile layout
```

**Fundort:** `src/hooks/useIsMobile.ts`, Zeile 13.

**Fix-Idee:** Schwellenwert auf `< 640` senken, oder einen separaten `isTablet`-Breakpoint einführen der das rechte Rail-Layout bei 640–1024px erzwingt.

---

### Bug 7 — Die meisten Planeten-Tappziele sind unter WCAG-Minimum

**Was passiert:** Auf iPhone 390px gemessene Tap-Target-Größen:

| Familie | Größe | WCAG 44px |
|---|---|---|
| Red | 44×44 px | ✓ |
| Sulawesi | 98×48 px | ✓ |
| Blue | 41×41 px | ⚠ knapp |
| Crystal | 39×41 px | ⚠ knapp |
| Tiger | 34×36 px | ✗ |
| Amano | 27×29 px | ✗ sehr klein |
| White | 29×29 px | ✗ sehr klein |
| Black | 31×31 px | ✗ sehr klein |
| Bamboo | 29×31 px | ✗ sehr klein |

**Fix-Idee:** Jeder Planet-`<g>` bekommt eine transparente `<circle>`-Hintergrundscheibe mit `r = max(nodeR, 22)` und `pointerEvents="all"` als unsichtbare Hit-Area — die visuelle Größe bleibt, der Tappbereich wird auf Minimum 44px angehoben.

---

### Bug 8 — Zwei Legenden-Zeilen fressen Orbit-Fläche auf Mobile

**Was passiert:** Am unteren Rand des Orbits stehen zwei separate Legenden übereinander:
1. Arc-Legend: `crossable · hybrid · stabilizing · -- incompatible`
2. Shape-Legend: `● Neocaridina · ⬡ Caridina / Exotics`

Das sind ~80 px verlorene Orbit-Fläche. Auf 360px werden beide Zeilen mehrzeilig.

**Fix-Idee:** Beide Legenden in eine einzelne Zeile zusammenführen, oder hinter einem `ⓘ`-Button verstecken.

---

### Bug 9 — Strain-Karten mit Factoid brauchen zwei Taps (nicht offensichtlich)

**Was passiert:** Karten mit `factoid`-Eintrag erfordern auf Mobile:
- **Tap 1:** Karte flippt → zeigt Factoid-Text
- **Tap 2:** Dialog öffnet sich

Das `✦`-Icon auf der Vorderseite ist sehr klein. Neue User tippen, sehen unerwarteten Text und verstehen nicht, warum der Dialog nicht geöffnet wurde. Der Hinweis „tap to open →" erscheint erst *nach* dem Flip.

**Fundort:** `src/components/StrainRail.tsx`, `handleClick()`-Logik, Zeile 84–93.

**Fix-Idee:** Auf Touch-Geräten den Flip-Effekt weglassen und direkt zur Detail-Ansicht navigieren. Das Factoid kann im Dialog selbst angezeigt werden.

---

### Bug 10 — Expert-Mode-Button auf Mobile ohne erkennbare Funktion

**Was passiert:** Das Hirn-Icon in der Toolbar hat nur einen `title`-Tooltip (`"Expert mode: OFF"`). Tooltips werden auf Touch-Geräten **nie angezeigt**. Mobile-User wissen nicht, was der Button macht.

**Fundort:** `src/App.tsx`, Expert-mode `<button>`, Zeile ~228.

**Fix-Idee:** Kleines Text-Label daneben anzeigen wenn aktiviert (`EXPERT`), oder einen kurzen Snackbar-Toast beim ersten Aktivieren einblenden.

---

## Übersicht

| # | Beschreibung | Schwere | Kategorie |
|---|---|---|---|
| 1 | Red Cherry / Amano-Mond verdeckt & nicht klickbar | 🔴 Hoch | Desktop SVG |
| 2 | Impossible-Arcs solid statt gestrichelt | 🔴 Hoch | Desktop SVG |
| 3 | Neo+Caridina-Badge zeigt „no direct crosses" | 🔴 Hoch | Daten |
| 4 | Toolbar-Titel bricht 3-zeilig um | 🟡 Mittel | Mobile Layout |
| 5 | Zwei-Planeten-Vergleich auf Mobile kaum nutzbar | 🔴 Hoch | Mobile UX |
| 6 | Tablet 768px bekommt Mobile-Layout | 🟡 Mittel | Breakpoint |
| 7 | Planeten-Tappziele zu klein (WCAG) | 🟡 Mittel | Mobile A11y |
| 8 | Zwei Legenden fressen Orbit-Fläche | 🟢 Niedrig | Mobile Layout |
| 9 | Zwei-Tap-Pattern für Strain-Dialog unklar | 🟡 Mittel | Mobile UX |
| 10 | Expert-Mode-Button ohne Kontext auf Mobile | 🟢 Niedrig | Mobile UX |
