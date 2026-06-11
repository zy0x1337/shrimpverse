# Shrimpverse — UX & First-Experience Analyse

## ✅ Connections — vollständig implementiert

Alle 5 Breeding-Arcs aus dem Implementierungsplan sind vorhanden und korrekt gerendert:

| Arc | Typ | Visuell |
|-----|-----|---------|
| Crystal × Taiwan Bee | `crosses` | Teal, durchgezogen |
| Crystal × Tiger | `hybrid` | Amber, durchgezogen |
| Taiwan Bee × Tiger | `hybrid` | Amber, durchgezogen |
| Sulawesi × Crystal | `impossible` | Rot, gestrichelt |
| Sulawesi × Taiwan Bee | `impossible` | Rot, gestrichelt |

Die `getArcPath()`-Funktion verwendet einen korrekten quadratischen Bézier mit outward-verschobenem Kontrollpunkt und `delta`-Wraparound-Fix. Arc-Legende (`crossable / hybrid / incompatible`) ist inline im SVG am unteren Rand. Bei aktivem Family-Node werden nur die relevanten Arcs highlighted — der Rest dimmt auf `opacity: 0.12` ab.

---

## 🟡 First Experience — Stärken & Lücken

### Was gut funktioniert

- Onboarding-Hint (`CLICK ANY PLANET TO EXPLORE`) mit Pulse-Animation erscheint nach 1.4s und verschwindet nach erster Interaktion ✅
- Guided Paths (`🌱 Just starting out`, `🔬 Ready for more`, `🌊 Deep water`) sind sofort sichtbar ganz oben im FilterPanel — toggle-deselect funktioniert korrekt ✅
- Stats-Bar zeigt `N Neocaridina · N Caridina` in Echtzeit ✅
- Gift Note erklärt in einem Satz den Sinn der Seite ✅
- Empty State mit AnimatePresence und Hint-Text ist vorhanden ✅

### Lücken / Probleme

**1. Kein persistenter Filter-State-Hinweis**
Wenn Filter aktiv sind und der User auf Mobile zur Orbit-Karte wechselt, gibt es keine sichtbaren Indikatoren dass Filter aktiv sind (außer dem Stats-Counter). Ein Badge am Filter-Button wäre nötig.

**2. `railOpen` startet auf `false`**
Nach Klick auf einen Planeten erscheint auf Mobile ein Peek-Button (`N strains ↑`), aber die Rail ist nicht automatisch offen. Das erfordert **zwei Taps** um Strains zu sehen — einen für den Planeten, einen für den Peek-Button. Das ist auf Mobile ein echter Friction-Punkt.

**3. Flip-Card Interaktionsmodell ist auf Touch unklar**
Das `onMouseLeave`-Reset ist Desktop-only sinnvoll. Auf Mobile bleibt eine geflippte Karte dauerhaft in Factoid-Ansicht, bis der User erneut tippt → öffnet dann den Dialog. Das ist technisch korrekt, aber nicht intuitiv ohne visuellen Hinweis was der zweite Tap tut. Der `→` Hint ist sehr klein.

**4. Family Labels fehlen auf Mobile**
`!isMobile && (<text>…{item.family}</text>)` — auf Mobile gibt es nur den einzelnen Anfangsbuchstaben im Planeten plus die Strain-Badge-Zahl. Neue User können die Familien nicht identifizieren ohne vorher zu klicken.

**5. Arc-Legende bei kleinen Viewports**
Die Legende sitzt hardcoded bei `translate(-148, 296)` im 640×640 SVG-ViewBox. Auf 375px Breite rendert die SVG entsprechend verkleinert — die Legende wird auf ca. 6–7px Schriftgröße gequetscht und ist praktisch unlesbar.

**6. Kein visueller Unterschied Neocaridina/Caridina in der Legende erklärt**
Bevor der User interagiert, wird nicht erklärt, dass Circle = Neocaridina und Hexagon = Caridina bedeutet. Die Legende am unteren Rand des SVG ist sehr subtil (Opacity ~0.4 der Icons).

---

## 🟡 Mobile UX Flow

```
Mobile Flow (Status):
┌─────────────────────────────────┐
│ Filter öffnen → FilterPanel     │ ✅ Sidebar als Bottom-Sheet / Overlay
│ Guided Path tippen              │ ✅ 3 Presets, funktioniert
│ Orbit-Karte sehen               │ ✅ SVG responsiv, viewBox korrekt
│ Planeten-Label lesen            │ ❌ Fehlen auf Mobile (nur Buchstabe)
│ Planeten antippen               │ ✅ handleFamilyClick, hasInteracted
│ Peek-Button erscheint           │ ✅ "6 strains ↑"
│ Peek-Button antippen            │ ⚠️  Zweiter Tap nötig
│ Strain-Rail (horizontal)        │ ✅ AnimatePresence, springy
│ Strain-Karte antippen           │ ⚠️  Flip → Dialog: 2 Taps, unklar
│ Dialog lesen, schließen         │ ✅
│ Rail schließen (X-Button)       │ ✅ → setzt railOpen false
└─────────────────────────────────┘
```

---

## Empfohlene Fixes (nach Priorität)

| Prio | Fix | Datei |
|------|-----|-------|
| 1 | `setRailOpen(true)` direkt in `handleFamilyClick` — Rail auf Mobile sofort öffnen, Peek-Button optional als Collapse-Trigger behalten | `FamilyOrbitExplorer.tsx` |
| 2 | Family-Name als kurzes Tooltip/Popup bei Mobile-Tap auf Planeten — einblenden bevor Rail öffnet | `FamilyOrbitExplorer.tsx` |
| 3 | Arc-Legende aus SVG herausziehen in separates HTML-Element unterhalb der Karte — skaliert nicht mehr mit SVG | `FamilyOrbitExplorer.tsx` + CSS |
| 4 | Flip-Card Hint auf Mobile expliziter: statt `→` besser `Tap again to open` als kleiner Text auf der Rückseite | `StrainRail.tsx` / `StrainCard.tsx` |
| 5 | Badge am Filter-Button wenn Filter aktiv | `FilterPanel.tsx` / `App.tsx` |
| 6 | Neocaridina/Caridina Shape-Legende (Circle/Hexagon) in Onboarding-Hint oder Orbit-Legende integrieren | `FamilyOrbitExplorer.tsx` |
