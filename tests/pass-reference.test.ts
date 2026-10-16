import test from 'node:test';
import assert from 'node:assert/strict';
import {resolvePassReference, type PassReferenceInput} from '../src/lib/passReference';

const issued: PassReferenceInput = {
 passId: '0843', teamCode: 'HOU', opponentCode: 'LAL', gameId: 'hou-4',
 gameNumber: 4, seasonCode: '26–27', seasonId: '2026-27', countryCode: 'JP', cityCode: 'KOB',
};

test('Reference architecture composes season, fixture ordinal, country/city and personal issue serial', () => {
 const reference = resolvePassReference(issued)!;
 assert.equal(reference.seasonPrefix, 'MG26');
 assert.equal(reference.short, 'HOU-LAL.004');
 assert.equal(reference.coordinate, 'KOB / JP');
 assert.match(reference.serial, /^\d{5}$/);
 assert.equal(reference.full, `MG26-HOU-LAL-004-JPKOB-${reference.serial}`);
 assert.notEqual(reference.serial, issued.passId);
 assert.deepEqual(resolvePassReference(issued), reference, 'Resolving one issued event is deterministic');
 assert.deepEqual(resolvePassReference({...issued, seasonCode: '26-27'}), reference, 'Supported season separators resolve identically');
});

test('Location changes the printed coordinate and full reference while preserving its personal event serial', () => {
 const kobe = resolvePassReference(issued)!;
 const london = resolvePassReference({...issued, cityCode: 'LON', countryCode: 'UK'})!;
 assert.equal(london.coordinate, 'LON / UK');
 assert.equal(london.serial, kobe.serial);
 assert.equal(london.short, kobe.short);
 assert.equal(london.seasonPrefix, kobe.seasonPrefix);
 assert.equal(london.full, kobe.full.replace('JPKOB', 'UKLON'));
});

test('Mock serial belongs to the issued user, team, game and season rather than the ordinal or opponent display', () => {
 const reference = resolvePassReference(issued)!;
 const variants = [
  {...issued, passId: '0147'},
  {...issued, teamCode: 'GSW'},
  {...issued, gameId: 'hou-5'},
  {...issued, seasonCode: '27–28', seasonId: '2027-28'},
 ];
 const serials = variants.map(input => resolvePassReference(input)!.serial);
 assert.equal(new Set([reference.serial, ...serials]).size, variants.length + 1);
 assert.equal(resolvePassReference({...issued, gameNumber: 5})!.serial, reference.serial);
 assert.equal(resolvePassReference({...issued, opponentCode: 'BOS'})!.serial, reference.serial);
 assert.equal(resolvePassReference({...issued, seasonId: undefined, seasonCode: '26-27'})!.serial,
  resolvePassReference({...issued, seasonId: undefined})!.serial);
});

test('Unissued previews and missing or invalid metadata never fabricate a reference or season ordinal', () => {
 const invalid: PassReferenceInput[] = [
  {...issued, passId: null}, {...issued, passId: ''}, {...issued, passId: '843'},
  {...issued, passId: '08431'}, {...issued, passId: 'PASS'},
  {...issued, gameNumber: null}, {...issued, gameNumber: 0}, {...issued, gameNumber: -1},
  {...issued, gameNumber: 1.5}, {...issued, gameNumber: NaN}, {...issued, gameNumber: Infinity},
  {...issued, gameNumber: 1000}, {...issued, gameId: ''}, {...issued, gameId: '  '},
  {...issued, teamCode: ''}, {...issued, teamCode: 'hou'}, {...issued, opponentCode: 'HOU'},
  {...issued, opponentCode: ''}, {...issued, countryCode: ''}, {...issued, cityCode: ''},
  {...issued, countryCode: 'JPN'}, {...issued, cityCode: 'KOBE'},
  {...issued, seasonCode: ''}, {...issued, seasonCode: '2026-27'},
  {...issued, seasonCode: '26–28'}, {...issued, seasonId: ''},
 ];
 for (const input of invalid) assert.equal(resolvePassReference(input), null, JSON.stringify(input));
 assert.equal(resolvePassReference({...issued, gameNumber: undefined} as unknown as PassReferenceInput), null);
 assert.equal(resolvePassReference({...issued, seasonCode: undefined} as unknown as PassReferenceInput), null);
 assert.equal(resolvePassReference({...issued, cityCode: undefined} as unknown as PassReferenceInput), null);
 assert.equal(resolvePassReference(null as unknown as PassReferenceInput), null);
 assert.equal(resolvePassReference({...issued, passId: '0000', gameNumber: 4})!.short, 'HOU-LAL.004',
  'The four-digit user Pass ID can never supply a fixture ordinal');
});
