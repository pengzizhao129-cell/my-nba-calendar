import {useId,type CSSProperties} from 'react';
import {MOBILE_PASS_ENCLOSURE as shell,mobileEnclosureProperties} from '@/lib/passEnclosure';

/** Edge-only optics. This sibling sits behind the paper, never over its printed face. */
export function MobilePassEnclosure(){
 const id=`mobile-shell-${useId().replaceAll(':','')}`;
 return <svg className="mobile-pass-enclosure" data-enclosure-dna={shell.version} viewBox={`0 0 ${shell.width} ${shell.height}`} fill="none" aria-hidden="true" focusable="false" style={mobileEnclosureProperties() as CSSProperties}>
  <defs>
   <linearGradient id={`${id}-bevel`} x1="0" y1="0" x2={shell.width} y2={shell.height} gradientUnits="userSpaceOnUse">
    <stop className="mobile-bevel-light"/><stop offset=".36" className="mobile-bevel-middle"/><stop offset=".8" className="mobile-bevel-rest"/><stop offset="1" className="mobile-bevel-middle"/>
   </linearGradient>
   <linearGradient className="mobile-refraction-gradient" id={`${id}-refraction`} x1="0" y1="0" x2={shell.width} y2={shell.height} gradientUnits="userSpaceOnUse">
    <stop stopColor="currentColor" stopOpacity=".3"/><stop offset=".2" stopColor="currentColor"/><stop offset=".55" stopColor="currentColor" stopOpacity=".12"/><stop offset=".86" stopColor="currentColor" stopOpacity=".75"/><stop offset="1" stopColor="currentColor" stopOpacity=".2"/>
   </linearGradient>
  </defs>
  <path className="mobile-shell-plane" d={shell.outline}/>
  <path className="mobile-shell-side" d={shell.side} transform="translate(1 1.25)"/>
  <path className="mobile-shell-bevel" d={shell.outline} stroke={`url(#${id}-bevel)`}/>
  <path className="mobile-shell-mount" d={shell.inner}/>
  <g className="mobile-shell-refraction">{shell.refraction.map(d=><path key={d} d={d} stroke={`url(#${id}-refraction)`}/>)}</g>
  <path className="mobile-shell-corner" d="M4 28Q4 4 28 4M748 569Q748 594 724 594"/>
  <g className="mobile-shell-signature" data-enclosure-signature="fixed-upper-right">
   <path className="mobile-shell-cut-light" d={shell.signature.cut}/>
   <path className="mobile-shell-engraving-shadow" d={shell.signature.plus}/>
   <path className="mobile-shell-engraving-light" d={shell.signature.plus} transform="translate(.5 .65)"/>
  </g>
 </svg>;
}
