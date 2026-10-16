'use client';
import {useEffect,useRef,useState} from 'react';
import {mockGames} from '@/data/mockGames';
import {DEMO_SEASON,seasons} from '@/data/seasons';
import {archiveFinishedGames,archiveKey,archiveRecordsKey,CURRENT_SEASON_KEY,persistSeasonArchive,readSeasonArchive,type SeasonArchive} from '@/lib/seasonLifecycle';

export function useSeasonArchive(teamCode:string,now:Date,enabled=true) {
 const [archive,setArchive]=useState<SeasonArchive>({});
 const [loadedTeam,setLoadedTeam]=useState<string|null>(null);
 const cache=useRef<Record<string,SeasonArchive>>({});
 const clock=now.getTime();
 useEffect(()=>{
  if(!enabled)return;
  const watchedKeys=new Set(Object.values(seasons).flatMap(season=>[archiveKey(season,teamCode),archiveRecordsKey(season,teamCode)]));
  function synchronize(){
   const previous=cache.current[teamCode]??{};
   let result:SeasonArchive=previous;
   for(const season of Object.values(seasons)){
    try{
     const stored=readSeasonArchive(window.localStorage,season,teamCode,mockGames);
     const updated=archiveFinishedGames({...result,...stored},mockGames,teamCode,season,new Date(clock));
     result={...result,...persistSeasonArchive(window.localStorage,season,teamCode,updated)};
    }catch{result=archiveFinishedGames(result,mockGames,teamCode,season,new Date(clock));}
   }
   try{if(window.localStorage.getItem(CURRENT_SEASON_KEY)!==DEMO_SEASON.seasonCode)window.localStorage.setItem(CURRENT_SEASON_KEY,DEMO_SEASON.seasonCode);}catch{/* Session archive remains usable. */}
   cache.current[teamCode]=result;
   setArchive(previous=>JSON.stringify(previous)===JSON.stringify(result)?previous:result);
   setLoadedTeam(teamCode);
  }
  synchronize();
  const onStorage=(event:StorageEvent)=>{if(!event.key||watchedKeys.has(event.key))synchronize();};
  window.addEventListener('storage',onStorage);
  return ()=>window.removeEventListener('storage',onStorage);
 },[teamCode,clock,enabled]);
 // A team switch never exposes the previous team's in-memory collection during hydration.
 return {archive:loadedTeam===teamCode?archive:{},ready:loadedTeam===teamCode};
}
