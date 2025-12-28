let zones = [];
let editMode = true;

const COLS = 6;
const ROWS = 5;

// Initialisation en grille (30 zones visibles)
for (let i = 1; i <= 30; i++) {
  const r = Math.floor((i - 1) / COLS);
  const c = (i - 1) % COLS;

  zones.push({
    id: i,
    top: 3 + r * 18,
    left: 2 + c * 16,
    width: 14,
    height: 16
  });
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function render() {
  const container = document.getElementById("container");
  const z = document.getElementById("zones");
  z.innerHTML = "";

  zones.forEach(zone => {
    const a = document.createElement("a");
    a.className = "zone";
    a.href = `affiche-${pad2(zone.id)}.html`;

    a.style.top = zone.top + "%";
    a.style.left = zone.left + "%";
    a.style.width = zone.width + "%";
    a.style.height = zone.height + "%";

    a.innerHTML = `
      <span>${pad2(zone.id)}</span>
      <div class="resize-handle"></div>
    `;

    /* === DÉPLACEMENT === */
    a.onmousedown = (e) => {
      if (!editMode) return;
      if (e.target.classList.contains("resize-handle")) return;

      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startTop = zone.top;
      const startLeft = zone.left;

      const rect = container.getBoundingClientRect();

      document.onmousemove = (m) => {
        const dx = (m.clientX - startX) / rect.width * 100;
        const dy = (m.clientY - startY) / rect.height * 100;

        zone.left = Math.max(0, Math.min(100 - zone.width, startLeft + dx));
        zone.top  = Math.max(0, Math.min(100 - zone.height, startTop + dy));
        render();
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };

    /* === REDIMENSIONNEMENT === */
    const handle = a.querySelector(".resize-handle");
    handle.onmousedown = (e) => {
      if (!editMode) return;
      e.stopPropagation();
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = zone.width;
      const startH = zone.height;

      const rect = container.getBoundingClientRect();

      document.onmousemove = (m) => {
        const dw = (m.clientX - startX) / rect.width * 100;
        const dh = (m.clientY - startY) / rect.height * 100;

        zone.width  = Math.max(2, Math.min(100 - zone.left, startW + dw));
        zone.height = Math.max(2, Math.min(100 - zone.top, startH + dh));
        render();
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };

    z.appendChild(a);
  });
}

function toggleEdit() {
  editMode = !editMode;
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
