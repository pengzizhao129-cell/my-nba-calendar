'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {PASS_ID_KEY,isPassId,readExistingPassId,issuePassIdentity} from '@/lib/passIdentity';

export const PASS_ISSUANCE_DURATION=800;

export function usePassId() {
 const [passId,setPassId]=useState<string|null>(null);
 const [ready,setReady]=useState(false),[issuance,setIssuance]=useState<string|null>(null);
 const pending=useRef<Promise<void>|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),mounted=useRef(false),sequence=useRef(0);
 useEffect(()=>{
  mounted.current=true;setPassId(readExistingPassId());setReady(true);
  const sync=(event:StorageEvent)=>{if(event.key===PASS_ID_KEY){setPassId(isPassId(event.newValue)?event.newValue:null);setIssuance(null);}};
  window.addEventListener('storage',sync);
  return ()=>{mounted.current=false;window.removeEventListener('storage',sync);if(timer.current)clearTimeout(timer.current);};
 },[]);
 const confirmIdentity=useCallback(()=>{
  if(pending.current)return pending.current;
  setIssuance(null);if(timer.current)clearTimeout(timer.current);
  // Serialize first issuance across tabs where the browser supports origin-scoped locks.
  const operation=(async()=>{try{if(navigator.locks)return await navigator.locks.request('mygame_pass_identity',()=>issuePassIdentity());}catch{/* Some private contexts disallow locks. */}return issuePassIdentity();})();
  const task=operation.then(result=>{
   if(!mounted.current)return;
   setPassId(result.passId);
   if(result.issued){setIssuance(`${result.passId}:${++sequence.current}`);timer.current=setTimeout(()=>{if(mounted.current)setIssuance(null);},PASS_ISSUANCE_DURATION);}
  }).finally(()=>{pending.current=null;});
  pending.current=task;return task;
 },[]);
 return {passId,ready,issuance,confirmIdentity};
}
