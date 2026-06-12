# Freshwater Aquarium Shrimp — Developer Knowledge Base

> **Scope:** Taxonomic, biological, and husbandry reference for use in shrimp taxonomy visualization applications.
> **Sources:** Peer-reviewed literature (2020–2026), WoRMS, NCBI Taxonomy, GBIF.
> **Precision note:** Taxonomy flags (`⚠️ DISPUTED`, `🔄 SYNONYM`, `❓ UNCERTAIN`) are included throughout. Scientific names follow WoRMS / World Register of Marine Species (accessed 2024–2025) unless stated otherwise.

---

## Table of Contents

1. [Taxonomy & Classification](#1-taxonomy--classification)
2. [Water Chemistry Requirements](#2-water-chemistry-requirements)
3. [Color Genetics & Morphology](#3-color-genetics--morphology)
4. [Crossbreeding & Hybrid Biology](#4-crossbreeding--hybrid-biology)
5. [Species Profiles](#5-species-profiles)
6. [Difficulty & Care Levels](#6-difficulty--care-levels)
7. [Compatibility with Other Tank Inhabitants](#7-compatibility-with-other-tank-inhabitants)
8. [Breeding Biology & Workflows](#8-breeding-biology--workflows)
9. [Glossary](#9-glossary)

---

## 1. Taxonomy & Classification

### 1.1 Full Taxonomic Tree

```
Kingdom:  Animalia
  Phylum: Arthropoda
    Class: Malacostraca
      Order: Decapoda
        Infraorder: Caridea
          Family: Atyidae De Haan, 1849
            Genus: Neocaridina Kubo, 1938         ← hard water / ornamental morphs
            Genus: Caridina H. Milne-Edwards, 1837 ← soft water / Sulawesi endemic
            Genus: Atyopsis Chace, 1983            ← filter feeders (Asia/Pacific)
            Genus: Atya Leach, 1816               ← filter feeders (West Africa/Americas)
```

> ⚠️ **Note on Tylomelania:** Tylomelania is a genus of freshwater snails (Family Pachychilidae, Cerithioidea), **not shrimp**. It is endemic to Sulawesi and commonly co-kept with Sulawesi shrimp but belongs to a completely different phylum (Mollusca). Do not include in any shrimp taxonomy tree.

---

### 1.2 Genera in the Hobby

| Genus | Family | Approx. Described Species | Hobby-relevant Species | Native Range |
|---|---|---|---|---|
| *Neocaridina* | Atyidae | ~25–30 | 1 (*N. davidi*) + forms | East Asia (China, Taiwan, Japan, Korea) |
| *Caridina* | Atyidae | ~340+ | ~15–20 | Pan-tropical Asia, Africa, Oceania |
| *Atyopsis* | Atyidae | ~5 | 1 (*A. moluccensis*) | Southeast Asia, Pacific islands |
| *Atya* | Atyidae | ~15 | 1 (*A. gabonensis*) | West Africa, Caribbean, South America |

---

### 1.3 Neocaridina — Species Relevant to the Hobby

> ⚠️ **MAJOR TAXONOMY DISPUTE (active as of 2024–2025):**
>
> The *N. davidi* / *N. denticulata* / *N. heteropoda* species complex is actively contested:
>
> - **Shih et al. (2024, Zool. Stud. 63:e18)** — Integrative (COI + morphology) identifies *N. davidi* and *N. denticulata* as separate species. 11 taxa detected in Japan, 4 non-indigenous.
> - **Fuke (2024, Zool. Stud. 63:e53)** — Commentary argues both are conspecific (*N. davidi*), citing Onuki & Fuke (2022) genome-wide SNPs. Flags conservation risk: misidentification of the native *N. denticulata* as the invasive *N. davidi* undermines protection.
> - **Cai & reply authors (2025, Zool. Stud. 64:e66)** — Rebuttal of Fuke; defends species separation; highlights limits of mtDNA-only and admixture approaches in hybridizing lineages.
> - **Wang et al. (2024, Curr. Issues Mol. Biol. 46:12279)** — Mitogenomic phylogeny proposes *N. davidi*, *N. denticulata denticulata*, *N. denticulata sinensis*, and *N. heteropoda* should all be synonymized under *N. denticulata*.
> - **WoRMS (accessed 2024)** — Currently accepts *N. davidi* (Bouvier, 1904) as valid; *N. heteropoda* listed as junior synonym.
>
> **For app data modeling:** Store `species_validity = "disputed"` for this complex. This document uses *N. davidi* as the working name per current WoRMS status.

| Scientific Name | Taxonomy Status | Common Name(s) | Notes |
|---|---|---|---|
| *Neocaridina davidi* (Bouvier, 1904) | ✅ Accepted (WoRMS 2024) | Cherry Shrimp, all hobby color morphs | All aquarium color morphs belong here |
| *Neocaridina heteropoda* Liang, 2002 | 🔄 SYNONYM of *N. davidi* | — | Junior subjective synonym per WoRMS |
| *Neocaridina denticulata sinensis* (Kemp, 1918) | 🔄 SYNONYM of *N. davidi* | — | Junior subjective synonym per WoRMS |
| *Caridina davidi* Bouvier, 1904 | 🔄 ORIGINAL COMBINATION | — | Superseded; original placement in *Caridina* |
| *Neocaridina denticulata* (De Haan, 1844) | ⚠️ DISPUTED — see above | Japanese freshwater shrimp | Native Japanese species; may be separate from or = *N. davidi* |
| *Neocaridina ikiensis* Fujita & Shokita, 2007 | ✅ Accepted | — | Native Iki Island, Japan; not in hobby |
| *Neocaridina koreana* (Kubo, 1938) | ✅ Accepted | Korean freshwater shrimp | Occasionally traded in Asia |
| *Neocaridina palmata* Shen, 1948 | ✅ Accepted | — | Found in China; rare in hobby |
| *Neocaridina zhangjiajiensis* Liu, 1993 | ✅ Accepted | — | Occasionally found in hobby; China |
| *Neocaridina cf. zhangjiajiensis* | ❓ UNCERTAIN | Green shrimp / Jade shrimp | Trade label; true identity not confirmed |

**All hobby color morphs (Red Cherry, Blue Dream, Blue Velvet, Yellow, Orange, Black Rose, Bloody Mary, White Pearl, Green Jade, Rili variants, OE variants) are selectively bred forms of a single species: *Neocaridina davidi*.**

---

### 1.4 Caridina — Species Relevant to the Hobby

| Scientific Name | Taxonomy Status | Common Name(s) | Notes |
|---|---|---|---|
| *Caridina cantonensis* Yü, 1938 | ✅ Accepted | Bee Shrimp, Crystal Red/Black, Taiwan Bee | All Crystal and Taiwan Bee lines |
| *Caridina mutata* Cai & Ng, 1999 | 🔄 SYNONYM of *C. cantonensis* | — | WoRMS synonymy |
| *Caridina yulinica* Cai & Ng, 1999 | 🔄 SYNONYM of *C. cantonensis* | — | WoRMS synonymy |
| *Caridina logemanni* Klotz, Von Rintelen & Misof, 2013 | ✅ Accepted | Black Bee, Bee Shrimp | ⚠️ Many older sources still use *C. cantonensis* for this species |
| *Caridina mariae* Balss, 1972 | ✅ Accepted | Tiger Shrimp | Used to produce Tibee crosses |
| *Caridina cf. babaulti* | ❓ UNCERTAIN | Tangerine Tiger, Indian Tiger | Hobbyist label; WoRMS records *C. babaulti* from Africa; Indian variants likely undescribed |
| *Caridina serrata* Stimpson, 1860 | ✅ Accepted | Bee Shrimp (alternate) | ⚠️ Sometimes mislabeled in trade alongside *C. cantonensis* |
| *Caridina multidentata* Stimpson, 1860 | ✅ Accepted | Amano Shrimp, Yamato Shrimp | *C. japonica* is a junior synonym |
| *Caridina japonica* De Man, 1892 | 🔄 SYNONYM of *C. multidentata* | — | Widely used in older hobby literature |
| *Caridina dennerli* Von Rintelen & Cai, 2009 | ✅ Accepted; ⚠️ IUCN Critically Endangered | Cardinal Shrimp, White Spot Sulawesi | Possibly extinct in the wild (last wild record ~2013) |
| *Caridina spinata* Cai & Von Rintelen, 2013 | ✅ Accepted | Harlequin Shrimp, Sixspot Shrimp | Sulawesi endemic |
| *Caridina woltereckae* Von Rintelen & Cai, 2009 | ✅ Accepted | White Glove Shrimp, White Orchid Shrimp | Sulawesi endemic, Lake Towuti / Matano |
| *Caridina glaubrechti* Von Rintelen & Cai, 2009 | ✅ Accepted | Spotted Sulawesi Shrimp | Rarely in hobby |
| *Caridina parvula* Von Rintelen & Cai, 2009 | ✅ Accepted | Tiny Sulawesi Shrimp | Rarely in hobby |

> **Bee Shrimp nomenclature note:** The aquarium trade interchangeably uses *C. cantonensis* for both the Bee Shrimp / Crystal variants and the Taiwan Bee variants. Molecular data suggests Taiwan Bees likely involve hybridization with *C. mariae* (Tiger Shrimp). Some authorities assign Taiwan Bees to *Caridina* sp. "Shadow" or *C.* cf. *cantonensis*. App data models should treat Taiwan Bees as a cultivar group under *C. cantonensis* s.l. with `hybrid_origin = true`.

---

### 1.5 Filter Feeders (Atyopsis, Atya)

| Scientific Name | Taxonomy Status | Common Name(s) |
|---|---|---|
| *Atyopsis moluccensis* (De Haan, 1849) | ✅ Accepted | Bamboo Shrimp, Wood Shrimp, Fan Shrimp |
| *Atyopsis spinipes* (Newport, 1847) | ✅ Accepted | Singapore Bamboo Shrimp |
| *Atya gabonensis* Giebel, 1854 | ✅ Accepted | Vampire Shrimp, Giant African Filter Shrimp, African Fan Shrimp |
| *Atya scabra* (Leach, 1816) | ✅ Accepted | Mountain Shrimp, Rock Shrimp; Caribbean / Central America; rarely in hobby |

---

## 2. Water Chemistry Requirements

### 2.1 Parameters Master Table

| Species / Group | pH | GH (dGH) | KH (dKH) | TDS (ppm) | Temp (°C) | Water Type | Substrate |
|---|---|---|---|---|---|---|---|
| *Neocaridina davidi* (all morphs) | 6.8–8.0 | 6–12 (opt. 7–9) | 2–8 (opt. 3–5) | 150–300 (opt. 200–250) | 18–28 (opt. 20–24) | Hard / neutral | Any inert |
| *Caridina cantonensis* (Crystal/Bee) | 5.5–6.8 (opt. 5.8–6.5) | 4–6 | 0–1 | 90–150 (opt. 100–130) | 20–24 (opt. 21–23) | Soft / acidic | Active buffering soil |
| *Caridina cantonensis* s.l. (Taiwan Bee) | 5.8–6.5 | 4–6 | 0–1 | 100–150 | 20–24 | Soft / acidic | Active buffering soil |
| *Caridina mariae* (Tiger) | 6.0–7.5 | 4–8 | 0–3 | 100–200 | 22–26 | Soft–neutral | Active soil or sand |
| *Caridina multidentata* (Amano) | 6.5–7.5 | 6–15 | 3–10 | 150–250 | 18–27 | Neutral | Any |
| *Caridina dennerli* (Cardinal / Sulawesi) | 7.5–8.5 (opt. 7.8–8.2) | 4–9 (opt. 5–7) | 2–6 (opt. 3–5) | 60–150 (opt. 80–120) | 27–30 (opt. 28–29) | Alkaline warm | Fine sand / rock |
| *Caridina spinata* (Harlequin) | 7.8–8.5 | 8–15 | 3–8 | 100–200 | 28–30 | Alkaline warm | Fine sand |
| *Caridina woltereckae* (White Glove) | 7.5–8.5 | 6–12 | 3–6 | 100–180 | 27–30 | Alkaline warm | Fine sand |
| *Atyopsis moluccensis* (Bamboo) | 6.5–7.5 | 6–15 | 2–10 | 150–200 | 22–28 | Neutral | Sand + flow |
| *Atya gabonensis* (Vampire) | 6.5–7.5 | 6–20 (opt. 8–12) | 3–12 (opt. 4–8) | 150–300 | 22–28 | Neutral | Sand + flow |

### 2.2 Water Type Categories

**Hard Water (Neocaridina)**
- Uses **GH/KH+** remineralizer (raises both GH and KH simultaneously)
- Tolerates tap water in many regions if it falls within range
- KH provides carbonate buffering: pH remains stable even with CO₂ / humic acid fluctuations
- Wide parameter tolerance window — beginner-friendly

**Soft Water (Caridina Crystal/Bee/Tiger)**
- Uses **GH+ only** (no KH addition) — KH must stay at 0–1 dKH
- Requires RO or distilled water as the base (0 TDS starting point)
- Active buffering substrate (ADA Amazonia, Fluval Stratum, etc.) maintains pH 5.8–6.5 via cation exchange
- Substrate exhausts after ~12–18 months and must be replaced (full tank restart)
- Zero KH = no carbonate buffer; all pH stability depends on the substrate

**Alkaline Warm (Sulawesi)**
- Uses **Sulawesi Mineral 7.5** or **8.5** remineralizer
- Opposite to soft-water Caridina: higher pH, higher temperature, moderate hardness
- Parameters mimic Lake Matano / Lake Towuti geochemistry (volcanic mineral signature)
- Conductivity in wild Lake Matano recorded at ~224 µS/cm; pH ~7.4

### 2.3 Why Sulawesi Shrimp Require Special Parameters

Lake Matano (Sulawesi, Indonesia) is **ultra-oligotrophic**: extremely nutrient-poor, extremely clear (estimated 20 m visibility). Its closed volcanic basin has isolated the lake's chemistry over millions of years:

- **High pH (7.5–8.5):** Continuous leaching of carbonate and silicate minerals from volcanic geology
- **Warm temperature (27–31°C):** Equatorial climate, no seasonal cold; thermal stratification present
- **Stable, moderate TDS (60–150 ppm):** Mineral-rich but not saline
- **Near-zero nitrate (target <5 ppm):** Ultra-oligotrophic origin — tolerance for organic load is near-zero
- **High dissolved oxygen:** Natural fast-flowing rocky shallow zones; deep-water cold upwelling

*Caridina dennerli* is **IUCN Critically Endangered** and possibly extinct in the wild (last confirmed wild specimen ~2013). All traded specimens should be captive-bred. Source responsibly.

### 2.4 Remineralizer Comparison

| Product | Raises GH | Raises KH | Target Species | pH Effect | Composition Highlights |
|---|---|---|---|---|---|
| **Salty Shrimp GH/KH+** | ✅ Yes | ✅ Yes (~0.5 KH per 1 GH) | *Neocaridina*, community fish | Neutral → slight buffer | 13.1% Ca, 5.0% Mg, 2.4% K, 26.5% HCO₃, 27.9% Cl |
| **Salty Shrimp GH+** (Bee Shrimp Mineral) | ✅ Yes | ❌ No (0.8% HCO₃ trace) | *Caridina* Crystal/Taiwan Bee | No buffering | 18.2% Ca, 6.2% Mg, 1.5% K, 39.9% Cl, 16.1% SO₄ |
| **Salty Shrimp Sulawesi 7.5** | ✅ Yes | ✅ Yes (GH:KH ≈ 1.0:0.42) | Sulawesi lower-pH species | Buffers to ~pH 7.5 | Fast-dissolving; volcanic mineral profile |
| **Salty Shrimp Sulawesi 8.5** | ✅ Yes | ✅ Yes | Sulawesi higher-pH species (*C. dennerli*, *C. spinata*) | Buffers to ~pH 8.5 | Higher carbonate load |

> **Critical rule:** Never use GH/KH+ for soft-water Caridina. The KH it introduces will compete with and rapidly deplete the active soil buffer, causing uncontrolled pH swings and shrimp deaths. GH+ only.

---

## 3. Color Genetics & Morphology

### 3.1 How Color Morphs Arise in *Neocaridina davidi*

Wild-type *N. davidi* is translucent-to-brownish with a faint dorsal stripe — cryptic coloration for leaf-litter stream habitats. Color is regulated by **chromatophores** (specialized pigment cells in the exoskeleton) that absorb and reflect specific wavelengths.

All hobby morphs are products of **selective breeding** over many generations, not separate species. The generational process:
1. A spontaneous mutation increases chromatophore expression in one pigment wavelength range
2. Breeders select the most intensely colored individuals each generation for reproduction
3. Repeated selection increases color penetrance and stabilizes the trait
4. Once a line is established, crossing with a different color line (even another *N. davidi* morph) disrupts color and causes reversion

Hobby breeders recognize several independent **color lines** that should not be mixed:
- **Red line:** Cherry, Sakura, Fire Red, Painted Fire Red, Bloody Mary
- **Blue line:** Blue Velvet, Blue Dream, Blue Diamond, OE Blue Dream
- **Yellow/Orange line:** Yellow, Sunkist Orange, Pumpkin, Neon Orange
- **Black line:** Black Rose, Black Carbon, Black Diamond
- **White line:** Snowball, White Pearl, White Rili

### 3.2 Rili Pattern Genetics

The Rili pattern is a **partial chromatophore reduction mutation**: pigment cells are absent or non-functional in the mid-body segment (abdomen), while head and tail segments retain full color expression.

```
Normal Cherry:    [█████████████████████████████████]  ← uniform color
Rili:             [█████████░░░░░░░░░░░░░░░░░░█████]  ← color / clear / color
High Rili:        [██████░░░░░░░░░░░░░░░░░░░░░░████]  ← narrower color bands
Ultra-Low Rili:   [████████████████░░░░░░██████████]  ← near-solid, thin clear band
```

- The Rili mutation is **incompletely penetrant** — clear band width varies between individuals and generations
- Rili × non-Rili crosses produce a variable mix: solid, Rili, incomplete (poor Rili)
- The Rili allele is latent in many modern *N. davidi* lines — crossing unrelated color lines can produce unexpected Rili-patterned offspring in F2

Available Rili morphs: Red Rili, Blue Rili, Orange Rili, Carbon Rili, Green Rili, Yellow Rili.

### 3.3 Orange Eye (OE) Mutation

The **Orange Eye (OE)** mutation is a distinct genetic locus from body color:
- Wild-type shrimp: dark/black eyes
- OE shrimp: vivid orange eyes; requires **homozygosity** to express visibly
- OE is a separate recessive allele; crossing OE × non-OE yields F1 offspring with dark eyes (OE silenced)
- F2 of OE carrier × OE carrier: ~25% show orange eyes (Mendelian recessive)
- OE Blue Dream = Blue Dream body + homozygous OE allele at eye-color locus

### 3.4 Taiwan Bee Color Lines

All Taiwan Bees are *Caridina cantonensis* s.l. (with likely Tiger Shrimp hybrid ancestry). Variants are maintained as selectively-bred lines:

| Line | Pattern | Key Feature |
|---|---|---|
| **King Kong (Black)** | Solid jet black | No white patches; highest grade = pure opaque black body |
| **King Kong (Red)** | Solid deep red | Red pigment dominant; similar to black but red |
| **Panda** | Bold black + white bands | Graded on band sharpness and white purity |
| **Shadow Panda** | Blue-tinged black + white | "Shadow" = blue iridescence replacing pure black areas |
| **Red Panda** | Red + white bands | Red variant of the Panda pattern |
| **Blue Bolt** | Solid bright blue body | Blue chromatophore expression; vivid under full-spectrum LED |
| **Wine Red / Red Wine** | Deep burgundy-red | Intermediate phenotype between CRS and Taiwan Bee |
| **Pinto** | Spotted / mosaic black-white | Produced via Taiwan Bee × Tiger Shrimp crosses (Taitibee line) |

> All Taiwan Bee variants can cohabit and interbreed, producing Taiwan Bee offspring. They do **not** revert to wildtype when crossed intra-group — they share the same genetic background.

### 3.5 Crystal Red / Crystal Black Grading (CRS / CBS)

Grading is based solely on white coverage extent and color opacity. Developed in Japan ~1996–2000s; globally standardized.

| Grade | White Coverage | Description | Opacity |
|---|---|---|---|
| **C** | <15% | Mostly red/black body; thin white stripe or blotch only | Often translucent / pale |
| **B** | 15–35% | More white, but uneven, blotchy, or murky | Low–moderate |
| **A** | 35–55% | Roughly equal coverage; cleaner white, some patchiness | Moderate |
| **S** | 55–70% | Defined bands; clean white, opaque pigment color | Good |
| **SS** | 70–85% | "Hinomaru" — single color dot on otherwise white body | High |
| **SSS ("Mosura")** | 85–100% | Near-white body; "Rising Sun" = white body + red head cap | Very high |

> SSS full-white shrimp are extremely high grade but cannot reach the very top classification without a patterned element (head cap). The "Mosura Rising Sun" pattern (white body + defined red head) is the pinnacle.
>
> Practical caveat: Older shrimp naturally lose some opacity without losing genetic quality. Grade based on young adults (3–6 months post-juvenile).

### 3.6 Color Stability Over Generations

**Inbreeding depression** is the primary risk in closed high-grade lines:
- Repeated sibling × sibling selection for color intensity reduces genome-wide heterozygosity
- Symptoms: smaller clutch sizes, lower hatch rates, reduced immune competence, increased molt failure rate
- **Outcrossing strategy:** Introduce genetically unrelated individuals from a different breeder of the **same color line** (not a different morph) every 5–8 generations to restore heterozygosity without disrupting color genetics
- **Wildtype reversion (F2):** When two different *N. davidi* morphs are mixed, F2 offspring show Mendelian segregation across multiple color loci → majority express brownish wild-type. Permanent in mixed colonies.

---

## 4. Crossbreeding & Hybrid Biology

### 4.1 Cross-Compatibility Matrix

| Cross | Result | Stability | Notes |
|---|---|---|---|
| *N. davidi* morph × *N. davidi* morph | Viable, fertile | ⚠️ UNSTABLE | F2 wildtype reversion |
| *C. cantonensis* Crystal × *C. cantonensis* Taiwan Bee | Viable, fertile ("Mischling") | ✅ STABLE (within Caridina) | Same species; Taiwan Bee recessive; see diagram |
| *C. cantonensis* × *C. mariae* Tiger | Viable F1 ("Tibee") | ⚠️ UNSTABLE | F2 highly variable; Tibee used as Taitibee intermediate |
| Tibee × Taiwan Bee | "Taitibee" / "Pinto" | ⚠️ UNSTABLE–STABILIZING | Multi-gene hybrid; variable; dedicated lines partially stabilized |
| *Caridina* spp. × Sulawesi *Caridina* | ❌ IMPOSSIBLE | — | Incompatible water chemistry + high genetic distance |
| *Neocaridina* × *Caridina* | ❌ IMPOSSIBLE | — | Genera-level reproductive isolation; distinct anatomy |
| *Neocaridina* × *Atyopsis* / *Atya* | ❌ IMPOSSIBLE | — | Different genera; distinct reproductive biology |

---

### 4.2 Genetics Diagrams

#### 4.2.1 — Neocaridina Cross-Morph F2 Wildtype Reversion

Simplified two-locus model. R = red allele (dominant), B = blue allele (dominant), each at independent loci. Wild-type (brownish) = neither R nor B expressed.

```
════════════════════════════════════════════════════════════════
  PARENTAL GENERATION (P)
════════════════════════════════════════════════════════════════
  Red Cherry (red line):   RR bb   →  phenotype: RED
  Blue Dream (blue line):  rr BB   →  phenotype: BLUE

════════════════════════════════════════════════════════════════
  F1 GENERATION  (P × P)
════════════════════════════════════════════════════════════════
  All offspring genotype: Rr Bb
  Phenotype: intermediate/muddy color; neither pure red nor blue
             Many appear brownish or de-saturated

════════════════════════════════════════════════════════════════
  F2 GENERATION  (F1 × F1  →  2-locus Punnett)
════════════════════════════════════════════════════════════════

           RB         Rb         rB         rb
    ┌──────────┬──────────┬──────────┬──────────┐
 RB │ RRBB     │ RRBb     │ RrBB     │ RrBb     │
    ├──────────┼──────────┼──────────┼──────────┤
 Rb │ RRBb     │ RRbb     │ RrBb     │ Rrbb     │
    ├──────────┼──────────┼──────────┼──────────┤
 rB │ RrBB     │ RrBb     │ rrBB     │ rrBb     │
    ├──────────┼──────────┼──────────┼──────────┤
 rb │ RrBb     │ Rrbb     │ rrBb     │ rrbb     │
    └──────────┴──────────┴──────────┴──────────┘

  Expected phenotype ratios (approx.):
  ┌────────────────────────────────────────────────────────┐
  │  9/16  R·· B··  → both dominants present → WILD-TYPE  │  ← REVERSION
  │  3/16  R·· bb   → red expression only                 │
  │  3/16  rr  B··  → blue expression only                │
  │  1/16  rr  bb   → no dominant allele → WILD-TYPE       │  ← REVERSION
  ├────────────────────────────────────────────────────────┤
  │  TOTAL WILD-TYPE REVERSION: ~62.5% of F2 offspring     │
  └────────────────────────────────────────────────────────┘

  ⚠️ PRACTICAL OUTCOME: Majority of F2 express brownish wild-type.
     Pure color lines are permanently lost in mixed colonies.
     Real genetics involve more loci; outcome direction holds.
```

---

#### 4.2.2 — Crystal (CRS) × Taiwan Bee: The Mischling Method

Taiwan Bee pattern (T) behaves as **recessive** relative to Crystal/Bee phenotype (C).

```
════════════════════════════════════════════════════════════
  P GENERATION
════════════════════════════════════════════════════════════
  Crystal Red Shrimp:       CC    (homozygous Crystal)
  Taiwan Bee (King Kong):   TT    (homozygous Taiwan Bee)

════════════════════════════════════════════════════════════
  F1 GENERATION:  "Mischling"  (CC × TT = all CT)
════════════════════════════════════════════════════════════
  Genotype:   CT  (100% of offspring)
  Phenotype:  LOOKS like Crystal Red/Black  ← Crystal is dominant
              CARRIES Taiwan Bee genes recessively
              → called "Mischling" (German: mixed)

════════════════════════════════════════════════════════════
  F2 GENERATION:  Mischling × Mischling  (CT × CT)
════════════════════════════════════════════════════════════

           C           T
    ┌──────────┬──────────┐
  C │  CC  25% │  CT  25% │
    ├──────────┼──────────┤
  T │  CT  25% │  TT  25% │
    └──────────┴──────────┘

  ┌────────────────────────────────────────────────┐
  │  25%  CC  →  Pure Crystal phenotype            │
  │  50%  CT  →  Mischling (Crystal-looking;       │
  │              carries Taiwan Bee genes)          │
  │  25%  TT  →  Taiwan Bee expressed!             │
  └────────────────────────────────────────────────┘

  WHY THIS IS USED:
  ✓ Mixing Crystal genetics into Taiwan Bee lines improves:
    - Color intensity and opacity
    - Body size (Taiwan Bees are naturally larger than CRS)
    - Disease resistance (genetic diversity)
  ✓ Cost-effective: Mischlings cheap; generations recover Taiwan Bees
  ✓ Industry-standard method for improving Taiwan Bee lines
```

---

#### 4.2.3 — Tiger × Crystal → Tibee → Taitibee Pathway

```
════════════════════════════════════════════════════════════
  STEP 1:  TIBEE  (F1 Hybrid)
════════════════════════════════════════════════════════════
  Caridina mariae (Tiger)  ×  C. cantonensis (Crystal/Bee)
                            ↓
                          TIBEE (F1)

  • F1 viable and marginally fertile
  • COI genetic distance ~0.39 (Niade 2025); exceeds 0.25 incompatibility
    threshold → explains reduced fertility and F2 variability
  • Phenotype: Tiger-like striping with slight Bee coloration influence
  • Not all crosses succeed; F1 fertility reduced vs. pure-species crosses

════════════════════════════════════════════════════════════
  STEP 2:  TAITIBEE
════════════════════════════════════════════════════════════
  Tibee (F1)  ×  Taiwan Bee
                ↓
             TAITIBEE

  • Introduces Tiger Shrimp gene segments into Taiwan Bee background
  • F2 offspring highly variable: mosaic, spotted, striped, solid
  • "Pinto Shrimp" = partially-stabilized Taitibee (bold mosaic spots)
  • Requires many generations of selective breeding for consistency

════════════════════════════════════════════════════════════
  STABILITY SUMMARY
════════════════════════════════════════════════════════════
  Tibee F1:     ⚠️  Unstable — does not breed true
  Taitibee:     ⚠️  Unstable — highly variable F2
  Pinto:        🔄  Stabilizing — more consistent in dedicated lines
```

---

#### 4.2.4 — Why Neocaridina × Caridina Cross Is Impossible

```
  Neocaridina davidi           Caridina cantonensis
  ──────────────────           ─────────────────────
  Family:   Atyidae            Atyidae  (same family)
  Genus:    Neocaridina        Caridina  (different genus)

  Reproductive barriers:
  ┌────────────────────────────────────────────────────┐
  │  1. Genera-level genetic divergence                │
  │     (estimated ~150+ Mya divergence)               │
  │     All Neocaridina pairs: COI distance 0.06–0.11  │
  │     Neocaridina vs Caridina: >> 0.25 threshold     │
  │                                                    │
  │  2. Anatomical incompatibility                     │
  │     Rostrum structure, spermatophore morphology,   │
  │     and pleopod architecture differ between genera │
  │                                                    │
  │  3. Behavioral incompatibility                     │
  │     Mating behavior and chemical signaling differ  │
  └────────────────────────────────────────────────────┘

  RESULT:  ❌  NO SUCCESSFUL CROSS EVER RECORDED
           Not achievable via any method in captivity
```

---

### 4.3 Stability Rating Definitions

| Rating | Meaning | Practical Example |
|---|---|---|
| ✅ **STABLE** | Offspring reliably resemble parents; breed true across generations | CRS × CRS; Taiwan Bee × Taiwan Bee |
| ⚠️ **UNSTABLE** | Offspring do not reliably resemble parents; F2 segregates strongly | Any inter-morph *N. davidi* cross; Tibee / Taitibee |
| 🔄 **STABILIZING** | Actively being line-bred; approaching consistency | Pinto lines; some OE lines |
| ❌ **IMPOSSIBLE** | Reproductive isolation; no viable offspring produced | *Neocaridina* × *Caridina*; Caridina × Sulawesi |

---

## 5. Species Profiles

### 5.1 Neocaridina davidi — Color Morphs

> All morphs below are *Neocaridina davidi* (Bouvier, 1904). Same species. Identical care requirements.
> **Care difficulty:** ⭐ Beginner | **Size:** 2–3 cm (females larger) | **Lifespan:** 1.5–2 years
> **Breeding:** Direct development; eggs hatch as miniature shrimp; gestation 21–30 days
> **Water type:** Hard, neutral (see Section 2 for full parameters)

| Morph Name | Color | Line | Grade / Tier | Notes |
|---|---|---|---|---|
| **Red Cherry / Sakura** | Translucent red → patchy red | Red | Low | Entry-level; most common |
| **Fire Red** | Solid opaque red | Red | Medium | Full dorsal coverage |
| **Painted Fire Red (PFR)** | Deep opaque red, legs included | Red | High | Top red line grade |
| **Bloody Mary** | Deep blood-red to brownish-red | Red ⚠️ | Medium–High | Lineage disputed; possibly *Neocaridina* sp. hybrid origin |
| **Blue Dream / Blue Diamond** | Sky blue → deep cobalt | Blue | Low → High | "Diamond" = highest opacity |
| **Blue Velvet** | Semi-transparent blue | Blue | Low–Med | Older morph; less intense than Blue Dream |
| **OE Blue Dream** | Blue body + vivid orange eyes | Blue / OE | — | OE allele layered on Blue Dream |
| **Yellow / Neon Yellow** | Clear yellow → vivid lemon | Yellow/Orange | Low → High | Very hardy; popular beginner morph |
| **Sunkist / Pumpkin Orange** | Orange, variable saturation | Yellow/Orange | Low → High | "Pumpkin" = lower saturation |
| **Green Jade / Jade** | Pale to deeper green | ❓ Uncertain | — | Possibly *N. cf. zhangjiajiensis*; genetic origin unconfirmed |
| **Black Rose / Black Diamond** | Dark charcoal → solid opaque black | Black | Low → High | "Diamond" = full opaque black |
| **White Pearl / Snowball** | Cloudy white | White | Low–Med | Soft white opacity; named for egg color (Snowball = white eggs) |
| **Red Rili** | Red head + clear midsection + red tail | Red | — | Rili pattern on red line |
| **Blue Rili** | Blue head + clear + blue tail | Blue | — | Rili pattern on blue line |
| **Carbon Rili** | Black/dark head + clear + dark tail | Black | — | |
| **Wildtype / Brown** | Translucent brownish, dorsal stripe | — | — | Natural form; reverts in mixed colonies |

---

### 5.2 Caridina cantonensis — Crystal Lines

| Profile Field | Crystal Red (CRS) | Crystal Black (CBS) | Black Bee |
|---|---|---|---|
| **Scientific name** | *Caridina cantonensis* Yü, 1938 | *Caridina cantonensis* Yü, 1938 | *Caridina logemanni* Klotz et al., 2013 ⚠️ |
| **Origin** | Selective breeding from Black Bee stock; first isolated in Japan 1996 | Selective breeding from Black Bee | Wild streams, Guangdong Province, China |
| **Water type** | Soft / acidic | Soft / acidic | Soft / acidic |
| **pH** | 5.5–6.8 | 5.5–6.8 | 6.0–7.0 |
| **GH** | 4–6 | 4–6 | 4–8 |
| **KH** | 0–1 | 0–1 | 0–2 |
| **TDS** | 90–150 | 90–150 | 100–200 |
| **Temp (°C)** | 20–24 | 20–24 | 20–25 |
| **Difficulty** | ⭐⭐ Intermediate | ⭐⭐ Intermediate | ⭐⭐ Intermediate |
| **Size** | 2–3 cm | 2–3 cm | 2–3 cm |
| **Lifespan** | 1.5–2 years | 1.5–2 years | 1.5–2 years |
| **Clutch size** | 20–30 eggs | 20–30 eggs | 20–30 eggs |
| **Gestation** | 25–35 days | 25–35 days | 25–35 days |
| **Breeding mode** | Direct (miniature shrimp) | Direct | Direct |
| **Notable variants** | Grades C, B, A, S, SS, SSS | Grades C, B, A, S, SS, SSS | Base stock for Crystal mutations |

> ⚠️ Crystal Red origin note: The first red mutation appeared in a Black Bee colony of Hisayasu Suzuki in Japan in 1996. He selectively bred 3 red specimens over years to establish the CRS line. All CRS trace to this mutation event in captive *C. cantonensis* / *C. logemanni* stock.

---

### 5.3 Caridina cantonensis s.l. — Taiwan Bee Lines

| Profile Field | Value |
|---|---|
| **Scientific name** | *Caridina cantonensis* s.l. / *Caridina* sp. "Shadow" ❓ |
| **Taxonomy note** | Hybrid origin: likely *C. logemanni* (Bee) × *C. mariae* (Tiger); stabilized in Taiwan in early 2000s |
| **Water type** | Soft / acidic (identical to Crystal) |
| **pH** | 5.8–6.5 |
| **GH** | 4–6 |
| **KH** | 0–1 |
| **TDS** | 100–150 |
| **Temp (°C)** | 20–24 |
| **Difficulty** | ⭐⭐–⭐⭐⭐ Intermediate–Advanced |
| **Size** | 3–3.5 cm (females larger than CRS) |
| **Lifespan** | 1.5–2 years |
| **Breeding** | Direct; 20–40 eggs/clutch; gestation 25–40 days |
| **Intra-group compatibility** | ✅ All Taiwan Bee variants can cohabit; offspring are Taiwan Bees |
| **Variants** | King Kong (Black), King Kong (Red), Panda, Shadow Panda, Blue Bolt, Wine Red, Pinto |

---

### 5.4 Caridina mariae — Tiger Shrimp

| Field | Value |
|---|---|
| **Scientific name** | *Caridina mariae* Balss, 1972 |
| **Common name** | Tiger Shrimp, Orange Eye Tiger |
| **Origin** | Southern China, Hong Kong hill streams |
| **Water type** | Soft to neutral |
| **pH** | 6.0–7.5 |
| **GH** | 4–8 |
| **KH** | 0–3 |
| **TDS** | 100–200 |
| **Temp (°C)** | 22–26 |
| **Difficulty** | ⭐⭐ Intermediate |
| **Size** | 2–2.5 cm |
| **Lifespan** | 1–2 years |
| **Breeding** | Direct; can hybridize with *C. cantonensis* (→ Tibee) |
| **Pattern** | Alternating orange/gold and dark brown-black vertical stripes |

> ⚠️ **"Tangerine Tiger" / Indian Tiger** — Labeled *C. cf. babaulti* in trade. True species identity contested. WoRMS records *C. babaulti* Bouvier, 1918 from Africa; Indian variants may be undescribed species. Flag as `species_uncertain = true`.

---

### 5.5 Caridina multidentata — Amano Shrimp

| Field | Value |
|---|---|
| **Scientific name** | *Caridina multidentata* Stimpson, 1860 |
| **Synonym** | 🔄 *Caridina japonica* De Man, 1892 (widely used in older literature) |
| **Common name** | Amano Shrimp, Yamato Shrimp, Japanese Algae Shrimp |
| **Origin** | Japan, Korea, Taiwan; coastal rivers with estuarine access |
| **Water type** | Neutral / flexible |
| **pH** | 6.5–7.5 |
| **GH** | 6–15 |
| **KH** | 3–10 |
| **TDS** | 150–250 |
| **Temp (°C)** | 18–27 |
| **Difficulty** | ⭐ Easy (keeping); ⭐⭐⭐⭐ Advanced (breeding) |
| **Size** | 3.5–5 cm — one of the largest "dwarf" species |
| **Lifespan** | 2–5+ years |
| **Breeding** | Larvae require brackish water — see Section 8.4 |
| **Notable** | Premier algae eater; peaceful; not a dwarf shrimp by size; sexable (females: longer subrostral dots) |

---

### 5.6 Sulawesi Shrimp

> All Sulawesi *Caridina* are endemic to ancient volcanic lakes of Sulawesi (Lake Matano, Towuti, Poso, Mahalona, Lontoa). They require warm, alkaline water — the **opposite** of Crystal/Bee *Caridina*.

| Field | *C. dennerli* (Cardinal) | *C. spinata* (Harlequin) | *C. woltereckae* (White Glove) |
|---|---|---|---|
| **Authority** | Von Rintelen & Cai, 2009 | Cai & Von Rintelen, 2013 | Von Rintelen & Cai, 2009 |
| **IUCN Status** | ⚠️ Critically Endangered | ⚠️ Endangered | ⚠️ Endangered |
| **Lake origin** | Lake Matano | Lake Matano, Towuti | Lake Towuti, Matano |
| **pH** | 7.5–8.5 (opt. 7.8–8.2) | 7.8–8.5 | 7.5–8.5 |
| **GH** | 4–9 (opt. 5–7) | 8–15 | 6–12 |
| **KH** | 2–6 (opt. 3–5) | 3–8 | 3–6 |
| **TDS (ppm)** | 60–150 (opt. 80–120) | 100–200 | 100–180 |
| **Temp (°C)** | 27–30 (opt. 28–29) | 28–30 | 27–30 |
| **Difficulty** | ⭐⭐⭐⭐ Specialist | ⭐⭐⭐⭐ Specialist | ⭐⭐⭐⭐ Specialist |
| **Size** | 1.5–2.5 cm | 2–3 cm | 2–3 cm |
| **Lifespan** | 1–2 years | 1–2 years | 1–2 years |
| **Breeding** | Direct; very difficult; biofilm-dependent | Very difficult | Very difficult |
| **Remineralizer** | Sulawesi 8.5 | Sulawesi 8.5 | Sulawesi 7.5 or 8.5 |
| **Appearance** | Deep red body + white spots | Multi-color mosaic (blue, white, brown, red) | White-translucent body; long white "gloves" on first legs |

---

### 5.7 Filter Feeders

| Field | *Atyopsis moluccensis* (Bamboo) | *Atya gabonensis* (Vampire) |
|---|---|---|
| **Scientific name** | *Atyopsis moluccensis* (De Haan, 1849) | *Atya gabonensis* Giebel, 1854 |
| **Common name** | Bamboo / Wood / Fan Shrimp | Vampire / African Fan Shrimp |
| **Origin** | SE Asia (Indonesia, Malaysia, Philippines) | West Africa, Caribbean, South America |
| **pH** | 6.5–7.5 | 6.5–7.5 |
| **GH** | 6–15 | 6–20 (opt. 8–12) |
| **KH** | 2–10 | 3–12 (opt. 4–8) |
| **TDS (ppm)** | 150–200 | 150–300 |
| **Temp (°C)** | 22–28 | 22–28 |
| **Difficulty** | ⭐–⭐⭐ Easy–Medium | ⭐⭐ Medium |
| **Size** | 8–10 cm | 8–15 cm |
| **Lifespan** | Up to 6 years | Up to 5+ years |
| **Feeding** | Fans front appendages to filter suspended particles | Same fan-feeding mechanism; also scrapes substrate occasionally |
| **Flow requirement** | ✅ CRITICAL — moderate-to-strong directed current | ✅ CRITICAL — must have directed current |
| **Breeding** | Extremely difficult (suspected brackish larval stage) | Not achieved in captivity (likely brackish larval) |
| **Tank minimum** | 40 L | 60 L |
| **Warning** | Substrate-sifting = starvation sign; ensure suspended food supply | Nocturnal; provide cave/driftwood daytime refuge |
| **Colors** | Brown, red, green, cream, blue-green | Brown to dark purple-grey; molt reveals full color |

---

## 6. Difficulty & Care Levels

### 6.1 Classification Table

| Level | Star | Criteria | Species |
|---|---|---|---|
| **Beginner** | ⭐ | Wide parameter tolerance; tap water often usable; forgiving of minor fluctuations; self-sustaining colony | All *N. davidi* morphs, *C. multidentata* (Amano), *A. moluccensis* |
| **Intermediate** | ⭐⭐ | Requires RO water + remineralizer; active buffering substrate; sensitive to parameter swings; established tank essential | *C. cantonensis* Crystal/Bee, Black Bee, Tiger |
| **Advanced** | ⭐⭐⭐ | Very narrow parameter window; substrate management critical; higher cost stock; less forgiving | Taiwan Bee, Tibee/Taitibee in dedicated setups |
| **Specialist / Collector** | ⭐⭐⭐⭐ | Endemic lake chemistry recreation required; high temperature precision; near-zero nutrient tolerance; IUCN threatened; captive-bred only | All Sulawesi *Caridina* |

### 6.2 Why Soft-Water Caridina Are Harder

1. **No KH buffer** — any source of carbonate (rocks, shells, tap water, certain substrates) instantly destabilizes pH
2. **Active soil dependency** — substrate buffers pH via cation exchange; exhausts in 12–18 months; requires full tank restart
3. **Precise TDS management** — must measure both source water and tank TDS; overdosing remineralizer is fatal
4. **Temperature ceiling** — will die above 25–26°C; requires cooling in warm climates or summer
5. **Near-zero ammonia tolerance** — less robust biofilter margin than Neocaridina

### 6.3 Why Sulawesi Shrimp Are the Most Demanding

1. **Opposite chemistry to all other Caridina** — pH 7.8–8.5 vs. 5.5–6.5; completely separate equipment, substrate, remineralizer, and workflow
2. **High temperature (28–30°C)** — requires reliable stable heater; winter heating critical; more consistent energy cost
3. **Ultra-low nitrate tolerance** — natural oligotrophic habitat; nitrate >10–15 ppm causes chronic stress and mortality
4. **Biofilm dependency** — shrimplets feed almost exclusively on biofilm; a new tank without mature biofilm = 100% juvenile mortality
5. **Social requirement** — highly social species; stressed and prone to disease in small groups; minimum 10–15 individuals
6. **Conservation ethics** — IUCN Critically Endangered; responsible sourcing requires verified captive-bred stock only

---

## 7. Compatibility with Other Tank Inhabitants

### 7.1 Shrimp-Safe Fish (Low Risk)

| Fish | Scientific Name | Safety | Notes |
|---|---|---|---|
| Otocinclus catfish | *Otocinclus* spp. | ✅ Very Safe | Algae-eater; completely ignores adults and juveniles |
| Ember Tetra | *Hyphessobrycon amandae* | ✅ Very Safe | Tiny; mouth too small for adults; minimal juvenile risk |
| Chili / Phoenix Rasbora | *Boraras brigittae* / *B. merah* | ✅ Very Safe | Nano fish; no shrimp threat |
| Pygmy Corydoras | *Corydoras pygmaeus* | ✅ Safe if well-fed | Well-fed Corydoras leave shrimp alone; some juvenile risk if starved |
| Celestial Pearl Danio | *Danio margaritatus* | ✅ Safe | Peaceful; nano-size |
| Harlequin Rasbora | *Trigonostigma heteromorpha* | ✅ Safe | Schools in midwater; rarely bothers shrimp |
| Neon Tetra | *Paracheirodon innesi* | 🟡 Mostly safe | Safe with adults; low risk to freshly-molted; avoid large groups |
| Endler's Livebearer | *Poecilia wingei* | 🟡 Mostly safe | Small; low adult risk; may take very young shrimplets |

### 7.2 Shrimp Predators (Avoid)

| Fish / Animal | Risk | Notes |
|---|---|---|
| Betta | *Betta splendens* | 🔴 HIGH | Actively hunts shrimp; unsuitable in any shrimp tank |
| Gourami (most) | *Trichogaster* spp. | 🔴 HIGH | Systematic predation |
| Cichlids (most) | Various | 🔴 HIGH | Even small cichlids hunt shrimp |
| Angelfish | *Pterophyllum* spp. | 🔴 HIGH | Eats adult shrimp |
| Loaches | *Botia* / *Chromobotia* spp. | 🟡 MODERATE–HIGH | Fast; eat juveniles; molting vulnerability |
| Guppies | *Poecilia reticulata* | 🟡 MODERATE | Eat shrimplets; adult risk low |
| Macrobrachium | *Macrobrachium* spp. | 🔴 HIGH | Predatory freshwater prawns; actively kill dwarf shrimp |

### 7.3 Intraspecies & Interspecies Compatibility

| Combination | Compatible? | Outcome |
|---|---|---|
| Same *N. davidi* color morph | ✅ | Ideal; pure color line maintained |
| Different *N. davidi* morphs | ⚠️ | Legal but NOT recommended; wildtype reversion in F2+ |
| *N. davidi* + *C. multidentata* | ✅ | No interbreeding possible; cohabitation fine if parameters overlap |
| *C. cantonensis* Crystal + Taiwan Bee | ⚠️ | Produces Mischling offspring; plan accordingly |
| All Taiwan Bee variants together | ✅ | Offspring are Taiwan Bees; no wildtype reversion |
| *Neocaridina* + Sulawesi *Caridina* | ❌ | Incompatible water parameters; cannot share tank |
| Crystal *Caridina* + Sulawesi | ❌ | Opposite water chemistry requirements |
| *Atyopsis moluccensis* + *N. davidi* | ✅ | Compatible parameters; peaceful coexistence |

### 7.4 Why Not to Mix Neocaridina Color Morphs

- All *N. davidi* morphs are one species and will freely interbreed
- F1: color often degraded, intermediate, or unexpected
- F2 onward: wildtype reversion — colony reverts to translucent-brown
- Once mixed, **it is impossible to re-establish pure color lines** from that population
- Maintain separate tanks or tank dividers for breeding pure color lines

---

## 8. Breeding Biology & Workflows

### 8.1 General Reproductive Biology

| Stage | Description | Duration |
|---|---|---|
| **Saddle** | Undeveloped oocytes visible as yellow/green patch beneath carapace (dorsal, behind head) in mature females | Permanent in adults |
| **Mating trigger** | Female molts → releases sex pheromones → males become hyperactive ("crazy shrimp behavior") | Hours |
| **Berried** | Female carries fertilized eggs under abdomen (pleopods); continuously fans them for oxygenation | 21–40 days depending on species/temp |
| **Hatching** | *Neocaridina*, Crystal/Bee/Taiwan Bee *Caridina*, Sulawesi: miniature shrimp. Amano/filter feeders: planktonic zoea larvae | — |
| **Juvenile maturity** | Sexual maturity: 4–6 months (*Neocaridina*); 5–8 months (*Caridina* Crystal/Bee) | — |
| **Clutch size** | 10–30 eggs (*Neocaridina*); 20–40 eggs (Crystal/Bee); 20–40 (Taiwan Bee); 1000+ (Amano, mostly unviable in FW) | — |

**Larval development summary:**

| Species | Development Mode | FW Viable? |
|---|---|---|
| *Neocaridina davidi* | Direct — miniature shrimp | ✅ Yes |
| *Caridina cantonensis* Crystal/Bee/Taiwan Bee | Direct — miniature shrimp | ✅ Yes |
| Sulawesi *Caridina* spp. | Direct — miniature shrimp (biofilm-dependent) | ✅ Yes (but survival low in new tanks) |
| *Caridina multidentata* (Amano) | Indirect — zoea larvae require brackish water | ❌ No (larvae die in FW within hours) |
| *Atyopsis moluccensis* (Bamboo) | Likely indirect (suspected brackish stage) | ❌ Not achieved in home aquaria |
| *Atya gabonensis* (Vampire) | Likely indirect | ❌ Not achieved in captivity |

---

### 8.2 Neocaridina Breeding Workflow

```
╔══════════════════════════════════════════════════════════╗
║  NEOCARIDINA DAVIDI BREEDING WORKFLOW                    ║
╚══════════════════════════════════════════════════════════╝

STEP 1 │ TANK PREPARATION
───────┤
       │  ✓ Fully cycled tank (0 NH₃, 0 NO₂, <20 ppm NO₃)
       │  ✓ Dense plant cover or moss (Java, Christmas, Flame moss)
       │  ✓ Sponge filter only (no intake risk for shrimplets)
       │  ✓ Parameters: pH 7.0–7.5 | GH 7–9 | KH 3–5 | TDS 200–250 | Temp 21–24°C
       │  ✓ 2–4 weeks biofilm establishment before adding shrimp

STEP 2 │ COLONY ESTABLISHMENT
───────┤
       │  ✓ Add 10–20 shrimp (~1:2 male:female ratio)
       │  ✓ Drip acclimate over 1–2 hours
       │  ✗ Do NOT mix color morphs if maintaining pure lines

STEP 3 │ CONDITIONING
───────┤
       │  ✓ Feed varied diet: algae wafers, blanched vegetables, protein 2×/week
       │  ✓ Maintain 20–24°C (cooler = slower breeding; warmer = faster but shorter lifespan)
       │  ✓ Weekly water change: 10–20% with exactly parameter-matched water

STEP 4 │ CONFIRM BREEDING
───────┤
       │  ✓ "Crazy shrimp" event = males swimming frantically seeking females
       │  ✓ Look for saddle in females (yellow/green dorsal patch)
       │  ✓ Berried female (eggs under abdomen) = confirmed success
       │  ✓ Gestation: 21–30 days at 22°C

STEP 5 │ SHRIMPLET CARE
───────┤
       │  ✓ Do not disturb tank during egg incubation
       │  ✓ Shrimplets emerge ~1–2 mm; graze on biofilm and surfaces
       │  ✓ Feed powdered baby food / liquid shrimp food 2×/week for first 2 weeks
       │  ✗ Do not gravel-siphon aggressively — shrimplets hide in substrate
       │  ✓ Colony self-sustaining within 2–3 generations

TROUBLESHOOTING
───────────────────────────────────────────────────────────────
  Problem                  │ Likely Cause & Action
  ─────────────────────────┼─────────────────────────────────────
  No berried females       │ Temp too high/low; poor sex ratio;
                           │ immature colony; wait 3–6 months
  ─────────────────────────┼─────────────────────────────────────
  Eggs dropped early       │ Stress: parameter shock, predator,
                           │ disease; check all params immediately
  ─────────────────────────┼─────────────────────────────────────
  Poor shrimplet survival  │ Insufficient biofilm; inadequate
                           │ fine-particle food; check sponge filter
                           │ flow not pulling shrimplets in
  ─────────────────────────┼─────────────────────────────────────
  White Ring of Death      │ See Section 8.5 — mineral imbalance
  ─────────────────────────┼─────────────────────────────────────
  Colony not growing       │ Copper in water (test!); predation;
                           │ poor diet; check KH — below 2 = pH crash risk
```

---

### 8.3 Caridina (Crystal/Bee) Breeding Workflow

```
╔══════════════════════════════════════════════════════════╗
║  CARIDINA CANTONENSIS (CRYSTAL/BEE) BREEDING WORKFLOW    ║
╚══════════════════════════════════════════════════════════╝

STEP 1 │ TANK PREPARATION  ⚠️ More demanding than Neocaridina
───────┤
       │  ✓ Active buffering substrate (ADA Amazonia, Fluval Stratum, SL Aqua)
       │      └─ Leaches NH₃ initially — full 4–8 week cycle before adding shrimp
       │  ✓ RO or distilled water ONLY (0 TDS source water)
       │  ✓ Remineralize with Salty Shrimp GH+ ONLY to:
       │      GH: 4–6 | KH: 0–1 | TDS: 100–130
       │      pH will be set by substrate (target 5.8–6.5)
       │  ✓ Temperature: 21–23°C (cooling device if ambient >25°C)
       │  ✓ Sponge filter only; fine pre-filter on any other intake

STEP 2 │ WATER CHANGE PROTOCOL  ⚠️ CRITICAL
───────┤
       │  ✓ Maximum 10–15% per change
       │  ✓ Match temperature ±0.5°C before adding
       │  ✓ Drip new water in slowly (drip acclimation method)
       │  ✓ Frequency: weekly 10% or bi-weekly 15%
       │  ✗ NEVER use tap water — trace KH depletes substrate buffer

STEP 3 │ SUBSTRATE MONITORING
───────┤
       │  ✓ Test pH monthly
       │  ✓ Substrate active ~12–18 months
       │  ⚠️ pH rises above 6.8 and won't drop = substrate exhausted
       │      → Full substrate replacement required (full restart)

STEP 4 │ BREEDING CONDITIONS
───────┤
       │  ✓ Minimum 3–6 months tank establishment before shrimp
       │  ✓ Dense moss for grazing, refuge, and egg-laying
       │  ✓ Berried female gestation: 25–35 days at 22°C
       │  ✓ Avoid water changes while female is actively berried

TROUBLESHOOTING
───────────────────────────────────────────────────────────────
  Problem                  │ Likely Cause & Action
  ─────────────────────────┼─────────────────────────────────────
  pH rising above 6.8      │ Substrate exhausted OR KH source
                           │ present (rocks, shells, tap water)
                           │ → identify and remove KH source first
  ─────────────────────────┼─────────────────────────────────────
  Sudden shrimp deaths     │ Parameter shock; check TDS/pH/GH
                           │ vs. recent water change; copper contamination
  ─────────────────────────┼─────────────────────────────────────
  Eggs not hatching        │ Temp instability; fungal infection;
                           │ extreme pH deviation
  ─────────────────────────┼─────────────────────────────────────
  White Ring of Death      │ GH imbalance or sudden parameter swing
                           │ See Section 8.5
  ─────────────────────────┼─────────────────────────────────────
  Low color intensity      │ Stress; suboptimal pH; poor diet;
                           │ low-grade genetics in stock
```

---

### 8.4 Amano Shrimp Breeding Workflow (Advanced — Brackish Larval System)

```
╔══════════════════════════════════════════════════════════════════╗
║  CARIDINA MULTIDENTATA (AMANO) BREEDING WORKFLOW                 ║
║  ⚠️ Requires separate brackish rearing system.                   ║
║  Larvae die in freshwater within hours of hatching.              ║
╚══════════════════════════════════════════════════════════════════╝

PHASE 1 │ FRESHWATER ADULT TANK
────────┤
        │  ✓ Standard Amano parameters (pH 6.5–7.5, Temp 22–26°C)
        │  ✓ Well-fed colony of multiple adults (min. 5–10)
        │  ✓ Watch for berried female: greenish-yellow eggs (~1 mm)
        │      clustered under abdomen; 1000+ eggs per clutch

PHASE 2 │ BRACKISH REARING TANK PREPARATION
────────┤
        │  ✓ Separate 10–20 L tank
        │  ✓ Marine salt (NOT aquarium salt) → 30–35 ppt salinity
        │      Specific gravity: 1.022–1.026 (measure with refractometer)
        │  ✓ Temperature: 22–25°C
        │  ✓ Gentle airstone ONLY — no filter (larvae microscopic)
        │  ✓ Prepare phytoplankton (liquid culture or commercial)

PHASE 3 │ LARVAL TRANSFER
────────┤
        │  ✓ Move berried female to small isolation container with tank water
        │  ✓ Darken room; shine flashlight into container
        │      → zoea are phototactic; congregate at light source
        │  ✓ Larvae hatch as microscopic swimming specks (zoea stage)
        │  ✓ Transfer larvae to brackish tank within 30–60 min of hatching
        │  ✓ Return female to main freshwater tank

PHASE 4 │ LARVAL REARING  (25–60 days in brackish)
────────┤
        │  ✓ Feed phytoplankton daily (water: slight green tint)
        │  ✓ Water change 5–10% every 3–4 days with matched-salinity water
        │  ✓ Temperature stable ±0.5°C
        │  ✓ Larvae undergo multiple molts → metamorphose to postlarvae
        │      → Juveniles appear as tiny transparent shrimp (~2–3 mm)

PHASE 5 │ FRESHWATER TRANSITION
────────┤
        │  ✓ Reduce salinity over 5–7 days (daily small freshwater additions)
        │  ✓ Drip acclimate final transfer to 0 ppt freshwater
        │  ✓ Move to grow-out freshwater tank
        │  ✗ Do not add to fish tank until >1.5 cm

TROUBLESHOOTING
───────────────────────────────────────────────────────────────────
  Problem                  │ Likely Cause & Action
  ─────────────────────────┼──────────────────────────────────────
  All larvae die in 24h    │ Salinity too low; transfer delay
                           │ too long; verify SG with refractometer
  ─────────────────────────┼──────────────────────────────────────
  Larvae don't grow        │ Insufficient phytoplankton; check temp
  ─────────────────────────┼──────────────────────────────────────
  Juveniles die on FW      │ Transition too fast; extend to 7–10 days;
  transition               │ drip acclimate final step
```

---

### 8.5 Molting Biology & White Ring of Death (WRoD)

#### Normal Molting Cycle

- Shrimp shed their exoskeleton (ecdysis) to grow; regulated by ecdysone hormone
- Frequency: juveniles every 1–2 weeks; adults every 4–8 weeks
- Leave exuvia (shed shell) in tank for 24–48 hours — calcium source for the shrimp
- A shrimp mid-molt is extremely vulnerable; do not disturb

#### Pre-Molt Signs (Normal — NOT WRoD)
- Reduced activity; shrimp hides more
- Faint, slightly opaque ring at carapace-abdomen junction
- May stop eating 1–2 days before molt

#### White Ring of Death (WRoD)

A bright white calcified ring at the carapace-abdomen junction indicating a **failed or stuck molt**. The shrimp cannot shed the old shell and will die.

```
╔══════════════════════════════════════════════════════════╗
║  WHITE RING OF DEATH — IDENTIFICATION & RESPONSE        ║
╚══════════════════════════════════════════════════════════╝

IDENTIFICATION
  Pre-molt ring (safe):  Faint, slightly translucent line
  WRoD:                  Bright white, calcified, shrimp often immobile

PRIMARY CAUSES  (in order of frequency)
  1. GH too low   → insufficient Ca/Mg for new shell synthesis
  2. GH too high  → old shell too rigid / thick to split
  3. Sudden parameter shift → emergency premature molt triggered
  4. Large water change with mismatched TDS/GH/temp
  5. Protein/calcium deficiency in diet
  6. Copper contamination (any level is toxic to shrimp)

IMMEDIATE RESPONSE PROTOCOL
  ├─ 1. DO NOT attempt to manually remove the shell → fatal
  ├─ 2. Test: pH, GH, KH, TDS, temperature immediately
  ├─ 3. If GH low → slowly dose GH+ to bring into range (do not shock)
  ├─ 4. If cause = parameter shock → stabilize; prevent recurrence
  ├─ 5. Add small piece of cuttlebone as Ca/Mg supplement
  └─ 6. Note: most WRoD cases are fatal — prevention is the only reliable strategy

PREVENTION PROTOCOL
  ✓ Consistent weekly water changes with exactly parameter-matched water
  ✓ Maintain GH within target range at all times (never below 4 dGH)
  ✓ Feed high-protein food 2×/week (blanched shrimp, dedicated protein supplement)
  ✓ NEVER use copper-containing medications or fertilizers
  ✓ Log TDS weekly — detect parameter drift before it causes problems
  ✓ Never change more than 10–15% (Caridina) or 20% (Neocaridina) per change
  ✓ Always temperature-match new water before adding
```

---

## 9. Glossary

| Term | Definition |
|---|---|
| **Berried** | A female shrimp carrying fertilized eggs under her abdomen (pleopods). Eggs resemble a cluster of berries. The female fans them continuously for oxygenation until hatching. |
| **Saddle** | Undeveloped oocytes (eggs) visible as a yellowish/greenish patch beneath the carapace near the back of a female's head (ovary). Indicates sexual maturity. |
| **Molt / Ecdysis** | The process by which a shrimp sheds its exoskeleton to grow. Regulated by ecdysone hormone. The shed shell (exuvia) should remain in tank temporarily as a calcium source. |
| **Exuvia** | The shed exoskeleton after a successful molt. Transparent and shrimp-shaped; often mistaken for a dead shrimp. |
| **GH (General Hardness)** | Total dissolved calcium (Ca²⁺) and magnesium (Mg²⁺) ion concentration. Expressed in dGH or °dH. Critical for exoskeleton synthesis and successful molting. |
| **KH (Carbonate Hardness)** | Carbonate (CO₃²⁻) and bicarbonate (HCO₃⁻) ion concentration. Acts as a pH buffer. High KH = stable pH; zero KH = no buffer (required for soft-water Caridina). |
| **TDS (Total Dissolved Solids)** | Total concentration of all dissolved substances (minerals, salts, organics) measured in ppm. Measured with a TDS meter. Acts as a proxy for overall mineral load. |
| **RO Water** | Reverse osmosis water. Near-pure water (TDS ≈ 0) produced via semi-permeable membrane filtration. Required base for soft-water Caridina; remineralized before use. |
| **Remineralizer** | Mineral supplement added to RO/distilled water to restore target GH, KH, and trace elements. Formulas: GH/KH+ (Neocaridina), GH+ only (Caridina), Sulawesi 7.5/8.5 (Sulawesi). |
| **Active Substrate / Buffering Soil** | An aquarium substrate (e.g., ADA Amazonia, Fluval Stratum) that releases humic acids and absorbs carbonate ions, actively lowering and stabilizing pH at 5.5–6.5. Required for soft-water Caridina. Exhausts in ~12–18 months. |
| **OB (Orange Belly)** | A mutation causing vivid orange pigmentation in the abdominal segment of *N. davidi*. A distinct genetic locus combinable with any body color. |
| **OE (Orange Eye)** | A recessive mutation causing shrimp eyes to appear vivid orange instead of dark. Requires homozygosity to express. Combinable with any *N. davidi* color line. |
| **Rili** | A partial chromatophore-reduction pattern mutation in *N. davidi*: pigment absent in mid-body, retained on head and tail. Creates a tricolor effect: colored / clear / colored. |
| **CRS** | Crystal Red Shrimp (*Caridina cantonensis*). Selectively-bred red-and-white variant first isolated in Japan in 1996. |
| **CBS** | Crystal Black Shrimp (*Caridina cantonensis*). Selectively-bred black-and-white variant. |
| **Taiwan Bee** | *Caridina cantonensis* s.l. cultivar group (King Kong, Panda, Blue Bolt, etc.) developed in Taiwan; likely hybrid involving *C. mariae* Tiger Shrimp ancestry. |
| **Tibee** | Hybrid F1 offspring of *Caridina mariae* (Tiger) × *C. cantonensis* (Crystal/Bee). Unstable; used as intermediate for Taitibee production. |
| **Taitibee** | Offspring of Tibee × Taiwan Bee cross. Multi-gene hybrid with highly variable patterning. "Pinto Shrimp" is a partially stabilized Taitibee form. |
| **Mischling** | German: "mixed." F1 offspring of Crystal × Taiwan Bee cross. Phenotypically appears as Crystal but carries Taiwan Bee genes recessively; expresses Taiwan Bee traits in 25% of F2. |
| **F1** | First filial generation: direct offspring of two distinct parental lines (P generation). |
| **F2** | Second filial generation: offspring of two F1 individuals. Shows Mendelian trait segregation; critical generation for wildtype reversion in mixed *N. davidi* lines. |
| **Wildtype reversion** | The phenotypic shift of a color-line colony back toward brownish/translucent wild-type over successive generations. Caused by mixing incompatible color lines. Permanent in mixed populations. |
| **Grading (S/SS/SSS)** | Visual quality classification for Crystal Red/Black Shrimp based on white coverage and color opacity. C (lowest) → B → A → S → SS → SSS (highest = "Mosura"). |
| **Mosura** | SSS-grade Crystal Red Shrimp with near-100% white body. "Rising Sun Mosura" = white body + defined red head cap; considered the highest expression of the grading system. |
| **WRoD (White Ring of Death)** | Fatal molting complication: a calcified white ring at the carapace-abdomen junction indicating the shrimp cannot shed its old exoskeleton. Caused by GH imbalance, parameter shock, or copper contamination. |
| **Zoea** | Planktonic larval stage of certain shrimp (Amano, filter feeders). Requires brackish-to-marine salinity to develop. Distinct from the direct-development mode of Neocaridina and Caridina Crystal/Bee. |
| **Biofilm** | A microbial layer (bacteria, algae, fungi, protozoa) coating tank surfaces. Critical food source for shrimplets (especially Sulawesi species) and adult shrimp between scheduled feedings. Develops naturally in mature tanks. |
| **Oligotrophic** | Describes water bodies with extremely low nutrients. Lake Matano (Sulawesi shrimp habitat) is ultra-oligotrophic — near-zero phosphate, nitrate, and organic load. |
| **Chromatophore** | A pigment-containing cell in the shrimp exoskeleton controlling color expression via light absorption and reflection. Selective breeding targets chromatophore gain-of-function or loss-of-function mutations. |
| **Outcrossing** | Introducing genetically unrelated individuals of the same color line into a breeding colony to restore genetic diversity and prevent inbreeding depression. Recommended every 5–8 generations. |
| **Conductivity (µS/cm)** | A proxy measurement for total ion concentration in water. Correlates with TDS; used for water chemistry calibration in Sulawesi tank setups (Lake Matano wild conductivity: ~224 µS/cm). |

---

## Appendix A: Taxonomy Uncertainty Flags Summary

| Species / Complex | Flag | Status | Key Sources |
|---|---|---|---|
| *N. davidi* / *N. denticulata* / *N. heteropoda* | ⚠️ DISPUTED | WoRMS accepts *N. davidi*; Wang et al. 2024 proposes synonymy under *N. denticulata*; Shih et al. 2024 separates; Fuke 2024 disputes | Shih et al. 2024 (ZS 63:e18); Wang et al. 2024 (CIMB 46:12279); Fuke 2024 (ZS 63:e53); Cai et al. 2025 (ZS 64:e66) |
| *C. cantonensis* vs. *C. logemanni* | ⚠️ NOMENCLATURE CONFUSION | Trade uses *C. cantonensis* for both; WoRMS recognizes both as valid species | WoRMS 2024; Klotz et al. 2013 |
| *C. cf. babaulti* (Tangerine Tiger) | ❓ UNCERTAIN | Trade label; may be undescribed species; avoid mapping to African *C. babaulti* s.s. | GBIF; WoRMS |
| Taiwan Bee species identity | ❓ UNCERTAIN | Hybrid origin (*C. logemanni* × *C. mariae*) widely accepted but not formally described; some use *Caridina* sp. "Shadow" | Klotz et al. 2013; trade literature |
| *C. japonica* → *C. multidentata* | 🔄 RESOLVED SYNONYM | *C. japonica* is a junior synonym; use *C. multidentata* | WoRMS |
| "Green Jade" Neocaridina | ❓ UNCERTAIN | Attributed to *N. cf. zhangjiajiensis*; genetic identity in hobby stock unconfirmed | No peer-reviewed study available |
| *C. dennerli* wild population | ⚠️ CONSERVATION | IUCN Critically Endangered; possibly extinct in the wild (last record ~2013) | IUCN; Rintelen & Cai 2009 |

---

## Appendix B: TypeScript Data Model Recommendations

For shrimp taxonomy visualization apps, recommended schema:

```typescript
type TaxonomyStatus = "accepted" | "disputed" | "synonym" | "uncertain";
type WaterType = "hard_neutral" | "soft_acidic" | "alkaline_warm" | "neutral_flexible";
type CareLevel = 1 | 2 | 3 | 4; // 1=Beginner, 2=Intermediate, 3=Advanced, 4=Specialist
type CrossStability = "stable" | "unstable" | "stabilizing" | "impossible";

interface WaterParams {
  pH:   { min: number; max: number; optimal?: [number, number] };
  gh:   { min: number; max: number; optimal?: [number, number] }; // dGH
  kh:   { min: number; max: number; optimal?: [number, number] }; // dKH
  tds:  { min: number; max: number; optimal?: [number, number] }; // ppm
  temp: { min: number; max: number; optimal?: [number, number] }; // °C
}

interface ColorMorph {
  name: string;
  line?: string;          // "red" | "blue" | "yellow" | "black" | "white" | "rili" | "oe"
  gradeSystem?: string;   // "S/SS/SSS" for CRS/CBS
  notes?: string;
}

interface CrossEntry {
  partnerSpecies: string;
  result: CrossStability;
  notes?: string;
}

interface ShrimpSpecies {
  scientificName: string;
  authority: string;
  synonyms: { name: string; reason: string }[];
  commonNames: string[];
  taxonomyStatus: TaxonomyStatus;
  taxonomyNotes?: string;
  hybridOrigin: boolean;
  family: "Atyidae";
  genus: "Neocaridina" | "Caridina" | "Atyopsis" | "Atya";
  waterType: WaterType;
  waterParams: WaterParams;
  careLevel: CareLevel;
  sizeAdultCm: { min: number; max: number };
  lifespanYears: { min: number; max: number };
  breedingMode: "direct" | "indirect_brackish" | "unknown";
  clutchSize?: { min: number; max: number };
  gestationDays?: { min: number; max: number };
  colorMorphs?: ColorMorph[];
  iucnStatus?: string;
  conservationNotes?: string;
  crossCompatibility: CrossEntry[];
}
```

---

*Document version: 2026-06-12*
*Primary peer-reviewed sources (2020–2026):*
- *Shih et al. (2024) Zoological Studies 63:e18 — Neocaridina integrative taxonomy, Japan*
- *Wang et al. (2024) Current Issues in Molecular Biology 46(11):12279–12298 — N. davidi / denticulata complex*
- *Fuke (2024) Zoological Studies 63:e53 — Commentary on Neocaridina Japan*
- *Cai et al. (2025) Zoological Studies 64:e66 — Reply to Fuke*
- *Niade (2025) — Molecular evolutionary relationships, Caridina/Neocaridina compatibility thresholds*
- *WoRMS (World Register of Marine Species, accessed 2024)*
- *NCBI Taxonomy (accessed 2024)*
- *GBIF (Global Biodiversity Information Facility, accessed 2024)*
- *Von Rintelen & Cai (2009) Raffles Bulletin of Zoology — Sulawesi Caridina revision*
