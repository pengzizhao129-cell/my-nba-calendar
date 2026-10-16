import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {GamePass} from '../src/components/GamePass';
import {mockGames, DEMO_NOW, type Game} from '../src/data/mockGames';
import {createPersonalPass, resolvePassLocation, selectPassGame} from '../src/lib/personalPass';
import {nextTeamGameId} from '../src/lib/passStatus';
import {personalPassReference} from '../src/lib/ticketIdentity';
import {resolvePassPresentation, type PassEventState} from '../src/lib/passPresentation';

const input = {
 passId: '0843', teamCode: 'HOU', game: mockGames[0], games: mockGames,
 city: '东京', cityId: 'tokyo', timezone: 'Asia/Tokyo', now: new Date(DEMO_NOW),
};
const resultText = (html: string) => /<span class="match-result"[^>]*>(.*?)<\/span>/.exec(html)?.[1];

test('An explicit city ID supplies one canonical timezone for local time and attention status', () => {
 const now = new Date('2026-10-24T16:00:00Z');
 const contradictory = createPersonalPass({...input, cityId: 'kobe', city: '伦敦', timezone: 'Europe/London', now});
 const canonical = createPersonalPass({...input, cityId: 'kobe', city: '神户', timezone: 'Asia/Tokyo', now});
 const london = createPersonalPass({...input, cityId: 'london', city: '伦敦', timezone: 'Europe/London', now});
 assert.deepEqual(contradictory, canonical);
 assert.equal(contradictory.location.cityId, 'kobe');
 assert.equal(contradictory.location.timezone, 'Asia/Tokyo');
 assert.equal(contradictory.location.localTime, '10:00');
 assert.equal(contradictory.location.dateKey, '2026-10-25');
 assert.equal(contradictory.location.offset, 'GMT+9');
 assert.equal(contradictory.status.phase, 'game_day');
 assert.equal(london.status.phase, 'next_up', 'The opposing IANA calendar is still on the previous local date');
 assert.deepEqual(resolvePassLocation(input.game.startsAt, '伦敦', 'Europe/London', now, 'kobe'), canonical.location);
});

test('Tokyo and Kobe share event time while retaining distinct city references and the same issued event identity', () => {
 const tokyo = createPersonalPass(input);
 const kobe = createPersonalPass({...input, city: '神户', cityId: 'kobe'});
 for (const field of ['user', 'team', 'game', 'season', 'status'] as const) assert.deepEqual(kobe[field], tokyo[field]);
 for (const field of ['timezone', 'localTime', 'dateKey', 'offset', 'abbreviation'] as const) assert.equal(kobe.location[field], tokyo.location[field]);
 assert.notEqual(kobe.location.cityId, tokyo.location.cityId);
 const tokyoReference = personalPassReference(tokyo)!;
 const kobeReference = personalPassReference(kobe)!;
 assert.equal(kobeReference.serial, tokyoReference.serial);
 assert.equal(kobeReference.short, tokyoReference.short);
 assert.equal(kobeReference.full, tokyoReference.full.replace('JPTYO', 'JPKOB'));
 assert.equal(kobeReference.coordinate, 'KOB / JP');
});

test('Server-rendered references use authored city metadata and the actual fixture ordinal', () => {
 const pass = createPersonalPass({...input, city: '神户', cityId: 'kobe'});
 const reference = personalPassReference(pass)!;
 const html = renderToStaticMarkup(createElement(GamePass, {pass}));
 assert.equal(reference.full, `MG26-HOU-LAL-001-JPKOB-${reference.serial}`);
 assert.ok(html.includes(`data-reference="${reference.full}"`));
 assert.ok(html.includes(`aria-label="Reference ${reference.full}"`));
 assert.ok(html.includes('class="reference-short">HOU-LAL.001</span>'));
 assert.ok(html.includes('class="reference-coordinate">KOB / JP</span>'));
 assert.ok(html.includes(`class="reference-serial">№ ${reference.serial}</span>`));
 assert.ok(html.includes('KOBE') && html.includes('神户 · GMT+9'));
 assert.ok(html.includes('data-city-id="kobe"') && html.includes('data-timezone="Asia/Tokyo"'));
 assert.doesNotMatch(html, /WATCHED FROM/, 'A current city selection does not claim a past viewing record');
});

test('Default Home selection follows the future eligible fixture and keeps explicit archived details accessible', () => {
 const now = new Date('2026-10-26T00:00:00Z');
 const stale: Game = {...mockGames[0], id: 'stale-no-final', estimatedEndTime: undefined};
 const first = mockGames[1], later = mockGames[2];
 const foreign: Game = {...first, id: 'foreign-before-next', home: 'BOS', away: 'LAL', startsAt: '2026-10-26T01:00:00Z'};
 const games = [later, foreign, stale, first];
 assert.equal(selectPassGame(games, 'HOU', null, now)?.id, first.id);
 assert.equal(selectPassGame(games, 'HOU', null, now)?.id, nextTeamGameId(games, 'HOU', now));
 const archivedIds = new Set([first.id]);
 assert.equal(selectPassGame(games, 'HOU', null, now, archivedIds)?.id, later.id);
 assert.equal(selectPassGame(games, 'HOU', first.id, now, archivedIds)?.id, first.id,
  'Archiving cannot make an intentionally selected historical object inaccessible');
 assert.equal(selectPassGame(games, 'HOU', stale.id, now, archivedIds)?.id, stale.id,
  'A user can inspect an older unfinished fixture without changing default Home eligibility');
});

test('An unissued server-rendered pass remains a preview without accessible issuance claims or a reference', () => {
 const pass = createPersonalPass({...input, passId: null});
 const html = renderToStaticMarkup(createElement(GamePass, {pass}));
 assert.ok(html.includes('data-lifecycle="preview"'));
 assert.match(html, /aria-label="[^"]*PREVIEW"/);
 assert.doesNotMatch(html, /aria-label="[^"]*ISSUED[^"]*"/);
 assert.doesNotMatch(html, />ISSUED<|PASS ISSUED|data-reference=/);
});

test('Legacy commemoration results use the same finite nonnegative integer validation as explicit event facts', () => {
 const pass = createPersonalPass({...input, now: new Date('2026-10-25T05:00:00Z')});
 assert.equal(pass.status.phase, 'archived');
 for (const score of [
  {team: -1, opponent: 108}, {team: 112, opponent: -1},
  {team: NaN, opponent: 108}, {team: 112, opponent: Infinity},
  {team: 112.5, opponent: 108}, {team: 112, opponent: 108.5},
 ]) {
  const html = renderToStaticMarkup(createElement(GamePass, {pass, commemoration: {score}}));
  assert.equal(resultText(html), '', `Invalid final result must stay empty: ${JSON.stringify(score)}`);
  assert.doesNotMatch(html, /FINAL ·/);
 }
 const valid = renderToStaticMarkup(createElement(GamePass, {pass, commemoration: {score: {team: 112, opponent: 108}}}));
 assert.equal(resultText(valid), 'FINAL · 112 — 108');
});

test('LIVE and FINAL rendering require explicit event facts and preserve only the supplied points', () => {
 const game: Game = {...mockGames[0], estimatedEndTime: undefined};
 const pass = createPersonalPass({...input, game, now: new Date('2026-10-25T05:00:00Z')});
 const withoutFeed = renderToStaticMarkup(createElement(GamePass, {pass}));
 assert.equal(resolvePassPresentation(pass).state, 'issued');
 assert.ok(withoutFeed.includes('data-lifecycle="issued"'));
 assert.equal(resultText(withoutFeed), '');
 assert.doesNotMatch(withoutFeed, /LIVE ·|FINAL ·/);
 const feeds: PassEventState[] = [
  {state: 'live', score: {team: 0, opponent: 2}, period: 'Q1', clock: '11:42'},
  {state: 'final', score: {team: 112, opponent: 108}, period: 'Q4', clock: '00:00'},
 ];
 for (const event of feeds) {
  assert.deepEqual(resolvePassPresentation(pass, event).score, event.score);
  const html = renderToStaticMarkup(createElement(GamePass, {pass, event}));
  assert.ok(html.includes(`data-lifecycle="${event.state}"`));
  assert.equal(resultText(html), event.state === 'live' ? 'LIVE · 0 — 2 · Q1 · 11:42' : 'FINAL · 112 — 108');
  if (event.state === 'final') assert.doesNotMatch(resultText(html)!, /Q4|00:00/);
 }
 for (const state of ['live', 'final'] as const) {
  const html = renderToStaticMarkup(createElement(GamePass, {pass, event: {state}}));
  assert.equal(resultText(html), '', 'Missing points cannot become a default 0–0 result');
  const invalid = renderToStaticMarkup(createElement(GamePass, {pass, event: {state, score: {team: -1, opponent: 2}}}));
  assert.equal(resultText(invalid), '');
 }
});
