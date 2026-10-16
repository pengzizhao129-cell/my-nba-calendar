import test from 'node:test';
import assert from 'node:assert/strict';
import {formatPassRecord,passSecuritySvg,DEMO_PASS_IDENTITY,DEMO_PASS_COLLECTION} from '../src/lib/passDesign';
import {mockGames} from '../src/data/mockGames';

test('User pass number and event collection are independent issuer inputs',()=>{
 assert.deepEqual(formatPassRecord(DEMO_PASS_IDENTITY,DEMO_PASS_COLLECTION),['PASS 0147','GAME 01 / 82','SEASON 26–27']);
 assert.deepEqual(formatPassRecord({number:'0902'},DEMO_PASS_COLLECTION),['PASS 0902','GAME 01 / 82','SEASON 26–27']);
 assert.deepEqual(formatPassRecord(DEMO_PASS_IDENTITY,{gameNumber:82,totalGames:82,seasonStart:2027}),['PASS 0147','GAME 82 / 82','SEASON 27–28']);
 assert.deepEqual(formatPassRecord(DEMO_PASS_IDENTITY),['PASS 0147'],'Missing event data must not invent a season or game ordinal');
 assert.equal(mockGames.filter(game=>game.collection).length,1,'Only the explicitly authored fixture has collection metadata');
});

test('Malformed identities and impossible collection records cannot become printed tickets',()=>{
 for(const number of ['147','01470','HOU1','01 7','<svg>'])assert.throws(()=>formatPassRecord({number}),RangeError);
 for(const collection of [
  {gameNumber:0,totalGames:82,seasonStart:2026},
  {gameNumber:83,totalGames:82,seasonStart:2026},
  {gameNumber:1.5,totalGames:82,seasonStart:2026},
  {gameNumber:1,totalGames:Infinity,seasonStart:2026},
  {gameNumber:1,totalGames:82,seasonStart:26},
 ])assert.throws(()=>formatPassRecord(DEMO_PASS_IDENTITY,collection),RangeError);
});

test('Security stock belongs to the selected crest and never falls back to HOU',()=>{
 const teams=['HOU','LAL','GSW','DAL','DEN'];
 const prints=teams.map(team=>passSecuritySvg(team));
 assert.equal(new Set(prints).size,teams.length);
 for(const print of prints){assert.ok(print?.includes('<pattern'));assert.ok(print.includes('mask="url(#clear-ink)"'));}
 for(const team of ['BOS','UNKNOWN','toString','__proto__'])assert.equal(passSecuritySvg(team),null);
 assert.notEqual(passSecuritySvg('HOU','main'),passSecuritySvg('HOU','stub'),'Each paper region has its own text-safe printing area');
});
