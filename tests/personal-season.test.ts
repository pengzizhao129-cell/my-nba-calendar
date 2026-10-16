import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PASS_ID_KEY,readExistingPassId,issuePassIdentity} from '../src/lib/passIdentity';
import {resolveSeasonMilestone,resolveTicketMilestone} from '../src/lib/seasonMilestones';
import {passShareContext} from '../src/lib/passShare';
import {createPersonalPass} from '../src/lib/personalPass';
import {archiveFinishedGames,persistSeasonArchive,readSeasonArchive,resolvePersonalSeason} from '../src/lib/seasonLifecycle';
import {DEMO_SEASON} from '../src/data/seasons';
import {GamePass} from '../src/components/GamePass';
import {PassShareCard} from '../src/components/PassShareCard';
import {SeasonSummaryCard} from '../src/components/SeasonSummaryCard';
import {seasonSeriesFixture,seriesPass} from '../design/validation/seasonSeriesFixture';
import {PASS_DNA} from '../src/lib/passDNA';

test('Reading an unissued identity never writes; explicit confirmation issues only once and old identities are grandfathered',()=>{
 const values=new Map<string,string>();let writes=0;
 const storage=()=>({getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{writes++;values.set(key,value);}});
 assert.equal(readExistingPassId(storage),null);assert.equal(writes,0);
 const issued=issuePassIdentity(storage);assert.equal(issued.issued,true);assert.match(issued.passId,/^\d{4}$/);
 assert.equal(readExistingPassId(storage),issued.passId);assert.deepEqual(issuePassIdentity(storage),{passId:issued.passId,issued:false});assert.equal(writes,1);
 values.set(PASS_ID_KEY,'0147');assert.deepEqual(issuePassIdentity(storage),{passId:'0147',issued:false});assert.equal(writes,1);
});

test('Milestone resolver understands ordinal one and real 10/41/82 progress, with no future or malformed milestones',()=>{
 assert.equal(resolveSeasonMilestone({gameNumber:1,collectedGames:0,totalGames:82}),'First Pass');
 for(const [count,label] of [[0,null],[1,'First Pass'],[9,'First Pass'],[10,'Early Season'],[40,'Early Season'],[41,'Halfway'],[81,'Halfway'],[82,'Season Complete']] as const){
  assert.equal(resolveSeasonMilestone({gameNumber:2,collectedGames:count,totalGames:82}),label);
 }
 for(const n of [-1,83,1.5])assert.throws(()=>resolveSeasonMilestone({gameNumber:1,collectedGames:n,totalGames:82}),RangeError);
 assert.throws(()=>resolveSeasonMilestone({gameNumber:83,collectedGames:1,totalGames:82}),RangeError);
 assert.equal(resolveTicketMilestone({gameNumber:1,collectedGames:82,totalGames:82,collected:true}),'First Pass','A season total never relabels the first ticket');
 assert.equal(resolveTicketMilestone({gameNumber:41,collectedGames:40,totalGames:82,collected:false}),null);
 assert.equal(resolveTicketMilestone({gameNumber:41,collectedGames:41,totalGames:82,collected:true}),'Halfway');
});

test('All share moments use a genuine personal Pass snapshot and reject invented progress, unissued identity and false completion',()=>{
 const games=seasonSeriesFixture(),clock=(i:number)=>new Date(Date.parse(games[i].estimatedEndTime!)+1000);
 const next=seriesPass(0,new Date(Date.parse(games[0].startsAt)-10*86400000)),day=seriesPass(0,new Date(Date.parse(games[0].startsAt)-3600000));
 const collected=seriesPass(0,clock(0)),halfway=seriesPass(40,clock(40)),complete=seriesPass(81,clock(81));
 for(const [pass,moment,label] of [[next,'next_up','NEXT UP'],[day,'game_day','GAME DAY'],[collected,'collected','COLLECTED'],[halfway,'milestone','HALFWAY'],[complete,'season_complete','SEASON COMPLETE']] as const){
  assert.equal(passShareContext(pass,moment).label,label);
  const html=renderToStaticMarkup(createElement(PassShareCard,{pass,moment}));
  assert.equal((html.match(new RegExp(`data-dna="${PASS_DNA.version}"`,'g'))??[]).length,1);assert.equal((html.match(/class="emotion-mark"/g)??[]).length,1);
  assert.ok(html.includes('PASS</span> 0147')&&html.includes('SEASON</span> 26–27'));
  assert.doesNotMatch(html,/NEXT 7 DAYS|SCHEDULE|PROFILE|WEB APP BETA|DOWNLOAD NOW|QR CODE/);
 }
 assert.throws(()=>passShareContext({...day,user:{passId:null}}),RangeError);
 assert.throws(()=>passShareContext({...day,season:{...day.season,collectedGames:41}}),RangeError);
 assert.throws(()=>passShareContext(day,'collected'),RangeError);
 assert.throws(()=>renderToStaticMarkup(createElement(SeasonSummaryCard,{pass:day})),RangeError);
 assert.ok(renderToStaticMarkup(createElement(SeasonSummaryCard,{pass:complete})).includes('82 / 82 COLLECTED'));
});

test('An 82-pass series preserves identity, ordinal, structure and exactly one status emotion, including automatically archived records',()=>{
 const games=seasonSeriesFixture(),now=new Date(Date.parse(games[41].startsAt)+3600000);
 const archived=archiveFinishedGames({},games,'HOU',DEMO_SEASON,now);
 const values=new Map<string,string>(),storage={getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>{values.set(k,v);}};
 persistSeasonArchive(storage,DEMO_SEASON,'HOU',archived);persistSeasonArchive(storage,DEMO_SEASON,'HOU',archiveFinishedGames(archived,games,'HOU',DEMO_SEASON,now));
 const restored=readSeasonArchive(storage,DEMO_SEASON,'HOU',games);assert.equal(resolvePersonalSeason(DEMO_SEASON,'HOU',restored).collectedGames,41);
 const phases=new Set(),stocks=new Set();
 for(const [i,game] of games.entries()){
  const pass=createPersonalPass({passId:'0147',teamCode:'HOU',game,games,now,archive:restored,city:'东京',timezone:'Asia/Tokyo'});
  phases.add(pass.status.phase);stocks.add(pass.team.securityPattern);assert.equal(pass.game.gameNumber,i+1);
  for(const variant of ['full','compact','collection'] as const){
   const html=renderToStaticMarkup(createElement(GamePass,{pass,variant}));
   for(const part of [`data-dna="${PASS_DNA.version}"`,'data-dna="bridge"','data-dna="spine"','PASS</span> 0147',`GAME</span> ${String(i+1).padStart(2,'0')} / 82`,'SEASON</span> 26–27'])assert.ok(html.includes(part));
   assert.equal((html.match(/class="emotion-mark"/g)??[]).length,1);
   assert.ok(html.includes(`data-pass-variant="${variant}"`));
   if(pass.status.phase==='archived')assert.ok(html.includes('data-emotion="Collected"'));
  }
 }
 assert.deepEqual([...phases].sort(),['archived','game_day','next_up','upcoming']);assert.equal(stocks.size,1);
});

test('Readable but write-denied localStorage retains one identity for the current session',()=>{
 let attempts=0;
 const unavailable=()=>({getItem:()=>null,setItem:()=>{attempts++;throw new Error('Quota exceeded');}});
 const first=issuePassIdentity(unavailable);
 assert.equal(first.issued,true);assert.match(first.passId,/^\d{4}$/);
 assert.equal(readExistingPassId(unavailable),first.passId);
 assert.deepEqual(issuePassIdentity(unavailable),{passId:first.passId,issued:false});assert.equal(attempts,1);
});
