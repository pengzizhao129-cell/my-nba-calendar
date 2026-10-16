import type {PersonalPass} from '@/lib/personalPass';
import {getTeam} from '@/data/teams';
import {EmotionMark} from '../EmotionMark';
import {ArtPassFrame,ArtTiming,ArtSerial,ArtSeasonEdge,artVenue} from './ArtPassPrimitives';

const INDEX_START=135;
const INDEX_SWEEP=270;
const CX=286;
const CY=196;
const polar=(radius:number,angle:number)=>({x:CX+radius*Math.cos(angle*Math.PI/180),y:CY+radius*Math.sin(angle*Math.PI/180)});
const indexAngle=(minutes:number)=>INDEX_START+(minutes/1440)*INDEX_SWEEP;
function arc(radius:number,from:number,to:number) {
 const start=polar(radius,from),end=polar(radius,to);
 return `M${start.x} ${start.y}A${radius} ${radius} 0 ${to-from>180?1:0} 1 ${end.x} ${end.y}`;
}

/** A local wall-clock index: its 270° sweep represents exactly 00:00–24:00.
 * No geographical distance or changing event identity is implied by the cursor. */
function LocalClockIndex({pass}:{pass:PersonalPass}) {
 const [hour,minute]=pass.location.localTime.split(':').map(Number);
 const minutes=hour*60+minute;
 const angle=indexAngle(minutes);
 const cursorInner=polar(139,angle),cursorOuter=polar(173,angle),cursorCap=polar(178,angle);
 const currentHourStart=indexAngle(hour*60),currentHourEnd=indexAngle((hour+1)*60);
 return <svg className="instrument-clock-index" data-art-layer="instrument" viewBox="0 0 572 372" role="img" aria-label={`24 小时当地时间刻度，${pass.location.cityName} ${pass.location.localTime}`} data-local-minute={minutes} data-clock-minutes={minutes} data-clock-angle={angle}>
  <path className="instrument-index-track" d={arc(150,INDEX_START,INDEX_START+INDEX_SWEEP)}/>
  <path className="instrument-hour-sector" d={arc(150,currentHourStart,currentHourEnd)}/>
  {Array.from({length:49},(_,index)=>{
   const tickAngle=indexAngle(index*30),major=index%6===0,hourTick=index%2===0;
   const inner=polar(major?155:hourTick?159:162,tickAngle),outer=polar(major?173:168,tickAngle);
   const label=polar(190,tickAngle);
   return <g key={index}>
    <path className={`instrument-index-tick${major?' is-major':''}`} d={`M${inner.x} ${inner.y}L${outer.x} ${outer.y}`} data-hour-index={index/2}/>
    {major&&<text className="instrument-hour-label" x={label.x} y={label.y} dominantBaseline="central" textAnchor="middle">{String(index/2).padStart(2,'0')}</text>}
   </g>;
  })}
  <g className="instrument-local-cursor" data-time-marker="local-clock" data-value={minutes}>
   <path d={`M${cursorInner.x} ${cursorInner.y}L${cursorOuter.x} ${cursorOuter.y}`}/>
   <rect x={cursorCap.x-3} y={cursorCap.y-3} width="6" height="6" transform={`rotate(${angle} ${cursorCap.x} ${cursorCap.y})`}/>
  </g>
 </svg>;
}

export function InstrumentPass({pass}:{pass:PersonalPass}) {
 const {team,game,location,season,user,status}=pass;
 const home=getTeam(team.code),opponent=getTeam(game.opponentCode);
 const number=game.gameNumber===null?'—':String(game.gameNumber).padStart(2,'0');
 const year=location.dateKey.slice(0,4);
 return <ArtPassFrame pass={pass} direction="instrument"><div className="art-surface">
  <div className="instrument-stock" aria-hidden="true"/>
  <div className="instrument-edge-ink" aria-hidden="true"/>
  <div className="instrument-topline"><span>NBA / GAME PASS</span><span>{game.homeAway}</span></div>
  <div className="instrument-match" aria-label={`${team.code} 对阵 ${game.opponentCode}`}>
   <strong className="instrument-own-team" data-art-layer="team">{team.code}</strong><svg className="art-match-mark instrument-match-mark" viewBox="0 0 180 100" fill="none" aria-hidden="true" data-sports-geometry="center-court"><path d="M0 50H55M125 50H180M90 0V100"/><circle cx="90" cy="50" r="35"/></svg><strong data-art-layer="opponent">{game.opponentCode}</strong>
  </div>
  <div className="instrument-team-names"><span>{home.city}{home.name}</span><span>{opponent.city}{opponent.name}</span></div>
  <LocalClockIndex pass={pass}/>
  <div className="instrument-city" data-art-layer="location"><span>WATCHING FROM</span><strong>{location.cityName}<small> / {location.countryCode==='GB'?'UK':location.countryCode}</small></strong></div>
  <div className="instrument-local-time" data-art-layer="timing"><ArtTiming pass={pass}/></div>
  <div className="instrument-offset"><span>LOCAL TIME</span><strong>{location.offset}</strong><i aria-hidden="true"/></div>
  <div className="instrument-venue"><span>{artVenue(pass)}</span><span>{location.cityCode} / {team.code}</span></div>
  <div className="instrument-season-edge"><ArtSeasonEdge pass={pass}/></div>
  <svg className="instrument-tear" viewBox="0 0 728 576" aria-hidden="true">
   {Array.from({length:65},(_,index)=>{
    const y=24+index*8;
    return y>264&&y<304?null:<g key={index}><path className="instrument-punch-shade" d={`M576 ${y}v3`}/><path className="instrument-punch-light" d={`M577 ${y+1}v3`}/></g>;
   })}
   <path className="instrument-bridge" d="M571 283h10m-5-5v10"/>
  </svg>
  <aside className="instrument-stub" aria-label="个人票根">
   <div className="instrument-date" data-art-layer="date"><strong>{location.day}</strong><div><b>{location.month}</b><span>{year}</span></div></div>
   <div className="instrument-stub-game"><strong>{number}<span> / {season.totalGames}</span></strong><small>SEASON {season.seasonCode}</small></div>
   <div className="instrument-user-id">PASS <b>{user.passId??'—'}</b></div>
   <div className="instrument-serial" data-art-layer="serial"><ArtSerial pass={pass}/><span className="instrument-personal-issue">PERSONAL ISSUE</span></div>
   <div className="instrument-stub-signature"><EmotionMark status={status}/><span>MG+ / {team.code}–{game.opponentCode}</span></div>
  </aside>
 </div></ArtPassFrame>;
}
