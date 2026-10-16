import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PASS_ID_KEY,generatePassId,readOrCreatePassId} from '../src/lib/passIdentity';
import {createPersonalPass,resolvePassLocation,selectPassGame} from '../src/lib/personalPass';
import {resolvePassStatus} from '../src/lib/passStatus';
import {getTeamIdentity,passSecuritySvg,teamSymbolGeometry} from '../src/lib/passDesign';
import {teams} from '../src/data/teams';
import {mockGames,DEMO_NOW} from '../src/data/mockGames';
import {GamePass} from '../src/components/GamePass';

const input={passId:'0843',teamCode:'HOU',game:mockGames[0],city:'东京',timezone:'Asia/Tokyo',now:new Date(DEMO_NOW)};

test('First local visit issues once, refresh preserves leading zeroes, invalid stored IDs are repaired',()=>{
 const values=new Map<string,string>();let writes=0;
 const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{writes++;values.set(key,value);}};
 const first=readOrCreatePassId(()=>storage);assert.match(first,/^\d{4}$/);assert.equal(values.get(PASS_ID_KEY),first);
 assert.equal(readOrCreatePassId(()=>storage),first);assert.equal(writes,1);
 values.set(PASS_ID_KEY,'0843');assert.equal(readOrCreatePassId(()=>storage),'0843');assert.equal(writes,1);
 values.set(PASS_ID_KEY,'<bad-id>');assert.match(readOrCreatePassId(()=>storage),/^\d{4}$/);assert.equal(writes,2);
 const denied=()=>{throw new Error('Storage denied');};assert.equal(readOrCreatePassId(denied),readOrCreatePassId(denied),'Denied storage retains one in-memory identity for this session');
});

test('Four-digit generator covers leading zeroes and rejects the biased random tail',()=>{
 const random=(number:number)=>(array:Uint32Array)=>{array[0]=number;return array;};
 assert.equal(generatePassId(random(0)),'0000');assert.equal(generatePassId(random(9999)),'9999');
 let count=0;assert.equal(generatePassId(array=>{array[0]=count++?147:0xffffffff;return array;}),'0147');assert.equal(count,2);
});

test('Location changes preserve user, team, game, season and emotion, including the demo DST boundary',()=>{
 const tokyo=createPersonalPass(input),london=createPersonalPass({...input,city:'伦敦',timezone:'Europe/London'});
 for(const key of ['user','team','game','season','status'] as const)assert.deepEqual(tokyo[key],london[key]);
 assert.equal(tokyo.location.localTime,'10:00');assert.equal(tokyo.location.offset,'GMT+9');
 assert.equal(london.location.localTime,'01:00');assert.equal(london.location.offset,'GMT+1');
 assert.equal(tokyo.game.gameNumber,1);assert.equal(tokyo.season.totalGames,82);assert.equal(tokyo.season.seasonCode,'26–27');
 const pacific=createPersonalPass({...input,city:'洛杉矶',timezone:'America/Los_Angeles'});
 assert.equal(pacific.location.dateKey,'2026-10-24');assert.equal(pacific.game.id,tokyo.game.id,'Local calendar date may cross midnight, event identity never does');
 const before=resolvePassLocation('2026-11-01T05:30:00Z','纽约','America/New_York',new Date('2026-11-01T05:30:00Z'));
 const after=resolvePassLocation('2026-11-01T06:30:00Z','纽约','America/New_York',new Date('2026-11-01T06:30:00Z'));
 assert.equal(before.localTime,'01:30');assert.equal(after.localTime,'01:30');assert.equal(before.offset,'GMT-4');assert.equal(after.offset,'GMT-5');
});

test('Changing game changes event content and status, never user or team identity; changing user changes only User',()=>{
 const first=createPersonalPass(input),next=createPersonalPass({...input,game:mockGames[1]});
 for(const key of ['user','team','season'] as const)assert.deepEqual(first[key],next[key]);
 assert.equal(next.game.gameNumber,2);assert.equal(next.game.opponentCode,'GSW');assert.equal(next.game.venue,'大通中心');assert.equal(next.status.emotionMark,'Coming up');
 const otherUser=createPersonalPass({...input,passId:'3621'});
 for(const key of ['team','game','location','season','status'] as const)assert.deepEqual(first[key],otherUser[key]);
 const away=createPersonalPass({...input,teamCode:'GSW',game:mockGames[1]});assert.equal(away.game.gameNumber,null,'Partial fixtures cannot invent another team’s season ordinal');
 assert.throws(()=>createPersonalPass({...input,passId:'147'}),RangeError);
 assert.throws(()=>createPersonalPass({...input,teamCode:'BOS'}),RangeError);
 assert.throws(()=>createPersonalPass({...input,game:{...mockGames[0],gameNumbers:{HOU:83}}}),RangeError);
});

test('Selected event persists past its end; default selection is independent of local calendar filtering',()=>{
 const selected=selectPassGame(mockGames,'HOU','hou-1',new Date('2026-10-26T00:00:00Z'));
 assert.equal(selected?.id,'hou-1','A selected collectible remains available after its end');
 assert.equal(selectPassGame(mockGames,'HOU',null,new Date('2026-10-26T00:00:00Z'))?.id,'hou-2');
 const boston=selectPassGame(mockGames,'BOS','hou-1',input.now);
 assert.ok(boston&&(boston.home==='BOS'||boston.away==='BOS'),'Another team must not retain an unrelated fixture');
 assert.notEqual(boston.id,'hou-1');
 assert.equal(selectPassGame(mockGames,'HOU',null,new Date('2027-01-01T00:00:00Z')),undefined);
});

test('All 30 teams have distinct authored identity and security stock, without foreign fallback symbols',()=>{
 const packs=teams.map(team=>getTeamIdentity(team.id)!);
 assert.equal(packs.length,30);assert.equal(new Set(packs.map(pack=>pack.securityPattern)).size,30);
 assert.equal(new Set(teams.map(team=>passSecuritySvg(team.id))).size,30);
 for(const pack of packs){assert.ok(teamSymbolGeometry[pack.code]);assert.match(pack.secondaryTint,/\.016\)/);assert.equal(pack.microMark,pack.symbol);}
 assert.equal(getTeamIdentity('HOU')?.symbol,'ASCEND');assert.equal(getTeamIdentity('LAL')?.symbol,'PRESTIGE');assert.equal(getTeamIdentity('GSW')?.symbol,'SPAN');
 assert.equal(getTeamIdentity('DAL')?.symbol,'FORWARD');assert.equal(getTeamIdentity('DEN')?.symbol,'SUMMIT');
 assert.equal(getTeamIdentity('toString'),undefined);assert.equal(passSecuritySvg('UNKNOWN'),null);
});

test('Emotion has deterministic boundary priorities and never guesses a finished game from start time',()=>{
 const now=new Date(DEMO_NOW),at=(hours:number)=>new Date(now.getTime()+hours*3600000).toISOString();
 assert.equal(resolvePassStatus({startsAt:at(72.001)},now).emotionMark,'Next up');
 assert.equal(resolvePassStatus({startsAt:at(72)},now).emotionMark,'Coming up');
 assert.equal(resolvePassStatus({startsAt:at(24)},now).emotionMark,'Coming up');
 assert.equal(resolvePassStatus({startsAt:at(23.999)},now).emotionMark,'Tip-off');
 assert.equal(resolvePassStatus({startsAt:at(1),homeNight:true},now).emotionMark,'Home night');
 assert.equal(resolvePassStatus({startsAt:at(-5)},now).emotionMark,'Tip-off');
 assert.equal(resolvePassStatus({startsAt:at(-5),endsAt:at(0),homeNight:true},now).emotionMark,'Remember this one');
 assert.equal(resolvePassStatus({startsAt:at(-1),finished:true},now).emotionMark,'Remember this one');
 assert.throws(()=>resolvePassStatus({startsAt:'not-a-date'},now),RangeError);
});

test('Server render has one stub-only emotion and collection stack, without accessing browser storage',()=>{
 for(const hours of [100,48,1,-5]){
  const startsAt=new Date(input.now.getTime()+hours*3600000).toISOString();
  const pass=createPersonalPass({...input,game:{...mockGames[0],startsAt,endsAt:new Date(Date.parse(startsAt)+3*3600000).toISOString()}});
  const html=renderToStaticMarkup(createElement(GamePass,{pass,isToday:true}));
  assert.equal((html.match(/class="emotion-mark"/g)??[]).length,1);
  const [main,stub]=html.split('class="ticket-stub"');assert.ok(stub.includes('emotion-mark'));assert.ok(!main.includes('emotion-mark'));
  assert.ok(!main.includes('PASS</span> 0843'));assert.ok(stub.includes('PASS</span> 0843'));assert.ok(stub.includes('SEASON</span> 26–27'));
 }
});
