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
│   └── orbitalDistance.ts       # 3D spatial positioning
├── hooks/useStrainFilters.ts    # State: family, waterType, pattern, etc.
├── components/
│   ├── App.tsx                  # Main layout, view toggle
│   ├── FilterPanel.tsx          # waterType filter (hard/soft/neutral)
│   ├── FamilyOrbitExplorer.tsx  # 2D SVG orbit view (Neo + Caridina rings)
│   ├── StrainDialog.tsx         # Strain detail modal
│   ├── 3d/
│   │   ├── StrainUniverse.tsx   # 3D canvas + layout (two rings + Sun)
│   │   ├── Sun3D.tsx            # Pulsing golden star (new in Session 2)
│   │   ├── FamilyNode3D.tsx     # Planet with 6 material types
│   │   ├── StrainOrbit.tsx      # Moon orbits around planet
│   │   ├── StrainPlanet.tsx     # Individual moon mesh
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

### 🎯 Session 3: 2D View Update
- Golden SVG sun at center instead of plain node
- Distinguish Neo vs Caridina rings visually
- Family node appearance: Neo = solid, Caridina = ice/gem-like
- Update starfield pattern

### 🎯 Session 4: Polish + Detail
- StrainDialog: genus, species, waterType badge
- Optional comparison mode (select 2)
- Mobile UX refinements

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

## Notes for Future Sessions

1. **Memory system**: See `.claude/projects/.../memory/project_shrimpverse.md` for session continuity
2. **Always tsc check** before committing (`npx tsc --noEmit`)
3. **Mobile-first**: Test on 380px+ width, optimize touch interactions
4. **Performance**: Lazy-load 3D canvas, keep shader complexity low on mobile
5. **Naming**: Strains use lowercase kebab-case IDs; families use Title Case
