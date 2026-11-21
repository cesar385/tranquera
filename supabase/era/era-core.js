// Generado automáticamente desde index.html: núcleo de Era (no editar a mano)
export function crearEra(){
let S=null,VIA='';
const AR=()=>new Date(Date.now()-3*3600e3);
function save(){}
function puede(){return PUEDE}
let PUEDE=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate());
const hoy=()=>iso(AR());
const dAgo=n=>{const d=AR();d.setUTCDate(d.getUTCDate()-n);return iso(d)};
const fD=s=>{if(!s)return'—';const[y,m,d]=s.split('-');return d+'/'+m+'/'+y};
const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const MESL=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const fDc=s=>{if(!s)return'—';const[y,m,d]=s.split('-');return (+d)+' de '+MES[m-1]};
const dias=(a,b=hoy())=>Math.round((new Date(b)-new Date(a))/864e5);
const nf=(n,dec=0)=>Number(n||0).toLocaleString('es-AR',{maximumFractionDigits:dec});
const money=n=>(n<0?'−$':'$')+Math.abs(Number(n||0)).toLocaleString('es-AR',{maximumFractionDigits:0});
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const cap=s=>{s=String(s||'').trim();return s.charAt(0).toUpperCase()+s.slice(1)};
const reEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const total=o=>Object.values(o||{}).reduce((a,b)=>a+(+b||0),0);
const initials=n=>String(n||'?').split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const joinY=a=>a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' y '+a[a.length-1];
const uAbbr=u=>({Litros:'L',Kilos:'kg',Mililitros:'cc',Gramos:'g',Toneladas:'t'}[u]||String(u||'').toLowerCase());
const cl=(c,n)=>{c=String(c||'').toLowerCase();return +n===1?c.replace(/s$/,''):c};
const sum=(a,f)=>a.reduce((x,y)=>x+(+f(y)||0),0);
const DATA=['potreros','registros','insumos','finanzas','tareas','caravanas'];
const ROLES=['Administrador','Administrador con finanzas','Colaborador','Solo carga de datos','Solo lectura'];
const DEF={categorias:['Vacas','Vaquillonas','Toros','Terneros','Terneras','Novillos'],
 ev:{Vacas:1,Vaquillonas:.7,Toros:1.3,Terneros:.4,Terneras:.4,Novillos:.8},
 cultivos:['Alfalfa','Avena','Maíz para grano','Maíz para picar','Soja','Trigo','Girasol','Sorgo','Pastura natural'],
 gcats:['Agricultura','Hacienda','Maquinaria','Combustible','Sanidad','Personal','Arrendamiento','Estructura','Impuestos','Otros'],
 icats:['Hacienda','Granos','Servicios','Otros'],
 insCats:['Alimento','Sanidad','Insumos agrícolas','Agroquímicos','Estructura','Sin categoría'],
 contratistas:[],puntos:[],
 config:{ubicacion:'Federal, Entre Ríos',tipo:'mixto',ocultarNombres:false,tc:1450,moneda:'ARS',conIva:true,iva:21,prefijo:'0320100'},
 analisis:[],favs:['pastoreo','nacimientos'],usos:{pastoreo:216,siembra:86,nacimientos:121,insumos:64,lluvia:97,gastos:58,hacienda:40,prenez:33,cosecha:29},chats:[],chatId:null};
const CATS=[];
const syncCats=()=>CATS.splice(0,CATS.length,...S.categorias);
function migrar(s){if(s.demo==null)s.demo=s.establecimiento==='Don Ramón';s.onb=s.onb||(s.demo?{categorias:true,cultivos:true,insumos:true}:{});for(const k in DEF)if(s[k]==null)s[k]=JSON.parse(JSON.stringify(DEF[k]));s.config=Object.assign({},DEF.config,s.config);s.usos=Object.assign({},DEF.usos,s.usos);s.ev=Object.assign({},DEF.ev,s.ev);
 (s.caravanas||[]).forEach(a=>{if(a.activo==null)a.activo=true;a.pesos=a.pesos||[]});
 (s.equipo||[]).forEach(e=>{if(!ROLES.includes(e.rol)){e.puesto=e.puesto||e.rol;e.rol='Colaborador'}e.alta=e.alta||hoy()});
 (s.tareas||[]).forEach(t=>{t.prioridad=t.prioridad||'Normal'});
 (s.insumos||[]).forEach(i=>{i.precio=i.precio||0});
 (s.finanzas||[]).forEach(x=>{x.moneda=x.moneda||'ARS';x.iva=x.iva??0});
 (s.registros||[]).forEach(r=>{if(r.tipo==='nota')return;if(['siembra','cosecha'].includes(r.tipo)&&!r.lotes&&r.pot)r.lotes=[{pot:r.pot,has:+r.has||0}]});
 if(s.demo&&!s.config.geoDemo&&s.potreros?.length)geoDemo(s);
 s.v=2;return s}
const pot=id=>S.potreros.find(p=>p.id===id);
const potName=id=>pot(id)?.nombre||'—';
const ins=id=>S.insumos.find(i=>i.id===id);
function stock(i,desde,hasta){let inv=0,ing=0,con=0;for(const m of i.movs){const v=+m.cant||0;if(m.tipo==='ingreso')inv+=v;else inv-=v;if((!desde||m.fecha>=desde)&&(!hasta||m.fecha<=hasta)){if(m.tipo==='ingreso')ing+=v;else con+=v}}return{inv,ing,con}}
function animalesPorCat(){const o={};CATS.forEach(c=>o[c]=0);S.potreros.forEach(p=>Object.entries(p.animales||{}).forEach(([c,v])=>o[c]=(o[c]||0)+(+v||0)));return o}
const totAnimales=()=>total(animalesPorCat());
const evDe=(anim)=>Object.entries(anim||{}).reduce((a,[c,v])=>a+(+v||0)*(S.ev[c]??.8),0);
function meses(n=12){const a=[],d=AR();d.setUTCDate(1);for(let i=n-1;i>=0;i--){const x=new Date(d.getUTCFullYear(),d.getUTCMonth()-i,1);a.push({k:x.getUTCFullYear()+'-'+pad(x.getUTCMonth()+1),l:MES[x.getUTCMonth()]+(n>12?' '+String(x.getUTCFullYear()).slice(2):'')})}return a}
function porMes(list,val,n=12){const ms=meses(n),o={};ms.forEach(m=>o[m.k]=0);list.forEach(x=>{const k=x.fecha.slice(0,7);if(k in o)o[k]+=val(x)});return ms.map(m=>o[m.k])}
const regs=t=>S.registros.filter(r=>r.tipo===t);
const desde=n=>dAgo(n);
function estado(p){const t=total(p.animales);return{pastoreo:t>0,d:Math.max(0,dias(p.desde||hoy())),t}}
const lotesTxt=l=>joinY((l||[]).map(x=>`${potName(x.pot)} (${nf(x.has,1)} ha)`));
const regDePot=(r,id)=>r.pot===id||r.origen===id||r.destino===id||(r.lotes||[]).some(l=>l.pot===id);
const GR={Movimientos:'#2a6a95',Eventos:'#9a6c10','Reproducción':'#c0567a',Agricultura:'#3F5228','Insumos y finanzas':'#6a4a9c',Otros:'#5b6656'};
const TIPOS={movimiento:['Cambio de potrero','Movimientos','Mv'],traslado:['Traslado','Movimientos','Tr'],venta:['Venta','Movimientos','V'],compra:['Compra','Movimientos','C'],mortandad:['Mortandad','Movimientos','M'],consumo:['Consumo','Movimientos','Co'],ajuste:['Ajuste de stock','Movimientos','Aj'],
 tratamiento:['Tratamiento','Eventos','T'],pesaje:['Pesaje','Eventos','P'],recategorizacion:['Recategorización','Eventos','R'],
 nacimiento:['Nacimiento','Reproducción','N'],tacto:['Tacto','Reproducción','Ta'],destete:['Destete','Reproducción','D'],aborto:['Aborto','Reproducción','Ab'],
 siembra:['Siembra','Agricultura','S'],pulverizacion:['Pulverización','Agricultura','Pu'],refertilizacion:['Refertilización','Agricultura','Rf'],riego:['Riego','Agricultura','Ri'],monitoreo:['Monitoreo','Agricultura','Mo'],cosecha:['Cosecha','Agricultura','Cs'],labor:['Otras labores','Agricultura','L'],
 uso_insumo:['Uso de insumos','Insumos y finanzas','U'],ingreso_insumo:['Ingreso de insumos','Insumos y finanzas','I'],gasto:['Gasto','Insumos y finanzas','$'],ingreso:['Ingreso','Insumos y finanzas','$'],
 lluvia:['Lluvia','Otros','Ll'],helada:['Helada','Otros','H'],nota:['Novedad','Otros','Nv']};
const tColor=t=>({mortandad:'#b93a2b',aborto:'#b93a2b',gasto:'#b93a2b',lluvia:'#2a6a95',riego:'#2a6a95'}[t]||GR[TIPOS[t]?.[1]]||'#5b6656');
const TCATS=['Sanidad','Ganadería','Agricultura','Mantenimiento','Administración','Otros'];
const TCOL={Sanidad:'v',Ganadería:'w',Agricultura:'g',Mantenimiento:'b',Administración:'b',Otros:''};
const ACT={Agricultura:['Agricultura','Granos'],Ganadería:['Hacienda','Sanidad']};
const actDe=c=>Object.keys(ACT).find(a=>ACT[a].includes(c))||'Estructura y otros';
const PAL=['#3F5228','#d0a032','#2a6a95','#b93a2b','#6a4a9c','#3d7f7a','#8a5a32','#c0567a','#7d8a6f','#5a9bd4','#a7c957','#e07a5f'];
const cropColor=c=>{const i=S.cultivos.findIndex(x=>norm(x)===norm(c));return PAL[(i<0?S.cultivos.length+norm(c).length:i)%PAL.length]};
function maxPot(cat){let b=null;S.potreros.forEach(p=>{if(+(p.animales?.[cat]||0)>(b?+(b.animales?.[cat]||0):0))b=p});return b}
function addAn(p,cat,n){if(!p||!cat||!n)return;p.animales=p.animales||{};const antes=total(p.animales);p.animales[cat]=Math.max(0,(+p.animales[cat]||0)+n);if(!p.animales[cat])delete p.animales[cat];const despues=total(p.animales);if((antes===0)!==(despues===0))p.desde=hoy()}
const AGRI=['siembra','pulverizacion','refertilizacion','riego','monitoreo','cosecha','labor'];
function aplicar(tipo,p){
 p={...p};const f=p.fecha||hoy();let txt='';const po=pot(p.pot);
 if(AGRI.includes(tipo)&&!p.lotes&&p.pot)p.lotes=[{pot:p.pot,has:p.has}];
 const lotes=(p.lotes||[]).filter(l=>l.pot).map(l=>({pot:l.pot,has:+l.has||+pot(l.pot)?.has||0}));if(p.lotes){p.lotes=lotes;delete p.pot}
 const hasT=lotes.reduce((a,l)=>a+l.has,0)||+p.has||0;const enL=lotes.length?' en '+lotesTxt(lotes):'';
 const usar=(id,c,pid)=>{const i=ins(id);if(i&&+c>0)i.movs.push({id:uid(),fecha:f,tipo:'uso',cant:+(+c).toFixed(3),pot:pid||''})};
 const ctr=p.contratista?` a cargo de ${p.contratista}`:'';
 if(p.contratista&&!S.contratistas.includes(p.contratista))S.contratistas.push(p.contratista);
 const n=x=>+x||0;
 switch(tipo){
 case'lluvia':txt=`Se registraron ${nf(p.mm,1)} mm en el pluviómetro ${p.pluviometro||'Principal'}`;break;
 case'helada':txt=`Helada${p.temp!==''&&p.temp!=null?` de ${nf(p.temp,1).replace('-','−')} °C`:''}${p.dano?' — '+p.dano:''}`;break;
 case'nacimiento':addAn(po,p.cat,n(p.cant));txt=`${n(p.cant)===1?'Nació':'Nacieron'} ${p.cant} ${cl(p.cat,p.cant)} en ${potName(p.pot)}`;break;
 case'mortandad':addAn(po,p.cat,-n(p.cant));txt=`${n(p.cant)===1?'Murió':'Murieron'} ${p.cant} ${cl(p.cat,p.cant)} en ${potName(p.pot)}${p.causa?' — '+p.causa:''}`;break;
 case'aborto':txt=`${p.cant} ${n(p.cant)===1?'aborto':'abortos'} en ${potName(p.pot)}${p.causa?' — '+p.causa:''}`;break;
 case'consumo':addAn(po,p.cat,-n(p.cant));txt=`Consumo de ${p.cant} ${cl(p.cat,p.cant)} de ${potName(p.pot)}`;break;
 case'ajuste':{const s=p.signo==='-'?-1:1;addAn(po,p.cat,s*n(p.cant));txt=`Ajuste en ${potName(p.pot)}: ${s>0?'+':'−'}${p.cant} ${cl(p.cat,p.cant)}`;break}
 case'venta':addAn(po,p.cat,-n(p.cant));txt=`Se vendieron ${p.cant} ${cl(p.cat,p.cant)} de ${potName(p.pot)}${p.kg?` (${nf(p.kg)} kg promedio)`:''}${n(p.monto)?' por '+money(p.monto):''}${p.comprador?' a '+p.comprador:''}`;if(n(p.monto))S.finanzas.push({id:uid(),tipo:'ingreso',fecha:f,categoria:'Hacienda',monto:n(p.monto),desc:`Venta de ${p.cant} ${cl(p.cat,p.cant)}`,proveedor:p.comprador||'',iva:0,moneda:'ARS',estado:'cobrado'});break;
 case'compra':addAn(po,p.cat,n(p.cant));txt=`Se compraron ${p.cant} ${cl(p.cat,p.cant)} para ${potName(p.pot)}${p.kg?` (${nf(p.kg)} kg promedio)`:''}${n(p.monto)?' por '+money(p.monto):''}${p.comprador?' a '+p.comprador:''}`;if(n(p.monto))S.finanzas.push({id:uid(),tipo:'gasto',fecha:f,categoria:'Hacienda',monto:n(p.monto),desc:`Compra de ${p.cant} ${cl(p.cat,p.cant)}`,proveedor:p.comprador||'',iva:0,moneda:'ARS',estado:'pagado'});break;
 case'traslado':{const s=p.sentido==='entrada'?1:-1;addAn(po,p.cat,s*n(p.cant));txt=`${s>0?'Ingresaron':'Salieron'} ${p.cant} ${cl(p.cat,p.cant)} ${s>0?'a':'de'} ${potName(p.pot)}${p.campo?(s>0?' desde ':' hacia ')+p.campo:''}`;break}
 case'movimiento':{const o=pot(p.origen),d=pot(p.destino);const hay=o?+(o.animales?.[p.cat]||0):0;const c=o&&hay?Math.min(n(p.cant),hay):n(p.cant);addAn(o,p.cat,-c);addAn(d,p.cat,c);p.cant=c;txt=`Se ${c===1?'movió':'movieron'} ${c} ${cl(p.cat,c)} de ${potName(p.origen)} a ${potName(p.destino)}`;break}
 case'recategorizacion':{const hay=+(po?.animales?.[p.de]||0);const c=hay?Math.min(n(p.cant),hay):n(p.cant);addAn(po,p.de,-c);addAn(po,p.a,c);p.cant=c;txt=`Se recategorizaron ${c} ${cl(p.de,c)} a ${cl(p.a,c)} en ${potName(p.pot)}`;break}
 case'pesaje':txt=`Se pesaron ${p.cant} ${cl(p.cat,p.cant)} en ${potName(p.pot)}: promedio ${nf(p.kg)} kg`;break;
 case'tratamiento':txt=`Tratamiento con ${p.producto}${po?' en '+po.nombre:''}${p.cant?` (${p.cant} ${cl(p.cat||'animales',p.cant)})`:''}${p.detalle?' — '+p.detalle:''}`;if(p.ins&&n(p.dosis)&&n(p.cant))usar(p.ins,n(p.dosis)*n(p.cant),p.pot);break;
 case'tacto':{const t=n(p.prenadas)+n(p.vacias);txt=`Tacto en ${potName(p.pot)}: ${n(p.prenadas)} preñadas y ${n(p.vacias)} vacías (${t?nf(n(p.prenadas)/t*100,1):0}% de preñez)${p.cabeza?`, ${n(p.cabeza)} cabeza`:''}`;break}
 case'destete':{const d=pot(p.destino);if(d&&d!==po){addAn(po,'Terneros',-n(p.terneros));addAn(d,'Terneros',n(p.terneros));addAn(po,'Terneras',-n(p.terneras));addAn(d,'Terneras',n(p.terneras))}txt=`Destete en ${potName(p.pot)}: ${n(p.terneros)} ${cl('terneros',n(p.terneros))} y ${n(p.terneras)} ${cl('terneras',n(p.terneras))}${p.kg?`, promedio ${nf(p.kg)} kg`:''}${d&&d!==po?' — pasaron a '+d.nombre:''}`;break}
 case'siembra':lotes.forEach(l=>{const q=pot(l.pot);if(q){q.cultivos=[p.cultivo];if(!total(q.animales))q.desde=f}});if(p.cultivo&&!S.cultivos.some(c=>norm(c)===norm(p.cultivo)))S.cultivos.push(p.cultivo);if(p.ins&&n(p.densidad))lotes.forEach(l=>usar(p.ins,n(p.densidad)*l.has,l.pot));txt=`Se sembraron ${nf(hasT,1)} ha de ${p.cultivo}${enL}${p.variedad?` (${p.variedad})`:''}${ctr}`;break;
 case'pulverizacion':{const tr=(p.trat||[]).filter(t=>t.ins&&n(t.dosis));p.trat=tr;if(p.descontar!==false)tr.forEach(t=>lotes.length?lotes.forEach(l=>usar(t.ins,n(t.dosis)*l.has,l.pot)):usar(t.ins,n(t.dosis)*hasT,''));txt=`Se pulverizaron ${nf(hasT,1)} ha${p.cultivo?' de '+p.cultivo.toLowerCase():''}${enL}${ctr}${tr.length?', con: '+joinY(tr.map(t=>`${ins(t.ins)?.nombre} (${nf(t.dosis,2)} ${uAbbr(ins(t.ins)?.unidad)}/ha)`)):''}`;break}
 case'refertilizacion':{const i=ins(p.ins);if(i&&n(p.dosis)&&p.descontar!==false)lotes.forEach(l=>usar(i.id,n(p.dosis)*l.has,l.pot));txt=`Se refertilizaron ${nf(hasT,1)} ha${enL}${i?` con ${i.nombre} (${nf(p.dosis,1)} ${uAbbr(i.unidad)}/ha)`:''}${ctr}`;break}
 case'riego':txt=`Riego de ${nf(p.mm)} mm${enL}`;break;
 case'monitoreo':txt=`Monitoreo${enL}${p.cultivo?' de '+p.cultivo.toLowerCase():''}: ${p.obs||'sin novedades'}${p.nivel?` (nivel ${p.nivel.toLowerCase()})`:''}`;break;
 case'cosecha':{const prod=hasT*n(p.rinde);p.prod=prod;if(p.liberar)lotes.forEach(l=>{const q=pot(l.pot);if(q){q.cultivos=(q.cultivos||[]).filter(c=>norm(c)!==norm(p.cultivo))}});txt=`Se cosecharon ${nf(hasT,1)} ha de ${p.cultivo}${enL}${n(p.rinde)?`: ${nf(p.rinde)} kg/ha, ${nf(prod/1000,1)} t en total`:''}${ctr}`;break}
 case'labor':txt=`${cap(p.labor||'Labor')}${enL}${ctr}`;if(n(p.costo))S.finanzas.push({id:uid(),tipo:'gasto',fecha:f,categoria:'Agricultura',monto:n(p.costo),desc:cap(p.labor||'Labor'),proveedor:p.contratista||'',iva:21,moneda:'ARS',estado:'pagado'});break;
 case'uso_insumo':{const it=(p.items||(p.ins?[{ins:p.ins,cant:p.cant}]:[])).filter(x=>ins(x.ins)&&n(x.cant));delete p.ins;p.items=it;it.forEach(x=>usar(x.ins,x.cant,p.pot));txt=`Se usaron ${joinY(it.map(x=>`${nf(x.cant,2)} ${cl(ins(x.ins).unidad)} de ${ins(x.ins).nombre}`))}${po?' en '+po.nombre:''}`;break}
 case'ingreso_insumo':{const i=ins(p.ins);if(!i)return'';i.movs.push({id:uid(),fecha:f,tipo:'ingreso',cant:n(p.cant)});if(n(p.monto)&&n(p.cant))i.precio=Math.round(n(p.monto)/n(p.cant)*100)/100;txt=`Ingresaron ${nf(p.cant,2)} ${cl(i.unidad)} de ${i.nombre}${n(p.monto)?' por '+money(p.monto):''}${p.proveedor?' — '+p.proveedor:''}`;if(n(p.monto))S.finanzas.push({id:uid(),tipo:'gasto',fecha:f,categoria:i.categoria==='Sanidad'?'Sanidad':i.categoria==='Estructura'?'Estructura':'Agricultura',monto:n(p.monto),desc:`Compra de ${i.nombre}`,proveedor:p.proveedor||'',iva:21,moneda:'ARS',estado:'pagado'});break}
 case'gasto':case'ingreso':S.finanzas.push({id:uid(),tipo,fecha:f,categoria:p.categoria||'Otros',monto:n(p.monto),desc:p.desc||'',proveedor:p.proveedor||'',iva:n(p.iva),moneda:p.moneda||'ARS',estado:p.estado||(tipo==='gasto'?'pagado':'cobrado')});txt=`${tipo==='gasto'?'Gasto':'Ingreso'} de ${p.moneda==='USD'?'US$'+nf(p.monto):money(p.monto)} — ${p.categoria||'Otros'}${p.desc?': '+p.desc:''}`;break;
 case'tarea':S.tareas.push({id:uid(),categoria:p.categoria||'Otros',fecha:p.fecha||hoy(),texto:p.texto,resp:p.resp||'',hecha:false,prioridad:'Normal',pot:p.pot||'',notas:''});save();return`Nueva tarea para el ${fD(p.fecha)}: ${p.texto}`;
 case'nota':txt=p.texto;break;
 }
 S.registros.unshift({id:uid(),fecha:f,tipo,texto:txt,autor:S.usuario,creado:hoy(),...p,...(VIA?{via:VIA}:{})});
 S.registros.sort((a,b)=>b.fecha.localeCompare(a.fecha));
 save();return txt;
}
function detalle(r){const L=[];const add=(k,v)=>{if(v!==''&&v!=null&&v!==0&&!(Array.isArray(v)&&!v.length))L.push([k,v])};
 add('Fecha',fD(r.fecha));
 if(r.lotes)add('Potreros',lotesTxt(r.lotes));else if(r.pot)add('Potrero',potName(r.pot));
 if(r.origen)add('Desde',potName(r.origen));if(r.destino)add('Hacia',potName(r.destino));
 if(r.cant&&r.cat)add('Animales',`${r.cant} ${r.cat}`);if(r.de)add('Recategorización',`${r.de} → ${r.a}`);
 if(r.mm)add(r.tipo==='riego'?'Lámina':'Cantidad de lluvia',nf(r.mm,1)+' mm');add('Pluviómetro',r.pluviometro);
 add('Cultivo',r.cultivo);add('Variedad',r.variedad);
 if(r.trat)add('Tratamientos',r.trat.map(t=>`${ins(t.ins)?.nombre||'—'} (${nf(t.dosis,2)} ${uAbbr(ins(t.ins)?.unidad)}/ha)`).join(', '));
 if(r.items)add('Insumos',r.items.map(x=>`${ins(x.ins)?.nombre||'—'} (${nf(x.cant,2)} ${ins(x.ins)?.unidad||''})`).join(', '));
 if(r.tipo==='refertilizacion'&&r.ins)add('Producto',`${ins(r.ins)?.nombre} (${nf(r.dosis,1)}/ha)`);
 if(r.tipo==='ingreso_insumo'&&r.ins)add('Insumo',`${ins(r.ins)?.nombre} (${nf(r.cant,2)} ${ins(r.ins)?.unidad})`);
 add('Producto',r.producto);add('Detalle',r.detalle);
 if(r.prenadas!=null)add('Preñadas / vacías',`${r.prenadas} / ${r.vacias}`);
 if(r.tipo==='destete')add('Destetados',`${r.terneros||0} terneros, ${r.terneras||0} terneras`);
 if(r.kg)add('Peso promedio',nf(r.kg)+' kg');if(r.rinde)add('Rendimiento',nf(r.rinde)+' kg/ha');if(r.prod)add('Producción',nf(r.prod/1000,1)+' t');
 add('Observación',r.obs);add('Nivel',r.nivel);add('Labor',r.labor);
 if(r.monto)add('Monto',r.moneda==='USD'?'US$'+nf(r.monto):money(r.monto));if(r.costo)add('Costo',money(r.costo));
 add('Categoría',r.tipo==='gasto'||r.tipo==='ingreso'?r.categoria:'');add('Proveedor',r.proveedor||r.comprador);add('Campo',r.campo);
 add('Contratista',r.contratista);add('Causa',r.causa);if(r.temp!==''&&r.temp!=null)add('Temperatura',nf(r.temp,1)+' °C');add('Daño',r.dano);add('Notas',r.notas);
 return L}
const NW={un:1,una:1,uno:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10};
const N='(\\d[\\d.,]*|una|uno|un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)';
function num(s){if(s==null)return NaN;s=String(s).trim().replace(/^−/,'-');if(s in NW)return NW[s];if(s.includes(','))return parseFloat(s.replace(/\./g,'').replace(',','.'));if(/^-?\d{1,3}(\.\d{3})+$/.test(s))return parseFloat(s.replace(/\./g,''));return parseFloat(s)}
function catOf(w){w=norm(w);if(/^terneros?\/as/.test(w))return'Terneros';if(/^ternera/.test(w))return'Terneras';if(/^ternero/.test(w))return'Terneros';if(/^vaquillona/.test(w))return'Vaquillonas';if(/^vaca/.test(w))return'Vacas';if(/^toro/.test(w))return'Toros';if(/^novill/.test(w))return'Novillos';const c=CATS.find(c=>norm(c).replace(/s$/,'')===w.replace(/s$/,''));return c||null}
function fechaDe(l){if(/\banteayer\b/.test(l))return dAgo(2);if(/\bayer\b/.test(l))return dAgo(1);const m=l.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);if(m&&+m[2]<=12&&+m[1]<=31){let y=m[3]?+m[3]:AR().getUTCFullYear();if(y<100)y+=2000;return y+'-'+pad(m[2])+'-'+pad(m[1])}return hoy()}
function fechaFut(l){if(/pasado manana/.test(l))return dAgo(-2);if(/\bmanana\b/.test(l))return dAgo(-1);let m=l.match(/en (\d+) dias/);if(m)return dAgo(-m[1]);if(/proxima semana|semana que viene/.test(l))return dAgo(-7);const D=['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];for(let i=0;i<7;i++)if(new RegExp('\\b'+D[i]+'\\b').test(l)){const d=AR();return dAgo(-((i-d.getUTCDay()+7)%7||7))}m=l.match(/\b(\d{1,2})\/(\d{1,2})\b/);if(m)return AR().getUTCFullYear()+'-'+pad(m[2])+'-'+pad(m[1]);return hoy()}
function findPot(seg){const s=norm(seg);return[...S.potreros].sort((a,b)=>b.nombre.length-a.nombre.length).find(p=>new RegExp('(^|[^a-z0-9])'+reEsc(norm(p.nombre))+'($|[^a-z0-9])').test(s))}
function findIns(seg){const s=norm(seg);const L=[...S.insumos].sort((a,b)=>b.nombre.length-a.nombre.length);return L.find(i=>s.includes(norm(i.nombre)))||L.find(i=>norm(i.nombre).split(/\s+/).some(w=>w.length>4&&new RegExp('\\b'+reEsc(w)).test(s)))}
const findCrop=l=>[...S.cultivos].sort((a,b)=>b.length-a.length).find(c=>l.includes(norm(c)))||(/\bmaiz\b/.test(l)?'Maíz para grano':'');
function precio(l){const m=l.match(/\$\s*(\d[\d.,]*)\s*(mil|millones?|palos?)?/)||l.match(/(\d[\d.,]*)\s*(mil|millones?|palos?)?\s*(?:pesos|ars)\b/);if(!m)return 0;let v=num(m[1]);if(/mil$/.test(m[2]||''))v*=1e3;if(/millon|palo/.test(m[2]||''))v*=1e6;return v}
function catGasto(l){const M=[[/gasoil|combustible|nafta/,'Combustible'],[/veterin|vacun|sanidad|remedio/,'Sanidad'],[/semilla|fertiliz|urea|herbic|glifosato|agroquim|pulveriz|siembra|cosecha/,'Agricultura'],[/arrend|alquiler/,'Arrendamiento'],[/sueldo|jornal|emplead|peon/,'Personal'],[/reparac|repuesto|tractor|maquin|cubierta/,'Maquinaria'],[/alambr|poste|aguada|molino|tranquera/,'Estructura'],[/impuesto|afip|arca|arba|ater|inmobiliario/,'Impuestos'],[/hacienda|toro|vaca|ternero/,'Hacienda']];for(const[r,c]of M)if(r.test(l))return c;return'Otros'}
function catTarea(l){if(/vacun|desparasit|sanidad|tratamiento|veterin/.test(l))return'Sanidad';if(/sembr|cosech|pulveriz|aplicar|corte|fertiliz/.test(l)&&!/terner|vaca|toro|tropa/.test(l))return'Agricultura';if(/terner|vaca|toro|tropa|hacienda|mover|pesar|destet|tacto/.test(l))return'Ganadería';if(/arregl|repar|molino|alambr|revisar/.test(l))return'Mantenimiento';if(/pagar|factura|seguro|impuesto|banco/.test(l))return'Administración';return'Otros'}
let ORIG='',LOW='';
const O=sub=>{const i=LOW.indexOf(sub);return i<0?sub:ORIG.substr(i,sub.length)};
function interpretar(t){
 ORIG=t.trim();LOW=norm(ORIG);const l=LOW,f=fechaDe(l);let m;
 const potReq=()=>({error:'Primero cargá un potrero en la sección Potreros.'});
 if(m=l.match(/^(?:tarea|recordar|recordame|agendar|agenda|pendiente|hay que|tengo que|tenemos que)\s*[:,-]?\s*(.+)/)){const tx=cap(O(m[1]).replace(/\s+(el|este|para el)?\s*(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|ma[nñ]ana|pasado ma[nñ]ana|en \d+ d[ií]as|la semana que viene|la pr[oó]xima semana)\b.*$/i,''));return{tipo:'tarea',p:{texto:tx.endsWith('.')?tx:tx+'.',fecha:fechaFut(l),categoria:catTarea(l),pot:findPot(l)?.id||''}}}
 if(m=l.match(/^(?:nota|novedad|anotar|anota|anotame|observacion)\s*[:,-]?\s*(.+)/))return{tipo:'nota',p:{fecha:f,texto:cap(O(m[1]))}};
 if(/helad/.test(l)){const tt=l.match(/(-?\s*\d[\d.,]*)\s*(?:°|º|grados)/);return{tipo:'helada',p:{fecha:f,temp:tt?num(tt[1].replace(/\s/g,'')):'',dano:''}}}
 if(m=l.match(/\breg(?:amos|ue|aron|ar)\b.*?(\d[\d.,]*)\s*mm/)){const po=findPot(l);return{tipo:'riego',p:{fecha:f,mm:num(m[1]),lotes:po?[{pot:po.id,has:''}]:[]}}}
 if((m=l.match(/(\d[\d.,]*)\s*(?:mm|milimetros?)\b/))&&/(llov|lluvia|agua|pluvi|cayeron|cayo|registr|mm)/.test(l)){const pl=S.pluviometros.find(x=>l.includes(norm(x)))||S.pluviometros[0]||'Principal';return{tipo:'lluvia',p:{fecha:f,mm:num(m[1]),pluviometro:pl}}}
 if(/\btact/.test(l)){const pr=l.match(/(\d+)\s*(?:vacas\s+)?prenad/),va=l.match(/(\d+)\s*(?:vacas\s+)?vacias?/);if(pr||va){const po=findPot(l)||maxPot('Vacas');return{tipo:'tacto',p:{fecha:f,pot:po?.id||'',prenadas:pr?+pr[1]:0,vacias:va?+va[1]:0}}}}
 if(/destet/.test(l)){const t1=l.match(/(\d+)\s*terneros/),t2=l.match(/(\d+)\s*terneras/),kg=l.match(/(\d[\d.,]*)\s*(?:kg|kilos)/);const md=l.match(/\b(?:a|al|hacia)\s+((?:lote|corral|potrero|el|la)\b.*)$/);const d=md?findPot(md[1]):null;const rest=md?l.replace(md[0],''):l;const o=findPot(rest)||maxPot('Terneros');if(!o)return potReq();return{tipo:'destete',p:{fecha:f,pot:o.id,terneros:t1?+t1[1]:0,terneras:t2?+t2[1]:0,kg:kg?num(kg[1]):'',destino:d&&d!==o?d.id:''}}}
 if(m=l.match(new RegExp('nac(?:ieron|io|imientos? de)\\s+'+N+'\\s+([a-z/]+)'))){const cat=catOf(m[2])||'Terneros',po=findPot(l)||maxPot('Vacas');if(!po)return potReq();return{tipo:'nacimiento',p:{fecha:f,cant:num(m[1]),cat,pot:po.id}}}
 if(m=l.match(new RegExp('(?:abort\\w*)\\s+'+N)))return{tipo:'aborto',p:{fecha:f,cant:num(m[1]),pot:(findPot(l)||maxPot('Vacas'))?.id||'',causa:''}};
 if(m=l.match(new RegExp('(?:se murieron|se murio|murieron|murio|muerte de|perdimos)\\s+'+N+'\\s+([a-z/]+)'))){const cat=catOf(m[2]);if(cat){const po=findPot(l)||maxPot(cat);const c=l.match(/\bpor\s+(.+?)(?:\s+en\s+|$)/);return{tipo:'mortandad',p:{fecha:f,cant:num(m[1]),cat,pot:po?.id||'',causa:c?O(c[1]):''}}}}
 if(m=l.match(new RegExp('ajust\\w*\\s*(?:de\\s+)?([+-]|mas|menos)?\\s*'+N+'\\s+([a-z/]+)'))){const cat=catOf(m[3]);if(cat){const po=findPot(l)||maxPot(cat);if(!po)return potReq();return{tipo:'ajuste',p:{fecha:f,signo:m[1]==='-'||m[1]==='menos'?'-':'+',cant:num(m[2]),cat,pot:po.id}}}}
 if(m=l.match(new RegExp('\\b(vend|compr)\\w*\\s+'+N+'\\s+([a-z/]+)'))){const cat=catOf(m[3]),cant=num(m[2]);let monto=precio(l);if(monto&&/(c\/u|cada un|por cabeza|x cabeza)/.test(l))monto*=cant;const kg=l.match(/(\d[\d.,]*)\s*(?:kg|kilos)/);
  if(cat){const po=findPot(l)||(m[1]==='vend'?maxPot(cat):S.potreros[0]);if(!po)return potReq();return{tipo:m[1]==='vend'?'venta':'compra',p:{fecha:f,cant,cat,pot:po.id,monto,kg:kg?num(kg[1]):''}}}
  if(m[1]==='compr'){const i=findIns(l);if(i)return{tipo:'ingreso_insumo',p:{fecha:f,ins:i.id,cant,monto}}}}
 if(m=l.match(new RegExp('(?:recategoriz\\w*|pasaron|pasamos|pase)\\s+'+N+'\\s+([a-z/]+)\\s+a\\s+([a-z/]+)'))){const de=catOf(m[2]),a=catOf(m[3]);if(de&&a){const po=findPot(l)||maxPot(de);if(!po)return potReq();return{tipo:'recategorizacion',p:{fecha:f,cant:num(m[1]),de,a,pot:po.id}}}}
 if(m=l.match(new RegExp('\\b(?:salieron|sacamos|mandamos|entraron|ingresaron|trajimos|recibimos)\\s+'+N+'\\s+([a-z/]+)'))){const cat=catOf(m[2]);if(cat){const ent=/(entraron|ingresaron|trajimos|recibimos)/.test(l);const po=findPot(l)||(ent?S.potreros[0]:maxPot(cat));if(!po)return potReq();const c=l.match(/\b(?:al campo|campo|a la estancia|desde|hacia|para)\s+(?!lote|corral)([a-z ]+)$/);return{tipo:'traslado',p:{fecha:f,sentido:ent?'entrada':'salida',cant:num(m[1]),cat,pot:po.id,campo:c?cap(O(c[1]).replace(/^(el |la )?(campo|estancia)\s+/i,'')):''}}}}
 if(m=l.match(new RegExp('\\b(?:movi|movimos|movieron|mover|pase|pasamos|pasaron|traslad\\w*|lleve|llevamos|llevaron)\\s+'+N+'\\s+([a-z/]+)'))){const cat=catOf(m[2]);if(cat){const rest=l.slice(m.index+m[0].length);const mm=rest.match(/\b(?:de|del|desde)\s+(.+?)\s+(?:a|al|hacia|para)\s+(.+)/);let o,d;if(mm){o=findPot(mm[1]);d=findPot(mm[2])}else{const md=rest.match(/\b(?:a|al|hacia|para)\s+(.+)/);if(md)d=findPot(md[1])}o=o||maxPot(cat);if(!d)return{error:'¿A qué potrero los moviste? Probá: «Moví 20 vacas de Lote 1 a Lote 3».'};return{tipo:'movimiento',p:{fecha:f,cant:num(m[1]),cat,origen:o?.id||'',destino:d.id}}}}
 if(m=l.match(new RegExp('\\bpes(?:amos|e|aron|aje de)\\s+'+N+'\\s+([a-z/]+)'))){const cat=catOf(m[2]);const kg=l.match(/(\d[\d.,]*)\s*(?:kg|kilos)/);if(cat&&kg){const po=findPot(l)||maxPot(cat);return{tipo:'pesaje',p:{fecha:f,cant:num(m[1]),cat,kg:num(kg[1]),pot:po?.id||''}}}}
 if(m=l.match(/cosech\w*\s+(\d[\d.,]*)\s*(?:ha|has|hectareas?)\.?\s+(?:de\s+)?(.+)/)){const rr=l.match(/(\d[\d.,]*)\s*(kg|qq|quintales|t|tn|toneladas)\s*(?:\/|por)\s*(?:ha|hectarea)/)||l.match(/rind\w*\s+(\d[\d.,]*)\s*(kg|qq|quintales|t|tn|toneladas)/);let rinde=0;if(rr){rinde=num(rr[1]);if(/^q/.test(rr[2]))rinde*=100;if(/^t/.test(rr[2]))rinde*=1000}const po=findPot(m[2]);const c=findCrop(l)||cap(O(m[2].split(/\s+en\s+|\s+con\s+|,|\s+rind/)[0].trim()));return{tipo:'cosecha',p:{fecha:f,has:num(m[1]),cultivo:c,rinde,lotes:po?[{pot:po.id,has:num(m[1])}]:[],liberar:true}}}
 if(m=l.match(/sembr\w*\s+(\d[\d.,]*)\s*(?:ha|has|hectareas?)\.?\s+(?:de\s+)?(.+)/)){const po=findPot(m[2]);const c=m[2].split(/\s+en\s+|\s+con\s+|,|\s+el\s+|\s+ayer/)[0].trim();return{tipo:'siembra',p:{fecha:f,has:num(m[1]),cultivo:findCrop(norm(c))||cap(O(c)),lotes:po?[{pot:po.id,has:num(m[1])}]:[]}}}
 if(/pulveriz|fumig/.test(l)){const hm=l.match(/(\d[\d.,]*)\s*(?:ha|has|hectareas?)\b/);const po=findPot(l);const tr=[];S.insumos.forEach(i=>{const nm=reEsc(norm(i.nombre));const mm=l.match(new RegExp(nm+'\\s*(?:a|al|de|:)?\\s*(\\d[\\d.,]*)\\s*(?:[a-z]+)?\\s*(?:\\/|por)\\s*ha'))||l.match(new RegExp('(\\d[\\d.,]*)\\s*(?:[a-z]+)?\\s*(?:\\/|por)\\s*ha\\s*(?:de\\s+)?'+nm));if(mm)tr.push({ins:i.id,dosis:num(mm[1])})});const ct=l.match(/contratista\s+([a-z]+)/)||l.match(/\bcon\s+([a-z]+)\s*$/);const has=hm?num(hm[1]):'';if(!po&&!has)return{error:'Decime en qué potrero o cuántas hectáreas. Ejemplo: «Pulverizamos Lote 4 con glifosato 2 l/ha y 2,4 D 0,8 l/ha».'};return{tipo:'pulverizacion',p:{fecha:f,lotes:po?[{pot:po.id,has}]:[],has,cultivo:findCrop(l)||(po?.cultivos?.[0]||''),trat:tr,contratista:ct&&!findIns(ct[1])?cap(ct[1]):'',descontar:true}}}
 if(/monitore|recorri/.test(l)&&findPot(l)){const po=findPot(l);const ob=l.split(/[:—-]/).slice(1).join(' ').replace(/,?\s*(nivel|presion|infestacion)\s+\w+/,'').trim();return{tipo:'monitoreo',p:{fecha:f,lotes:[{pot:po.id,has:''}],cultivo:po.cultivos?.[0]||'',obs:ob?cap(O(ob)):'',nivel:/alto|fuerte|grave/.test(l)?'Alto':/medio/.test(l)?'Medio':/bajo|poco/.test(l)?'Bajo':''}}}
 if(m=l.match(/\b(?:use|usamos|usaron|utilice|utilizamos|aplique|aplicamos|aplicaron|gaste|gastamos|consumimos|se usaron|dimos)\s+(\d[\d.,]*)\s*([a-z]+)?\.?\s+de\s+(.+)/)){const i=findIns(m[3]);if(i)return{tipo:'uso_insumo',p:{fecha:f,items:[{ins:i.id,cant:num(m[1])}],pot:findPot(m[3])?.id||''}};return{error:`No encontré el insumo «${esc(O(m[3]).split(/\s+en\s+/)[0])}». Crealo en Insumos o revisá el nombre.`}}
 if(m=l.match(/\b(?:llegaron|ingresaron|ingrese|ingresamos|recibimos|entraron|compramos|compre)\s+(\d[\d.,]*)\s*([a-z]+)?\.?\s+de\s+(.+)/)){let i=findIns(m[3]);if(!i){const nom=cap(O(m[3]).split(/\s+(?:a|por|en)\s+|\$/)[0]);const u=(m[2]||'').toLowerCase();i={id:uid(),nombre:nom,unidad:/^l/.test(u)?'Litros':/^k/.test(u)?'Kilos':/^bols/.test(u)?'Bolsas':/^rol/.test(u)?'Rollos':'Unidades',categoria:'Sin categoría',minimo:0,precio:0,movs:[]};S.insumos.push(i)}return{tipo:'ingreso_insumo',p:{fecha:f,ins:i.id,cant:num(m[1]),monto:precio(l)}}}
 if(m=l.match(/\b(vacun|desparasit|tratamos|tratamiento|dosific|curamos)\w*/)){const po=findPot(l);const pr=l.match(/\bcon\s+(.+?)(?:\s+en\s+|\s+a\s+|$)/);const c=l.match(new RegExp(N+'\\s+([a-z/]+)'));const cat=c?catOf(c[2]):null;const prod=pr?cap(O(pr[1])):(m[1]==='vacun'?'Vacuna':m[1]==='desparasit'?'Antiparasitario':'Tratamiento');return{tipo:'tratamiento',p:{fecha:f,producto:prod,pot:po?.id||'',cant:cat?num(c[1]):'',cat:cat||'',detalle:cap(O(l.replace(/\bcon\s+.+$/,'').trim()))}}}
 if(/(gast|pague|pagamos|pago de|pagaron|factura|abone|abonamos|compre|compramos)/.test(l)){const usd=/(dolar|usd|u\$s|us\$)/.test(l);const mo=precio(l)||num((l.match(/(\d[\d.,]*)/)||[])[1]);if(mo){const d=(l.match(/\b(?:en|de|por|al?)\s+(?!\$)(.+)$/)||[])[1]||'';return{tipo:'gasto',p:{fecha:f,monto:mo,moneda:usd?'USD':'ARS',categoria:catGasto(l),desc:cap(O(d.replace(/\$\s*[\d.,]+\s*(mil|millones?)?/,'').replace(/\b(dolares|usd)\b/,'').trim())),iva:0}}}}
 if(/(cobr|nos pagaron|nos depositaron|ingreso de|vendimos)/.test(l)){const usd=/(dolar|usd|u\$s|us\$)/.test(l);const mo=precio(l)||num((l.match(/(\d[\d.,]*)/)||[])[1]);if(mo){const d=(l.match(/\b(?:por|de)\s+(?!\$)(.+)$/)||[])[1]||'';return{tipo:'ingreso',p:{fecha:f,monto:mo,moneda:usd?'USD':'ARS',categoria:/soja|maiz|trigo|grano|cosecha/.test(l)?'Granos':/terner|vaca|novill|hacienda/.test(l)?'Hacienda':'Otros',desc:cap(O(d)),iva:0}}}}
 return null;
}
const tbl=(h,rows,numCols=[])=>`<div class="scroll"><table><thead><tr>${h.map((x,i)=>`<th class="${numCols.includes(i)?'n':''}">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${numCols.includes(i)?'n':''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const goBtn=(h,t)=>`<p><a href="#${h}" class="btn s">${t}</a></p>`;
function preguntar(l){
 const mm=l.match(/(\d+)\s*mes/);const nM=mm?+mm[1]:null;
 if(/(tacto|prenez|prenad)/.test(l)){const L=regs('tacto');if(!L.length)return'Todavía no hay tactos registrados.';return'<b>Resultados de tacto</b>'+tbl(['Fecha','Potrero','Preñadas','Vacías','% preñez'],L.map(r=>{const t=+r.prenadas+ +r.vacias;return[fD(r.fecha),esc(potName(r.pot)),r.prenadas,r.vacias,t?nf(r.prenadas/t*100,1)+'%':'—']}),[2,3,4])}
 if(/(cosech|rinde|rendimiento)/.test(l)){const L=regs('cosecha');if(!L.length)return'Todavía no hay cosechas registradas.';return'<b>Cosechas</b>'+tbl(['Fecha','Cultivo','Ha','kg/ha','Total (t)'],L.map(r=>[fD(r.fecha),esc(r.cultivo),nf(sum(r.lotes||[],x=>x.has)||r.has,1),nf(r.rinde),nf((r.prod||0)/1000,1)]),[2,3,4])}
 if(/(pulveriz|aplicacion|fumig)/.test(l)){const L=regs('pulverizacion').slice(0,10);if(!L.length)return'No hay pulverizaciones registradas.';return'<b>Últimas pulverizaciones</b><ul>'+L.map(r=>`<li>${fD(r.fecha)} — ${esc(r.texto)}</li>`).join('')+'</ul>'}
 if(/insumo|producto|agroquim/.test(l)&&/(mas|usad|consum|gast)/.test(l)){const mes=nM||3,d=desde(mes*30);const L=S.insumos.map(i=>({i,c:stock(i,d).con,n:i.movs.filter(x=>x.tipo==='uso'&&x.fecha>=d).length})).filter(x=>x.c>0).sort((a,b)=>b.n-a.n||b.c-a.c).slice(0,8);if(!L.length)return`No hay usos de insumos registrados en los últimos ${mes} meses.`;return`<b>Insumos más usados en los últimos ${mes} meses</b>`+tbl(['Insumo','Usos','Consumo'],L.map(x=>[esc(x.i.nombre),x.n,nf(x.c,2)+' '+esc(x.i.unidad.toLowerCase())]),[1,2])+goBtn('analisis','Abrir análisis')}
 if(/(bajo (el )?minimo|reponer|faltan?|stock bajo|comprar)/.test(l)){const L=S.insumos.filter(i=>i.minimo>0&&stock(i).inv<i.minimo);if(!L.length)return'Ningún insumo está por debajo de su mínimo.';return`<b>${L.length} insumos por debajo del mínimo</b>`+tbl(['Insumo','Inventario','Mínimo'],L.map(i=>[esc(i.nombre),`<span class="neg">${nf(stock(i).inv,2)}</span>`,nf(i.minimo)+' '+esc(i.unidad.toLowerCase())]),[1,2])}
 const iq=findIns(l);if(iq&&/(stock|inventario|cuant|queda|hay)/.test(l)){const s=stock(iq),a=stock(iq,desde(365));return`Hay <b>${nf(s.inv,2)} ${esc(iq.unidad.toLowerCase())}</b> de ${esc(iq.nombre)}${iq.precio?` (unos ${money(Math.max(0,s.inv)*iq.precio)})`:''}. En los últimos 12 meses ingresaron ${nf(a.ing,2)} y se usaron ${nf(a.con,2)}.`}
 if(/(lluv|llovi|agua caida|milimetr|\bmm\b)/.test(l)){const L=regs('lluvia'),y=AR().getUTCFullYear()+'';const anio=sum(L.filter(r=>r.fecha.startsWith(y)),r=>r.mm),u12=sum(L.filter(r=>r.fecha>=desde(365)),r=>r.mm),u30=sum(L.filter(r=>r.fecha>=desde(30)),r=>r.mm);const ult=L[0];const ms=meses(6),v=porMes(L,r=>+r.mm,6);return`En ${y} llovieron <b>${nf(anio)} mm</b>; en los últimos 12 meses ${nf(u12)} mm y en los últimos 30 días ${nf(u30)} mm.${ult?` La última lluvia fue de ${nf(ult.mm,1)} mm el ${fD(ult.fecha)}.`:''}`+tbl(ms.map(m=>m.l),[v.map(x=>nf(x))],ms.map((_,i)=>i))}
 if(/(nacimiento|naciero|paricion|parto)/.test(l)){const L=regs('nacimiento'),o={};L.forEach(r=>{const y=r.fecha.slice(0,4);o[y]=(o[y]||0)+ +r.cant});const ks=Object.keys(o).sort().reverse();if(!ks.length)return'Todavía no hay nacimientos registrados.';return'<b>Nacimientos por año</b>'+tbl(['Año','Terneros'],ks.map(k=>[k,nf(o[k])]),[1])+goBtn('analisis','Ver curva de nacimientos')}
 if(/(mortandad|muert|murier)/.test(l)){const L=regs('mortandad').filter(r=>r.fecha>=desde(365));const t=sum(L,r=>r.cant);return`En los últimos 12 meses se registraron <b>${t} muertes</b> (${totAnimales()?nf(t/(totAnimales()+t)*100,1):0}% del rodeo).`+(L.length?tbl(['Fecha','Detalle'],L.map(r=>[fD(r.fecha),esc(r.texto)])):'')}
 if(/(descanso|pastoreo|potreros|estado de los lotes)/.test(l)&&!/(sembr|cultiv)/.test(l)){const L=[...S.potreros].sort((a,b)=>estado(b).d-estado(a).d);return'<b>Estado de los potreros</b>'+tbl(['Potrero','Estado','Días','Animales'],L.map(p=>{const e=estado(p);return[esc(p.nombre),e.pastoreo?'<span class="state p">Pastoreo</span>':'<span class="state d">Descanso</span>',e.d,e.t||'—']}),[2,3])+goBtn('mapa','Ver en el mapa')}
 if(/(carga|equivalente|ev\b|e\.v)/.test(l)){const ha=sum(S.potreros,p=>p.has);const ev=evDe(animalesPorCat());return`La carga del campo es de <b>${nf(ev/Math.max(1,ha),2)} EV/ha</b> (${nf(ev,1)} equivalentes vaca en ${nf(ha,1)} ha).`}
 if(/(animal|hacienda|cabeza|vaca|terner|toro|novill|vaquill|rodeo|stock)/.test(l)){const o=animalesPorCat();return`Hay <b>${nf(totAnimales())} animales</b> en el campo.`+tbl(['Categoría','Cabezas'],CATS.filter(c=>o[c]).map(c=>[c,nf(o[c])]),[1])+tbl(['Potrero','Cabezas'],S.potreros.filter(p=>total(p.animales)).map(p=>[esc(p.nombre),nf(total(p.animales))]),[1])}
 if(/(sembr|cultiv|superficie|hectar|siembra)/.test(l)){const o={};S.potreros.forEach(p=>(p.cultivos||[]).forEach(c=>o[c]=(o[c]||0)+(+p.has||0)));const ks=Object.keys(o).sort((a,b)=>o[b]-o[a]);return`<b>Superficie con cultivo: ${nf(sum(ks,k=>o[k]),1)} ha</b>`+tbl(['Cultivo','Hectáreas'],ks.map(k=>[esc(k),nf(o[k],1)]),[1])}
 if(/(gast|finanz|plata|ingres|egres|costo|pagar|cobrar|pago|resultado)/.test(l)){const mes=nM||12,d=desde(mes*30);const F=S.finanzas.filter(x=>x.fecha>=d&&x.fecha<=hoy());const g=F.filter(x=>x.tipo==='gasto'),i=F.filter(x=>x.tipo==='ingreso');const tg=sum(g,x=>fv(x,'ARS',true)),ti=sum(i,x=>fv(x,'ARS',true));const o={};g.forEach(x=>o[x.categoria]=(o[x.categoria]||0)+fv(x,'ARS',true));const ks=Object.keys(o).sort((a,b)=>o[b]-o[a]);const pend=S.finanzas.filter(x=>x.estado==='pendiente');return`En los últimos ${mes} meses (en pesos, con IVA): gastos <b>${money(tg)}</b>, ingresos <b>${money(ti)}</b>, resultado <b class="${ti-tg<0?'neg':''}">${money(ti-tg)}</b>.`+tbl(['Categoría','Gasto','%'],ks.slice(0,6).map(k=>[esc(k),money(o[k]),nf(o[k]/tg*100)+'%']),[1,2])+(pend.length?`<p>Hay ${pend.length} pagos o cobros pendientes.</p>`:'')+goBtn('finanzas','Abrir finanzas')}
 if(/(tarea|pendiente|hacer|agenda)/.test(l)){const L=S.tareas.filter(t=>!t.hecha).sort((a,b)=>a.fecha.localeCompare(b.fecha));if(!L.length)return'No hay tareas pendientes.';return`<b>${L.length} tareas pendientes</b><ul>${L.map(t=>`<li><span class="${t.fecha<hoy()?'late':''}">${fDc(t.fecha)}</span> — ${esc(t.texto)}${t.resp?` <span class="mute">(${esc(t.resp)})</span>`:''}</li>`).join('')}</ul>`}
 if(/(resumen|como (va|esta|vamos)|novedad|ultimos datos|semana)/.test(l)){const L=S.registros.slice(0,6);return`Hay ${nf(totAnimales())} animales en ${S.potreros.length} potreros, ${S.tareas.filter(t=>!t.hecha).length} tareas pendientes y ${S.insumos.filter(i=>i.minimo>0&&stock(i).inv<i.minimo).length} insumos bajo mínimo. Últimos datos:<ul>${L.map(r=>`<li>${fD(r.fecha)} — ${esc(r.texto)}</li>`).join('')}</ul>`}
 return null;
}
const AYUDA=`No llegué a entender eso. Puedo <b>registrar datos</b> y <b>responder preguntas</b> sobre tu campo. Probá con frases como «Llovieron 25 mm ayer», «Moví 20 vacas de Lote 1 a Lote 3» o «¿Qué insumos se usaron más en los últimos 3 meses?». En <a href="#ayuda">Ayuda</a> tenés la lista completa.`;
const NUMW=(()=>{const o={cero:0,un:1,uno:1,una:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12,trece:13,catorce:14,quince:15,dieciseis:16,diecisiete:17,dieciocho:18,diecinueve:19,veinte:20,veintiun:21,veintiuno:21,veintiuna:21,veintidos:22,veintitres:23,veinticuatro:24,veinticinco:25,veintiseis:26,veintisiete:27,veintiocho:28,veintinueve:29,treinta:30,cuarenta:40,cincuenta:50,sesenta:60,setenta:70,ochenta:80,noventa:90,cien:100,ciento:100,doscientos:200,doscientas:200,trescientos:300,trescientas:300,cuatrocientos:400,cuatrocientas:400,quinientos:500,quinientas:500,seiscientos:600,seiscientas:600,setecientos:700,setecientas:700,ochocientos:800,ochocientas:800,novecientos:900,novecientas:900};return o})();
function palabrasANum(t){const tk=String(t).split(/(\s+)/);const out=[];let i=0;const base=w=>w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[.,;:!?¿¡]+$/,'');
 const esN=w=>{const b=base(w);return b in NUMW||b==='mil'};
 while(i<tk.length){const w=tk[i];if(!w.trim()||!esN(w)){out.push(w);i++;continue}
  let j=i,tot=0,cur=0,words=0,end=i,last=-1;
  while(j<tk.length){const b=base(tk[j]);if(!tk[j].trim()){j++;continue}
   if(b==='y'&&last>=20&&last%10===0&&last<100){let k=j+1;while(k<tk.length&&!tk[k].trim())k++;const nb=k<tk.length?base(tk[k]):'';if(nb in NUMW&&NUMW[nb]>0&&NUMW[nb]<10){j=k;continue}break}
   if(b==='mil'){cur=(cur||1)*1000;tot+=cur;cur=0;last=1000;words++;end=j;j++;if(/[.,;:!?]$/.test(tk[end]))break;continue}
   if(!(b in NUMW))break;const v=NUMW[b];
   if(last!==-1&&!(v<last||(last===1000))&&!(last===100&&v<100))break;
   if(last!==-1&&last<10&&v<100)break;
   if(last>=10&&last<20)break;
   cur+=v;last=v;words++;end=j;j++;if(/[.,;:!?]$/.test(tk[end]))break}
  const val=tot+cur;const punct=(tk[end].match(/[.,;:!?]+$/)||[''])[0];
  if(words>1||val>10){// decimales: «veinticinco coma cinco»
   let k=end+1;while(k<tk.length&&!tk[k].trim())k++;
   if(!punct&&k<tk.length&&base(tk[k])==='coma'){let k2=k+1;while(k2<tk.length&&!tk[k2].trim())k2++;const d=k2<tk.length?base(tk[k2]):'';if(d in NUMW&&NUMW[d]<100){out.push(val+','+NUMW[d]+((tk[k2].match(/[.,;:!?]+$/)||[''])[0]));i=k2+1;continue}}
   out.push(String(val)+punct);i=end+1}else{out.push(w);i++}}
 return out.join('').replace(/\b(potrero|lote|corral|cuadro|parcela|piquete|monte|n[uú]mero|nro\.?)\s+(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/gi,(x,a,b)=>a+' '+NUMW[base(b)])}
function responder(t){t=palabrasANum(t);
 const l=norm(t);const q=/\?/.test(t)||/^(que|cuant|cual|como|donde|cuando|mostra|mostrame|lista|listame|ver|dame|decime|resumen|hay|quiero ver)\b/.test(l);
 if(!q&&!puede('editar'))return{html:'No puedo registrar datos nuevos porque el plan de este campo no está activo. Podés seguir preguntándome y viendo tus datos; para cargar, elegí un plan en Preferencias → Plan y suscripción.'};
 if(!q){const a=interpretar(t);if(a){if(a.error)return{html:a.error};const snap=JSON.stringify(Object.fromEntries(DATA.map(k=>[k,S[k]])));const tx=aplicar(a.tipo,a.p);if(!tx)return{html:'No pude registrarlo. Revisá los datos.'};return{html:`<b>Listo, quedó registrado.</b><br>${esc(tx)}`,undo:snap}}}
 return{html:preguntar(l)||AYUDA};
}
function fv(x,mon=S.config.moneda,iva=S.config.conIva){let v=+x.monto||0;if(iva&&x.iva)v*=1+x.iva/100;const tc=+S.config.tc||1;if(mon==='USD'&&x.moneda!=='USD')v/=tc;if(mon==='ARS'&&x.moneda==='USD')v*=tc;return v}
const fm=(v,mon=S.config.moneda)=>mon==='USD'?(v<0?'−US$':'US$')+nf(Math.abs(v)):money(v);
return{
 cargar(d){S=migrar(d);syncCats();return S},
 get S(){return S},
 set usuario(n){S.usuario=n},
 set via(v){VIA=v},
 set permitir(v){PUEDE=v},
 responder,AYUDA,DATA,hoy,fD,norm
};
}
