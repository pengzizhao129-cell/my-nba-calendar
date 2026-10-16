import type {PersonalPass} from './personalPass';

/** Explicit event facts supplied by a future feed, never inferred from a clock. */
export type PassEventState = {
 readonly state: 'live' | 'final';
 readonly score?: {readonly team: number; readonly opponent: number};
 readonly period?: string;
 readonly clock?: string;
};

export type PassPresentation = {
 readonly state: 'issued' | 'live' | 'final' | 'collected';
 readonly label: 'ISSUED' | 'LIVE' | 'FINAL' | 'COLLECTED';
 readonly score: {readonly team: number; readonly opponent: number} | null;
 readonly period: string | null;
 readonly clock: string | null;
};

/** Only the attention phase is needed; event, location and user identity stay separate. */
export type PassPresentationInput = {readonly status: Pick<PersonalPass['status'], 'phase'>};

function validScore(score: PassEventState['score']): PassPresentation['score'] {
 if (!score || !Number.isFinite(score.team) || !Number.isInteger(score.team) || score.team < 0
  || !Number.isFinite(score.opponent) || !Number.isInteger(score.opponent) || score.opponent < 0) return null;
 return {team: score.team, opponent: score.opponent};
}

function liveDetail(value: unknown): string | null {
 return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/**
 * Attention phases describe proximity and energy. Only an explicit event feed
 * can say LIVE or FINAL; scheduled tip-off and GAME DAY cannot establish either.
 */
export function resolvePassPresentation(pass: PassPresentationInput, event?: PassEventState): PassPresentation {
 const archived = pass.status.phase === 'archived';
 const explicitEvent = event?.state === 'live' || event?.state === 'final' ? event : undefined;
 const state = archived ? 'collected' : explicitEvent?.state ?? 'issued';
 const labels = {issued: 'ISSUED', live: 'LIVE', final: 'FINAL', collected: 'COLLECTED'} as const;
 // A stale live update cannot supply final points for an already collected pass.
 const score = explicitEvent && (state === 'live' || explicitEvent.state === 'final') ? validScore(explicitEvent.score) : null;
 return {
  state, label: labels[state], score,
  period: state === 'live' ? liveDetail(explicitEvent?.period) : null,
  clock: state === 'live' ? liveDetail(explicitEvent?.clock) : null,
 };
}
