import {useId, type CSSProperties} from 'react';
import {getTeam} from '@/data/teams';
import {teamMaterialProperties} from '@/data/teamIdentities';
import type {PersonalPass} from '@/lib/personalPass';
import {personalPassReference} from '@/lib/ticketIdentity';
import {resolvePassPresentation, type PassEventState} from '@/lib/passPresentation';
import {QuietValue} from './QuietValue';
import {EmotionMark} from './EmotionMark';
import {ArtSeasonEdge, artClockMinutes, artCountry, artIssue, artVenue} from './art-directions/ArtPassPrimitives';
import type {PassCommemoration} from './GamePass';

/** Physical constants belong to the artifact, never to its team, city or state. */
export const PRECISION_PASS_DNA = Object.freeze({
 version:'MG-P4.1', width:728, height:576, join:520, bridgeY:288,
 silhouette:'M4 0H508C508 7 513 11 520 11S532 7 532 0H724Q728 0 728 4V572Q728 576 724 576H536C536 566 529 560 520 560S504 566 504 576H4Q0 576 0 572V4Q0 0 4 0Z',
 clock:Object.freeze({x:278,y:388,radius:116,labelRadius:143,start:135,sweep:270}),
});

/** A material window, not a second ticket template. Existing printing stays put. */
export const PRECISION_INK_WINDOW = Object.freeze({x:32,y:278,width:488,height:232});

export function precisionClockAngle(minutes:number){return PRECISION_PASS_DNA.clock.start+minutes/1440*PRECISION_PASS_DNA.clock.sweep;}
function point(radius:number,angle:number){
 const {x,y}=PRECISION_PASS_DNA.clock,theta=angle*Math.PI/180;
 return {x:x+radius*Math.cos(theta),y:y+radius*Math.sin(theta)};
}
function clockArc(radius:number,from:number,to:number){
 const a=point(radius,from),b=point(radius,to);
 return `M${a.x} ${a.y}A${radius} ${radius} 0 ${to-from>180?1:0} 1 ${b.x} ${b.y}`;
}

/** A printed wall-clock index. Position is local minutes, not a map or progress. */
export function PrecisionTimeInstrument({pass}:{pass:PersonalPass}){
 const id=useId().replaceAll(':',''),print=`pc-index-print-${id}`,signal=`pc-index-signal-${id}`;
 const minutes=artClockMinutes(pass),angle=precisionClockAngle(minutes);
 const inner=point(109,angle),outer=point(131,angle),cap=point(135,angle);
 const top=PRECISION_INK_WINDOW.y/576,bottom=(PRECISION_INK_WINDOW.y+PRECISION_INK_WINDOW.height)/576;
 return <svg className="pc-time-instrument" viewBox="0 0 728 576" role="img" aria-label={`24 小时时标 · ${pass.location.cityName} ${pass.location.localTime}`} data-local-minute={minutes} data-clock-minutes={minutes} data-clock-angle={angle} style={{'--pc-index-print':`url(#${print})`,'--pc-index-signal':`url(#${signal})`} as CSSProperties}>
  <defs>{[[print,'print'],[signal,'signal']].map(([key,role])=><linearGradient key={key} id={key} x1="0" x2="0" y1="0" y2="576" gradientUnits="userSpaceOnUse"><stop className={`pc-${role}-paper`} offset="0"/><stop className={`pc-${role}-paper`} offset={top}/><stop className={`pc-${role}-ink`} offset={top}/><stop className={`pc-${role}-ink`} offset={bottom}/><stop className={`pc-${role}-paper`} offset={bottom}/><stop className={`pc-${role}-paper`} offset="1"/></linearGradient>)}</defs>
  <path className="pc-clock-track" d={clockArc(116,135,405)}/>
  {Array.from({length:49},(_,index)=>{
   const theta=precisionClockAngle(index*30),major=index%6===0,hour=index%2===0;
   const a=point(major?120:hour?123:125,theta),b=point(major?132:129,theta),label=point(143,theta);
   return <g key={index}><path className={`pc-clock-tick${major?' is-major':''}`} d={`M${a.x} ${a.y}L${b.x} ${b.y}`}/>{major&&<text x={label.x} y={label.y} dominantBaseline="central" textAnchor="middle">{String(index/2).padStart(2,'0')}</text>}</g>;
  })}
  <g key={minutes} className="pc-clock-marker" data-time-marker="local-clock" data-signal-role="time-index" data-value={minutes}><path d={`M${inner.x} ${inner.y}L${outer.x} ${outer.y}`}/><rect x={cap.x-2.1} y={cap.y-2.1} width="4.2" height="4.2" transform={`rotate(${angle} ${cap.x} ${cap.y})`}/></g>
 </svg>;
}

/** C supplies the physical stock; B supplies the information engraved into it.
 * No city, attention state or season is allowed to move the printing geometry. */
export function PrecisionCollectiblePass({pass,issuance,event,commemoration}:{pass:PersonalPass;issuance?:string|null;event?:PassEventState;commemoration?:PassCommemoration}){
 const id=useId().replaceAll(':',''),clip=`pc-stock-${id}`,light=`pc-light-${id}`,ink=`pc-carbon-${id}`,grain=`pc-paper-grain-${id}`;
 const {team,game,location,status,season,user}=pass;
 const club=getTeam(team.code),opponent=getTeam(game.opponentCode),reference=personalPassReference(pass);
 const ordinal=game.gameNumber===null?'—':String(game.gameNumber).padStart(2,'0');
 const presentation=resolvePassPresentation(pass,event??(status.phase==='archived'&&commemoration?.score?{state:'final',score:commemoration.score}:undefined));
 const result=presentation.score?`${presentation.state==='live'?'LIVE':'FINAL'} · ${presentation.score.team} — ${presentation.score.opponent}${presentation.state==='live'&&presentation.period?` · ${presentation.period}${presentation.clock?` · ${presentation.clock}`:''}`:''}`:null;
 const watchedFrom=status.phase==='archived'?commemoration?.watchedFrom:undefined;
 const shape=PRECISION_PASS_DNA.silhouette;
 return <section className="personal-pass precision-pass" data-material-system="spatial-1" data-material-state={presentation.state==='issued'&&status.phase==='game_day'?'game_day':presentation.state} data-dna={PRECISION_PASS_DNA.version} data-pass-variant="precision" data-game-id={game.id} data-team={team.code} data-opponent={game.opponentCode} data-game-number={game.gameNumber??''} data-season={game.seasonId} data-pass-id={user.passId??''} data-personal-issue={reference?artIssue(pass):''} data-reference={reference?.full} data-city-id={location.cityId} data-timezone={location.timezone} data-local-time={location.localTime} data-gmt={location.offset} data-lifecycle={user.passId?presentation.state:'preview'} data-pass-status={status.phase} data-pass-energy={status.energy} data-collected-games={season.collectedGames} data-issuance={issuance||undefined} aria-label={`${team.code} — ${game.opponentCode} · ${location.day} ${location.month} ${location.dateKey.slice(0,4)} · ${location.cityName} ${location.localTime} ${location.offset} · GAME ${ordinal} / ${season.totalGames} · ${user.passId?`${presentation.label} · personal issue ${artIssue(pass)}`:'PREVIEW'}`} style={teamMaterialProperties(team) as CSSProperties}>
  <svg className="pc-stock" viewBox="0 0 728 576" aria-hidden="true">
   <defs><clipPath id={clip}><path d={shape}/></clipPath><linearGradient id={light} x1="0" y1="0" x2="1" y2="1"><stop className="pc-stock-lit" offset="0"/><stop className="pc-stock-base" offset=".55"/><stop className="pc-stock-rest" offset="1"/></linearGradient><linearGradient id={ink} x1="0" y1="0" x2="1" y2="1"><stop className="pc-carbon-lit" offset="0"/><stop className="pc-carbon-base" offset="1"/></linearGradient><filter id={grain} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".92" numOctaves="2" seed="7" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs>
   <g clipPath={`url(#${clip})`}><path d={shape} fill={`url(#${light})`} data-dna-layer="silhouette"/><path className="pc-stub-stock" d="M520 0H728V576H520Z"/><rect className="pc-paper-grain" x="0" y="0" width="728" height="576" filter={`url(#${grain})`}/><rect className="pc-ink-surface" data-material-layer="ink-time" x={PRECISION_INK_WINDOW.x} y={PRECISION_INK_WINDOW.y} width={PRECISION_INK_WINDOW.width} height={PRECISION_INK_WINDOW.height} fill={`url(#${ink})`}/><path className="pc-identity-ink" data-team-color-moment="registration-stripe" d="M0 0H32V576H0Z"/></g>
   <path className="pc-upper-edge" d="M4 .6H507M533 .6H724Q727.4 .6 727.4 4"/>
   <path className="pc-cut-light" d="M508 0C508 7 513 11 520 11S532 7 532 0M504 576C504 566 511 560 520 560"/>
   <path className="pc-cut-dark" d="M520 11C527 11 532 7 532 0M520 560C529 560 536 566 536 576"/>
   <g className="pc-perforation" data-dna-layer="perforation">{Array.from({length:66},(_,index)=>20+index*8.1).filter(y=>y<274||y>302).map(y=><g key={y}><path d={`M519.5 ${y}v2.4`}/><path className="pc-punch-light" d={`M520.5 ${y+.4}v2.4`}/></g>)}</g>
   <g className="pc-bridge" data-dna-layer="bridge"><path d="M516 288h8m-4-4v8"/><path className="pc-bridge-light" d="M516 289h8m-3-5v8"/></g>
  </svg>
  <div className="pc-printed-rail" aria-hidden="true"><span>{team.code}</span></div>
  <div className="pc-main" data-dna-layer="main" data-ticket-section="main">
   <div className="pc-topline"><span>NBA / GAME PASS</span><span className="pc-status" data-pass-layer="game-status"><i data-signal-role="state" data-active={status.phase==='game_day'||undefined}/>{status.phase==='archived'?'COLLECTED':status.phase==='game_day'?'GAME DAY':status.phase==='next_up'?'NEXT UP':'UPCOMING'}</span></div>
   <div className="pc-date" data-pass-layer="date"><strong>{location.day}</strong><span>{location.month}<small>{location.dateKey.slice(0,4)}</small></span></div>
   <div className="pc-match" data-pass-layer="match" aria-label={`${team.code} 对阵 ${game.opponentCode}`}>
    <div className="pc-club pc-club--own"><strong>{team.code}</strong><span>{club.city}{club.name}</span></div>
    <svg className="pc-match-line" viewBox="0 0 64 48" aria-hidden="true" data-dna-layer="security" data-sports-geometry="center-court"><path d="M0 24H22M42 24H64M32 8V40"/><circle cx="32" cy="24" r="10"/></svg>
    <div className="pc-club pc-club--opponent"><strong>{game.opponentCode}</strong><span>{opponent.city}{opponent.name}</span></div>
   </div>
   <div className="pc-timing-sanctuary" data-dna-layer="timing" data-pass-layer="timing">
    <PrecisionTimeInstrument pass={pass}/>
    <div className="pc-city"><span>LOCAL / <QuietValue value={location.cityCode}/></span><strong data-city-name={location.cityName}><QuietValue value={location.cityName}/><small> · {artCountry(pass)}</small></strong></div>
    <div className="pc-time"><QuietValue value={location.localTime} numeric/></div>
    <div className="pc-gmt"><span>24H</span><QuietValue value={location.offset}/></div>
   </div>
   <div className="pc-event-result" data-pass-layer="result">{result}</div>
   <div className="pc-venue"><span>{game.homeAway}</span><strong>{artVenue(pass)}</strong></div>
   <div className="pc-season-edge" data-dna-layer="spine"><ArtSeasonEdge pass={pass} signalRole="season-position"/></div>
  </div>
  <aside className="pc-stub" data-dna-layer="stub" data-ticket-section="stub" aria-label="个人赛事副券">
   <div className="pc-stub-index" data-pass-layer="game-number"><small>GAME</small><strong>{ordinal}<span> / {season.totalGames}</span></strong></div>
   <span className="pc-season" data-pass-layer="season">{season.seasonCode.replace('–','—')}</span>
   <div className="pc-serial" data-pass-layer="issue-number" data-personal-serial={reference?.serial} title={reference?.full}><small>MG+ Nº</small><strong data-issue-number={reference?artIssue(pass):undefined}>{artIssue(pass)}</strong></div>
   <div className="pc-user-record"><span className="pc-lifecycle" data-pass-layer="issue-state">{user.passId?presentation.label:'PREVIEW'}</span><span className="pc-pass-id" data-pass-layer="pass-id">PASS {user.passId??'————'}</span></div>
   <span className="pc-short-reference">{team.code}—{game.opponentCode} / {ordinal}</span>
   <span className="pc-watched-from" data-pass-layer="watched-from">{watchedFrom&&`WATCHED FROM ${watchedFrom.toUpperCase()}`}</span>
   <EmotionMark status={status}/>
   <span className="pc-issuer-signature" role="img" aria-label="Issued by MyGame+"/>
  </aside>
  {issuance&&<span className="pc-issued-note" role="status" aria-live="polite">PASS ISSUED</span>}
 </section>;
}
