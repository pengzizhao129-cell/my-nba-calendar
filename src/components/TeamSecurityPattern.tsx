import {getTeamIdentity,passSecurityUrl} from '@/lib/passDesign';
export function TeamSecurityPattern({teamId,region='main'}:{teamId:string;region?:'main'|'stub'}) {
 const identity=getTeamIdentity(teamId),url=passSecurityUrl(teamId,region);
 return url?<span className={`pass-security pass-security-${region}`} aria-hidden="true" data-pass-layer="team-security" data-security-team={teamId} data-security-pattern={identity?.securityPattern} style={{backgroundImage:`url("${url}")`}}/>:null;
}
