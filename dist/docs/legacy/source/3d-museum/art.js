import { colorGrid, DEBT_IMAGE, SCORE_GAPS, FORM_SOLUTION, SYMBOLS, COLOR_TARGET, FLOOR_SOLUTION, PAD_GLYPHS, WORKS } from './logic.js';
let ground=null;
export function setGround(image){ground=image;}
export function canvas(w=1024,h=768){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
const colors=['#151719','#d7554e','#547aad','#dad5c6'];
function bg(c,color='#e2ded4'){const x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,c.width,c.height);return x;}
function grid(x,data,ox,oy,size,gap=8){
 const n=data.length,unit=size/n;
 data.forEach((r,j)=>r.forEach((v,i)=>{
  const rgb=v.map(b=>b?225:17);x.fillStyle=`rgb(${rgb})`;x.fillRect(ox+i*unit+gap/2,oy+j*unit+gap/2,unit-gap,unit-gap);
 }));
}
export function drawMark(x,s,cx,cy,size,color='#d8ceaf'){
 x.save();x.translate(cx,cy);x.strokeStyle=x.fillStyle=color;x.lineWidth=Math.max(2,size*.045);x.lineCap='round';x.lineJoin='round';
 const path=points=>{x.beginPath();points.forEach(([a,b],i)=>i?x.lineTo(a*size,b*size):x.moveTo(a*size,b*size));x.stroke();};
 if(s==='○'){x.beginPath();x.arc(0,0,size*.33,0,Math.PI*2);x.stroke();}
 else if(s==='⌜')path([[-.3,.32],[-.3,-.32],[.3,-.32]]);
 else if(s==='⋈'){path([[-.34,-.34],[.34,.34],[.34,-.34],[-.34,.34],[-.34,-.34]]);}
 else if(s==='∴'){for(const [a,b] of [[0,-.24],[-.24,.23],[.24,.23]]){x.beginPath();x.arc(a*size,b*size,size*.055,0,7);x.fill();}}
 else if(s==='⊓')path([[-.3,.3],[-.3,-.3],[.3,-.3],[.3,.3]]);
 else if(s==='△')path([[0,-.37],[.36,.3],[-.36,.3],[0,-.37]]);
 else if(s==='—')path([[-.33,0],[.33,0]]);
 else if(s==='·'){x.beginPath();x.arc(0,0,size*.065,0,7);x.fill();}
 else if(s==='▰')x.fillRect(-size*.37,-size*.2,size*.74,size*.4);
 else if(s==='↔'){path([[-.4,0],[.4,0]]);path([[-.2,-.18],[-.4,0],[-.2,.18]]);path([[.2,-.18],[.4,0],[.2,.18]]);}
 else if(s==='↻'||s==='↶'){if(s==='↶')x.scale(-1,1);x.beginPath();x.arc(0,0,size*.3,-Math.PI*.85,Math.PI*.35);x.stroke();path([[-.29,-.06],[-.28,-.29],[-.06,-.27]]);}
 x.restore();
}
function type(x,s,cx,cy,size=20,color='#55534f',align='center'){if(['○','⌜','⋈','∴','⊓','—','△','·','↻','↶','↔','▰'].includes(s)){drawMark(x,s,cx,cy-size*.32,size,color);return;}x.fillStyle=color;x.font=`${size}px Arial`;x.textAlign=align;x.fillText(s,cx,cy);}
export function glyph(x,state,cx,cy,scale=65,col='#1d2020'){
 x.save();x.translate(cx,cy);x.rotate(-state*Math.PI/4);x.strokeStyle=col;x.lineWidth=scale*.14;x.lineCap='square';x.beginPath();x.moveTo(-scale*.55,scale*.42);x.lineTo(-scale*.55,-scale*.5);x.lineTo(scale*.55,-scale*.5);x.stroke();
 x.fillStyle='#b8322b';x.beginPath();x.arc(scale*.55,-scale*.5,scale*.11,0,Math.PI*2);x.fill();x.restore();
}
export function makeArt(kind,state) {
 const c=canvas();const x=bg(c);
 if(kind==='debt'){
   if(ground){x.globalAlpha=.55;x.drawImage(ground,0,0,c.width,c.height);x.globalAlpha=1;}
   x.fillStyle='rgba(225,221,211,.92)';x.fillRect(196,58,632,650);grid(x,DEBT_IMAGE,228,80,568,9);
   type(x,'I     /     EVERYTHING OWED',512,708,17);
 } else if(kind==='color') {
   bg(c,'#101216');grid(x,colorGrid(state.color),232,68,560,10);
   if(state.seals.color){x.fillStyle='#df4e42';x.fillRect(430,650,164,98);type(x,SYMBOLS[1],512,726,73,'#f5e8da');}
   else type(x,'R E V E R S I B L E     /     I — I I — I I I',512,705,17,'#858681');
 } else if(kind==='complement') {
   const sample=[[[1,0,0],[1,1,0],[0,0,0]],[[0,1,1],[1,0,1],[1,1,1]],[[1,1,0],[0,0,0],[0,1,0]]];
   grid(x,sample,74,190,376,12);grid(x,sample.map(r=>[...r].reverse().map(v=>v.map(a=>1-a))),574,190,376,12);
   x.strokeStyle='#77766e';x.lineWidth=1;x.beginPath();x.moveTo(512,100);x.lineTo(512,645);x.stroke();
   type(x,'OBVERSE',262,638,17);type(x,'REVERSE',762,638,17);
 } else if(kind==='score') {
   bg(c,'#ded8c8');
   for(let r=0;r<4;r++){
     x.strokeStyle='#a59e91';x.lineWidth=1;x.beginPath();x.moveTo(100,170+r*138);x.lineTo(900,170+r*138);x.stroke();
     for(let i=0;i<6;i++)if(SCORE_GAPS[i]!==3-r){x.fillStyle='#252a2d';x.beginPath();x.ellipse(150+i*145,170+r*138,25,31,-.2,0,Math.PI*2);x.fill();}
   }
   type(x,'ACUTO',956,160,14,'#6a655c');type(x,'GRAVE',956,590,14,'#6a655c');
   type(x,'THE UNPLAYED     /     SIX MOMENTS',512,704,17);
 } else if(kind==='return') {
   bg(c,'#c8c3b6');
   const shape=(i,px,py)=>{x.fillStyle=colors[i];if(i===0){x.fillRect(px-23,py-23,46,46);}if(i===1){x.beginPath();x.arc(px,py,29,0,7);x.fill();}if(i===2){x.beginPath();x.moveTo(px,py-34);x.lineTo(px+33,py+26);x.lineTo(px-33,py+26);x.closePath();x.fill();}if(i===3){x.fillStyle='#574e46';x.fillRect(px-33,py-8,66,16);}};
   x.strokeStyle='#a63e34';x.lineWidth=4;x.beginPath();x.moveTo(110,238);x.lineTo(810,238);x.bezierCurveTo(990,238,990,510,810,510);x.lineTo(110,510);x.stroke();
   for(let i=0;i<4;i++){shape(i,200+i*187,238);shape(i,200+i*187,510);}
   x.fillStyle='#a63e34';x.beginPath();x.moveTo(100,510);x.lineTo(136,491);x.lineTo(136,529);x.closePath();x.fill();
   type(x,'OUT',90,194,17);type(x,'BACK',90,567,17);
 } else if(kind==='plan'||kind==='form') {
   bg(c,'#d8cdb7');x.strokeStyle='#b7ac98';x.lineWidth=1;
   for(let i=0;i<24;i++){x.beginPath();x.moveTo(i*48,0);x.lineTo(i*48,768);x.stroke();}
   for(let i=0;i<17;i++){x.beginPath();x.moveTo(0,i*48);x.lineTo(1024,i*48);x.stroke();}
   for(let i=0;i<3;i++){glyph(x,(kind==='plan'?FORM_SOLUTION:state.form)[i],210+i*300,350,110);type(x,['I','II','III'][i],210+i*300,530,24);}
   type(x,kind==='plan'?'ELEVATIONS FROM THE WITNESS':'HINGED FRAGMENTS',512,680,16);
 } else if(kind==='weights') {
   bg(c,'#ded9cd');const a=[{x:260,h:390,c:'#416ca4',n:'COBALT'},{x:510,h:270,c:'#bd5545',n:'VERMILION'},{x:760,h:130,c:'#eae3cf',n:'CHALK'}];
   a.forEach(t=>{x.strokeStyle='#444';x.beginPath();x.moveTo(t.x,45);x.lineTo(t.x,t.h);x.stroke();x.fillStyle=t.c;x.fillRect(t.x-85,t.h,170,160);type(x,t.n,t.x,690,15);});
 } else if(kind==='chair') {
   bg(c,'#c9b7a1');x.strokeStyle='#464237';x.lineWidth=7;x.setLineDash([42,15]);x.strokeRect(354,230,316,316);x.setLineDash([]);
   x.beginPath();x.moveTo(512,280);x.lineTo(512,140);x.moveTo(492,165);x.lineTo(512,140);x.lineTo(532,165);x.stroke();type(x,'1.65 m',512,655,24);
 }
 if(!['debt','color','complement','score','return','plan','form','weights','chair'].includes(kind))extraArt(kind,x,c,state);
 return c;
}
export function plaqueCanvas(lines,{dark=false,red=false,width=1024,height=512,titleSize=40,bodySize=25}={}){
 const c=canvas(width,height),x=bg(c,dark?'#171c20':'#d6d3c8');
 x.textAlign='left';let y=titleSize+34;
 lines.forEach((s,i)=>{x.fillStyle=red?'#bb382e':dark?'#e6e0d4':'#282b2a';x.font=`${i===0?'600 '+titleSize:bodySize}px Arial`;x.fillText(s,58,y);y+=i===0?70:bodySize+18;});
 return c;
}

function extraArt(kind,x,c,state){
 const circle=(px,py,r,col)=>{x.fillStyle=col;x.beginPath();x.arc(px,py,r,0,Math.PI*2);x.fill();};
 const line=(a,b,col='#484943',w=3)=>{x.strokeStyle=col;x.lineWidth=w;x.beginPath();x.moveTo(...a);x.lineTo(...b);x.stroke();};
 const roman=['I','II','III','IV'];
 if(kind==='borrowed'){
  ['#e111c4','#e7d723','#26ced5','#e111c4'].forEach((col,i)=>{x.fillStyle=col;x.fillRect(90+i*220,215,182,280);type(x,String(i+1).padStart(2,'0'),181+i*220,550,18);});
  line([850,625],[175,625],'#a64134',3);line([175,625],[200,608],'#a64134',3);type(x,'BORROWED PRIMARIES / REVERSE ACCOUNT',512,710,18);
 }else if(kind==='white'){
  bg(c,'#111519');x.globalCompositeOperation='lighter';circle(437,315,155,'#d60000');circle(587,315,155,'#00d600');circle(512,448,155,'#0000d6');x.globalCompositeOperation='source-over';
  type(x,'RED  /  GREEN  /  BLUE',512,670,21,'#cfcdc3');
 }else if(kind==='counterproof'){
  COLOR_TARGET[0].forEach((v,i)=>{x.fillStyle=`rgb(${v.map(b=>b?225:17)})`;x.fillRect(80+i*178,270,155,155);});
  line([80,245],[80,215]);line([80,215],[115,215]);type(x,'UPPER EDGE  /  FIVE AGREEMENTS',512,580,22);
 }else if(kind==='blank'){
  bg(c,'#dedbd0');for(let i=0;i<120;i++){x.strokeStyle=i%3?'#e5e0d5':'#d8d3c8';x.lineWidth=1;x.beginPath();x.moveTo(0,i*7);x.lineTo(1024,i*7+3);x.stroke();}x.fillStyle='#a9956e';x.fillRect(995,280,10,220);
 }else if(kind==='inventory'){
  type(x,'1978',512,450,230,'#383c3b');type(x,'ACCESSION / WITHDRAWN',512,590,20);line([120,130],[920,635],'#a64b3b',7);
 }else if(kind==='receipt'||kind==='loft'){
  x.strokeStyle='#44534c';x.lineWidth=4;[[380,140,130,470],[180,220,200,160],[510,240,200,260],[180,380,200,140]].forEach(a=>x.strokeRect(...a));
  x.setLineDash([7,12]);x.strokeStyle='#a43c31';x.strokeRect(710,240,150,260);x.strokeRect(180,140,200,80);x.setLineDash([]);type(x,'UNACCOUNTED FOR',512,680,19);
 }else if(kind==='late'||kind==='arrivals'){
  bg(c,'#202b30');for(let i=0;i<4;i++){let y=150+i*150;line([150,y],[890,y],'#657c81',1);circle(210,y,14,'#c6d2c4');circle(420+i*118,y,14,'#b78860');type(x,roman[i],85,y+7,22,'#cfcec3');}
  type(x,'THE HAND                           THE ROOM',545,715,18,'#c5c7b9');
 }else if(kind==='intervals'){
  const ys=[310,530,200,420,200,310];for(let i=0;i<6;i++){circle(140+i*148,ys[i],22,'#262f31');if(i<5)line([140+i*148,ys[i]],[288+i*148,ys[i+1]],'#61665e',2);}type(x,'−2        +3        −2        +2        −1',512,640,28);
 }else if(kind==='quiet'){
  bg(c,'#1c292e');x.strokeStyle='#b8a889';x.lineWidth=2;x.beginPath();x.arc(512,384,225,0,Math.PI*2);x.stroke();for(let i=0;i<8;i++){let a=i*Math.PI/4;circle(512+225*Math.cos(a),384+225*Math.sin(a),7,'#ddd4b8');}type(x,'0',512,420,100,'#b8a889');
 }else if(kind==='firstAudience'){
  bg(c,'#cdc6b6');for(let i=0;i<6;i++){circle(145+i*148,[300,190,520,410,190,410][i],26,'#303632');}line([80,110],[940,650],'#a63831',14);type(x,'WITHDRAWN',512,705,20,'#a63831');
 }else if(kind==='unsuitable'){
  bg(c,'#d2c8b4');const pt=[[-1,-1],[1,-1],[-1,1],[1,1]].map(([a,b])=>[512-a*180,345-b*180]);
  FLOOR_SOLUTION.forEach((n,i)=>{if(i)line(pt[FLOOR_SOLUTION[i-1]],pt[n],'#a64838',4);});
  pt.forEach(([a,b],i)=>{circle(a,b,44,'#d2c8b4');type(x,PAD_GLYPHS[i],a,b+12,48,'#222d2b');});
  line([850,520],[850,645]);line([850,645],[838,620]);line([850,645],[862,620]);type(x,'N',850,690,20);type(x,'NORTH IS BELOW THE PLAN',400,690,18);
 }else if(kind==='stations'){
  FLOOR_SOLUTION.forEach((i,k)=>type(x,PAD_GLYPHS[i],180+k*220,420,105,'#2d3432'));type(x,'POINT     /     LINE     /     CORNERS     /     NONE',512,620,18);
 }else if(kind==='hourglass'){
  line([315,180],[710,180],'#252d2c',8);line([315,180],[710,580],'#252d2c',8);line([710,180],[315,580],'#252d2c',8);line([315,580],[710,580],'#252d2c',8);type(x,'NO SAND / NO DURATION',512,690,19);
 }else if(kind==='withdrawn'){
  glyph(x,5,512,350,160);line([200,120],[820,610],'#a94132',8);type(x,'IV / REJECTED',512,690,20);
 }else if(kind==='lantern'){
  bg(c,'#303b37');for(let i=0;i<9;i++){x.fillStyle='#d4bf89';x.fillRect(110+i*95,170,12+(i%3)*13,430);}type(x,'THE INTERVAL IS THE MATERIAL',512,690,19,'#e0d7ba');
 }else if(kind==='color-gate'||kind==='echo-gate'||kind==='floor-display'||kind==='sound-panel'||kind==='security-screen'){
  bg(c,'#101b1e');let seq,solved,label;
  if(kind==='color-gate'){seq=state.colorEntry.map(v=>['R','G','B'][v]);solved=state.colorLab;label='FOUR PAYMENTS';}
  if(kind==='echo-gate'){seq=state.echoEntry.map(v=>roman[v]);solved=state.soundLab;label='ORDER OF ARRIVAL';}
  if(kind==='floor-display'){seq=state.floorEntry.map(v=>PAD_GLYPHS[v]);solved=state.formLab;label='A WALK WITH FOUR STATIONS';}
  if(kind==='sound-panel'){seq=state.soundEntry.map(v=>roman[[3,0,2,1].indexOf(v)]);solved=state.seals.sound;label='THE SECOND AUDIENCE';}
  if(kind==='security-screen'){seq=state.code.map(v=>SYMBOLS[v]);solved=state.balcony;label='COLLECTION CIRCUIT';}
  const n=kind==='sound-panel'?6:kind==='security-screen'?3:4;
  type(x,label,512,150,24,'#abbdb4');for(let i=0;i<n;i++)type(x,seq[i]||'·',120+(784/(n-1))*i,400,80,solved?'#e1bf83':'#b5c6c3');
  type(x,solved?(kind==='sound-panel'?SYMBOLS[0]:'RELEASED'):'',512,650,kind==='sound-panel'?130:30,'#d78061');
 }
}
function wrapped(x,text,maxWidth,font,lineHeight,startX,startY){
 x.font=font;let y=startY;
 for(const para of text.split('\n')){if(!para){y+=lineHeight*.5;continue;}let line='';for(const word of para.split(/\s+/)){const next=line?line+' '+word:word;if(x.measureText(next).width>maxWidth&&line){x.fillText(line,startX,y);y+=lineHeight;line=word;}else line=next;}x.fillText(line,startX,y);y+=lineHeight;}
 return y;
}
export function workCardCanvas(key){
 const w=typeof key==='string'?WORKS[key]:key;
 const tall=w.text.length>400;const c=canvas(1200,tall?1450:1000),x=bg(c,'#e8e2d4');x.textAlign='left';x.textBaseline='alphabetic';
 x.fillStyle='#a94436';x.fillRect(72,70,45,5);x.font='18px Arial';x.fillText('PUZZLE PIECES / COLLECTION',140,79);
 x.fillStyle='#202b2b';let y=wrapped(x,w.title,1056,'600 52px Georgia',62,72,175);
 y=wrapped(x,w.artist,1056,'30px Arial',40,72,y+25);x.fillStyle='#62675e';y=wrapped(x,w.meta,1056,'25px Arial',34,72,y+10);
 x.fillStyle='#b9b8a9';x.fillRect(72,y+17,1056,1);x.fillStyle='#303b36';c.paperBottom=wrapped(x,w.text,1056,'32px Georgia',47,72,y+82);
  if(tall){x.strokeStyle='#a94436';x.lineWidth=2;x.strokeRect(28,28,1144,c.height-56);x.fillStyle='#a94436';x.fillRect(72,c.height-105,45,5);}
 x.fillStyle='#737969';x.font='18px Arial';x.fillText('AFTER HOURS / PLEASE LOOK CLOSELY',72,c.height-49);return c;
}
export function buttonCanvas(label,color='#d8ceaf'){
 const c=canvas(256,256),x=bg(c,'#202b2c');x.strokeStyle=color;x.lineWidth=3;x.strokeRect(12,12,232,232);type(x,label,128,164,label.length>2?50:100,color);return c;
}
