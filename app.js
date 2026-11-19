(()=>{
'use strict';
const P=window.OPLE_PAGES||[];
const names=['Constitución Política de los Estados Unidos Mexicanos','Ley General de Instituciones y Procedimientos Electorales','Ley General en Materia de Delitos Electorales','Reglamento de Elecciones del Instituto Nacional Electoral','Código Número 577 Electoral para el Estado de Veracruz','Ley General de Partidos Políticos','Reglamento de Sesiones de los Órganos Colegiados del OPLE Veracruz','Reglamento Interior del OPLE Veracruz','Reglamento para la Designación y Remoción de Funcionarios de Consejos Distritales y Municipales del OPLE Veracruz'];
const begins=[9,20,37,46,66,96,103,118,124];
const sections=names.map((name,i)=>({id:i,name,from:begins[i],to:(begins[i+1]||128)-1,pages:P.filter(p=>p.p>=begins[i]&&p.p<(begins[i+1]||128))}));
const KEY='ople-exclusivo-v3';
let state;try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{state={}}
state.history=Array.isArray(state.history)?state.history:[];
state.misses=state.misses||{};
let session=null,view='inicio',timer=null;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store=()=>localStorage.setItem(KEY,JSON.stringify(state));
const hash=(s)=>{let h=2166136261;for(let c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const shuffle=(a,seed)=>a.map((v,i)=>({v,r:hash(seed+'|'+i+'|'+JSON.stringify(v).slice(0,50))})).sort((a,b)=>a.r-b.r).map(x=>x.v);
function sanitize(s){return s.replace(/\s+/g,' ').replace(/^\W+/,'').trim()}
function paragraphCandidates(sec){
  let out=[];
  for(let p of sec.pages){
    let t=p.t||'';
    let matches=[...t.matchAll(/(?:^|\n)\s*Art[ií]culo\s+(\d+[ºo]?)(?:\s*[\.\-:]|\s*\n)/gim)];
    for(let i=0;i<matches.length;i++){
      const m=matches[i],end=matches[i+1]?.index??t.length;
      let body=t.slice(m.index+m[0].length,end).replace(/\[[^\]]{0,50}\]/g,' ').trim();
      let candidate=body.split(/\n\s*\n/).map(sanitize).filter(s=>s.length>=90&&s.length<=600)[0];
      if(!candidate) candidate=sanitize(body).slice(0,310);
      if(candidate.length>=90)out.push({id:sec.id+'-'+p.p+'-'+m[1],section:sec.id,page:p.p,article:m[1],quote:candidate.slice(0,270)});
    }
    const blocks=t.split(/\n\s*\n/).map(sanitize).filter(s=>s.length>=140&&s.length<=900);
    blocks.forEach((b,j)=>{if(!/^(?:GUÍA DE ESTUDIO|Página|Artículo\s+\d|CONTENIDO)/i.test(b))out.push({id:'p-'+sec.id+'-'+p.p+'-'+j,section:sec.id,page:p.p,article:null,quote:b.slice(0,250)})});
  }
  let seen=new Set();
  return out.filter(x=>{let key=x.quote.slice(0,85).toLowerCase();if(seen.has(key))return false;seen.add(key);return true});
}
const raw=sections.map(paragraphCandidates);
let bank=[], articlePools=raw.map(a=>[...new Set(a.filter(x=>x.article).map(x=>x.article))]);
for(let i=0;i<sections.length;i++){
  for(const item of raw[i]){
    if(item.article&&articlePools[i].length>=4){
      let wrong=shuffle(articlePools[i].filter(x=>x!==item.article),item.id).slice(0,3);
      let options=shuffle([item.article,...wrong],item.id+'-a').map(x=>'Artículo '+x);
      bank.push({id:'a-'+item.id,section:i,page:item.page,article:item.article,question:'¿A qué artículo de este apartado corresponde el siguiente fragmento de la guía?',quote:item.quote,options,answer:options.indexOf('Artículo '+item.article),kind:'articulo'});
    }
    let wrongSections=shuffle(sections.filter(x=>x.id!==i).map(x=>x.id),item.id+'-n').slice(0,3);
    let opts=shuffle([i,...wrongSections],item.id+'-s');
    bank.push({id:'s-'+item.id,section:i,page:item.page,article:item.article,question:'¿En cuál de los nueve apartados normativos de la guía aparece este fragmento?',quote:item.quote,options:opts.map(k=>names[k]),answer:opts.indexOf(i),kind:'apartado'});
  }
}
bank=bank.filter(q=>q.quote.length>=90);
const balanced=[];let bins=sections.map(s=>shuffle(bank.filter(q=>q.section===s.id),s.name));
for(let n=0;n<Math.max(...bins.map(x=>x.length));n++)for(let i=0;i<9;i++)if(bins[i][n])balanced.push(bins[i][n]);
bank=balanced.slice(0,Math.min(235,balanced.length));
const byId=new Map(bank.map(q=>[q.id,q]));
function app(html){$('#app').innerHTML=html}
function nav(v){view=v;document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$('#sectionName').textContent=({inicio:'PANORAMA',estudio:'TEMARIO',practica:'PRÁCTICA',simulacro:'SIMULACRO',errores:'REFUERZO',historial:'HISTORIAL',fuentes:'FUENTE DOCUMENTAL'})[v]||v;$('#sidebar').classList.remove('open');render()}
function btn(label,fn,cls='primary'){const b=document.createElement('button');b.className=cls;b.textContent=label;b.addEventListener('click',fn);return b}
function el(tag,cls='',content=''){const e=document.createElement(tag);e.className=cls;e.textContent=content;return e}
function intro(title,text){return '<div class="hero"><div class="kicker">FUENTE ÚNICA · GUÍA OPLEV · OCTUBRE 2026</div><h1>'+esc(title)+'</h1><p>'+esc(text)+'</p></div>'}
function dashboard(){
 const h=state.history,answered=h.reduce((a,x)=>a+x.total,0),good=h.reduce((a,x)=>a+x.correct,0),bad=Object.values(state.misses).filter(x=>x>0).length;
 app(intro('Tu preparación electoral, sin fuentes externas','Estudia los nueve apartados de la guía de la Universidad Veracruzana para el examen de Consejos Distritales. Los reactivos son ejercicios originales de reconocimiento del texto y artículos, no preguntas oficiales.')+
 '<div class="stats-grid"><div class="stat"><strong>'+bank.length+'</strong><span>Reactivos con fragmentos de la guía</span></div><div class="stat"><strong>9</strong><span>Apartados normativos</span></div><div class="stat"><strong>'+h.length+'</strong><span>Intentos terminados</span></div><div class="stat"><strong>'+(answered?Math.round(100*good/answered):0)+'%</strong><span>Acierto acumulado</span></div></div>'+
 '<div class="panel"><h3>Comienza a estudiar</h3><p class="muted">El simulacro contiene 50 preguntas y dura 120 minutos. Al equivocarte recibirás la respuesta y la referencia precisa de página, con la recomendación de volver a leer el fragmento.</p><div class="btnrow" id="actions"></div></div>'+
 '<div class="grid"><div class="panel"><h3>Texto de estudio</h3><p class="muted">Consulta los extractos de la guía, ordenados por norma y página del PDF.</p></div><div class="panel"><h3>Repaso dirigido</h3><p class="muted">'+bad+' preguntas señaladas para reforzar, según tus intentos anteriores.</p></div></div>');
 $('#actions').append(btn('Empezar práctica',()=>nav('practica')),btn('Simulacro de 50 preguntas',()=>nav('simulacro'),'secondary'),btn('Leer temario',()=>nav('estudio'),'secondary'));
}
function study(){
 app(intro('Temario y apuntes','Texto extraído del PDF facilitado. Las referencias indican la página física del archivo, que puede diferir de la numeración impresa.')+
 '<div class="panel"><label for="searchtxt" class="label">Buscar dentro de la guía</label><input id="searchtxt" class="input search" placeholder="Ej.: cómputo distrital, casilla, artículo 26"></div><div id="chapters" class="sections"></div>');
 const draw=()=>{let s=$('#searchtxt').value.trim().toLocaleLowerCase('es');let html='';
 for(const ch of sections){let pages=ch.pages.filter(p=>!s||p.t.toLocaleLowerCase('es').includes(s));if(!pages.length)continue;html+='<section class="section"><h3>'+esc(ch.name)+'</h3><p>Páginas '+ch.from+'–'+ch.to+' del PDF · '+pages.length+' página(s)'+(s?' coincidentes':'')+'</p><details><summary>Leer los extractos</summary><div class="reading">'+pages.map(p=>'<p class="label">Página '+p.p+'</p><pre>'+esc(p.t||'Sin texto extraíble en esta página')+'</pre>').join('')+'</div></details></section>'}
 $('#chapters').innerHTML=html||'<div class="empty">No se encontró el término en el texto.</div>'};
 $('#searchtxt').addEventListener('input',draw);draw();
}
function start(type){
 const missed=bank.filter(q=>state.misses[q.id]>0);
 const pool=type==='refuerzo'?(missed.length?missed:bank):bank;
 const count=type==='simulacro'?50:type==='refuerzo'?Math.min(20,pool.length):20;
 const ids=shuffle(pool.map(q=>q.id),Date.now().toString()).slice(0,count);
 if(!ids.length){app(intro('Sin preguntas pendientes','No hay preguntas falladas registradas. Comienza una práctica.'));return}
 session={type,ids,index:0,answers:{},start:Date.now(),deadline:type==='simulacro'?Date.now()+120*60*1000:null,finished:false};
 displayQuestion();clearInterval(timer);
 if(session.deadline)timer=setInterval(()=>{if(session&&!session.finished){if(Date.now()>=session.deadline)finish();else{let t=$('#clock');if(t)t.textContent=clock()}}},1000);
}
const clock=()=>{let d=Math.max(0,Math.floor((session.deadline-Date.now())/1000));return String(Math.floor(d/60)).padStart(2,'0')+':'+String(d%60).padStart(2,'0')};
function displayQuestion(){
 if(!session)return;let {ids,index,answers,type}=session;
 if(index>=ids.length){finish();return}
 const q=byId.get(ids[index]);if(!q){finish();return}
 const picked=answers[q.id],answered=picked!==undefined;
 app('<div class="flex"><span class="pill">'+esc(type==='simulacro'?'SIMULACRO':type==='refuerzo'?'REFUERZO':'PRÁCTICA')+'</span><span class="pill">Pregunta '+(index+1)+' de '+ids.length+'</span>'+(session.deadline?'<span class="pill" id="clock">'+clock()+'</span>':'')+'</div>'+
 '<div class="meter"><div style="width:'+Math.round(index/ids.length*100)+'%"></div></div><div class="panel"><div class="kicker">'+esc(names[q.section])+'</div><div class="question">'+esc(q.question)+'</div><div class="notice">'+esc('“'+q.quote+'”')+'</div><div class="options" id="choices" style="margin-top:18px"></div><div id="feedback"></div><div class="btnrow" id="questionActions"></div></div>');
 q.options.forEach((o,i)=>{const b=btn(String.fromCharCode(65+i)+'. '+o,()=>{if(session.answers[q.id]!==undefined)return;session.answers[q.id]=i;displayQuestion()},'option'+(answered&&i===q.answer?' correct':'')+(answered&&i===picked&&i!==q.answer?' wrong':''));b.disabled=answered;$('#choices').append(b)});
 if(answered){
  const correct=picked===q.answer;
  $('#feedback').innerHTML='<div class="notice"><strong>'+(correct?'Respuesta correcta.':'Respuesta incorrecta.')+'</strong><p>Opción correcta: <b>'+esc(q.options[q.answer])+'</b></p><p><b>Qué reforzar:</b> vuelve a leer el apartado «'+esc(names[q.section])+'»'+(q.article?', artículo '+esc(q.article):'')+', página '+q.page+' del PDF.</p><p>La respuesta se contrasta con el fragmento literal mostrado. No se utilizaron fuentes distintas a la guía.</p></div>';
  $('#questionActions').append(btn(index===ids.length-1?'Finalizar intento':'Siguiente pregunta',()=>{session.index++;displayQuestion()}));
 }else{
  $('#questionActions').append(btn('Terminar intento',finish,'secondary'));
 }
}
function finish(){
 if(!session||session.finished)return;
 session.finished=true;clearInterval(timer);
 const correct=session.ids.filter(id=>session.answers[id]===byId.get(id)?.answer).length;
 const incorrect=session.ids.filter(id=>session.answers[id]!==undefined&&session.answers[id]!==byId.get(id)?.answer).length;
 const omitted=session.ids.length-correct-incorrect;
 for(const id of session.ids){if(session.answers[id]!==undefined){if(session.answers[id]!==byId.get(id).answer)state.misses[id]=(state.misses[id]||0)+1;else state.misses[id]=0}}
 const record={when:new Date().toISOString(),type:session.type,total:session.ids.length,correct,incorrect,omitted,questions:session.ids,answers:session.answers,duration:Math.round((Date.now()-session.start)/1000)};
 state.history.unshift(record);store();session=null;
 app(intro('Intento finalizado','Tus resultados quedan guardados en este navegador. Puedes repetir la práctica, revisar los fallos o exportar tu progreso.')+
 '<div class="stats-grid"><div class="stat"><strong>'+correct+'</strong><span>Correctas</span></div><div class="stat"><strong>'+incorrect+'</strong><span>Incorrectas</span></div><div class="stat"><strong>'+omitted+'</strong><span>Sin contestar</span></div><div class="stat"><strong>'+Math.round(100*correct/record.total)+'%</strong><span>Calificación del intento</span></div></div><div class="panel"><h3>Qué reforzar</h3><div id="wrongList"></div><div class="btnrow" id="lastActions"></div></div>');
 const missed=record.questions.filter(id=>record.answers[id]!==byId.get(id)?.answer);
 $('#wrongList').innerHTML=missed.length?missed.map(id=>{let q=byId.get(id);return '<p class="muted">• '+esc(names[q.section])+' · '+(q.article?'Artículo '+esc(q.article)+' · ':'')+'Página '+q.page+' del PDF</p>'}).join(''):'<p class="muted">No hubo errores ni preguntas omitidas.</p>';
 $('#lastActions').append(btn('Repasar falladas',()=>nav('errores')),btn('Historial',()=>nav('historial'),'secondary'),btn('Volver a practicar',()=>start('practica'),'secondary'));
}
function setup(type){
 if(session&&!session.finished){displayQuestion();return}
 const t=type==='simulacro'?'Simulacro cronometrado':type==='refuerzo'?'Mis puntos débiles':'Practicar preguntas';
 const desc=type==='simulacro'?'50 reactivos, 4 opciones y un máximo de 120 minutos, como establece la guía.':type==='refuerzo'?'Se seleccionan los reactivos respondidos incorrectamente en intentos anteriores.':'20 preguntas seleccionadas del banco de ejercicios fundamentados en la guía.';
 app(intro(t,desc)+'<div class="panel"><h3>Antes de comenzar</h3><p class="muted">Las preguntas son didácticas y no oficiales. Todas se basan en fragmentos del texto aportado; la explicación remite a la página y artículo pertinentes.</p><div class="btnrow" id="startActions"></div></div>');
 $('#startActions').append(btn('Comenzar intento',()=>start(type)));
}
function history(){
 app(intro('Historial de intentos','Cada intento se registra separadamente, incluso si terminaste sin responder todas las preguntas.')+(state.history.length?'<div class="panel"><table class="table"><thead><tr><th>Fecha</th><th>Modalidad</th><th>Aciertos</th><th>Errores</th><th>Omisiones</th><th>Porcentaje</th></tr></thead><tbody>'+state.history.map(x=>'<tr><td>'+new Date(x.when).toLocaleString('es-MX')+'</td><td>'+esc(x.type)+'</td><td>'+x.correct+'</td><td>'+x.incorrect+'</td><td>'+x.omitted+'</td><td>'+Math.round(100*x.correct/x.total)+'%</td></tr>').join('')+'</tbody></table></div>':'<div class="panel empty">Aún no tienes intentos registrados.</div>')+'');

}
function sources(){
 app(intro('Fuente documental','Fuente exclusiva de contenidos: Guía de Estudios para aspirantes a Consejos Distritales, Universidad Veracruzana / CEOA, octubre de 2026.')+'<div class="panel"><h3>Documento y trazabilidad</h3><p class="muted">El repositorio incluye el texto extraído de las 127 páginas del PDF original, organizado por número de página en guia.js. Las portadas y páginas sin texto extraíble no reproducen sus imágenes.</p><p>Las preguntas didácticas se generan únicamente a partir de ese texto. Cada respuesta remite al apartado, artículo —cuando procede— y página del PDF. No son reactivos oficiales ni sustituyen la lectura del documento.</p><div class="btnrow" id="sourceActions"></div><p class="smallnote">Los resultados se guardan únicamente en el almacenamiento local de este navegador, no se sincronizan entre dispositivos.</p></div>');
 $('#sourceActions').append(btn('Leer texto de la guía',()=>nav('estudio')));

}
function render(){if(view==='inicio')dashboard();else if(view==='estudio')study();else if(view==='practica')setup('practica');else if(view==='simulacro')setup('simulacro');else if(view==='errores')setup('refuerzo');else if(view==='historial')history();else sources()}
document.querySelectorAll('#nav button').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.view)));
$('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
render();
})();