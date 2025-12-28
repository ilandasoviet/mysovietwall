let edit = true;
let zones = [];

for (let i=1;i<=30;i++) {
  zones.push({id:i, top:5, left:5, width:10, height:15});
}

function render() {
  const z = document.getElementById('zones');
  z.innerHTML = '';
  zones.forEach(a=>{
    const d=document.createElement('div');
    d.className='zone';
    d.style=`top:${a.top}%;left:${a.left}%;width:${a.width}%;height:${a.height}%`;
    d.innerHTML=`<span>${String(a.id).padStart(2,'0')}</span>`;
    d.onmousedown=e=>{
      let sx=e.clientX, sy=e.clientY;
      document.onmousemove=m=>{
        a.left += (m.clientX-sx)/20;
        a.top += (m.clientY-sy)/20;
        sx=m.clientX; sy=m.clientY;
        render();
      };
      document.onmouseup=()=>document.onmousemove=null;
    };
    z.appendChild(d);
  });
}

function toggleEdit(){ edit=!edit; }
function toggleOverlay(){
  const o=document.getElementById('overlay');
  o.style.display=o.style.display==='none'?'block':'none';
}
function exportZones(){
  const out=document.getElementById('output');
  out.style.display='block';
  out.value = zones.map(z=>
    `<a class="zone" href="affiche-${String(z.id).padStart(2,'0')}.html" style="top:${z.top.toFixed(2)}%;left:${z.left.toFixed(2)}%;width:${z.width.toFixed(2)}%;height:${z.height.toFixed(2)}%;"></a>`
  ).join('\n');
}

render();
