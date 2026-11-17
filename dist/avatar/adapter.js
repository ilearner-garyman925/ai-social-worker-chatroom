import {Player} from '../vendor/livliv/index.js';
import {startLipSync} from '../vendor/livliv/voice.js';
let player,observer,generation=0,talking=false,audio=null,sync=null,clips={};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
export function setTalking(value){talking=value;}
export function word(){} // Browser TTS has no audio samples; never fake mouth motion.
export function stopVoice(){if(audio){audio.onplaying=audio.onended=audio.onerror=null;audio.pause();audio.currentTime=0;}talking=false;}
export function dispose(){generation++;stopVoice();sync?.stop();sync=null;observer?.disconnect();observer=null;player?.dispose();player=null;audio=null;}
export function hasClip(text){return Boolean(clips[text]&&audio&&sync);}
export async function playVoice(text,callbacks){
 if(!hasClip(text))throw new Error('No recorded reply');
 stopVoice();const current=audio;
 current.onplaying=()=>{talking=true;callbacks.start();};
 current.onended=()=>{talking=false;callbacks.end();};
 current.onerror=()=>{talking=false;callbacks.error();};
 current.src=clips[text];
 await current.play();
}
export async function mount(canvas,model='girl'){
 dispose();const ticket=generation;

 const p=new Player(canvas,{idle:!reduced.matches,followPointer:false,autoplay:false,maxPixelRatio:2});player=p;
 const settled={};
 p.use({order:30,update({params,dt}){
  // Retain official idle targets, with slower settling for calm body and gaze transitions.
  for(const k of ['angleX','angleY','angleZ','bodyX','bodyZ'])params[k]*=reduced.matches?0:.35;
  if(reduced.matches){params.breath=0;params.eyeBallX=0;params.eyeBallY=0;}
  for(const k of ['angleX','angleY','angleZ','bodyX','bodyZ','breath','eyeBallX','eyeBallY']){
   const target=params[k];
   const duration=k==='breath'?1.2:k.startsWith('eyeBall')?.65:.9;
   const blend=1-Math.exp(-Math.min(.1,Math.max(0,dt||1/60))/duration);
   settled[k]=reduced.matches?target:(settled[k]??target)+(target-(settled[k]??target))*blend;
   params[k]=settled[k];
  }
  if(!talking){params.mouthOpen=0;params.vowel=0;}
 }});
 try{
  await p.load(`./assets/${model}/model.json`);
  if(ticket!==generation)return;
  const frame=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;const mw=model==='woman'?1024:1025,cx=model==='woman'?509:507;const s=Math.min(h/560,w/600);Object.assign(p.view,{head:false,zoom:s/Math.min(w/mw,h/1535),x:(mw/2-cx)*s/w,y:(250-1535/2)*s/h});p.resize();};
  clips=await fetch('./assets/voice/clips.json').then(r=>{if(!r.ok)throw new Error('Voice manifest unavailable');return r.json();});
  if(ticket!==generation)return;
  const element=new Audio();element.preload='auto';audio=element;
  const handle=await startLipSync(p,element,{motion:reduced.matches?0:.35,bounce:false});
  if(ticket!==generation){handle.stop();return;}sync=handle;
  observer=new ResizeObserver(frame);observer.observe(canvas);frame();p.play();canvas.parentElement.classList.add('avatar-ready');
 }catch(error){if(ticket===generation){p.dispose();player=null;canvas.parentElement.classList.add('avatar-failed');console.error('Avatar load failed',error);}}
}
reduced.addEventListener('change',()=>{if(player)player.idle=!reduced.matches;});
document.addEventListener('visibilitychange',()=>{if(document.hidden)player?.pause();else player?.play();});
window.addEventListener('pagehide',dispose);
