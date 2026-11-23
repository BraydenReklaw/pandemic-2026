import { Board } from "../Board";

const cityPositions: Record<string, { x: number; y: number }> = {
    "San Francisco": { x: 90, y: 170 },
    Chicago: { x: 220, y: 145 },
    Montreal: { x: 325, y: 110 },
    Atlanta: { x: 300, y: 200 },
    "Washington D.C.": { x: 365, y: 185 },
    "New York": { x: 395, y: 130 },
    London: { x: 510, y: 120 },
    Madrid: { x: 530, y: 205 },
    Paris: { x: 585, y: 145 },
    Essen: { x: 620, y: 105 },
    Milan: { x: 645, y: 165 },
    "St. Petersburg": { x: 725, y: 95 },
    "Los Angeles": { x: 125, y: 260 },
    "Mexico City": { x: 260, y: 290 },
    Miami: { x: 365, y: 265 },
    Bogota: { x: 395, y: 365 },
    Lima: { x: 340, y: 440 },
    Santiago: { x: 365, y: 565 },
    "Buenos Aires": { x: 475, y: 530 },
    "Sao Paulo": { x: 520, y: 405 },
    Lagos: { x: 635, y: 350 },
    Kinshasa: { x: 695, y: 415 },
    Johannesburg: { x: 740, y: 510 },
    Khartoum: { x: 735, y: 350 },
    Algiers: { x: 630, y: 245 },
    Istanbul: { x: 720, y: 205 },
    Cairo: { x: 755, y: 280 },
    Baghdad: { x: 830, y: 245 },
    Riyadh: { x: 815, y: 325 },
    Karachi: { x: 905, y: 290 },
    Mumbai: { x: 910, y: 390 },
    Delhi: { x: 965, y: 305 },
    Chennai: { x: 975, y: 430 },
    Kolkata: { x: 1035, y: 350 },
    Tehran: { x: 850, y: 180 },
    Moscow: { x: 820, y: 105 },
    Beijing: { x: 1000, y: 150 },
    Seoul: { x: 1080, y: 210 },
    Tokyo: { x: 1120, y: 280 },
    Osaka: { x: 1090, y: 340 },
    Taipei: { x: 1090, y: 405 },
    Shanghai: { x: 1020, y: 235 },
    "Hong Kong": { x: 1015, y: 430 },
    "Ho Chi Minh City": { x: 1025, y: 510 },
    Manila: { x: 1110, y: 485 },
    Sydney: { x: 1095, y: 640 },
    Bangkok: { x: 945, y: 475 },
    Jakarta: { x: 970, y: 575 },
};

interface GraphCity {
    name: string;
    color: string;
    infections: number;
    researchStation: boolean;
    x: number;
    y: number;
}

interface GraphEdge {
    from: string;
    to: string;
}

function getGraphData(board: Board): { cities: GraphCity[]; edges: GraphEdge[] } {
    const cards = new Map(board.cards.map((card) => [card.name, card]));
    const cities = board.cities.map((city) => {
        const card = cards.get(city.name);
        const position = cityPositions[city.name];

        if (!card || !position) {
            throw new Error(`Cannot visualize city "${city.name}": card or position is missing`);
        }

        return {
            name: city.name,
            color: card.color,
            infections: city.infectionLevel,
            researchStation: city.researchStation,
            ...position,
        };
    });
    const edges = board.cities.flatMap((city) =>
        city.connectedCities
            .filter((neighbor) => city.name < neighbor.name)
            .map((neighbor) => ({ from: city.name, to: neighbor.name })),
    );

    return { cities, edges };
}

export function createBoardGraphHtml(board: Board): string {
    const data = JSON.stringify(getGraphData(board)).replace(/</g, "\\u003c");

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pandemic - City Connection Graph</title>
  <style>
    :root { color-scheme: dark; font-family: "Segoe UI", sans-serif; background: #101923; color: #e5edf5; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; }
    header { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 18px 26px; border-bottom: 1px solid #293847; }
    h1 { margin: 0; font-size: 20px; font-weight: 650; }
    header p { margin: 5px 0 0; color: #9eb0c0; font-size: 13px; }
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) 250px; gap: 16px; padding: 16px; }
    .graph-panel, .side-panel { border: 1px solid #293847; border-radius: 12px; background: #15212d; }
    .graph-panel { min-width: 0; overflow: hidden; }
    svg { display: block; width: 100%; height: auto; min-height: 480px; }
    .edge { stroke: #486072; stroke-width: 1.5; opacity: .7; }
    .edge-label { fill: #b7c8d6; font-size: 10px; paint-order: stroke; stroke: #15212d; stroke-width: 3px; stroke-linejoin: round; dominant-baseline: central; pointer-events: none; }
    .city { cursor: pointer; }
    .city-dot { stroke: #dce8f1; stroke-width: 1.5; }
    .city-label { fill: #d5e0e9; font-size: 11px; paint-order: stroke; stroke: #15212d; stroke-width: 3px; stroke-linejoin: round; pointer-events: none; }
    .infection-badge { fill: #f45b52; stroke: #ffd2ce; stroke-width: 1; }
    .infection-label { fill: white; font-size: 10px; font-weight: 700; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
    .station-marker { fill: #f5d76e; stroke: #fff1b3; stroke-width: 1; }
    .station-label { fill: #26313b; font-size: 8px; font-weight: 800; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
    .city.selected .city-dot { stroke: #fff; stroke-width: 3; }
    .city.searched .city-dot { stroke: #f5d76e; stroke-width: 4; }
    .side-panel { padding: 18px; }
    .side-panel h2 { margin: 0 0 14px; font-size: 15px; }
    .search { width: 100%; margin-bottom: 16px; border: 1px solid #3a4d5e; border-radius: 7px; background: #0f1922; color: #e5edf5; padding: 9px 10px; font: inherit; }
    .city-name { font-size: 19px; font-weight: 650; }
    .disease { display: flex; align-items: center; gap: 8px; margin: 10px 0 22px; color: #aebdca; font-size: 13px; }
    .swatch { width: 11px; height: 11px; border-radius: 50%; border: 1px solid #dce8f1; }
    .infection-count { margin: 4px 0 13px; color: #aebdca; font-size: 13px; }
    .infection-count strong { display: block; color: #fff; font-size: 32px; }
    .controls { display: flex; gap: 8px; }
    button { border: 1px solid #43586b; border-radius: 7px; background: #203140; color: #e5edf5; padding: 8px 13px; font: inherit; cursor: pointer; }
    button:hover { background: #2a4052; }
    button:disabled { opacity: .4; cursor: default; }
    .legend { margin-top: 24px; padding-top: 16px; border-top: 1px solid #293847; color: #9eb0c0; font-size: 12px; line-height: 1.6; }
    .legend strong { color: #e5edf5; }
    .summary { color: #9eb0c0; font-size: 12px; white-space: nowrap; }
    @media (max-width: 850px) { .layout { grid-template-columns: 1fr; } .side-panel { order: -1; } svg { min-height: 0; } }
    @media (max-width: 560px) { header { align-items: flex-start; flex-direction: column; padding: 16px; } .layout { padding: 10px; } .summary { white-space: normal; } }
  </style>
</head>
<body>
  <header>
    <div><h1>Pandemic City Connections</h1><p>Board adjacency graph with infection cubes overlaid</p></div>
    <div class="summary" id="summary"></div>
  </header>
  <main class="layout">
    <section class="graph-panel" aria-label="City connection graph">
      <svg id="graph" viewBox="0 0 1200 700" role="img" aria-label="Pandemic city graph"></svg>
    </section>
    <aside class="side-panel">
      <h2>City infections</h2>
      <input id="search" class="search" type="search" placeholder="Find a city..." aria-label="Find a city">
      <div id="selection" aria-live="polite"></div>
      <div class="legend"><strong>How to read</strong><br>Circle color = city disease color<br>Red badge = infection cube count<br>Gold R = research station<br>Lines = direct city connections<br><br>Click a city to inspect it. Use the controls to adjust the displayed infection count.</div>
    </aside>
  </main>
  <script>
    const data = ${data};
    const svg = document.getElementById("graph");
    const selection = document.getElementById("selection");
    const search = document.getElementById("search");
    const summary = document.getElementById("summary");
    const cityByName = new Map(data.cities.map((city) => [city.name, city]));
    let selected = data.cities[0];
    const ns = "http://www.w3.org/2000/svg";

    function element(tag, attributes = {}) {
      const node = document.createElementNS(ns, tag);
      for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
      return node;
    }

    function addWrappedEdgeLabel(x1, y1, x2, y2, cityName) {
      const boundaryX = x1 < 0 || x2 < 0 ? 0 : 1200;
      const y = y1 + (y2 - y1) * ((boundaryX - x1) / (x2 - x1));
      const left = boundaryX === 0;
      const label = element("text", {
        class: "edge-label",
        x: left ? 8 : 1192,
        y: y - 7,
        "text-anchor": left ? "start" : "end",
      });
      label.textContent = cityName;
      edges.append(label);
    }

    const edges = element("g");
    for (const edge of data.edges) {
      const from = cityByName.get(edge.from);
      const to = cityByName.get(edge.to);
      const mapWidth = 1200;
      if (Math.abs(from.x - to.x) > mapWidth / 2) {
        const destinationShift = from.x < to.x ? -mapWidth : mapWidth;
        const copyShift = -destinationShift;
        const shiftedDestinationX = to.x + destinationShift;
        const shiftedSourceX = from.x + copyShift;
        edges.append(element("line", {
          class: "edge",
          x1: from.x,
          y1: from.y,
          x2: shiftedDestinationX,
          y2: to.y,
        }));
        edges.append(element("line", {
          class: "edge",
          x1: shiftedSourceX,
          y1: from.y,
          x2: to.x,
          y2: to.y,
        }));
        addWrappedEdgeLabel(from.x, from.y, shiftedDestinationX, to.y, to.name);
        addWrappedEdgeLabel(shiftedSourceX, from.y, to.x, to.y, from.name);
      } else {
        edges.append(element("line", { class: "edge", x1: from.x, y1: from.y, x2: to.x, y2: to.y }));
      }
    }
    svg.append(edges);

    function drawCity(city) {
      const group = element("g", { class: "city", "data-city": city.name });
      group.append(element("circle", { class: "city-dot", cx: city.x, cy: city.y, r: 8, fill: city.color }));
      if (city.researchStation) {
        group.append(element("rect", {
          class: "station-marker",
          x: city.x + 3,
          y: city.y - 16,
          width: 12,
          height: 12,
          rx: 2,
        }));
        const stationLabel = element("text", {
          class: "station-label",
          x: city.x + 9,
          y: city.y - 10,
        });
        stationLabel.textContent = "R";
        group.append(stationLabel);
      }
      const label = element("text", { class: "city-label", x: city.x + 11, y: city.y + 4 });
      label.textContent = city.name;
      group.append(label);
      if (city.infections > 0) {
        const radius = city.infections >= 10 ? 11 : 9;
        group.append(element("circle", { class: "infection-badge", cx: city.x - 7, cy: city.y - 8, r: radius }));
        const count = element("text", { class: "infection-label", x: city.x - 7, y: city.y - 8 });
        count.textContent = String(city.infections);
        group.append(count);
      }
      group.addEventListener("click", () => { selected = city; renderSelection(); });
      svg.append(group);
    }

    function renderGraph() {
      svg.querySelectorAll(".city").forEach((node) => node.remove());
      data.cities.forEach(drawCity);
      summary.textContent = data.cities.length + " cities · " + data.edges.length + " connections · " +
        data.cities.reduce((total, city) => total + city.infections, 0) + " infection cubes";
      renderSelection();
    }

    function renderSelection() {
      svg.querySelectorAll(".city").forEach((node) => {
        node.classList.toggle("selected", node.getAttribute("data-city") === selected.name);
        node.classList.toggle("searched", search.value.trim().toLowerCase() === selected.name.toLowerCase());
      });
      selection.replaceChildren();
      const name = document.createElement("div");
      name.className = "city-name";
      name.textContent = selected.name;
      const disease = document.createElement("div");
      disease.className = "disease";
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.backgroundColor = selected.color;
      disease.append(swatch, document.createTextNode(selected.color + " disease"));
      const count = document.createElement("div");
      count.className = "infection-count";
      const countLabel = document.createElement("span");
      countLabel.textContent = "Infection cubes";
      const countValue = document.createElement("strong");
      countValue.textContent = String(selected.infections);
      count.append(countLabel, countValue);
      const stationStatus = document.createElement("div");
      stationStatus.className = "disease";
      stationStatus.textContent = selected.researchStation ? "Research station present" : "No research station";
      const controls = document.createElement("div");
      controls.className = "controls";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "− Remove";
      remove.disabled = selected.infections === 0;
      remove.addEventListener("click", () => updateInfections(-1));
      const add = document.createElement("button");
      add.type = "button";
      add.textContent = "+ Add";
      add.addEventListener("click", () => updateInfections(1));
      controls.append(remove, add);
      selection.append(name, disease, stationStatus, count, controls);
    }

    function updateInfections(amount) {
      selected.infections = Math.max(0, selected.infections + amount);
      renderGraph();
    }

    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      const match = data.cities.find((city) => city.name.toLowerCase().includes(query));
      if (match && query) selected = match;
      renderSelection();
    });
    renderGraph();
  </script>
</body>
</html>
`;
}
