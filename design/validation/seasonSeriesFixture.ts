import {mockGames,type Game} from '../../src/data/mockGames';
import {DEMO_SEASON} from '../../src/data/seasons';
import {teams} from '../../src/data/teams';
import {archiveFinishedGames} from '../../src/lib/seasonLifecycle';
import {createPersonalPass} from '../../src/lib/personalPass';

/** Validation-only mock season. Never replaces or extends the homepage schedule. */
export function seasonSeriesFixture():Game[]{
 const first=mockGames.filter(g=>g.id.match(/^hou-[1-5]$/));
 const opponents=teams.filter(t=>t.id!=='HOU');
 const last=Date.parse(first.at(-1)!.startsAt);
 return [...first,...Array.from({length:77},(_,i)=>{
  const gameNumber=i+6,opponent=opponents[i%opponents.length],home=gameNumber%2===1,start=last+(i+1)*2*86400000;
  return {id:`hou-series-${String(gameNumber).padStart(2,'0')}`,home:home?'HOU':opponent.id,away:home?opponent.id:'HOU',startsAt:new Date(start).toISOString(),estimatedEndTime:new Date(start+3*3600000).toISOString(),venue:home?'丰田中心':`${opponent.city}主场球馆`,seasonId:DEMO_SEASON.id,gameNumbers:{HOU:gameNumber}};
 })];
}
export function seriesPass(index:number,now:Date,location={city:'东京',timezone:'Asia/Tokyo'}){
 const games=seasonSeriesFixture(),archive=archiveFinishedGames({},games,'HOU',DEMO_SEASON,now);
 return createPersonalPass({passId:'0147',teamCode:'HOU',game:games[index],games,now,archive,...location});
}
