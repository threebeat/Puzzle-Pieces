import * as T from './vendor/three.module.js';
import {DOORS,DESK} from './layout.mjs';
const PI=Math.PI;
const random=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
function map(paint,size=256,data=false){const canvas=document.createElement('canvas');canvas.width=canvas.height=size;paint(canvas.getContext('2d'),size,random(2947));const t=new T.CanvasTexture(canvas);t.colorSpace=data?T.NoColorSpace:T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=2;return t;}
export const QUALITY={economy:{pixelRatio:1,shadowSize:1024},balanced:{pixelRatio:1.25,shadowSize:1536},high:{pixelRatio:1.5,shadowSize:2048}};
export function installMaterials(w){
 const grain=map((c,s,r)=>{c.fillStyle='#f1efe7';c.fillRect(0,0,s,s);for(let i=0;i<7000;i++){c.fillStyle=`rgba(83,80,65,${r()*.065})`;c.fillRect(r()*s,r()*s,.5+r()*1.7,.5+r()*1.7);}});
 const stone=map((c,s,r)=>{c.fillStyle='#eeeadd';c.fillRect(0,0,s,s);for(let i=0;i<30;i++){const y=r()*s;c.strokeStyle=`rgba(103,114,103,${.025+r()*.075})`;c.lineWidth=.3+r()*1.7;c.beginPath();c.moveTo(-20,y);c.bezierCurveTo(s*.3,y+45,s*.7,y-35,s+20,y+20);c.stroke();}for(let i=0;i<5000;i++){c.fillStyle=r()>.5?'#ffffff10':'#4f554b08';c.fillRect(r()*s,r()*s,1,1);}},512);
 const relief=map((c,s,r)=>{c.fillStyle='#c9c9c9';c.fillRect(0,0,s,s);for(let i=0;i<6500;i++){const v=150+Math.floor(r()*80);c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(r()*s,r()*s,1,1);}},256,true);
 const wood=map((c,s,r)=>{c.fillStyle='#ceb58e';c.fillRect(0,0,s,s);for(let i=0;i<350;i++){const x=r()*s;c.strokeStyle=`rgba(${i%3?'57,35,18':'250,225,182'},${.02+r()*.15})`;c.lineWidth=.3+r();c.beginPath();c.moveTo(x,0);c.bezierCurveTo(x+Math.sin(i)*9,s*.3,x-Math.sin(i)*7,s*.7,x,s);c.stroke();}for(let i=0;i<3;i++){c.strokeStyle='#74563625';c.lineWidth=1;c.beginPath();c.ellipse(40+i*80,60+i*60,3,14,0,0,PI*2);c.stroke();}},512);
 const metal=map((c,s,r)=>{c.fillStyle='#d4d4cd';c.fillRect(0,0,s,s);for(let i=0;i<900;i++){c.strokeStyle=`rgba(${i%2?'255,255,255':'63,68,59'},${r()*.13})`;c.lineWidth=.3;c.beginPath();const y=r()*s;c.moveTo(0,y);c.lineTo(s,y);c.stroke();}});
 const oxidized=map((c,s,r)=>{c.fillStyle='#b9c1a9';c.fillRect(0,0,s,s);for(let i=0;i<3000;i++){c.fillStyle=i%3?'#355e4530':'#a4915840';c.beginPath();c.arc(r()*s,r()*s,.5+r()*3,0,PI*2);c.fill();}});
 for(const key of ['plaster','olive','molding'])Object.assign(w.m[key],{map:grain,bumpMap:relief,bumpScale:.025,roughness:.94});
 for(const key of ['stone','limestone','marble'])Object.assign(w.m[key],{map:stone,bumpMap:relief,bumpScale:key==='marble'?.008:.018,roughness:key==='marble'?.39:.72,envMapIntensity:.35});
 Object.assign(w.m.oak,{map:wood,bumpMap:relief,bumpScale:.012,roughness:.53,envMapIntensity:.3});
 Object.assign(w.m.brass,{map:metal,roughness:.3,metalness:.78,envMapIntensity:.8});
 Object.assign(w.m.smokedMetal,{map:metal,roughness:.49,metalness:.62,envMapIntensity:.45});
 Object.assign(w.m.bronze,{map:oxidized,roughness:.4,metalness:.72,envMapIntensity:.8});
 Object.assign(w.m.pot,{map:grain,bumpMap:relief,bumpScale:.018,roughness:.66});
 w.m.leaf.side=w.m.leaf2.side=T.DoubleSide;w.m.leaf.roughness=.87;w.m.leaf2.roughness=.87;
 w.m.shadow=new T.MeshBasicMaterial({map:map((c,s)=>{const g=c.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,'#1b271b50');g.addColorStop(.4,'#1b271b28');g.addColorStop(1,'#1b271b00');c.fillStyle=g;c.fillRect(0,0,s,s);},64),transparent:true,depthWrite:false});
 w.m.sunwash=new T.MeshBasicMaterial({map:map((c,s)=>{const g=c.createLinearGradient(0,0,0,s);g.addColorStop(0,'#ffebbe55');g.addColorStop(.7,'#ffe9ad22');g.addColorStop(1,'#ffe9ad00');c.fillStyle=g;for(let x=0;x<6;x++)for(let y=0;y<3;y++)c.fillRect(x*s/6+5,y*s/3+5,s/6-10,s/3-10);},256),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
}
export function reflectionEnvironment(w){
 if(!w.renderer)return;
 // One prefiltered, tiny room environment; no per-frame mirrors or reflection probes.
 const faces=[];for(let i=0;i<6;i++){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const bg=g.createLinearGradient(0,0,0,128);bg.addColorStop(0,'#d6ded7');bg.addColorStop(.5,'#a5ae9b');bg.addColorStop(1,'#575e4c');g.fillStyle=bg;g.fillRect(0,0,128,128);if(i!==3){g.fillStyle=i===2?'#fff6d9':'#ecefdf';g.fillRect(20,12,24,62);g.fillRect(50,12,24,62);g.fillRect(80,12,24,62);}faces.push(c);}
 const cube=new T.CubeTexture(faces);cube.colorSpace=T.SRGBColorSpace;cube.needsUpdate=true;const pmrem=new T.PMREMGenerator(w.renderer);w.environmentTarget=pmrem.fromCubemap(cube);w.scene.environment=w.environmentTarget.texture;cube.dispose();pmrem.dispose();
}
export function fern(w,x,z,y=0,scale=1){
 const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(scale);w.scene.add(g);
 w.mesh(new T.CylinderGeometry(.44,.31,.7,20),'pot',0,.35,0,g);w.mesh(new T.TorusGeometry(.43,.035,5,20),'limestone',0,.68,0,g).rotation.x=PI/2;w.mesh(new T.CylinderGeometry(.40,.40,.025,20),'dark',0,.69,0,g);
 // Four triangles per pointed, folded leaflet instead of twenty triangles per ellipsoid.
 if(!w.leafGeometry){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([-.55,0,0,0,.19,0,.7,0,0,0,-.19,0,0,0,.055],3));geo.setAttribute('uv',new T.Float32BufferAttribute([0,.5,.45,1,1,.5,.45,0,.45,.5],2));geo.setIndex([0,1,4,1,2,4,2,3,4,3,0,4]);geo.computeVertexNormals();w.leafGeometry=geo;}
 for(let j=0;j<13;j++){const a=j*2.4,len=.85+(j%4)*.19;const points=[];for(let k=0;k<9;k++){const t=k/8,r=t*len,cy=.72+Math.sin(t*2.5)*(.8+(j%3)*.05);points.push(new T.Vector3(Math.cos(a)*r,cy,Math.sin(a)*r));if(k===0)continue;for(const side of [-1,1]){const leaf=w.mesh(w.leafGeometry,j%2?'leaf':'leaf2',Math.cos(a)*r+side*Math.sin(a)*.12,cy,Math.sin(a)*r-side*Math.cos(a)*.12,g);leaf.rotation.set(-PI/2+(t-.5)*.3,-a+side*.65,0);leaf.scale.setScalar(.48*(1-t*.72));}}w.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),8,.008,3,false),'leaf2',0,0,0,g);}
 w.shadow(x,z,2.3,2.3,y+.012);w.colliders.push({x1:x-.46,x2:x+.46,z1:z-.46,z2:z+.46,y1:y,y2:y+.8});
}
export function details(w){
 // Door reveals: trim surrounds existing openings, never narrows their collision aperture.
 for(const d of DOORS){const h=3.2,y=d.y,mid=(d.from+d.to)/2;
  if(d.axis==='x'){for(const z of [d.from-.12,d.to+.12])w.box(d.at,y+h/2,z,.53,h,.18,'limestone');w.box(d.at,y+h+.1,mid,.53,.20,d.to-d.from+.42,'limestone');}
  else{for(const x of [d.from-.12,d.to+.12])w.box(x,y+h/2,d.at,.18,h,.53,'limestone');w.box(mid,y+h+.1,d.at,d.to-d.from+.42,.2,.53,'limestone');}
 }
 // Slender column flutes, collars and stepped capitals reuse the existing stone material.
 for(const side of [-1,1])for(const z of [-19,-12,12,26]){for(const yy of [.27,.38,3.76,3.88])w.cyl(side*8.5,yy,z,yy>3?.27:.25,.07,'marble');for(let k=0;k<12;k++){const a=k*PI/6;w.mesh(new T.CylinderGeometry(.012,.012,3.28,5),'marble',side*8.5+Math.cos(a)*.175,2.06,z+Math.sin(a)*.175);}w.box(side*8.5,4.22,z,.8,.1,.8,'limestone');}
 // Fine desk fluting, a keyboard, paper brochures and a weighted pen stand.
 for(let k=0;k<64;k++){const a=k/64*PI*2;w.mesh(new T.CylinderGeometry(.014,.014,.9,5),'oak',Math.cos(a)*(DESK.radius+.005),.66,Math.sin(a)*(DESK.radius+.005));}
 w.box(0,1.315,DESK.monitorZ+.67,.68,.045,.25,'smokedMetal');for(let row=0;row<3;row++)for(let key=0;key<11;key++)w.box(-.29+key*.058,1.34,DESK.monitorZ+.59+row*.065,.046,.012,.045,'limestone');
 for(let i=0;i<3;i++){const b=w.box(-.9+i*.03,1.32+i*.014,DESK.monitorZ+.62,.5,.018,.7,i===2?'olive':'plaster');b.rotation.y=.15;}
 w.cyl(.9,1.31,DESK.monitorZ+.57,.14,.07,'brass');w.tube([[.9,1.34,DESK.monitorZ+.57],[.96,1.61,DESK.monitorZ+.57]],.014,'dark');
 // Ring chandeliers gain concentric arms and frosted shades, without extra real-time lights.
 for(const z of [-16,-5,6,17]){const inner=w.mesh(new T.TorusGeometry(.75,.035,6,40),'brass',0,8.45,z);inner.rotation.x=PI/2;for(let k=0;k<8;k++){const a=k*PI/4;w.tube([[Math.cos(a)*.75,8.45,z+Math.sin(a)*.75],[Math.cos(a)*1.4,8.45,z+Math.sin(a)*1.4]],.025,'brass');w.mesh(new T.CylinderGeometry(.17,.23,.18,10),'limestone',Math.cos(a)*1.4,8.8,z+Math.sin(a)*1.4);}}
 // Decorative floor inlay stays clear of the passages.
 for(const x of [-5.35,5.35])w.box(x,.008,0,.055,.009,51,'brass');for(const z of [-20,13])w.box(0,.008,z,10.7,.009,.055,'brass');
 for(const z of [-21.7,-10.7,.3,11.3,22.3]){const m=w.mesh(new T.PlaneGeometry(5.8,7.2),'sunwash',.5,.017,z+.9);m.rotation.x=-PI/2;m.castShadow=false;}
 // Beaded picture frames and discreet gallery picture lamps.
 for(const side of [-1,1])for(const z of (side===-1?[-13,13]:[-13,-2])){w.box(side*11.64,3.83,z,.25,.10,1.65,'brass');w.box(side*11.5,3.76,z,.14,.055,1.4,'light');}
 // Layered landscaping beyond the window: tapered trunks and overlapping crowns.
 for(let i=0;i<14;i++){const x=(i-6.5)*5.2,z=-44-(i%4)*5;w.mesh(new T.CylinderGeometry(.1,.18,3.8,7),'oak',x,1.7,z);for(let k=0;k<3;k++)w.mesh(new T.ConeGeometry(1.2-k*.15,2.5,8),i%2?'leaf':'leaf2',x,2+k*1.25,z);}
}
