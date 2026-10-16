/** MyGame+ master drawing. Units are authored once; all surfaces scale this same drawing.
 * No user, team, location, game, state or season input is accepted here.
 */
export const PASS_DNA = Object.freeze({
 version: 'MG-DNA-3', width: 728, height: 576, radius: 4,
 main: Object.freeze({x: 0, y: 0, width: 582, height: 576}),
 stub: Object.freeze({x: 584, y: 0, width: 144, height: 576}),
 perforation: Object.freeze({x: 582, y: 16, width: 2, height: 544, pitch: 8, punch: 3}),
 bridge: Object.freeze({x: 576, y: 278, width: 14, height: 28}),
 spine: Object.freeze({x: 604, y: 152, width: 104, height: 40}),
 timingSanctuary: Object.freeze({x: 40, y: 368, width: 504, height: 112}),
 identityLeft: Object.freeze({x: 40, y: 156, width: 208, height: 144}),
 identityRight: Object.freeze({x: 320, y: 156, width: 224, height: 144}),
 securityWindow: Object.freeze({x: 24, y: 24, width: 8, height: 528}),
 // The tear starts at a shallow top V and ends in a deeper rounded bottom return.
 leftCut: 'M574 0L582 10L590 0',
 rightCut: 'M572 576Q582 548 592 576',
 outline: 'M4 0H574L582 10L590 0H720L728 8V572Q728 576 724 576H592Q582 548 572 576H4Q0 576 0 572V4Q0 0 4 0Z',
});
export function passOutlineMask() {
 return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PASS_DNA.width} ${PASS_DNA.height}" preserveAspectRatio="none"><path fill="white" d="${PASS_DNA.outline}"/></svg>`)}")`;
}
export function passDNAProperties() {
 const coordinates:Record<string,string>={'--pass-outline':passOutlineMask(),'--dna-ratio':`${PASS_DNA.width}/${PASS_DNA.height}`,'--dna-master-width':String(PASS_DNA.width)};
 for(const [name,region] of Object.entries({main:PASS_DNA.main,stub:PASS_DNA.stub,join:PASS_DNA.perforation,bridge:PASS_DNA.bridge,spine:PASS_DNA.spine,timing:PASS_DNA.timingSanctuary,security:PASS_DNA.securityWindow})) {
  for(const [axis,value] of Object.entries(region))coordinates[`--dna-${name}-${axis}`]=String(value);
 }
 return coordinates;
}
