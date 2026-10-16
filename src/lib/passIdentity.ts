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
let storageWriteDenied=false;
export function readExistingPassId(storage:()=>PassStorage=()=>window.localStorage):string|null {
 try {const stored=storage().getItem(PASS_ID_KEY);return isPassId(stored)?stored:storageWriteDenied?sessionId??null:null;}
 catch{return sessionId??null;}
}
export function issuePassIdentity(storage:()=>PassStorage=()=>window.localStorage):{passId:string;issued:boolean} {
 let store:PassStorage;
 try {
  store=storage();const stored=store.getItem(PASS_ID_KEY);
  if(isPassId(stored)){sessionId=stored;storageWriteDenied=false;return {passId:stored,issued:false};}
 }catch{
  if(sessionId)return {passId:sessionId,issued:false};
  sessionId=generatePassId();return {passId:sessionId,issued:true};
 }
 if(storageWriteDenied&&sessionId)return {passId:sessionId,issued:false};
 const passId=generatePassId();sessionId=passId;
 try{store.setItem(PASS_ID_KEY,passId);}catch{storageWriteDenied=true;/* Retain this issued identity for the session. */}
 return {passId,issued:true};
}
/** Explicit issuance helper retained for deterministic promo/export consumers. */
export function readOrCreatePassId(storage:()=>PassStorage=()=>window.localStorage):string {
 return issuePassIdentity(storage).passId;
}
