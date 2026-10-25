import * as T from './vendor/three.module.js';
import {mergeGeometries} from './vendor/BufferGeometryUtils.js';
import {ROOMS,DOORS,WINDOWS,PARTITIONS,EXHIBITS,STAIR,floorAt,contains} from './layout.mjs';
import {sculpture} from './sculptures.mjs';
import {installMaterials,reflectionEnvironment,fern as detailedFern,details,QUALITY} from './visuals.mjs';
const PI=Math.PI;
function texture(paint,w=512,h=512){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
function lines(ctx,str,x,y,width,size,line=1.45){ctx.font=`${size}px Georgia`;let row='',yy=y;for(const word of str.split(' ')){const next=row+word+' ';if(ctx.measureText(next).width>width&&row){ctx.fillText(row,x,yy);yy+=size*line;row=word+' ';}else row=next;}ctx.fillText(row,x,yy);}
export class Museum {
 constructor(canvas,{headless=false}={}){
  this.canvas=canvas;this.scene=new T.Scene();this.scene.background=new T.Color('#d8dfd6');this.scene.fog=new T.Fog('#d6ddd0',65,145);this.colliders=[];this.targets=[];
  this.renderer=null;this.planView=false;
  if(!headless){try{const context=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});if(!context)throw Error('3D unavailable');this.renderer=new T.WebGLRenderer({canvas,context,antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.setSize(innerWidth,innerHeight);this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.14;}catch{this.planView=true;this.ctx=canvas.getContext('2d');if(!this.ctx)throw Error('No drawing context available');}}
  this.camera=new T.PerspectiveCamera(65,innerWidth/innerHeight,.08,160);this.camera.rotation.order='YXZ';this.camera.position.set(4,2,18);this.camera.rotation.y=.10;
  this.m={};const mat=(key,color,extra={})=>this.m[key]=new T.MeshStandardMaterial({color,roughness:.84,...extra});
  mat('plaster','#d9d9c9');mat('olive','#a7b5a0');mat('molding','#c5cabb');mat('stone','#b4b9a7');mat('limestone','#d3cfbe');mat('marble','#dbd8c9');mat('marbleShade','#aaa99b');mat('smokedMetal','#30463b',{metalness:.4,roughness:.5});mat('brass','#9e8760',{metalness:.65,roughness:.35});mat('dark','#243e34');mat('oak','#8f7453');mat('velvet','#5d7059');mat('leaf','#557257');mat('leaf2','#719071');mat('pot','#a7a692');mat('black','#232e28');mat('bronze','#4f6555',{metalness:.68,roughness:.32});
  this.m.glass=new T.MeshStandardMaterial({color:'#e4ebdc',transparent:true,opacity:.13,roughness:.2,metalness:.15,depthWrite:false});this.m.light=new T.MeshBasicMaterial({color:'#f6e7b6'});this.m.sky=new T.MeshBasicMaterial({color:'#e1e7d9'});
  installMaterials(this);
  this.scene.add(new T.HemisphereLight('#e4eee9','#887956',1.35));
  const bounce=new T.DirectionalLight('#e7eede',.55);bounce.position.set(4,8,-30);this.scene.add(bounce);
  const sun=new T.DirectionalLight('#fff3d3',3.1);sun.position.set(-12,24,-43);sun.target.position.set(7,0,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-45,right:45,top:48,bottom:-48,near:1,far:120});sun.shadow.bias=-.00015;sun.shadow.normalBias=.025;this.sun=sun;this.scene.add(sun,sun.target);
  this.buildArchitecture();this.buildFurnishings();details(this);this.batch();reflectionEnvironment(this);
  this.quality='balanced';if(this.renderer){this.renderer.shadowMap.autoUpdate=false;this.renderer.shadowMap.needsUpdate=true;}
  this.ray=new T.Raycaster();this.resize=()=>{if(this.renderer)this.renderer.setSize(innerWidth,innerHeight);else if(!headless){canvas.width=innerWidth*Math.min(devicePixelRatio,1.5);canvas.height=innerHeight*Math.min(devicePixelRatio,1.5);}this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();};window.addEventListener('resize',this.resize);this.resize();this.setQuality('balanced');
 }
 mesh(geo,mat,x=0,y=0,z=0,parent=this.scene){const m=new T.Mesh(geo,typeof mat==='string'?this.m[mat]:mat);m.position.set(x,y,z);m.castShadow=!m.material.transparent&&m.material!==this.m.sky&&m.material!==this.m.light;m.receiveShadow=true;parent.add(m);return m;}
 box(x,y,z,w,h,d,mat='plaster',solid=false){const geo=new T.BoxGeometry(w,h,d);const material=typeof mat==='string'?this.m[mat]:mat;if(material?.map&&!material.transparent){const pos=geo.attributes.position,n=geo.attributes.normal,uv=geo.attributes.uv;for(let i=0;i<pos.count;i++){const nx=Math.abs(n.getX(i)),ny=Math.abs(n.getY(i)),nz=Math.abs(n.getZ(i));uv.setXY(i,(nx>ny&&nx>nz?pos.getZ(i):pos.getX(i))*.65,(ny>nx&&ny>nz?pos.getZ(i):pos.getY(i))*.65);}}const m=this.mesh(geo,mat,x,y,z);if(solid)this.colliders.push({x1:x-w/2,x2:x+w/2,z1:z-d/2,z2:z+d/2,y1:y-h/2,y2:y+h/2});return m;}
 cyl(x,y,z,r,h,mat='stone'){return this.mesh(new T.CylinderGeometry(r,r,h,32),mat,x,y,z);}
 shadow(x,z,w,d,y=.012){const m=this.mesh(new T.PlaneGeometry(w,d),this.m.shadow,x,y,z);m.rotation.x=-PI/2;m.castShadow=false;}
 label(key,x,y,z,rot=0){return this.sign(['STUDY / '+key.replace('study-','')],x,y,z,.7,.25,rot);}
 sign(text,x,y,z,w,h,rot=0,style={}){
  const tex=texture((c,W,H)=>{c.fillStyle=style.dark?'#2b4438':'#e5e6d8';c.fillRect(0,0,W,H);c.strokeStyle=style.dark?'#839380':'#a4af9f';c.lineWidth=2;c.strokeRect(16,16,W-32,H-32);c.fillStyle=style.dark?'#e7e5d6':'#344b3d';
   text.forEach((s,i)=>{const size=i===0?(style.titleSize||45):29;c.font=`${i===0?'':'italic '}${size}px ${i===0?'Georgia':'Georgia'}`;if(i===0)c.fillText(s,45,72);else lines(c,s,45,90+i*65,W-90,size,1.4);});
  },1024,Math.round(1024*h/w));
  const m=this.mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}),x,y,z);m.rotation.y=rot;m.castShadow=false;return m;
 }
 target(id,x,y,z,r=1.1){this.targets.push({id,p:new T.Vector3(x,y,z),r});}
 wall(axis,at,start,end,y,height,openings,material){
  const points=[start,end,...openings.flatMap(o=>[Math.max(start,o.from),Math.min(end,o.to)])].filter(v=>v>=start&&v<=end).sort((a,b)=>a-b);const xs=[...new Set(points)];
  for(let i=0;i<xs.length-1;i++){const a=xs[i],b=xs[i+1];if(b-a<.01)continue;const middle=(a+b)/2;const holes=openings.filter(o=>middle>o.from&&middle<o.to).map(o=>[o.y,o.y+(o.height||3.2)]).sort((a,b)=>a[0]-b[0]);let last=y;
   for(const [lo,hi] of [...holes,[y+height,y+height]]){if(lo>last){const h=Math.min(lo,y+height)-last;if(h>0){if(axis==='x')this.box(at,last+h/2,middle,.3,h,b-a,material,true);else this.box(middle,last+h/2,at,b-a,h,.3,material,true);}}last=Math.max(last,hi);}
  }
 }
 floor(r){const t=texture((c,w,h)=>{c.fillStyle=r.type==='gallery'?'#c3c1b0':'#c9c9b8';c.fillRect(0,0,w,h);for(let v=0;v<12;v++){c.strokeStyle='#6c7d6c0b';c.lineWidth=.6;c.beginPath();c.moveTo(0,v*49);c.bezierCurveTo(w*.3,v*49+20,w*.7,v*49-17,w,v*49+9);c.stroke();}c.strokeStyle='#8c968355';c.lineWidth=3;c.strokeRect(0,0,w,h);c.strokeStyle='#e0e2d255';c.lineWidth=2;c.strokeRect(6,6,w-12,h-12);for(let i=0;i<1200;i++){c.fillStyle=i%2?'#fff1':'#1727180a';c.fillRect((i*157)%w,(i*97)%h,2,2);}});t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set((r.x2-r.x1)/2.5,(r.z2-r.z1)/2.5);const m=new T.MeshStandardMaterial({map:t,bumpMap:t,bumpScale:.009,roughness:.57,envMapIntensity:.22});const p=this.mesh(new T.PlaneGeometry(r.x2-r.x1,r.z2-r.z1),m,(r.x1+r.x2)/2,r.floor+.002,(r.z1+r.z2)/2);p.rotation.x=-PI/2;p.castShadow=false;}
 buildArchitecture(){
  for(const r of ROOMS){this.floor(r);if(r.type==='mezzanine')continue;
   const holes=[...DOORS,...WINDOWS].filter(d=>d.a===r.id||d.b===r.id);
   for(const [axis,at,start,end] of [['x',r.x1,r.z1,r.z2],['x',r.x2,r.z1,r.z2],['z',r.z1,r.x1,r.x2],['z',r.z2,r.x1,r.x2]]){
    this.wall(axis,at,start,end,r.floor,r.h,holes.filter(d=>d.axis===axis&&d.at===at),r.type==='hub'?'plaster':r.exhibit==='rebirth'?'limestone':r.type==='gallery'?'plaster':'olive');
    // Thin architectural cornice; unlike a wall, it never occupies an opening at eye height.
    if(axis==='x')this.box(at,r.floor+r.h-.14,(start+end)/2,.46,.20,end-start,'molding');else this.box((start+end)/2,r.floor+r.h-.14,at,end-start,.20,.46,'molding');
   }
   if(r.id!=='hall'){this.box((r.x1+r.x2)/2,r.floor+r.h,(r.z1+r.z2)/2,r.x2-r.x1,.18,r.z2-r.z1,'plaster');
    if(!r.locked){const light=this.cyl((r.x1+r.x2)/2,r.floor+r.h-.15,(r.z1+r.z2)/2,.7,.08,'light');light.castShadow=false;}}
  }
  // Roof bays alternate between glazed skylights and custom suspended lights.
  for(let z=-27;z<28;z+=11){this.box(-6.75,11.65,z+5.5,6.5,.28,11,'plaster');this.box(6.75,11.65,z+5.5,6.5,.28,11,'plaster');this.box(0,11.65,z+1,7,.28,2,'plaster');this.box(0,11.65,z+9.8,7,.28,2.4,'plaster');this.box(0,11.75,z+5.3,7,.08,6.6,'sky');for(const x of [-3.5,0,3.5])this.box(x,11.55,z+5.3,.09,.18,6.6,'smokedMetal');this.box(0,11.55,z+5.3,7,.18,.08,'smokedMetal');}
  // Great window: mullions, a low sill and a landscape beyond it.
  this.box(0,5.8,-28.01,17.4,11,.05,'glass',true);for(let x=-8.7;x<=8.71;x+=2.9)this.box(x,5.8,-27.9,.13,11.1,.22,'smokedMetal');for(const y of [.3,4.2,8,11.3])this.box(0,y,-27.9,17.6,.13,.23,'smokedMetal');
  this.box(0,-.2,-65,160,.2,75,'stone');for(let i=0;i<14;i++){const x=(i-6.5)*5.2,z=-44-(i%4)*5;this.mesh(new T.ConeGeometry(1.4+(i%3)*.3,5+i%4,7),'leaf',x,2.2,z);}
  // Two separate mezzanine ledges. No cross-hall connection is built.
  for(const side of [-1,1]){this.box(side*8,4.35,1,4,.28,54,'limestone');this.box(side*6,5.53,1,.10,.10,54,'brass');this.box(side*6,4.8,1,.08,.07,54,'smokedMetal');for(let z=-26;z<=28;z+=1.4)this.box(side*6,4.97,z,.055,1.06,.055,'smokedMetal');this.colliders.push({x1:side===-1?-6.12:5.88,x2:side===-1?-5.88:6.12,z1:-26,z2:28,y1:4.5,y2:6});}
  // Stair rises south and meets the west ledge at the top.
  const count=26;for(let i=0;i<count;i++){const h=(i+1)*4.5/count;this.box(-7.7,h/2,15+(i+.5)*11/count,3.8,h,11/count,'limestone');this.box(-7.7,h+.012,15+i*11/count,3.8,.025,.07,'brass');}
  for(const x of [-9.55,-5.85]){for(let i=0;i<=13;i++){const z=15+i*11/13,h=i*4.5/13;this.box(x,h+.5,z,.06,1,.06,'smokedMetal');}this.tube([[x,1,15],[x,5.5,26]],.055,'brass');}
  this.colliders.push({x1:-5.96,x2:-5.74,z1:15,z2:26,y1:0,y2:5.4});
  this.sign(['WEST MEZZANINE','03 / Cross/Hatch'], -9.78,2.2,25.2,2.5,1.15,PI/2);this.target('stair',-8,1.7,14.5,1.3);
  // Glazed shop frontage looking into the hall.
  this.box(10.01,2.2,9.5,.06,2.6,13,'glass',true);for(let z=3;z<=16;z+=2.6)this.box(9.85,2.2,z,.15,2.8,.07,'smokedMetal');this.box(9.84,.87,9.5,.18,.09,13.3,'brass');
  for(const d of DOORS){const mid=(d.from+d.to)/2,w=d.to-d.from;if(d.locked){if(d.axis==='x')this.box(d.at,d.y+1.6,mid,.18,3.2,w,'dark',true);else this.box(mid,d.y+1.6,d.at,w,3.2,.18,'dark',true);const x=d.axis==='x'?d.at-.18:mid,z=d.axis==='z'?d.at-.18:mid,rot=d.axis==='x'?-PI/2:PI;this.sign(['ACCESS CLOSED',d.b==='east'?'EASTERN ARCADE':'SECURITY'],x,1.9,z,2.7,.8,rot,{dark:true,titleSize:48});this.target(d.b,x,1.6,z,2);}}
  // Sealed public lift bank, independently interactable call plates.
  for(const z of [19.5,22.5]){this.box(27.82,1.5,z,.12,3,2.1,'smokedMetal');this.box(27.73,1.5,z,.06,2.8,.018,'brass');this.sign(['↑  ↓'],27.68,2.95,z,1.2,.3,-PI/2,{dark:true,titleSize:100});this.box(27.65,1.25,z+1.1,.08,.33,.14,'brass');this.target('elevators',27.4,1.5,z,1.6);}
  this.sign(['ELEVATORS','Service suspended'],27.7,3.5,21,2.7,.7,-PI/2);
  PARTITIONS.forEach(p=>this.box(p.x,p.y+p.h/2,p.z,p.w,p.h,p.d,'plaster',true));
  this.sign(['01 / HIDDEN OPERATORS'], -34.9,3,-24.80,4.8,.65,0);this.sign(['Hidden Operators',EXHIBITS.hidden.description],-35.3,1.7,-24.78,3.7,1.8,0);this.target('hidden',-35,1.7,-24.5,2);
  this.sign(['02 / DAYS OF REBIRTH'], -9.80,3.35,23.3,4.0,.7,PI/2);this.sign(['Days of Rebirth',EXHIBITS.rebirth.description],-9.78,1.8,24.4,3.3,1.9,PI/2);this.target('rebirth',-9.4,1.7,24,2);
  this.sign(['03 / CROSS/HATCH'], -9.78,7.6,13,4.0,.7,PI/2);this.sign(['Cross/Hatch',EXHIBITS.cross.description],-9.77,6.3,15,3.2,1.8,PI/2);this.target('cross',-9.4,6.2,14.8,1.7);
  this.sign(['NORTHERN ARCADE','01 / Hidden Operators  ·  Café'], -9.78,3.65,-22,5.5,.7,PI/2);this.sign(['SOUTHERN ARCADE','Elevators  ·  Gift shop'],9.77,3.65,21,5,.7,-PI/2);
  this.sign(['CAFÉ'], -28,2.9,-19.22,3.5,.6,PI);this.sign(['GIFT SHOP'],15,2.9,18.22,3.3,.6,0);
  for(const r of ROOMS.filter(r=>r.type==='gallery')){const z=r.z2-.22;this.sign([r.code+' / '+r.name,'No works installed'],r.x1+3,r.floor+1.7,z,2,.8,PI);}
  this.mapBoard();
 }
 tube(points,r,mat='dark'){return this.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),Math.max(2,points.length*5),r,6,false),mat);}
 mapBoard(){const tex=texture((c,w,h)=>{c.fillStyle='#e2e4d8';c.fillRect(0,0,w,h);c.fillStyle='#3e5948';c.font='35px Georgia';c.fillText('THE GROUND COLLECTION',40,55);for(const r of ROOMS.filter(r=>r.floor===0)){c.fillStyle=r.locked?'#b3b7ac':r.exhibit?'#a8ba9d':'#c2cdb8';c.fillRect(100+(r.x1+40)*9,95+(r.z1+55)*6,(r.x2-r.x1)*9,(r.z2-r.z1)*6);c.strokeStyle='#657b67';c.strokeRect(100+(r.x1+40)*9,95+(r.z1+55)*6,(r.x2-r.x1)*9,(r.z2-r.z1)*6);}c.font='19px Arial';c.fillStyle='#36523e';c.fillText('GROUND / 00                       N ↗',40,h-33);},1024,800);const m=this.mesh(new T.PlaneGeometry(4,3.12),new T.MeshBasicMaterial({map:tex}),-19,1.85,-19.20);m.rotation.y=PI;this.target('map',-19,1.7,-19.5,2.3);}
 bench(x,z,rot=0,y=0){const g=new T.Group();g.position.set(x,y,z);g.rotation.y=rot;this.scene.add(g);const b=(X,Y,Z,W,H,D,M)=>this.mesh(new T.BoxGeometry(W,H,D),M,X,Y,Z,g);for(const xx of [-1.2,1.2]){b(xx,.3,0,.13,.6,.7,'smokedMetal');b(xx,.83,-.28,.09,.7,.09,'smokedMetal');}for(let k=0;k<4;k++)b(0,.58,-.28+k*.16,3,.10,.14,'oak');for(let k=0;k<3;k++)b(0,.8+k*.15,-.35,3,.12,.09,'oak');this.shadow(x,z,3.8,1.6,y+.014);const w=rot?1:3.2,d=rot?3.2:1;this.colliders.push({x1:x-w/2,x2:x+w/2,z1:z-d/2,z2:z+d/2,y1:y,y2:y+1});}
 fern(x,z,y=0,scale=1){detailedFern(this,x,z,y,scale);}
 painting(x,z,rot,n){const tex=texture((c,W,H)=>{c.fillStyle=['#d3cbb6','#bac3af','#c9c9b9','#cac0aa'][n%4];c.fillRect(0,0,W,H);c.lineWidth=12;c.strokeStyle='#526855';if(n%2===0){for(let k=0;k<12;k++){c.beginPath();c.ellipse(W/2+(k%3-1)*4,H/2,75+k*6,160-k*6,(k-5)*.02,0,PI*2);c.stroke();}}else{c.fillStyle='#748774';c.fillRect(48,80,240,230);c.fillStyle='#a9af95';c.beginPath();c.arc(270,240,140,0,PI*2);c.fill();c.fillStyle='#bd915a';c.fillRect(220,80,35,340);}},400,500);const g=new T.Group();g.position.set(x,2.3,z);g.rotation.y=rot;this.scene.add(g);this.mesh(new T.BoxGeometry(2.18,2.72,.12),'brass',0,0,0,g);this.mesh(new T.PlaneGeometry(2.02,2.56),new T.MeshStandardMaterial({map:tex,roughness:1}),0,0,.068,g);}
 buildFurnishings(){
  // The information booth, circular and low enough to preserve the north-south sightline.
  this.cyl(0,.59,0,1.7,1.18,'olive');this.cyl(0,1.22,0,1.86,.14,'limestone');this.cyl(0,.08,0,1.76,.12,'brass');this.shadow(0,0,5,5);this.colliders.push({x1:-1.85,x2:1.85,z1:-1.85,z2:1.85,y1:0,y2:1.3});
  this.box(0,1.31,-.18,.65,.07,.38,'dark');this.box(0,1.52,-.27,.10,.45,.09,'dark');this.box(0,1.78,-.27,.95,.63,.10,'smokedMetal');this.monitorScreen=this.sign(['VISITOR SERVICES','Hall lighting  /  connected'],0,1.78,-.206,.84,.52,0,{dark:true,titleSize:49});this.target('monitor',0,1.75,-.15,1.25);this.sign(['INFORMATION'],0,.72,1.705,1.55,.35,0,{titleSize:80});
  // Old street lamp with a visible continuous copper cable to the monitor.
  this.cyl(3.3,.1,.3,.36,.20,'dark');this.cyl(3.3,1.65,.3,.07,3.1,'dark');this.cyl(3.3,.65,.3,.12,.5,'dark');this.cyl(3.3,3.15,.3,.27,.12,'brass');this.lampBulb=this.mesh(new T.CylinderGeometry(.22,.18,.65,6),new T.MeshStandardMaterial({color:'#e8d8a0',emissive:'#ffdd83',emissiveIntensity:.75}),3.3,3.54,.3);this.lampBulb.userData.dynamic=true;this.mesh(new T.ConeGeometry(.39,.3,6),'dark',3.3,4,.3);this.cyl(3.3,4.23,.3,.03,.16,'dark');for(const x of [-.18,.18])for(const z of [-.18,.18])this.box(3.3+x,3.56,.3+z,.035,.72,.035,'dark');this.lampLight=new T.PointLight('#ffd99b',13,8,2);this.lampLight.position.set(3.3,3.4,.3);this.scene.add(this.lampLight);this.target('lamp',3.3,2,.3,1);
  this.tube([[0,1.6,-.34],[0,1.29,-.55],[.6,1.29,-1.5],[1.8,.05,-1.9],[2.7,.05,-1.9],[3.3,.05,-.5],[3.3,.14,.3]],.033,'brass');
  // Large abstract bronze study, held against the great window.
  this.box(0,.35,-23.9,3.8,.7,3.4,'limestone',true);this.box(0,.73,-23.9,4,.08,3.6,'marble');const knot=this.mesh(new T.TorusKnotGeometry(1.28,.24,120,14,2,3),'bronze',0,3,-23.9);knot.scale.set(1,1.7,.75);knot.rotation.y=.4;this.shadow(0,-23.9,6,5);this.sign(['A SPACE HELD OPEN','Bronze study'],2.65,1.15,-22.9,1.3,.65,0);this.target('statue',2.5,1.2,-22.6,1.3);
  const kinds=['athlete','draped','bearer','turning'];let count=0;for(const side of [-1,1])for(const z of [-7,7]){sculpture(this,{key:'study-'+(++count),kind:kinds[count-1],x:side*8,z,rotation:side===-1?PI/2:-PI/2});this.colliders.push({x1:side*8-.82,x2:side*8+.82,z1:z-.82,z2:z+.82,y1:0,y2:3.3});}
  for(const side of [-1,1]){this.bench(side*8,0,side===-1?PI/2:-PI/2);this.fern(side*8,-16);this.fern(side*8,12);for(const [n,z] of [-13,13].entries())this.painting(side*9.8,z,side===-1?PI/2:-PI/2,n+(side===-1?0:2));}
  this.bench(-24,-22.8,0);this.fern(-36.3,-21.7);this.fern(-11.8,-21.8);this.bench(18,22.9,PI);this.fern(11.7,22.7);this.fern(-8,-25,4.5,.65);
  // Slender columns make a rhythm below the upper galleries.
  for(const side of [-1,1])for(const z of [-19,-12,12,26]){this.cyl(side*6.5,2.1,z,.18,4.2,'limestone');this.cyl(side*6.5,.13,z,.34,.26,'limestone');this.cyl(side*6.5,4.05,z,.38,.3,'limestone');this.colliders.push({x1:side*6.5-.25,x2:side*6.5+.25,z1:z-.25,z2:z+.25,y1:0,y2:4.3});}
  for(const z of [-16,-5,6,17]){this.cyl(0,10,z,.025,3.1,'brass');const ring=this.mesh(new T.TorusGeometry(1.4,.055,8,48),'brass',0,8.45,z);ring.rotation.x=PI/2;for(let k=0;k<8;k++){const a=k/8*PI*2;this.cyl(Math.cos(a)*1.4,8.5,z+Math.sin(a)*1.4,.09,.5,'light');}this.cyl(0,8.5,z,.12,.35,'brass');}
 }
 batch(){
  // Merge static meshes by material. Fine sculpture/fern detail stays inexpensive on phones.
  this.scene.updateMatrixWorld(true);const groups=new Map();this.scene.traverse(o=>{if(o.isMesh&&!o.userData.dynamic&&(!o.material.transparent||o.material===this.m.shadow||o.material===this.m.sunwash)&&!Array.isArray(o.material)){const key=o.material.uuid+':'+o.castShadow+':'+o.receiveShadow;const list=groups.get(key)||[];list.push(o);groups.set(key,list);}});
  for(const objects of groups.values()){const mat=objects[0].material;if(objects.length<3)continue;const geos=objects.map(o=>{const g=o.geometry.clone().applyMatrix4(o.matrixWorld);return g.index?g.toNonIndexed():g;});try{const geo=mergeGeometries(geos,false);if(geo){const merged=new T.Mesh(geo,mat);merged.castShadow=objects[0].castShadow;merged.receiveShadow=objects[0].receiveShadow;this.scene.add(merged);const originals=new Set(objects.map(o=>o.geometry));objects.forEach(o=>o.removeFromParent());originals.forEach(g=>g.dispose());}}finally{geos.forEach(g=>g.dispose());}}
 }
 setQuality(value){this.quality=Object.hasOwn(QUALITY,value)?value:'balanced';const q=QUALITY[this.quality];if(!this.renderer)return;this.renderer.setPixelRatio(Math.min(devicePixelRatio,q.pixelRatio));this.renderer.setSize(innerWidth,innerHeight);if(this.sun.shadow.mapSize.x!==q.shadowSize){this.sun.shadow.mapSize.set(q.shadowSize,q.shadowSize);this.sun.shadow.map?.dispose();this.sun.shadow.map=null;}this.renderer.shadowMap.needsUpdate=true;}
 setLamp(on){this.lampBulb.material.emissiveIntensity=on?.75:0;this.lampLight.intensity=on?13:0;}
 blocked(x,z,y){const rad=.27;return this.colliders.some(c=>y+1.55>c.y1+.04&&y+.15<c.y2&&x+rad>c.x1&&x-rad<c.x2&&z+rad>c.z1&&z-rad<c.z2);}
 move(player,dx,dz){for(const [xx,zz] of [[dx,0],[0,dz]]){const x=player.x+xx,z=player.z+zz,y=floorAt(x,z,player.y);if(y!==null&&!this.blocked(x,z,y)){player.x=x;player.z=z;player.y=y;}}}
 focus(){const v=new T.Vector3();this.camera.getWorldDirection(v);let best=null,score=0;for(const t of this.targets){const diff=t.p.clone().sub(this.camera.position),distance=diff.length(),dot=diff.normalize().dot(v);if(distance<5.2&&dot>Math.max(.78,1-t.r/distance*.32)&&dot>score){
   const origin=this.camera.position,delta=t.p.clone().sub(origin);const occluded=this.colliders.some(c=>{let near=0,far=1;for(const [axis,min,max] of [['x',c.x1,c.x2],['y',c.y1,c.y2],['z',c.z1,c.z2]]){if(Math.abs(delta[axis])<.0001){if(origin[axis]<min||origin[axis]>max)return false;}else{const a=(min-origin[axis])/delta[axis],b=(max-origin[axis])/delta[axis];near=Math.max(near,Math.min(a,b));far=Math.min(far,Math.max(a,b));if(near>far)return false;}}return far>.02&&near<.98;});
   if(!occluded){score=dot;best=t;}
  }}return best;}
 drawPlan(player){
  const c=this.ctx,w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio,1.5);c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#b8bcae';c.fillRect(0,0,w,h);const scale=w<650?13:17,cx=w/2,cy=h*.55,upper=player.y>4;
  const X=x=>cx+(x-player.x)*scale,Z=z=>cy+(z-player.z)*scale;
  c.fillStyle='#b1b7a5';for(let x=0;x<w;x+=32)for(let y=0;y<h;y+=32)c.fillRect(x,y,1,1);
  const box=(x,z,W,D,color)=>{c.fillStyle=color;c.fillRect(X(x-W/2),Z(z-D/2),W*scale,D*scale);};
  if(upper)box(0,0,20,56,'#c2c5b5');
  for(const r of ROOMS.filter(r=>upper?r.floor>0:r.floor===0)){
   const x=X(r.x1),z=Z(r.z1),W=(r.x2-r.x1)*scale,D=(r.z2-r.z1)*scale;
   c.shadowColor='#31453330';c.shadowBlur=14;c.shadowOffsetY=6;c.fillStyle=r.locked?'#b8bbad':r.type==='gallery'?'#d6d9c7':r.type==='amenity'?'#d6ceb9':'#e2e1d1';c.fillRect(x,z,W,D);c.shadowBlur=0;c.shadowOffsetY=0;
   c.save();c.beginPath();c.rect(x,z,W,D);c.clip();c.strokeStyle='#a3ad9625';c.lineWidth=.8;for(let xx=r.x1;xx<r.x2;xx+=2.5){c.beginPath();c.moveTo(X(xx),z);c.lineTo(X(xx),z+D);c.stroke();}for(let zz=r.z1;zz<r.z2;zz+=2.5){c.beginPath();c.moveTo(x,Z(zz));c.lineTo(x+W,Z(zz));c.stroke();}if(r.locked){c.strokeStyle='#7f897a50';for(let xx=-D;xx<W;xx+=12){c.beginPath();c.moveTo(x+xx,z);c.lineTo(x+xx+D,z+D);c.stroke();}}c.restore();
   c.strokeStyle='#6b7b66';c.lineWidth=5;c.strokeRect(x,z,W,D);
   c.fillStyle='#6c7c66';c.textAlign='center';c.font='11px Georgia';let title=r.id==='hall'?'THE MAIN HALL':r.exhibit?EXHIBITS[r.exhibit].name:r.name;if(r.type==='mezzanine')title=r.id==='west'?'WEST':'EAST';c.fillText(title,X((r.x1+r.x2)/2),Z(r.id==='hall'?9:(r.z1+r.z2)/2)-8);c.font='8px Arial';c.fillText(r.locked?'CLOSED':r.code,X((r.x1+r.x2)/2),Z(r.id==='hall'?9:(r.z1+r.z2)/2)+6);
  }
  for(const d of DOORS.filter(d=>upper?d.y>0:d.y===0)){c.strokeStyle=d.locked?'#8d6d55':'#e2e1d1';c.lineWidth=7;c.beginPath();if(d.axis==='x'){c.moveTo(X(d.at),Z(d.from));c.lineTo(X(d.at),Z(d.to));}else{c.moveTo(X(d.from),Z(d.at));c.lineTo(X(d.to),Z(d.at));}c.stroke();}
  if(!upper){box(0,-27.9,17.4,.16,'#77a5a1');box(10,9.5,.12,13,'#77a5a1');box(0,-23.9,3.8,3.4,'#c1c2ad');c.strokeStyle='#5c735b';c.lineWidth=5;c.beginPath();c.ellipse(X(0),Z(-23.9),17,26,.4,0,Math.PI*2);c.stroke();
   c.fillStyle='#aab698';c.beginPath();c.arc(X(0),Z(0),1.75*scale,0,PI*2);c.fill();c.strokeStyle='#6b7e62';c.lineWidth=2;c.stroke();box(0,-.3,.95,.35,'#344e3b');c.strokeStyle='#a17d44';c.lineWidth=2;c.beginPath();c.moveTo(X(0),Z(-.3));c.lineTo(X(1.8),Z(-1.9));c.lineTo(X(3.3),Z(-1.9));c.lineTo(X(3.3),Z(.3));c.stroke();c.fillStyle=this.lampLight.intensity?'#c6a562':'#6e7c66';c.beginPath();c.arc(X(3.3),Z(.3),6,0,PI*2);c.fill();
   for(const side of [-1,1]){for(const z of [-7,7]){box(side*8,z,1.4,1.4,'#a8ae97');c.fillStyle='#e8e6d6';c.beginPath();c.ellipse(X(side*8),Z(z),7,11,0,0,PI*2);c.fill();}box(side*8,0,.7,3,'#9e8763');for(const z of [-16,12]){c.fillStyle='#6f885d';c.beginPath();c.arc(X(side*8),Z(z),10,0,PI*2);c.fill();}}box(-24,-22.8,3,.7,'#9e8763');for(const z of [19.5,22.5])box(27.8,z,.15,2.1,'#66796a');
  }else PARTITIONS.forEach(p=>box(p.x,p.z,p.w,p.d,'#718466'));
  box(-7.7,20.5,3.8,11,'#cdcbb8');c.strokeStyle='#8f987f';c.lineWidth=1;for(let z=15;z<=26;z+=.42){c.beginPath();c.moveTo(X(-9.6),Z(z));c.lineTo(X(-5.8),Z(z));c.stroke();}
  // The avatar's cone and inspectable objects use the same positions as the 3D world.
  for(const t of this.targets){if(Math.abs(t.p.y-(player.y+1.65))>2.6)continue;c.strokeStyle='#8e774f';c.lineWidth=1;c.beginPath();c.arc(X(t.p.x),Z(t.p.z),4,0,PI*2);c.stroke();}
  c.save();c.translate(cx,cy);c.rotate(-player.yaw);const gradient=c.createLinearGradient(0,0,0,-120);gradient.addColorStop(0,'#d4c18b66');gradient.addColorStop(1,'#d4c18b00');c.fillStyle=gradient;c.beginPath();c.moveTo(0,0);c.lineTo(-65,-120);c.lineTo(65,-120);c.closePath();c.fill();c.fillStyle='#294c3a';c.strokeStyle='#f0eddd';c.lineWidth=2;c.beginPath();c.arc(0,0,7,0,PI*2);c.fill();c.stroke();c.fillStyle='#f0eddd';c.beginPath();c.moveTo(0,-6);c.lineTo(-3,2);c.lineTo(3,2);c.fill();c.restore();
 }
 render(player){this.camera.position.set(player.x,player.y+1.65,player.z);this.camera.rotation.set(player.pitch,player.yaw,0,'YXZ');if(this.renderer)this.renderer.render(this.scene,this.camera);else if(this.ctx)this.drawPlan(player);}
}
