import type {PersonalPass} from '@/lib/personalPass';
import {locationCoordinate} from '@/lib/ticketIdentity';
import {QuietValue} from './QuietValue';

/** Team allegiance → viewing location. It never represents a flight or travel route. */
export function TimeRoute({pass}:{pass:PersonalPass}){
 const {city,country}=locationCoordinate(pass);
 return <div className="time-route" data-pass-layer="time-route" aria-label={`${pass.team.code} 的比赛，换算至${pass.location.city}当地时间`}>
  <span className="route-origin">{pass.team.code}</span>
  <span className="route-rule" aria-hidden="true"><i/><i/><i/><i/><b/></span>
  <span className="route-destination"><QuietValue value={city}/>{country&&<small> · {country}</small>}</span>
 </div>;
}
