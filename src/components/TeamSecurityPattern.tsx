import type {CSSProperties} from 'react';
import {getTeamIdentity,teamMaterialProperties,passSecurityUrl} from '@/lib/passDesign';
export function TeamSecurityPattern({teamId,region='main'}:{teamId:string;region?:'main'|'stub'}) {
 const identity=getTeamIdentity(teamId),url=passSecurityUrl(teamId,region);
 return url&&identity?<span className={`pass-security pass-security-${region}`} aria-hidden="true" data-pass-layer="team-security" data-security-team={teamId} data-security-pattern={identity.securityPattern} data-security-finish="blind" style={{...teamMaterialProperties(identity),'--security-mask':`url("${url}")`} as CSSProperties}/>:null;
}
