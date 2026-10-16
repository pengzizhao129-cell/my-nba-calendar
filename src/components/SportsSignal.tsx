// Presentation only. Callers supply a state already established by schedule data.
export function SportsSignal({type,label}:{
 type:'active'|'inactive'|'completed'|'next';
 label:string;
}) {
 return <span className="sports-signal" data-type={type}>
  <span className="sports-signal-mark" aria-hidden="true"/>
  <span>{label}</span>
 </span>;
}
