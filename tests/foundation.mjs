import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ROOMS,DOORS,WINDOWS,STAIR,DESK,wallSegments,floorAt,roomAt} from '../dist/layout.mjs';
// Headless canvas supplies texture drawing calls; the actual production world builds all geometry and collision boxes.
const context=new Proxy({measureText:s=>({width:s.length*18}),createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>k in o?o[k]:()=>{}});
globalThis.document={createElement:()=>({width:512,height:512,getContext:()=>context})};globalThis.window={addEventListener(){}};globalThis.innerWidth=1365;globalThis.innerHeight=900;globalThis.devicePixelRatio=1;
const {Museum}=await import('../dist/world.mjs');const world=new Museum({}, {headless:true});
assert.equal(ROOMS.filter(r=>r.exhibit).length,5);assert.equal(ROOMS.filter(r=>r.exhibit==='hidden').length,3);assert.equal(new Set(ROOMS.map(r=>r.id)).size,ROOMS.length);
assert.equal(floorAt(10,0,4.5),null,'east mezzanine closed');assert.equal(floorAt(15,-22,0),null,'east arcade closed');assert.equal(floorAt(25,29,0),null,'security closed');assert.equal(floorAt(0,5,4.5),null,'no bridge or floating upper floor');
for(const r of ROOMS.filter(r=>r.spawn)){const[x,y,z]=r.spawn;assert.ok(!world.blocked(x,z,y),r.id+' spawn collision');assert.equal(floorAt(x,z,y),y,r.id+' spawn floor');}
function moveTo(p,x,z,steps=80){const dx=(x-p.x)/steps,dz=(z-p.z)/steps;for(let i=0;i<steps;i++)world.move(p,dx,dz);return p;}
// Traverse each public threshold both ways with physical collision, not just a connectivity graph.
for(const d of DOORS.filter(d=>!d.locked)){
 const mid=(d.from+d.to)/2;for(const direction of[-1,1]){const p={x:d.axis==='x'?d.at-direction*.9:mid,z:d.axis==='z'?d.at-direction*.9:mid,y:d.y};const endX=p.x+(d.axis==='x'?direction*1.8:0),endZ=p.z+(d.axis==='z'?direction*1.8:0);moveTo(p,endX,endZ);assert.ok(Math.hypot(p.x-endX,p.z-endZ)<.05,`${d.a} ↔ ${d.b} blocked at ${JSON.stringify(p)}`);}}
for(const d of DOORS.filter(d=>d.locked)){const mid=(d.from+d.to)/2,p={x:d.axis==='x'?d.at-1:mid,z:d.axis==='z'?d.at-1:mid,y:0};moveTo(p,p.x+(d.axis==='x'?3:0),p.z+(d.axis==='z'?3:0));assert.ok(d.axis==='x'?p.x<d.at:p.z<d.at,'locked door allowed passage');}
// Walk the complete return stair, including the turn and both transitions. Check real mesh headroom.
const T=await import('../dist/vendor/three.module.js');world.scene.updateMatrixWorld(true);
const stair={x:-6,z:25,y:0},poses=[];
const checkpoints=[[-6,31.9,2.2125],[-6,33.5,2.25],[-10,33.5,2.25],[-10,26.1,4.4625],[-10,24,4.5]];
function stairWalk(x,z){const dx=(x-stair.x)/300,dz=(z-stair.z)/300;for(let i=0;i<300;i++){world.move(stair,dx,dz);if(i%15===0)poses.push({...stair});}assert.ok(Math.hypot(stair.x-x,stair.z-z)<.05,'return stair blocked: '+JSON.stringify(stair));}
for(const [x,z,y] of checkpoints){stairWalk(x,z);assert.ok(Math.abs(stair.y-y)<.02,'incorrect stair elevation');}
for(const [x,z] of [[-10,26.1],[-10,33.5],[-6,33.5],[-6,25]])stairWalk(x,z);assert.ok(stair.y<.05,'return stair descends to hall');
for(const p of poses){const ray=new T.Raycaster(new T.Vector3(p.x,p.y+.2,p.z),new T.Vector3(0,1,0),0,2.1);assert.equal(ray.intersectObjects(world.scene.children,true).length,0,'less than 2.3 m headroom at '+JSON.stringify(p));}
const edge={x:-8.7,z:0,y:4.5};moveTo(edge,0,0);assert.ok(edge.x<-8,'upper railing prevents falling into void');
assert.equal(floorAt(-10,30,0),null,'cannot walk through the solid return flight');
assert.equal(floorAt(-8,33.5,0),null,'cannot enter underneath the turning landing');
const sideEscape={x:-6,y:1.125,z:29};moveTo(sideEscape,-2,29);assert.ok(sideEscape.x<-4.7,'stair rail prevents side exit');
// No duplicate wall slabs at shared room boundaries; every door/window cuts the union wall.
const walls=wallSegments();for(let i=0;i<walls.length;i++)for(let j=i+1;j<walls.length;j++){const a=walls[i],b=walls[j];if(a.axis!==b.axis||a.at!==b.at)continue;assert.ok(Math.min(a.to,b.to)-Math.max(a.from,b.from)<1e-6||Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)<1e-6,'coplanar overlapping wall slabs');}
for(const hole of [...DOORS,...WINDOWS])for(const w of walls.filter(w=>w.axis===hole.axis&&w.at===hole.at))assert.ok(Math.min(w.to,hole.to)-Math.max(w.from,hole.from)<1e-6||Math.min(w.y+w.height,hole.y+(hole.height||3.2))-Math.max(w.y,hole.y)<1e-6,'wall fills a portal');
assert.equal(world.glazing.length,WINDOWS.length);for(const pane of world.glazing){assert.equal(pane.geometry.type,'PlaneGeometry');assert.equal(pane.receiveShadow,false);assert.equal(pane.castShadow,false);assert.equal(pane.material.depthWrite,false);}
// The larger desk has circular collision and a reachable monitor from the visitor side.
assert.ok(world.blocked(0,DESK.radius,0));assert.ok(!world.blocked(2.5,2.5,0),'round desk should not block square corners');
world.camera.position.set(0,1.65,DESK.topRadius+.6);world.camera.lookAt(0,1.75,DESK.monitorZ);world.camera.updateMatrixWorld();assert.equal(world.focus()?.id,'monitor','desk monitor must stay inspectable');
// Enter the hollow counter through the west opening, turn inside, then leave through the same opening.
const deskVisitor={x:-4,y:0,z:0};for(const [x,z] of [[0,0],[-.4,.7],[-.4,0],[-4,0]]){moveTo(deskVisitor,x,z,120);assert.ok(Math.hypot(deskVisitor.x-x,deskVisitor.z-z)<.04,'desk entrance/interior obstructed');}
assert.ok(!world.blocked(0,0,0),'staff centre must be empty');assert.ok(world.blocked(-2.15,.8,0),'counter entry edge must remain solid');
const counterWall={x:4,y:0,z:0};moveTo(counterWall,0,0,120);assert.ok(counterWall.x>DESK.topRadius,'cannot pass through the closed side of the ring');
const staffRay=new T.Raycaster(new T.Vector3(0,.2,0),new T.Vector3(0,1,0),0,2.1);assert.equal(staffRay.intersectObjects(world.scene.children,true).length,0,'counter centre has a visible lid');
// The whole northern approach must be clear, including where the old plant stood.
for(const z of [-23.2,-22,-20.8])for(const direction of [-1,1]){const p={x:direction===-1?-8:-18,z,y:0},end=direction===-1?-18:-8;moveTo(p,end,z,160);assert.ok(Math.abs(p.x-end)<.04,'northern arcade approach is obstructed');}
assert.ok(!world.blocked(-13.8,-21.8,0),'former plant position still obstructed');
// Wall plaques are anchored to solid wall at all corners and stay beyond doorway/window trim.
for(const s of world.signs){
 assert.ok(['wall','fixture','floor'].includes(s.mount),'unsupported floating sign');
 if(s.mount==='wall'){
  for(const along of [s.along-s.w/2,s.along,s.along+s.w/2])for(const y of [s.y-s.h/2,s.y,s.y+s.h/2])assert.ok(walls.some(w=>w.axis===s.axis&&w.at===s.at&&along>=w.from-1e-6&&along<=w.to+1e-6&&y>=w.y-1e-6&&y<=w.y+w.height+1e-6),'sign is not wall-backed: '+s.id);
  for(const d of [...DOORS,...WINDOWS].filter(d=>d.axis===s.axis&&d.at===s.at))assert.ok(s.along+s.w/2<d.from-.2||s.along-s.w/2>d.to+.2||s.y+s.h/2<d.y-.2||s.y-s.h/2>d.y+(d.height||3.2)+.2,'sign overlaps a doorway/window: '+s.id);
 }else if(s.mount==='fixture')assert.ok(['counter','monitor','plinth'].includes(s.support),'fixture sign requires a support');
}
for(let i=0;i<world.signs.length;i++)for(let j=i+1;j<world.signs.length;j++){const a=world.signs[i],b=world.signs[j];if(a.mount==='wall'&&b.mount==='wall'&&a.axis===b.axis&&a.at===b.at&&a.normal===b.normal)assert.ok(Math.abs(a.along-b.along)>(a.w+b.w)/2+.05||Math.abs(a.y-b.y)>(a.h+b.h)/2+.05,'wall signs overlap');}
assert.ok(world.signAtlasPages<=1,'sign atlas texture budget exceeded');
// Route through all Hidden Operators rooms without teleporting.
const route={x:-19,z:-22,y:0};for(const [x,z]of[[-31,-22],[-31,-30],[-31,-37],[-19,-37],[-7,-37]]){moveTo(route,x,z,180);assert.ok(Math.hypot(route.x-x,route.z-z)<.1,'Hidden Operators route blocked');}assert.equal(roomAt(route.x,route.z,route.y).id,'ho3');
assert.equal(world.targets.filter(t=>t.id==='elevators').length,2);world.setLamp(false);assert.equal(world.lampLight.intensity,0);world.setLamp(true);assert.ok(world.lampLight.intensity>0);
const manifest=JSON.parse(readFileSync('docs/legacy/source-manifest.json','utf8'));for(const [path,hash]of Object.entries(manifest.files))assert.equal(createHash('sha256').update(readFileSync('docs/legacy/'+path)).digest('hex'),hash,'legacy snapshot modified: '+path);
const archive=readFileSync('docs/legacy/puzzles-and-solutions.md','utf8');for(const answer of ['62533','07080901','KEY','FRAME','CARE','Night attendant','Lot 409'])assert.ok(archive.includes(answer),'archive missing '+answer);
for(const file of ['option-a.svg','option-b.svg','option-a-upper.svg','option-b-upper.svg','progression.svg','return-stair.svg'])assert.ok(existsSync('docs/floor-plans/'+file));
// Current runtime must not depend on archived puzzle modules.
for(const f of ['app.mjs','world.mjs','layout.mjs'])assert.ok(!/from\s*['"][^'"]*legacy/.test(readFileSync('dist/'+f,'utf8')));
let meshes=0,triangles=0;const materials=new Set(),maps=new Set();world.scene.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;materials.add(o.material);for(const key of ['map','bumpMap','roughnessMap'])if(o.material[key])maps.add(o.material[key]);}});assert.ok(meshes<=75,'static draw budget exceeded');assert.ok(triangles<=135000,'triangle budget exceeded: '+triangles);assert.ok(maps.size<=60,'texture budget exceeded');assert.equal(world.m.glass.transparent,true);assert.equal(world.m.leaf.side,2);assert.ok(world.m.marble.bumpMap);world.setQuality('economy');assert.equal(world.quality,'economy');world.setQuality('bogus');assert.equal(world.quality,'balanced');let invalidShadows=0;world.scene.traverse(o=>{if(o.isMesh&&(o.material===world.m.light||o.material===world.m.sky||o.material===world.m.glass)&&o.castShadow)invalidShadows++;});assert.equal(invalidShadows,0,'glass or luminous surfaces block daylight');console.log(JSON.stringify({meshes,triangles,materials:materials.size,textures:maps.size}));console.log(`PASS: ${ROOMS.length} spaces; all public thresholds both ways; five exhibit rooms; locked gates; return stair ascent/descent and headroom; shared walls; glazing; ring-desk access; clear arcade; mounted signs; upper void; lamp; ${Object.keys(manifest.files).length} immutable archive files. Static scene: ${meshes} meshes after batching.`);
