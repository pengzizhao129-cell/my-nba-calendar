import {PASS_DNA} from '@/lib/passDNA';

/** Unpunched material at the centre, not a floating logo or a button. */
export function TicketJoin() {
 return <div className="ticket-join" aria-hidden="true"><span className="perforation"/><span className="mg-bridge" data-dna="bridge"/></div>;
}
export function CollectibleSpine() {
 return <span className="collectible-spine" data-dna="spine" aria-hidden="true"/>;
}
export function TicketCutEdges() {
 return <svg className="ticket-cut-edges" aria-hidden="true" viewBox={`0 0 ${PASS_DNA.width} ${PASS_DNA.height}`} preserveAspectRatio="none"><path d={PASS_DNA.leftCut}/><path d={PASS_DNA.rightCut}/></svg>;
}
