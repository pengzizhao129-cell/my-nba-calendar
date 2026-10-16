import {isPassId} from './passIdentity';
import type {PersonalPass} from './personalPass';
import {resolveSeasonMilestone} from './seasonMilestones';
import {locationCoordinate} from './ticketIdentity';

export type PassShareMoment='upcoming'|'next_up'|'game_day'|'collected'|'milestone'|'season_complete';
export type PassShareFormat='feed'|'story';
/** Export canvases have separate compositions while retaining the same Pass drawing. */
export const PASS_SHARE_FORMATS=Object.freeze({
 feed:Object.freeze({width:1080,height:1440}),
 story:Object.freeze({width:1080,height:1920}),
});
/** Snapshot-only presentation: no clock, fixture lookup or alternative share data. */
export function passShareContext(pass:PersonalPass,requested?:PassShareMoment){
 const {season,game,status}=pass;
 if(!isPassId(pass.user.passId))throw new RangeError('Sharing requires an issued Pass identity');
 if(season.teamCode!==pass.team.code||season.seasonId!==game.seasonId||season.seasonCode!==game.seasonCode
  ||new Set(season.archivedGameIds).size!==season.archivedGameIds.length||season.collectedGames!==season.archivedGameIds.length)throw new RangeError('Inconsistent personal season snapshot');
 const milestone=resolveSeasonMilestone({gameNumber:game.gameNumber,collectedGames:season.collectedGames,totalGames:season.totalGames});
 const moment=requested??(status.phase==='archived'?'collected':status.phase);
 if((moment==='collected'&&status.phase!=='archived')||(moment==='game_day'&&status.phase!=='game_day')
  ||(moment==='next_up'&&status.phase!=='next_up')||(moment==='upcoming'&&status.phase!=='upcoming')
  ||(moment==='milestone'&&!milestone)||(moment==='season_complete'&&(status.phase!=='archived'||season.collectedGames!==season.totalGames)))throw new RangeError('Share moment must be supported by the Pass lifecycle');
 const label=moment==='season_complete'?'SEASON COMPLETE':moment==='milestone'?milestone!.toUpperCase():status.label;
 const {city,country}=locationCoordinate(pass);
 const location=pass.location as PersonalPass['location']&{readonly abbreviation?:string};
 const artifactLabel=moment==='milestone'||moment==='season_complete'||status.phase==='archived'?label:'ISSUED';
 return {moment,label,artifactLabel,city,location:country?`${city} · ${country}`:city,
  localTime:[...new Set(['LOCAL '+location.localTime,location.abbreviation,location.offset].filter(Boolean))].join(' / '),
  season:`SEASON ${season.seasonCode}`,progress:`${String(season.collectedGames).padStart(2,'0')} / ${season.totalGames} COLLECTED`};
}
