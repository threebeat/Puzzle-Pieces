import {CIRCULATION_WORKS,LIFTS} from './circulation-data.js';
import {COLLECTION_WORKS} from './collection-data.js';
import {freshLanguage,sanitizeLanguage,LANGUAGE_WORKS} from './language-data.js';
import {EXPANSION_WORKS} from './expansion-data.js';
import {STAFF_WORKS} from './staff-content.js';
export const VERSION = 5;
export const SYMBOLS = ['○', '⌜', '⋈', '∴', '⊓', '—'];
export const MASKS = [
  ['11000','01010','10011','00100','10100'],
  ['00110','10010','01100','00011','11001'],
  ['10001','01110','00101','11000','01011']
].map(a => a.map(r => [...r].map(Number)));
export const COLOR_SOLUTION = [5,2,7];
export const FORM_SOLUTION = [1,6,3];
export const NOTES = [220, 293.665, 391.995, 523.251];
export const PIPE_PITCHES = [3,0,2,1];
export const SCORE_GAPS = [2,3,1,3,0,2];
export const SOUND_SOLUTION = [...SCORE_GAPS].reverse();
export const SECURITY_SOLUTION = [0,1,2];
export const VANTAGE = {x:-18, z:1.7, y:0, yaw:0, pitch:0};
export const COLOR_GATE = [1,0,2,1];
export const ECHO_DELAYS = [1.2,.45,1.65,.8];
export const SOUND_GATE = [1,3,0,2];
export const FLOOR_SOLUTION = [2,0,3,1];
export const PAD_GLYPHS = ['—','○','·','△'];
export const GATES = ['colorLab','soundLab','formLab','colorSecret','quietPassage','formShortcut','office','balcony','basementAccess','timeArchive','clearance','garage','garageWorkshop','garagePassage','giftShop'];

export function transformMask(mask, state) {
  let m = mask.map(r=>r.slice());
  for(let i=0;i<state%4;i++) m = m[0].map((_,x)=>m.map(r=>r[x]).reverse());
  if(state>=4) m=m.map(r=>r.map(v=>1-v));
  return m;
}
export function colorGrid(states) {
  const m = MASKS.map((v,i)=>transformMask(v,states[i]));
  return Array.from({length:5},(_,y)=>Array.from({length:5},(_,x)=>m.map(v=>v[y][x])));
}
export const COLOR_TARGET = colorGrid(COLOR_SOLUTION);
export const DEBT_IMAGE = COLOR_TARGET.map(r=>[...r].reverse().map(c=>c.map(v=>1-v)));
export const equal = (a,b)=>a.length===b.length && a.every((v,i)=>v===b[i]);
export const colorSolved = s=>equal(s,COLOR_SOLUTION);
export const soundSolved = s=>equal(s,SOUND_SOLUTION);
export const formAligned = s=>equal(s,FORM_SOLUTION);
export function atVantage(p) {
  const yaw = Math.atan2(Math.sin(p.yaw),Math.cos(p.yaw));
  return Math.hypot(p.x-VANTAGE.x,p.z-VANTAGE.z)<.62 && Math.abs(yaw)<.105 && Math.abs(p.pitch)<.15 && Math.abs(p.y)<.3;
}
export function securitySolved(state, code) { return state.card && Object.values(state.seals).every(Boolean) && equal(code,SECURITY_SOLUTION); }
export function freshState() {
  return {...freshLanguage(),...Object.fromEntries(LIFTS.map(l=>[l.gate,false])),publicLiftPower:false,giftShop:false,version:VERSION,started:false,color:[0,0,0],form:[0,0,0],seals:{color:false,sound:false,form:false},card:false,office:false,balcony:false,finished:false,
    colorLab:false,soundLab:false,formLab:false,colorSecret:false,quietPassage:false,formShortcut:false,paintingOpen:false,fridgeOpen:false,
    basementAccess:false,timeArchive:false,clearance:false,mapCollected:false,brochureCollected:false,manifestCollected:false,basementVisited:false,basementPower:false,timeDials:[0,0,0],manifestCrossed:[],manifestAttempts:0,manifestErrors:[],circuitEntry:[],
    colorEntry:[],echoEntry:[],floorEntry:[],soundEntry:[],code:[3,3,3],observed:[],notes:'',
    position:{x:-1.5,z:29,y:0,yaw:0,pitch:.015},settings:{volume:.45,sensitivity:1,captions:false,reducedMotion:false,quality:'auto'}};
}
export function sanitizeState(s) {
  const f=freshState();
  if(!s || ![1,2,3,4,VERSION].includes(s.version)) return f;
  for(const key of ['color','form']) if(Array.isArray(s[key])&&s[key].length===3&&s[key].every(v=>Number.isInteger(v)&&v>=0&&v<8)) f[key]=[...s[key]];
  for(const key of ['card','finished','paintingOpen','fridgeOpen','mapCollected','brochureCollected','manifestCollected','basementVisited','basementPower',...GATES]) f[key]=!!s[key];
  f.started=s.version===1||!!s.started;
  f.office=f.office&&f.card;
  for(const key of ['color','sound','form']) f.seals[key]=!!s.seals?.[key];
  // Original visits retain their discoveries; only their location changes with the building.
  if(s.version<3){f.mapCollected=!!s.started;f.brochureCollected=false;}
  if(s.version===1){f.colorLab=f.seals.color;f.soundLab=f.seals.sound;f.formLab=f.seals.form;}
  f.balcony=f.balcony&&f.office&&Object.values(f.seals).every(Boolean);
  f.finished=f.finished&&f.balcony;
  for(const [k,n,max] of [['colorEntry',4,3],['echoEntry',4,4],['floorEntry',4,4],['soundEntry',6,4],['code',3,6]])if(Array.isArray(s[k])&&s[k].length<=n&&s[k].every(v=>Number.isInteger(v)&&v>=0&&v<max)&&(k!=='code'||s[k].length===3))f[k]=[...s[k]];
  f.observed=Array.isArray(s.observed)?s.observed.filter(x=>typeof x==='string').slice(0,150):[];
  f.notes=typeof s.notes==='string'?s.notes.slice(0,20000):'';
  if(s.version===VERSION&&s.position&&['x','z','y','yaw','pitch'].every(k=>Number.isFinite(s.position[k]))&&Math.abs(s.position.x)<70&&s.position.z>-60&&s.position.z<96&&s.position.y>=-6&&s.position.y<=12)f.position={...s.position,pitch:Math.max(-1.35,Math.min(1.35,s.position.pitch))};
  if(Array.isArray(s.timeDials)&&s.timeDials.length===3&&s.timeDials.every(v=>Number.isInteger(v)&&v>=0&&v<6))f.timeDials=[...s.timeDials];
  f.manifestCrossed=Array.isArray(s.manifestCrossed)?[...new Set(s.manifestCrossed.filter(v=>Number.isInteger(v)&&v>=1&&v<=12))]:[];
  f.manifestAttempts=Number.isInteger(s.manifestAttempts)?Math.max(0,Math.min(9999,s.manifestAttempts)):0;
  f.manifestErrors=Array.isArray(s.manifestErrors)&&s.manifestErrors.length===3?s.manifestErrors.map(Boolean):[];
  f.circuitEntry=Array.isArray(s.circuitEntry)?s.circuitEntry.filter(v=>Number.isInteger(v)&&v>=1&&v<=12).slice(0,5):[];
  if(f.clearance){f.manifestCollected=true;f.basementVisited=true;}
  sanitizeLanguage(s,f);
  if(f.securityCertified||f.basementAccess){f.securityCertified=true;f.basementAccess=true;f.garage=true;}
  f.publicLiftPower=!!s.publicLiftPower&&f.basementAccess;for(const l of LIFTS)f[l.gate]=!!s[l.gate]&&(!l.power||f[l.power]);
  if(s.settings) {
    f.settings.volume=Math.max(0,Math.min(1,Number(s.settings.volume)||0));
    f.settings.sensitivity=Math.max(.3,Math.min(2.5,Number(s.settings.sensitivity)||1));
    f.settings.captions=!!s.settings.captions;f.settings.reducedMotion=!!s.settings.reducedMotion;
    f.settings.quality=['auto','low','high'].includes(s.settings.quality)?s.settings.quality:'auto';
  }
  return f;
}

export const WORKS = {
  welcome:{title:'A note on the collection',artist:'Department of Interpretation',meta:'Main hall · visitor information',text:'There are puzzles within every piece in this museum. Nothing here is merely itself.\n\nA surface may be an instruction; a silence, a material. Consider what the work has refused to show you.\n\nThe collection does not require your agreement. Only your attention.'},
  weights:{title:'Weights for an Empty Room',artist:'Mara Venn, 1998',meta:'Pigmented concrete, cable, withheld weight',text:'Three things are held in the air. None occupies the height its weight would suggest.\n\nThe inventory begins nearest the floor. Each weight has a room elsewhere in the collection.',type:'weights'},
  colorEntrance:{title:'I / Chromatic Debt',artist:'Studies in borrowed light',meta:'Ground collection · perception / subtraction',text:'A color is not what it owns, but what it withholds.\n\nOn the other side, the world keeps what this side has spent. Two disagreements may describe the same thing.'},
  debt:{title:'Everything Owed',artist:'Iona Vale, 2006',meta:'Pigment, erased ground, twenty-five obligations',text:'The ledger is complete. It describes, with perfect accuracy, everything that is not on the other side.\n\nDo not add to it.',type:'debt'},
  complement:{title:'An Original and Its Apology',artist:'Iona Vale, 2006',meta:'Two proofs, neither privileged',text:'Left has given away what right has kept. Their places have also changed.\n\nA disagreement is sometimes only a view from the back.',type:'complement'},
  spectrum:{title:'Common Ground',artist:'Iona Vale, 2007',meta:'Three reversible light matrices · variable state',text:'Each witness may turn. Each may recant.\n\nWhen the accounts agree, something will remain that no witness brought.',type:'color'},
  soundEntrance:{title:'II / The Shape of Silence',artist:'Studies for an absent audience',meta:'Ground collection · omission / return',text:'The room remembers the notes the player refused it.\n\nWhat returns must travel the way it came. Height belongs to a sound, not to the object making it.'},
  score:{title:'The Unplayed',artist:'Elias Rook, 1981',meta:'Six moments, four possible voices',text:'The ink records the refusals.\n\nThe performance occupies the vacancies.',type:'score'},
  return:{title:'Return Address',artist:'Elias Rook, 1982',meta:'An outward journey and its answer',text:'No sound has ever returned from a room in the direction it entered.\n\nAn echo does not begin at the beginning.',type:'return'},
  choir:{title:'Four Witnesses',artist:'Elias Rook, 1981–84',meta:'Resonators, air, architectural memory',text:'Their bodies lie about their voices. Listen to each before arranging them.\n\nThe smallest interval in this room is the one between hearing and remembering.',type:'choir'},
  recorder:{title:'The Second Audience',artist:'Elias Rook, 1984',meta:'Six borrowed notes · a room that can answer',text:'The first audience heard what was played.\n\nThis one has been waiting for what was not.',type:'sound'},
  formEntrance:{title:'III / Counterform',artist:'Studies of things not present',meta:'Ground southwest · projection / absence',text:'An object is a delay between one eye and another.\n\nThe plan is true. The room is not obliged to look like it. A work may require a witness who has already left.'},
  plan:{title:'Plan for an Absent Body',artist:'Ada Noll, 1973',meta:'Three elevations, pin and ink',text:'The short arm remembers the hinge. The pin remembers which end was first.\n\nI. II. III. The positions are recorded as seen from the witness.',type:'plan'},
  chair:{title:'A Place Kept',artist:'Ada Noll, 1973',meta:'Removed chair, floor tape, a height of 1.65 metres',text:'The sitter has left. The point of view has not.\n\nFace the frames. Let the room keep its horizon.',type:'chair'},
  form:{title:'Subject Removed',artist:'Ada Noll, 1974',meta:'Three hinged fragments, a single absence',text:'A broken outline is not a broken object.\n\nTurn the frames. Then leave the work alone long enough to see it.',type:'form'},
  closed:{title:'IV / In Perpetuity',artist:'Studies in sequence and consequence',meta:'Southeast gallery · temporal logic',text:'The work that comes next has already happened.\n\nEXHIBITION SEALED\nConservation order 04. This gallery is not accessible in the current chapter.'},
  officeDoor:{title:'Security office',artist:'Staff access only',meta:'Reader active · physical credential required',text:'The lock has power. The room beyond is dark.',type:'officeDoor'},
  card:{title:'A security card',artist:'N. Ash · Night attendant',meta:'Access level 02 · serial 119',text:'The photograph has been rubbed away. The magnetic strip is intact.\n\nOn the back, in pencil: “The collection is not in room order.”',type:'card'},
  mirror:{title:'Something on the mirror',artist:'A fingertip in dust',meta:'Washroom',text:'“I can still hear it with the door closed.”\n\nUnderneath, in another hand:\n“Then the room is doing its job.”'},
  ledger:{title:'An unfinished handover',artist:'Night shift / 23:41',meta:'Security office · loose paper',text:'Ash —\n\nThe terrace is on the collection circuit again. Three impressions, from the hanging weights: lowest first. The panels issue their own marks.\n\nThe southeast wing stays sealed. Do not override conservation.\n\nI left before the last tone stopped.'},
  security:{title:'Collection circuit',artist:'Terrace interlock',meta:'Three impressions · order of suspension',text:'An inventory of the suspended collection.\n\nStart at the floor. Record only what the works have released.',type:'security'},
  balconyDoor:{title:'Terrace / north',artist:'Mezzanine access',meta:'Collection circuit interlock',text:'A dark reader. Three small spaces beneath the glass.',type:'balconyDoor'},
  last:{title:'The Outside Is Another Room',artist:'Artist unrecorded',meta:'A frame, a night, a witness',text:'You have put the building back in order.\n\nStand within the frame. Face the museum.\n\nThere is always one more side to an object.',type:'last'},
  lockdown:{title:'East wing lockdown',artist:'Conservation order 04',meta:'North service corridor',text:'Beyond this point: collections storage, east wing, freight lift.\n\nThe seals have not been broken. No access during this chapter.'}
};

Object.assign(WORKS,CIRCULATION_WORKS,COLLECTION_WORKS, {
 statue:{title:'Visitor, Absent',artist:'Mara Venn, 1999',meta:'Cast bronze, three unoccupied apertures',text:'The figure is made of the places where a figure might have been. Three rooms have lent it their names.\n\nThe collection will remember your visit before you leave it.'},
 borrowed:{title:'Borrowed Primaries',artist:'Iona Vale, 2005',meta:'Four loans of light, read from the reverse',text:'Each surface keeps two witnesses and owes the third.\n\nBegin where the ledger ends. Return only what is missing. Four payments open the next room.',type:'borrowed'},
 white:{title:'White Lies',artist:'Iona Vale, 2005',meta:'Additive light, three agreements',text:'Red and green become yellow. Red and blue become magenta. Green and blue become cyan.\n\nAll three agree to be white; none agree to be black. Pigment is an unreliable witness here.',type:'white'},
 counterproof:{title:'Counterproof, Upper Left',artist:'Iona Vale, 2007',meta:'A corner retained for comparison',text:'A complete account begins with this small agreement.\n\nThe five squares belong to the upper edge of Common Ground. They are not a second answer.',type:'counterproof'},
 blank:{title:'Nothing to See',artist:'Iona Vale, 2008',meta:'Unpainted linen, concealed hinge',text:'The face has given you everything it has.\n\nThe curator insists that the edge is not part of the work. The hinge disagrees.',type:'blank'},
 archive:{title:'A Convincing Number',artist:'Department of Accession, 1978',meta:'Withdrawn inventory label · not an access credential',text:'1978. A number with the appearance of an answer.\n\nThe museum once catalogued its doubts as though they were objects. This label survived the objects.',type:'inventory'},
 receipt:{title:'Receipt for a Missing Room',artist:'Unattributed, undated',meta:'Carbon paper, an impossible floor area',text:'One door was removed from the visitor plan. The area of the building did not change.\n\nAnother opens into the north arcade. Neither was intended to be a conclusion.',type:'receipt'},
 late:{title:'Late Admission',artist:'Elias Rook, 1980',meta:'Four knocks, four delayed arrivals',text:'A visitor is counted only on returning.\n\nStrike each witness alone. Admit the returns from earliest to latest. The four small keys at the door keep the order.',type:'late'},
 arrivals:{title:'Two Arrivals',artist:'Elias Rook, 1980',meta:'Attack, delay, reflection',text:'The first light belongs to the hand. The second belongs to the room.\n\nEach witness lights twice. The distance between those lights is the distance that matters.',type:'arrivals'},
 intervals:{title:'A Measure of Refusal',artist:'Elias Rook, 1984',meta:'Six empty notes · interval proof',text:'The other score can be checked without repeating it.\n\nBegin at the third voice from the floor. Move down two, up three, down two, up two, down one. Count steps, not bodies.',type:'intervals'},
 quiet:{title:'Lent Silence',artist:'Elias Rook, 1985',meta:'A listening circle, eight seconds without an addition',text:'The work is finished only when its visitor stops contributing.\n\nStand in the circle. Let eight seconds belong to the room. Look, walk, or touch, and your loan begins again.',type:'quiet'},
 firstAudience:{title:'The First Audience',artist:'Elias Rook, 1983',meta:'Withdrawn rehearsal · superseded by The Unplayed',text:'A rehearsal is not a performance. This score records an abandoned order.\n\nThe red stroke was the artist’s last contribution to this version.',type:'firstAudience'},
 unsuitable:{title:'An Unsuitable Floorplan',artist:'Ada Noll, 1971',meta:'A plan hung with north at the bottom',text:'The walk begins at the filled point and ends at the ring. Each station accepts one visit.\n\nThe wall has turned the plan. The floor has not. Leave the plates between visits.',type:'unsuitable'},
 stations:{title:'Four Stations',artist:'Ada Noll, 1971',meta:'Dot, line, triangle, ring',text:'An independent record of the same walk.\n\nA point becomes a line. A line admits a third corner. The corners are then forgotten.',type:'stations'},
 hourglass:{title:'An Hour With No Sand',artist:'Ada Noll, 1974',meta:'Outline recovered from a removed subject',text:'The two ends are equal. Their meeting occupies no area.\n\nA single witness can see all five strokes as one figure.',type:'hourglass'},
 withdrawn:{title:'Study for a Fourth Fragment',artist:'Ada Noll, 1974',meta:'Rejected fragment · never installed',text:'A fourth object would have made the outline easier to see and impossible to complete.\n\nThe pin is drawn at the wrong end. Rejected by the artist.',type:'withdrawn'},
 latch:{title:'An Exit Seen From Within',artist:'Department of Circulation',meta:'A latch, a wall, a different side',text:'A wall is a door that has not been described from both sides.\n\nThe small brass latch belongs to this side.'},
 lantern:{title:'A Narrow Permission',artist:'Mara Venn, 2001',meta:'Wood fins, borrowed sky',text:'The bright lines are gaps, not objects. Their spacing describes the things that interrupt them.\n\nBelow this room, silence keeps a stair out of sight.',type:'lantern'},
 loft:{title:'The Same Building, Twice',artist:'Department of Interpretation',meta:'A visitor map and an incomplete account',text:'The plan was accurate about every room it admitted.\n\nIt was not required to admit every room.',type:'loft'}
});

Object.assign(WORKS, STAFF_WORKS);

Object.assign(WORKS, EXPANSION_WORKS);

WORKS.welcome.text='There are puzzles within every piece in this museum. Nothing here is merely itself. A surface may be an instruction; a silence, a material.\n\nRead the entrance before you judge its works. A rule may begin in one frame and finish in the architecture. Comparison is kinder than conviction.\n\nThe desk at the center keeps a plan and an announcement. The staff have left the rest where they last needed it.';
WORKS.colorEntrance.text='A color is not what it owns, but what it withholds. Three witnesses leave four debts. Begin at the end; pay only the missing voice.\n\nOn the other side, the world keeps what this side has spent. The back reverses the order and the testimony. Each witness may turn; each may recant.\n\nWhen the accounts agree, the upper edge confirms the whole. An unpainted surface may still have an edge. A number withdrawn from the collection cannot grant admission.';
WORKS.soundEntrance.text='The visitor makes one arrival; the room makes another. Admit the returns from earliest to latest, never by the haste of the hand.\n\nBeyond the threshold, ink records the voices refused. Height belongs to sound, not to the body making it. What returns must retrace its journey.\n\nSix vacancies make a performance. Their intervals keep a second account. In the last circle, eight seconds must pass without a contribution. Silence is also a kind of key.';
WORKS.formEntrance.text='The plan is true. The room is not obliged to look like it. North has fallen to the bottom of one drawing; the floor has kept its north.\n\nA point becomes a line, admits a third corner, then forgets the corners. Visit each station once and leave it between visits.\n\nThe short arm remembers the hinge; the pin remembers the first end. Set three fragments, then borrow the departed witness’s eye. Equal ends meet where there is no area. A fourth fragment was never accepted.';
WORKS.liftIsolation={title:'SOUTH SERVICE DOOR',artist:'Facilities / level 02 access',meta:'South Arcade · inspection route to B1',text:'The working collection is below. Use the night attendant’s credential at this door.\n\nSouth service always returns to this landing. Freight requires curatorial clearance. Please keep both routes distinct.'};
WORKS.ledger.text+='\n\nLower collection moved to SOUTH SERVICE. The staff hall and break room are upstairs. Administration and the birthday room are one flight beyond.';

Object.assign(WORKS,LANGUAGE_WORKS);
WORKS.ledger.text='Ash —\n\nThe terrace is on the collection circuit again. Three impressions, from the hanging weights: lowest first. The panels issue their own marks.\n\nFinish your training at the white-screen terminal before issuing a garage or South Service authorisation.\n\nI left before the last tone stopped.';

WORKS.liftIsolation.text='Accepted work in Security releases this corridor. Follow the floor cable when it lights. The inspection lift is inside, beyond the conference and garage connections.\n\nThe public elevator bank in the arcade belongs to a separate supply. The inspection car always returns from below. Freight still requires curatorial clearance.';
