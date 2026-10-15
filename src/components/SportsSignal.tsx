import type {CSSProperties} from 'react';

// Presentation only. Callers supply a state already established by schedule data.
export function SportsSignal({type,teamColor,label}:{
 type:'active'|'inactive'|'completed'|'next';
 teamColor?:string;
 label:string;
}) {
 return <span className="sports-signal" data-type={type} style={teamColor?{'--signal-team-color':teamColor} as CSSProperties:undefined}>
  <span className="sports-signal-mark" aria-hidden="true"/>
  <span>{label}</span>
 </span>;
}
