# Shrimpverse Polishing Plan — Session 7

✅ **COMPLETE** — All 5 rounds implemented (commits e7d21ac through 5d9a03e, +2 follow-ups).

Critical audit of Sessions 1–6 deliverables identifying text, UX, mobile, accessibility, performance, and data gaps.

---

## A) TEXTS & COPY

### ✅ A1 — German aria-labels in English UI · Complexity: **S**
- **Status:** DONE (e7d21ac)
- **Finding:** `aria-label="Seitenleiste ausblenden"` (App.tsx:109), `title="Filter einblenden/ausblenden"` (App.tsx:111), `aria-label="Seitenleiste ausblenden"` (FilterPanel.tsx:69). Rest of UI is English.
- **Solution:** Translated all German strings to English: `"Collapse sidebar"` / `"Expand sidebar"`.

### ✅ A2 — "NEW" badge on 3D toggle is outdated · **S**
- **Status:** DONE (e7d21ac)
- **Finding:** ViewToggle.tsx:37 rendered `<span className="view-toggle-badge">NEW</span>`. After 6 sessions, 3D is no longer new.
- **Solution:** Badge removed entirely.

### ✅ A3 — "rili" in sidebar stats bar is context-free · **S**
- **Status:** DONE (5d9a03e)
- **Finding:** FilterPanel showed `visible / popular / rili`. New user doesn't understand "rili" without context.
- **Solution:** Labels capitalized with title tooltips for hover context: `Visible · Popular · Rili`.

### ✅ A4 — Toolbar headline is mismatched in 3D mode · **S**
- **Status:** DONE (5d9a03e)
- **Finding:** App.tsx showed static `"Genera, species & documented varieties"` regardless of view mode.
- **Solution:** Dynamic headline: 2D shows `"Genera, species & documented varieties"`, 3D shows `"3D Solar System"`.

### ✅ A5 — "Stable" vs "Color-stable" terminology inconsistent · **S**
- **Status:** DONE (e7d21ac)
- **Finding:** FilterPanel showed `"Colour-stable colonies only"` (British). Dialog showed `"✦ Stable"`. Mixed terminology.
- **Solution:** Normalized to American English: `"Color-stable only"` throughout.

### ✅ A6 — 3D "All planets" button semantically imprecise · **S**
- **Status:** DONE (e7d21ac)
- **Finding:** 3D back button said `"All planets"` — but elements are *families*.
- **Solution:** Changed to `"All families"` for semantic clarity.

### ✅ A7 — No explanation of circle vs hexagon schema in 2D · **M**
- **Status:** DONE (915b186)
- **Finding:** Circle = Neocaridina, Hexagon = Caridina — visually encoded but never explained.
- **Solution:** Added legend below SVG: `● Neocaridina  ⬡ Caridina + Exotics`.

---

## B) UI/UX

### ✅ B1 — No active filter indicator on mobile · **M**
- **Status:** DONE (915b186)
- **Finding:** Mobile filter button showed no indicator when filters were active.
- **Solution:** Amber dot renders on filter button when any filter is active; aria-label updated to include "(active)".

### ✅ B2 — "Color Family" label inaccurate for Caridina · **S**
- **Status:** DONE (e7d21ac)
- **Finding:** Filter showed `"Color Family"` — but Crystal, Taiwan Bee, Sulawesi are not color families.
- **Solution:** Renamed to `"Family"`.

### ✅ B3 — 3D view has no strain browser · **L**
- **Status:** DONE (915b186)
- **Finding:** 3D view had no strain list when family selected (feature parity gap vs 2D).
- **Solution:** StrainRail renders as overlay in 3D when family is active: right panel (desktop 260px), bottom sheet (mobile).

### ✅ B4 — Duplicate sidebar-collapse controls · **S**
- **Status:** DONE (e7d21ac)
- **Finding:** Desktop had (1) toolbar button AND (2) FilterPanel button doing same action.
- **Solution:** Removed FilterPanel button; toolbar button is the single collapse control.

### ✅ B5 — No scroll-reset when opening new family · **S**
- **Status:** DONE (915b186)
- **Finding:** Switching families didn't reset rail scroll position.
- **Solution:** StrainRail scrolls to top/left when family prop changes.

### ✅ B6 — `FilterState.catalogView` / `orbitView` are dead state · **S**
- **Status:** DONE (e7d21ac)
- **Finding:** `FilterState` contained unused `catalogView` and `orbitView` booleans.
- **Solution:** Removed fields from interface and hook initial state.

---

## C) MOBILE

### ✅ C1 — Orbit labels clipped at 320px viewport · **M**
- **Status:** DONE (915b186)
- **Finding:** Outer ring labels clipped at 320px viewport.
- **Solution:** Hide outer ring text labels on mobile; active-label HUD + node letters provide identification.

### ✅ C2 — Bottom sheet rail overlaps orbit nodes · **M**
- **Status:** DONE (915b186)
- **Finding:** Bottom sheet rail obscured lower family nodes on mobile.
- **Solution:** orbit-explorer applies `paddingBottom: 138px` when rail is open; SVG shrinks to reveal nodes.

### ✅ C3 — Dialog drag handle promises swipe-to-dismiss · **S**
- **Status:** DONE (5d9a03e)
- **Finding:** Mobile dialog had drag handle `::before` pseudo-element suggesting swipe-to-dismiss (not implemented).
- **Solution:** Removed handle pseudo-element to eliminate false affordance.

---

## D) ACCESSIBILITY

### ✅ D1 — Dialog: no focus-trap + no focus-management · **M**
- **Status:** DONE (8918c15)
- **Finding:** Dialog had no focus-trap or focus restoration; Tab navigated behind modal.
- **Solution:** Implemented focus trap: save/restore previously focused element, move focus to first focusable element on open, Tab cycles within dialog.

### ✅ D2 — `aria-pressed="false"` on strain cards (semantically wrong) · **S**
- **Status:** DONE (e7d21ac)
- **Finding:** Strain cards had `aria-pressed="false"` (wrong semantic) and `role="listitem"` on buttons.
- **Solution:** Removed `aria-pressed`; wrapped buttons in `<li>` elements in `<ul>` container.

### ✅ D3 — Critically low color contrast · **M**
- **Status:** DONE (8918c15)
- **Finding:** Multiple text colors failed WCAG AA (4.5:1 minimum):
  - `--text-faint: #3e3c3a` → ~1.4:1
  - `--text-muted: #7a7870` → ~3.2:1
  - `dialog-taxonomy` → ~2.2:1
- **Solution:** Updated all to WCAG AA: `--text-faint` → `#6b6966` (4.6:1), `--text-muted` → `#9a9590` (5.1:1), `dialog-taxonomy` opacity 0.42 → 0.65.

### ✅ D4 — No `aria-live` for active family change · **S**
- **Status:** DONE (e7d21ac)
- **Finding:** Family changes were not announced to screen readers.
- **Solution:** Added `aria-live="polite"` regions to FamilyOrbitExplorer and StrainUniverse announcing active family and strain count.

---

## E) PERFORMANCE

### ✅ E1 — 14 SVG filters always in DOM · **M**
- **Status:** DONE (5d9a03e)
- **Finding:** Each family had own `<feGaussianBlur>` filter; 14+ filters active simultaneously.
- **Solution:** Consolidated to single shared `#node-glow` filter; reduced `<defs>` from 15 elements to 2.

### ✅ E2 — Duplicate `font-size` declaration in CSS · **S**
- **Status:** DONE (e7d21ac)
- **Finding:** Search input had duplicate `font-size` declaration (dead CSS).
- **Solution:** Removed redundant line.

---

## F) DATA

### ✅ F1 — Neocaridina strains lack `genus`/`species` · **M**
- **Status:** DONE (e7d21ac)
- **Finding:** All 26 Neocaridina strains missing genus/species; taxonomy feature invisible for 70%+ of strains.
- **Solution:** Added `"genus": "Neocaridina"`, `"species": "davidi"` to all Neo strains; Wildform gets `"davidi var."`

### ✅ F2 — Neocaridina strains lack explicit `waterType` · **S**
- **Status:** DONE (e7d21ac)
- **Finding:** Neo strains missing `waterType` field; had to infer from family.
- **Solution:** Added `"waterType": "hard"` to all Neo strains in JSON.

### ✅ F3 — "Wildform" / "Natural" family is invisible · **M**
- **Status:** DONE (00d9502)
- **Finding:** Wildform had `"family": "Natural"` at radius 0 (overlaps sun); not in 3D FAMILY_ORDER.
- **Solution:** Migrated Wildform to `"family": "Brown"` so it orbits with Brown strains; now visible in both 2D & 3D.

### ✅ F4 — "Snowball / White Pearl" slash-name · **S**
- **Status:** DONE (e7d21ac)
- **Finding:** Only slash-name in dataset: `"Snowball / White Pearl"`.
- **Solution:** Changed to primary `"name": "Snowball"` with alias in tags.

### ✅ F5 — "stable" ≠ "popular" conflict unexplained · **S**
- **Status:** DONE (5d9a03e)
- **Finding:** Top-tier strains (Blue Bolt, Green Jade) are `stable: false`, confusing users.
- **Solution:** Added title tooltip: `"Color-stable only — Hides project lines where offspring color varies widely"`.

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

## Implementation Summary

**✅ ALL 22 FINDINGS RESOLVED:**

| Round | Focus | Status | Commits |
|-------|-------|--------|---------|
| **1** | Quick wins (A/B/D/E/F quick fixes) | ✅ DONE | e7d21ac |
| **2** | Data completion (Neo taxonomy + waterType) | ✅ DONE | e7d21ac |
| **3** | A11y critical (focus-trap + contrast) | ✅ DONE | 8918c15 |
| **4** | UX improvements (legend, mobile filters, 3D browser) | ✅ DONE | 915b186 |
| **5** | Housekeeping (tooltips, filters, perf) | ✅ DONE | 5d9a03e |
| **+1** | Wildform visibility (Natural → Brown) | ✅ DONE | 00d9502 |
| **+2** | Mobile 3D label polish | ✅ DONE | 49fa1e9 |

**Total effort:** ~5 sessions of targeted fixes across copy, UX, mobile, accessibility, performance, and data layers.

**Key wins:**
- Session 4 taxonomy feature now visible for 100% of strains (was 0% for Neocaridina)
- WCAG AA contrast compliance achieved
- Focus-trap + keyboard navigation in modal dialogs
- Mobile filter indicator + 3D strain browser parity
- Performance: 14 SVG filters → 1 shared filter
