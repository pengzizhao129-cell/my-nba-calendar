'use client';
import {useEffect,useState} from 'react';
import {DEMO_NOW} from '@/data/mockGames';
/** Demo stays reproducible; the existing real-date mode updates open tickets. */
export function usePassClock(live:boolean) {
 const [clock,setClock]=useState(()=>new Date(DEMO_NOW));
 useEffect(()=>{
  if(!live)return;
  setClock(new Date());
  const timer=window.setInterval(()=>setClock(new Date()),30000);
  return ()=>window.clearInterval(timer);
 },[live]);
 return live?clock:new Date(DEMO_NOW);
}
