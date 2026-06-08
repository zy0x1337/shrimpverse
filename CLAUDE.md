# Shrimpverse

An interactive 3D planet system showcasing all freshwater shrimp species: Neocaridina, Caridina, Sulawesi, Amano, and filter-feeders.

## Vision

Transform the Neocaridina strain map into a living solar system where:
- Each shrimp family orbits as a distinct planet with unique visual character
- Species varieties revolve as moons around their family planet
- The sun pulses at the center, symbolizing the aquatic ecosystem
- Two orbit rings separate beginner-friendly Neocaridina (inner) from soft-water species (outer)

## Project Structure

```
src/
├── types/strain.ts              # Strain interface + waterType, genus, species
├── data/strains.json            # 49 shrimp varieties across 15 families
├── lib/
│   ├── constants.ts             # Family colors, genus mapping
│   ├── strainUtils.ts           # Filter logic (waterType included)
│   └── orbitalDistance.ts       # 3D spatial positioning (radiusScale param for mobile)
├── hooks/
│   ├── useStrainFilters.ts      # State: family, waterType, pattern, etc.
│   └── useIsMobile.ts           # Viewport + pointer detection
├── components/
│   ├── App.tsx                  # Main layout, view toggle, sidebar collapse state
│   ├── FilterPanel.tsx          # waterType filter + desktop collapse button
│   ├── FamilyOrbitExplorer.tsx  # 2D SVG orbit view (orbit-layout flex row)
│   ├── StrainRail.tsx           # Strain card list (horizontal/vertical orientation)
│   ├── StrainDialog.tsx         # Strain detail modal
│   ├── 3d/
│   │   ├── StrainUniverse.tsx   # 3D canvas + layout (two rings + Sun)
│   │   ├── Sun3D.tsx            # Pulsing golden star
│   │   ├── FamilyNode3D.tsx     # Planet with 6 material types + mobile label sizing
│   │   ├── StrainOrbit.tsx      # Moon orbits (radiusScale 1.65× on mobile)
│   │   ├── StrainPlanet.tsx     # Individual moon mesh + PlanetLabel canvas texture
│   │   ├── StrainRail3D.tsx     # HTML panel anchored in 3D space
│   │   ├── OrbitRing.tsx        # Orbital path visualization
│   │   ├── EffectPipeline.tsx   # Bloom + Vignette effects
│   │   ├── UniverseBackground.tsx # Starfield
│   │   └── universe.css         # 3D scene styling
```

## Sessions & Roadmap

### ✅ Session 1: Brand + Data Foundation
- Rebranded: title, package name, sidebar
- Expanded data: 30 → 49 strains; added genus, species, waterType
- Added waterType filter (hard/soft/neutral)
- 2D orbit layout prep: viewBox 520 → 640, outer Caridina ring

### ✅ Session 2: 3D Solar System Redesign
- NEW `Sun3D.tsx`: pulsing golden star with corona rings + warm lights
- Material profiles: rocky/icy/metallic/ringed/gas/organic per family
  - Sulawesi: Saturn-style rings (ringed)
  - Crystal: icy translucent planet
  - Taiwan Bee: dark metallic
  - Bamboo: large gas giant
- Two orbit rings: Neo inner (r=5), Caridina outer (r=8.8)
- Stronger bloom + vignette effects
- HUD shows genus when family active

### ✅ Session 3: 2D Dual-Ring + Golden Sun
- **Dual-ring angle distribution**: Neo families spread evenly on inner ring,
  Caridina/exotics on outer ring (no longer all compressed into single 360°)
- **Golden SVG sun at center**: pulsing corona, 8 rays, "Shrimpverse" wordmark;
  replaces Natural node; click to reset overview
- **Caridina nodes as hexagons** (vs Neo circles): clear visual distinction
- **Sulawesi Saturn rings**: two ellipses orbiting the hexagon
- **Stats bar**: Total / Neocaridina count / Caridina count
- **Active label**: displays genus (Neocaridina / Caridina / Atyopsis)
- **Spoke colors**: teal for Neo, blue for Caridina
- **Starfield**: two zones (outer + sparse between-ring)

### ✅ Session 4: StrainDialog Taxonomy + Water Badge
- **Badge row**: family badge + water type badge (hard=green, soft=blue, neutral=gray)
- **Water icons**: droplet (soft), outline droplet (hard), circle (neutral)
- **Taxonomy line**: genus + species in italic serif below strain name
- **Water type inference**: derives from strain.waterType or family for old entries
- **Meta grid**: expanded 5 → 6 cells; added "Water" row with colour matching badge
- **New CSS**: .dialog-badges, .dialog-water-badge, .dialog-taxonomy

### ✅ Session 5: Mobile Optimizations + Layout
- **Collapsible sidebar**: desktop toggle in toolbar, width-transition animation
- **Right-side strain panel**: 260px flex column on desktop (not bottom overlay)
- **Bottom sheet on mobile**: horizontal scroll rail, unchanged behavior
- **orbit-layout**: flex-row wrapper so SVG + rail sit side by side
- **StrainRail**: `orientation` prop (`horizontal` | `vertical`), vertical card layout
- **FilterPanel**: `onCollapse` + `collapsed` props for desktop toggle

### ✅ Session 6: 3D Mobile Label Readability
- **Family planet labels**: mobile font 0.26→0.30 (inactive) / 0.34→0.38 (active),
  opacity 0.45→0.88, label offset 1.12→1.28 (FamilyNode3D)
- **Moon orbits**: `radiusScale = 1.65` on mobile — min orbit 0.85→1.40,
  safely outside even the Bamboo gas giant (max sphere r≈0.93)
- **PlanetLabel**: mobile only shows on tap (isHighlighted), not for all active moons;
  canvas 256×64→384×96, font 18→28px, dark pill background for contrast

## Key Data Model

**Strain** properties:
- `family`: "Red", "Taiwan Bee", "Crystal", "Sulawesi", "Amano", "Bamboo", etc.
- `genus`: "Neocaridina", "Caridina", "Atyopsis", "Atya" (optional, defaults based on family)
- `waterType`: "hard" (Neo), "soft" (Caridina), "neutral" (filter feeders)
- `level`: "Beginner" → inner orbit, "Collector" → outer orbit
- `colors`: [primary, secondary, dark] — used for planet surface

**FilterState**:
```ts
{
  family: string;      // "All" or specific family
  waterType: "all" | "hard" | "soft" | "neutral";
  pattern: string;     // "Solid", "Rili", "Banded", etc.
  level: string;       // "Beginner", "Intermediate", "Collector"
  popularOnly: boolean;
  stableOnly: boolean;
  query: string;       // Free-text search
}
```

## Material Mapping

| Family | Material | Why |
|--------|----------|-----|
| Red, Orange, Yellow, Green | rocky | warm, earthy |
| Blue, Black, Brown | rocky | cooler/darker |
| White | icy | translucent nature |
| Crystal | icy | transparency + glacial feel |
| Taiwan Bee | metallic | sleek, iridescent |
| Tiger | rocky | striped, natural |
| Sulawesi | ringed | exotic, Saturn-like |
| Amano | organic | aged, brownish |
| Bamboo | gas | large, gentle giant |

## Development

### Install
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Type check
```bash
npx tsc --noEmit
```

### Deploy
```bash
npm run build && npm run preview
```

## Tech Stack

- **React 19** + TypeScript
- **Three.js** via @react-three/fiber + drei
- **Framer Motion** for animations (motion/react)
- **@react-spring/three** for smooth springs
- **Postprocessing** for Bloom + Vignette

## Current Status

**6 sessions complete** — Shrimpverse is a fully functional 3D/2D interactive shrimp atlas:
- 49 shrimp varieties across 15 families
- Dual-ring system: Neocaridina (8 inner), Caridina + exotics (6 outer)
- 3D solar system with pulsing sun, material-mapped planets, orbiting moons
- 2D SVG counterpart with golden sun, hexagonal Caridina nodes, Saturn rings for Sulawesi
- Enriched strain dialog with taxonomy, water type, 6-cell meta grid
- waterType filter (hard/soft/neutral) + searchable genus/species
- Collapsible sidebar (desktop), right-side strain panel (desktop), bottom sheet (mobile)
- Mobile 3D: readable labels, correct orbit spacing, tap-to-reveal moon names

**Next directions** (Session 7 — Polishing):
- Copy & text review: labels, empty states, onboarding
- UI/UX consistency pass: visual hierarchy, interaction flows
- Accessibility: ARIA labels, keyboard navigation, color contrast
- Performance: mobile 3D geometry budget, lazy loading review
- Data quality: thin/missing strain entries, field consistency

## Notes for Development

1. **Memory system**: See `.claude/projects/.../memory/project_shrimpverse.md` for session continuity
2. **Always tsc check** before committing (`npx tsc --noEmit`)
3. **Mobile-first**: Test on 380px+ width, optimize touch interactions
4. **Performance**: Lazy-load 3D canvas, keep shader complexity low on mobile
5. **Naming**: Strains use lowercase kebab-case IDs; families use Title Case
6. **Data**: New strains added to `src/data/strains.json` auto-appear in both 2D & 3D views
7. **Sidebar**: Desktop collapse via `sidebarCollapsed` state in App.tsx; mobile uses off-canvas drawer
8. **Strain rail**: `orientation="vertical"` for desktop right panel, `"horizontal"` for mobile bottom sheet
