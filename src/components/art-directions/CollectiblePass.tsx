import {useId} from 'react';
import type {PersonalPass} from '@/lib/personalPass';
import {getTeam} from '@/data/teams';
import {TeamSymbol} from '@/components/TeamIdentity';
import {getTeamIdentity,teamMaterialProperties} from '@/data/teamIdentities';
import type {CSSProperties} from 'react';
import {
 ArtPassFrame, ArtTiming, ArtSerial, ArtSeasonEdge, ArtTimeScale,
 ArtMatchMark, artVenue, artCountry,
} from './ArtPassPrimitives';

/** C treats the right-hand print as a detachable, numbered object in its own right.
 * The event and personal issue remain one data snapshot; no display-only fixture
 * or alternative identity is created for this art direction. */
export function CollectiblePass({pass}:{pass:PersonalPass}) {
 const clipId=`collectible-stock-${useId().replaceAll(':','')}`;
 const team=getTeam(pass.team.code),opponent=getTeam(pass.game.opponentCode);
 const ordinal=pass.game.gameNumber===null?'—':String(pass.game.gameNumber).padStart(2,'0');
 const year=pass.location.dateKey.slice(0,4);
 const silhouette='M3 0H486C486 8 492 12 500 12S514 8 514 0H725Q728 0 728 3V573Q728 576 725 576H516C516 566 509 560 500 560S484 566 484 576H3Q0 576 0 573V3Q0 0 3 0Z';

 return <ArtPassFrame pass={pass} direction="collectible"><div className="art-surface">
  <svg className="c-stock" viewBox="0 0 728 576" aria-hidden="true">
   <defs><clipPath id={clipId}><path d={silhouette}/></clipPath></defs>
   <g clipPath={`url(#${clipId})`}>
    <path d={silhouette} className="c-stock-main"/>
    <path d="M500 0H728V576H500Z" className="c-stock-stub"/>
    <path d="M0 0H58V576H0Z" className="c-stock-ink"/>
    <path d="M500 0H728V48H500Z" className="c-stock-ink"/>
   </g>
   <path d={silhouette} className="c-stock-edge"/>
   <g className="c-perforation">
    {Array.from({length:66},(_,index)=>18+index*8.2).filter(y=>y<284||y>310).map(y=><g key={y}><path d={`M499 ${y}v2.5`}/><path className="c-punch-light" d={`M500 ${y+.4}v2.5`}/></g>)}
   </g>
   <g className="c-bridge"><path d="M496 292h8m-4-4v8"/><path className="c-bridge-light" d="M496 293h8m-3-5v8"/></g>
   <g className="c-registration"><path d="M82 74h8m-4-4v8M464 74h8m-4-4v8M82 510h8m-4-4v8M464 510h8m-4-4v8"/></g>
  </svg>

  <div className="c-rail" aria-hidden="true"><span className="c-rail-brand">MG+</span><span className="c-rail-code">{pass.team.code}</span><span className="c-rail-home">{pass.game.homeAway}</span></div>

  <div className="c-main" data-ticket-section="main">
   <div className="c-ticket-label">NBA <span>GAME PASS</span></div>
   <div className="c-date" data-art-layer="date"><strong>{pass.location.day}</strong><span>{pass.location.month}<small>{year}</small></span></div>

   <div className="c-match" aria-label={`${pass.team.code} versus ${pass.game.opponentCode}`}>
    <div className="c-club c-club--team" data-art-layer="team"><strong>{pass.team.code}</strong><span><TeamSymbol team={team}/>{team.city}{team.name}</span></div>
    <ArtMatchMark className="c-match-line"/>
    <div className="c-club c-club--opponent" data-art-layer="opponent" style={teamMaterialProperties(getTeamIdentity(opponent.id)!) as CSSProperties}><strong>{pass.game.opponentCode}</strong><span><TeamSymbol team={opponent}/>{opponent.city}{opponent.name}</span></div>
   </div>

   <div className="c-city" data-art-layer="location"><span>WATCHING FROM</span><strong>{pass.location.cityName} <small>· {artCountry(pass)}</small></strong></div>
   <div className="c-clock" data-art-layer="timing"><ArtTiming pass={pass}/><span>{pass.location.offset}</span></div>
   <div className="c-world-time" data-art-layer="instrument"><ArtTimeScale pass={pass}/></div>
   <div className="c-venue"><span>{pass.game.homeAway}</span><strong>{artVenue(pass)}</strong></div>
  </div>

  <div className="c-stub" data-ticket-section="stub">
   <div className="c-stub-title">MYGAME+ <span>PERSONAL ISSUE</span></div>
   <div className="c-game-index"><span>GAME</span><strong>{ordinal}<small>/ {pass.season.totalGames}</small></strong></div>
   <div className="c-season"><span>SEASON</span><strong>{pass.game.seasonCode.replace('–','—')}</strong></div>
   <div className="c-pass-id"><span>PASS</span><strong>{pass.user.passId??'————'}</strong></div>
   <div className="c-serial"><ArtSerial pass={pass}/></div>
   <div className="c-stub-reference">{pass.team.code}—{pass.game.opponentCode}<br/><span>{pass.location.day} {pass.location.month} {year}</span></div>
  </div>

  <div className="c-season-edge"><ArtSeasonEdge pass={pass}/></div>
 </div></ArtPassFrame>;
}
