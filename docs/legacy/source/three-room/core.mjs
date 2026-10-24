export const SAVE_KEY='puzzle-pieces-save-v1';
export const PREF_KEY='puzzle-pieces-settings-v1';
export const ROOMS={
  lobby:{name:'The Vestibule',number:'00',subtitle:'YOU HAVE BEEN EXPECTED',puzzles:[]},
  quotient:{name:'The Quotient Room',number:'01',subtitle:'EXHIBIT I · PARTS OF A WHOLE',puzzles:['xo','flock','night','absence','chromatic','sculpture']},
  corridor:{name:'The Long Division',number:'02',subtitle:'EXHIBIT I · PARTS OF A WHOLE',puzzles:['murals']},
  pantry:{name:'A Taste of Meaning',number:'03',subtitle:'EXHIBIT I · PARTS OF A WHOLE',puzzles:['banquet']},
  threshold:{name:'The Space Between',number:'—',subtitle:'BEYOND EXHIBIT I',puzzles:[]}
};
export const PUZZLES={
  xo:{name:'Xs and Os',room:'quotient',catalog:'I',kind:'number',answer:'4',plaque:'Eight departures. Two returns.',explanation:'The horizontal line is a division bar. Count eight Xs above and two Os below: 8 ÷ 2 = 4. This establishes the visual grammar of the room.'},
  flock:{name:'A Place to Return',room:'quotient',catalog:'II',kind:'number',answer:'6',plaque:'No bird has ever owned a branch.',explanation:'Eighteen birds are above the branch that divides the painting. Three nests are beneath it. Count objects, not wings: 18 ÷ 3 = 6.'},
  night:{name:'Borrowed Night',room:'quotient',catalog:'III',kind:'number',answer:'3',plaque:'Even darkness has its share.',explanation:'Twelve stars sit above the horizon and four crescent moons below. The horizon is the division bar: 12 ÷ 4 = 3.'},
  absence:{name:'A Study of Absence',room:'quotient',catalog:'IV',kind:'number',answer:'7',plaque:'The little triangle belongs to the sky.',interactive:true,explanation:'The brass frame has turning studs. Rotate until the small gold triangle points up. Fourteen pale holes lie above the divider and two below: 14 ÷ 2 = 7. The empty spaces, rather than the dark material, are the objects being counted.'},
  chromatic:{name:'Selective Memory',room:'quotient',catalog:'V',kind:'number',answer:'2',plaque:'A blue hour. Everything warm is forgotten.',explanation:'Collect the blue inspection glass from the reception desk, then use it while viewing the painting. It isolates the blue marks from the rust-colored distractions. There are ten above the bar and five below: 10 ÷ 5 = 2. The colors are also distinguishable without the lens.'},
  sculpture:{name:'The Weight of Answers',room:'quotient',catalog:'VI',kind:'number',answer:'11',plaque:'Five works become one weight.',explanation:'The five blocks correspond to paintings I–V and display their accepted answers: 4, 6, 3, 7, 2. Add their weights (22) above the slab, and count two brass rings below. The same division rule gives 22 ÷ 2 = 11. The blocks are a visible feedback mechanism; entering 11 before the paintings are solved is allowed.'},
  murals:{name:'Two Sides of the Same Thing',room:'corridor',catalog:'VII',kind:'sequence',answer:'62533',plaque:'Like belongs to like. Begin where the light enters.',explanation:'The lit left mural gives the numerator order: leaves 18, birds 8, stars 20, drops 9, moons 12. The opposite mural scrambles their denominators: moons 4, leaves 3, drops 3, stars 4, birds 4. Match symbols, not positions, and divide in the left mural’s arrow direction: 18/3, 8/4, 20/4, 9/3, 12/4 → 62533. The single five-slot response is the only room answer.'},
  banquet:{name:'The Unspoken Menu',room:'pantry',catalog:'VIII',kind:'food',answer:'07080901',plaque:'Four courses. Their names have already been served.',explanation:'Read paintings I–IV as rebuses, then find each resulting food on the projection. I: an anvil squashes goo → squash, row 2 column 07. II: a sinking ship, an iceberg, and LET US → iceberg lettuce, row 4 column 08. III: black paint and a burial → black + bury → blackberry, row 1 column 09. IV: an egg-shaped factory → egg + plant → eggplant, row 3 column 01. Enter column numbers in painting order, not row order: 07 · 08 · 09 · 01.'},
  way:{name:'The Way Through',room:'beyond',catalog:'IX',kind:'word',answer:'KEY',plaque:'No single room can show you the way out.',explanation:'Collect a map fragment from each completed room. When assembled, the three outlined glyphs ask for: the sculpture answer (11); the center of the five mural quotients (5); the sum of the four chosen food column numbers (7+8+9+1=25). The map’s alphabet strip converts 11,5,25 with A=1 → K,E,Y. Enter KEY. Every exhibit response and all three physical fragments are required before the next door opens.'}
};
export const FOOD_ROWS=[
  ['Pear','Plum','Lemon','Cherry','Banana','Orange','Fig','Grape','Blackberry','Apple'],
  ['Carrot','Potato','Onion','Beet','Broccoli','Peas','Squash','Corn','Radish','Pumpkin'],
  ['Eggplant','Egg','Pepper','Garlic','Mushroom','Tomato','Cucumber','Olive','Turnip','Chili'],
  ['Cabbage','Spinach','Kale','Arugula','Romaine','Chard','Watercress','Iceberg lettuce','Celery','Leek']
];
export const FOOD_ART=[
 {id:'landing',name:'A Soft Landing',catalog:'I',plaque:'An unexpected impression.'},
 {id:'ship',name:'A Cold Reception',catalog:'II',plaque:'Sank from the same thing that got the Titanic.'},
 {id:'burial',name:'A Very Dark Funeral',catalog:'III',plaque:'The color of mourning. The act of mourning.'},
 {id:'factory',name:'Industrial Life',catalog:'IV',plaque:'Every morning, the plant produces another.'}
];
export const MURAL_LEFT=[['leaf',18],['bird',8],['star',20],['drop',9],['moon',12]];
export const MURAL_RIGHT=[['moon',4],['leaf',3],['drop',3],['star',4],['bird',4]];
export function newGame(){return {version:1,started:true,phase:'sealed',arrivalStep:0,room:'lobby',visited:['lobby'],solved:[],items:['invitation'],fragments:[],rotation:1,foodMarks:{},notes:'',tabletGiven:false,noteGiven:false,ended:false};}
export function restoreGame(raw){
 try{let o=typeof raw==='string'?JSON.parse(raw):raw;if(!o||o.version!==1||!o.started)return null;
 const s={...newGame(),...o};
 s.room=Object.hasOwn(ROOMS,s.room)?s.room:'lobby';
 s.phase=['sealed','letter','arrival','play'].includes(s.phase)?s.phase:'play';
 s.arrivalStep=Math.max(0,Math.min(2,Number(s.arrivalStep)||0));
 for(const key of ['solved','items','fragments','visited'])s[key]=Array.isArray(o[key])?[...new Set(o[key].filter(x=>typeof x==='string'))]:newGame()[key];
 s.solved=s.solved.filter(x=>Object.hasOwn(PUZZLES,x));s.fragments=s.fragments.filter(x=>['quotient','corridor','pantry'].includes(x));s.visited=s.visited.filter(x=>Object.hasOwn(ROOMS,x));
 s.items=s.items.filter(x=>['invitation','note','lens'].includes(x));s.rotation=Number.isFinite(s.rotation)?s.rotation%4:1;s.notes=typeof s.notes==='string'?s.notes.slice(0,10000):'';
 s.foodMarks=s.foodMarks&&typeof s.foodMarks==='object'&&!Array.isArray(s.foodMarks)?s.foodMarks:{};
 return s;
 }catch{return null;}
}
export function roomSolved(state,room){const ids=ROOMS[room]?.puzzles||[];return ids.length>0&&ids.every(id=>state.solved.includes(id));}
export function normalizeAnswer(id,input){
 const kind=PUZZLES[id]?.kind;
 if(kind==='number'){const t=String(input).trim();return /^\d+(?:\.0+)?$/.test(t)?String(Number(t)):'';}
 if(kind==='food'){
   if(Array.isArray(input))return input.length===4&&input.every(x=>/^\d{1,2}$/.test(String(x).trim())&&Number(x)>=1&&Number(x)<=10)?input.map(x=>String(Number(x)).padStart(2,'0')).join(''):'';
   const t=String(input).trim();if(/^\d{8}$/.test(t))return t;
   const v=t.split(/[\s,·-]+/);return v.length===4?normalizeAnswer(id,v):'';
 }
 return String(input).toUpperCase().replace(/[\s·-]/g,'');
}
export function submitAnswer(state,id,input){
 if(!PUZZLES[id])return {ok:false};
 const ok=normalizeAnswer(id,input)===PUZZLES[id].answer;
 const fresh=ok&&!state.solved.includes(id);if(fresh)state.solved.push(id);
 return {ok,fresh,room:PUZZLES[id].room,fragmentReady:ok&&roomSolved(state,PUZZLES[id].room)&&!state.fragments.includes(PUZZLES[id].room)};
}
export function collectFragment(state,room){if(roomSolved(state,room)&&!state.fragments.includes(room)){state.fragments.push(room);return true;}return false;}
export function gateOpen(state){return Object.keys(PUZZLES).every(x=>state.solved.includes(x))&&['quotient','corridor','pantry'].every(x=>state.fragments.includes(x));}
export function travel(state,room){if(!ROOMS[room]||(!state.tabletGiven&&room!=='lobby')||(room==='threshold'&&!gateOpen(state)))return false;state.room=room;if(!state.visited.includes(room))state.visited.push(room);if(room==='threshold')state.ended=true;return true;}
