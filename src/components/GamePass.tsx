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
import {resolvePassPresentation,type PassEventState} from '@/lib/passPresentation';
import {EditorialPass} from './art-directions/EditorialPass';
import {InstrumentPass} from './art-directions/InstrumentPass';
import {CollectiblePass} from './art-directions/CollectiblePass';
import {PrecisionCollectiblePass} from './PrecisionCollectiblePass';

export type GamePassVariant='full'|'compact'|'collection'|'precision'|'editorial'|'instrument'|'collectible';
/** Future viewing records must be supplied explicitly; selecting a city never claims a watched game. */
export type PassCommemoration={readonly score?:{readonly team:number;readonly opponent:number};readonly watchedFrom?:string};
export function GamePass({pass,enclosure='none',variant='full',issuance,commemoration,event}:{pass:PersonalPass;isToday?:boolean;enclosure?:'mobile'|'none';variant?:GamePassVariant;issuance?:string|null;commemoration?:PassCommemoration;event?:PassEventState}) {
 if(variant==='precision')return <PrecisionCollectiblePass pass={pass} issuance={issuance} event={event} commemoration={commemoration}/>;
 if(variant==='editorial')return <EditorialPass pass={pass}/>;
 if(variant==='instrument')return <InstrumentPass pass={pass}/>;
 if(variant==='collectible')return <CollectiblePass pass={pass}/>;
 const {team,game,location,status}=pass;
 const presentation=resolvePassPresentation(pass,event??(status.phase==='archived'&&commemoration?.score?{state:'final',score:commemoration.score}:undefined));
 const active=status.phase==='game_day';
 const label=status.phase==='archived'?'比赛已收藏':active?'今天有比赛':status.phase==='next_up'?'下一场比赛':'未来赛程';
 return <section className={`hero personal-pass${enclosure==='mobile'?' has-mobile-enclosure':''}${active?' is-matchday':''}`} aria-label={`${team.code} 对阵 ${game.opponentCode} 比赛通行证 · GAME ${game.gameNumber??'—'} / ${pass.season.totalGames} · ${pass.user.passId?presentation.label:'PREVIEW'}`} data-dna={PASS_DNA.version} data-game-id={game.id} data-team={team.code} data-season={pass.season.seasonId} data-city-id={location.cityId} data-timezone={location.timezone} data-lifecycle={pass.user.passId?presentation.state:'preview'} data-collected-games={pass.season.collectedGames} data-pass-status={status.phase} data-pass-energy={status.energy} data-pass-variant={variant} data-issuance={issuance||undefined} style={{...teamMaterialProperties(team),...passDNAProperties()} as CSSProperties}>
  {enclosure==='mobile'&&<MobilePassEnclosure/>}
  <div className="ticket-object"><span className="ticket-paper" aria-hidden="true"/>
  <MainTicket teamId={team.code}>
   <div className="hero-top">
    <div className="date-lockup" data-pass-layer="date"><TicketMicroLabel className="pass-label">NBA / GAME PASS</TicketMicroLabel><div className="pass-date"><strong><NumericValue value={location.day}/></strong><div><b>{location.month}</b><span className="pass-year">{location.dateKey.slice(0,4)}</span></div></div><span className="pass-weekday">{location.weekday}</span></div>
    <div className="game-status" data-pass-layer="game-status"><TicketMicroLabel>{status.label}</TicketMicroLabel><SportsSignal type={active?'active':status.phase==='archived'?'completed':status.phase==='next_up'?'next':'inactive'} label={label}/></div>
   </div>
   <div className="match" data-pass-layer="match"><TeamIdentityBlock team={getTeam(team.code)}/><span className="versus" aria-label="对阵"><svg className="match-line" viewBox="0 0 72 112" aria-hidden="true"><path d="M14 55H58"/></svg></span><TeamIdentityBlock team={getTeam(game.opponentCode)}/></div>
   <span className="match-result" data-pass-layer="result">{presentation.score?`${presentation.state==='live'?'LIVE':'FINAL'} · ${presentation.score.team} — ${presentation.score.opponent}${presentation.state==='live'&&presentation.period?` · ${presentation.period}${presentation.clock?` · ${presentation.clock}`:''}`:''}`:null}</span>
   <TimeRoute pass={pass}/>
   <div className="tipoff" data-pass-layer="timing"><div className="tipoff-time"><QuietValue value={location.localTime} numeric/></div><div className="time-caption"><TicketMicroLabel>LOCAL TIME</TicketMicroLabel><span><QuietValue value={`${location.city} · ${location.offset}`}/></span></div></div>
   <div className="venue-detail" data-pass-layer="venue"><span className="venue-status"><TicketMicroLabel>{game.homeAway}</TicketMicroLabel></span><span className="venue-name">{game.venue}</span></div>
  </MainTicket>
  <TicketStub pass={pass} lifecycle={presentation.label} watchedFrom={status.phase==='archived'?commemoration?.watchedFrom:undefined}/>
  {issuance&&<span className="pass-issued-note" role="status" aria-live="polite" aria-label={`PASS ${pass.user.passId} ISSUED`}>PASS ISSUED</span>}
  <TicketJoin/><SeasonSpine gameNumber={game.gameNumber} total={pass.season.totalGames}/>
  </div><TicketCutEdges/>
 </section>;
}
