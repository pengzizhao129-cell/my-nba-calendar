'use client';
import {useEffect,useState} from 'react';
import {PASS_ID_KEY,isPassId,readOrCreatePassId} from '@/lib/passIdentity';

export function usePassId() {
 const [passId,setPassId]=useState<string|null>(null);
 useEffect(()=>{
  setPassId(readOrCreatePassId());
  // Synchronize a simultaneous first visit in another tab without reissuing IDs.
  const sync=(event:StorageEvent)=>{if(event.key===PASS_ID_KEY&&isPassId(event.newValue))setPassId(event.newValue);};
  window.addEventListener('storage',sync);
  return ()=>window.removeEventListener('storage',sync);
 },[]);
 return passId;
}
