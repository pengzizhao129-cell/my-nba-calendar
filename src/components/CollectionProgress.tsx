import type {PersonalPass} from '@/lib/personalPass';
import {resolveTicketMilestone} from '@/lib/seasonMilestones';

export function CollectionProgress({pass}:{pass:PersonalPass}){
 const {game,season,status}=pass;
 const milestone=resolveTicketMilestone({gameNumber:game.gameNumber,collectedGames:season.collectedGames,totalGames:season.totalGames,collected:status.phase==='archived'});
 return <div className="collection-progress" data-pass-layer="collection-progress">
  <span className="collection-count">{String(season.collectedGames).padStart(2,'0')} / {season.totalGames} COLLECTED</span>
  <span className="ticket-milestone" data-milestone={milestone??undefined}>{milestone?.toUpperCase()}</span>
 </div>;
}
