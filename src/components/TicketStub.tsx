import type {PersonalPass} from '@/lib/personalPass';
import {PassId} from './PassId';
import {GameNumber} from './GameNumber';
import {SeasonCode} from './SeasonCode';
import {TeamSecurityPattern} from './TeamSecurityPattern';
import {EmotionMark} from './EmotionMark';
import {CollectionProgress} from './CollectionProgress';
import {SerialMark} from './SerialMark';

export function TicketStub({pass,watchedFrom}:{pass:PersonalPass;watchedFrom?:string}) {
 return <div className="ticket-stub" aria-label="赛事副券">
  <TeamSecurityPattern teamId={pass.team.code} region="stub"/>
  <span className="issue-state" data-pass-layer="issue-state">{pass.user.passId?(pass.status.phase==='archived'?'COLLECTED':'ISSUED'):''}</span>
  <div className="collection-stack" aria-label="通行证收藏记录"><PassId value={pass.user.passId}/><GameNumber value={pass.game.gameNumber} total={pass.season.totalGames}/><SeasonCode value={pass.season.seasonCode}/></div>
  <EmotionMark status={pass.status}/>
  <CollectionProgress pass={pass}/>
  <SerialMark pass={pass}/>
  <span className="watched-from" data-pass-layer="watched-from" data-reserved={!watchedFrom||undefined}>{watchedFrom&&`WATCHED FROM ${watchedFrom.toUpperCase()}`}</span>
  <span className="eyebrow ticket-number" data-pass-layer="serial">MG+ / {pass.team.code}–{pass.game.opponentCode} / {pass.game.gameNumber===null?'—':String(pass.game.gameNumber).padStart(2,'0')}</span>
 </div>;
}
