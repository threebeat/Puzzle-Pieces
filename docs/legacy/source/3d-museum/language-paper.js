import {canvas} from './art.js';
import {REDACTION_LESSONS,redactionTokens,evaluateRedaction,letterFeedback,LETTER_TILES,evaluateTiles} from './language-data.js';
function base(w,h,color='#fff'){const c=canvas(w,h),x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,w,h);c.hits=[];return[c,x];}
function label(x,text,px,py,size=18,color='#74746e',weight=400,align='center'){x.fillStyle=color;x.font=`${weight} ${size}px Arial`;x.textAlign=align;x.fillText(text,px,py);}
function hit(c,id,label,x,y,w,h){c.hits.push({id,label,x,y,w,h});}
export function redactionCanvas(state,{index=state.redactionLesson,paper=false,limitFlash=false,focus=null}={}){
 const [c,x]=base(1200,900,paper?'#f7f3e8':'#fff'),lesson=REDACTION_LESSONS[index],marks=state.redactionMarks[index],verdict=evaluateRedaction(index,marks);
 label(x,lesson.title.toUpperCase(),600,60,16,'#797974',500);if(!paper)label(x,`${index+1} / ${REDACTION_LESSONS.length}`,1125,60,16);
 const tokens=redactionTokens(index),lineCount=lesson.lines.length,startY=360-(lineCount-1)*48;
 for(let row=0;row<lineCount;row++){const ts=tokens.filter(t=>t.row===row),heavy=lesson.lines[row].heavy;let size=lesson.calibration?58:46,weight=lesson.calibration?700:heavy?900:400;
  x.font=`${weight} ${size}px Arial`;let widths=ts.map(t=>x.measureText(t.text).width),gap=18,total=widths.reduce((a,b)=>a+b,0)+gap*(ts.length-1);if(total>1080){size*=1080/total;x.font=`${weight} ${size}px Arial`;widths=ts.map(t=>x.measureText(t.text).width);total=widths.reduce((a,b)=>a+b,0)+gap*(ts.length-1);}let px=(1200-total)/2,py=startY+row*96;
  ts.forEach((t,i)=>{const w=widths[i];if(marks.includes(t.id)){x.fillStyle='#151515';x.fillRect(px-2,py-size*.78,w+4,size*.88);}else{label(x,t.text,px,py,size,'#111',weight,'left');if(heavy){x.lineWidth=1.1;x.strokeStyle='#111';x.strokeText(t.text,px,py);}}
   hit(c,'word:'+t.id,(marks.includes(t.id)?'Restore ':'Redact ')+t.text,px-6,py-size-8,w+12,size+27);if(focus==='word:'+t.id){x.strokeStyle='#b15531';x.lineWidth=3;x.strokeRect(px-8,py-size-10,w+16,size+31);}px+=w+gap;
  });
 }
 if(verdict.solved){x.strokeStyle='#58745b';x.lineWidth=5;x.strokeRect(12,12,1176,876);label(x,index===5&&!state.securityCertified?'READY FOR INSPECTION':'ALL STATEMENTS HOLD',600,570,20,'#456b4d',700);label(x,'✓',600,530,48,'#456b4d',700);}
 else if(marks.length)label(x,'THE REMAINING STATEMENTS DO NOT ALL HOLD',600,570,17,'#8e7770');
 label(x,`REDACTION LIMIT  ${lesson.limit}     /     ${marks.length} USED`,600,720,22,limitFlash?'#b52e25':'#444',700);
 for(let i=0;i<lesson.limit;i++){x.fillStyle=limitFlash?'#b52e25':i<marks.length?'#151515':'#d8d8d3';x.fillRect(600-(lesson.limit*30-10)/2+i*30,740,20,8);}
 label(x,limitFlash?'LIMIT REACHED · RESTORE A WORD FIRST':'TOUCH A BAR TO RESTORE ITS WORD',600,786,16,limitFlash?'#b52e25':'#81817b');
 if(limitFlash){x.strokeStyle='#b52e25';x.lineWidth=5;x.strokeRect(230,685,740,120);}
 if(!paper&&index>0){label(x,'←',70,850,34,'#555');hit(c,'previous','Previous lesson',25,802,90,70);}
 if(!paper&&index<5&&verdict.solved){label(x,'→',1115,850,48,'#333',700);hit(c,'next','Continue to next lesson',1050,790,120,90);}
 if(!paper&&index===5){label(x,state.securityCertified?'ACCEPTED':'PRINT SHEET',1050,850,20,state.securityCertified?'#456b4d':'#333',700);if(!state.securityCertified)hit(c,'print','Print the final inspection sheet',930,805,250,75);}
 if(paper)label(x,state.securityCertified?'ACCEPTED / NIGHT SERVICE AUTHORISED':'SECURITY / RETURN THIS SHEET TO THE CHECKER',600,850,16,state.securityCertified?'#456b4d':'#666');
 c.description=lesson.lines.map(l=>(l.heavy?'Heavy type: ':'')+l.text).join(' ')+' Redaction limit '+lesson.limit+'. '+(verdict.solved?'All remaining statements hold.':'Not yet accepted.');return c;
}
export function plateCanvas(state,{message='',focus=null}={}){
 const [c,x]=base(1100,1100,'#e9e6db');label(x,'DISPATCH / THE MISSING SURROUND',550,55,24,'#30473c',700);label(x,'FIVE LETTERS · USE THE RACK REGISTER',550,87,15);
 const colors=['#6b746d','#b28b48','#4e7b65'],glyph=['×','○','■'];
 for(let row=0;row<6;row++){const word=state.plateGuesses[row]||'',feedback=word?letterFeedback(word):null;for(let i=0;i<5;i++){const px=285+i*108,py=115+row*80;x.fillStyle=feedback?colors[feedback[i]]:'#d8d6cb';x.fillRect(px,py,96,68);label(x,word[i]||'',px+48,py+43,37,'#fff',700);if(feedback)label(x,glyph[feedback[i]],px+82,py+18,14,'#fff',700);}}
 for(let i=0;i<5;i++){x.fillStyle='#fffdf5';x.fillRect(285+i*108,612,96,74);label(x,state.plateEntry[i]||'',333+i*108,664,43,'#233d33',700);}
 label(x,state.garageWorkshop?'ACCEPTED · WORKSHOP RELEASED':message||'■ HERE    ○ ELSEWHERE    × ABSENT',550,730,20,state.garageWorkshop?'#345f45':'#586054',700);
 ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'].forEach((row,j)=>{const start=(1100-row.length*83)/2;[...row].forEach((ch,i)=>{const px=start+i*83,py=780+j*77;x.fillStyle='#faf8ef';x.fillRect(px,py,73,63);label(x,ch,px+36,py+43,31,'#2b4037',700);hit(c,'key:'+ch,ch,px,py,73,63);});});
 for(const [id,text,px,w]of[['erase','ERASE',30,120],['enter','CHECK',870,200],['clear','NEW PAGE',30,215]]){const py=id==='clear'?1022:937;x.fillStyle='#394f43';x.fillRect(px,py,w,60);label(x,text,px+w/2,py+40,22,'#fff');hit(c,id,text,px,py,w,60);}
 const active=c.hits.find(h=>h.id===focus);if(active){x.strokeStyle='#9c3525';x.lineWidth=5;x.strokeRect(active.x-3,active.y-3,active.w+6,active.h+6);}
 c.description='Dispatch word plate. Use a five-letter word from the fourteen-word rack list. Solid square correct position, ring elsewhere, cross absent. '+(message||'');return c;
}
export function tileCanvas(state,{selected=null,message='',showCheck=false,focus=null}={}){
 const [c,x]=base(1200,1200,'#dfd3b9'),proof=evaluateTiles(state.tileGrid);label(x,'CROSSED STREETS',600,65,32,'#314e3e',700);label(x,'EAST = SOUTH / I · II · III · IV',600,100,18,'#586951');
 const paint=(id,px,py,size,action,emptyLabel)=>{x.fillStyle=id===selected?'#b6863c':id===null?'#c5bca5':'#f4ead4';x.fillRect(px,py,size,size);x.strokeStyle='#9d8c6b';x.lineWidth=2;x.strokeRect(px,py,size,size);if(id!==null)label(x,LETTER_TILES[id],px+size/2,py+size*.7,size*.52,'#263f32',700);hit(c,action,id===null?emptyLabel:LETTER_TILES[id],px,py,size,size);if(focus===action){x.strokeStyle='#a03627';x.lineWidth=5;x.strokeRect(px-3,py-3,size+6,size+6);}};
 for(let i=0;i<16;i++)paint(state.tileGrid[i],350+i%4*125,190+Math.floor(i/4)*125,111,'cell:'+i,`Empty row ${Math.floor(i/4)+1} column ${i%4+1}`);
 label(x,'C',330,214,18);label(x,'N',866,672,18);for(let i=0;i<4;i++){label(x,['I','II','III','IV'][i],405+i*125,167,18);label(x,['I','II','III','IV'][i],315,259+i*125,18);if(showCheck){label(x,proof.rowOK[i]?'✓':'·',888,259+i*125,25,proof.rowOK[i]?'#406344':'#a24332');label(x,proof.colOK[i]?'✓':'·',405+i*125,720,25,proof.colOK[i]?'#406344':'#a24332');}}
 label(x,state.garagePassage?'THE STREETS AGREE · PASSAGE RELEASED':message||'SELECT A LETTER, THEN A PLACE. SELECT AGAIN TO PUT IT DOWN.',600,775,19,state.garagePassage?'#305d40':'#5f6655',700);
 for(let i=0;i<16;i++)if(!state.tileGrid.includes(i))paint(i,100+i%8*127,815+Math.floor(i/8)*110,94,'tile:'+i,'');
 for(const[id,text,px]of[['return','RETURN TILE',90],['reset','EMPTY BOARD',445],['check','TEST SQUARE',800]]){x.fillStyle='#3c5645';x.fillRect(px,1080,310,65);label(x,text,px+155,1123,22,'#f5eedc',700);hit(c,id,text,px,1080,310,65);}
 c.description='Sixteen letter tiles. Four by four grid. Top-left C, bottom-right N. Each row and matching column must be the same allowed word. '+(message||'');return c;
}
