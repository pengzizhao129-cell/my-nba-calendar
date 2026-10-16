import {TicketMicroLabel} from './TicketMicroLabel';
export function SeasonCode({value}:{value:string}) {
 return <span data-pass-layer="season"><TicketMicroLabel>SEASON</TicketMicroLabel>{' '}{value}</span>;
}
