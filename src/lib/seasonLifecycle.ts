import type {Game} from '../data/mockGames';
import type {Season, PersonalSeason} from '../data/seasons';
import {getTeamIdentity} from '../data/teamIdentities';
import {resolveGameCompletion} from './gameCompletion';
import {completedAt, type PassState} from './passStatus';
import {resolveSeasonMilestone} from './seasonMilestones';
export {resolveSeasonMilestone,type SeasonMilestone} from './seasonMilestones';

export type UserPass = {readonly passId:string|null};
export type GamePassRecord = {
 readonly gameId:string;readonly teamCode:string;readonly gameNumber:number|null;
 readonly seasonId:string;readonly seasonCode:string;readonly passState:PassState;readonly archivedAt:string|null;
};
export type ArchivedPass = GamePassRecord & {readonly passState:'archived';readonly fixture?:Readonly<Game>};
export type SeasonArchive = Readonly<Record<string,ArchivedPass>>;
export type ArchiveStorage = Pick<Storage,'getItem'|'setItem'>;
export const CURRENT_SEASON_KEY = 'mygame_current_season';
export function archiveKey(season:Pick<Season,'seasonCode'>,teamCode:string) {
 if(!getTeamIdentity(teamCode)||!/^\d{2}[–-]\d{2}$/.test(season.seasonCode))throw new RangeError('Invalid archive scope');
 return `mygame_archived_games:${teamCode}:${season.seasonCode.replace('–','-')}`;
}
export const archiveRecordsKey = (season:Pick<Season,'seasonCode'>,teamCode:string) => archiveKey(season,teamCode).replace('mygame_archived_games:','mygame_pass_records:');
export const legacyArchiveKey = (season:Pick<Season,'seasonCode'>) => `mygame_archived_games_${season.seasonCode.replace('–','_')}`;
export const archiveEntryKey = (teamCode:string,gameId:string,seasonId:string) => `${seasonId}:${teamCode}:${gameId}`;
const validGameId=(value:unknown):value is string=>typeof value==='string'&&/^[\w-]{1,100}$/.test(value);
const parse=(raw:string|null):unknown=>{try{return JSON.parse(raw??'null');}catch{return null;}};
function fixtureSnapshot(source:Game,teamCode:string,seasonId:string,gameNumber:number|null):Game {
 const fixture:Game={id:source.id,home:source.home,away:source.away,startsAt:source.startsAt,venue:source.venue,seasonId,gameNumbers:gameNumber===null?{}:{[teamCode]:gameNumber}};
 for(const key of ['endTime','estimatedEndTime','endsAt','final','finished'] as const)if(source[key]!==undefined)Object.assign(fixture,{[key]:source[key]});
 return fixture;
}
function decodeRecord(value:unknown,season:Season,teamCode:string):ArchivedPass|null {
 if(!value||typeof value!=='object')return null;
 const item=value as Record<string,unknown>;
 if(!validGameId(item.gameId)||item.teamCode!==teamCode||item.seasonId!==season.id||item.seasonCode!==season.seasonCode||item.passState!=='archived'
  ||(item.archivedAt!==null&&(typeof item.archivedAt!=='string'||!Number.isFinite(Date.parse(item.archivedAt))))
  ||(item.gameNumber!==null&&(!Number.isInteger(item.gameNumber)||Number(item.gameNumber)<1||Number(item.gameNumber)>season.totalGames)))return null;
 let fixture:Game|undefined;
 if(item.fixture!==undefined){
  if(!item.fixture||typeof item.fixture!=='object')return null;
  const source=item.fixture as Game;
  if(source.id!==item.gameId||source.seasonId!==season.id||!getTeamIdentity(source.home)||!getTeamIdentity(source.away)||source.home===source.away
   ||(source.home!==teamCode&&source.away!==teamCode)||typeof source.venue!=='string'||typeof source.startsAt!=='string'
   ||(source.gameNumbers?.[teamCode]??null)!==item.gameNumber)return null;
  try{resolveGameCompletion(source,new Date(source.startsAt));}catch{return null;}
  fixture=fixtureSnapshot(source,teamCode,season.id,item.gameNumber as number|null);
 }
 return {gameId:item.gameId,teamCode,gameNumber:item.gameNumber as number|null,seasonId:season.id,seasonCode:season.seasonCode,passState:'archived',archivedAt:item.archivedAt as string|null,...(fixture?{fixture}:{})};
}
function recordsFrom(value:unknown,season:Season,teamCode:string):SeasonArchive {
 if(!value||typeof value!=='object')return {};
 const envelope=value as {version?:unknown;passes?:unknown};
 if(envelope.version!==1||!Array.isArray(envelope.passes))return {};
 const records:Record<string,ArchivedPass>={};
 for(const candidate of envelope.passes){const record=decodeRecord(candidate,season,teamCode);if(record)records[archiveEntryKey(teamCode,record.gameId,season.id)]=record;}
 return records;
}
/** IDs are authoritative. Losing optional snapshot metadata must not uncollect a pass. */
export function readSeasonArchive(storage:ArchiveStorage,season:Season,teamCode:string,games:readonly Game[]=[]):SeasonArchive {
 try{
  const raw=storage.getItem(archiveKey(season,teamCode));
  // Import only this team's records from V2.4's shared file; never delete that old file.
  if(raw===null)return recordsFrom(parse(storage.getItem(legacyArchiveKey(season))),season,teamCode);
  const ids=parse(raw);if(!Array.isArray(ids))return {};
  const records=recordsFrom(parse(storage.getItem(archiveRecordsKey(season,teamCode))),season,teamCode);
  const result:Record<string,ArchivedPass>={};
  for(const id of new Set(ids.filter(validGameId))){
   const key=archiveEntryKey(teamCode,id,season.id),record=records[key];
   const game=games.find(game=>game.id===id&&game.seasonId===season.id&&(game.home===teamCode||game.away===teamCode));
   const ordinal=game?.gameNumbers?.[teamCode]??null;
   result[key]=record??{gameId:id,teamCode,gameNumber:ordinal,seasonId:season.id,seasonCode:season.seasonCode,passState:'archived',archivedAt:null,...(game?{fixture:fixtureSnapshot(game,teamCode,season.id,ordinal)}:{})};
  }
  return result;
 }catch{return {};}
}
export function archiveFinishedGames(archive:SeasonArchive,games:readonly Game[],teamCode:string,season:Season,now:Date):SeasonArchive {
 const result={...archive};
 for(const game of games){
  if(game.seasonId!==season.id||(game.home!==teamCode&&game.away!==teamCode))continue;
  const key=archiveEntryKey(teamCode,game.id,season.id),ended=completedAt(game,now);
  if(!ended||result[key])continue;
  const gameNumber=game.gameNumbers?.[teamCode]??null;
  if(gameNumber!==null&&(!Number.isInteger(gameNumber)||gameNumber<1||gameNumber>season.totalGames))throw new RangeError('Invalid archived game ordinal');
  result[key]={gameId:game.id,teamCode,gameNumber,seasonId:season.id,seasonCode:season.seasonCode,passState:'archived',archivedAt:ended,fixture:fixtureSnapshot(game,teamCode,season.id,gameNumber)};
 }
 return result;
}
/** Only this team/season is read or written. Count = unique IDs, never a stored counter. */
export function persistSeasonArchive(storage:ArchiveStorage,season:Season,teamCode:string,archive:SeasonArchive):SeasonArchive {
 const current=Object.fromEntries(Object.entries(archive).filter(([,pass])=>pass.teamCode===teamCode&&pass.seasonId===season.id));
 const stored=readSeasonArchive(storage,season,teamCode),merged={...current,...stored};
 for(const [key,record] of Object.entries(current))if(record.fixture&&!stored[key]?.fixture)merged[key]=record;
 const passes=Object.values(merged).sort((a,b)=>a.gameId.localeCompare(b.gameId));
 const write=(key:string,value:string)=>{if(storage.getItem(key)!==value)storage.setItem(key,value);};
 write(archiveRecordsKey(season,teamCode),JSON.stringify({version:1,passes}));
 write(archiveKey(season,teamCode),JSON.stringify([...new Set(passes.map(pass=>pass.gameId))]));
 return merged;
}
export function resolvePersonalSeason(season:Season,teamCode:string,archive:SeasonArchive):PersonalSeason {
 const archivedGameIds=[...new Set(Object.values(archive).filter(pass=>pass.teamCode===teamCode&&pass.seasonId===season.id).map(pass=>pass.gameId))].sort();
 return {seasonId:season.id,seasonCode:season.seasonCode,teamCode,totalGames:season.totalGames,collectedGames:archivedGameIds.length,archivedGameIds};
}
export function seasonFixtures(games:readonly Game[],archive:SeasonArchive,teamCode:string):Game[] {
 const byId=new Map(games.map(game=>[game.id,game]));
 for(const record of Object.values(archive))if(record.teamCode===teamCode){const fixture=record.fixture??byId.get(record.gameId);if(fixture)byId.set(record.gameId,{...fixture,final:true});}
 return [...byId.values()];
}
export function seasonSummary(user:UserPass,season:Season,teamCode:string,archive:SeasonArchive) {
 const collection=resolvePersonalSeason(season,teamCode,archive);
 return {user,season:collection,milestone:resolveSeasonMilestone(collection.collectedGames,collection.totalGames),passes:Object.values(archive).filter(pass=>pass.seasonId===season.id&&pass.teamCode===teamCode).sort((a,b)=>(a.gameNumber??Infinity)-(b.gameNumber??Infinity)||a.gameId.localeCompare(b.gameId))};
}
