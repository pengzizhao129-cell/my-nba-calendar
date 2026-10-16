import type {PersonalPass} from '@/lib/personalPass';
import {PassId} from './PassId';
import {GameNumber} from './GameNumber';
import {SeasonCode} from './SeasonCode';
import {TeamSecurityPattern} from './TeamSecurityPattern';
import {EmotionMark} from './EmotionMark';

export function TicketStub({pass}:{pass:PersonalPass}) {
 return <div className="ticket-stub" aria-label="赛事副券">
  <TeamSecurityPattern teamId={pass.team.code} region="stub"/>
  <div className="collection-stack" aria-label="通行证收藏记录"><PassId value={pass.user.passId}/><GameNumber value={pass.game.gameNumber} total={pass.season.totalGames}/><SeasonCode value={pass.season.seasonCode}/></div>
  <EmotionMark status={pass.status}/>
  <span className="eyebrow ticket-number" data-pass-layer="serial">MG+ / {pass.team.code}–{pass.game.opponentCode} / {pass.game.gameNumber===null?'—':String(pass.game.gameNumber).padStart(2,'0')}</span>
 </div>;
}
