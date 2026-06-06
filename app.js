const strains = [
  {
    id: "wild",
    name: "Wildform",
    family: "Natural",
    pattern: "Mottled",
    line: "Base",
    level: "Beginner",
    popularity: 2,
    stable: true,
    colors: ["#6d5945", "#b7a27d", "#38483d"],
    summary: "Brownish to translucent with mottling. Useful as a reference because mixed color lines often drift back toward this look.",
    breeding: "Keep show colonies separate. In mixed-color tanks, wild-type offspring commonly reappear over generations.",
    tags: ["wild type", "robust", "reference"],
  },
  {
    id: "red-cherry",
    name: "Red Cherry",
    family: "Red",
    pattern: "Solid",
    line: "Red",
    level: "Beginner",
    popularity: 5,
    stable: true,
    colors: ["#d81f2f", "#f26866", "#95131f"],
    summary: "The classic starter shrimp: red coloration, often with clearer patches, and very forgiving for new keepers.",
    breeding: "The red line responds well to selection. Remove pale animals if you want the colony to become more intense.",
    tags: ["Cherry", "classic", "easy"],
  },
  {
    id: "red-sakura",
    name: "Red Sakura",
    family: "Red",
    pattern: "Solid",
    line: "Red",
    level: "Beginner",
    popularity: 5,
    stable: true,
    colors: ["#eb2333", "#ff7a73", "#a9091b"],
    summary: "More densely colored than basic Cherry shrimp and very common in the trade.",
    breeding: "Sakura is a strong balance of price, color, and stability. Do not mix it with other color lines if offspring should stay red.",
    tags: ["Sakura", "popular", "good coverage"],
  },
  {
    id: "fire-red",
    name: "Fire Red",
    family: "Red",
    pattern: "Solid",
    line: "Red",
    level: "Beginner",
    popularity: 5,
    stable: true,
    colors: ["#c90019", "#ff332d", "#6b0010"],
    summary: "A stronger, more opaque red. Often sold as a higher red grade than Cherry or Sakura.",
    breeding: "Regular selection keeps the color dense. Dark substrate makes the animals look more saturated.",
    tags: ["Fire", "opaque", "great starter"],
  },
  {
    id: "painted-fire-red",
    name: "Painted Fire Red",
    family: "Red",
    pattern: "Solid",
    line: "Red",
    level: "Intermediate",
    popularity: 4,
    stable: true,
    colors: ["#ab0015", "#e51023", "#4e000b"],
    summary: "A very high red grade with strong coverage across the shell, legs, and body.",
    breeding: "High grades benefit from strict selection. Cull translucent patches and weak leg coloration consistently.",
    tags: ["high grade", "colored legs", "selection"],
  },
  {
    id: "bloody-mary",
    name: "Bloody Mary",
    family: "Red",
    pattern: "Translucent",
    line: "Mary",
    level: "Intermediate",
    popularity: 4,
    stable: true,
    colors: ["#8f0018", "#cf1233", "#ff697d"],
    summary: "A deep wine-red look created by colored tissue under a more translucent shell.",
    breeding: "Not every dark red shrimp is Bloody Mary. For true lines, check origin and offspring stability.",
    tags: ["dark red", "translucent", "line-dependent"],
  },
  {
    id: "red-rili",
    name: "Red Rili",
    family: "Red",
    pattern: "Rili",
    line: "Rili",
    level: "Beginner",
    popularity: 4,
    stable: true,
    colors: ["#e6222d", "#f9f2e6", "#bd101d"],
    summary: "Red head and tail sections with a pale to transparent middle body.",
    breeding: "The Rili pattern varies. Breed from shrimp with a clear middle and clean red end sections.",
    tags: ["Rili", "contrast", "pattern selection"],
  },
  {
    id: "red-blue-rili",
    name: "Red Blue Rili",
    family: "Red",
    pattern: "Rili",
    line: "Rili",
    level: "Collector",
    popularity: 3,
    stable: false,
    colors: ["#d91f32", "#83c4db", "#f5fbff"],
    summary: "A Rili variant with red head and tail sections plus a blue-tinted middle body.",
    breeding: "Attractive but often variable. Best kept as its own project line instead of mixing with Blue Jelly.",
    tags: ["Rili", "blue body", "project line"],
  },
  {
    id: "yellow-fire",
    name: "Yellow Fire",
    family: "Yellow",
    pattern: "Solid",
    line: "Yellow",
    level: "Beginner",
    popularity: 5,
    stable: true,
    colors: ["#f2c230", "#ffe36d", "#a97900"],
    summary: "A bright yellow variety, very common in the trade and excellent for colorful species tanks.",
    breeding: "Yellow lines look intense on dark substrate. Remove pale or greenish animals from the breeding group.",
    tags: ["Yellow", "bright", "stable"],
  },
  {
    id: "yellow-neon",
    name: "Yellow Neon",
    family: "Yellow",
    pattern: "Back stripe",
    line: "Yellow",
    level: "Beginner",
    popularity: 4,
    stable: true,
    colors: ["#ffd526", "#fff07b", "#c49300"],
    summary: "A yellow line with a pale dorsal stripe, often sold as Goldenback or Neon.",
    breeding: "Select for the dorsal stripe if it is part of your breeding goal. Without selection it becomes less consistent.",
    tags: ["Goldenback", "back stripe", "bright"],
  },
  {
    id: "yellow-rili",
    name: "Yellow Rili",
    family: "Yellow",
    pattern: "Rili",
    line: "Yellow",
    level: "Intermediate",
    popularity: 3,
    stable: false,
    colors: ["#f2c735", "#fff8df", "#ce9900"],
    summary: "A yellow Rili pattern with a transparent middle section. Less common than Red or Orange Rili.",
    breeding: "The pattern needs selection over several generations. Stabilize it as a separate line.",
    tags: ["Rili", "yellow", "less common"],
  },
  {
    id: "orange-sakura",
    name: "Orange Sakura",
    family: "Orange",
    pattern: "Solid",
    line: "Orange",
    level: "Beginner",
    popularity: 5,
    stable: true,
    colors: ["#f06f1d", "#ffae48", "#ad3f00"],
    summary: "Rich orange animals, often also sold as Sunkist or Orange Fire.",
    breeding: "Avoid mixing orange lines with red lines if you want to preserve a clean orange tone.",
    tags: ["Sunkist", "Orange Fire", "warm"],
  },
  {
    id: "pumpkin-orange",
    name: "Pumpkin Orange",
    family: "Orange",
    pattern: "Solid",
    line: "Orange",
    level: "Intermediate",
    popularity: 3,
    stable: true,
    colors: ["#d95811", "#ff8c31", "#7a2d05"],
    summary: "A darker pumpkin-orange tone with strong coverage.",
    breeding: "Watch for even color. Separate animals that are too yellow or too red if you want a tight color range.",
    tags: ["Pumpkin", "rich", "selected"],
  },
  {
    id: "orange-rili",
    name: "Orange Rili",
    family: "Orange",
    pattern: "Rili",
    line: "Orange",
    level: "Beginner",
    popularity: 4,
    stable: true,
    colors: ["#f47b20", "#fff2df", "#c94a0a"],
    summary: "Orange head and tail sections with a clear middle body. A common Rili strain for colorful aquascapes.",
    breeding: "A clean split between orange and transparent areas is the goal. Partly solid animals weaken the pattern.",
    tags: ["Rili", "Sunkist", "high contrast"],
  },
  {
    id: "green-jade",
    name: "Green Jade",
    family: "Green",
    pattern: "Solid",
    line: "Green",
    level: "Intermediate",
    popularity: 5,
    stable: false,
    colors: ["#15945c", "#4ec47e", "#0d593d"],
    summary: "Ranges from olive to emerald green. Very popular, but often less uniform than red, yellow, or blue lines.",
    breeding: "Green can vary strongly in quality and offspring. Good starter stock and consistent selection are worth it.",
    tags: ["Jade", "Emerald", "variable"],
  },
  {
    id: "green-rili",
    name: "Green Rili",
    family: "Green",
    pattern: "Rili",
    line: "Green",
    level: "Collector",
    popularity: 2,
    stable: false,
    colors: ["#168a55", "#eef9e9", "#3fbf78"],
    summary: "A green Rili variant, much rarer and usually more project-like than Red or Orange Rili.",
    breeding: "Stabilize it patiently. Offspring can vary widely between green, clear, and wild-type looks.",
    tags: ["Rili", "rare", "project"],
  },
  {
    id: "blue-dream",
    name: "Blue Dream",
    family: "Blue",
    pattern: "Solid",
    line: "Blue/Black",
    level: "Beginner",
    popularity: 5,
    stable: true,
    colors: ["#0d4f9e", "#2e87d1", "#061d4f"],
    summary: "A strong blue variety and one of the most popular modern Neocaridina strains.",
    breeding: "Do not casually cross Blue Dream with Blue Velvet or Blue Jelly. Trade names are sometimes used loosely.",
    tags: ["Blue Dream", "high demand", "dark substrate"],
  },
  {
    id: "blue-velvet",
    name: "Blue Velvet",
    family: "Blue",
    pattern: "Solid",
    line: "Blue/Rili",
    level: "Beginner",
    popularity: 4,
    stable: true,
    colors: ["#328fd4", "#78c7ef", "#145a9d"],
    summary: "A light to medium blue strain with a clean, bright aquarium presence.",
    breeding: "Blue Velvet and Blue Dream can be different lines depending on origin. Keep them separate for stable color.",
    tags: ["Velvet", "light blue", "popular"],
  },
  {
    id: "blue-jelly",
    name: "Blue Jelly",
    family: "Blue",
    pattern: "Translucent",
    line: "Blue/Rili",
    level: "Beginner",
    popularity: 4,
    stable: true,
    colors: ["#79c5e8", "#d9f6ff", "#2c8bbf"],
    summary: "A translucent pale blue, often connected to Rili-related lines.",
    breeding: "Reddish markings can appear. Breed only suitable animals if you want a clear Jelly blue.",
    tags: ["Jelly", "translucent", "bright"],
  },
  {
    id: "blue-diamond",
    name: "Blue Diamond",
    family: "Blue",
    pattern: "Solid",
    line: "Blue/Black",
    level: "Intermediate",
    popularity: 4,
    stable: true,
    colors: ["#12316f", "#2456a8", "#081733"],
    summary: "A dark, deep-blue appearance, often associated with black/blue lineages.",
    breeding: "Select for even dark coverage and separate very pale offspring.",
    tags: ["Diamond", "dark blue", "selected"],
  },
  {
    id: "blue-carbon-rili",
    name: "Blue Carbon Rili",
    family: "Blue",
    pattern: "Rili",
    line: "Blue/Black",
    level: "Intermediate",
    popularity: 4,
    stable: false,
    colors: ["#1d2630", "#62a8d7", "#e7f7ff"],
    summary: "Dark head and tail sections with a blue or transparent body area.",
    breeding: "The balance of black, blue, and clear areas varies. Good line management matters more than the name.",
    tags: ["Carbon", "Rili", "high contrast"],
  },
  {
    id: "oe-blue-dream",
    name: "OE Blue Dream",
    family: "Blue",
    pattern: "Solid",
    line: "Blue/Black",
    level: "Collector",
    popularity: 3,
    stable: false,
    colors: ["#0d448e", "#f09b2d", "#071c44"],
    summary: "Blue Dream animals with orange eyes. Eye-catching, but less common than standard Blue Dream.",
    breeding: "Maintain Orange Eyes separately. When buying, check whether eye color and body color breed true.",
    tags: ["Orange Eyes", "collector", "rare"],
  },
  {
    id: "black-rose",
    name: "Black Rose",
    family: "Black",
    pattern: "Solid",
    line: "Blue/Black",
    level: "Beginner",
    popularity: 5,
    stable: true,
    colors: ["#111315", "#36393b", "#000000"],
    summary: "Very dark to black Neocaridina, popular in bright planted tanks.",
    breeding: "Brownish or bluish offspring can appear. Select for dense shell color if you want a rich black colony.",
    tags: ["Black", "high contrast", "popular"],
  },
  {
    id: "black-sakura",
    name: "Black Sakura",
    family: "Black",
    pattern: "Solid",
    line: "Blue/Black",
    level: "Intermediate",
    popularity: 4,
    stable: true,
    colors: ["#1c1f20", "#45494a", "#090a0a"],
    summary: "A dark Sakura/Fire-style interpretation with high coverage, often close to Black Rose depending on seller.",
    breeding: "Names overlap. Judge the line rather than the trade label and remove pale animals.",
    tags: ["Sakura", "dark", "opaque"],
  },
  {
    id: "chocolate",
    name: "Chocolate",
    family: "Brown",
    pattern: "Solid",
    line: "Blue/Black",
    level: "Beginner",
    popularity: 4,
    stable: true,
    colors: ["#5b2f20", "#9b6445", "#2a140e"],
    summary: "A warm brown to chocolate-colored variety. Less flashy, but excellent in natural-style layouts.",
    breeding: "Do not confuse it with wild type. Good Chocolate lines are clearly more even and richer brown.",
    tags: ["Chocolate", "natural", "warm"],
  },
  {
    id: "snowball",
    name: "Snowball / White Pearl",
    family: "White",
    pattern: "Translucent",
    line: "White",
    level: "Beginner",
    popularity: 3,
    stable: true,
    colors: ["#f3f7f4", "#ffffff", "#c8d7d3"],
    summary: "White to milky-translucent Neocaridina. Popular in the hobby, though not always treated cleanly as davidi in taxonomy.",
    breeding: "For strict davidi collections, verify origin. In practice it is often kept alongside davidi color strains as a Neo variety.",
    tags: ["White Pearl", "Snowball", "verify origin"],
  },
];

const families = ["All", ...new Set(strains.map((strain) => strain.family))];
const patterns = [...new Set(strains.map((strain) => strain.pattern))].sort();
const state = {
  family: "All",
  pattern: "all",
  level: "all",
  query: "",
  popularOnly: false,
  stableOnly: false,
  catalogView: false,
};

const familyFilters = document.querySelector("#familyFilters");
const patternFilter = document.querySelector("#patternFilter");
const levelFilter = document.querySelector("#levelFilter");
const search = document.querySelector("#search");
const popularOnly = document.querySelector("#popularOnly");
const stableOnly = document.querySelector("#stableOnly");
const strainGrid = document.querySelector("#strainGrid");
const orbitSystem = document.querySelector("#orbitSystem");
const visibleCount = document.querySelector("#visibleCount");
const popularCount = document.querySelector("#popularCount");
const riliCount = document.querySelector("#riliCount");
const mapViewBtn = document.querySelector("#mapViewBtn");
const lineViewBtn = document.querySelector("#lineViewBtn");
const dialog = document.querySelector("#strainDialog");
const familyColors = {
  Natural: "#b7a27d",
  Red: "#e51023",
  Yellow: "#ffd526",
  Orange: "#f47b20",
  Green: "#4ec47e",
  Blue: "#328fd4",
  Black: "#6b7072",
  Brown: "#9b6445",
  White: "#f3f7f4",
};

function shrimpSvg(strain) {
  const isRili = strain.pattern === "Rili";
  const isTranslucent = strain.pattern === "Translucent";
  const style = `--shrimp-a:${strain.colors[0]};--shrimp-b:${strain.colors[1]};`;
  const clearBody = isRili || isTranslucent;
  return `
    <svg class="shrimp-visual" style="${style}" viewBox="0 0 320 190" role="img" aria-label="${strain.name} shrimp illustration">
      <path class="tail" d="M252 87c25-27 44-35 58-26-2 20-13 35-34 46 20 10 31 25 33 44-15 8-35-2-58-30Z"/>
      <path class="body ${clearBody ? "clear" : ""}" d="M43 103c18-53 78-78 145-57 48 15 78 49 75 80-2 24-32 35-77 30-58-6-111-23-143-53Z"/>
      <path class="head" d="M28 103c8-27 28-45 58-54 13 18 15 44 4 71-21 4-42-2-62-17Z"/>
      <path class="stripe" d="M113 54c-10 24-12 53-5 86M151 48c-9 28-9 61 0 98M190 60c-4 25-2 52 8 80"/>
      <path d="M68 80c31-35 69-48 115-39" fill="none" stroke="rgba(255,255,255,.72)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="54" cy="85" r="6" fill="${strain.id.includes("oe-") ? "#f29a2d" : "#141817"}"/>
      <path d="M41 84C20 64 8 46 5 29M43 90C23 83 9 74 1 61" fill="none" stroke="rgba(20,24,23,.58)" stroke-width="4" stroke-linecap="round"/>
      <path d="M98 145c-15 17-25 30-31 41M139 151c-11 14-17 25-19 34M181 153c-7 12-10 22-10 31M222 145c3 12 8 22 17 32" fill="none" stroke="rgba(20,24,23,.45)" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `;
}

function toneStyle(strain) {
  return `--tone-soft:${strain.colors[1]}33;--tone-bg:${strain.colors[0]}22;`;
}

function renderFilters() {
  familyFilters.innerHTML = families
    .map(
      (family) => `
        <button class="filter-chip ${state.family === family ? "active" : ""}" type="button" data-family="${family}">
          ${family}
        </button>
      `,
    )
    .join("");
}

function filteredStrains() {
  const query = state.query.trim().toLowerCase();
  return strains.filter((strain) => {
    const haystack = [strain.name, strain.family, strain.pattern, strain.line, strain.summary, ...strain.tags]
      .join(" ")
      .toLowerCase();
    return (
      (state.family === "All" || strain.family === state.family) &&
      (state.pattern === "all" || strain.pattern === state.pattern) &&
      (state.level === "all" || strain.level === state.level) &&
      (!state.popularOnly || strain.popularity >= 4) &&
      (!state.stableOnly || strain.stable) &&
      (!query || haystack.includes(query))
    );
  });
}

function cardTemplate(strain) {
  return `
    <button class="strain-card" type="button" data-id="${strain.id}" style="${toneStyle(strain)}">
      <div class="card-art">${shrimpSvg(strain)}</div>
      <div class="card-copy">
        <div class="card-topline">
          <span class="family-pill">${strain.family}</span>
          ${strain.popularity >= 4 ? '<span class="popular-mark">popular</span>' : ""}
        </div>
        <h3>${strain.name}</h3>
        <p>${strain.summary}</p>
        <div class="meta-list">
          <span class="tag">${strain.pattern}</span>
          <span class="tag">${strain.level}</span>
          <span class="tag">${strain.stable ? "stable" : "variable"}</span>
        </div>
      </div>
    </button>
  `;
}

function renderGrid() {
  const visible = filteredStrains();
  strainGrid.innerHTML = visible.length
    ? visible.map(cardTemplate).join("")
    : '<div class="empty-state">No strain matches the current filters.</div>';
  visibleCount.textContent = visible.length;
  popularCount.textContent = visible.filter((strain) => strain.popularity >= 4).length;
  riliCount.textContent = visible.filter((strain) => strain.pattern === "Rili").length;
}

function renderLineageMap() {
  return renderOrbitSystem();
  const visible = filteredStrains();
  const lines = [...new Set(visible.map((strain) => strain.line))];
  lineageMap.innerHTML = lines.length
    ? lines
    .map((line) => {
      const lineStrains = visible.filter((strain) => strain.line === line);
      return `
        <div class="line-row">
          <div class="line-label">${line}</div>
          <div class="node-track">
            ${lineStrains
              .map(
                (strain) => `
                  <button class="node" type="button" data-id="${strain.id}" style="border-left: 8px solid ${strain.colors[0]}">
                    <strong>${strain.name}</strong>
                    <span>${strain.pattern} · ${strain.stable ? "stable" : "variable"}</span>
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
      `;
    })
    .join("")
    : '<div class="empty-state">No line matches the current filters.</div>';
}

function renderOrbitSystem() {
  const visible = filteredStrains();
  if (!visible.length) {
    orbitSystem.innerHTML = '<div class="empty-state">No strain matches the current filters.</div>';
    return;
  }

  const stageSize = Math.min(Math.max(orbitSystem.clientWidth || 950, 650), 950);
  const orbitFamilies = families.filter(
    (family) => family !== "All" && visible.some((strain) => strain.family === family),
  );
  const maxRadius = stageSize / 2 - 72;
  const minRadius = 108;
  const radiusStep = orbitFamilies.length > 1 ? (maxRadius - minRadius) / (orbitFamilies.length - 1) : 0;

  const rings = orbitFamilies
    .map((family, index) => {
      const radius = Math.round(minRadius + radiusStep * index);
      return `
        <div
          class="orbit-ring"
          data-family="${family}"
          style="--radius:${radius}px;--ring-color:${familyColors[family] || "#d9e1dc"}"
        ></div>
      `;
    })
    .join("");

  const planets = orbitFamilies
    .map((family, familyIndex) => {
      const familyStrains = visible.filter((strain) => strain.family === family);
      const radius = Math.round(minRadius + radiusStep * familyIndex);
      return familyStrains
        .map((strain, strainIndex) => {
          const angle = (360 / familyStrains.length) * strainIndex + familyIndex * 21;
          const size = 23 + strain.popularity * 4;
          const duration = 56 + familyIndex * 11 + familyStrains.length * 2;
          const delay = -1 * familyIndex * 5;
          return `
            <div
              class="planet-orbit"
              style="--angle:${angle}deg;--radius:${radius}px;--duration:${duration}s;--delay:${delay}s"
            >
              <button
                class="planet"
                type="button"
                data-id="${strain.id}"
                aria-label="Open ${strain.name} details"
                title="${strain.name}"
                style="--planet-a:${strain.colors[0]};--planet-b:${strain.colors[1]};--size:${size}px"
              >
                <span class="planet-name">${strain.name}</span>
              </button>
            </div>
          `;
        })
        .join("");
    })
    .join("");

  const legend = orbitFamilies
    .map(
      (family) => `
        <span class="legend-chip">
          <span class="legend-dot" style="--legend-color:${familyColors[family] || "#d9e1dc"}"></span>
          ${family}
        </span>
      `,
    )
    .join("");

  orbitSystem.innerHTML = `
    <div class="orbit-stage">
      ${rings}
      <div class="system-sun" style="${toneStyle(strains[0])}">
        ${shrimpSvg(strains[0])}
      </div>
      <div class="system-title">Neocaridina davidi</div>
      ${planets}
      <div class="orbit-legend" aria-label="Color family legend">${legend}</div>
    </div>
  `;
}

function openDetails(id) {
  const strain = strains.find((item) => item.id === id);
  if (!strain) return;

  document.querySelector("#dialogArt").style.cssText = toneStyle(strain);
  document.querySelector("#dialogArt").innerHTML = shrimpSvg(strain);
  document.querySelector("#dialogFamily").textContent = `${strain.family} / ${strain.line}`;
  document.querySelector("#dialogTitle").textContent = strain.name;
  document.querySelector("#dialogSummary").textContent = strain.summary;
  document.querySelector("#dialogPattern").textContent = strain.pattern;
  document.querySelector("#dialogLevel").textContent = strain.level;
  document.querySelector("#dialogStability").textContent = strain.stable ? "high" : "variable";
  document.querySelector("#dialogPopularity").textContent = `${strain.popularity}/5`;
  document.querySelector("#dialogBreeding").textContent = strain.breeding;
  document.querySelector("#dialogTags").innerHTML = strain.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function refresh() {
  renderOrbitSystem();
  renderGrid();
  orbitSystem.style.display = state.catalogView ? "none" : "grid";
  strainGrid.style.display = state.catalogView ? "grid" : "none";
  mapViewBtn.classList.toggle("active", !state.catalogView);
  lineViewBtn.classList.toggle("active", state.catalogView);
}

renderFilters();
patternFilter.insertAdjacentHTML(
  "beforeend",
  patterns.map((pattern) => `<option value="${pattern}">${pattern}</option>`).join(""),
);
renderOrbitSystem();
refresh();

familyFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-family]");
  if (!button) return;
  state.family = button.dataset.family;
  renderFilters();
  refresh();
});

patternFilter.addEventListener("change", (event) => {
  state.pattern = event.target.value;
  refresh();
});

levelFilter.addEventListener("change", (event) => {
  state.level = event.target.value;
  refresh();
});

search.addEventListener("input", (event) => {
  state.query = event.target.value;
  refresh();
});

popularOnly.addEventListener("change", (event) => {
  state.popularOnly = event.target.checked;
  refresh();
});

stableOnly.addEventListener("change", (event) => {
  state.stableOnly = event.target.checked;
  refresh();
});

mapViewBtn.addEventListener("click", () => {
  state.catalogView = false;
  refresh();
});

lineViewBtn.addEventListener("click", () => {
  state.catalogView = true;
  refresh();
});

strainGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-id]");
  if (card) openDetails(card.dataset.id);
});

orbitSystem.addEventListener("click", (event) => {
  const planet = event.target.closest("[data-id]");
  if (planet) openDetails(planet.dataset.id);
});

window.addEventListener("resize", () => {
  window.clearTimeout(window.orbitResizeTimer);
  window.orbitResizeTimer = window.setTimeout(renderOrbitSystem, 120);
});

document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
