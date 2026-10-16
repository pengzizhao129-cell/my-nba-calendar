import type {PersonalPass} from './personalPass';

/** A stable local edition number, not a globally unique or authenticated certificate. */
export function ticketIssueNumber(pass:PersonalPass):string|null {
 if(!pass.user.passId)return null;
 const key=[pass.user.passId,pass.team.code,pass.game.seasonId,pass.game.id].join(':');
 let hash=2166136261;
 for(const char of key)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
 return String(hash%1000000).padStart(6,'0');
}
export function locationCoordinate(pass:PersonalPass){
 const city=pass.location.timezone.split('/').pop()!.replaceAll('_',' ').toUpperCase();
 const countries:Record<string,string>={'Asia/Tokyo':'JP','Europe/London':'UK','America/Los_Angeles':'US','America/New_York':'US'};
 return {city,country:countries[pass.location.timezone]??null};
}
