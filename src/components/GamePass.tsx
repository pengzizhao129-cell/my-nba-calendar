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
import {CollectibleSpine,TicketJoin,TicketCutEdges} from './PassArchitecture';
import {PASS_DNA,passDNAProperties} from '@/lib/passDNA';
import {MobilePassEnclosure} from './MobilePassEnclosure';

export function GamePass({pass,enclosure='mobile'}:{pass:PersonalPass;isToday?:boolean;enclosure?:'mobile'|'none'}) {
 const {team,game,location,status}=pass;
 const active=status.phase==='game_day';
 const label=status.phase==='archived'?'比赛已收藏':active?'今天有比赛':status.phase==='next_up'?'下一场比赛':'未来赛程';
 return <section className={`hero personal-pass${enclosure==='mobile'?' has-mobile-enclosure':''}${active?' is-matchday':''}`} aria-label={`${team.code} 对阵 ${game.opponentCode} 比赛通行证`} data-dna={PASS_DNA.version} data-game-id={game.id} data-team={team.code} data-season={pass.season.seasonId} data-collected-games={pass.season.collectedGames} data-pass-status={status.phase} data-pass-energy={status.energy} style={{...teamMaterialProperties(team),...passDNAProperties()} as CSSProperties}>
  {enclosure==='mobile'&&<MobilePassEnclosure/>}
  <div className="ticket-object"><span className="ticket-paper" aria-hidden="true"/>
  <MainTicket teamId={team.code}>
   <div className="hero-top">
    <div className="date-lockup" data-pass-layer="date"><TicketMicroLabel className="pass-label">GAME PASS</TicketMicroLabel><div className="pass-date"><strong><NumericValue value={location.day}/></strong><div><b>{location.month}</b></div></div><span className="pass-weekday">{location.weekday}<small> · {location.weekdayEnglish}</small></span></div>
    <div className="game-status" data-pass-layer="game-status"><TicketMicroLabel>{status.label}</TicketMicroLabel><SportsSignal type={active?'active':status.phase==='archived'?'completed':status.phase==='next_up'?'next':'inactive'} label={label}/></div>
   </div>
   <div className="match" data-pass-layer="match"><TeamIdentityBlock team={getTeam(team.code)}/><span className="versus">VS</span><TeamIdentityBlock team={getTeam(game.opponentCode)}/></div>
   <div className="tipoff" data-pass-layer="timing"><div className="tipoff-time"><QuietValue value={location.localTime} numeric/></div><div className="time-caption"><TicketMicroLabel>LOCAL TIME</TicketMicroLabel><span><QuietValue value={`${location.city} · ${location.offset}`}/></span></div></div>
   <div className="venue-detail" data-pass-layer="venue"><span className="venue-status"><TicketMicroLabel>{game.homeAway}</TicketMicroLabel><span> · {game.homeAway==='HOME'?'主场':'客场'}</span></span><span className="venue-name">{game.venue}</span></div>
  </MainTicket>
  <TicketStub pass={pass}/>
  <TicketJoin/><CollectibleSpine/>
  </div><TicketCutEdges/>
 </section>;
}
