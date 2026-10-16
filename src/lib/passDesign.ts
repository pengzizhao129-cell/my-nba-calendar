import {teamSymbolGeometry} from '../data/teamIdentities';
export {teamSymbolGeometry,teamIdentities,getTeamIdentity,teamMaterialProperties,type TeamIdentity} from '../data/teamIdentities';

/** User-owned identifier, independent of selected team, city and event ordinal. */
export type PassIdentity = {number: string};
/** Print separate user, event and season inputs; never infer an ordinal from a list. */
export function formatPassRecord(identity:PassIdentity,game?:{gameNumber:number|null},season?:{totalGames:number;seasonCode:string}) {
 if (!/^\d{4}$/.test(identity.number)) throw new RangeError('Pass number must contain exactly four digits');
 const lines = [`PASS ${identity.number}`];
 if(game||season){
  if(!game||!season)throw new RangeError('Event and season inputs are both required for collection printing');
  const {gameNumber}=game,{totalGames,seasonCode}=season;
  if(!Number.isInteger(totalGames)||totalGames<1||totalGames>99||(gameNumber!==null&&(!Number.isInteger(gameNumber)||gameNumber<1||gameNumber>totalGames)))throw new RangeError('Game ordinal must belong to the supplied season');
  if(!/^\d{2}–\d{2}$/.test(seasonCode)||Number(seasonCode.slice(3))!==Number(seasonCode.slice(0,2))+1)throw new RangeError('Season must be an explicit consecutive-year code');
  lines.push(`GAME ${gameNumber===null?'—':String(gameNumber).padStart(2,'0')} / ${totalGames}`);
  lines.push(`SEASON ${seasonCode}`);
 }
 return lines;
}

/** Alpha-only sparse crest and fine engraved curves. Semantic CSS supplies ink and blind light.
 * Masks keep printing in unused paper, away from date, team names and timing.
 * This is a visual security-print language, not authentication technology.
 */
export function passSecuritySvg(teamId: string, region: 'main'|'stub'='main'): string|null {
 const geometry=Object.hasOwn(teamSymbolGeometry,teamId)?teamSymbolGeometry[teamId]:null;
 if (!geometry) return null;
 const height=region==='main'?480:94;
 const mask=region==='main'
  ? '<rect x="246" y="16" width="236" height="144" fill="white"/><rect x="284" y="172" width="158" height="148" fill="white"/><rect x="306" y="218" width="116" height="62" fill="black"/><rect x="8" y="24" width="14" height="430" fill="white"/><rect x="706" y="24" width="14" height="430" fill="white"/><rect x="608" y="332" width="92" height="80" fill="white"/>'
  : '<rect x="328" y="8" width="192" height="32" fill="white"/>';
 const paths=geometry.paths.map(d=>`<path d="${d}"/>`).join('')+(geometry.dot?'<circle cx="12" cy="12" r=".75" fill="currentColor" stroke="none"/>':'');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="728" height="${height}" viewBox="0 0 728 ${height}" fill="none" color="white"><defs><g id="crest" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${paths}</g><pattern id="security" width="160" height="96" patternUnits="userSpaceOnUse"><use href="#crest" x="24" y="20"/><use href="#crest" x="104" y="68"/><g stroke="currentColor" stroke-width=".45" opacity=".65"><path d="M-24 47Q16 29 56 47T136 47T216 47M-24 51Q16 33 56 51T136 51T216 51"/></g></pattern><mask id="clear-ink"><rect width="728" height="${height}" fill="black"/>${mask}</mask></defs><g mask="url(#clear-ink)"><rect width="728" height="${height}" fill="url(#security)"/></g></svg>`;
}

export function passSecurityUrl(teamId: string, region: 'main'|'stub'='main'): string|null {
 const svg=passSecuritySvg(teamId,region);
 return svg?`data:image/svg+xml,${encodeURIComponent(svg)}`:null;
}
