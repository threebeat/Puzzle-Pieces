import {WALKWAYS,WINDOWS} from './layout.js';
const lesson=(id,title,limit,lines,extra={})=>({id,title,limit,lines:lines.map(v=>typeof v==='string'?{text:v,heavy:false}:v),...extra});
export const REDACTION_LESSONS=[
 lesson('admission','Calibration / I',1,['true.','false.'],{calibration:true}),
 lesson('join','Calibration / II',3,['white is not white.','black is white.'],{calibration:true}),
 lesson('heavy','Heavy ink / III',1,['true.',{text:'black is not white.',heavy:true}]),
 lesson('window','A statement about this room / IV',1,['the hall has no windows.']),
 lesson('suspension','A statement about a work / V',2,['cobalt hangs above chalk.','below vermilion.']),
 lesson('certification','Night attendant / final sheet',1,['the hall has no bridge.',{text:'white is not black.',heavy:true}],{paper:true})
];
export function redactionTokens(index){let id=0;return REDACTION_LESSONS[index].lines.flatMap((line,row)=>line.text.split(' ').map(text=>({id:id++,text,row,heavy:line.heavy})));}
function literalTruth(text){
 if(text==='true')return true;if(text==='false')return false;
 let m=text.match(/^(white|black) is (not )?(white|black)$/);if(m)return m[2]?m[1]!==m[3]:m[1]===m[3];
 m=text.match(/^the hall has (no )?(windows|bridges|bridge)$/);if(m){const present=m[2]==='windows'?WINDOWS.some(w=>w.id==='great-window'):WALKWAYS.some(w=>w.id.includes('bridge'));return m[1]?!present:present;}
 m=text.match(/^(cobalt|vermilion|chalk) hangs (above|below) (cobalt|vermilion|chalk)$/);if(m){const ranks=['cobalt','vermilion','chalk'];return m[2]==='above'?ranks.indexOf(m[1])>ranks.indexOf(m[3]):ranks.indexOf(m[1])<ranks.indexOf(m[3]);}
 return null;
}
export function evaluateRedaction(index,marks){
 const lesson=REDACTION_LESSONS[index],set=new Set(marks),tokens=redactionTokens(index),remaining=tokens.filter(t=>!set.has(t.id));let groups=[],part=[];
 for(const t of remaining){part.push(t);if(t.text.endsWith('.')){groups.push(part);part=[];}}if(part.length)groups.push(part);
 const statements=groups.map(g=>{const text=g.map(t=>t.text).join(' ').replace(/\.$/,'');const literal=literalTruth(text);const heavy=!lesson.calibration&&g[0].heavy,mixed=!lesson.calibration&&g.some(t=>t.heavy!==g[0].heavy);return{text,literal,heavy,truth:mixed||literal===null?null:heavy?!literal:literal};});
 return {statements,solved:marks.length<=lesson.limit&&marks.every(n=>Number.isInteger(n)&&tokens.some(t=>t.id===n))&&new Set(marks).size===marks.length&&statements.length>0&&statements.every(s=>s.truth===true)};
}
export const PLATE_WORDS=['FRAME','FLAME','PLANE','PLATE','CRATE','TRACE','GRACE','GRATE','SLATE','STATE','STALE','SHAPE','SPACE','SCALE'];
export const PLATE_ANSWER='FRAME';
export function letterFeedback(guess,answer=PLATE_ANSWER){const out=Array(5).fill(0),remaining={};for(let i=0;i<5;i++){if(guess[i]===answer[i])out[i]=2;else remaining[answer[i]]=(remaining[answer[i]]||0)+1;}for(let i=0;i<5;i++)if(out[i]!==2&&remaining[guess[i]]){out[i]=1;remaining[guess[i]]--;}return out;}
export const TILE_WORDS=['CARE','AREA','REAR','EARN','ACRE','RACE','RARE','NEAR','CANE','ACNE'];
export const LETTER_TILES=['R','A','E','N','A','R','E','C','R','A','E','R','A','E','A','R'];
export const TILE_ANSWER=['CARE','AREA','REAR','EARN'];
export function evaluateTiles(grid){
 const full=grid.length===16&&grid.every(i=>Number.isInteger(i)&&i>=0&&i<16)&&new Set(grid).size===16;
 const rows=[0,1,2,3].map(y=>grid.slice(y*4,y*4+4).map(i=>LETTER_TILES[i]||'·').join('')),cols=[0,1,2,3].map(x=>[0,1,2,3].map(y=>LETTER_TILES[grid[y*4+x]]||'·').join(''));
 const rowOK=rows.map(w=>TILE_WORDS.includes(w)),colOK=cols.map(w=>TILE_WORDS.includes(w));
 return {rows,cols,rowOK,colOK,solved:full&&rows[0][0]==='C'&&rows[3][3]==='N'&&rowOK.every(Boolean)&&colOK.every(Boolean)&&rows.every((w,i)=>w===cols[i])};
}
export function freshLanguage(){return{redactionLesson:0,redactionMarks:REDACTION_LESSONS.map(()=>[]),redactionPassed:REDACTION_LESSONS.map(()=>false),securitySheet:false,securityCertified:false,securityAttempts:0,garage:false,garageWorkshop:false,garagePassage:false,plateEntry:'',plateGuesses:[],tileGrid:Array(16).fill(null),tileAttempts:0};}
export function sanitizeLanguage(s,f){
 const raw=Array.isArray(s.redactionMarks)?s.redactionMarks:[];f.redactionMarks=REDACTION_LESSONS.map((l,i)=>Array.isArray(raw[i])?[...new Set(raw[i].filter(n=>Number.isInteger(n)&&n>=0&&n<redactionTokens(i).length))].slice(0,l.limit):[]);
 f.redactionPassed=REDACTION_LESSONS.map((_,i)=>!!s.redactionPassed?.[i]);f.redactionLesson=Number.isInteger(s.redactionLesson)?Math.max(0,Math.min(5,s.redactionLesson)):0;
 for(const key of ['securitySheet','securityCertified','garage','garageWorkshop','garagePassage'])f[key]=!!s[key];
 for(const key of ['securityAttempts','tileAttempts'])f[key]=Math.max(0,Math.min(9999,Number.isInteger(s[key])?s[key]:0));
 f.plateEntry=typeof s.plateEntry==='string'?s.plateEntry.replace(/[^A-Z]/g,'').slice(0,5):'';f.plateGuesses=Array.isArray(s.plateGuesses)?s.plateGuesses.filter(w=>PLATE_WORDS.includes(w)).slice(-6):[];
 if(Array.isArray(s.tileGrid)&&s.tileGrid.length===16){const used=new Set();f.tileGrid=s.tileGrid.map(i=>{if(!Number.isInteger(i)||i<0||i>=16||used.has(i))return null;used.add(i);return i;});}
 // Existing visits keep already-open inspection access; no one is stranded below.
 if(s.version<4&&(s.basementAccess||s.basementVisited||s.clearance))f.securityCertified=true;
 if(f.securityCertified)f.garage=true;if(f.garagePassage)f.garageWorkshop=true;if(f.garageWorkshop)f.garage=true;
}
export const LANGUAGE_WORKS={
 redactionRules:{title:'A statement survives its ink',artist:'Security / training circular',meta:'Read before the night audit',text:'Every surviving statement must be true. An empty sheet says nothing and proves nothing.\n\nTouch a word to cover it. Its punctuation belongs to it. Touch the bar to restore it. Line breaks are only spacing; a surviving period ends a statement. Without it, the next line continues the thought.\n\nThe allowance counts covered words, not gestures. Each sheet prints its own limit.'},
 heavyInk:{title:'Weight is not emphasis',artist:'Department of Verification',meta:'Heavy-ink register · introduced on sheet III',text:'The first two calibration screens use one ordinary display weight. From sheet III, the contrast matters.\n\nRead a heavy statement literally, then reverse its truth value. Heavy type is a denial of the whole statement. Covering a word does not lift that denial.\n\nOrdinary: white is white.\nHeavy: white is black.\nBoth can be admitted.'},
 securityChecker:{title:'Return to sender',artist:'Night-audit equipment',meta:'Security checker / no penalty for rejection',text:'The computer keeps six instruction sheets. Its arrow appears when a lesson holds. The final sheet must be printed and fed into this slot.\n\nWrong work returns. Alter the returned sheet and try again. Accepted work lights the floor cable and releases South Service, the employee entrance and the garage. The terrace keeps its separate collection circuit.'},
 windowWitness:{title:'A borrowed view',artist:'Facilities / internal glazing',meta:'Hall glazing / direct evidence',text:'A sentence about the building cannot be judged on the screen. Leave the office and look into the hall.\n\nThe hall has lost its bridges. Its window remains. The south-wall stair reaches only the west mezzanine. The east side is reached through authorised employee circulation.'},
 redactionWeights:{title:'A statement held in suspension',artist:'Night shift / field exercise',meta:'Sheet V / west mezzanine',text:'The colors on sheet V are names, not inks. Their order is a matter of height.\n\nFind Three suspensions on the public west mezzanine. Read from the floor toward the ceiling. Then return to the sentence.'},
 garagePermit:{title:'Night service authorisation',artist:'Security / accepted',meta:'Garage and South Service readers enabled',text:'The statement has survived inspection. The garage latch is released. The illuminated floor cable leads to the released service hall. Its lift, employee stair, supply closet and conference route are available.\n\nCuratorial clearance for freight remains a separate matter.'},
 garageIntro:{title:'Words left in the loading bay',artist:'Department of Misdelivery',meta:'Service garage / deduction and rearrangement',text:'An empty delivery has arrived for a work with no inside. Its missing word is still in the rack list.\n\nThe dispatch plate remembers five positions. A solid square belongs here; a ring belongs elsewhere; a crossed square belongs nowhere in that word. Repeated letters cannot borrow the same place twice.\n\nSix lines fill a page, not your last chance. Clear the page and continue.'},
 plateVocabulary:{title:'Permitted rack labels',artist:'Loading clerk',meta:'Fourteen words / dispatch plate',text:PLATE_WORDS.join(' · ')+'\n\nOnly rack words are accepted. This register replaces an outside dictionary. The delivery tag asks for the object, not its contents.'},
 emptyDelivery:{title:'Contents deliberately absent',artist:'Unclaimed crate / 04:17',meta:'Four lengths of timber, four corners, no canvas',text:'Do not order the image. Order what was left around it.\n\nThe delivery contains neither flame, cargo nor a painted surface. The negative space is not damaged freight.'},
 tileRules:{title:'Crossed streets',artist:'Department of Misdelivery',meta:'Sixteen loose letter tiles / four by four',text:'Use every tile once. The top-left corner remembers C; the bottom-right remembers N.\n\nFour streets run east. Four run south. Street I must read the same in either direction of travel; so must II, III and IV. Read left to right and top to bottom, never backward.\n\nEvery street is a word in the brass register. The tester accepts the whole square, not a single row.'},
 tileVocabulary:{title:'The brass register',artist:'Workshop / remaining words',meta:'Allowed four-letter streets',text:TILE_WORDS.join(' · ')+'\n\nA rejected square keeps every tile. Move, exchange or return letters freely. The diagonal corners are conditions, not extra tiles.'},
 returnPassage:{title:'An address that folds back',artist:'Department of Circulation',meta:'Workshop return / behind Counterform',text:'When the streets agree, the building adopts their symmetry. The workshop opens toward the room that taught you to turn a plan.\n\nA return is permission to reconsider.'}
};
