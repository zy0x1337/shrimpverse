# Graph Report - /home/user/shrimpverse  (2026-06-09)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 305 nodes · 481 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 92% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `49fa1e9d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]

## God Nodes (most connected - your core abstractions)
1. `Strain` - 27 edges
2. `Shrimpverse Project Documentation` - 25 edges
3. `compilerOptions` - 20 edges
4. `compilerOptions` - 17 edges
5. `Polishing Plan Session 7` - 13 edges
6. `App Main Layout` - 13 edges
7. `DesignSystemGenerator` - 11 edges
8. `StrainUniverse 3D Canvas` - 11 edges
9. `_search_csv()` - 8 edges
10. `familyColors` - 8 edges

## Surprising Connections (you probably didn't know these)
- `UI-UX Pro Max Skill` --conceptually_related_to--> `App Main Layout`  [AMBIGUOUS]
  .cursor/skills/ui-ux-pro-max/SKILL.md → src/components/App.tsx
- `Shrimpverse Project Documentation` --references--> `OrbitRing Path Visualization`  [EXTRACTED]
  CLAUDE.md → src/components/3d/OrbitRing.tsx
- `Shrimpverse Project Documentation` --references--> `StrainPlanet Moon Mesh`  [EXTRACTED]
  CLAUDE.md → src/components/3d/StrainPlanet.tsx
- `Shrimpverse Project Documentation` --references--> `StrainRail3D HTML Panel in 3D`  [EXTRACTED]
  CLAUDE.md → src/components/3d/StrainRail3D.tsx
- `Shrimpverse Project Documentation` --references--> `Sun3D Pulsing Star`  [EXTRACTED]
  CLAUDE.md → src/components/3d/Sun3D.tsx

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (33): Props, Props, OrbitCenterProps, BodySection, ShrimpVisual(), ShrimpVisualProps, StrainAtlas(), StrainAtlasProps (+25 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (28): StrainUniverse(), CARIDINA_ORDER, CARIDINA_SET, FAMILY_GLOW, FAMILY_ORBIT_RADIUS, FAMILY_ORDER, FAMILY_TEXT, FamilyOrbitExplorer() (+20 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (25): DesignSystemGenerator, _detect_page_type(), format_ascii_box(), format_markdown(), format_master_md(), format_page_override_md(), generate_design_system(), _generate_intelligent_overrides() (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (32): App Main Layout, Shrimpverse Project Documentation, Family Colors and Genus Mapping, EffectPipeline Bloom and Vignette, FamilyNode3D Planet Mesh, FamilyOrbitExplorer 2D SVG Component, FilterPanel Component, Orbital Distance Positioning (+24 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (19): EffectPipeline(), FamilyNode3D(), MaterialParams, PlanetMaterial, Props, OrbitRing(), Props, CARIDINA_FAMILIES (+11 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (25): dependencies, motion, postprocessing, react, react-dom, @react-spring/three, @react-three/drei, @react-three/fiber (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (15): BM25, detect_domain(), _load_csv(), Lowercase, split, remove punctuation, filter short words, Build BM25 index from documents, Score all documents against query, Load CSV and return list of dicts, Core search function using BM25 (+7 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.27
Nodes (7): Props, StrainOrbit(), Props, StrainPlanet(), computeOrbitalPositions(), distanceToRadius(), wildformDistance()

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (6): buildCommand, cleanUrls, headers, outputDirectory, rewrites, $schema

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (3): HTML Entry Point, Application Entry Point, Neocaridina Brand Icon SVG

## Ambiguous Edges - Review These
- `Polishing Plan Session 7` → `UI-UX Pro Max Skill`  [AMBIGUOUS]
  POLISHING_PLAN_SESSION_7.md · relation: conceptually_related_to
- `UI-UX Pro Max Skill` → `App Main Layout`  [AMBIGUOUS]
  .cursor/skills/ui-ux-pro-max/SKILL.md · relation: conceptually_related_to

## Knowledge Gaps
- **107 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+102 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Polishing Plan Session 7` and `UI-UX Pro Max Skill`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `UI-UX Pro Max Skill` and `App Main Layout`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Strain` connect `Community 0` to `Community 9`, `Community 4`, `Community 1`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `search()` connect `Community 7` to `Community 2`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Shrimpverse Project Documentation` (e.g. with `Shrimpverse README` and `Polishing Plan Session 7`) actually correct?**
  _`Shrimpverse Project Documentation` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `BM25 ranking algorithm for text search`, `Lowercase, split, remove punctuation, filter short words`, `Build BM25 index from documents` to the rest of the system?**
  _133 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07738095238095238 - nodes in this community are weakly interconnected._