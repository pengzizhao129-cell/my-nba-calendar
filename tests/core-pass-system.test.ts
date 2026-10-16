import test from 'node:test';
import assert from 'node:assert/strict';
import {DEMO_SEASON} from '../src/data/seasons';
import {mockGames,DEMO_NOW} from '../src/data/mockGames';
import {completedAt,resolvePassStatus,nextTeamGameId} from '../src/lib/passStatus';
import {resolveGameCompletion} from '../src/lib/gameCompletion';
import {PASS_DNA,passOutlineMask} from '../src/lib/passDNA';
import {createPersonalPass,passRecord} from '../src/lib/personalPass';
import {getSchedule} from '../src/lib/schedule';
import {archiveFinishedGames,readSeasonArchive,persistSeasonArchive,resolvePersonalSeason,resolveSeasonMilestone,archiveKey,archiveRecordsKey,legacyArchiveKey,seasonFixtures,seasonSummary} from '../src/lib/seasonLifecycle';

const fixtures=mockGames.filter(game=>game.home==='HOU'||game.away==='HOU');
const at=(instant:string)=>new Date(instant);
const user={passId:'0147',teamCode:'HOU',game:fixtures[0],city:'东京',timezone:'Asia/Tokyo',now:at(DEMO_NOW),games:mockGames};
function memory(){const data=new Map<string,string>(),reads:string[]=[];let writes=0;return {data,reads,get writes(){return writes;},getItem:(key:string)=>{reads.push(key);return data.get(key)??null;},setItem:(key:string,value:string)=>{writes++;data.set(key,value);}};}

test('NEXT UP sorts unfinished future games for selectedTeam, excluding final, past, archived and foreign fixtures',()=>{
 const now=at('2026-10-01T00:00:00Z');
 const foreign={...fixtures[0],id:'foreign',home:'BOS',away:'MIA',startsAt:'2026-10-02T00:00:00Z'};
 const final={...fixtures[0],id:'final',final:true};
 const games=[fixtures[2],foreign,final,fixtures[1],fixtures[0]];
 assert.equal(nextTeamGameId(games,'HOU',now),'hou-1');
 assert.equal(nextTeamGameId(games,'HOU',now,new Set(['hou-1'])),'hou-2');
 assert.equal(nextTeamGameId(games,'DEN',now),null);
 assert.equal(resolvePassStatus(fixtures[0],now,{timezone:'Asia/Tokyo',nextGameId:'hou-1'}).phase,'next_up');
 assert.equal(resolvePassStatus(fixtures[1],now,{timezone:'Asia/Tokyo',nextGameId:'hou-1'}).phase,'upcoming');
 assert.equal(resolvePassStatus(fixtures[1],now,{timezone:'Asia/Tokyo',nextGameId:'hou-1',focused:false}).emotionMark,null);
 for(const clock of ['2026-10-01T00:00:00Z','2026-10-25T01:00:00Z','2026-10-25T01:00:00.001Z','2026-10-25T04:00:00Z','2026-11-04T00:00:00Z']){
  for(const team of ['HOU','LAL','GSW','DEN']){
   const eligible=mockGames.filter(game=>(game.home===team||game.away===team)&&!game.final&&!game.finished&&!completedAt(game,at(clock))&&Date.parse(game.startsAt)>=Date.parse(clock)).sort((a,b)=>Date.parse(a.startsAt)-Date.parse(b.startsAt)||a.id.localeCompare(b.id));
   assert.equal(nextTeamGameId(mockGames,team,at(clock)),eligible[0]?.id??null);
   assert.equal(getSchedule(mockGames,team,'Asia/Tokyo',at(clock)).next?.id,eligible[0]?.id);
  }
 }
});
test('GAME DAY compares IANA local calendar dates: Tokyo has entered the date while London has not',()=>{
 const now=at('2026-10-24T16:00:00Z'),game=fixtures[0];
 assert.equal(resolvePassStatus(game,now,{timezone:'Asia/Tokyo',nextGameId:game.id}).phase,'game_day');
 assert.equal(resolvePassStatus(game,now,{timezone:'Europe/London',nextGameId:game.id}).phase,'next_up');
 assert.equal(resolvePassStatus(game,at('2026-10-25T01:30:00Z'),{timezone:'Europe/London',nextGameId:null}).phase,'game_day');
 assert.equal(resolvePassStatus(game,at('2026-10-25T04:00:00Z'),{timezone:'Asia/Tokyo',nextGameId:null}).phase,'archived');
 assert.throws(()=>resolvePassStatus(game,now,{timezone:'Not/AZone',nextGameId:null}),RangeError);
 assert.equal(resolvePassStatus(game,now,{timezone:'Asia/Tokyo',nextGameId:game.id,archived:true}).phase,'archived');
});
test('Tip-off cannot collect a pass; mock estimates are explicit and replaceable by final/endTime',()=>{
 const game=fixtures[0],start=at(game.startsAt);
 assert.equal(completedAt(game,start),null);assert.equal(completedAt({...game,final:true},start),null);
 assert.equal(completedAt(game,new Date(start.getTime()+1)),null);
 assert.equal(completedAt({id:'no-end',startsAt:game.startsAt},at('2026-10-30T00:00:00Z')),null);
 const estimated=resolveGameCompletion(game,at('2026-10-25T04:00:00Z'));
 assert.deepEqual(estimated,{endedAt:'2026-10-25T04:00:00.000Z',source:'estimate'});
 assert.equal(completedAt({...game,final:false},at('2026-10-25T05:00:00Z')),null,'A non-final real feed overrides a stale mock estimate');
 assert.equal(resolveGameCompletion({...game,final:true},at('2026-10-25T05:00:00Z')).source,'final');
 const real={...game,endTime:'2026-10-25T06:00:00Z'};
 assert.equal(completedAt(real,at('2026-10-25T05:00:00Z')),null);
 assert.equal(resolveGameCompletion(real,at('2026-10-25T06:00:00Z')).source,'endTime');
 assert.throws(()=>resolveGameCompletion({...game,endTime:game.startsAt},start),RangeError);
 assert.equal(Object.keys(archiveFinishedGames({},fixtures,'HOU',DEMO_SEASON,start)).length,0);
});
test('GAME DAY private energy bands never create extra public lifecycle states',()=>{
 const states=['2026-10-24T18:59:59Z','2026-10-24T19:00:00Z','2026-10-24T22:00:01Z'].map(clock=>resolvePassStatus(fixtures[0],at(clock),{timezone:'Asia/Tokyo',nextGameId:'hou-1'}));
 assert.deepEqual(states.map(s=>s.energy),['day','approaching','imminent']);
 assert.deepEqual(states.map(s=>s.label),['GAME DAY','GAME DAY','GAME DAY']);
 assert.deepEqual(states.map(s=>s.emotionMark),['Tip-off','Tip-off','Tip-off']);
});
test('Archive is a unique gameId array; repeated completion and refresh never increase the count',()=>{
 const storage=memory(),now=at('2026-10-27T05:00:00Z');
 let archive=persistSeasonArchive(storage,DEMO_SEASON,'HOU',archiveFinishedGames({},fixtures,'HOU',DEMO_SEASON,now));
 assert.equal(archiveKey(DEMO_SEASON,'HOU'),'mygame_archived_games:HOU:26-27');
 assert.deepEqual(JSON.parse(storage.data.get(archiveKey(DEMO_SEASON,'HOU'))!),['hou-1','hou-2']);
 const writes=storage.writes,refreshed=readSeasonArchive(storage,DEMO_SEASON,'HOU');
 for(let i=0;i<5;i++)archive=persistSeasonArchive(storage,DEMO_SEASON,'HOU',archiveFinishedGames(archive,fixtures,'HOU',DEMO_SEASON,now));
 assert.equal(storage.writes,writes);assert.deepEqual(archive,refreshed);
 assert.equal(resolvePersonalSeason(DEMO_SEASON,'HOU',archive).collectedGames,2);
 const pass=createPersonalPass({...user,archive,now:at(DEMO_NOW)});
 assert.equal(pass.status.phase,'archived');assert.equal(pass.user.passId,'0147');
 assert.deepEqual(passRecord(pass),{gameId:'hou-1',teamCode:'HOU',gameNumber:1,seasonId:'2026-27',seasonCode:'26–27',passState:'archived',archivedAt:'2026-10-25T04:00:00.000Z'});
});
test('Team swap never reads another team archive or snapshot key, including shared fixture IDs',()=>{
 const storage=memory(),now=at('2026-10-25T05:00:00Z');
 const hou=persistSeasonArchive(storage,DEMO_SEASON,'HOU',archiveFinishedGames({},fixtures,'HOU',DEMO_SEASON,now));
 storage.reads.length=0;assert.deepEqual(readSeasonArchive(storage,DEMO_SEASON,'LAL'),{});
 assert.ok(!storage.reads.includes(archiveKey(DEMO_SEASON,'HOU')));assert.ok(!storage.reads.includes(archiveRecordsKey(DEMO_SEASON,'HOU')));
 const lal=persistSeasonArchive(storage,DEMO_SEASON,'LAL',archiveFinishedGames(hou,fixtures,'LAL',DEMO_SEASON,now));
 assert.equal(resolvePersonalSeason(DEMO_SEASON,'LAL',lal).collectedGames,1);assert.equal(resolvePersonalSeason(DEMO_SEASON,'HOU',lal).collectedGames,0);
 assert.deepEqual(readSeasonArchive(storage,DEMO_SEASON,'HOU'),hou);
});
test('Season swap retains old collection bytes and user identity, with independent new-season progress',()=>{
 const storage=memory(),nextSeason={id:'2027-28',seasonCode:'27–28',totalGames:82};
 const old=persistSeasonArchive(storage,DEMO_SEASON,'HOU',archiveFinishedGames({},fixtures,'HOU',DEMO_SEASON,at('2026-11-04T00:00:00Z')));
 const oldFile=storage.data.get(archiveKey(DEMO_SEASON,'HOU')),oldRecords=storage.data.get(archiveRecordsKey(DEMO_SEASON,'HOU'));
 assert.equal(resolvePersonalSeason(nextSeason,'HOU',readSeasonArchive(storage,nextSeason,'HOU')).collectedGames,0);
 const game={...fixtures[0],id:'hou-2027-1',seasonId:nextSeason.id,startsAt:'2027-10-25T01:00:00Z',estimatedEndTime:'2027-10-25T04:00:00Z'};
 const next=persistSeasonArchive(storage,nextSeason,'HOU',archiveFinishedGames({},[game],'HOU',nextSeason,at('2027-10-25T05:00:00Z')));
 assert.equal(storage.data.get(archiveKey(DEMO_SEASON,'HOU')),oldFile);assert.equal(storage.data.get(archiveRecordsKey(DEMO_SEASON,'HOU')),oldRecords);
 assert.equal(resolvePersonalSeason(DEMO_SEASON,'HOU',old).collectedGames,5);assert.equal(resolvePersonalSeason(nextSeason,'HOU',next).collectedGames,1);
 assert.equal(Object.values(next)[0].gameNumber,1);assert.equal(Object.values(old)[0].seasonCode,'26–27');
});
test('Legacy shared archives migrate only the selected team, without deleting old records',()=>{
 const storage=memory(),now=at('2026-10-25T05:00:00Z');
 const hou=archiveFinishedGames({},fixtures,'HOU',DEMO_SEASON,now),lal=archiveFinishedGames({},fixtures,'LAL',DEMO_SEASON,now);
 const legacy=JSON.stringify({version:1,passes:[...Object.values(hou),...Object.values(lal)]});storage.setItem(legacyArchiveKey(DEMO_SEASON),legacy);
 const migrated=readSeasonArchive(storage,DEMO_SEASON,'HOU');assert.deepEqual(migrated,hou);
 persistSeasonArchive(storage,DEMO_SEASON,'HOU',migrated);
 assert.deepEqual(JSON.parse(storage.data.get(archiveKey(DEMO_SEASON,'HOU'))!),['hou-1']);assert.equal(storage.data.get(archiveKey(DEMO_SEASON,'LAL')),undefined);
 assert.equal(storage.data.get(legacyArchiveKey(DEMO_SEASON)),legacy);
});
test('Unique IDs remain collected despite duplicate IDs, corrupt or missing optional snapshot data',()=>{
 const storage=memory();storage.setItem(archiveKey(DEMO_SEASON,'HOU'),JSON.stringify(['hou-1','hou-1',null,9,'<invalid>']));
 storage.setItem(archiveRecordsKey(DEMO_SEASON,'HOU'),'bad metadata');
 const archive=readSeasonArchive(storage,DEMO_SEASON,'HOU',mockGames);
 assert.equal(resolvePersonalSeason(DEMO_SEASON,'HOU',archive).collectedGames,1);
 assert.equal(createPersonalPass({...user,archive}).status.phase,'archived');
 persistSeasonArchive(storage,DEMO_SEASON,'HOU',archive);assert.deepEqual(JSON.parse(storage.data.get(archiveKey(DEMO_SEASON,'HOU'))!),['hou-1']);
 assert.equal(Object.values(readSeasonArchive(storage,DEMO_SEASON,'HOU'))[0].fixture?.id,'hou-1');
});
test('Same-team multi-tab archive merges preserve records and unknown opponent ordinals stay unknown',()=>{
 const storage=memory(),first=archiveFinishedGames({},fixtures.slice(0,1),'HOU',DEMO_SEASON,at('2026-10-27T05:00:00Z'));
 const second=archiveFinishedGames({},fixtures.slice(1,2),'HOU',DEMO_SEASON,at('2026-10-27T05:00:00Z'));
 persistSeasonArchive(storage,DEMO_SEASON,'HOU',first);const merged=persistSeasonArchive(storage,DEMO_SEASON,'HOU',second);
 assert.equal(resolvePersonalSeason(DEMO_SEASON,'HOU',merged).collectedGames,2);
 assert.equal(Object.values(archiveFinishedGames({},fixtures,'GSW',DEMO_SEASON,at('2026-10-27T05:00:00Z')))[0].gameNumber,null);
});
test('Milestones are data-only, and master DNA is immutable across every variable layer',()=>{
 assert.deepEqual([0,1,9,10,40,41,81,82].map(n=>resolveSeasonMilestone(n,82)),[null,'First Pass','First Pass','Early Season','Early Season','Halfway','Halfway','Season Complete']);
 assert.throws(()=>resolveSeasonMilestone(83,82),RangeError);
 assert.ok(Object.isFrozen(PASS_DNA));for(const region of [PASS_DNA.main,PASS_DNA.stub,PASS_DNA.bridge,PASS_DNA.timingSanctuary,PASS_DNA.securityWindow])assert.ok(Object.isFrozen(region));
 assert.notEqual(PASS_DNA.leftCut,PASS_DNA.rightCut);assert.match(passOutlineMask(),/data:image\/svg\+xml/);
});
test('Archive snapshots survive schedule replacement and supply future season summaries',()=>{
 const storage=memory(),now=at('2026-10-27T05:00:00Z');
 persistSeasonArchive(storage,DEMO_SEASON,'HOU',archiveFinishedGames({},fixtures,'HOU',DEMO_SEASON,now));
 const restored=readSeasonArchive(storage,DEMO_SEASON,'HOU'),oldGames=seasonFixtures([],restored,'HOU');
 assert.equal(oldGames.length,2);assert.equal(oldGames[0].venue,'丰田中心');
 const pass=createPersonalPass({...user,game:oldGames[0],games:oldGames,archive:restored,now});
 assert.equal(pass.status.phase,'archived');assert.equal(pass.game.gameNumber,1);
 const summary=seasonSummary({passId:'0147'},DEMO_SEASON,'HOU',restored);
 assert.equal(summary.user.passId,'0147');assert.equal(summary.season.collectedGames,2);assert.deepEqual(summary.passes.map(pass=>pass.gameNumber),[1,2]);
});
