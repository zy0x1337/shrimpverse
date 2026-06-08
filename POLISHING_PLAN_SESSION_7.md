# Shrimpverse Polishing Plan — Session 7

Critical audit of Sessions 1–6 deliverables identifying text, UX, mobile, accessibility, performance, and data gaps. **No code written this session — planning only.**

---

## A) TEXTS & COPY

### A1 — German aria-labels in English UI · Complexity: **S**
- **Finding:** `aria-label="Seitenleiste ausblenden"` (App.tsx:109), `title="Filter einblenden/ausblenden"` (App.tsx:111), `aria-label="Seitenleiste ausblenden"` (FilterPanel.tsx:69). Rest of UI is English.
- **Solution:** Translate all German strings to English: `"Collapse sidebar"` / `"Expand sidebar"`.

### A2 — "NEW" badge on 3D toggle is outdated · **S**
- **Finding:** ViewToggle.tsx:37 renders `<span className="view-toggle-badge">NEW</span>`. After 6 sessions, 3D is no longer new. Badge CSS (`.view-toggle-badge`) is not defined in `styles.css`.
- **Solution:** Remove badge entirely; if needed, replace with "BETA".

### A3 — "rili" in sidebar stats bar is context-free · **S**
- **Finding:** FilterPanel shows `visible / popular / rili`. New user doesn't understand "rili" (a color-pattern term) without context. "popular" is also vague (no threshold explained).
- **Solution:** Rename labels: `Visible · Popular · Rili pattern`. Or replace rili with `Patterns` (count of active pattern types in visible strains).

### A4 — Toolbar headline is mismatched in 3D mode · **S**
- **Finding:** App.tsx:102: `<h2>Genera, species & documented varieties</h2>` — static text regardless of view mode. In 3D, this text is misleading (user sees planets, not a genera list).
- **Solution:** Dynamic: `{viewMode === "3d" ? "The Shrimpverse — an interactive solar system" : "Genera, species & documented varieties"}`.

### A5 — "Stable" vs "Color-stable" terminology inconsistent · **S**
- **Finding:** FilterPanel shows `"Colour-stable colonies only"` (British spelling). Dialog shows `"✦ Stable"` in meta grid. Elsewhere: `"Color Family"` (American). Three different phrasings for same concept.
- **Solution:** Normalize to American English: `"Color-stable only"` in FilterPanel; `"Stable line"` in Dialog.

### A6 — 3D "All planets" button semantically imprecise · **S**
- **Finding:** StrainUniverse.tsx:437: `"All planets"` — but elements are *families*, not "planets" from user perspective. Inconsistent with 2D where sun-click is "reset to overview".
- **Solution:** Use `"All families"` or `"← Overview"`.

### A7 — No explanation of circle vs hexagon schema in 2D · **M**
- **Finding:** Circle = Neocaridina, Hexagon = Caridina — visually encoded but never explained. New user cannot infer logic without tooltips or legend.
- **Solution:** Brief legend below SVG (two lines): `● Neocaridina (hard water)  ⬡ Caridina / Exotics (soft water)`.

---

## B) UI/UX

### B1 — No active filter indicator on mobile · **M**
- **Finding:** When filters are set and sidebar is closed on mobile, the toolbar filter-button shows no badge/dot. User forgets active filters.
- **Solution:** Render small red dot on `icon-button.mobile-filter-toggle` if any filter is active (family, waterType, pattern, level, popularOnly, stableOnly, or query).

### B2 — "Color Family" label inaccurate for Caridina · **S**
- **Finding:** FilterPanel:100: `"Color Family"` — but Crystal, Taiwan Bee, Sulawesi are not color families; label is misleading for Caridina keepers.
- **Solution:** Rename to `"Family"`.

### B3 — 3D view has no strain browser · **L**
- **Finding:** In 2D, clicking family → StrainRail with scrollable strain list. In 3D, no equivalent — must click individual moons. No overview possible.
- **Solution:** In StrainUniverse.tsx: when `activeFamily !== null`, render same StrainRail as HTML overlay (like `orbit-rail-wrapper` on mobile) with `orientation="vertical"` on desktop / `"horizontal"` on mobile.

### B4 — Duplicate sidebar-collapse controls · **S**
- **Finding:** Desktop has (1) icon-button in toolbar (App.tsx:106) AND (2) sidebar-collapse-btn in FilterPanel header (FilterPanel.tsx:64). Both do same action.
- **Solution:** Remove one. Toolbar button is more consistent; remove FilterPanel button since it disappears when collapsed.

### B5 — No scroll-reset when opening new family · **S**
- **Finding:** In StrainRail (vertical on desktop, horizontal on mobile): switching Family A → B doesn't scroll rail back to start.
- **Solution:** useEffect in StrainRail or parent: on family change, `scrollTo(0)` the scroll container.

### B6 — `FilterState.catalogView` / `orbitView` are dead state · **S**
- **Finding:** `types/strain.ts:FilterState` contains `catalogView` and `orbitView` booleans — not referenced anywhere. Role taken over by `viewMode` state in App.tsx.
- **Solution:** Remove fields from interface and initial state in `useStrainFilters.ts`.

---

## C) MOBILE

### C1 — Orbit labels clipped at 320px viewport · **M**
- **Finding:** ViewBox is 640×640. Sulawesi node at r=258, label offset ≈ 310px from center. At 320px viewport width, outer labels nearly cut off. Saturn rings (rx = nr×2.85) extend further.
- **Solution:** Mobile-specific label offsets (adaptive `labelDist`) or reduce ViewBox to 580×580 on small screens; or show labels only in active-label HUD.

### C2 — Bottom sheet rail overlaps orbit nodes · **M**
- **Finding:** `orbit-rail-wrapper` is `position: absolute; bottom: 0; z-index: 10` on mobile. On short viewports (≤667px), rail can obscure lower family nodes without scroll recovery.
- **Solution:** Add `padding-bottom` compensation on orbit-explorer when `activeFamily` is set (dynamic CSS variable or inline style).

### C3 — Dialog drag handle promises swipe-to-dismiss · **S**
- **Finding:** `styles.css:1119-1127` renders drag-handle `::before` on mobile dialog. Visual promise of swipe-to-dismiss not fulfilled — Escape-key only.
- **Solution:** Either remove handle (remove visual promise) or implement swipe-down gesture via Framer Motion `drag: "y"`.

---

## D) ACCESSIBILITY

### D1 — Dialog: no focus-trap + no focus-management · **M**
- **Finding:** `StrainDialog.tsx`: `role="dialog"` + `aria-modal="true"` present but no focus-trap. Tab navigates behind backdrop. Focus not moved to dialog on open, not restored on close.
- **Solution:** Set `autoFocus` on dialog-close button. Implement focus-trap via `inert` attribute on background or custom hook.

### D2 — `aria-pressed="false"` on strain cards (semantically wrong) · **S**
- **Finding:** StrainRail.tsx:82: `aria-pressed="false"`. `aria-pressed` signals toggle state; cards are not toggles but action buttons. Screen-reader: "Pressed: No" — confusing.
- **Solution:** Remove `aria-pressed`. Also invalid: `role="listitem"` on `<button>` (should be `<li><button>` or remove role).

### D3 — Critically low color contrast · **M**
- **Finding:**
  - `--text-faint: #3e3c3a` on `--surface: #0d1318` → contrast ~1.4:1 (WCAG min: 4.5:1). Used in `.stat-label`, `.dialog-meta-key`.
  - `--text-muted: #7a7870` on `--bg: #080c10` → ~3.2:1, below 4.5:1.
  - `dialog-taxonomy` with `rgba(221,216,204,0.42)` → ~2.2:1.
- **Solution:** Raise `--text-faint` to `#6b6966` (→ 4.6:1). Raise `--text-muted` to `#9a9590` (→ 5.1:1). Raise `dialog-taxonomy` opacity 0.42 → 0.65.

### D4 — No `aria-live` for active family change · **S**
- **Finding:** When user activates a family, no `aria-live="polite"` announces change to screen-reader.
- **Solution:** Add `<div aria-live="polite" aria-atomic="true" className="sr-only">` announcing active family + strain count.

---

## E) PERFORMANCE

### E1 — 14 SVG filters always in DOM · **M**
- **Finding:** FamilyOrbitExplorer.tsx:218: Each family gets own `<feGaussianBlur>` filter in `<defs>`. SVG filters are expensive. All 14 active simultaneously even if only 0–1 node glows at a time.
- **Solution:** Define 2–3 generic filters (glow-light, glow-medium, glow-intense) with dynamic color via CSS variables, or inline filter only for `isActive || isHovered` nodes.

### E2 — Duplicate `font-size` declaration in CSS · **S**
- **Finding:** `styles.css:244-245`: first `font-size: var(--text-sm)` immediately overwritten by `font-size: max(16px, var(--text-sm))`. Dead CSS.
- **Solution:** Remove first line.

---

## F) DATA

### F1 — Neocaridina strains lack `genus`/`species` · **M**
- **Finding:** All 35 Neocaridina strains (Red, Orange, Yellow, etc.) missing `genus` and `species`. Dialog shows no taxonomy line for them — even though Session 4 explicitly built taxonomy display. 70%+ of strains invisible for this feature.
- **Solution:** Add `"genus": "Neocaridina"` + `"species": "davidi"` to standard Davidi strains; wildform gets `"species": "davidi var."`.

### F2 — Neocaridina strains lack explicit `waterType` · **S**
- **Finding:** Neo strains missing `waterType` field; `deriveWaterType()` infers it. If filter logic also needs inference, that's duplication.
- **Solution:** Add `"waterType": "hard"` to all Neo strains in JSON (automatable via Node script).

### F3 — "Wildform" / "Natural" family is invisible · **M**
- **Finding:** `strains.json` has `"family": "Natural"` for wildform. `FAMILY_ORBIT_RADIUS["Natural"] = 0` (placed at center = overlaps sun). In 3D, "Natural" not in `FAMILY_ORDER` → never appears. Users never see wildform unless explicitly searching.
- **Solution:** **(Option A)** Remove Natural from JSON, integrate wildform as `"family": "Brown"` or separate category. **(Option B)** Render Natural as small centerpiece in 2D separately, distinct from planet nodes.

### F4 — "Snowball / White Pearl" slash-name · **S**
- **Finding:** `strains.json` line 554: `"name": "Snowball / White Pearl"`. Only entry with slash. Looks odd in dialog title and rail card.
- **Solution:** Choose primary name: `"name": "Snowball"` with alias in tags: `["White Pearl", ...]`.

### F5 — "stable" ≠ "popular" conflict unexplained · **S**
- **Finding:** Blue Bolt (popularity 5, stable: false), Crystal Red SSS (pop 4, stable: false), Green Jade (pop 5, stable: false). Filter "Color-stable only" would hide Blue Bolt (a top-tier strain). `stable` means color-stability, not health — nowhere explained.
- **Solution:** Add tooltip to checkbox: `"Color-stable colonies only"` with `title="Hides project lines where offspring color varies widely"`.

---

## Implementation Order (Recommended)

### **Round 1 — Quick wins** (highest impact per effort, lowest risk)
- A1, A2, A5, A6
- B2, B4, B6
- D2, D4
- E2
- F4
- **Time:** ~90 min, no data migration, zero regression risk.

### **Round 2 — Data completion** (unlocks 70% of Session-4 feature)
- F1, F2, F3
- **Impact:** Adds taxonomy to all strains, renders Dialog taxonomy line functional for 100% of entries.
- **Main work:** JSON updates (automatable for F2).

### **Round 3 — Accessibility critical**
- D1, D3
- **Direct impact:** Focus-trap for keyboard users, contrast ≥4.5:1 WCAG AA for all users.

### **Round 4 — UX improvements**
- A7, B1, B3, B5
- C1, C2
- **Impact:** Filter indication on mobile, legend, 3D strain browser, scroll reset, mobile label readability.

### **Round 5 — Polish & housekeeping**
- A3, A4
- C3
- E1
- F5
- **Risk:** Lowest. Refactoring + explanatory copy.

---

## Summary

**Highest-priority gaps:**
1. **70% of strains missing taxonomy data** (Sessions 4's main feature invisible for Neo strains).
2. **Dialog without focus-trap** (WCAG accessibility failure, directly testable).
3. **German aria-labels** in English UI (unprofessional).
4. **No mobile filter indicator** (common user frustration: forgot filters are active).
5. **3D view no strain browser** (feature parity gap vs 2D).
6. **Contrast < 4.5:1** in multiple places (readability + WCAG AA failure).

**Quick wins (Round 1) unlock 6 issues in ~90 min with zero regression risk.**

**Data completion (Round 2) makes the taxonomy feature actually visible.**
