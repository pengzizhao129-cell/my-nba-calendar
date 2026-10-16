export const PASS_ID_KEY='mygame_pass_id';
export const isPassId=(value:unknown):value is string=>typeof value==='string'&&/^\d{4}$/.test(value);
type PassStorage=Pick<Storage,'getItem'|'setItem'>;

/** Rejection sampling keeps all 10,000 local four-digit IDs equally likely. */
export function generatePassId(random:(values:Uint32Array)=>Uint32Array=values=>crypto.getRandomValues(values)) {
 const values=new Uint32Array(1),limit=Math.floor(0x100000000/10000)*10000;
 do{random(values);}while(values[0]>=limit);
 return String(values[0]%10000).padStart(4,'0');
}

// Graceful session fallback if a browser denies storage. Never runs during SSR.
let sessionId:string|undefined;
export function readOrCreatePassId(storage:()=>PassStorage=()=>window.localStorage):string {
 try {
  const store=storage(),stored=store.getItem(PASS_ID_KEY);
  if(isPassId(stored)){sessionId=stored;return stored;}
  const id=generatePassId();sessionId=id;store.setItem(PASS_ID_KEY,id);return id;
 }catch{
  sessionId??=generatePassId();return sessionId;
 }
}
