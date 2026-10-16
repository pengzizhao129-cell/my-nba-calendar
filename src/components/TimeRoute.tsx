import type {PersonalPass} from '@/lib/personalPass';
import {locationCoordinate} from '@/lib/ticketIdentity';
import {timeRoutePosition,utcOffsetMinutes} from '@/lib/timeRoute';
import {QuietValue} from './QuietValue';

/** Fixed allegiance + a local-time coordinate. Never a flight or travel route. */
export function TimeRoute({pass}:{pass:PersonalPass}){
 const {city,country}=locationCoordinate(pass);
 const position=timeRoutePosition(pass.location.offset),markerX=4+position*232;
 return <div className="time-route" data-pass-layer="time-route" data-time-route-offset={pass.location.offset} aria-label={`${pass.team.code} 的比赛，换算至${pass.location.city}当地时间，${pass.location.offset}`}>
  <span className="route-origin">{pass.team.code}</span>
  <span className="route-rule" aria-hidden="true">
   <svg className="route-scale" viewBox="0 0 240 24" preserveAspectRatio="none" data-offset-minutes={utcOffsetMinutes(pass.location.offset)}>
    <path className="route-scale-line" d="M4 12H236" fill="none"/>
    {Array.from({length:14},(_,i)=>{
     const hours=-12+i*2,x=4+i*232/13,datum=hours===0;
     return <path key={hours} className={datum?'route-scale-datum':'route-scale-tick'} d={`M${x} ${datum?6:9}V${datum?18:15}`} fill="none"/>;
    })}
    <path className="route-scale-marker" data-time-route-marker="true" d={`M${markerX-2.5} 4H${markerX+2.5}V9H${markerX-2.5}Z`} fill="currentColor"/>
    <path className="route-scale-marker-hairline" d={`M${markerX} 9V16`} fill="none"/>
   </svg>
  </span>
  <span className="route-destination"><QuietValue value={city}/>{country&&<small> · {country==='GB'?'UK':country}</small>}</span>
 </div>;
}
