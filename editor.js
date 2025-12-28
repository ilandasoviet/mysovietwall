
const zones = [{"id": 1, "href": "affiche-01.html", "top": 5, "left": 2, "width": 14, "height": 16}, {"id": 2, "href": "affiche-02.html", "top": 5, "left": 18, "width": 14, "height": 16}, {"id": 3, "href": "affiche-03.html", "top": 5, "left": 34, "width": 14, "height": 16}, {"id": 4, "href": "affiche-04.html", "top": 5, "left": 50, "width": 14, "height": 16}, {"id": 5, "href": "affiche-05.html", "top": 5, "left": 66, "width": 14, "height": 16}, {"id": 6, "href": "affiche-06.html", "top": 5, "left": 82, "width": 14, "height": 16}, {"id": 7, "href": "affiche-07.html", "top": 23, "left": 2, "width": 14, "height": 16}, {"id": 8, "href": "affiche-08.html", "top": 23, "left": 18, "width": 14, "height": 16}, {"id": 9, "href": "affiche-09.html", "top": 23, "left": 34, "width": 14, "height": 16}, {"id": 10, "href": "affiche-10.html", "top": 23, "left": 50, "width": 14, "height": 16}, {"id": 11, "href": "affiche-11.html", "top": 23, "left": 66, "width": 14, "height": 16}, {"id": 12, "href": "affiche-12.html", "top": 23, "left": 82, "width": 14, "height": 16}, {"id": 13, "href": "affiche-13.html", "top": 41, "left": 2, "width": 14, "height": 16}, {"id": 14, "href": "affiche-14.html", "top": 41, "left": 18, "width": 14, "height": 16}, {"id": 15, "href": "affiche-15.html", "top": 41, "left": 34, "width": 14, "height": 16}, {"id": 16, "href": "affiche-16.html", "top": 41, "left": 50, "width": 14, "height": 16}, {"id": 17, "href": "affiche-17.html", "top": 41, "left": 66, "width": 14, "height": 16}, {"id": 18, "href": "affiche-18.html", "top": 41, "left": 82, "width": 14, "height": 16}, {"id": 19, "href": "affiche-19.html", "top": 59, "left": 2, "width": 14, "height": 16}, {"id": 20, "href": "affiche-20.html", "top": 59, "left": 18, "width": 14, "height": 16}, {"id": 21, "href": "affiche-21.html", "top": 59, "left": 34, "width": 14, "height": 16}, {"id": 22, "href": "affiche-22.html", "top": 59, "left": 50, "width": 14, "height": 16}, {"id": 23, "href": "affiche-23.html", "top": 59, "left": 66, "width": 14, "height": 16}, {"id": 24, "href": "affiche-24.html", "top": 59, "left": 82, "width": 14, "height": 16}, {"id": 25, "href": "affiche-25.html", "top": 77, "left": 2, "width": 14, "height": 16}, {"id": 26, "href": "affiche-26.html", "top": 77, "left": 18, "width": 14, "height": 16}, {"id": 27, "href": "affiche-27.html", "top": 77, "left": 34, "width": 14, "height": 16}, {"id": 28, "href": "affiche-28.html", "top": 77, "left": 50, "width": 14, "height": 16}, {"id": 29, "href": "affiche-29.html", "top": 77, "left": 66, "width": 14, "height": 16}, {"id": 30, "href": "affiche-30.html", "top": 77, "left": 82, "width": 14, "height": 16}];

function applyZones(){
  const container=document.getElementById('zones');
  container.innerHTML='';
  zones.forEach(z=>{
    const a=document.createElement('a');
    a.className='zone';
    a.href=z.href;
    a.dataset.id=z.id;
    a.style.top=z.top+'%';
    a.style.left=z.left+'%';
    a.style.width=z.width+'%';
    a.style.height=z.height+'%';
    const badge=document.createElement('span');
    badge.className='badge';
    badge.textContent=String(z.id).padStart(2,'0');
    a.appendChild(badge);
    const handle=document.createElement('span');
    handle.className='handle';
    a.appendChild(handle);
    container.appendChild(a);
  });
}

function setEdit(on){
  document.body.dataset.edit=on?'1':'0';
  document.querySelectorAll('.zone').forEach(el=>{
    el.classList.toggle('editing',on);
    el.onclick = on ? (e)=>e.preventDefault() : null;
  });
  document.getElementById('exportBtn').disabled=!on;
  document.getElementById('help').textContent = on
    ? "Déplacez/redimensionnez chaque zone sur l'affiche correspondante (en vous aidant de l'overlay numéroté). Puis Exporter."
    : "Mode normal: cliquez sur une affiche pour ouvrir sa fiche.";
}

function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function pctFromPx(px,total){return (px/total)*100;}

let active=null,resizing=false,start=null;
function startDrag(e,zoneEl){
  const container=document.getElementById('container').getBoundingClientRect();
  const id=Number(zoneEl.dataset.id);
  active=zones.find(z=>z.id===id);
  resizing=e.target.classList.contains('handle');
  start={mouseX:e.clientX,mouseY:e.clientY,top:active.top,left:active.left,width:active.width,height:active.height,container};
  e.preventDefault();
}
function onMove(e){
  if(!active||!start) return;
  const dx=e.clientX-start.mouseX;
  const dy=e.clientY-start.mouseY;
  const cw=start.container.width;
  const ch=start.container.height;
  const dxp=pctFromPx(dx,cw);
  const dyp=pctFromPx(dy,ch);
  if(resizing){
    active.width=clamp(start.width+dxp,1,100);
    active.height=clamp(start.height+dyp,1,100);
  } else {
    active.left=clamp(start.left+dxp,0,100);
    active.top=clamp(start.top+dyp,0,100);
  }
  active.width=clamp(active.width,1,100-active.left);
  active.height=clamp(active.height,1,100-active.top);
  const el=document.querySelector('.zone[data-id="'+active.id+'"]');
  el.style.top=active.top+'%';
  el.style.left=active.left+'%';
  el.style.width=active.width+'%';
  el.style.height=active.height+'%';
}
function onUp(){active=null;resizing=false;start=null;}
function wire(){
  document.getElementById('zones').addEventListener('mousedown',(e)=>{
    if(document.body.dataset.edit!=='1') return;
    const el=e.target.closest('.zone'); if(!el) return;
    startDrag(e,el);
  });
  window.addEventListener('mousemove',onMove);
  window.addEventListener('mouseup',onUp);

  document.getElementById('editToggle').addEventListener('click',()=>setEdit(document.body.dataset.edit!=='1'));
  document.getElementById('overlayToggle').addEventListener('click',()=>{
    const o=document.getElementById('annotLayer');
    o.style.display = (o.style.display==='none'||!o.style.display) ? 'block' : 'none';
  });
  document.getElementById('exportBtn').addEventListener('click',()=>{
    const lines=zones.map(z=>{
      const id=String(z.id).padStart(2,'0');
      return `<a class="zone" href="${z.href}" style="top:${z.top.toFixed(3)}%;left:${z.left.toFixed(3)}%;width:${z.width.toFixed(3)}%;height:${z.height.toFixed(3)}%;"><span class="badge">${id}</span><span class="handle"></span></a>`;
    });
    const box=document.getElementById('exportBox');
    box.value=lines.join('\n');
    box.style.display='block';
    box.focus(); box.select();
  });
}

window.addEventListener('DOMContentLoaded',()=>{applyZones(); setEdit(true); wire();});
