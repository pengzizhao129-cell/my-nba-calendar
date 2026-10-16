'use client';
import {useEffect, useRef, useState} from 'react';
import {mockGames} from '@/data/mockGames';
import {DEMO_SEASON, seasons} from '@/data/seasons';
import {archiveFinishedGames, CURRENT_SEASON_KEY, persistSeasonArchive, readSeasonArchive, type SeasonArchive} from '@/lib/seasonLifecycle';

/** Catch up completed fixtures on entry; no collect/save/claim action is required. */
export function useSeasonArchive(teamCode: string, now: Date, enabled=true) {
 const [archive, setArchive] = useState<SeasonArchive>({});
 const [loadedTeam,setLoadedTeam]=useState<string|null>(null);
 const latest=useRef<SeasonArchive>({});
 const clock = now.getTime();
 useEffect(() => {
  if(!enabled)return;
  function synchronize() {
    const previous=latest.current;
    let result: SeasonArchive = previous;
    for (const season of Object.values(seasons)) {
     try {
      const stored = readSeasonArchive(window.localStorage, season);
      const updated = archiveFinishedGames({...result, ...stored}, mockGames, teamCode, season, new Date(clock));
      const local = Object.fromEntries(Object.entries(updated).filter(([, pass]) => pass.seasonId === season.id));
      result = {...result, ...persistSeasonArchive(window.localStorage, season, local)};
     } catch {
      result = archiveFinishedGames(result, mockGames, teamCode, season, new Date(clock));
     }
    }
    try { window.localStorage.setItem(CURRENT_SEASON_KEY, DEMO_SEASON.seasonCode); } catch { /* Session collection works when storage is denied. */ }
    if(JSON.stringify(result)!==JSON.stringify(previous)){latest.current=result;setArchive(result);}
    setLoadedTeam(teamCode);
  }
  synchronize();
  const onStorage = (event: StorageEvent) => { if (!event.key || event.key.startsWith('mygame_archived_games_')) synchronize(); };
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
 }, [teamCode, clock,enabled]);
 return {archive,ready:loadedTeam===teamCode};
}
