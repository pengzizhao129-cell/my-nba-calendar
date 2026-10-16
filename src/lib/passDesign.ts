// Original MyGame+ miniature crests, shared by identity ink and security printing.
// New teams register their own geometry here; never borrow another team's crest.
export const teamSymbolGeometry: Readonly<Record<string, {paths: readonly string[]; dot?: boolean}>> = {
 HOU: {paths:['m7 17 9.5-9.5-2 6-4.5 3.5M8 16l-3.5 2.5M8 16.5 6 20','m15.5 13.5 2-2M8.5 9.5q2-3 5.5-4']},
 LAL: {paths:['M12 6v3m0 6v3m-5.5-6h3m5 0h3M9 9l1.5-1.6L12 8.5l1.5-1.3L15 9'],dot:true},
 GSW: {paths:['M4 15h16M7 15V8m10 7V8M4.5 13Q8 9.5 12 11q4-1.5 7.5 2M9.5 12v3m2.5-2.5V15m2.5-3v3M8 17.5h8']},
 DAL: {paths:['m7 8 2-2 1.5 2 3.5.5 4 2.5-1.5 2 1 2.5-3.5-.5-3 2-2.5-2L7 11M19 10.5l2-.5']},
 DEN: {paths:['m5 15 4.5-7L12 11l3-4.5 5 8.5M10 15l2-1.5 2.5 1.5-2 3M12 13.5l.5 4.5']},
};

/** User-owned identifier, independent of selected team, city and event ordinal. */
export type PassIdentity = {number: string};
/** Issuer-supplied season record; do not infer an ordinal from a partial schedule. */
export type PassCollection = {gameNumber: number; totalGames: number; seasonStart: number};

// Explicit presentation fixtures, not an account ID or an official NBA schedule.
export const DEMO_PASS_IDENTITY: PassIdentity = {number:'0147'};
export const DEMO_PASS_COLLECTION: PassCollection = {gameNumber:1,totalGames:82,seasonStart:2026};

export function formatPassRecord(identity: PassIdentity, collection?: PassCollection) {
 if (!/^\d{4}$/.test(identity.number)) throw new RangeError('Pass number must contain exactly four digits');
 const lines = [`PASS ${identity.number}`];
 if (collection) {
  const {gameNumber,totalGames,seasonStart}=collection;
  if (!Number.isInteger(gameNumber)||!Number.isInteger(totalGames)||gameNumber<1||gameNumber>totalGames||totalGames>99) throw new RangeError('Game ordinal must belong to the supplied season');
  if (!Number.isInteger(seasonStart)||seasonStart<2000||seasonStart>2098) throw new RangeError('Season must be an explicit starting year');
  lines.push(`GAME ${String(gameNumber).padStart(2,'0')} / ${totalGames}`);
  lines.push(`SEASON ${String(seasonStart%100).padStart(2,'0')}–${String((seasonStart+1)%100).padStart(2,'0')}`);
 }
 return lines;
}

/** Sparse crest + fine engraved curves, ~2.6% maximum ink contrast on ivory.
 * Masks keep printing in unused paper, away from date, team names and timing.
 * This is a visual security-print language, not authentication technology.
 */
export function passSecuritySvg(teamId: string, region: 'main'|'stub'='main'): string|null {
 const geometry=Object.hasOwn(teamSymbolGeometry,teamId)?teamSymbolGeometry[teamId]:null;
 if (!geometry) return null;
 const height=region==='main'?480:94;
 const mask=region==='main'
  ? '<rect x="246" y="16" width="236" height="144" fill="white"/><rect x="284" y="172" width="158" height="148" fill="white"/><rect x="306" y="218" width="116" height="62" fill="black"/><rect x="8" y="24" width="14" height="430" fill="white"/><rect x="706" y="24" width="14" height="430" fill="white"/><rect x="608" y="332" width="92" height="80" fill="white"/>'
  : '<rect x="328" y="8" width="366" height="32" fill="white"/>';
 const paths=geometry.paths.map(d=>`<path d="${d}"/>`).join('')+(geometry.dot?'<circle cx="12" cy="12" r=".75" fill="currentColor" stroke="none"/>':'');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="728" height="${height}" viewBox="0 0 728 ${height}" fill="none" color="#686259"><defs><g id="crest" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${paths}</g><pattern id="security" width="160" height="96" patternUnits="userSpaceOnUse"><use href="#crest" x="24" y="20"/><use href="#crest" x="104" y="68"/><g stroke="currentColor" stroke-width=".45" opacity=".65"><path d="M-24 47Q16 29 56 47T136 47T216 47M-24 51Q16 33 56 51T136 51T216 51"/></g></pattern><mask id="clear-ink"><rect width="728" height="${height}" fill="black"/>${mask}</mask></defs><g color="#686259" opacity=".045" mask="url(#clear-ink)"><rect width="728" height="${height}" fill="url(#security)"/></g></svg>`;
}

export function passSecurityUrl(teamId: string, region: 'main'|'stub'='main'): string|null {
 const svg=passSecuritySvg(teamId,region);
 return svg?`data:image/svg+xml,${encodeURIComponent(svg)}`:null;
}
