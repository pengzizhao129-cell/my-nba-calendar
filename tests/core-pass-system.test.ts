import test from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_SEASON} from '../src/data/seasons';
import {mockGames,DEMO_NOW} from '../src/data/mockGames';
import {resolvePassStatus,nextTeamGameId} from '../src/lib/passStatus';
import {PASS_DNA,passOutlineMask} from '../src/lib/passDNA';
import {createPersonalPass,passRecord} from '../src/lib/personalPass';
import {archiveFinishedGames,readSeasonArchive,persistSeasonArchive,resolvePersonalSeason,resolveSeasonMilestone,archiveKey,seasonFixtures,seasonSummary} from '../src/lib/seasonLifecycle';

const fixtures=mockGames.filter(game=>game.home==='HOU'||game.away==='HOU');
const at=(instant:string)=>new Date(instant);
const user={passId:'0147',teamCode:'HOU',game:fixtures[0],city:'东京',timezone:'Asia/Tokyo',now:at(DEMO_NOW),games:mockGames};
function memory(){const data=new Map<string,string>();let writes=0;return {data,get writes(){return writes;},getItem:(key:string)=>data.get(key)??null,setItem:(key:string,value:string)=>{writes++;data.set(key,value);}};}

test('Nearest future game is NEXT UP irrespective of distance; other fixtures are UPCOMING',()=>{
 const now=at('2026-10-01T00:00:00Z'),next=nextTeamGameId(fixtures,now);
 assert.equal(next,'hou-1');
 assert.equal(resolvePassStatus(fixtures[0],now,{timezone:'Asia/Tokyo',nextGameId:next}).phase,'next_up');
 assert.equal(resolvePassStatus(fixtures[1],now,{timezone:'Asia/Tokyo',nextGameId:next}).phase,'upcoming');
 assert.equal(resolvePassStatus(fixtures[1],now,{timezone:'Asia/Tokyo',nextGameId:next,focused:false}).emotionMark,null);
 assert.equal(nextTeamGameId(fixtures,now,new Set(['hou-1'])),'hou-2');
});
test('GAME DAY uses IANA local dates, including midnight and DST, with archive priority',()=>{
 const now=at('2026-10-24T16:00:00Z'),game=fixtures[0];
 const tokyo=resolvePassStatus(game,now,{timezone:'Asia/Tokyo',nextGameId:game.id});
 const london=resolvePassStatus(game,now,{timezone:'Europe/London',nextGameId:game.id});
 assert.equal(tokyo.phase,'game_day');assert.equal(london.phase,'next_up');
 assert.equal(resolvePassStatus(game,at('2026-10-25T01:30:00Z'),{timezone:'Europe/London',nextGameId:null}).phase,'game_day');
 assert.equal(resolvePassStatus(game,at('2026-10-25T04:00:00Z'),{timezone:'Asia/Tokyo',nextGameId:null}).phase,'archived');
 assert.throws(()=>resolvePassStatus(game,now,{timezone:'Not/AZone',nextGameId:null}),RangeError);
 const restored=resolvePassStatus(game,now,{timezone:'Asia/Tokyo',nextGameId:game.id,archivedAt:'2026-10-25T04:00:00Z'});
 assert.equal(restored.phase,'archived','Clock reversal cannot uncollect a persisted pass');
});
test('GAME DAY energy changes only at quiet internal bands; it never adds public states',()=>{
 const game=fixtures[0],context={timezone:'Asia/Tokyo',nextGameId:'hou-1'};
 const states=['2026-10-24T18:59:59Z','2026-10-24T19:00:00Z','2026-10-24T22:00:01Z'].map(clock=>resolvePassStatus(game,at(clock),context));
 assert.deepEqual(states.map(state=>state.energy),['day','approaching','imminent']);
 assert.deepEqual(states.map(state=>state.label),['GAME DAY','GAME DAY','GAME DAY']);
 assert.deepEqual(states.map(state=>state.emotionMark),['Tip-off','Tip-off','Tip-off']);
});
test('Automatic archive is idempotent, refresh-safe and isolated by team; collection is derived from IDs',()=>{
 const storage=memory(),now=at('2026-10-27T05:00:00Z');
 let archive=archiveFinishedGames({},fixtures,'HOU',DEMO_SEASON,now);
 archive=persistSeasonArchive(storage,DEMO_SEASON,archive);const writes=storage.writes;
 assert.equal(resolvePersonalSeason(DEMO_SEASON,'HOU',archive).collectedGames,2);
 assert.equal(resolvePersonalSeason(DEMO_SEASON,'LAL',archive).collectedGames,0);
 const refreshed=readSeasonArchive(storage,DEMO_SEASON);
 archive=persistSeasonArchive(storage,DEMO_SEASON,archiveFinishedGames(refreshed,fixtures,'HOU',DEMO_SEASON,now));
 assert.equal(storage.writes,writes);assert.deepEqual(archive,refreshed);
 archive=persistSeasonArchive(storage,DEMO_SEASON,archiveFinishedGames(archive,fixtures,'LAL',DEMO_SEASON,now));
 assert.equal(resolvePersonalSeason(DEMO_SEASON,'LAL',archive).collectedGames,1);
 assert.equal(resolvePersonalSeason(DEMO_SEASON,'HOU',archive).collectedGames,2);
 const pass=createPersonalPass({...user,archive,now:at(DEMO_NOW)});
 assert.equal(pass.status.phase,'archived');assert.equal(pass.status.emotionMark,'Collected');assert.equal(pass.user.passId,'0147');
 assert.deepEqual(passRecord(pass),{gameId:'hou-1',teamCode:'HOU',gameNumber:1,seasonId:'2026-27',seasonCode:'26–27',passState:'archived',archivedAt:'2026-10-25T04:00:00.000Z'});
});
test('New seasons reset ordinals/progress without overwriting old archives or user identity',()=>{
 const storage=memory(),nextSeason={id:'2027-28',seasonCode:'27–28',totalGames:82};
 const old=persistSeasonArchive(storage,DEMO_SEASON,archiveFinishedGames({},fixtures,'HOU',DEMO_SEASON,at('2026-11-04T00:00:00Z')));
 const oldFile=storage.getItem(archiveKey(DEMO_SEASON));
 assert.equal(resolvePersonalSeason(nextSeason,'HOU',{}).collectedGames,0);
 const nextFixture={...fixtures[0],id:'hou-2027-1',seasonId:nextSeason.id,startsAt:'2027-10-25T01:00:00Z',endsAt:'2027-10-25T04:00:00Z'};
 const next=persistSeasonArchive(storage,nextSeason,archiveFinishedGames({},[nextFixture],'HOU',nextSeason,at('2027-10-25T05:00:00Z')));
 assert.equal(storage.getItem(archiveKey(DEMO_SEASON)),oldFile);
 assert.equal(resolvePersonalSeason(DEMO_SEASON,'HOU',old).collectedGames,5);
 assert.equal(resolvePersonalSeason(nextSeason,'HOU',next).collectedGames,1);
 assert.equal(Object.values(next)[0].gameNumber,1);assert.equal(Object.values(old)[0].seasonCode,'26–27');
 storage.setItem('mygame_pass_id','0147');assert.equal(storage.getItem('mygame_pass_id'),'0147');
});
test('Malformed persistence is ignored, unknown ordinals stay unknown, and multi-tab merge preserves records',()=>{
 const storage=memory();storage.setItem(archiveKey(DEMO_SEASON),'broken');assert.deepEqual(readSeasonArchive(storage,DEMO_SEASON),{});
 const first=archiveFinishedGames({},fixtures,'HOU',DEMO_SEASON,at('2026-10-25T05:00:00Z'));
 const second=archiveFinishedGames({},fixtures,'GSW',DEMO_SEASON,at('2026-10-27T05:00:00Z'));
 persistSeasonArchive(storage,DEMO_SEASON,first);const merged=persistSeasonArchive(storage,DEMO_SEASON,second);
 assert.equal(Object.keys(merged).length,2);assert.equal(Object.values(second)[0].gameNumber,null);
 storage.setItem(archiveKey(DEMO_SEASON),JSON.stringify({version:1,passes:[...Object.values(merged),{...Object.values(first)[0],gameId:'malformed',gameNumber:83}]}));
 assert.equal(Object.keys(readSeasonArchive(storage,DEMO_SEASON)).length,2);
});
test('Milestone resolver supports First Pass, 10, 41 and 82 without ticket decoration',()=>{
 assert.deepEqual([0,1,9,10,40,41,81,82].map(n=>resolveSeasonMilestone(n,82)),[null,'First Pass','First Pass','Early Season','Early Season','Halfway','Halfway','Season Complete']);
 assert.throws(()=>resolveSeasonMilestone(83,82),RangeError);
});
test('Master DNA is immutable and independent of all six variable layers',()=>{
 assert.equal(PASS_DNA.main.height,480);assert.equal(PASS_DNA.stub.y,482);assert.equal(PASS_DNA.bridge.x,348);
 assert.ok(Object.isFrozen(PASS_DNA));for(const region of [PASS_DNA.main,PASS_DNA.stub,PASS_DNA.bridge,PASS_DNA.timingSanctuary])assert.ok(Object.isFrozen(region));
 assert.notEqual(PASS_DNA.leftCut,PASS_DNA.rightCut);assert.match(passOutlineMask(),/data:image\/svg\+xml/);
 const tokyo=createPersonalPass(user),london=createPersonalPass({...user,city:'伦敦',timezone:'Europe/London'});
 assert.deepEqual(tokyo.game,london.game);assert.deepEqual(tokyo.user,london.user);assert.deepEqual(tokyo.season,london.season);
});

test('Archived content survives schedule replacement and can supply a season summary without new pages',()=>{
 const storage=memory(),now=at('2026-10-27T05:00:00Z');
 persistSeasonArchive(storage,DEMO_SEASON,archiveFinishedGames({},fixtures,'HOU',DEMO_SEASON,now));
 const restored=readSeasonArchive(storage,DEMO_SEASON),oldGames=seasonFixtures([],restored,'HOU');
 assert.equal(oldGames.length,2);assert.equal(oldGames[0].venue,'丰田中心');
 const pass=createPersonalPass({...user,game:oldGames[0],games:oldGames,archive:restored,now});
 assert.equal(pass.status.phase,'archived');assert.equal(pass.game.gameNumber,1);
 const summary=seasonSummary({passId:'0147'},DEMO_SEASON,'HOU',restored);
 assert.equal(summary.user.passId,'0147');assert.equal(summary.season.collectedGames,2);assert.deepEqual(summary.passes.map(pass=>pass.gameNumber),[1,2]);
 assert.equal(summary.milestone,'First Pass');
});
