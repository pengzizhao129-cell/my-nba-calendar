import type {Team} from '@/data/teams';

// English display names are presentation only; team selection stays in data/teams.
export const teamEnglishNames:Record<string,string> = {
 ATL:'ATLANTA HAWKS',BOS:'BOSTON CELTICS',BKN:'BROOKLYN NETS',CHA:'CHARLOTTE HORNETS',CHI:'CHICAGO BULLS',CLE:'CLEVELAND CAVALIERS',
 DAL:'DALLAS MAVERICKS',DEN:'DENVER NUGGETS',DET:'DETROIT PISTONS',GSW:'GOLDEN STATE WARRIORS',HOU:'HOUSTON ROCKETS',IND:'INDIANA PACERS',
 LAC:'LOS ANGELES CLIPPERS',LAL:'LOS ANGELES LAKERS',MEM:'MEMPHIS GRIZZLIES',MIA:'MIAMI HEAT',MIL:'MILWAUKEE BUCKS',MIN:'MINNESOTA TIMBERWOLVES',
 NOP:'NEW ORLEANS PELICANS',NYK:'NEW YORK KNICKS',OKC:'OKLAHOMA CITY THUNDER',ORL:'ORLANDO MAGIC',PHI:'PHILADELPHIA 76ERS',PHX:'PHOENIX SUNS',
 POR:'PORTLAND TRAIL BLAZERS',SAC:'SACRAMENTO KINGS',SAS:'SAN ANTONIO SPURS',TOR:'TORONTO RAPTORS',UTA:'UTAH JAZZ',WAS:'WASHINGTON WIZARDS',
};

// Original Game+ geometry, independent of official team marks.
const symbols = {
 HOU: <><path d="m7 17 9.5-9.5-2 6-4.5 3.5M8 16l-3.5 2.5M8 16.5 6 20"/><path d="m15.5 13.5 2-2M8.5 9.5q2-3 5.5-4"/></>,
 LAL: <><path d="M12 6v3m0 6v3m-5.5-6h3m5 0h3M9 9l1.5-1.6L12 8.5l1.5-1.3L15 9"/><circle cx="12" cy="12" r=".75" fill="currentColor" stroke="none"/></>,
 GSW: <><path d="M4 15h16M7 15V8m10 7V8M4.5 13Q8 9.5 12 11q4-1.5 7.5 2M9.5 12v3m2.5-2.5V15m2.5-3v3M8 17.5h8"/></>,
 DAL: <><path d="m7 8 2-2 1.5 2 3.5.5 4 2.5-1.5 2 1 2.5-3.5-.5-3 2-2.5-2L7 11M19 10.5l2-.5"/></>,
 DEN: <><path d="m5 15 4.5-7L12 11l3-4.5 5 8.5M10 15l2-1.5 2.5 1.5-2 3M12 13.5l.5 4.5"/></>,
};

export function TeamSymbol({team,size=16}:{team:Team;size?:number}) {
 const geometry = symbols[team.id as keyof typeof symbols];
 if (!geometry) return null;
 return <svg className="team-symbol" data-team={team.id} aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{color:team.primaryColor}}>{geometry}</svg>;
}

export function TeamIdentityBlock({team}:{team:Team}) {
 return <div className="team-identity" style={{'--identity-color':team.primaryColor} as React.CSSProperties}>
  <TeamSymbol team={team}/>
  <strong style={{color:team.primaryColor}}>{team.abbr}</strong>
  <span>{team.city}{team.name}</span>
 </div>;
}
