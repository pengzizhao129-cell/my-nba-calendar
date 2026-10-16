import test from 'node:test';
import assert from 'node:assert/strict';
import {resolvePassPresentation, type PassEventState, type PassPresentationInput} from '../src/lib/passPresentation';
import {resolvePassStatus} from '../src/lib/passStatus';

const game = {id: 'explicit-event', startsAt: '2026-10-25T01:00:00Z'};
const context = {timezone: 'Asia/Tokyo', nextGameId: game.id};
const attention = (now: string): PassPresentationInput => ({status: resolvePassStatus(game, new Date(now), context)});

test('Prestart, local game day and past scheduled tip-off stay ISSUED without explicit event facts', () => {
 const cases = [
  attention('2026-10-20T00:00:00Z'),
  {status: {phase: 'upcoming' as const}},
  attention('2026-10-24T16:00:00Z'),
  attention('2026-10-25T05:00:00Z'),
 ];
 assert.equal(cases[0].status.phase, 'next_up');
 assert.equal(cases[2].status.phase, 'game_day');
 assert.equal(cases[3].status.phase, 'game_day');
 for (const pass of cases) assert.deepEqual(resolvePassPresentation(pass), {
  state: 'issued', label: 'ISSUED', score: null, period: null, clock: null,
 });
});

test('An explicit live feed supplies LIVE and only its provided points, period and clock', () => {
 const pass = attention('2026-10-25T01:30:00Z');
 const feed: PassEventState = {state: 'live', score: {team: 0, opponent: 0}, period: 'Q1', clock: '12:00'};
 assert.deepEqual(resolvePassPresentation(pass, feed), {
  state: 'live', label: 'LIVE', score: {team: 0, opponent: 0}, period: 'Q1', clock: '12:00',
 });
 assert.deepEqual(resolvePassPresentation(pass, {state: 'live'}), {
  state: 'live', label: 'LIVE', score: null, period: null, clock: null,
 });
 assert.deepEqual(feed, {state: 'live', score: {team: 0, opponent: 0}, period: 'Q1', clock: '12:00'}, 'Resolution never mutates feed facts');
});

test('An explicit final feed supplies FINAL without live details; collection remains COLLECTED', () => {
 const feed: PassEventState = {state: 'final', score: {team: 112, opponent: 108}, period: 'Q4', clock: '00:00'};
 const pass = attention('2026-10-25T05:00:00Z');
 assert.deepEqual(resolvePassPresentation(pass, feed), {
  state: 'final', label: 'FINAL', score: {team: 112, opponent: 108}, period: null, clock: null,
 });
 const archived: PassPresentationInput = {status: {phase: 'archived'}};
 assert.deepEqual(resolvePassPresentation(archived, feed), {
  state: 'collected', label: 'COLLECTED', score: {team: 112, opponent: 108}, period: null, clock: null,
 });
 assert.deepEqual(resolvePassPresentation(archived), {
  state: 'collected', label: 'COLLECTED', score: null, period: null, clock: null,
 });
 assert.deepEqual(resolvePassPresentation(archived, {state: 'live', score: {team: 90, opponent: 88}, period: 'Q4', clock: '04:12'}), {
  state: 'collected', label: 'COLLECTED', score: null, period: null, clock: null,
 }, 'A stale live update cannot turn a collected pass into a live scoreboard');
 assert.equal(resolvePassPresentation(pass, {state: 'final'}).score, null, 'Final state never invents a result');
});

test('Unavailable, fractional, negative or nonfinite points never become a displayed score', () => {
 const pass = attention('2026-10-25T01:30:00Z');
 for (const state of ['live', 'final'] as const) {
  for (const score of [
   {team: -1, opponent: 0}, {team: 0, opponent: -1},
   {team: 1.5, opponent: 0}, {team: 0, opponent: 1.5},
   {team: NaN, opponent: 0}, {team: 0, opponent: Infinity},
   {team: '12', opponent: 0}, {team: 0},
  ]) assert.equal(resolvePassPresentation(pass, {state, score} as PassEventState).score, null);
 }
 const live = resolvePassPresentation(pass, {state: 'live', period: '   ', clock: ' 08:45 '});
 assert.equal(live.period, null);
 assert.equal(live.clock, '08:45');
 const unknown = resolvePassPresentation(pass, {state: 'scheduled', score: {team: 0, opponent: 0}} as unknown as PassEventState);
 assert.equal(unknown.state, 'issued');
 assert.equal(unknown.score, null);
});
