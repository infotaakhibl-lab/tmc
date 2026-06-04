let services=[], selected=[];
fetch('services.json').then(r=>r.json()).then(d=>{services=d;init();});

function init(){
 let depts=[...new Set(services.map(s=>s.Department))];
 let dsel=document.getElementById('dept');
 dsel.innerHTML='<option value="">All</option>'+depts.map(d=>`<option>${d}</option>`).join('');
 render();
 document.getElementById('search').oninput=render;
 dsel.onchange=render;
}

function render(){
 let q=document.getElementById('search').value.toLowerCase();
 let d=document.getElementById('dept').value;
 let res=services.filter(s=>
  (!q||s['Guar Name'].toLowerCase().includes(q)) &&
  (!d||s.Department===d) &&
  !selected.find(x=>x['Guar Code']===s['Guar Code'])
 );
 let t=document.getElementById('results');
 t.innerHTML=res.map(s=>`<tr><td>${s['Guar Name']}</td><td>${s.Weight}</td>
 <td><button onclick='add(${s["Guar Code"]})'>Add</button></td></tr>`).join('');
}

function add(code){
 let s=services.find(x=>x['Guar Code']==code);
 s.qty=1; s.disc=0;
 selected.push(s);
 render(); renderSelected();
}

function renderSelected(){
 let t=document.getElementById('selected');
 let total=0;
 t.innerHTML=selected.map((s,i)=>{
 let price=s.Weight*s.qty*(1-s.disc/100); total+=price;
 return `<tr><td>${s['Guar Name']}</td>
 <td><input type=number value=${s.qty} onchange='upd(${i},this.value,"q")'></td>
 <td><input type=number value=${s.disc} onchange='upd(${i},this.value,"d")'></td>
 <td>${price.toFixed(2)}</td>
 <td><button onclick='rem(${i})'>X</button></td></tr>`;
 }).join('');
 document.getElementById('total').innerText=total.toFixed(2);
}

function upd(i,v,t){ if(t=='q')selected[i].qty=v; else selected[i].disc=v; renderSelected();}
function rem(i){ selected.splice(i,1); render(); renderSelected();}
