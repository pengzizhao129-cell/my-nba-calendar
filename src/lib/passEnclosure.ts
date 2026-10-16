import {PASS_DNA} from './passDNA';
/** Presentation architecture only: the enclosed Pass retains its own immutable drawing. */
export const PASS_ENCLOSURE=Object.freeze({
 width:PASS_DNA.width+32,height:PASS_DNA.height+24,radius:26,
 slot:Object.freeze({x:16,y:12,width:PASS_DNA.width,height:PASS_DNA.height}),
 sidewall:Object.freeze({x:3,y:4}),
 refraction:Object.freeze(['M1 204V30Q1 1 30 1H260','M759 396V570Q759 599 730 599H614']),
});
export function enclosureProperties(){
 return {'--enclosure-width':String(PASS_ENCLOSURE.width),'--enclosure-height':String(PASS_ENCLOSURE.height),'--enclosure-radius':`${PASS_ENCLOSURE.radius}px`,'--enclosure-gap-x':`${PASS_ENCLOSURE.slot.x}px`,'--enclosure-gap-y':`${PASS_ENCLOSURE.slot.y}px`};
}
