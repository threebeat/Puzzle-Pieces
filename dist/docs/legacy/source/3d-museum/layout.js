import {LIFTS} from './circulation-data.js';
// A single spatial model drives architecture, collision, the player map, and author plans.
export const LEVEL_HEIGHT=6;
const room=(id,name,x1,x2,z1,z2,y,h,material,zone,extra={})=>({id,name,x1,x2,z1,z2,x:(x1+x2)/2,z:(z1+z2)/2,w:x2-x1,d:z2-z1,y,h,material,zone,...extra});
export const ROOMS=[
 room('nave','The Long Hall',-11,8,-32,38,0,14,'limestone','hall',{noCeiling:true}),
 room('pigment','Pigment Room',-28,-11,-34,-14,0,7.7,'plaster','color'),
 room('reverse','Reverse Gallery',-46,-28,-34,-20,0,5.6,'plaster','color'),
 room('lightwell','Light Well',-46,-26,-52,-34,0,9.5,'concrete','color',{noCeiling:true}),
 room('doubts','Archive of Doubts',-26,-16,-52,-40,0,5.6,'concrete','secret',{secret:'colorSecret'}),
 room('north-arcade','North Arcade',-16,-11,-52,-32,0,5.6,'limestone','service'),
 room('washroom','Washrooms',8,20,-32,-20,0,4.8,'tile','service'),
 room('listening','Listening Gallery',26,46,-20,-2,0,5.6,'wood','sound'),
 room('echo','Echo Chamber',46,64,-30,-10,0,11.5,'dark','sound'),
 room('vault','Resonance Vault',44,64,-48,-30,0,5.6,'dark','sound'),
 room('sound-foyer','East Approach',8,46,-2,4,0,5.6,'wood','sound'),
 room('north-cross','North Cross Passage',26,44,-48,-30,0,5.6,'concrete','secret',{secret:'quietPassage'}),
 room('north-service','North Service Passage',20,26,-48,-20,0,5.6,'concrete','secret',{secret:'quietPassage'}),
 room('staff','Staff Stair',16,26,-20,-2,0,18.5,'concrete','service',{noCeiling:true}),
 room('suspension','Counterform Gallery',-26,-11,4,22,0,5.6,'plaster','form'),
 room('hinge','Hinge Walk',-34,-26,4,10,0,5.6,'concrete','form'),
 room('drafting','Drafting Room',-46,-26,-14,4,0,5.6,'clay','form'),
 room('absent','The Absent Room',-26,-11,-14,4,0,5.6,'clay','form'),
 room('shop','Gallery Gift Shop',8,20,10,24,0,4.8,'wood','service'),
 room('security','Security',14,26,40,54,0,4.8,'concrete','service'),
 room('security-approach','Security Approach',8,14,40,54,0,4.5,'limestone','service'),
 room('conference','Conference Room',-7,3,38,54,0,7,'wood','service'),
 room('employee-vestibule','Employee Vestibule',3,8,38,54,0,4.5,'concrete','service'),
 room('south-service','South Service Hall',-7,26,54,60,0,4.5,'concrete','service',{secret:'basementAccess'}),
 room('supply','Supply Closet',-16,-7,54,60,0,4.5,'concrete','service',{secret:'basementAccess'}),
 room('south-staff','Employee Stair',16,26,60,78,0,11.5,'concrete','service',{secret:'basementAccess'}),
 room('upper-service','Employee Gallery',22,26,24,75,6,4.8,'plaster','service'),
 room('upper-lift-lobby','Public Lift Landing',26,28,24,40,6,4.8,'limestone','service'),
 ...[0,6].flatMap(y=>[room('public-a-'+y,'Collection Lift 01',28,34,24,32,y,4.8,'metal','service'),room('public-b-'+y,'Collection Lift 02',28,34,32,40,y,4.8,'metal','service')]),
 room('arcade','South Arcade',8,28,24,40,0,5.6,'limestone','service'),
 room('service-lift','South Service Lift',8,16,60,70,0,5.6,'concrete','service',{secret:'basementAccess'}),
  room('garage','Service Garage',-28,-1,60,86,0,5.2,'concrete','service'),
 room('workshop','Letter Workshop',-46,-28,62,78,0,5.2,'wood','form'),
 room('garage-return','Counterform Service Passage',-38,-28,10,62,0,4.2,'concrete','secret',{secret:'garagePassage'}),
 room('lantern','Lantern Walk',8,16,-20,-2,6,5.6,'wood','upper'),
 room('loft','Projection Loft',26,46,-20,-2,6,5.6,'wood','upper'),
 room('staff-hall','Employee Hall',16,26,-2,24,6,5.6,'concrete','service'),
 room('breakroom','Employee Break Room',26,36,0,11,6,3.55,'plaster','service'),
 room('freight-upper','Freight Landing',26,36,14,24,6,5.6,'concrete','service'),
 room('time-entry','IV · In Perpetuity',-28,-11,4,24,6,7.2,'plaster','time'),
 room('time-machine','The Fifth Beat',-46,-28,4,20,6,7.2,'dark','time'),
 room('time-archive','Afterimage Archive',-46,-28,-12,4,6,7.2,'clay','time'),
 room('terrace','North Terrace',-6,8,-41,-32,6,0,'stone','upper',{outdoor:true}),
 room('admin-hall','Administration Hall',26,29,-20,14,12,4.8,'wood','service'),
 room('birthday','Birthday Room',29,45,-2,14,12,4.8,'plaster','service'),
 room('administrator','Administrator’s Office',29,45,-20,-2,12,4.8,'wood','service'),
 room('staging','V · The Uncatalogued',-24,28,8,40,-6,5.4,'concrete','basement',{secret:'basementVisited'}),
 room('lower-lift','Service Lift / B1',8,16,60,70,-6,5.4,'concrete','service',{secret:'basementVisited'}),
 room('lower-approach','Inspection Passage',8,16,40,60,-6,5.4,'concrete','service',{secret:'basementVisited'}),
 room('freight-lower','Freight Lift / B1',-32,-24,20,32,-6,5.4,'concrete','service',{secret:'basementVisited'})
];
const door=(id,axis,c,p,w,y,h,gate=null,secret=false)=>({id,axis,c,p,w,y,h,gate,secret});
export const DOORS=[
 door('color-entry','x',-11,-22,4.5,0,4.7),door('reverse-door','x',-28,-28,3.4,0,3.6,'colorLab'),
 door('well-door','z',-34,-38,4,0,4.2),door('archive-panel','x',-26,-46,3.2,0,3.5,'colorSecret',true),
 door('archive-exit','x',-16,-46,3.2,0,3.5,'colorSecret',true),door('arcade-north','z',-32,-13.5,3,0,4.7),door('arcade-north-link','z',-34,-13.5,3,0,4.7),
 door('north-color-link','x',-16,-36,3,0,3.5,'colorSecret',true),
 door('washroom-door','x',8,-26,3.4,0,3.6),door('sound-entry','x',8,1,4.4,0,4.8),door('sound-foyer','z',-2,36,4,0,4.8),
 door('echo-door','x',46,-16,3.6,0,4,'soundLab'),door('vault-door','z',-30,54,4,0,4.6),
 door('quiet-panel','x',44,-40,3,0,3.4,'quietPassage',true),door('north-cross-link','x',26,-40,3,0,3.4),door('staff-bottom','z',-20,23,3,0,3.4,'basementAccess'),
 door('form-entry','x',-11,11,3.5,0,4.3),door('hinge-entry','x',-26,7,3,0,3.8),door('drafting-entry','z',4,-30,3.1,0,3.8),
 door('absent-door','x',-26,-6,3.4,0,4,'formLab'),door('form-secret','x',-11,-5,3,0,3.6,'formShortcut',true),
 door('south-arcade-entry','x',8,29,3.6,0,4.2),door('shop-door','z',24,14,2.8,0,3.3,'giftShop'),
 door('security-approach','z',40,11,3,0,3.4),door('security-door','x',14,45,2.8,0,3.1,'office'),
 door('south-service','z',54,11,3,0,3.4,'basementAccess'),
 door('employees-only','z',38,6,2.5,0,3.2,'basementAccess'),door('vestibule-service','z',54,5.5,3,0,3.4),
 door('conference-entry','x',3,45,3,0,3.5),door('conference-service','z',54,-2,3,0,3.5),
 door('supply-entry','x',-7,57,2.6,0,3),door('service-lift-entry','z',60,12,3,0,3.5),door('employee-stair-entry','z',60,19,3.3,0,3.5),
 door('employee-upper-entry','z',75,24,3,6,3.5),door('upper-service-entry','z',24,24,3,6,3.5),door('upper-lift-entry','x',26,28,2.8,6,3.5),
 ...[0,6].flatMap(y=>[door('public-a-'+y,'x',28,28,2.5,y,3.4),door('public-b-'+y,'x',28,36,2.5,y,3.4)]),
 door('garage-entry','z',60,-4,2.8,0,3.4,'garage'),door('workshop-entry','x',-28,70,3,0,3.4,'garageWorkshop'),
 door('workshop-return','z',62,-32,3,0,3.2,'garagePassage',true),door('return-hinge','z',10,-31,3,0,3.2,'garagePassage',true),
 door('lantern-entry','x',8,-12,3.2,6,4),door('staff-top','x',16,-18.4,2.5,6,3.5,'basementAccess'),door('loft-entry','x',26,-18.4,2.5,6,3.5),
 door('staff-hall-door','z',-2,21,3,6,3.4),door('breakroom-door','x',26,2.2,2.6,6,2.7),door('freight-upper-door','x',26,19,2.8,6,3.5),
 door('time-entry','x',-11,11.5,3.4,6,4.5),door('time-machine','x',-28,12,3.3,6,4),door('time-archive','z',4,-37,3.2,6,3.8,'timeArchive'),
 door('admin-hall-door','x',26,-3.4,2.8,12,3.3),door('birthday-door','x',29,5,3,12,3.2),door('admin-door','x',29,-10,2.8,12,3.2),
 door('terrace-entry','z',-32,5.5,2.8,6,3.6,'balcony'),
 door('staging-entry','z',40,12,3.5,-6,3.6),door('lower-lift-entry','z',60,12,3.5,-6,3.6),door('freight-lower-door','x',-24,26,3.4,-6,3.6,'clearance')
];
export const WINDOWS=[{id:'great-window',axis:'z',c:-32,p:-1,w:9,y:.6,h:12.5},{id:'shop-window',axis:'x',c:8,p:17,w:13.2,y:.3,h:3.8},{id:'security-internal-window',axis:'x',c:14,p:49.8,w:3,y:1.35,h:1.8}];
export const WALKWAYS=[
 {id:'west-gallery',x:-9.5,z:3,w:3,d:70,y:6},{id:'east-gallery',x:6.5,z:-14.5,w:3,d:35,y:6},
 {id:'staff-landing',x:21,z:-18.5,w:10,d:3,y:6},{id:'staff-south-landing',x:21,z:-3.5,w:10,d:3,y:6},
 {id:'staff-sidewalk',x:25.2,z:-11,w:1.6,d:12,y:6},{id:'third-landing',x:21,z:-3.5,w:10,d:3,y:12},
 {id:'south-staff-landing',x:21,z:76.5,w:10,d:3,y:6}
];
export const STAIRS=[
 {id:'south-wall-stair',axis:'x',x1:-8,x2:4.3,z1:35.4,z2:37.7,from:0,to:6,steps:30},
 {id:'employee-stair',x1:17.5,x2:20.5,z1:62,z2:75,from:0,to:6,steps:30,reverse:true},
 {id:'staff-stair',x1:20,x2:24,z1:-17,z2:-5,from:0,to:6,steps:30},
 {id:'staff-third',x1:16.8,x2:19.4,z1:-17,z2:-5,from:6,to:12,steps:30,reverse:true}
];
export const stairPoint=(s,t)=>s.axis==='x'?{x:s.reverse?s.x1+t*(s.x2-s.x1):s.x2-t*(s.x2-s.x1),z:(s.z1+s.z2)/2,y:s.from+t*(s.to-s.from)}:{x:(s.x1+s.x2)/2,z:s.reverse?s.z1+t*(s.z2-s.z1):s.z2-t*(s.z2-s.z1),y:s.from+t*(s.to-s.from)};
export const FLOOR_PADS=[{x:-22,z:16},{x:-18,z:16},{x:-22,z:20},{x:-18,z:20}];
export const ARCH=[];
const wall=(id,x,z,w,d,y,h,material='limestone',gate=null)=>ARCH.push({id,x,z,w,d,y,h,material,gate});
// Subdivide the union of collinear room boundaries, then subtract openings at
// their exact floor height. Shared walls cannot silently close a second door.
const lines=new Map();
for(const r of ROOMS.filter(r=>!r.outdoor))for(const e of [
 {axis:'x',c:r.x1,a:r.z1,b:r.z2},{axis:'x',c:r.x2,a:r.z1,b:r.z2},
 {axis:'z',c:r.z1,a:r.x1,b:r.x2},{axis:'z',c:r.z2,a:r.x1,b:r.x2}
]){const key=e.axis+':'+e.c;if(!lines.has(key))lines.set(key,[]);lines.get(key).push({...e,y:r.y,top:r.y+r.h,material:r.material,id:r.id});}
for(const [key,segments] of lines){
 const {axis,c}=segments[0],holes=[...DOORS,...WINDOWS].filter(d=>d.axis===axis&&d.c===c);
 const along=[...new Set([...segments.flatMap(s=>[s.a,s.b]),...holes.flatMap(d=>[d.p-d.w/2,d.p+d.w/2])])].sort((a,b)=>a-b);
 const ys=[...new Set([...segments.flatMap(s=>[s.y,s.top]),...holes.flatMap(d=>[d.y,d.y+d.h])])].sort((a,b)=>a-b);
 for(let i=0;i<along.length-1;i++)for(let j=0;j<ys.length-1;j++){
  const a=along[i],b=along[i+1],lo=ys[j],hi=ys[j+1],m=(a+b)/2,v=(lo+hi)/2;
  const covers=segments.filter(s=>m>s.a&&m<s.b&&v>s.y&&v<s.top);if(!covers.length)continue;
  if(holes.some(d=>m>d.p-d.w/2&&m<d.p+d.w/2&&v>d.y&&v<d.y+d.h))continue;
  const material=covers.find(s=>s.id!=='nave')?.material||covers[0].material;
  wall(`wall:${key}:${i}:${j}`,axis==='x'?c:m,axis==='x'?m:c,axis==='x'?.32:b-a,axis==='x'?b-a:.32,lo,hi-lo,material);
 }
}
for(const d of DOORS.filter(d=>d.gate))wall(d.id,d.axis==='x'?d.c:d.p,d.axis==='x'?d.p:d.c,d.axis==='x'?.22:d.w,d.axis==='x'?d.w:.22,d.y,d.h,d.secret?'concrete':d.gate==='giftShop'?'glass':'metal',d.gate);
// The window admits light, never the player.
for(const w of WINDOWS)wall(w.id,w.axis==='x'?w.c:w.p,w.axis==='x'?w.p:w.c,w.axis==='x'?.08:w.w,w.axis==='x'?w.w:.08,w.y,w.h,'glass');
for(const s of STAIRS){if(s.axis==='x')for(const z of[s.z1-.06,s.z2+.06])wall(s.id+'-side'+z,(s.x1+s.x2)/2,z,s.x2-s.x1,.1,s.from,s.to-s.from+1.1,'invisible');else for(const x of[s.x1-.06,s.x2+.06])wall(s.id+'-side'+x,x,(s.z1+s.z2)/2,.1,s.z2-s.z1,s.from,s.to-s.from+1.1,'invisible');}
for(const lift of LIFTS)wall('lift-shutter:'+lift.id,lift.axis==='x'?lift.c:lift.p,lift.axis==='x'?lift.p:lift.c,lift.axis==='x'?.12:2.45,lift.axis==='x'?2.45:.12,lift.y,3.3,'invisible',lift.gate);
const rail=(id,x,z,w,d,y=6)=>wall(id,x,z,w,d,y,1.15,'rail');
rail('east-inner',5,-14.5,.07,35);rail('east-south-end',6.5,3,3,.07);rail('west-inner',-8,-.8,.07,62.4);rail('west-south-approach',-8,33,.07,4.5);
rail('west-north-end',-9.5,-32,3,.07);rail('terrace-west',-6,-36.5,.07,9);rail('terrace-east',8,-36.5,.07,9);rail('terrace-north',1,-41,14,.07);
rail('staff-walk',24.4,-11,.07,12,6);rail('third-landing-north',22.8,-5,6.4,.07,12);rail('third-landing-west',16,-3.5,.07,3,12);

export const PROPS=[
 {id:'statue',x:0,z:-24.5,w:3.4,d:3.4,y:0,h:.5},
 {id:'main-bench-a',x:5.8,z:-3,w:1.2,d:4,y:0,h:.55},{id:'main-bench-b',x:-8.7,z:-3,w:1.2,d:4,y:0,h:.55},
 ...LIFTS.flatMap(l=>[[-2,2,.12,4],[2,2,.12,4],[0,4,4,.12]].map(([x,z,w,d],i)=>({id:l.id+'-wall-'+i,x:l.axis==='z'?l.p+x:l.c+z,z:l.axis==='z'?l.c+z:l.p-x,w:l.axis==='z'?w:d,d:l.axis==='z'?d:w,y:l.y,h:3.9}))),
 {id:'information-desk',x:-1.5,z:3,w:6.8,d:2.6,y:0,h:1.05},
 {id:'color-console',x:-36,z:-44.8,w:5.6,d:1.1,y:0,h:1.1},
 {id:'sound-console',x:54,z:-41.8,w:5.4,d:1.1,y:0,h:1.1},
 {id:'breakroom-counter',x:31.3,z:10.15,w:6,d:1.15,y:6,h:1.02},
 {id:'breakroom-fridge',x:27.3,z:10.12,w:1.24,d:1.3,y:6,h:2.25},
 {id:'breakroom-table',x:31,z:4.7,w:2.7,d:1.45,y:6,h:.83},
 ...[[-33.75,-22.05],[-32.25,-22.05],[-33.75,-19.35],[-31.9,-18.95]].map(([x,z],i)=>({id:'staff-chair-'+i,x:-x-2,z:-z-16,w:.7,d:.7,y:6,h:1})),
 {id:'security-checker',x:20.5,z:52,w:1.2,d:1.25,y:0,h:1.4},
 {id:'training-desk',x:23,z:52,w:4.3,d:1.1,y:0,h:.9},
 {id:'garage-van',x:-12,z:76,w:3.8,d:7.4,y:0,h:2.4},
 {id:'letter-table',x:-37,z:71,w:5,d:2.3,y:0,h:1},
 {id:'dispatch-table',x:-25,z:67,w:3,d:1.1,y:0,h:1},
 {id:'office-desk',x:19,z:42.5,w:5,d:1.3,y:0,h:.9},
 {id:'sink',x:18.8,z:-23,w:1.3,d:4,y:0,h:1},
 {id:'stall-a',x:12.5,z:-29.5,w:.12,d:4.4,y:0,h:2.3},{id:'stall-b',x:16,z:-29.5,w:.12,d:4.4,y:0,h:2.3},
 {id:'toilet-a',x:10.4,z:-30.8,w:.8,d:1,y:0,h:.7},{id:'toilet-b',x:14.2,z:-30.8,w:.8,d:1,y:0,h:.7},
 {id:'weights-base',x:36,z:-10,w:5,d:3,y:6,h:.22},
 ...[-15,1,17].map((x,i)=>({id:'lot-table-'+i,x,z:23,w:10,d:2.3,y:-6,h:1})),
 {id:'tool-bench',x:5,z:34,w:4,d:1.3,y:-6,h:1},
 {id:'verifier',x:13,z:36,w:2.7,d:1.3,y:-6,h:1.4},
 {id:'birthday-table',x:37,z:7,w:7,d:2,y:12,h:.85},
 ...[[-9.3,27],[6.4,27],[-9.3,-29],[6.4,-29]].map(([x,z],i)=>({id:'plant-'+i,x,z,w:.86,d:.86,y:0,h:.9})),
 {id:'beat-base',x:-37,z:12,w:3.8,d:3.8,y:6,h:.6},
 ...[[-20,36],[-6,36],[23,36]].map(([x,z],i)=>({id:'crate-'+i,x,z,w:2,d:1.5,y:-6,h:1.3})),
 {id:'admin-desk',x:37,z:-14,w:5,d:2,y:12,h:.85}
];
PROPS.push(...[-7,4].flatMap(x=>[-21,-7,9,24].map(z=>({id:'hall-column-'+x+'-'+z,x,z,w:1.15,d:1.15,y:0,h:6}))),...[-7,4].flatMap(x=>[-14,1,17].map(z=>({id:'classical-'+x+'-'+z,x,z,w:1.4,d:1.4,y:0,h:3.8}))),{id:'conference-table',x:-2,z:46,w:3.5,d:7,y:0,h:.82},{id:'shop-counter',x:17,z:19,w:2,d:5,y:0,h:1.1});
export const FLOORS=ROOMS;
export const SPAWN={x:-1.5,z:29,y:0,yaw:0,pitch:.015};
export const inside=(x,z,r,margin=0)=>Math.abs(x-r.x)<=r.w/2-margin&&Math.abs(z-r.z)<=r.d/2-margin;
export function floorHeight(x,z,previousY,state){
 for(const s of STAIRS)if(x>s.x1&&x<s.x2&&z>=s.z1-.03&&z<=s.z2+.03){const t=s.axis==='x'?(s.reverse?(x-s.x1)/(s.x2-s.x1):(s.x2-x)/(s.x2-s.x1)):(s.reverse?(z-s.z1)/(s.z2-s.z1):(s.z2-z)/(s.z2-s.z1)),y=s.from+Math.max(0,Math.min(1,t))*(s.to-s.from);if(Math.abs(y-previousY)<.4)return y;}
 const surfaces=[...WALKWAYS,...ROOMS].filter(r=>!r.reserved&&inside(x,z,r)&&Math.abs(previousY-r.y)<.4);
 return surfaces.length?surfaces.sort((a,b)=>Math.abs(previousY-a.y)-Math.abs(previousY-b.y))[0].y:null;
}
export function blocksAt(x,z,y,state,extra=[]){
 const radius=.25;
 for(const b of [...ARCH,...PROPS,...extra]){
  if(b.gate&&state[b.gate])continue;if(y+.03>=b.y+b.h||y+1.58<=b.y+.02)continue;
  const dx=Math.max(Math.abs(x-b.x)-b.w/2,0),dz=Math.max(Math.abs(z-b.z)-b.d/2,0);
  if(dx*dx+dz*dz<radius*radius)return true;
 }return false;
}
export function tryMove(p,x,z,state,extra=[]){const y=floorHeight(x,z,p.y,state);return y===null||Math.abs(y-p.y)>.32||blocksAt(x,z,y,state,extra)?null:{x,z,y};}
export function roomAt(p){
 const matches=ROOMS.filter(r=>inside(p.x,p.z,r)&&Math.abs(p.y-r.y)<.5);
 return matches.find(r=>r.id!=='nave')||matches[0]||{id:p.y>5.5?'mezzanine':'stairs',name:p.y>5.5?'Mezzanine':'Stair',zone:'hall'};
}
