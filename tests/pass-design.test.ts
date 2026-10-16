import test from 'node:test';
import assert from 'node:assert/strict';
import {formatPassRecord,passSecuritySvg} from '../src/lib/passDesign';
import {DEMO_SEASON} from '../src/data/seasons';
import {mockGames} from '../src/data/mockGames';
const user={number:'0147'},event={gameNumber:1};

test('User pass number and event collection are independent issuer inputs',()=>{
 assert.deepEqual(formatPassRecord(user,event,DEMO_SEASON),['PASS 0147','GAME 01 / 82','SEASON 26–27']);
 assert.deepEqual(formatPassRecord({number:'0902'},event,DEMO_SEASON),['PASS 0902','GAME 01 / 82','SEASON 26–27']);
 assert.deepEqual(formatPassRecord(user,{gameNumber:82},{totalGames:82,seasonCode:'27–28'}),['PASS 0147','GAME 82 / 82','SEASON 27–28']);
 assert.deepEqual(formatPassRecord(user),['PASS 0147'],'Missing event data must not invent a season or game ordinal');
 assert.equal(mockGames[0].gameNumbers?.HOU,1,'Game ordinal is explicit fixture metadata');
 assert.equal(mockGames[1].gameNumbers?.GSW,undefined,'Unknown away-team ordinals must not be inferred');
});

test('Malformed identities and impossible collection records cannot become printed tickets',()=>{
 for(const number of ['147','01470','HOU1','01 7','<svg>'])assert.throws(()=>formatPassRecord({number}),RangeError);
 for(const gameNumber of [0,83,1.5])assert.throws(()=>formatPassRecord(user,{gameNumber},DEMO_SEASON),RangeError);
 assert.throws(()=>formatPassRecord(user,event,{...DEMO_SEASON,totalGames:Infinity}),RangeError);
 assert.throws(()=>formatPassRecord(user,event,{...DEMO_SEASON,seasonCode:'26'}),RangeError);
 assert.throws(()=>formatPassRecord(user,event,{...DEMO_SEASON,seasonCode:'26–28'}),RangeError);
});

test('Security stock belongs to the selected crest and never falls back to HOU',()=>{
 const teams=['HOU','LAL','GSW','DAL','DEN','BOS'];
 const prints=teams.map(team=>passSecuritySvg(team));
 assert.equal(new Set(prints).size,teams.length);
 for(const print of prints){assert.ok(print?.includes('<pattern'));assert.ok(print.includes('mask="url(#clear-ink)"'));}
 for(const team of ['UNKNOWN','toString','__proto__'])assert.equal(passSecuritySvg(team),null);
 assert.notEqual(passSecuritySvg('HOU','main'),passSecuritySvg('HOU','stub'),'Each paper region has its own text-safe printing area');
});
