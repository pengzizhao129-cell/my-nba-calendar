import type {CSSProperties,ReactNode} from 'react';
import type {PersonalPass} from '@/lib/personalPass';
import {teamMaterialProperties} from '@/data/teamIdentities';
import {personalPassReference} from '@/lib/ticketIdentity';
import {TimingNumber} from '../TimingNumber';

export type ArtDirection='editorial'|'instrument'|'collectible';
export const ART_DIRECTIONS:readonly ArtDirection[]=['editorial','instrument','collectible'];
export const ART_DIRECTION_LABELS={editorial:'EDITORIAL SPORTS TICKET',instrument:'PRECISION TIME INSTRUMENT',collectible:'MODERN COLLECTIBLE STUB'} as const;

/** Six printed places, preserving the existing personal event identity. */
export function artIssue(pass:PersonalPass){return personalPassReference(pass)?.serial.padStart(6,'0')??'——————';}
export function artCountry(pass:PersonalPass){return pass.location.countryCode==='GB'?'UK':pass.location.countryCode;}
export function artVenue(pass:PersonalPass){
 const names:Record<string,string>={'丰田中心':'TOYOTA CENTER','大通中心':'CHASE CENTER','波尔球馆':'BALL ARENA'};
 return names[pass.game.venue]??pass.game.venue;
}
export function artClockMinutes(pass:PersonalPass){
 const match=/^(\d{2}):(\d{2})$/.exec(pass.location.localTime);
 if(!match||Number(match[1])>23||Number(match[2])>59)throw new RangeError('Time instrument requires a valid local 24-hour time');
 return Number(match[1])*60+Number(match[2]);
}

/** Each composition owns its drawing. No production-ticket geometry is imposed. */
export function ArtPassFrame({pass,direction,children}:{pass:PersonalPass;direction:ArtDirection;children:ReactNode}){
 const reference=personalPassReference(pass);
 return <section className={`art-pass art-pass--${direction}`} data-art-direction={direction} data-game-id={pass.game.id} data-team={pass.team.code} data-opponent={pass.game.opponentCode} data-pass-id={pass.user.passId??''} data-personal-issue={reference?artIssue(pass):''} data-reference={reference?.full} data-season={pass.game.seasonId} data-game-number={pass.game.gameNumber??''} data-city-id={pass.location.cityId} data-timezone={pass.location.timezone} data-local-time={pass.location.localTime} data-gmt={pass.location.offset} data-pass-status={pass.status.phase} aria-label={`${pass.team.code} — ${pass.game.opponentCode}, ${pass.location.day} ${pass.location.month} ${pass.location.dateKey.slice(0,4)}, ${pass.location.cityName} ${pass.location.localTime} ${pass.location.offset}, ${pass.user.passId?`personal issue ${artIssue(pass)}`:'preview'}`} style={teamMaterialProperties(pass.team) as CSSProperties}>{children}</section>;
}

export function ArtTiming({pass}:{pass:PersonalPass}){return <span className="art-timing" data-local-time={pass.location.localTime}><TimingNumber value={pass.location.localTime}/></span>;}
export function ArtSerial({pass}:{pass:PersonalPass}){return <span className="art-serial" data-art-layer="serial"><small>MG+ Nº</small><strong data-issue-number={pass.user.passId?artIssue(pass):undefined}>{artIssue(pass)}</strong></span>;}

/** 82 independent event positions. The season is a physical lower edge. */
export function ArtSeasonEdge({pass,signalRole}:{pass:PersonalPass;signalRole?:string}){
 const total=pass.season.totalGames;
 return <div className="art-season-edge" aria-label={`赛季比赛位置 ${pass.game.gameNumber??'—'} / ${total}`}><svg viewBox="0 0 640 28" preserveAspectRatio="none" aria-hidden="true">{Array.from({length:total},(_,i)=>{const ordinal=i+1,x=2+i*636/Math.max(1,total-1),active=ordinal===pass.game.gameNumber;return <line key={ordinal} data-season-tick={ordinal} data-current={active||undefined} data-signal-role={active?signalRole:undefined} x1={x} x2={x} y1={active?3:ordinal%10===0?8:ordinal%5===0?13:18} y2="25"/>;})}</svg><span className="art-season-ordinal">{pass.game.gameNumber===null?'—':String(pass.game.gameNumber).padStart(2,'0')} / {total}</span></div>;
}

/** A 24h clock scale; position means local clock time, never geographic distance. */
export function ArtTimeScale({pass}:{pass:PersonalPass;mode?:'linear'|'arc'}){
 const minute=artClockMinutes(pass),x=12+minute/1440*456;
 return <svg className="art-time-scale" viewBox="0 0 480 44" preserveAspectRatio="none" data-local-minute={minute} data-art-layer="time-scale" role="img" aria-label={`24 小时标尺，当地 ${pass.location.localTime}`}>
  <path className="art-scale-rule" d="M12 12H468"/>
  {Array.from({length:25},(_,hour)=>{const tickX=12+hour/24*456;return <g key={hour}><path className="art-scale-tick" d={`M${tickX} ${hour%3===0?6:9}V17`}/>{hour%3===0&&<text x={tickX} y="35" textAnchor="middle">{String(hour).padStart(2,'0')}</text>}</g>;})}
  <path className="art-scale-marker" data-time-marker="true" d={`M${x-3} 2H${x+3}V9H${x-3}Z`}/><path className="art-scale-hairline" d={`M${x} 9V21`}/>
 </svg>;
}

/** Match Line derives its interruption from basketball's centre line and circle. */
export function ArtMatchMark({className=''}:{className?:string}){
 return <svg className={`art-match-mark ${className}`} viewBox="0 0 160 48" fill="none" aria-hidden="true" data-sports-geometry="center-court"><path d="M0 24H62M98 24H160M80 0V48"/><circle cx="80" cy="24" r="18"/></svg>;
}
