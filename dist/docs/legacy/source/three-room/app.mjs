import {SAVE_KEY,PREF_KEY,ROOMS,PUZZLES,FOOD_ROWS,FOOD_ART,newGame,restoreGame,roomSolved,submitAnswer,collectFragment,gateOpen,travel} from './core.mjs';
import {icon,mark,artwork,mural,foodIcon} from './art.mjs';

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=null,prefs={sound:false,motion:!window.matchMedia('(prefers-reduced-motion: reduce)').matches,contrast:false};
try{state=restoreGame(localStorage.getItem(SAVE_KEY));const p=JSON.parse(localStorage.getItem(PREF_KEY)||'null');if(p&&typeof p==='object')for(const k of Object.keys(prefs))if(typeof p[k]==='boolean')prefs[k]=p[k];}catch{}
const ui={screen:'menu',panel:null,art:null,lens:false,puzzle:'xo',filter:'quotient',tab:'catalog',drafts:{},feedback:null,item:null,confirm:null,toastTimer:0,focusBack:null};
let audioContext,ambient,holding=0,holdStart=0,storageWarned=false;
const solved=id=>!!state?.solved.includes(id);
const button=(action,content,cls='',extra='')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${content}</button>`;
function save(){try{if(state)localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch{if(!storageWarned){storageWarned=true;toast('Your browser cannot save progress. Keep this tab open.');}}}
function savePrefs(){try{localStorage.setItem(PREF_KEY,JSON.stringify(prefs));}catch{}applyPrefs();}
function applyPrefs(){document.documentElement.classList.toggle('reduce-motion',!prefs.motion);document.documentElement.classList.toggle('high-contrast',prefs.contrast);}
function toast(text){clearTimeout(ui.toastTimer);$('#toast').textContent=text;$('#toast').classList.add('show');ui.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4700);}
function sound(kind='tap'){
 if(!prefs.sound)return;
 try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();
 const t=audioContext.currentTime;const ns=kind==='success'?[392,493.88,587.33]:[174.61];
 ns.forEach((n,i)=>{let o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=n;g.gain.setValueAtTime(0,t+i*.1);g.gain.linearRampToValueAtTime(.065,t+i*.1+.025);g.gain.exponentialRampToValueAtTime(.001,t+i*.1+.7);o.connect(g);g.connect(audioContext.destination);o.start(t+i*.1);o.stop(t+i*.1+.8);});
 }catch{}
}
function ambientAudio(){
 if(!prefs.sound||ui.screen==='menu'||document.hidden){if(ambient){ambient.g.gain.setTargetAtTime(0,audioContext.currentTime,.3);const a=ambient;setTimeout(()=>a.os.forEach(o=>{try{o.stop();}catch{}}),1000);ambient=null;}return;}
 if(ambient)return;try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();const g=audioContext.createGain();g.gain.value=.012;g.connect(audioContext.destination);const os=[55,82.7,110.4].map(n=>{const o=audioContext.createOscillator();o.type='sine';o.frequency.value=n;o.connect(g);o.start();return o;});ambient={g,os};}catch{}
}
document.addEventListener('visibilitychange',ambientAudio);
function rememberFocus(){if(!ui.panel&&!ui.art)ui.focusBack=document.activeElement;}
function closeOverlay(){if(ui.confirm){ui.confirm=null;renderOverlays();return;}if(ui.panel){ui.panel=null;ui.item=null;}else if(ui.art){ui.art=null;}renderOverlays();if(!ui.panel&&!ui.art){ui.focusBack?.focus?.();ui.focusBack=null;}}
function panel(name){rememberFocus();ui.panel=name;ui.feedback=null;renderOverlays();}
function openTablet(id){
 if(!state?.tabletGiven)return toast('A tablet is waiting on the reception desk.');
 rememberFocus();ui.panel='tablet';ui.tab='catalog';ui.feedback=null;
 const inferred=id|| (ui.art==='projection'||FOOD_ART.some(x=>x.id===ui.art)?'banquet':ui.art?.startsWith('mural')?'murals':PUZZLES[ui.art]?ui.art:null);
 const room=ROOMS[state.room]?.puzzles.length?state.room:'quotient';
 ui.puzzle=inferred||ROOMS[room].puzzles.find(x=>!solved(x))||ROOMS[room].puzzles[0];ui.filter=PUZZLES[ui.puzzle].room;renderOverlays();
}
function inspect(id){rememberFocus();ui.art=id;ui.panel=null;ui.feedback=null;renderOverlays();sound();}
function startGame(){state=newGame();ui.screen='game';ui.panel=null;ui.art=null;ui.confirm=null;ui.drafts={};ui.lens=false;save();render();}
function go(room){if(travel(state,room)){ui.art=null;ui.panel=null;save();render();sound();}else if(room==='threshold'){if(gateOpen(state))return;openTablet('way');}else toast('The tablet on the desk is meant for you.');}
function menu(){ui.screen='menu';ui.art=null;ui.panel=null;ui.confirm=null;save();render();}
function render(){
 applyPrefs();ambientAudio();
 const previousScroll=$('.scene-scroll')?.scrollLeft||0;const sameRoom=ui.renderedRoom===state?.room;
 $('#app').innerHTML=ui.screen==='menu'?menuHTML():state.phase==='play'?gameHTML():introHTML();
 const scroller=$('.scene-scroll');if(scroller&&sameRoom)scroller.scrollLeft=previousScroll;ui.renderedRoom=state?.room;
 renderOverlays();
}
function menuHTML(){return `<main class="menu-screen"><div class="exterior-background menu-background"></div><div class="menu-shade"></div><div class="menu-top"><span class="micro">A MUSEUM OUTSIDE OF EVERYTHING</span><span class="edition">EXHIBIT <i>I</i></span></div><section class="menu-content"><div class="menu-kicker"><span></span> AN EXHIBITION OF IMPOSSIBILITIES</div><h1 class="wordmark">Puzzle<span>Pieces<span class="title-dot">.</span></span></h1><p class="tagline">Some things only make sense<br>when you take them apart.</p><nav class="menu-nav" aria-label="Main menu">${button('start',`<span>Start game</span>${icon('arrow')}`,'menu-primary')}${button('continue',`<span>Continue game</span>${state?`<small>${state.solved.length} / 9</small>`:icon('arrow')}`,'menu-secondary',!state?'disabled':'')}${button('settings',`<span>Settings</span>${icon('gear')}`,'menu-secondary')}</nav></section><div class="menu-foot">${button('dev-hold',icon('gear'),'dev-gear','aria-label="Hold for five seconds to open developer controls"')}<span class="micro">ADMISSION BY INVITATION ONLY</span><span class="menu-location">Somewhere. &nbsp; Some time.</span></div><div class="grain"></div></main>`;}
const arrival=["well… I actually made it","this is seriously weird, who builds a museum all the way out in the middle of nowhere","well I guess I drove all the way out here, can't pass up the chance for some money"];
function letterContent(){return `<div class="letter-head">${mark()}<span>THE MUSEUM<br><small>OFFICE OF THE CURATOR</small></span></div><div class="letter-rule"></div><p>Dear prospective visitor,</p><p>You are invited to a museum that does not appear on any map.</p><p>Every piece of art within these walls is a puzzle. Some ask to be observed. Some ask to be touched. Others are waiting for you to look somewhere else.</p><p>A prize of <strong>one hundred thousand dollars</strong> awaits the person who solves the museum in its entirety.</p><p>Bring your curiosity.<br>Leave your expectations at the door.</p><p class="signature">The Curator</p><div class="letter-ps">P.S. You will know the place when you arrive.</div>`;}
function introHTML(){
 if(state.phase==='sealed')return `<main class="intro-screen"><div class="exterior-background blurred"></div><div class="intro-dim"></div><div class="envelope-stage"><span class="micro">IT ARRIVED WITHOUT A RETURN ADDRESS.</span>${button('open-letter',`<div class="envelope-flap"></div><span class="envelope-address">For the one who looks closer.</span><span class="wax-seal">${mark()}</span>`,'envelope','aria-label="Break the seal and open the letter"')}<span class="envelope-caption">${button('open-letter','Break the seal','text-link')}</span></div><div class="grain"></div></main>`;
 if(state.phase==='letter')return `<main class="intro-screen"><div class="exterior-background blurred"></div><div class="intro-dim"></div><article class="invitation-paper">${letterContent()}${button('arrive',`Continue ${icon('arrow')}`,'paper-button')}</article></main>`;
 return `<main class="arrival-screen"><div class="exterior-background arrival-background"></div><div class="location-stamp"><span class="micro">THE END OF THE ROAD</span><h2>The museum.</h2></div><div class="dialogue"><span class="dialogue-mark">“</span><p>${arrival[state.arrivalStep]}</p>${button('dialogue',state.arrivalStep===2?`Go inside ${icon('arrow')}`:icon('arrow'),'dialogue-next','aria-label="Continue dialogue"')}</div><div class="grain"></div></main>`;
}
function headerHTML(){return `<header class="game-header"><div class="game-brand">${mark()}<span>PUZZLE PIECES</span></div><span class="header-exhibit">EXHIBIT I <span>/</span> PARTS OF A WHOLE</span>${button('pause',icon('pause'),'icon-button','aria-label="Pause game"')}</header>`;}
function toolsHTML(){return `<footer class="game-footer"><div class="footer-location"><span class="location-dot"></span>${ROOMS[state.room].name}</div><nav class="hotbar" aria-label="Visitor equipment">${button('tablet',`${icon('tablet')}<span>Tablet</span><kbd>T</kbd>`,'tool-button',!state.tabletGiven?'disabled':'')}${button('inventory',`${icon('bag')}<span>Inventory</span><kbd>I</kbd>`,'tool-button')}${button('map',`${icon('map')}<span>Map</span><small>${state.fragments.length}/3</small>`,'tool-button')}${state.items.includes('lens')?button('lens',`${icon('lens')}<span>Glass</span>`,ui.lens?'tool-button active':'tool-button','aria-pressed="'+ui.lens+'"'):''}</nav><div class="footer-progress"><span>${String(state.solved.length).padStart(2,'0')}</span> / 09<span class="progress-line"><i style="width:${state.solved.length/9*100}%"></i></span></div></footer>`;}
function checklist(room){return `<div class="door-checklist"><span class="micro">ON VIEW</span>${ROOMS[room].puzzles.map(id=>`<div class="checklist-line ${solved(id)?'complete':''}"><span>${solved(id)?'✓':'·'}</span>${esc(PUZZLES[id].name)}</div>`).join('')}</div>`;}
function sceneTitle(){const r=ROOMS[state.room];return `<div class="scene-title"><span class="micro">${r.subtitle}</span><h1><span>${r.number}</span>${r.name}</h1></div>`;}
function exitHTML(){return `<div class="exit-area">${button('travel',`${icon('back')}<span>Vestibule</span>`,'room-exit','data-room="lobby"')}${checklist(state.room)}</div>`;}
function fragmentHTML(){return roomSolved(state,state.room)&&!state.fragments.includes(state.room)?button('fragment',`${icon('map')}<span>A folded fragment</span>`,'fragment-pickup','aria-label="Collect the map fragment by the doorway"'):'';}
function framed(id,extra=''){const p=PUZZLES[id]||FOOD_ART.find(x=>x.id===id);return button('inspect',`<span class="art-frame ${p?.interactive?'turnable':''}">${artwork(id,state,ui.lens&&id==='chromatic')}${p?.interactive?'<i></i><i></i><i></i><i></i>':''}</span><span class="art-label"><b>${p?.catalog}</b>${esc(p?.name)}${solved(id)?'<span class="tiny-check">✓</span>':''}</span>`,'painting '+extra,`data-id="${id}" aria-label="Inspect ${esc(p?.name)}"`);}
function gameHTML(){return `${headerHTML()}<main class="game-world"><div class="scene-scroll"><div class="scene-canvas room-${state.room}"><div class="scene-background"></div><div class="scene-vignette"></div>${sceneTitle()}${state.room==='lobby'?lobbyHTML():state.room==='quotient'?quotientHTML():state.room==='corridor'?corridorHTML():state.room==='pantry'?pantryHTML():thresholdHTML()}<div class="grain"></div></div></div>${state.room!=='threshold'?`<nav class="scene-pan" aria-label="Look around the room">${button('look-left',icon('back'),'','aria-label="Look left"')}${button('look-right',icon('arrow'),'','aria-label="Look right"')}</nav>`:''}</main>${toolsHTML()}`;}
function lobbyHTML(){return `<div class="portal-row">${['quotient','corridor','pantry'].map((room,i)=>`<div class="portal-group">${button('travel',`<span class="door-arch"><span class="door-emblem">${i===0?'÷':i===1?'∞':'❧'}</span><span class="door-knob"></span></span><span class="portal-title"><small>ROOM ${ROOMS[room].number}</small>${ROOMS[room].name}${roomSolved(state,room)?' <i>✓</i>':''}</span>`,'portal',`data-room="${room}"`)}${checklist(room)}</div>`).join('')}</div><div class="reception-desk"><span class="desk-label">VISITOR SERVICES</span><div class="desk-objects">${!state.tabletGiven?button('take-tablet',`<span class="physical-tablet">${mark()}<small>WELCOME</small></span><em>A tablet</em>`,'desk-object tablet-object'):''}${!state.noteGiven?button('take-note','<span class="physical-note">For our guest.<br><i>— C.</i></span><em>A note</em>','desk-object note-object'):''}${!state.items.includes('lens')?button('take-lens','<span class="physical-lens"></span><em>Blue glass</em>','desk-object lens-object'):''}${state.tabletGiven&&state.noteGiven&&state.items.includes('lens')?'<span class="desk-empty">Please enjoy your visit.</span>':''}</div></div>${button('travel',`${gateOpen(state)?icon('arrow'):icon('lock')}<span>Further in</span>`,'further-door '+(gateOpen(state)?'unlocked':''),'data-room="threshold"')}`;}
function quotientHTML(){return `<div class="gallery-art-row">${['xo','flock','night','absence','chromatic'].map(id=>framed(id)).join('')}</div>${button('inspect',`${artwork('sculpture',state)}<span class="sculpture-label">VI &nbsp; THE WEIGHT OF ANSWERS ${solved('sculpture')?'✓':''}</span>`,'sculpture-hotspot','data-id="sculpture" aria-label="Inspect The Weight of Answers"')}${exitHTML()}${fragmentHTML()}${button('travel',`<span>02</span>${icon('arrow')}`,'fold-door','data-room="corridor" aria-label="Take the narrow door to the Long Division"')}`;}
function corridorHTML(){return `${button('inspect',`<span class="wall-mural">${mural('left')}</span><span class="mural-label">THE FIRST WALL ${icon('lens')}</span>`,'mural-hotspot mural-left','data-id="mural-left" aria-label="Inspect the left mural"')}${button('inspect',`<span class="wall-mural">${mural('right')}</span><span class="mural-label">THE OTHER WALL ${icon('lens')}</span>`,'mural-hotspot mural-right','data-id="mural-right" aria-label="Inspect the right mural"')}${button('hall-loop',icon('arrow'),'end-of-hall','aria-label="Walk to the door at the far end of the corridor"')}<div class="corridor-plaque"><span>VII</span><h3>Two Sides of the Same Thing</h3><p>Like belongs to like.<br>Begin where the light enters.</p>${button('tablet-work','Record response','text-link','data-id="murals"')}</div>${exitHTML()}${fragmentHTML()}`;}
function projectionHTML(interactive=false){return `<div class="food-projection"><div class="projection-header"><span>THE UNSPOKEN MENU</span><span>01 — 10</span></div>${FOOD_ROWS.map((row,r)=>`<div class="food-row"><span class="food-row-label">${String(r+1).padStart(2,'0')}</span>${row.map((food,c)=>interactive?button('food-mark',`${foodIcon(food)}<span>${esc(food)}</span><small>${String(c+1).padStart(2,'0')}</small>`,state.foodMarks[r]===c?'food-cell selected':'food-cell',`data-row="${r}" data-col="${c}" aria-pressed="${state.foodMarks[r]===c}" aria-label="Row ${r+1}, column ${c+1}, ${food}"`):`<span class="food-cell">${foodIcon(food)}<span>${esc(food)}</span><small>${String(c+1).padStart(2,'0')}</small></span>`).join('')}</div>`).join('')}</div>`;}
function pantryHTML(){return `<div class="food-art-row">${FOOD_ART.map(a=>framed(a.id)).join('')}</div>${button('inspect',projectionHTML(),'projection-hotspot','data-id="projection" aria-label="Inspect the four rows of ten projected foods"')}${exitHTML()}${fragmentHTML()}`;}
function thresholdHTML(){return `<section class="ending"><span class="ending-symbol">${mark()}</span><span class="micro">EXHIBIT I COMPLETE</span><h2>There is always<br>another way in.</h2><p>The door closes behind you.<br>Somewhere beyond it, two more doors open.</p><div class="future-doors"><div><span>WEST WING</span><b>The Afterimage</b><small>Beyond this first chapter</small></div><div><span>EAST WING</span><b>The Missing Hour</b><small>Beyond this first chapter</small></div></div><p class="end-caption">You have reached the end of the playable opening exhibit.</p>${button('travel',`Return to the museum ${icon('back')}`,'outline-button','data-room="lobby"')}</section>`;}
function closeButton(){return button('close',icon('close'),'close-button','aria-label="Close"');}
function renderOverlays(){
 let html='';
 if(ui.art)html+=artHTML();
 if(ui.panel)html+=panelHTML();
 if(ui.confirm)html+=`<div class="modal-layer confirm-layer"><section class="small-panel" role="dialog" aria-modal="true" aria-label="Start a new game"><span class="micro">A NEW INVITATION</span><h2>Begin again?</h2><p>This replaces the progress saved in this browser.</p><div class="button-row">${button('cancel-confirm','Keep exploring','outline-button')}${button('confirm-new','Start a new game','solid-button')}</div></section></div>`;
 $('#overlays').innerHTML=html;
 $('#app').inert=!!(ui.art||ui.panel||ui.confirm);
 if(ui.panel||ui.confirm){const a=$('.art-layer');if(a)a.inert=true;}
 if(ui.confirm){document.querySelectorAll('.modal-layer:not(.confirm-layer)').forEach(x=>x.inert=true);}
 const active=[...document.querySelectorAll('[role="dialog"]')].filter(x=>!x.closest('[inert]')).at(-1);
 if(active){const f=active.querySelector('[autofocus]')||active.querySelector('button, input, select, textarea');requestAnimationFrame(()=>f?.focus({preventScroll:true}));}
}
function artHTML(){
 const id=ui.art;const food=FOOD_ART.find(x=>x.id===id);const p=PUZZLES[id]||food;
 const isMural=id.startsWith('mural');const projection=id==='projection';
 const title=isMural?'Two Sides of the Same Thing':projection?'The Unspoken Menu':p?.name;
 const subtitle=isMural?(id==='mural-left'?'THE FIRST WALL':'THE OTHER WALL'):projection?'LIGHT PROJECTION · FOUR COURSES':`WORK ${p?.catalog} · ${id==='sculpture'?'BRASS & STONE':'MIXED MEDIA'}`;
 const body=isMural?`<div class="mural-zoom">${mural(id==='mural-left'?'left':'right')}</div>`:projection?`<div class="projection-zoom">${projectionHTML(true)}</div>`:`<div class="zoom-frame ${id==='absence'?'turnable':''} ${id==='sculpture'?'sculpture-frame':''} ${ui.lens&&id==='chromatic'?'glass-active':''}">${artwork(id,state,ui.lens&&id==='chromatic')}${id==='absence'?'<i></i><i></i><i></i><i></i>':''}</div>`;
 return `<div class="modal-layer art-layer"><section class="art-dialog ${isMural||projection?'wide-art':''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header class="art-top"><div><span class="micro">${subtitle}</span><h2>${esc(title)}</h2></div>${closeButton()}</header><div class="art-display">${body}</div><footer class="art-bottom"><div class="art-description"><span class="plaque-dash"></span><p>${esc(isMural?PUZZLES.murals.plaque:projection?PUZZLES.banquet.plaque:p?.plaque)}</p></div><div class="art-actions">${id==='absence'?button('rotate',`${icon('rotate')}<span>Turn frame</span>`,'outline-button'):''}${isMural?button('other-wall',`${icon('rotate')}<span>Other wall</span>`,'outline-button'):''}${state.items.includes('lens')&&!isMural&&!projection?button('lens',`${icon('lens')}<span>Blue glass</span>`,ui.lens?'outline-button active':'outline-button','aria-pressed="'+ui.lens+'"'):''}${button('tablet',`${icon('tablet')}<span>Open tablet</span>`,'solid-button')}</div></footer>${ui.lens&&!isMural&&!projection?`<div class="lens-indicator">BLUE GLASS ${id==='chromatic'?'· FILTER ENGAGED':''}</div>`:''}</section></div>`;
}
function panelHTML(){
 if(ui.panel==='tablet')return tabletHTML();
 if(ui.panel==='inventory')return inventoryHTML();
 if(ui.panel==='map')return mapHTML();
 if(ui.panel==='settings'||ui.panel==='pause')return settingsHTML();
 if(ui.panel==='dev')return devHTML();
 if(ui.panel==='welcome')return `<div class="modal-layer"><section class="small-panel welcome-panel" role="dialog" aria-modal="true" aria-label="Your visitor tablet">${icon('tablet')}<span class="micro">VISITOR No. 001</span><h2>Already expecting you.</h2><p>The tablet follows the artwork you inspect. Open it whenever you have an answer, or browse the catalogue for another work.</p><p class="subtle">Your progress is saved here, in this browser.</p>${button('close',`Keep looking ${icon('arrow')}`,'solid-button')}</section></div>`;
 return '';
}
function tabletHTML(){
 const p=PUZZLES[ui.puzzle];const done=solved(ui.puzzle);const choices=Object.keys(PUZZLES).filter(id=>ui.filter==='all'||PUZZLES[id].room===ui.filter);
 const list=choices.map(id=>button('select-puzzle',`<span class="catalog-number">${PUZZLES[id].catalog}</span><span>${PUZZLES[id].name}</span><i>${solved(id)?'✓':'○'}</i>`,'catalog-item '+(id===ui.puzzle?'selected':''),`data-id="${id}"`)).join('');
 const selectedRoom=ROOMS[state.room]?.puzzles.length?state.room:'quotient';
 let answer='';const draft=ui.drafts[ui.puzzle];
 if(p.kind==='food'){const values=done?p.answer.match(/../g):Array.isArray(draft)?draft:['','','',''];answer=`<div class="food-answer-inputs">${values.map((v,i)=>`<label><span>${['I','II','III','IV'][i]}</span><input name="food${i}" type="text" inputmode="numeric" autocomplete="off" maxlength="2" pattern="[0-9]{1,2}" aria-label="Column number for painting ${i+1}" placeholder="—" value="${esc(v)}" ${done?'readonly':''}/></label>`).join('')}</div><span class="input-footnote">01 — 10</span>`;}
 else answer=`<input class="answer-input ${p.kind==='sequence'?'sequence-input':''} ${p.kind==='word'?'word-input':''}" name="answer" aria-label="${esc(p.name)} solution" type="text" ${p.kind==='word'?'inputmode="text"':'inputmode="numeric"'} autocomplete="off" spellcheck="false" maxlength="${p.kind==='sequence'?5:p.kind==='word'?3:7}" placeholder="${p.kind==='sequence'?'_ _ _ _ _':p.kind==='word'?'_ _ _':'—'}" value="${esc(done?p.answer:draft||'')}" ${done?'readonly':''}/>`;
 return `<div class="modal-layer tablet-layer"><section class="tablet" role="dialog" aria-modal="true" aria-label="Museum tablet"><header class="tablet-status"><span>${mark()} MUSEUM / VISITOR CATALOGUE</span><span>OFFLINE READY <i class="battery"></i>${closeButton()}</span></header><div class="tablet-body"><aside class="tablet-sidebar"><div class="tablet-heading"><span class="micro">YOUR PRIVATE VIEW</span><h2>The catalogue.</h2></div><div class="tablet-tabs">${button('tablet-catalog','Works',ui.tab==='catalog'?'selected':'')}${button('tablet-notes','Notebook',ui.tab==='notes'?'selected':'')}</div><div class="catalog-navigation"><label class="sr-only" for="room-filter">Choose a room</label><select id="room-filter"><option value="all" ${ui.filter==='all'?'selected':''}>All works</option value="quotient" ${ui.filter==='quotient'?'selected':''}>01 · The Quotient Room</option><option value="corridor" ${ui.filter==='corridor'?'selected':''}>02 · The Long Division</option><option value="pantry" ${ui.filter==='pantry'?'selected':''}>03 · A Taste of Meaning</option><option value="beyond" ${ui.filter==='beyond'?'selected':''}>Beyond the rooms</option></select>${button('current-room',`↳ This room`,'this-room','data-room="'+selectedRoom+'"')}</div><nav class="catalog-list" aria-label="Puzzle catalogue">${list}</nav><div class="catalog-progress"><span>${state.solved.length} of 9 responses accepted</span><i><b style="width:${state.solved.length/9*100}%"></b></i></div></aside><main class="tablet-main">${ui.tab==='notes'?`<span class="micro">FOR YOUR EYES ONLY</span><h2>Loose thoughts.</h2><label class="sr-only" for="notebook">Your notes</label><textarea id="notebook" maxlength="10000" placeholder="What have you noticed?">${esc(state.notes)}</textarea><span class="notes-saved">Saved with your progress.</span>`:`<div class="response-heading"><span class="micro">${p.room==='beyond'?'BEYOND THE ROOMS':ROOMS[p.room].name.toUpperCase()}</span><span class="response-code">${p.catalog.padStart(2,'0')}</span></div><h2>${p.name}</h2><form id="answer-form" data-id="${ui.puzzle}"><div class="response-center"><span class="response-label">${done?'RESPONSE ACCEPTED':'YOUR RESPONSE'}</span>${answer}<div class="answer-feedback ${ui.feedback?.ok?'is-correct':'is-wrong'}" role="status">${ui.feedback?.text||''}</div></div>${done?`<div class="accepted-stamp">${icon('check')} Recorded</div>`:`<button class="record-button" type="submit">Record response ${icon('arrow')}</button>`}</form><p class="tablet-motto">Look closer. Then look elsewhere.</p>`}</main></div><div class="tablet-home-indicator"></div></section></div>`;
}
function inventoryHTML(){
 let content='';
 if(ui.item==='invitation')content=`<article class="inventory-letter">${letterContent()}</article>`;
 else if(ui.item==='note')content=`<article class="curator-note"><span class="micro">A NOTE LEFT ON THE DESK</span><h2>A few things<br>worth keeping.</h2><p>Ordinary frames preserve.<br>Brass studs permit movement.</p><p>The inspection glass belongs to you.</p><p>The map is not missing.<br>It is in pieces.</p><p>Please return every part of yourself when leaving.</p><span class="signature">— C.</span></article>`;
 else if(ui.item==='lens')content=`<article class="lens-detail"><span class="large-lens"></span><h2>Blue inspection glass</h2><p>A cool piece of glass in a well-worn brass handle.</p>${button('use-lens',ui.lens?'Put away the glass':'Hold it to the light','solid-button')}</article>`;
 else content=`<div class="inventory-empty-detail"><span class="large-inventory-icon">${icon('bag')}</span><p>Some things are worth holding on to.</p><span class="subtle">Select an object to look closer.</span></div>`;
 return `<div class="modal-layer"><section class="inventory-panel" role="dialog" aria-modal="true" aria-label="Inventory"><header class="panel-header"><div><span class="micro">WHAT YOU CARRY</span><h2>Collected things.</h2></div>${closeButton()}</header><div class="inventory-layout"><nav class="inventory-list">${state.items.map(id=>button('item',`${icon(id==='lens'?'lens':'note')}<span>${{invitation:'The invitation',note:'A note from the Curator',lens:'Blue inspection glass'}[id]}</span>`,'inventory-item '+(ui.item===id?'selected':''),'data-id="'+id+'"')).join('')}${state.fragments.map((room,i)=>button('map',`${icon('map')}<span>Map fragment · ${ROOMS[room].number}</span>`,'inventory-item')).join('')}</nav><div class="inventory-detail">${content}</div></div></section></div>`;
}
function mapHTML(){
 const all=state.fragments.length===3;
 return `<div class="modal-layer"><section class="map-panel" role="dialog" aria-modal="true" aria-label="Museum map"><header class="panel-header"><div><span class="micro">${state.fragments.length} OF 3 FRAGMENTS FOUND</span><h2>A place, in pieces.</h2></div>${closeButton()}</header><div class="map-paper"><div class="map-heading">THE MUSEUM <small>EXHIBIT I / AN APPROXIMATION</small></div><div class="map-fragments">${['quotient','corridor','pantry'].map((room,i)=>`<section class="map-fragment part-${i} ${state.fragments.includes(room)?'found':'missing'}">${state.fragments.includes(room)?`<span class="map-part-label">${['I. THE WEIGHT','II. THE CENTER','III. THE COURSES'][i]}</span><div class="map-room-outline ${i===1?'long':''}">${button('travel',ROOMS[room].name,'map-room-button','data-room="'+room+'"')}</div><div class="map-extraction">${i===0?'<span class="sketch-sculpture">▣ ▣ ▣ ▣ ▣<br>━━━━━━━━<br>◯ &nbsp; ◯</span><span>THE WHOLE WEIGHT</span>':i===1?'<span class="sketch-slots">□ □ <b>□</b> □ □</span><span>ONLY THE CENTER</span>':'<span class="sketch-food">I + II + III + IV</span><span>THE POSITIONS YOU CHOSE</span>'}</div>`:`${icon('map')}<span>Fragment ${['I','II','III'][i]}</span>`}</section>`).join('')}</div>${all?`<div class="map-alphabet"><div>${Array.from({length:26},(_,i)=>`<span><b>${String.fromCharCode(65+i)}</b><small>${i+1}</small></span>`).join('')}</div><p>THREE PLACES. THREE LETTERS. ONE WAY THROUGH.</p></div>`:`<p class="map-unfinished">The spaces between rooms are not drawn to scale.<br>The spaces inside them are not, either.</p>`}<div class="map-path">RECEPTION <span>⤷</span> THREE DOORS <span>⤷</span> SOMEWHERE ELSE</div></div>${all?button('tablet-work',`The way through ${icon('arrow')}`,'solid-button','data-id="way"'):''}</section></div>`;
}
function settingsHTML(){return `<div class="modal-layer"><section class="small-panel settings-panel" role="dialog" aria-modal="true" aria-label="Settings"><header class="panel-header"><div><span class="micro">${ui.panel==='pause'?'TAKE YOUR TIME':'MAKE YOURSELF AT HOME'}</span><h2>${ui.panel==='pause'?'A moment, please.':'Settings.'}</h2></div>${closeButton()}</header>${[['sound','Ambient sound','A quiet room tone and response chimes'],['motion','Subtle motion','Fades, drifting dust, and transitions'],['contrast','Higher contrast','Brighter labels and clearer controls']].map(([key,label,desc])=>`<div class="setting-row"><div><b>${label}</b><small>${desc}</small></div>${button('preference',`<i></i>`,prefs[key]?'switch on':'switch',`role="switch" aria-checked="${prefs[key]}" aria-label="${label}" data-key="${key}"`)}</div>`).join('')}<p class="settings-save">Progress saves automatically in this browser.</p><div class="button-column">${ui.screen==='game'?button('close','Return to the museum','solid-button')+button('main-menu','Main menu','outline-button'):''}</div></section></div>`;}
function devHTML(){return `<div class="modal-layer"><section class="dev-panel" role="dialog" aria-modal="true" aria-label="Developer controls"><header class="panel-header"><div><span class="micro">CURATOR ACCESS · SPOILERS</span><h2>Behind the exhibition.</h2></div>${closeButton()}</header><p class="subtle">The five-second gear is the only entrance to this guide. These controls change this browser’s save.</p><div class="dev-actions">${button('dev-unlock','Unlock the full opening exhibit','solid-button')}${button('start','Start fresh','outline-button')}</div><div class="dev-guide">${Object.entries(PUZZLES).map(([id,p])=>`<details><summary><span>${p.catalog} · ${p.name}</span><code>${p.kind==='food'?'07 · 08 · 09 · 01':p.answer}</code></summary><p>${p.explanation}</p>${state?button('dev-solve','Mark this response solved','text-link','data-id="'+id+'"'):''}</details>`).join('')}</div><div class="dev-design"><h3>Exhibit progression</h3><p>Start → sealed letter → invitation → three arrival lines → reception. Collect the tablet, note, and optional blue glass. All three rooms are open together. Each finished room releases a physical map fragment by its entrance. Solve all eight room responses, collect all three fragments, and enter the cross-room answer to open Further In.</p><p>Completed scope: the opening exhibit. The two wings beyond it are named future chapters. Saves are local, versioned, and independent for each visitor. The fictional prize is part of the invitation.</p></div></section></div>`;}

document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action]');if(!el||el.disabled)return;const action=el.dataset.action;
 if(action==='dev-hold')return;
 if(action==='start'){if(state){ui.confirm='new';renderOverlays();}else startGame();}
 else if(action==='confirm-new')startGame();
 else if(action==='cancel-confirm'){ui.confirm=null;renderOverlays();}
 else if(action==='continue'){if(state){ui.screen='game';render();}}
 else if(action==='settings'||action==='pause')panel(action);
 else if(action==='main-menu')menu();
 else if(action==='close')closeOverlay();
 else if(action==='open-letter'){state.phase='letter';save();render();sound();}
 else if(action==='arrive'){state.phase='arrival';save();render();}
 else if(action==='dialogue'){if(state.arrivalStep<2)state.arrivalStep++;else state.phase='play';save();render();}
 else if(action==='travel')go(el.dataset.room);
 else if(action==='look-left'||action==='look-right'){$('.scene-scroll')?.scrollBy({left:(action==='look-left'?-1:1)*Math.max(220,window.innerWidth*.65),behavior:prefs.motion?'smooth':'instant'});}
 else if(action==='hall-loop'){state.hallLoops=(state.hallLoops||0)+1;save();render();sound();toast(state.hallLoops===1?'You walk to the far door. The same corridor is on the other side.':'The lamps are behind you again.');}
 else if(action==='inspect')inspect(el.dataset.id);
 else if(action==='take-tablet'){state.tabletGiven=true;save();render();panel('welcome');sound('success');}
 else if(action==='take-note'){state.noteGiven=true;if(!state.items.includes('note'))state.items.push('note');save();render();ui.item='note';panel('inventory');toast('The note is in your inventory. Open it whenever you need it.');}
 else if(action==='take-lens'){if(!state.items.includes('lens'))state.items.push('lens');save();render();toast('Blue inspection glass added to your hotbar.');sound();}
 else if(action==='tablet')openTablet();
 else if(action==='tablet-work')openTablet(el.dataset.id);
 else if(action==='inventory'){ui.item=null;panel('inventory');}
 else if(action==='item'){ui.item=el.dataset.id;renderOverlays();}
 else if(action==='map')panel('map');
 else if(action==='lens'){ui.lens=!ui.lens;render();if(!ui.art)toast(ui.lens?'Blue glass held to the light.':'Blue glass put away.');}
 else if(action==='use-lens'){ui.lens=!ui.lens;ui.panel=null;render();toast(ui.lens?'Blue glass held to the light.':'Blue glass put away.');}
 else if(action==='rotate'){state.rotation=(state.rotation+1)%4;save();renderOverlays();sound();}
 else if(action==='other-wall'){ui.art=ui.art==='mural-left'?'mural-right':'mural-left';renderOverlays();}
 else if(action==='fragment'){if(collectFragment(state,state.room)){save();render();sound('success');toast(state.fragments.length===3?'The last fragment fits. Your map is complete.':'A map fragment joins the pieces in your inventory.');}}
 else if(action==='food-mark'){const r=Number(el.dataset.row),c=Number(el.dataset.col);if(state.foodMarks[r]===c)delete state.foodMarks[r];else state.foodMarks[r]=c;save();renderOverlays();}
 else if(action==='select-puzzle'){ui.puzzle=el.dataset.id;ui.tab='catalog';ui.feedback=null;renderOverlays();}
 else if(action==='current-room'){ui.filter=el.dataset.room;ui.puzzle=ROOMS[ui.filter].puzzles.find(x=>!solved(x))||ROOMS[ui.filter].puzzles[0];ui.tab='catalog';ui.feedback=null;renderOverlays();}
 else if(action==='tablet-catalog'){ui.tab='catalog';renderOverlays();}
 else if(action==='tablet-notes'){ui.tab='notes';renderOverlays();}
 else if(action==='preference'){prefs[el.dataset.key]=!prefs[el.dataset.key];savePrefs();ambientAudio();renderOverlays();if(prefs.sound)sound();}
 else if(action==='dev-solve'){if(!state)state=newGame();submitAnswer(state,el.dataset.id,PUZZLES[el.dataset.id].answer);save();renderOverlays();toast('Response marked as solved.');}
 else if(action==='dev-unlock'){state??=newGame();state.phase='play';state.tabletGiven=true;state.noteGiven=true;state.items=['invitation','note','lens'];state.solved=Object.keys(PUZZLES);state.fragments=['quotient','corridor','pantry'];state.room='lobby';state.visited=['lobby','quotient','corridor','pantry'];ui.screen='game';ui.panel=null;save();render();toast('The opening exhibit is complete. Further In is open.');}
});
document.addEventListener('change',event=>{
 if(event.target.id==='room-filter'){ui.filter=event.target.value;ui.puzzle=Object.keys(PUZZLES).find(id=>ui.filter==='all'||PUZZLES[id].room===ui.filter);ui.tab='catalog';ui.feedback=null;renderOverlays();}
});
document.addEventListener('input',event=>{
 if(event.target.id==='notebook'){state.notes=event.target.value;save();return;}
 if(event.target.closest('#answer-form')){const form=event.target.form;ui.drafts[ui.puzzle]=PUZZLES[ui.puzzle].kind==='food'?[...form.querySelectorAll('input')].map(x=>x.value):event.target.value;}
});
document.addEventListener('submit',event=>{
 if(event.target.id!=='answer-form')return;event.preventDefault();
 const form=event.target,id=form.dataset.id;
 const value=PUZZLES[id].kind==='food'?[...form.querySelectorAll('input')].map(x=>x.value):form.elements.answer.value;
 ui.drafts[id]=value;
 const result=submitAnswer(state,id,value);save();
 ui.feedback={ok:result.ok,text:result.ok?'The museum accepts your answer.':'That response does not belong here.'};
 render();
 if(result.ok){sound('success');if(result.fragmentReady&&result.fresh)toast('A drawer opens near the doorway.');else if(id==='way'&&gateOpen(state))toast('A lock turns in the vestibule.');else if(id==='way')toast('Response accepted. The exhibit still has unfinished pieces.');}
});
function beginHold(el){if(holding)return;holdStart=performance.now();el.classList.add('holding');holding=setTimeout(()=>{holding=0;el.classList.remove('holding');panel('dev');},5000);}
function cancelHold(){if(holding){clearTimeout(holding);holding=0;document.querySelector('.dev-gear')?.classList.remove('holding');}}
document.addEventListener('pointerdown',event=>{const el=event.target.closest('[data-action="dev-hold"]');if(el){event.preventDefault();el.setPointerCapture?.(event.pointerId);beginHold(el);}});
document.addEventListener('pointerup',cancelHold);document.addEventListener('pointercancel',cancelHold);window.addEventListener('blur',cancelHold);
document.addEventListener('keydown',event=>{
 if(event.target.closest('[data-action="dev-hold"]')&&(event.key===' '||event.key==='Enter')){event.preventDefault();if(!event.repeat)beginHold(event.target.closest('button'));return;}
 if(event.key==='Escape'){event.preventDefault();if(ui.panel||ui.art||ui.confirm)closeOverlay();else if(ui.screen==='game')panel('pause');return;}
 if(event.key==='Tab'){
  const dlg=[...document.querySelectorAll('[role="dialog"]')].filter(x=>!x.closest('[inert]')).at(-1);if(dlg){const focusable=[...dlg.querySelectorAll('button:not([disabled]),input,select,textarea,summary,a[href]')].filter(x=>x.getClientRects().length);if(focusable.length){const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}}return;
 }
 if(/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)||event.ctrlKey||event.metaKey||event.altKey)return;
 if(ui.screen==='game'&&state.phase==='play'){
  if(event.key.toLowerCase()==='t'){event.preventDefault();if(ui.panel==='tablet')closeOverlay();else openTablet();}
  if(event.key.toLowerCase()==='i'){event.preventDefault();if(ui.panel==='inventory')closeOverlay();else{ui.item=null;panel('inventory');}}
  if(event.key.toLowerCase()==='m'){event.preventDefault();if(ui.panel==='map')closeOverlay();else panel('map');}
 }
});
document.addEventListener('keyup',event=>{if(event.key===' '||event.key==='Enter')cancelHold();});
render();
