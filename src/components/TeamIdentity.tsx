import type {Team} from '@/data/teams';
import {getTeamIdentity,teamMaterialProperties,teamSymbolGeometry} from '@/lib/passDesign';

// English display names are presentation only; team selection stays in data/teams.
export const teamEnglishNames:Record<string,string> = {
 ATL:'ATLANTA HAWKS',BOS:'BOSTON CELTICS',BKN:'BROOKLYN NETS',CHA:'CHARLOTTE HORNETS',CHI:'CHICAGO BULLS',CLE:'CLEVELAND CAVALIERS',
 DAL:'DALLAS MAVERICKS',DEN:'DENVER NUGGETS',DET:'DETROIT PISTONS',GSW:'GOLDEN STATE WARRIORS',HOU:'HOUSTON ROCKETS',IND:'INDIANA PACERS',
 LAC:'LOS ANGELES CLIPPERS',LAL:'LOS ANGELES LAKERS',MEM:'MEMPHIS GRIZZLIES',MIA:'MIAMI HEAT',MIL:'MILWAUKEE BUCKS',MIN:'MINNESOTA TIMBERWOLVES',
 NOP:'NEW ORLEANS PELICANS',NYK:'NEW YORK KNICKS',OKC:'OKLAHOMA CITY THUNDER',ORL:'ORLANDO MAGIC',PHI:'PHILADELPHIA 76ERS',PHX:'PHOENIX SUNS',
 POR:'PORTLAND TRAIL BLAZERS',SAC:'SACRAMENTO KINGS',SAS:'SAN ANTONIO SPURS',TOR:'TORONTO RAPTORS',UTA:'UTAH JAZZ',WAS:'WASHINGTON WIZARDS',
};

export function TeamSymbol({team,size=16}:{team:Team;size?:number}) {
 const geometry = teamSymbolGeometry[team.id];
 if (!geometry) return null;
 return <svg className="team-symbol" data-team={team.id} aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{'--team-accent':team.primaryColor,color:'var(--identity-accent-ink,var(--team-print-ink,var(--team-accent)))'} as React.CSSProperties}>{geometry.paths.map(d=><path key={d} d={d}/>)}{geometry.dot&&<circle cx="12" cy="12" r=".75" fill="currentColor" stroke="none"/>}</svg>;
}

export function TeamIdentityBlock({team}:{team:Team}) {
 const identity=getTeamIdentity(team.id)!;
 return <div className="team-identity" data-identity={identity.symbol} data-temperature={identity.temperature} style={teamMaterialProperties(identity) as React.CSSProperties}>
  <TeamSymbol team={team}/>
  <strong>{team.abbr}</strong>
  <span>{team.city}{team.name}</span>
 </div>;
}
