import {TicketMicroLabel} from './TicketMicroLabel';
export function PassId({value}:{value:string|null}) {
 return <span className="pass-id" data-pass-layer="user"><TicketMicroLabel>PASS</TicketMicroLabel>{' '}{value??'————'}</span>;
}
