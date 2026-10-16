import type {CSSProperties} from 'react';
import {getTeam} from '@/data/teams';
import type {PersonalPass} from '@/lib/personalPass';
import {teamMaterialProperties} from '@/data/teamIdentities';
import {TeamIdentityBlock} from './TeamIdentity';
import {NumericValue} from './NumericValue';
import {QuietValue} from './QuietValue';
import {SportsSignal} from './SportsSignal';
import {TicketMicroLabel} from './TicketMicroLabel';
import {MainTicket} from './MainTicket';
import {TicketStub} from './TicketStub';

export function GamePass({pass,isToday}:{pass:PersonalPass;isToday:boolean}) {
 const {team,game,location,status}=pass;
 const active=status.phase==='game-day'||status.phase==='started';
 const label=status.phase==='finished'?'比赛已结束':isToday?'今天有比赛':active?'即将开赛':'下一场比赛';
 return <section className={`hero personal-pass${active?' is-matchday':''}`} data-game-id={game.id} data-team={team.code} data-season={pass.season.id} data-pass-status={status.phase} style={teamMaterialProperties(team) as CSSProperties}>
  <MainTicket teamId={team.code}>
   <div className="hero-top">
    <div className="date-lockup" data-pass-layer="date"><TicketMicroLabel className="pass-label">GAME PASS</TicketMicroLabel><div className="pass-date"><strong><NumericValue value={location.day}/></strong><div><b>{location.month}</b></div></div><span className="pass-weekday">{location.weekday}<small> · {location.weekdayEnglish}</small></span></div>
    <div className="game-status" data-pass-layer="game-status"><TicketMicroLabel>{status.phase==='finished'?'GAME RECORD':active?'GAME DAY':'NEXT GAME'}</TicketMicroLabel><SportsSignal type={active?'active':status.phase==='finished'?'completed':'inactive'} label={label}/></div>
   </div>
   <div className="match" data-pass-layer="match"><TeamIdentityBlock team={getTeam(team.code)}/><span className="versus">VS</span><TeamIdentityBlock team={getTeam(game.opponentCode)}/></div>
   <div className="tipoff" data-pass-layer="timing"><div className="tipoff-time"><QuietValue value={location.localTime} numeric/></div><div className="time-caption"><TicketMicroLabel>LOCAL TIME</TicketMicroLabel><span><QuietValue value={`${location.city} · ${location.offset}`}/></span></div></div>
   <div className="venue-detail" data-pass-layer="venue"><span className="venue-status"><TicketMicroLabel>{game.homeAway}</TicketMicroLabel><span> · {game.homeAway==='HOME'?'主场':'客场'}</span></span><span className="venue-name">{game.venue}</span></div>
  </MainTicket>
  <TicketStub pass={pass}/>
 </section>;
}
