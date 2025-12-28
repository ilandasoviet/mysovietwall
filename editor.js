let zones = [];
let editMode = true;

// 6 colonnes x 5 lignes = 30 zones visibles, non superposées
const COLS = 6;
const ROWS = 5;

for (let i = 1; i <= 30; i++) {
  const r = Math.floor((i - 1) / COLS);
  const c = (i - 1) % COLS;

  zones.push({
    id: i,
    top: 3 + r * 18,     // espacement vertical
    left: 2 + c * 16,    // espacement horizontal
    width: 14,
    height: 16
  });
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function render() {
  const z = document.getElementById("zones");
  z.innerHTML = "";

  zones.forEach(zone => {
    const a = document.createElement("a");
    a.className = "zone";
    a.href = `affiche-${pad2(zone.id)}.html`;
    a.dataset.id = zone.id;

    a.style.top = zone.top + "%";
    a.style.left = zone.left + "%";
    a.style.width = zone.width + "%";
    a.style.height = zone.height + "%";

    a.innerHTML = `<span>${pad2(zone.id)}</span>`;

    // Déplacement (mode édition)
    a.onmousedown = (e) => {
      if (!editMode) return;           // en mode normal, on clique pour ouvrir la fiche
      e.preventDefault();

      let sx = e.clientX, sy = e.clientY;
      const startTop = zone.top;
      const startLeft = zone.left;

      const container = document.getElementById("container").getBoundingClientRect();

      document.onmousemove = (m) => {
        const dx = (m.clientX - sx) / container.width * 100;
        const dy = (m.clientY - sy) / container.height * 100;

        zone.left = Math.max(0, Math.min(100 - zone.width, startLeft + dx));
        zone.top  = Math.max(0, Math.min(100 - zone.height, startTop + dy));

        render();
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };

    // En mode normal, empêcher le drag et laisser le clic ouvrir
    if (!editMode) {
      a.style.borderStyle = "solid";
    }

    z.appendChild(a);
  });
}

function toggleEdit() {
  editMode = !editMode;
  render();
}

function toggleOverlay() {
  const o = document.getElementById("overlay");
  o.style.display = (o.style.display === "none" || !o.style.display) ? "block" : "none";
}

function exportZones() {
  const out = document.getElementById("output");
  out.style.display = "block";

  out.value = zones.map(z =>
    `<a class="zone" href="affiche-${pad2(z.id)}.html" style="top:${z.top.toFixed(3)}%;left:${z.left.toFixed(3)}%;width:${z.width.toFixed(3)}%;height:${z.height.toFixed(3)}%;"><span class="badge">${pad2(z.id)}</span></a>`
  ).join("\n");

  out.focus();
  out.select();
}

window.toggleEdit = toggleEdit;
window.toggleOverlay = toggleOverlay;
window.exportZones = exportZones;

render();
