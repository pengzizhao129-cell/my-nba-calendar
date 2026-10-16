/** MyGame+ master drawing. Units are authored once; all surfaces scale this same drawing.
 * No user, team, location, game, state or season input is accepted here.
 */
export const PASS_DNA = Object.freeze({
 version: 'MG-DNA-1', width: 728, height: 576, radius: 20,
 main: Object.freeze({x: 0, y: 0, width: 728, height: 480}),
 stub: Object.freeze({x: 0, y: 482, width: 728, height: 94}),
 perforation: Object.freeze({x: 16, y: 480, width: 696, height: 2, pitch: 8, punch: 3}),
 bridge: Object.freeze({x: 348, y: 475, width: 32, height: 12}),
 spine: Object.freeze({x: 16, y: 176, width: 1, height: 240}),
 timingSanctuary: Object.freeze({x: 28, y: 328, width: 568, height: 136}),
 identityLeft: Object.freeze({x: 32, y: 176, width: 240, height: 144}),
 identityRight: Object.freeze({x: 456, y: 176, width: 240, height: 144}),
 securityWindow: Object.freeze({x: 246, y: 16, width: 236, height: 144}),
 // Left: shallow upper shoulder + longer lower return. Right: deeper, shorter return.
 leftCut: 'M0 475 C10 475 10 481 0 493',
 rightCut: 'M728 471 C712 471 712 487 728 487',
 outline: 'M20 0H708Q728 0 728 20V471C712 471 712 487 728 487V556Q728 576 708 576H20Q0 576 0 556V493C10 481 10 475 0 475V20Q0 0 20 0Z',
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
