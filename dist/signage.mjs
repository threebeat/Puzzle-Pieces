import * as T from './vendor/three.module.js';
import {ROOMS,DOORS,WINDOWS,EXHIBITS,DESK,STAIR,deskOutline} from './layout.mjs';
const PI=Math.PI;
const wall=(id,axis,at,normal,along,y,w,h,content)=>({id,mount:'wall',axis,at,normal,along,y,w,h,...content});
export const SIGNS=[
 wall('north-wayfinding','x',-12,1,-26,2.05,2.6,1.05,{kind:'direction',eyebrow:'00 / NORTH',title:'Northern arcade',body:'Hidden Operators · Café',arrow:'left'}),
 wall('south-wayfinding','x',12,-1,26.1,2.05,2.8,1.05,{kind:'direction',eyebrow:'00 / SOUTH',title:'Southern arcade',body:'Gift shop · Elevators',arrow:'left'}),
 wall('east-closure','x',12,-1,-26,2.05,2.6,1.05,{kind:'direction',eyebrow:'00 / EAST',title:'Eastern arcade',body:'Temporarily closed',target:'east'}),
 wall('hidden-entrance','z',-25,1,-37,1.9,3.8,2.2,{kind:'exhibit',code:'01',title:'Hidden\nOperators',body:EXHIBITS.hidden.description,accent:EXHIBITS.hidden.color,target:'hidden'}),
 wall('rebirth-entrance','x',-12,1,24.5,2.0,3.0,2.3,{kind:'exhibit',code:'02',title:'Days of\nRebirth',body:EXHIBITS.rebirth.description,accent:EXHIBITS.rebirth.color,target:'rebirth'}),
 wall('cross-entrance','x',-12,1,15,6.5,3.0,2.3,{kind:'exhibit',code:'03',title:'Cross/Hatch',body:EXHIBITS.cross.description,accent:EXHIBITS.cross.color,target:'cross'}),
 wall('cafe-door','z',-19,-1,-35.5,2.0,2.4,.85,{kind:'direction',eyebrow:'N.01',title:'Café',body:'Northern arcade',arrow:'left'}),
 wall('gift-door','z',18,1,20.4,2.0,1.7,.85,{kind:'direction',eyebrow:'S.01',title:'Gift shop',body:'Southern arcade',arrow:'left'}),
 wall('security-closure','z',24,-1,28.5,1.9,1.8,1.2,{kind:'direction',eyebrow:'STAFF ONLY',title:'Security',body:'No public access',target:'security'}),
 wall('lift-bank','x',30,-1,21,3.65,3.6,.65,{kind:'strip',title:'Elevators',body:'Service suspended'}),
 wall('stair-wayfinding','z',36,-1,-7.8,6.2,4.2,1.2,{kind:'direction',eyebrow:'01 / UPPER FLOOR',title:'West mezzanine',body:'03  Cross/Hatch',arrow:'up'}),
 wall('north-map','z',-19,-1,-21,1.9,4,2.6,{kind:'map',eyebrow:'VISITOR INFORMATION',title:'Museum plan',target:'map'}),
 ...ROOMS.filter(r=>r.type==='gallery').map(r=>wall('room-'+r.id,'z',r.z2,-1,r.x1+3,r.floor+1.7,2.3,.85,{kind:'direction',eyebrow:'GALLERY '+r.code,title:r.name,body:EXHIBITS[r.exhibit].name})),
 ...[-1,1].flatMap((side,i)=>[-7,7].map((z,j)=>({id:'classical-'+(i*2+j+1),mount:'fixture',support:'plinth',x:side*10,y:.36,z:z+.69,rot:0,w:.78,h:.25,kind:'caption',eyebrow:'HALL COLLECTION',title:'Study '+String(i*2+j+1).padStart(2,'0')}))),
 {id:'bronze-caption',mount:'floor',x:2.8,y:1.15,z:-23.7,rot:0,w:1.35,h:.65,kind:'caption',eyebrow:'HALL COLLECTION',title:'A Space Held Open',body:'Bronze study',target:'statue'},
 {id:'desk-name',mount:'fixture',support:'counter',x:0,y:.72,z:2.72,rot:0,w:1.65,h:.30,kind:'strip',title:'Information'},
 {id:'desk-screen',mount:'fixture',support:'monitor',x:0,y:1.78,z:DESK.monitorZ+.05,rot:0,w:.84,h:.52,kind:'screen',eyebrow:'VISITOR SERVICES',title:'The Main Hall',body:'Hall lighting · Connected'}
];
export function signPose(s){
 if(s.mount==='wall')return {x:s.axis==='x'?s.at+s.normal*.15:s.along,z:s.axis==='z'?s.at+s.normal*.15:s.along,y:s.y,rot:s.axis==='x'?s.normal*PI/2:s.normal===1?0:PI};
 return {x:s.x,y:s.y,z:s.z,rot:s.rot||0};
}
function wrap(c,text,width){const lines=[];for(const paragraph of text.split('\n')){let line='';for(const word of paragraph.split(' ')){const next=line?line+' '+word:word;if(line&&c.measureText(next).width>width){lines.push(line);line=word;}else line=next;}lines.push(line);}return lines;}
// All measured text is fitted before painting; the same painter supplies the game and documentation samples.
export function paintSign(c,s,W,H){
 const p=W*.075,ink=s.kind==='screen'?'#f1f1e8':'#243b33',muted=s.kind==='screen'?'#bcccbf':'#59675f',paper=s.kind==='screen'?'#233c32':'#eeeee6',accent=s.accent||'#6f8272';
 c.fillStyle=paper;c.fillRect(0,0,W,H);c.textAlign='left';c.textBaseline='alphabetic';const placed=[];
 const text=(value,x,y,width,size,weight=400,color=ink,maxHeight=H-y-p)=>{
  let rows;do{c.font=`${weight} ${size}px Arial, Helvetica, sans-serif`;rows=wrap(c,value,width);if(rows.length*size*1.25<=maxHeight||size<=8)break;size-=.5;}while(true);
  c.fillStyle=color;rows.forEach((row,i)=>{c.fillText(row,x,y+size+i*size*1.25);placed.push({text:row,x,y:y+i*size*1.25,width:c.measureText(row).width,height:size*1.25});});return y+rows.length*size*1.25;
 };
 const rule=y=>{c.fillStyle='#bac3b7';c.fillRect(p,y,W-p*2,Math.max(1,W*.0015));};
 if(s.kind==='map'){
  text(s.eyebrow,p,p*.75,W-p*2,W*.019,500,muted,H*.1);text(s.title,p,p*1.3,W-p*2,W*.054,500,ink,H*.15);rule(H*.23);
  const scale=(H*.65)/90,ox=W*.32,oz=H*.30+54*scale,X=x=>ox+x*scale,Z=z=>oz+z*scale;
  for(const r of ROOMS.filter(r=>r.floor===0)){c.fillStyle=r.locked?'#d6d8cf':r.exhibit?'#b5c4b0':'#e0e3d8';c.fillRect(X(r.x1),Z(r.z1),(r.x2-r.x1)*scale,(r.z2-r.z1)*scale);c.strokeStyle='#778a78';c.lineWidth=1;c.strokeRect(X(r.x1),Z(r.z1),(r.x2-r.x1)*scale,(r.z2-r.z1)*scale);if(r.exhibit){c.font=`500 ${W*.015}px Arial`;c.fillStyle=ink;c.textAlign='center';c.fillText(r.code,X((r.x1+r.x2)/2),Z((r.z1+r.z2)/2));c.textAlign='left';}}
  for(const d of DOORS.filter(d=>d.y===0)){c.strokeStyle=d.locked?'#a27c5c':paper;c.lineWidth=3;c.beginPath();c.moveTo(X(d.axis==='x'?d.at:d.from),Z(d.axis==='z'?d.at:d.from));c.lineTo(X(d.axis==='x'?d.at:d.to),Z(d.axis==='z'?d.at:d.to));c.stroke();}
  c.fillStyle='#b5b7a5';for(const f of [...STAIR.flights,STAIR.landing])c.fillRect(X(f.x1),Z(f.z1),(f.x2-f.x1)*scale,(f.z2-f.z1)*scale);c.strokeStyle=ink;c.lineWidth=1.3;c.beginPath();c.moveTo(X(-6),Z(26));c.lineTo(X(-6),Z(33.5));c.lineTo(X(-10),Z(33.5));c.lineTo(X(-10),Z(26));c.stroke();
  c.fillStyle=accent;c.beginPath();deskOutline().forEach(([x,z],i)=>i?c.lineTo(X(x),Z(z)):c.moveTo(X(x),Z(z)));c.closePath();c.fill();c.fillStyle='#a1794c';c.beginPath();c.arc(X(-21),Z(-20),3.5,0,PI*2);c.fill();
  text('00 / Ground floor',W*.67,H*.32,W*.26,W*.024,500);text('01  Hidden Operators\n02  Days of Rebirth\n\nCafé\nGift shop\n\n03  Cross/Hatch\nUpper floor',W*.67,H*.42,W*.26,W*.020,400,muted,H*.44);text('●  You are here',W*.67,H*.88,W*.26,W*.018,500,'#826342',H*.08);
  text('N ↖',W*.67,H*.25,W*.22,W*.023,500,ink,H*.06);
 }else if(s.kind==='exhibit'){
  text('EXHIBITION',p,p,W-p*2,W*.024,500,muted,H*.08);
  text(s.code,p,H*.23,W*.19,W*.15,400,accent,H*.27);
  const titleEnd=text(s.title,W*.29,H*.22,W*.63,W*.064,500,ink,H*.29);
  const lineY=Math.max(H*.54,titleEnd+H*.04);rule(lineY);
  text(s.body,p,lineY+H*.045,W-p*2,W*.029,400,ink,H-lineY-H*.11);
 }else if(s.kind==='strip'){
  const hasBody=!!s.body;text(s.title,p,H*.20,hasBody?W*.48:W-p*2,Math.min(H*.43,W*.088),500,ink,H*.65);
  if(hasBody)text(s.body,W*.56,H*.31,W*.36,H*.22,400,muted,H*.50);
 }else{
  const top=H*.13,kickerSize=Math.min(W*.025,H*.12),arrowSpace=s.arrow?W*.12:0;
  text(s.eyebrow||'PUZZLE PIECES',p,top,W-p*2-arrowSpace,kickerSize,500,muted,H*.17);
  const titleSize=Math.min(W*.065,H*(s.body?.25:.33)),titleY=top+H*.21;
  const end=text(s.title,p,titleY,W-p*2-arrowSpace,titleSize,500,ink,H*.36);
  if(s.body)text(s.body,p,Math.max(end+H*.05,H*.70),W-p*2,W*.031,400,muted,H*.21);
  if(s.arrow){const x=W-p-W*.035,y=H*.44,r=W*.035;c.strokeStyle=ink;c.lineWidth=W*.004;c.beginPath();if(s.arrow==='up'){c.moveTo(x,y+r);c.lineTo(x,y-r);c.moveTo(x-r*.65,y-r*.25);c.lineTo(x,y-r);c.lineTo(x+r*.65,y-r*.25);}else{c.moveTo(x+r,y);c.lineTo(x-r,y);c.moveTo(x-r*.25,y-r*.65);c.lineTo(x-r,y);c.lineTo(x-r*.25,y+r*.65);}c.stroke();}
 }
 return {lines:placed,overflow:placed.filter(r=>r.x<0||r.x+r.width>W+.1||r.y+r.height>H+.1)};
}
function atlas(){
 const size=2048,pages=[],slots=new Map();const entries=SIGNS.map(s=>({s,w:s.kind==='map'?768:480,h:Math.ceil((s.kind==='map'?768:480)*s.h/s.w)})).sort((a,b)=>b.h-a.h);
 for(const {s,w,h} of entries){let page,shelf;
  for(const candidate of pages){const found=candidate.shelves.find(row=>h+8<=row.height&&row.x+w+8<=size);if(found){page=candidate;shelf=found;break;}if(candidate.used+h+8<=size){page=candidate;shelf={x:0,y:page.used,height:h+8};page.used+=h+8;page.shelves.push(shelf);break;}}
  if(!page){const canvas=document.createElement('canvas');canvas.width=canvas.height=size;page={canvas,ctx:canvas.getContext('2d'),shelves:[],used:h+8};shelf={x:0,y:0,height:h+8};page.shelves.push(shelf);pages.push(page);}
  const x=shelf.x+4,y=shelf.y+4;shelf.x+=w+8;page.ctx.save();page.ctx.translate(x,y);const layout=paintSign(page.ctx,s,w,h);page.ctx.restore();slots.set(s.id,{page,x,y,w,h,layout});
 }
 for(const page of pages){const tex=new T.CanvasTexture(page.canvas);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;page.material=new T.MeshStandardMaterial({map:tex,roughness:.95});page.screenMaterial=new T.MeshBasicMaterial({map:tex});}
 return {pages,slots,size};
}
export function installSignage(w){
 const sheet=atlas();w.signs=[];w.signAtlasPages=sheet.pages.length;
 for(const s of SIGNS){const pose=signPose(s),g=new T.Group();g.position.set(pose.x,pose.y,pose.z);g.rotation.y=pose.rot;w.scene.add(g);const screen=s.kind==='screen',depth=screen?.006:.055;
  // The back plate intersects its mounting surface; no detached floating sheets.
  if(!screen)w.mesh(new T.BoxGeometry(s.w+.018,s.h+.018,depth),'smokedMetal',0,0,depth/2-.005,g);
  const slot=sheet.slots.get(s.id),geo=new T.PlaneGeometry(s.w,s.h),uv=geo.attributes.uv;
  for(let i=0;i<uv.count;i++)uv.setXY(i,(slot.x+uv.getX(i)*slot.w)/sheet.size,1-(slot.y+(1-uv.getY(i))*slot.h)/sheet.size);
  const face=w.mesh(geo,screen?slot.page.screenMaterial:slot.page.material,0,0,screen?.004:depth,g);face.castShadow=false;
  if(s.mount==='floor'){
   w.cyl(pose.x,.025,pose.z,.25,.05,'smokedMetal');w.box(pose.x,pose.y/2,pose.z+.015,.045,pose.y,.045,'smokedMetal');
   w.colliders.push({x1:pose.x-.26,x2:pose.x+.26,z1:pose.z-.26,z2:pose.z+.26,y1:0,y2:pose.y});w.colliders.push({x1:pose.x-s.w/2,x2:pose.x+s.w/2,z1:pose.z-.025,z2:pose.z+.065,y1:pose.y-s.h/2,y2:pose.y+s.h/2});
  }
  if(s.support==='counter')for(const x of [-.55,.55])w.tube([[x,pose.y,Math.sqrt(DESK.radius**2-x**2)-.02],[x,pose.y,pose.z+.025]],.018,'smokedMetal');
  if(s.target)w.target(s.target,pose.x+Math.sin(pose.rot)*.09,pose.y,pose.z+Math.cos(pose.rot)*.09,s.kind==='exhibit'?2:s.kind==='map'?2.3:1.3);
  w.signs.push({...s,pose,textLayout:slot.layout,mesh:face});
 }
}
