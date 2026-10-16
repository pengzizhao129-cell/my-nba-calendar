/** State changes energy; it never chooses geometry or changes event identity. */
export type PassState = 'upcoming' | 'next_up' | 'game_day' | 'archived';
export type Emotion = 'Upcoming' | 'Next up' | 'Tip-off' | 'Collected';
export type PassEnergy = 'quiet' | 'next' | 'day' | 'approaching' | 'imminent' | 'archival';
export type PassStatus = {
 readonly phase: PassState;
 readonly label: 'UPCOMING' | 'NEXT UP' | 'GAME DAY' | 'COLLECTED';
 readonly emotionMark: Emotion | null;
 readonly energy: PassEnergy;
 readonly archivedAt: string | null;
};
export type StatusInput = {id: string; startsAt: string; endsAt?: string; finished?: boolean};
export type StatusContext = {timezone: string; nextGameId: string | null; archivedAt?: string | null; focused?: boolean};

function eventClock(game: StatusInput, now: Date) {
 const start = Date.parse(game.startsAt), clock = now.getTime(), end = game.endsAt ? Date.parse(game.endsAt) : null;
 if (!Number.isFinite(start) || !Number.isFinite(clock) || (end !== null && (!Number.isFinite(end) || end < start))) throw new RangeError('Invalid event clock');
 return {start, clock, end};
}
export function completedAt(game: StatusInput, now: Date): string | null {
 const {clock, end} = eventClock(game, now);
 return end !== null && clock >= end ? new Date(end).toISOString() : game.finished ? now.toISOString() : null;
}
function localDate(instant: number, timezone: string) {
 return new Intl.DateTimeFormat('en-CA', {timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date(instant));
}
/** NEXT UP is a schedule relation, never a 24/72-hour threshold. */
export function nextTeamGameId(games: readonly StatusInput[], now: Date, archivedIds: ReadonlySet<string> = new Set()): string | null {
 return games.filter(game => !archivedIds.has(game.id) && !completedAt(game, now) && Date.parse(game.startsAt) >= now.getTime())
  .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt) || a.id.localeCompare(b.id))[0]?.id ?? null;
}
export function resolvePassStatus(game: StatusInput, now: Date, context: StatusContext): PassStatus {
 const {start, clock} = eventClock(game, now);
 const today = localDate(clock, context.timezone), gameDate = localDate(start, context.timezone);
 if (context.archivedAt && !Number.isFinite(Date.parse(context.archivedAt))) throw new RangeError('Invalid archive clock');
 const archivedAt = context.archivedAt || completedAt(game, now);
 if (archivedAt) return {phase: 'archived', label: 'COLLECTED', emotionMark: 'Collected', energy: 'archival', archivedAt};
 // An explicitly unfinished, ongoing event remains alive across local midnight.
 if (today === gameDate || clock >= start) {
  const hours = (start - clock) / 3600000;
  return {phase: 'game_day', label: 'GAME DAY', emotionMark: 'Tip-off', energy: hours > 6 ? 'day' : hours >= 3 ? 'approaching' : 'imminent', archivedAt: null};
 }
 if (game.id === context.nextGameId) return {phase: 'next_up', label: 'NEXT UP', emotionMark: 'Next up', energy: 'next', archivedAt: null};
 return {phase: 'upcoming', label: 'UPCOMING', emotionMark: context.focused === false ? null : 'Upcoming', energy: 'quiet', archivedAt: null};
}
