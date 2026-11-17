import {normalizeSettings} from './motion-settings.js';
import {blinkOpening} from './upright-blink.js';
const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
// One shared timeline for both native Players; sampling never advances by frame count.
export function createNaturalIdle(random=Math.random){
 const between=(a,b)=>a+(b-a)*Math.max(0,Math.min(1,random()));
 let settings=normalizeSettings();
 let origin=0,last=0,blink,look,breath,sway;
 const newLook=t=>({at:t,x:between(-.65,.65)*settings.gazeX,y:between(-.4,.4)*settings.gazeY,hold:between(.8,1.8)*settings.lookHold});
 function reset(t=0){origin=last=Number.isFinite(t)?t:0;blink=origin+between(2.8,6.2)*settings.blinkInterval;look=newLook(origin+between(3,6)*settings.lookInterval);breath={at:origin,duration:between(4.3,6.2)/settings.breathSpeed,amp:between(.5,.65)*settings.breath};sway={at:origin,duration:between(6.5,9.5)/settings.swaySpeed,amp:between(.1,.1625)*settings.sway};}
 function sample(t){
  t=Number.isFinite(t)?t:last;if(t<last||t-last>2)reset(t);last=t;
  if(t>blink+.3)blink=t+between(2.8,6.2)*settings.blinkInterval;
  if(t>look.at+.65+look.hold+.8)look=newLook(t+between(3,7)*settings.lookInterval);
  if(t>breath.at+breath.duration)breath={at:breath.at+breath.duration,duration:between(4.3,6.2)/settings.breathSpeed,amp:between(.5,.65)*settings.breath};
  if(t>sway.at+sway.duration)sway={at:sway.at+sway.duration,duration:between(6.5,9.5)/settings.swaySpeed,amp:between(.1,.1625)*settings.sway};
  const u=t-look.at,w=u<0?0:u<.65?ease(u/.65):u<.65+look.hold?1:1-ease((u-.65-look.hold)/.8),fade=ease((t-origin)/1.5);
  return {eyeLOpen:t<blink?1:blinkOpening(t-blink),eyeROpen:t<blink?1:blinkOpening(t-blink),eyeBallX:look.x*w,eyeBallY:look.y*w,breath:fade*breath.amp*(1-Math.cos(2*Math.PI*(t-breath.at)/breath.duration))/2,bodyZ:fade*sway.amp*Math.sin(2*Math.PI*(t-sway.at)/sway.duration)};
 }
 reset();return {reset,sample,blinkRemaining(t=last){return Math.max(0,blink-t);},configure(raw,t=last){
  t=Number.isFinite(t)?t:last;
  const oldInterval=settings.blinkInterval,next=normalizeSettings(raw),oldBlink=blink;
  const preserve=t>=last&&t-last<=2;
  settings=next;reset(t);
  // Preserve the current blink or scale its remaining wait, instead of postponing
  // it on every slider input (including unrelated breathing/gaze controls).
  if(preserve)blink=oldBlink<=t?oldBlink:t+(oldBlink-t)*next.blinkInterval/oldInterval;
 }};
}
