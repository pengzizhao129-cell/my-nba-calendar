import { teams } from './teams';
export interface Game { id: string; home: string; away: string; startsAt: string; venue: string }
// Fixed demonstration clock keeps the prototype suitable for repeatable screenshots.
export const DEMO_NOW = '2026-10-25T00:00:00Z';
const rockets: Game[] = [
 {id:'hou-1',home:'HOU',away:'LAL',startsAt:'2026-10-25T01:00:00Z',venue:'丰田中心'},
 {id:'hou-2',home:'GSW',away:'HOU',startsAt:'2026-10-27T02:00:00Z',venue:'大通中心'},
 {id:'hou-3',home:'HOU',away:'DAL',startsAt:'2026-10-29T00:00:00Z',venue:'丰田中心'},
 {id:'hou-4',home:'DEN',away:'HOU',startsAt:'2026-10-31T01:00:00Z',venue:'波尔球馆'},
 {id:'hou-5',home:'HOU',away:'SAS',startsAt:'2026-11-03T01:00:00Z',venue:'丰田中心'}
];
// Synthetic fixtures for every other team, not an official NBA schedule.
export const mockGames: Game[] = [...rockets,...teams.filter(t=>t.id!=='HOU').flatMap((team,index)=>[1,3,5,9].map((offset,i)=>({id:`${team.id}-${i}`,home:team.id,away:teams.filter(t=>t.id!==team.id&&t.id!=='HOU')[(index+i+5)%28].id,startsAt:new Date(Date.UTC(2026,9,25+offset,0+(index%4),30)).toISOString(),venue:`${team.city}主场球馆`})) )];
