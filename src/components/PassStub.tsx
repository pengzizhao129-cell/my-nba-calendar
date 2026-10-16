import {formatPassRecord,type PassIdentity,type PassCollection} from '@/lib/passDesign';
import {PassSecurity} from './PassSecurity';

export function PassStub({identity,collection,teamId,opponentId}:{identity:PassIdentity;collection?:PassCollection;teamId:string;opponentId:string}) {
 return <div className="ticket-stub" aria-label="赛事副券">
  <PassSecurity teamId={teamId} region="stub"/>
  <div className="collection-stack" aria-label="通行证收藏记录">{formatPassRecord(identity,collection).map(line=><span key={line}>{line}</span>)}</div>
  <span className="eyebrow ticket-number">MG+ / {teamId}–{opponentId}{collection?` / ${String(collection.gameNumber).padStart(2,'0')}`:''}</span>
 </div>;
}
