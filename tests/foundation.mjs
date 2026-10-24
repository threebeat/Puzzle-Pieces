import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ROOMS,DOORS,STAIR,floorAt,roomAt} from '../dist/layout.mjs';
// Headless canvas supplies texture drawing calls; the actual production world builds all geometry and collision boxes.
const context=new Proxy({measureText:s=>({width:s.length*18}),createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>k in o?o[k]:()=>{}});
globalThis.document={createElement:()=>({width:512,height:512,getContext:()=>context})};globalThis.window={addEventListener(){}};globalThis.innerWidth=1365;globalThis.innerHeight=900;globalThis.devicePixelRatio=1;
const {Museum}=await import('../dist/world.mjs');const world=new Museum({}, {headless:true});
assert.equal(ROOMS.filter(r=>r.exhibit).length,5);assert.equal(ROOMS.filter(r=>r.exhibit==='hidden').length,3);assert.equal(new Set(ROOMS.map(r=>r.id)).size,ROOMS.length);
assert.equal(floorAt(8,0,4.5),null,'east mezzanine closed');assert.equal(floorAt(15,-22,0),null,'east arcade closed');assert.equal(floorAt(23,29,0),null,'security closed');assert.equal(floorAt(0,5,4.5),null,'no bridge or floating upper floor');
for(const r of ROOMS.filter(r=>r.spawn)){const[x,y,z]=r.spawn;assert.ok(!world.blocked(x,z,y),r.id+' spawn collision');assert.equal(floorAt(x,z,y),y,r.id+' spawn floor');}
function moveTo(p,x,z,steps=80){const dx=(x-p.x)/steps,dz=(z-p.z)/steps;for(let i=0;i<steps;i++)world.move(p,dx,dz);return p;}
// Traverse each public threshold both ways with physical collision, not just a connectivity graph.
for(const d of DOORS.filter(d=>!d.locked)){
 const mid=(d.from+d.to)/2;for(const direction of[-1,1]){const p={x:d.axis==='x'?d.at-direction*.9:mid,z:d.axis==='z'?d.at-direction*.9:mid,y:d.y};const endX=p.x+(d.axis==='x'?direction*1.8:0),endZ=p.z+(d.axis==='z'?direction*1.8:0);moveTo(p,endX,endZ);assert.ok(Math.hypot(p.x-endX,p.z-endZ)<.05,`${d.a} ↔ ${d.b} blocked at ${JSON.stringify(p)}`);}}
for(const d of DOORS.filter(d=>d.locked)){const mid=(d.from+d.to)/2,p={x:d.axis==='x'?d.at-1:mid,z:d.axis==='z'?d.at-1:mid,y:0};moveTo(p,p.x+(d.axis==='x'?3:0),p.z+(d.axis==='z'?3:0));assert.ok(d.axis==='x'?p.x<d.at:p.z<d.at,'locked door allowed passage');}
const stair={x:-8,z:14.5,y:0};moveTo(stair,-8,27,300);assert.ok(Math.abs(stair.y-4.5)<.01,'stair reaches mezzanine');moveTo(stair,-8,14.5,300);assert.ok(stair.y<.05,'stair descends to hall');
const edge={x:-6.7,z:0,y:4.5};moveTo(edge,0,0);assert.ok(edge.x<-6,'upper railing prevents falling into void');
// Route through all Hidden Operators rooms without teleporting.
const route={x:-17,z:-22,y:0};for(const [x,z]of[[-29,-22],[-29,-30],[-29,-37],[-17,-37],[-5,-37]]){moveTo(route,x,z,180);assert.ok(Math.hypot(route.x-x,route.z-z)<.1,'Hidden Operators route blocked');}assert.equal(roomAt(route.x,route.z,route.y).id,'ho3');
assert.equal(world.targets.filter(t=>t.id==='elevators').length,2);world.setLamp(false);assert.equal(world.lampLight.intensity,0);world.setLamp(true);assert.ok(world.lampLight.intensity>0);
const manifest=JSON.parse(readFileSync('docs/legacy/source-manifest.json','utf8'));for(const [path,hash]of Object.entries(manifest.files))assert.equal(createHash('sha256').update(readFileSync('docs/legacy/'+path)).digest('hex'),hash,'legacy snapshot modified: '+path);
const archive=readFileSync('docs/legacy/puzzles-and-solutions.md','utf8');for(const answer of ['62533','07080901','KEY','FRAME','CARE','Night attendant','Lot 409'])assert.ok(archive.includes(answer),'archive missing '+answer);
for(const file of ['option-a.svg','option-b.svg','option-a-upper.svg','option-b-upper.svg','progression.svg'])assert.ok(existsSync('docs/floor-plans/'+file));
// Current runtime must not depend on archived puzzle modules.
for(const f of ['app.mjs','world.mjs','layout.mjs'])assert.ok(!/from\s*['"][^'"]*legacy/.test(readFileSync('dist/'+f,'utf8')));
let meshes=0;world.scene.traverse(o=>{if(o.isMesh)meshes++;});console.log(`PASS: ${ROOMS.length} spaces; all public thresholds both ways; five exhibit rooms; locked gates; full stair ascent/descent; upper void; lamp; ${Object.keys(manifest.files).length} immutable archive files. Static scene: ${meshes} meshes after batching.`);
