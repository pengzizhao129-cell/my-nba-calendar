import type {Game} from '../data/mockGames';
import type {Season, PersonalSeason} from '../data/seasons';
import {getTeamIdentity} from '../data/teamIdentities';
import {completedAt, type PassState} from './passStatus';

export type UserPass = {readonly passId: string | null};
export type GamePassRecord = {
 readonly gameId: string; readonly teamCode: string; readonly gameNumber: number | null;
 readonly seasonId: string; readonly seasonCode: string; readonly passState: PassState; readonly archivedAt: string | null;
};
export type ArchivedPass = GamePassRecord & {readonly passState: 'archived'; readonly archivedAt: string; readonly fixture: Readonly<Game>};
export type SeasonArchive = Readonly<Record<string, ArchivedPass>>;
export type ArchiveStorage = Pick<Storage, 'getItem' | 'setItem'>;
export const CURRENT_SEASON_KEY = 'mygame_current_season';
export const archiveKey = (season: Pick<Season, 'seasonCode'>) => `mygame_archived_games_${season.seasonCode.replace('–', '_')}`;
export const archiveEntryKey = (teamCode: string, gameId: string, seasonId:string) => `${seasonId}:${teamCode}:${gameId}`;
function fixtureSnapshot(source:Game,teamCode:string,seasonId:string,gameNumber:number|null):Game {
 const fixture:Game={id:source.id,home:source.home,away:source.away,startsAt:source.startsAt,venue:source.venue,seasonId,gameNumbers:gameNumber===null?{}:{[teamCode]:gameNumber}};
 if(source.endsAt!==undefined)fixture.endsAt=source.endsAt;
 if(source.finished===true)fixture.finished=true;
 return fixture;
}

/** Invalid/foreign entries never inflate a collection. Unknown ordinals remain unknown. */
export function readSeasonArchive(storage: ArchiveStorage, season: Season): SeasonArchive {
 try {
  const parsed = JSON.parse(storage.getItem(archiveKey(season)) || 'null');
  if (parsed?.version !== 1 || !Array.isArray(parsed.passes)) return {};
  const entries: Record<string, ArchivedPass> = {};
  for (const item of parsed.passes) {
   if (!item || typeof item.gameId !== 'string' || !/^[\w-]{1,100}$/.test(item.gameId) || !getTeamIdentity(item.teamCode)
    || item.seasonId !== season.id || item.seasonCode !== season.seasonCode || item.passState !== 'archived'
    || typeof item.archivedAt !== 'string' || !Number.isFinite(Date.parse(item.archivedAt))
    || (item.gameNumber !== null && (!Number.isInteger(item.gameNumber) || item.gameNumber < 1 || item.gameNumber > season.totalGames))) continue;
   const source=item.fixture;
   if(!source||source.id!==item.gameId||source.seasonId!==season.id||!getTeamIdentity(source.home)||!getTeamIdentity(source.away)||source.home===source.away
    ||(source.home!==item.teamCode&&source.away!==item.teamCode)||typeof source.venue!=='string'||typeof source.startsAt!=='string'||!Number.isFinite(Date.parse(source.startsAt))
    ||(source.endsAt!==undefined&&(typeof source.endsAt!=='string'||!Number.isFinite(Date.parse(source.endsAt))||Date.parse(source.endsAt)<Date.parse(source.startsAt)))
    ||(source.gameNumbers?.[item.teamCode]??null)!==item.gameNumber)continue;
   const fixture=fixtureSnapshot(source,item.teamCode,season.id,item.gameNumber);
   const clean: ArchivedPass = {gameId: item.gameId, teamCode: item.teamCode, gameNumber: item.gameNumber, seasonId: season.id, seasonCode: season.seasonCode, passState: 'archived', archivedAt: item.archivedAt,fixture};
   entries[archiveEntryKey(item.teamCode, item.gameId,season.id)] = clean;
  }
  return entries;
 } catch { return {}; }
}
export function archiveFinishedGames(archive: SeasonArchive, games: readonly Game[], teamCode: string, season: Season, now: Date): SeasonArchive {
 const result = {...archive};
 for (const game of games) {
  if (game.seasonId !== season.id || (game.home !== teamCode && game.away !== teamCode)) continue;
  const key = archiveEntryKey(teamCode, game.id,season.id), ended = completedAt(game, now);
  if (!ended || result[key]) continue;
  const gameNumber = game.gameNumbers?.[teamCode] ?? null;
  if (gameNumber !== null && (!Number.isInteger(gameNumber) || gameNumber < 1 || gameNumber > season.totalGames)) throw new RangeError('Invalid archived game ordinal');
  result[key] = {gameId: game.id, teamCode, gameNumber, seasonId: season.id, seasonCode: season.seasonCode, passState: 'archived', archivedAt: ended,fixture:fixtureSnapshot(game,teamCode,season.id,gameNumber)};
 }
 return result;
}
/** Merge just before writing, preserving other tabs/teams; counts are always derived. */
export function persistSeasonArchive(storage: ArchiveStorage, season: Season, archive: SeasonArchive): SeasonArchive {
 const merged = {...archive, ...readSeasonArchive(storage, season)};
 const value = JSON.stringify({version: 1, passes: Object.values(merged).filter(pass => pass.seasonId === season.id).sort((a, b) => archiveEntryKey(a.teamCode, a.gameId,a.seasonId).localeCompare(archiveEntryKey(b.teamCode, b.gameId,b.seasonId)))});
 if (storage.getItem(archiveKey(season)) !== value) storage.setItem(archiveKey(season), value);
 return merged;
}
export function resolvePersonalSeason(season: Season, teamCode: string, archive: SeasonArchive): PersonalSeason {
 const archivedGameIds = [...new Set(Object.values(archive).filter(pass => pass.teamCode === teamCode && pass.seasonId === season.id).map(pass => pass.gameId))].sort();
 return {seasonId: season.id, seasonCode: season.seasonCode, teamCode, totalGames: season.totalGames, collectedGames: archivedGameIds.length, archivedGameIds};
}
export type SeasonMilestone = 'First Pass' | 'Early Season' | 'Halfway' | 'Season Complete';
/** Archive snapshots survive removal/rollover of the active mock schedule. */
export function seasonFixtures(games:readonly Game[],archive:SeasonArchive,teamCode:string):Game[] {
 const byId=new Map(games.map(game=>[game.id,game]));
 for(const record of Object.values(archive))if(record.teamCode===teamCode)byId.set(record.gameId,{...record.fixture,finished:true});
 return [...byId.values()];
}
export function seasonSummary(user:UserPass,season:Season,teamCode:string,archive:SeasonArchive) {
 const collection=resolvePersonalSeason(season,teamCode,archive);
 return {user,season:collection,milestone:resolveSeasonMilestone(collection.collectedGames,collection.totalGames),passes:Object.values(archive).filter(pass=>pass.seasonId===season.id&&pass.teamCode===teamCode).sort((a,b)=>(a.gameNumber??Infinity)-(b.gameNumber??Infinity)||a.gameId.localeCompare(b.gameId))};
}
/** Data-only extension point: no milestone badges are added to normal passes. */
export function resolveSeasonMilestone(collectedGames: number, totalGames: number): SeasonMilestone | null {
 if (!Number.isInteger(totalGames) || totalGames < 1 || !Number.isInteger(collectedGames) || collectedGames < 0 || collectedGames > totalGames) throw new RangeError('Invalid season progress');
 if (collectedGames === totalGames) return 'Season Complete';
 if (collectedGames >= Math.ceil(totalGames / 2)) return 'Halfway';
 if (collectedGames >= 10) return 'Early Season';
 return collectedGames >= 1 ? 'First Pass' : null;
}
