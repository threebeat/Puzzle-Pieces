import {SIGNS,paintSign} from '../signage.mjs';
const root=document.querySelector('#sign-samples');
const samples=new Set(['hidden-entrance','cross-entrance','north-wayfinding','gift-door','lift-bank','bronze-caption','north-map','desk-screen']);
let failures=0;
for(const s of SIGNS){const canvas=document.createElement('canvas');canvas.width=s.kind==='map'?768:480;canvas.height=Math.ceil(canvas.width*s.h/s.w);const result=paintSign(canvas.getContext('2d'),s,canvas.width,canvas.height);failures+=result.overflow.length;if(samples.has(s.id)){const figure=document.createElement('figure'),caption=document.createElement('figcaption');canvas.setAttribute('aria-label',s.title.replace('\n',' ')+' — '+s.mount+' mounted sign');caption.textContent=s.id+' · '+s.mount+' mount';figure.append(canvas,caption);root.append(figure);}}
root.dataset.layoutOverflows=String(failures);root.dataset.checkedSigns=String(SIGNS.length);
