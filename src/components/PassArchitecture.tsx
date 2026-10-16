import {PASS_DNA} from '@/lib/passDNA';

/** Unpunched material at the centre, not a floating logo or a button. */
export function TicketJoin() {
 const {perforation,bridge}=PASS_DNA;
 const marks=Array.from({length:Math.floor(perforation.height/perforation.pitch)},(_,i)=>4+i*perforation.pitch)
  .filter(y=>y+perforation.punch<bridge.y-perforation.y||y>bridge.y+bridge.height-perforation.y);
 return <div className="ticket-join" aria-hidden="true"><svg className="perforation" viewBox={`0 0 ${perforation.width} ${perforation.height}`} preserveAspectRatio="none">{marks.map(y=><g key={y} data-tear-cut={y}><path className="tear-cut-light" d={`M1.2 ${y+.6}v${perforation.punch}`}/><path className="tear-cut-ink" d={`M.6 ${y}v${perforation.punch}`}/></g>)}</svg><span className="mg-bridge" data-dna="bridge"/></div>;
}
export function CollectibleSpine() {
 return <span className="collectible-spine" data-dna="spine" aria-hidden="true"/>;
}
export function TicketCutEdges() {
 return <svg className="ticket-cut-edges" aria-hidden="true" viewBox={`0 0 ${PASS_DNA.width} ${PASS_DNA.height}`} preserveAspectRatio="none"><g className="cut-edge-light" transform="translate(-.3 -.4)"><path d={PASS_DNA.leftCut}/><path d={PASS_DNA.rightCut}/></g><path d={PASS_DNA.leftCut}/><path d={PASS_DNA.rightCut}/></svg>;
}
