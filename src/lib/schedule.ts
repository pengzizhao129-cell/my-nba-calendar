import type { Game } from '@/data/mockGames';
import {nextTeamGameId} from './passStatus';
import { dateKey,dayDistance } from './timezone';
export function getSchedule(games: Game[],team: string,timeZone: string,now: Date,archivedIds:ReadonlySet<string>=new Set()) {
 const todayKey=dateKey(now,timeZone);
 const all=games.filter(g=>g.home===team||g.away===team).sort((a,b)=>Date.parse(a.startsAt)-Date.parse(b.startsAt));
 const today=all.filter(g=>dateKey(new Date(g.startsAt),timeZone)===todayKey);
 // Upcoming seven calendar days includes today and the following six days.
 const week=all.filter(g=>{const d=dayDistance(todayKey,dateKey(new Date(g.startsAt),timeZone));return d>=0&&d<7;});
 const nextId=nextTeamGameId(games,team,now,archivedIds);
 const next=all.find(g=>g.id===nextId);
 return {all,today,week,next,daysUntilNext:next?dayDistance(todayKey,dateKey(new Date(next.startsAt),timeZone)):null};
}
