<div align="center">

# 🦐 Shrimpverse

**An interactive orbit atlas of all freshwater shrimp species — built for hobbyists, breeders, and collectors.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-shrimpverse.vercel.app-6ee7b7?style=flat-square&logo=vercel&logoColor=white)](https://shrimpverse.vercel.app)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square)](LICENSE)

</div>

---

Shrimpverse maps the entire freshwater shrimp world as a living solar system. **49 varieties across 15 families** are arranged in a dual-ring orbit — Neocaridina on the inner ring, Caridina and exotics on the outer. Explore species, compare crossbreeding compatibility, and discover the full taxonomy behind every strain — all in a single interactive view.

---

## Features

### 🪐 Dual-Ring Orbit Atlas

A golden pulsing sun anchors the center. The two rings encode water chemistry at a glance:

- **Inner ring** — Neocaridina families (hard water), rendered as circles
- **Outer ring** — Caridina and exotic families (soft water), rendered as hexagons

Planets follow a curated **colour-wheel ordering** so related hues cluster together: reds and oranges sit adjacent, greens and blues sit adjacent. All 49 strain moons orbit their family planet with spherical shading — a specular highlight and depth gradient give each moon a distinct, tactile appearance.

### 🔀 Crossbreeding Compatibility

Select any two family planets to see arc-encoded compatibility between their strains. A comparison badge shows a per-type breakdown directly in the HUD.

| Arc colour | Meaning |
|-----------|---------|
| Teal — solid | Stable, colour-true offspring |
| Amber — solid | Hybrid / wildtype-reversal risk |
| Violet — solid | Stabilizing (Pinto/Taitibee lines) |
| Red — dashed | Crossbreeding impossible |

Family-level arcs are data-driven: they are generated automatically from `strains.json` and update whenever filters change. When two planets are active, family-level arcs hide in favour of the more precise moon-to-moon arcs.

### 🔬 Expert Mode

An opt-in **Expert Mode** toggle unlocks extended sections inside the strain dialog:

- **Taxonomy Status** — dispute flags with WoRMS context (e.g. *N. davidi* complex)
- **Genetics & Breeding** — hybrid-origin flag, arc outcome labels on every curve
- **Conservation Status** — IUCN data for Sulawesi endemics (Cardinal Sulawesi = Critically Endangered)

In the orbit view, expert mode overlays deduped offspring labels directly onto moon-to-moon arcs, so you can read crossing results without opening a dialog.

### 🔭 Strain Detail Dialog

Click any moon to open a rich detail panel:

- Full **taxonomy** line (genus + species, italic serif)
- **Water type badge** (hard / soft / neutral) with matching colour icon
- 6-cell **meta grid**: care level, temperature, pH, TDS, size, water type
- Focus-trapped, keyboard-navigable modal (WCAG AA)

### 🔍 Filtering

Filter by family, water type (`hard` / `soft` / `neutral`), pattern, care level, popularity, and colour stability. The **Quick Start** panel offers preset paths like *Show me beginner shrimp* or *Soft water only*. An amber dot on the mobile filter button signals whenever any filter is active.

### 📱 Responsive Layout

| Viewport | Layout |
|---------|--------|
| Desktop (≥640px) | Collapsible sidebar + right-side strain rail |
| Tablet (640–768px) | Desktop layout (sidebar + right rail) |
| Mobile (<640px) | Off-canvas filter drawer + horizontal bottom sheet |

44px WCAG touch targets on every planet. Orbit renders larger on mobile via a tighter viewBox (600 vs 640). Arc legend collapses to a compact single row on small screens.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.8 |
| Build | Vite 7 |
| Animations | motion 12 (motion/react) |
| Rendering | SVG (2D orbit) |
| Deploy | Vercel |

---

## Data Model

All 49 varieties ship with complete taxonomy and crossbreeding data:

```ts
interface Strain {
  id: string;                   // kebab-case, e.g. "red-cherry"
  name: string;
  family: string;               // "Red", "Taiwan Bee", "Sulawesi", …
  genus: string;                // "Neocaridina" | "Caridina" | "Atyopsis" | "Atya"
  species: string;              // e.g. "davidi", "cantonensis"
  waterType: "hard" | "soft" | "neutral";
  level: "Beginner" | "Intermediate" | "Collector";
  colors: [string, string, string]; // [primary, secondary, dark]
  compatible?: CrossResult[];   // crossbreeding data, auto-generates arcs
  tags?: string[];
  taxonomyStatus?: "accepted" | "disputed" | "synonym" | "uncertain";
  hybridOrigin?: boolean;
  conservationStatus?: string;  // e.g. "Critically Endangered"
  conservationNote?: string;
}
```

New strains added to `src/data/strains.json` automatically appear in the orbit and strain rail — no component changes needed.

---

## Project Structure

```
src/
├── types/strain.ts              # Core interfaces (Strain, CrossResult, FilterState)
├── data/strains.json            # 49 shrimp varieties across 15 families
├── lib/
│   ├── constants.ts             # Family colours, genus mapping
│   ├── strainUtils.ts           # Filter + compatibility logic
│   └── orbitalDistance.ts       # 2D spatial positioning
├── hooks/
│   ├── useStrainFilters.ts      # Filter state management
│   └── useIsMobile.ts           # Viewport + pointer detection
└── components/
    ├── App.tsx                  # Root layout, sidebar + expert mode state
    ├── FilterPanel.tsx          # Filters + Quick Start presets
    ├── FamilyOrbitExplorer.tsx  # 2D SVG orbit (main view)
    ├── StrainRail.tsx           # Strain card list (h/v orientations)
    └── StrainDialog.tsx         # Strain detail modal + expert sections
docs/
└── SHRIMP_KNOWLEDGE.md         # 72KB freshwater shrimp knowledge base (taxonomy,
                                 # water chemistry, crossing matrix, 40+ glossary terms)
```

---

## Getting Started

**Prerequisites:** Node.js ≥ 18, pnpm (recommended) or npm

```bash
# Clone
git clone https://github.com/zy0x1337/shrimpverse.git
cd shrimpverse

# Install
pnpm install

# Dev server → http://localhost:5173
pnpm dev
```

```bash
pnpm build       # Production build
pnpm preview     # Preview production build locally
npx tsc --noEmit # Type check
```

---

## Accessibility

Shrimpverse targets **WCAG 2.1 Level AA**:

- Focus-trap in StrainDialog — Tab cycles within modal, focus restores on close
- Shape-true circular focus rings for keyboard navigation (pointer-initiated focus suppressed)
- `aria-live="polite"` regions announce family/strain count changes
- Colour contrast: `--text-faint` 4.6:1, `--text-muted` 5.1:1
- 44px minimum touch targets on all interactive planets (WCAG 2.5.5)
- `aria-pressed` on Expert Mode toggle; semantic `<ul>/<li>` for strain lists

---

## Contributing

Contributions are welcome — especially strain data corrections, new varieties, and accessibility improvements.

1. Fork the repo and create a feature branch: `git checkout -b feat/your-feature`
2. Run type checks before committing: `npx tsc --noEmit`
3. Open a pull request against `main`

**Adding a strain:** edit `src/data/strains.json`. A valid entry needs `id`, `family`, `genus`, `species`, `waterType`, and `level`. It will appear automatically in the orbit and rail.

**Adding crossbreeding data:** add a `compatible` array to the strain entry. Family-level arcs are derived automatically from this data — no hardcoding needed.

---

## Roadmap

- [ ] Swipe-to-dismiss gesture on mobile dialog (`motion drag: "y"`)
- [ ] Breeding notes, rare variant documentation, morphology notes per strain
- [ ] Interactive onboarding: guided hints and empty-state guidance
- [ ] WCAG 2.1 Level AAA audit
- [ ] Data symmetry validation: automated checks for all crossbreeding pairs

---

## License

MIT © [zy0x1337](https://github.com/zy0x1337)
