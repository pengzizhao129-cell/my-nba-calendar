import type {Game} from '@/data/mockGames';
import {seasons,type PersonalSeason} from '@/data/seasons';
import {getTeamIdentity,type TeamIdentity} from './passDesign';
import {dateKey,formatDate} from './timezone';
import {completedAt,nextTeamGameId,resolvePassStatus,type PassStatus} from './passStatus';
import {archiveEntryKey,resolvePersonalSeason,type SeasonArchive,type UserPass,type GamePassRecord} from './seasonLifecycle';
import {resolveCityIdentity,formatTimezoneOffset} from './cityIdentity';

export type PassUser=UserPass;
export type PassGame={readonly id:string;readonly startsAt:string;readonly opponentCode:string;readonly homeAway:'HOME'|'AWAY';readonly venue:string;readonly gameNumber:number|null;readonly seasonId:string;readonly seasonCode:string};
export type PassLocation={readonly city:string;readonly cityId:string;readonly cityName:string;readonly country:string;readonly countryCode:string;readonly cityCode:string;readonly timezone:string;readonly abbreviation:string;readonly localTime:string;readonly dateKey:string;readonly day:string;readonly month:string;readonly weekday:string;readonly weekdayEnglish:string;readonly offset:string};
export type PersonalPass={readonly user:PassUser;readonly team:TeamIdentity;readonly game:PassGame;readonly location:PassLocation;readonly season:PersonalSeason;readonly status:PassStatus};

/** Selection is event state, never a side effect of the viewer's timezone. */
export function selectPassGame(games:readonly Game[],teamCode:string,selectedId:string|null,now:Date,archivedIds:ReadonlySet<string>=new Set()):Game|undefined {
 const participating=games.filter(game=>game.home===teamCode||game.away===teamCode);
 const nextId=nextTeamGameId(participating,teamCode,now,archivedIds);
 return participating.find(game=>game.id===selectedId)??participating.find(game=>game.id===nextId)??participating.filter(game=>!archivedIds.has(game.id)&&!game.final&&!game.finished&&!completedAt(game,now)).sort((a,b)=>Date.parse(b.startsAt)-Date.parse(a.startsAt))[0]??participating.sort((a,b)=>Date.parse(b.startsAt)-Date.parse(a.startsAt))[0];
}

export function resolvePassLocation(startsAt:string,city:string,timezone:string,_now:Date,cityId?:string):PassLocation {
 const identity=resolveCityIdentity({cityId,city,timezone});
 timezone=identity.timezone;
 const instant=new Date(startsAt),english=(options:Intl.DateTimeFormatOptions)=>new Intl.DateTimeFormat('en-US',{timeZone:timezone,...options}).format(instant).toUpperCase();
 // Offset belongs to the event instant, never the browser clock. This matters at DST boundaries.
 const offset=formatTimezoneOffset(instant,timezone);
 const abbreviation=timezone==='Asia/Tokyo'?'JST':new Intl.DateTimeFormat(timezone.startsWith('Europe/')?'en-GB':'en-US',{timeZone:timezone,timeZoneName:'short'}).formatToParts(instant).find(part=>part.type==='timeZoneName')!.value;
 return {city:identity.nameZh,cityId:identity.id,cityName:identity.name,country:identity.country,countryCode:identity.countryCode,cityCode:identity.cityCode,timezone,abbreviation,localTime:formatDate(instant,timezone,{hour:'2-digit',minute:'2-digit',hourCycle:'h23'}),dateKey:dateKey(instant,timezone),day:english({day:'2-digit'}),month:english({month:'short'}),weekday:formatDate(instant,timezone,{weekday:'long'}),weekdayEnglish:english({weekday:'short'}),offset};
}

export function createPersonalPass({passId,teamCode,game,city,timezone,cityId,now,games=[game],archive={}}:{passId:string|null;teamCode:string;game:Game;city:string;timezone:string;cityId?:string;now:Date;games?:readonly Game[];archive?:SeasonArchive}):PersonalPass {
 const selectedCity=resolveCityIdentity({cityId,city,timezone});
 timezone=selectedCity.timezone;cityId=selectedCity.id;
 const identity=getTeamIdentity(teamCode),season=Object.hasOwn(seasons,game.seasonId)?seasons[game.seasonId]:undefined;
 if(!identity||!season||(game.home!==teamCode&&game.away!==teamCode))throw new RangeError('Pass requires a known team, season and participating fixture');
 if(passId!==null&&!/^\d{4}$/.test(passId))throw new RangeError('Invalid user pass ID');
 const gameNumber=game.gameNumbers?.[teamCode]??null;
 if(gameNumber!==null&&(!Number.isInteger(gameNumber)||gameNumber<1||gameNumber>season.totalGames))throw new RangeError('Invalid season game ordinal');
 const home=game.home===teamCode;
 return {
  user:{passId},team:identity,
  game:{id:game.id,startsAt:game.startsAt,opponentCode:home?game.away:game.home,homeAway:home?'HOME':'AWAY',venue:game.venue,gameNumber,seasonId:season.id,seasonCode:season.seasonCode},
  location:resolvePassLocation(game.startsAt,city,timezone,now,cityId),season:resolvePersonalSeason(season,teamCode,archive),
  status:resolvePassStatus(game,now,{timezone,nextGameId:nextTeamGameId(games,teamCode,now,new Set(Object.values(archive).filter(item=>item.teamCode===teamCode).map(item=>item.gameId))),archived:!!archive[archiveEntryKey(teamCode,game.id,season.id)],archivedAt:archive[archiveEntryKey(teamCode,game.id,season.id)]?.archivedAt}),
 };
}

/** Stable snapshot for future MY SEASON / share renderers; never rebuild event data from the current season. */
export function passRecord(pass:PersonalPass):GamePassRecord {
 return {gameId:pass.game.id,teamCode:pass.team.code,gameNumber:pass.game.gameNumber,seasonId:pass.game.seasonId,seasonCode:pass.game.seasonCode,passState:pass.status.phase,archivedAt:pass.status.archivedAt};
}
