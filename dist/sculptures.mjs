// Original procedural classical studies, adapted from the preserved museum prototype.
// No legacy puzzle data or runtime is imported.
import * as T from './vendor/three.module.js';
const TAU=Math.PI*2;
const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
function loft(rows,segments=24,folds=0,phase=0){
 const vertices=[],uv=[],indices=[];
 rows.forEach((p,j)=>{for(let i=0;i<=segments;i++){const a=i/segments*TAU+(p.twist||0),f=1+folds*(Math.sin(a*11+phase+j*.14)*.65+Math.sin(a*7-phase)*.35);vertices.push((p.x||0)+Math.cos(a)*p.rx*f,p.y,(p.z||0)+Math.sin(a)*p.rz*f);uv.push(i/segments,j/(rows.length-1));}});
 for(let j=0;j<rows.length-1;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;indices.push(a,b,a+1,b,b+1,a+1);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();return geo;
}
function ellipsoid(w,parent,x,y,z,rx,ry,rz,mat='marble',segments=16){const o=w.mesh(new T.SphereGeometry(1,segments,12),mat,x,y,z,parent);o.scale.set(rx,ry,rz);return o;}
function tapered(w,parent,a,b,ra,rb,mat='marble'){
 const av=new T.Vector3(...a),bv=new T.Vector3(...b),v=bv.clone().sub(av),o=w.mesh(new T.CylinderGeometry(rb,ra,v.length(),16,3),mat,0,0,0,parent);o.position.copy(av.add(bv).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;
}
function curveTube(w,parent,points,radius,mat='marble',segments=18){return w.mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),segments,radius,5,false),mat,0,0,0,parent);}
function head(w,parent,x,y,z,angle=0,beard=false){
 const h=new T.Group();h.position.set(x,y,z);h.rotation.y=angle;parent.add(h);
 ellipsoid(w,h,0,0,0,.205,.273,.209);ellipsoid(w,h,0,-.105,.07,.167,.178,.167);
 ellipsoid(w,h,0,-.19,.105,.127,.064,.11); // distinct chin, not a round ball
 for(const side of[-1,1]){
  ellipsoid(w,h,side*.197,-.006,.006,.032,.073,.046);
  ellipsoid(w,h,side*.083,.039,.192,.067,.024,.016,'marbleShade');
  const brow=ellipsoid(w,h,side*.083,.078,.187,.082,.027,.033);brow.rotation.z=-side*.11;
  ellipsoid(w,h,side*.083,.043,.203,.052,.011,.012);
  ellipsoid(w,h,side*.087,-.02,.157,.085,.057,.056);
 }
 const nose=new T.BufferGeometry();nose.setAttribute('position',new T.Float32BufferAttribute([-.025,.09,.183,.025,.09,.183,0,-.035,.294,-.04,-.054,.207,.04,-.054,.207,0,-.063,.265],3));nose.setAttribute('uv',new T.Float32BufferAttribute([0,1,1,1,.5,.25,0,0,1,0,.5,0],2));nose.setIndex([0,1,2,0,2,3,1,4,2,3,2,5,2,4,5,3,5,4]);nose.computeVertexNormals();w.mesh(nose,'marble',0,0,0,h);
 ellipsoid(w,h,0,-.105,.227,.067,.014,.013,'marbleShade');ellipsoid(w,h,0,-.119,.223,.064,.015,.014);
 const rr=rng(717+Math.round(angle*100));for(let i=0;i<25;i++){const a=i/25*TAU,yy=.14+(i%3)*.033;ellipsoid(w,h,Math.cos(a)*.169,yy,Math.sin(a)*.17,.062,.05,.057);}
 ellipsoid(w,h,0,.225,-.01,.175,.076,.17);
 if(beard)for(let i=0;i<20;i++){const a=(i%10)/9*PI,yy=-.16-Math.floor(i/10)*.055;ellipsoid(w,h,Math.cos(a)*.12,yy,.065+Math.sin(a)*.12,.035,.067,.039);}
 return h;
}
function torso(w,g,{fragment=false,draped=false,turning=false}={}){
 const rows=[{y:1,rx:.26,rz:.18,x:.02},{y:1.15,rx:.30,rz:.21,x:.03},{y:1.33,rx:.25,rz:.17,x:.015},{y:1.5,rx:.29,rz:.20,x:-.015},{y:1.72,rx:.38,rz:.225,x:-.045},{y:1.89,rx:.34,rz:.18,x:-.055},{y:2.01,rx:.14,rz:.115,x:-.055},{y:2.10,rx:.10,rz:.10,x:-.055}];
 w.mesh(loft(rows,28,draped?.075:.006), 'marble',0,0,0,g);
 if(!draped){for(const side of[-1,1]){const p=ellipsoid(w,g,side*.158-.035,1.73,.173,.179,.102,.069);p.rotation.z=side*.07;ellipsoid(w,g,side*.09,1.46,.157,.08,.145,.027);}}
 if(fragment){ellipsoid(w,g,-.39,1.86,0,.14,.16,.145).rotation.z=.6;ellipsoid(w,g,.31,1.84,0,.13,.16,.14).rotation.z=-.5;return;}
 if(draped){
  w.mesh(loft([{y:.12,rx:.42,rz:.28,x:.03},{y:.40,rx:.38,rz:.26},{y:.78,rx:.33,rz:.23,x:.01},{y:1.11,rx:.30,rz:.22,x:.02},{y:1.38,rx:.26,rz:.19,x:.01}],40,.125,turning?.8:.1),'marble',0,0,0,g);
  for(let k=0;k<7;k++){const a=.9+k*.045;curveTube(w,g,[[-.31,1.94-k*.025,.12],[-.39,1.67-k*.04,.20],[-.12,1.30-k*.05,.28],[.29,1.08-k*.05,.22],[.34,.74-k*.04,.13]],.027+(k%2)*.008);}
  ellipsoid(w,g,-.33,1.72,-.015,.14,.32,.15).rotation.z=-.15;
 }
}
export function sculpture(w,a){
 const g=new T.Group();g.name=a.key;g.position.set(a.x,.71,a.z);g.rotation.y=a.rotation;w.scene.add(g);
 w.box(a.x,.28,a.z,1.38,.56,1.38,'limestone');w.box(a.x,.59,a.z,1.48,.065,1.48,'marble');w.box(a.x,.67,a.z,1.04,.11,.90,'marble');w.shadow(a.x,a.z,3.1,3.1);
 const fragment=a.kind==='fragment',bust=a.kind==='bust',draped=['draped','turning'].includes(a.kind);
 if(bust){
  w.cyl(a.x,1.08,a.z,.035,.75,'smokedMetal');g.position.y=1.14;
  const bustBase=w.mesh(loft([{y:0,rx:.22,rz:.12},{y:.10,rx:.44,rz:.22},{y:.31,rx:.47,rz:.23},{y:.49,rx:.31,rz:.18},{y:.63,rx:.11,rz:.11}],28,.03),'marble',0,0,0,g);
  head(w,g,0,.85,0,-.2,true);g.scale.setScalar(1.55);
  curveTube(w,g,[[-.42,.26,.18],[-.2,.38,.21],[0,.2,.2],[.27,.15,.19]],.027);
 }else if(fragment){
  g.position.y=.5;w.cyl(a.x,1.05,a.z,.038,1.1,'smokedMetal');torso(w,g,{fragment:true});
  tapered(w,g,[-.17,1.09,0],[-.23,.76,.02],.19,.16);tapered(w,g,[.18,1.1,0],[.29,.91,-.05],.19,.15);
  // Uneven broken neck and shoulder surfaces are intentionally broad and matte.
  ellipsoid(w,g,-.055,2.08,0,.11,.04,.10,'marbleShade');
 }else{
  torso(w,g,{draped,turning:a.kind==='turning'});
  const legs=[{a:[-.16,1.10,0],b:[-.23,.58,.035],c:[-.24,.15,.07]},{a:[.17,1.12,-.01],b:[.23,.61,-.09],c:[.40,.16,-.23]}];
  if(!draped)for(const l of legs){tapered(w,g,l.a,l.b,.19,.115);ellipsoid(w,g,...l.b,.12,.125,.12);tapered(w,g,l.b,l.c,.115,.065);}
  for(const l of legs){const f=ellipsoid(w,g,l.c[0],.085,l.c[2]+.07,.105,.076,.195);f.rotation.y=l.c[0]>0?.22:-.08;}
  const neck=tapered(w,g,[-.055,1.97,0],[-.07,2.15,.015],.113,.105);
  head(w,g,-.07,2.34,.012,a.kind==='turning'?.65:a.kind==='athlete'?-.22:.1,false);
  if(!draped){
   const arms=a.kind==='bearer'?[[[-.36,1.85,0],[-.58,1.48,.12],[-.36,1.46,.39]],[[.28,1.84,0],[.50,1.49,.11],[.24,1.48,.42]]]:[[[-.36,1.85,0],[-.58,1.58,.05],[-.53,1.25,.12]],[[.28,1.84,0],[.58,2.02,.04],[.35,2.34,.08]]];
   arms.forEach(([aa,bb,cc])=>{tapered(w,g,aa,bb,.122,.092);ellipsoid(w,g,...bb,.09,.10,.09);tapered(w,g,bb,cc,.09,.058);const hand=ellipsoid(w,g,...cc,.07,.12,.045);hand.rotation.z=cc[0]<0?-.2:.4;});
   // A supporting stone stump reads as the marble adaptation of a bronze pose.
   w.mesh(loft([{y:.03,rx:.11,rz:.12},{y:.5,rx:.12,rz:.09},{y:1.0,rx:.09,rz:.08}],12,.10),'marble',.42,0,-.32,g);
  }else{
   tapered(w,g,[.29,1.86,-.01],[.43,1.63,.07],.13,.095);ellipsoid(w,g,.43,1.59,.07,.10,.10,.09,'marble');
  }
 }
 const plaque=w.label(a.key,a.x,.37,a.z+.704,0);plaque.scale.set(.6,.6,.6);
 return g;
}

