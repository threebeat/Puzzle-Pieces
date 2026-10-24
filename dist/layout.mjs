// Museum coordinates: +x is local east, -z is local north. True north is 12° west of the hall axis.
export const BEARING = 12;
export const EXHIBITS = {
  hidden: {number:'01',name:'Hidden Operators',description:'An action leaves a trace. Its author may remain unseen. Look closely at what changes, what repeats, and what has been left between.',color:'#819184'},
  rebirth: {number:'02',name:'Days of Rebirth',description:'Nothing returns quite as it was. What survives a beginning? What must be lost before something can begin again?',color:'#b69071'},
  cross: {number:'03',name:'Cross/Hatch',description:'A line divides. A second line connects. Between their intersections, another image begins to appear.',color:'#8593a0'}
};
export const ROOMS = [
 {id:'hall',name:'The Main Hall',code:'H.00',floor:0,x1:-10,x2:10,z1:-28,z2:28,h:11.6,type:'hub',spawn:[0,0,14],note:'The window, the stair, and the space between.'},
 {id:'north',name:'Northern Arcade',code:'N.00',floor:0,x1:-38,x2:-10,z1:-25,z2:-19,h:4.1,type:'arcade',spawn:[-17,0,-22],note:'Hidden Operators · Café · Visitor map'},
 {id:'east',name:'Eastern Arcade',code:'E.00',floor:0,x1:10,x2:28,z1:-25,z2:-19,h:4.1,type:'arcade',locked:true,note:'This wing is closed. Its opening condition is not yet designed.'},
 {id:'south',name:'Southern Arcade',code:'S.00',floor:0,x1:10,x2:28,z1:18,z2:24,h:4.1,type:'arcade',spawn:[17,0,21],note:'Elevators · Gift shop · Security passage'},
 {id:'cafe',name:'Café',code:'N.01',floor:0,x1:-36,x2:-22,z1:-19,z2:-7,h:4.1,type:'amenity',spawn:[-28,0,-15],note:'An empty café shell, opposite Hidden Operators.'},
 {id:'gift',name:'Gift Shop',code:'S.01',floor:0,x1:10,x2:20,z1:2,z2:18,h:4.1,type:'amenity',spawn:[15,0,14],note:'An empty shop shell with windows into the hall.'},
 {id:'security',name:'Security Hall',code:'S.02',floor:0,x1:20,x2:26,z1:24,z2:34,h:4.1,type:'service',locked:true,note:'Staff access is closed. No key is hidden in this version.'},
 {id:'ho1',name:'Room 01',code:'1.01',exhibit:'hidden',floor:0,x1:-38,x2:-22,z1:-44,z2:-25,h:5.8,type:'gallery',spawn:[-29,0,-30],note:'A broad, boxy first gallery. No works installed.'},
 {id:'ho2',name:'Room 02',code:'1.02',exhibit:'hidden',floor:0,x1:-22,x2:-10,z1:-40,z2:-34,h:4.1,type:'gallery',spawn:[-17,0,-37],note:'A long, narrow gallery linking the larger rooms. No works installed.'},
 {id:'ho3',name:'Room 03',code:'1.03',exhibit:'hidden',floor:0,x1:-10,x2:9,z1:-54,z2:-34,h:6.2,type:'gallery',spawn:[-5,0,-39],note:'A large final gallery with room to extend north. No works installed.'},
 {id:'dr1',name:'Room 01',code:'2.01',exhibit:'rebirth',floor:0,x1:-28,x2:-10,z1:12,z2:28,h:5.2,type:'gallery',spawn:[-16,0,20],note:'A medium rectangular room. No works installed.'},
 {id:'west',name:'West Mezzanine',code:'M.01',floor:4.5,x1:-10,x2:-6,z1:-26,z2:28,h:7.1,type:'mezzanine',spawn:[-8,4.5,27],note:'The public stair reaches this side only.'},
 {id:'east-upper',name:'East Mezzanine',code:'M.02',floor:4.5,x1:6,x2:10,z1:-26,z2:28,h:7.1,type:'mezzanine',locked:true,note:'Closed at the start. No bridge joins the two sides.'},
 {id:'ch1',name:'Room 01',code:'3.01',exhibit:'cross',floor:4.5,x1:-38,x2:-10,z1:-4,z2:18,h:5.4,type:'gallery',spawn:[-16,4.5,10],note:'One very large gallery with freestanding display walls. No works installed.'}
];
export const DOORS = [
 {a:'hall',b:'north',axis:'x',at:-10,from:-24,to:-20,y:0},
 {a:'hall',b:'east',axis:'x',at:10,from:-24,to:-20,y:0,locked:true},
 {a:'hall',b:'south',axis:'x',at:10,from:19,to:23,y:0},
 {a:'north',b:'ho1',axis:'z',at:-25,from:-32,to:-28,y:0},
 {a:'north',b:'cafe',axis:'z',at:-19,from:-31,to:-27,y:0},
 {a:'ho1',b:'ho2',axis:'x',at:-22,from:-39,to:-35,y:0},
 {a:'ho2',b:'ho3',axis:'x',at:-10,from:-39,to:-35,y:0},
 {a:'hall',b:'dr1',axis:'x',at:-10,from:18,to:22,y:0},
 {a:'south',b:'gift',axis:'z',at:18,from:13,to:17,y:0},
 {a:'south',b:'security',axis:'z',at:24,from:21,to:25,y:0,locked:true},
 {a:'hall',b:'ch1',axis:'x',at:-10,from:8,to:12,y:4.5},
];
export const WINDOWS = [
 {a:'hall',axis:'z',at:-28,from:-8.7,to:8.7,y:.3,height:11.0},
 {a:'hall',b:'gift',axis:'x',at:10,from:3,to:16,y:.9,height:2.6}
];
export const PARTITIONS = [
 {x:-23,z:2,w:.3,d:7,y:4.5,h:3.2},
 {x:-30,z:10,w:7,d:.3,y:4.5,h:3.2}
];
export const STAIR={x1:-9.6,x2:-5.8,z1:15,z2:26,top:4.5};
export function contains(r,x,z,margin=0){return x>=r.x1+margin&&x<=r.x2-margin&&z>=r.z1+margin&&z<=r.z2-margin;}
export function roomAt(x,z,y=0){return ROOMS.filter(r=>!r.locked&&Math.abs(r.floor-y)<.3&&contains(r,x,z)).sort((a,b)=>(a.type==='hub'?1:0)-(b.type==='hub'?1:0))[0]||ROOMS[0];}
export function floorAt(x,z,previous){
 if(contains(STAIR,x,z)){const h=(z-STAIR.z1)/(STAIR.z2-STAIR.z1)*STAIR.top;if(Math.abs(previous-h)<.6)return h;}
 if(previous>3.9&&ROOMS.some(r=>r.floor===4.5&&!r.locked&&contains(r,x,z)))return 4.5;
 if(previous<.6&&ROOMS.some(r=>r.floor===0&&!r.locked&&contains(r,x,z)))return 0;
 return null;
}
export function fullName(r){return r.exhibit?EXHIBITS[r.exhibit].name+' / '+r.name:r.name;}
