import {TicketMicroLabel} from './TicketMicroLabel';
export function GameNumber({value,total}:{value:number|null;total:number}) {
 return <span data-pass-layer="game-number"><TicketMicroLabel>GAME</TicketMicroLabel>{' '}{value===null?'—':String(value).padStart(2,'0')} / {total}</span>;
}
