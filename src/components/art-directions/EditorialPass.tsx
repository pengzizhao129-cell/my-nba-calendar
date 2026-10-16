import {useId} from 'react';
import type {PersonalPass} from '@/lib/personalPass';
import {getTeam} from '@/data/teams';
import {TeamSymbol} from '../TeamIdentity';
import {getTeamIdentity,teamMaterialProperties} from '@/data/teamIdentities';
import type {CSSProperties} from 'react';
import {ArtPassFrame,ArtTiming,ArtSerial,ArtSeasonEdge,ArtTimeScale,artVenue,artCountry} from './ArtPassPrimitives';

/** A print composition, rather than a rearrangement of the production ticket grid. */
export function EditorialPass({pass}:{pass:PersonalPass}) {
 const silhouette=useId();
 const home=getTeam(pass.team.code),opponent=getTeam(pass.game.opponentCode);
 const gameNumber=pass.game.gameNumber===null?'—':String(pass.game.gameNumber).padStart(2,'0');
 return <ArtPassFrame pass={pass} direction="editorial">
  <svg className="editorial-outline" width="0" height="0" aria-hidden="true"><defs><clipPath id={silhouette} clipPathUnits="objectBoundingBox"><path d="M.0055 0H.9945Q1 0 1 .007V.8038A.01236 .015625 0 0 0 1 .8351V.993Q1 1 .9945 1H.0055Q0 1 0 .993V.8351A.01236 .015625 0 0 0 0 .8038V.007Q0 0 .0055 0Z"/></clipPath></defs></svg>
  <div className="art-surface editorial-paper" style={{clipPath:`url(#${silhouette})`}}>
   <div className="editorial-main">
    <div className="editorial-date" data-art-layer="date"><strong>{pass.location.day}<span>{pass.location.month}</span></strong><span>{pass.location.dateKey.slice(0,4)}</span></div>
    <div className="editorial-edition"><span>NBA / GAME PASS</span><span>{pass.game.homeAway} / {artVenue(pass)}</span></div>
    <svg className="editorial-court" viewBox="0 0 728 230" fill="none" aria-hidden="true"><path d="M-16 126H744"/><circle cx="524" cy="126" r="88"/><path className="editorial-court-register" d="M524 25V37M524 215V227"/></svg>
    <div className="editorial-team editorial-team--own" data-art-layer="team"><strong>{home.abbr}</strong><span><TeamSymbol team={home}/>{home.city}{home.name}</span></div>
    <div className="editorial-team editorial-team--opponent" data-art-layer="opponent" style={teamMaterialProperties(getTeamIdentity(opponent.id)!) as CSSProperties}><strong>{opponent.abbr}</strong><span><TeamSymbol team={opponent}/>{opponent.city}{opponent.name}</span></div>
    <div className="editorial-time-instrument" data-art-layer="instrument"><ArtTimeScale pass={pass}/></div>
    <div className="editorial-timing" data-art-layer="timing"><ArtTiming pass={pass}/></div>
    <div className="editorial-location" data-art-layer="location"><span>{pass.location.cityName}<small> · {artCountry(pass)}</small></span><small>{pass.location.offset}</small></div>
   </div>
   <div className="editorial-stub" aria-label="可拆卸收藏副券">
    <svg className="editorial-perforation" viewBox="0 0 728 8" aria-hidden="true"><path className="editorial-perforation-light" d="M13 5H345M381 5H715"/><path d="M13 3H345M381 3H715"/><path className="editorial-bridge" d="M356 1V7M353 4H359"/></svg>
    <div className="editorial-game-index"><strong>{gameNumber}<span> / {pass.season.totalGames}</span></strong><span>GAME / SEASON {pass.season.seasonCode}</span></div>
    <span className="editorial-pass-id">PASS {pass.user.passId??'————'}<small>{pass.user.passId?'ISSUED':''}</small></span>
    <div className="editorial-personal-serial"><ArtSerial pass={pass}/></div>
    <div className="editorial-season-edge"><ArtSeasonEdge pass={pass}/></div>
   </div>
  </div>
 </ArtPassFrame>;
}
