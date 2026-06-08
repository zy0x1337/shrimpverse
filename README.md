# Shrimpverse

An interactive 3D/2D atlas of freshwater aquarium shrimp — visualized as a living solar system. Browse 49 documented varieties across 15 families, filter by water chemistry, care level, and color, and explore each strain's taxonomy, coloration, and husbandry at a glance.

---

## Features

**3D Solar System**  
Each shrimp family orbits as a distinct planet with unique material profiles (rocky, icy, metallic, gas giant, Saturn-ringed for Sulawesi). Individual strains revolve as moons. A pulsing golden sun sits at the center with bloom and vignette post-processing.

**2D SVG Orbit Map**  
A dual-ring layout: Neocaridina families on the inner ring, Caridina and exotics on the outer. Neocaridina appear as circles, Caridina as hexagons. The central golden sun resets the overview on click. Sulawesi nodes carry Saturn-style ellipse rings.

**Filters**  
Search by name, filter by color family, pattern (Solid, Rili, Mosura…), care level (Beginner → Collector), and water type (hard / soft / neutral). Filters apply live across both views.

**Strain Detail Dialog**  
Opens on strain selection: shows genus + species in italic, a water type badge with color coding, a 3-segment color swatch, and a 6-cell meta grid covering level, pattern, popularity, stability, water type, and origin.

**Responsive Layout**  
On desktop, clicking a family opens a right-side panel with the strain list. On mobile it slides up as a bottom sheet. The filter sidebar is collapsible on desktop via a toolbar toggle.

---

## Tech Stack

| Layer | Library |
|---|---|
| UI | React 19 + TypeScript |
| 3D | Three.js via @react-three/fiber + @react-three/drei |
| Animation | Framer Motion (motion/react) |
| 3D Springs | @react-spring/three |
| Post-FX | postprocessing (Bloom, Vignette) |
| Build | Vite |

---

## Getting Started

```bash
npm install
npm run dev       # localhost:5173
npm run build     # production build
npm run preview   # preview build locally
```

Type check:

```bash
npx tsc --noEmit
```

---

## Project Structure

```
src/
├── types/strain.ts              # Strain interface + waterType, genus, species
├── data/strains.json            # 49 shrimp varieties across 15 families
├── lib/
│   ├── constants.ts             # Family colors, genus mapping
│   ├── strainUtils.ts           # Filter logic
│   └── orbitalDistance.ts       # 3D spatial positioning
├── hooks/
│   ├── useStrainFilters.ts      # Filter state management
│   └── useIsMobile.ts           # Viewport/pointer detection
├── components/
│   ├── App.tsx                  # Main layout, view toggle, sidebar collapse
│   ├── FilterPanel.tsx          # Sidebar with all filter controls
│   ├── FamilyOrbitExplorer.tsx  # 2D SVG orbit view
│   ├── StrainRail.tsx           # Strain card list (horizontal / vertical)
│   ├── StrainDialog.tsx         # Strain detail modal
│   └── 3d/
│       ├── StrainUniverse.tsx   # 3D canvas + orbital layout
│       ├── Sun3D.tsx            # Pulsing golden star
│       ├── FamilyNode3D.tsx     # Planet mesh with material profiles
│       ├── StrainOrbit.tsx      # Moon orbits
│       ├── StrainPlanet.tsx     # Individual moon mesh
│       ├── StrainRail3D.tsx     # HTML panel anchored in 3D space
│       ├── OrbitRing.tsx        # Orbital path visualization
│       ├── EffectPipeline.tsx   # Bloom + Vignette
│       └── UniverseBackground.tsx
```

---

## Data Model

Each entry in `strains.json` follows this shape:

```ts
interface Strain {
  id: string;          // kebab-case, e.g. "crystal-red"
  name: string;
  family: string;      // "Red" | "Crystal" | "Sulawesi" | …
  genus?: string;      // "Neocaridina" | "Caridina" | "Atyopsis" | "Atya"
  species?: string;    // e.g. "davidi", "cantonensis"
  waterType: "hard" | "soft" | "neutral";
  level: "Beginner" | "Intermediate" | "Collector";
  pattern: string;
  colors: [string, string, string]; // [primary, secondary, dark] hex
  popularity: number;  // 1–5
  stable: boolean;
}
```

The dual-ring layout is derived from `waterType` and `level`: Neocaridina (`hard`) occupy the inner ring, Caridina and exotics (`soft` / `neutral`) the outer.


---

## License

MIT
