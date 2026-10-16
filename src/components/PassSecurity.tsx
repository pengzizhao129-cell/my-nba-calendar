import {passSecurityUrl} from '@/lib/passDesign';

export function PassSecurity({teamId,region='main'}:{teamId:string;region?:'main'|'stub'}) {
 const url=passSecurityUrl(teamId,region);
 return url?<span className={`pass-security pass-security-${region}`} aria-hidden="true" data-security-team={teamId} style={{backgroundImage:`url("${url}")`}}/>:null;
}
