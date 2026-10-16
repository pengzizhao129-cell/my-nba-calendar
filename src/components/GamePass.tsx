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
import {TicketJoin,TicketCutEdges} from './PassArchitecture';
import {SeasonSpine} from './SeasonSpine';
import {TimeRoute} from './TimeRoute';
import {PASS_DNA,passDNAProperties} from '@/lib/passDNA';
import {MobilePassEnclosure} from './MobilePassEnclosure';

export type GamePassVariant='full'|'compact'|'collection';
/** Future viewing records must be supplied explicitly; selecting a city never claims a watched game. */
export type PassCommemoration={readonly score?:{readonly team:number;readonly opponent:number};readonly watchedFrom?:string};
export function GamePass({pass,enclosure='none',variant='full',issuance,commemoration}:{pass:PersonalPass;isToday?:boolean;enclosure?:'mobile'|'none';variant?:GamePassVariant;issuance?:string|null;commemoration?:PassCommemoration}) {
 const {team,game,location,status}=pass;
 const active=status.phase==='game_day';
 const label=status.phase==='archived'?'比赛已收藏':active?'今天有比赛':status.phase==='next_up'?'下一场比赛':'未来赛程';
 return <section className={`hero personal-pass${enclosure==='mobile'?' has-mobile-enclosure':''}${active?' is-matchday':''}`} aria-label={`${team.code} 对阵 ${game.opponentCode} 比赛通行证 · GAME ${game.gameNumber??'—'} / ${pass.season.totalGames} · ${status.label}`} data-dna={PASS_DNA.version} data-game-id={game.id} data-team={team.code} data-season={pass.season.seasonId} data-collected-games={pass.season.collectedGames} data-pass-status={status.phase} data-pass-energy={status.energy} data-pass-variant={variant} data-issuance={issuance||undefined} style={{...teamMaterialProperties(team),...passDNAProperties()} as CSSProperties}>
  {enclosure==='mobile'&&<MobilePassEnclosure/>}
  <div className="ticket-object"><span className="ticket-paper" aria-hidden="true"/>
  <MainTicket teamId={team.code}>
   <div className="hero-top">
    <div className="date-lockup" data-pass-layer="date"><TicketMicroLabel className="pass-label">NBA / GAME PASS</TicketMicroLabel><div className="pass-date"><strong><NumericValue value={location.day}/></strong><div><b>{location.month}</b><span className="pass-year">{location.dateKey.slice(0,4)}</span></div></div><span className="pass-weekday">{location.weekday}</span></div>
    <div className="game-status" data-pass-layer="game-status"><TicketMicroLabel>{status.label}</TicketMicroLabel><SportsSignal type={active?'active':status.phase==='archived'?'completed':status.phase==='next_up'?'next':'inactive'} label={label}/></div>
   </div>
   <div className="match" data-pass-layer="match"><TeamIdentityBlock team={getTeam(team.code)}/><span className="versus" aria-label="对阵">—</span><TeamIdentityBlock team={getTeam(game.opponentCode)}/></div>
   <span className="match-result" data-pass-layer="result">{status.phase==='archived'&&commemoration?.score&&`FINAL · ${commemoration.score.team} — ${commemoration.score.opponent}`}</span>
   <TimeRoute pass={pass}/>
   <div className="tipoff" data-pass-layer="timing"><div className="tipoff-time"><QuietValue value={location.localTime} numeric/></div><div className="time-caption"><TicketMicroLabel>LOCAL TIME</TicketMicroLabel><span><QuietValue value={`${location.city} · ${location.offset}`}/></span></div></div>
   <div className="venue-detail" data-pass-layer="venue"><span className="venue-status"><TicketMicroLabel>{game.homeAway}</TicketMicroLabel></span><span className="venue-name">{game.venue}</span></div>
  </MainTicket>
  <TicketStub pass={pass} watchedFrom={status.phase==='archived'?commemoration?.watchedFrom:undefined}/>
  {issuance&&<span className="pass-issued-note" role="status" aria-live="polite" aria-label={`PASS ${pass.user.passId} ISSUED`}>PASS ISSUED</span>}
  <TicketJoin/><SeasonSpine gameNumber={game.gameNumber} total={pass.season.totalGames}/>
  </div><TicketCutEdges/>
 </section>;
}
