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

/** Phone presentation: an invariant rim around the original master, never a new ticket. */
export const MOBILE_PASS_ENCLOSURE=Object.freeze({
 version:'MG-ENCLOSURE-1',width:752,height:598,
 slot:Object.freeze({x:12,y:11,width:PASS_DNA.width,height:PASS_DNA.height}),
 // 6 units of hard rim, then 6 horizontal / 5 vertical units of clear air.
 rim:6,airGap:Object.freeze({x:6,y:5}),
 outline:'M26 1H734L751 18V572Q751 597 726 597H26Q1 597 1 572V26Q1 1 26 1Z',
 // The master outline is construction geometry, not a visible perimeter frame.
 bevel:Object.freeze(['M1 90V26Q1 1 26 1H164','M676 1H734L751 18V56','M751 516V572Q751 597 726 597H660']),
 inner:'M6 44V27Q6 6 27 6H46M746 548V571Q746 592 725 592H710',
 side:'M751 540V572Q751 597 726 597H682',
 refraction:Object.freeze(['M2 180V27Q2 2 27 2H220','M750 418V571Q750 596 725 596H626']),
 signature:Object.freeze({cut:'M734 1L751 18',plus:'M734 9V15M731 12H737'}),
});
export function mobileEnclosureProperties(){
 const e=MOBILE_PASS_ENCLOSURE;
 return {'--mobile-shell-left':`${-e.slot.x/PASS_DNA.width*100}%`,'--mobile-shell-top':`${-e.slot.y/PASS_DNA.height*100}%`,'--mobile-shell-width':`${e.width/PASS_DNA.width*100}%`,'--mobile-shell-height':`${e.height/PASS_DNA.height*100}%`};
}
