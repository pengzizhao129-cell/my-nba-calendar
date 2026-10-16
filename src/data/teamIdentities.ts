// Original MyGame+ miniature crests, shared by identity ink and security printing.
// New teams register their own geometry here; never borrow another team's crest.
export const teamSymbolGeometry: Readonly<Record<string, {paths: readonly string[]; dot?: boolean}>> = {
 HOU: {paths:['m7 17 9.5-9.5-2 6-4.5 3.5M8 16l-3.5 2.5M8 16.5 6 20','m15.5 13.5 2-2M8.5 9.5q2-3 5.5-4']},
 LAL: {paths:['M12 6v3m0 6v3m-5.5-6h3m5 0h3M9 9l1.5-1.6L12 8.5l1.5-1.3L15 9'],dot:true},
 GSW: {paths:['M4 15h16M7 15V8m10 7V8M4.5 13Q8 9.5 12 11q4-1.5 7.5 2M9.5 12v3m2.5-2.5V15m2.5-3v3M8 17.5h8']},
 DAL: {paths:['m7 8 2-2 1.5 2 3.5.5 4 2.5-1.5 2 1 2.5-3.5-.5-3 2-2.5-2L7 11M19 10.5l2-.5']},
 DEN: {paths:['m5 15 4.5-7L12 11l3-4.5 5 8.5M10 15l2-1.5 2.5 1.5-2 3M12 13.5l.5 4.5']},
 ATL: {paths:['M5 16 12 5l7 11-7-4-7 4M9 18h6']},
 BOS: {paths:['M8 5C3 8 4 16 10 19m6-14c5 3 4 11-2 14M8 12h8m-4-5v12']},
 BKN: {paths:['M6 6h12v10l-6 4-6-4ZM9 10h6m-6 4h6']},
 CHA: {paths:['m4 9 8-4 8 4-8 10-8-10M8 9l4 4 4-4']},
 CHI: {paths:['M4 5v6l4 3 4 5 4-5 4-3V5M8 9l4 3 4-3']},
 CLE: {paths:['M5 18 18 5m-9 0h9v9M5 12v6h6']},
 DET: {paths:['M6 5h12v14H6ZM9 9h6m-6 6h6']},
 IND: {paths:['M7 5v14m4-14h4a4 4 0 0 1 0 8h-4M11 17h7']},
 LAC: {paths:['M5 8h14M5 16h14M8 5v14m8-14v14']},
 MEM: {paths:['M5 7 8 5l4 5 4-5 3 2-2 10-5 3-5-3ZM9 14h6']},
 MIA: {paths:['M10 20c-7-5-4-9 0-12l2-4 1 8 4-4c5 7 0 11-3 12']},
 MIL: {paths:['M5 4v5l4 3m10-8v5l-4 3M8 5v4l4 6 4-6V5m-4 10v5']},
 MIN: {paths:['M4 17 8 6l4 6 4-6 4 11-8 3-8-3M9 16h6']},
 NOP: {paths:['M4 8c2 8 5 8 8 8s6 0 8-8M8 5l4 5 4-5m-4 5v10']},
 NYK: {paths:['m4 7 4 10 4-5 4 5 4-10M8 20h8M12 4v4']},
 OKC: {paths:['m13 4-7 9h6l-1 7 7-10h-6l1-6']},
 ORL: {paths:['m12 4 2 5 6 2-5 3v6l-4-4-6 2 2-6-3-4 6 1Z']},
 PHI: {paths:['M5 8h14M8 5v13m8-13v13M4 20h16M11 11h2']},
 PHX: {paths:['M12 4v3m0 10v3M4 12h3m10 0h3M6 6l2 2m8 8 2 2M6 18l2-2m8-8 2-2M12 9l3 3-3 3-3-3Z']},
 POR: {paths:['m5 17 12-12M8 19 19 8M5 12l7-7m0 14 7-7']},
 SAC: {paths:['m5 8 3 8h8l3-8-5 3-2-6-2 6-5-3M8 20h8']},
 SAS: {paths:['M9 4h6v7l5 5-2 3-6-5-6 5-2-3 5-5ZM12 4v7']},
 TOR: {paths:['M6 19 8 5m3 14 1-15m4 15V6M6 16h11']},
 UTA: {paths:['M7 17V6l11-2v11M7 9l11-2M4 17h3m8-2h3']},
 WAS: {paths:['m5 18 3-12 4 8 4-8 3 12M8 20h8M12 3v3']},
};

export interface TeamIdentity {
 readonly code:string;
 readonly primaryColor:string;
 readonly secondaryTint:string;
 readonly temperatureTint:string;
 readonly securityInk:string;
 readonly symbol:string;
 readonly securityPattern:string;
 readonly temperature:'warm'|'neutral'|'slightly-cool';
 readonly microMark:string;
}

// Team color is identity ink; security printing always uses quiet neutral ink.
const identitySeeds = [
 ['ATL','#c8102e','LIFT','warm'],['BOS','#007a33','ORBIT','neutral'],['BKN','#343434','BOROUGH','neutral'],
 ['CHA','#00788c','FLIGHT','slightly-cool'],['CHI','#ce1141','HORN','warm'],['CLE','#860038','RISE','warm'],
 ['DAL','#00538c','FORWARD','slightly-cool'],['DEN','#244780','SUMMIT','slightly-cool'],['DET','#c8102e','DRIVE','warm'],
 ['GSW','#375a83','SPAN','slightly-cool'],['HOU','#bc3a40','ASCEND','warm'],['IND','#bc8b00','PACE','warm'],
 ['LAC','#c8102e','CROSSING','warm'],['LAL','#625382','PRESTIGE','slightly-cool'],['MEM','#5d76a9','GRIT','slightly-cool'],
 ['MIA','#98002e','HEAT','warm'],['MIL','#00471b','BRANCH','neutral'],['MIN','#236192','NORTH','slightly-cool'],
 ['NOP','#85714d','WING','warm'],['NYK','#e36b21','CROWNLINE','warm'],['OKC','#007ac1','STRIKE','slightly-cool'],
 ['ORL','#0077c0','ORBITAL','slightly-cool'],['PHI','#006bb6','COLUMN','slightly-cool'],['PHX','#b95c22','RADIANT','warm'],
 ['POR','#e03a3e','TRAIL','warm'],['SAC','#5a2d81','REGAL','slightly-cool'],['SAS','#647178','SPUR','neutral'],
 ['TOR','#ce1141','TRACE','warm'],['UTA','#384c95','CADENCE','slightly-cool'],['WAS','#344b71','DISTRICT','slightly-cool'],
] as const;
export const teamIdentities:Readonly<Record<string,TeamIdentity>>=Object.fromEntries(identitySeeds.map(([code,primaryColor,symbol,temperature])=>{
 const channels=primaryColor.slice(1).match(/../g)!.map(hex=>parseInt(hex,16));
 return [code,Object.freeze({code,primaryColor,secondaryTint:`rgba(${channels.join(',')},.025)`,temperatureTint:`rgba(${channels.join(',')},.025)`,securityInk:`rgba(${channels.join(',')},.03)`,symbol,securityPattern:`${code}_${symbol}_PATTERN`,temperature,microMark:symbol})];
}));
export const getTeamIdentity=(code:string):TeamIdentity|undefined=>Object.hasOwn(teamIdentities,code)?teamIdentities[code]:undefined;

/** Only data-layer paint enters a component; components consume named inputs. */
export const teamMaterialProperties=(team:TeamIdentity)=>({
 '--team-accent':team.primaryColor,
 '--team-temperature-tint':team.temperatureTint,
 '--team-security-ink':team.securityInk,
});
