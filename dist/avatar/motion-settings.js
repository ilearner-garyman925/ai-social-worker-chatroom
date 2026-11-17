export const SETTING_FIELDS=[
 ['sway','身體擺動幅度',0,1,.05,1],['swaySpeed','擺動速度',.6,1.5,.05,1],
 ['breath','呼吸幅度',0,1,.05,1],['breathSpeed','呼吸速度',.6,1.5,.05,1],
 ['gazeX','左右視線範圍',0,1,.05,1],['gazeY','上下視線範圍',0,1,.05,1],
 ['blinkInterval','眨眼間隔',.5,2,.1,1],['lookInterval','視線移動間隔',.5,2,.1,1],['lookHold','視線停留時間',.5,2,.1,1]
];
export const DEFAULT_SETTINGS=Object.fromEntries(SETTING_FIELDS.map(([id,,,,,v])=>[id,v]));
export function normalizeSettings(raw={}){return Object.fromEntries(SETTING_FIELDS.map(([id,,min,max,,v])=>[id,typeof raw?.[id]==='number'&&Number.isFinite(raw[id])?Math.max(min,Math.min(max,raw[id])):v]));}
export function exportModel(source,settings,enabled=true){
 const s=normalizeSettings(settings),m=structuredClone(source);
 m.meta={...m.meta,'x-character-speaking-lab':{version:1,naturalIdle:enabled,settings:s,scope:'Custom idle timing requires Character Speaking Lab driver. Standard players ignore this extension; model and textures remain native v4.'}};
 // Persist portable rig limits separately from the application-only scheduling.
 m.rig.breath=source.rig.breath*(enabled?s.breath:0);
 for(const l of m.layers)if(l.role?.startsWith('iris_'))l.range=[l.range[0]*(enabled?s.gazeX:0),l.range[1]*(enabled?s.gazeY:0)];
 return m;
}
