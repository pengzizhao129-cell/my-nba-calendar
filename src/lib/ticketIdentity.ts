import type {PersonalPass} from './personalPass';
import {resolvePassReference} from './passReference';

/** A stable local edition number, not a globally unique or authenticated certificate. */
export function ticketIssueNumber(pass:PersonalPass):string|null {
 if(!pass.user.passId)return null;
 const key=[pass.user.passId,pass.team.code,pass.game.seasonId,pass.game.id].join(':');
 let hash=2166136261;
 for(const char of key)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
 return String(hash%1000000).padStart(6,'0');
}
export function locationCoordinate(pass:PersonalPass){
 // Public country typography may use UK; the authoritative Reference keeps ISO GB.
 return {city:pass.location.cityName,country:pass.location.countryCode==='GB'?'UK':pass.location.countryCode};
}
export function personalPassReference(pass:PersonalPass){
 return resolvePassReference({passId:pass.user.passId,teamCode:pass.team.code,opponentCode:pass.game.opponentCode,gameId:pass.game.id,gameNumber:pass.game.gameNumber,seasonCode:pass.game.seasonCode,seasonId:pass.game.seasonId,countryCode:pass.location.countryCode,cityCode:pass.location.cityCode});
}
