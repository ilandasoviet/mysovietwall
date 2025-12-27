
const zones = [{"id": 1, "href": "affiche-01.html", "top": 0.0, "left": 23.73046875, "width": 6.54296875, "height": 9.090909090909092}, {"id": 2, "href": "affiche-02.html", "top": 0.0, "left": 66.845703125, "width": 5.17578125, "height": 8.54978354978355}, {"id": 3, "href": "affiche-03.html", "top": 3.1385281385281383, "left": 55.908203125, "width": 8.984375, "height": 14.393939393939394}, {"id": 4, "href": "affiche-04.html", "top": 3.896103896103896, "left": 31.8359375, "width": 8.837890625, "height": 13.96103896103896}, {"id": 5, "href": "affiche-05.html", "top": 4.978354978354979, "left": 87.841796875, "width": 10.3515625, "height": 56.060606060606055}, {"id": 6, "href": "affiche-06.html", "top": 5.735930735930736, "left": 44.23828125, "width": 8.203125, "height": 12.337662337662337}, {"id": 7, "href": "affiche-07.html", "top": 6.0606060606060606, "left": 77.63671875, "width": 6.640625, "height": 18.181818181818183}, {"id": 8, "href": "affiche-08.html", "top": 9.740259740259742, "left": 17.919921875, "width": 12.40234375, "height": 18.506493506493506}, {"id": 9, "href": "affiche-09.html", "top": 11.03896103896104, "left": 3.369140625, "width": 5.078125, "height": 16.558441558441558}, {"id": 10, "href": "affiche-10.html", "top": 12.121212121212121, "left": 50.0, "width": 26.171875, "height": 84.3073593073593}, {"id": 11, "href": "affiche-11.html", "top": 22.294372294372295, "left": 33.10546875, "width": 15.087890625, "height": 22.07792207792208}, {"id": 12, "href": "affiche-12.html", "top": 33.00865800865801, "left": 13.28125, "width": 15.771484375, "height": 51.83982683982684}, {"id": 13, "href": "affiche-13.html", "top": 44.15584415584416, "left": 79.443359375, "width": 6.25, "height": 22.835497835497836}, {"id": 14, "href": "affiche-14.html", "top": 44.58874458874459, "left": 95.8984375, "width": 3.3203125, "height": 7.683982683982683}, {"id": 15, "href": "affiche-15.html", "top": 48.80952380952381, "left": 69.3359375, "width": 5.17578125, "height": 16.341991341991342}, {"id": 16, "href": "affiche-16.html", "top": 49.56709956709957, "left": 30.56640625, "width": 6.0546875, "height": 18.506493506493506}, {"id": 17, "href": "affiche-17.html", "top": 51.082251082251084, "left": 38.134765625, "width": 10.107421875, "height": 14.71861471861472}, {"id": 18, "href": "affiche-18.html", "top": 52.5974025974026, "left": 2.83203125, "width": 7.861328125, "height": 11.688311688311687}, {"id": 19, "href": "affiche-19.html", "top": 65.15151515151516, "left": 88.37890625, "width": 6.103515625, "height": 19.480519480519483}, {"id": 20, "href": "affiche-20.html", "top": 70.12987012987013, "left": 3.369140625, "width": 6.298828125, "height": 20.67099567099567}, {"id": 21, "href": "affiche-21.html", "top": 71.32034632034632, "left": 79.052734375, "width": 5.908203125, "height": 19.37229437229437}, {"id": 22, "href": "affiche-22.html", "top": 71.75324675324676, "left": 40.8203125, "width": 5.56640625, "height": 19.264069264069263}, {"id": 23, "href": "affiche-23.html", "top": 72.72727272727273, "left": 69.3359375, "width": 5.419921875, "height": 17.64069264069264}, {"id": 24, "href": "affiche-24.html", "top": 79.97835497835499, "left": 32.470703125, "width": 5.224609375, "height": 10.38961038961039}];

function applyZones() {
  const container = document.getElementById('zones');
  container.innerHTML = '';
  zones.forEach(z => {
    const a = document.createElement('a');
    a.className = 'zone';
    a.href = z.href;
    a.dataset.id = z.id;
    a.style.top = z.top + '%';
    a.style.left = z.left + '%';
    a.style.width = z.width + '%';
    a.style.height = z.height + '%';

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = String(z.id).padStart(2,'0');
    a.appendChild(badge);

    const handle = document.createElement('span');
    handle.className = 'handle';
    a.appendChild(handle);

    container.appendChild(a);
  });
}

function setEditMode(on) {
  document.body.dataset.edit = on ? '1' : '0';
  document.querySelectorAll('.zone').forEach(z => {
    z.classList.toggle('editing', on);
    z.onclick = on ? (e)=>e.preventDefault() : null;
  });
  document.getElementById('exportBtn').disabled = !on;
  document.getElementById('help').textContent = on
    ? "Mode édition: glissez une zone pour la déplacer, utilisez le petit carré pour redimensionner. Cliquez Exporter pour obtenir le code à remplacer dans index.html."
    : "Mode normal: cliquez sur une affiche pour ouvrir sa fiche.";
}

function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }

function pctFromPx(px, total) { return (px/total)*100; }

let active = null;
let resizing = false;
let start = null;

function startDrag(e, zoneEl) {
  const rect = zoneEl.getBoundingClientRect();
  const container = document.getElementById('container').getBoundingClientRect();
  const id = Number(zoneEl.dataset.id);
  active = zones.find(z => z.id === id);
  resizing = e.target.classList.contains('handle');
  start = {
    mouseX: e.clientX,
    mouseY: e.clientY,
    top: active.top,
    left: active.left,
    width: active.width,
    height: active.height,
    rect,
    container
  };
  e.preventDefault();
}

function onMove(e) {
  if(!active || !start) return;
  const dx = e.clientX - start.mouseX;
  const dy = e.clientY - start.mouseY;

  const cw = start.container.width;
  const ch = start.container.height;

  const dxp = pctFromPx(dx, cw);
  const dyp = pctFromPx(dy, ch);

  if(resizing) {
    active.width = clamp(start.width + dxp, 1, 100);
    active.height = clamp(start.height + dyp, 1, 100);
  } else {
    active.left = clamp(start.left + dxp, 0, 100);
    active.top = clamp(start.top + dyp, 0, 100);
  }
  // prevent overflow
  active.width = clamp(active.width, 1, 100 - active.left);
  active.height = clamp(active.height, 1, 100 - active.top);

  // update DOM
  const el = document.querySelector('.zone[data-id="'+active.id+'"]');
  el.style.top = active.top + '%';
  el.style.left = active.left + '%';
  el.style.width = active.width + '%';
  el.style.height = active.height + '%';
}

function onUp() {
  active = null;
  resizing = false;
  start = null;
}

function wireDrag() {
  document.getElementById('zones').addEventListener('mousedown', (e) => {
    if(document.body.dataset.edit !== '1') return;
    const zoneEl = e.target.closest('.zone');
    if(!zoneEl) return;
    startDrag(e, zoneEl);
  });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

function exportHTML() {
  // generate anchor tags with inline styles for easy replacement
  const lines = zones.map(z => {
    const id = String(z.id).padStart(2,'0');
    return `<a class="zone" href="${z.href}" style="top:${z.top.toFixed(3)}%;left:${z.left.toFixed(3)}%;width:${z.width.toFixed(3)}%;height:${z.height.toFixed(3)}%;"><span class="badge">${id}</span><span class="handle"></span></a>`;
  });
  const out = lines.join('\n');
  document.getElementById('exportBox').value = out;
  document.getElementById('exportBox').style.display = 'block';
  document.getElementById('exportBox').focus();
  document.getElementById('exportBox').select();
}

window.addEventListener('DOMContentLoaded', () => {
  applyZones();
  wireDrag();
  setEditMode(false);

  document.getElementById('editToggle').addEventListener('click', () => {
    const on = document.body.dataset.edit !== '1';
    setEditMode(on);
  });
  document.getElementById('exportBtn').addEventListener('click', exportHTML);
});
