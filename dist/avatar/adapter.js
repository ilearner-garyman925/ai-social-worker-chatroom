import {Player} from '../vendor/livliv/index.js';
import {createNaturalIdle} from './upright-idle.js';
let player,observer,generation=0,talking=false,boundaryAt=0;
const now=()=>performance.now()/1000;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
export function setTalking(value){talking=value;if(!value)boundaryAt=0;}
export function word(){boundaryAt=now();}
export function dispose(){generation++;observer?.disconnect();observer=null;player?.dispose();player=null;talking=false;}
export async function mount(canvas){
 dispose();const ticket=generation;
 const idle=createNaturalIdle();idle.reset(now());
 const p=new Player(canvas,{idle:false,followPointer:false,autoplay:false,maxPixelRatio:2});player=p;
 p.use({order:30,update({params}){
  const t=now();Object.assign(params,idle.sample(t));
  if(reduced.matches){params.breath=0;params.bodyZ=0;params.eyeBallX=0;params.eyeBallY=0;}
  for(const k of ['angleX','angleY','angleZ','browLY','browRY','bodyX','smile'])params[k]=0;
  // Browser TTS exposes timing events, not audio samples: illustrative speaking motion.
  const pulse=.5+.5*Math.sin(t*23);
  params.mouthOpen=talking?Math.max(.05,(.15+.65*pulse)*(t-boundaryAt<.18?1:.8)):0;
  params.vowel=talking?Math.sin(t*8)*.85:0;
 }});
 try{
  await p.load('./assets/girl/girl.livliv');
  if(ticket!==generation)return;
  const frame=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;const s=h/760;Object.assign(p.view,{head:false,zoom:s/Math.min(w/1025,h/1535),x:(1025/2-507)*s/w,y:(345-1535/2)*s/h});p.resize();};
  observer=new ResizeObserver(frame);observer.observe(canvas);frame();p.play();canvas.parentElement.classList.add('avatar-ready');
 }catch(error){if(ticket===generation){p.dispose();player=null;canvas.parentElement.classList.add('avatar-failed');console.error('Avatar load failed',error);}}
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)player?.pause();else player?.play();});
window.addEventListener('pagehide',dispose);
