import {useId,type CSSProperties,type ReactNode} from 'react';
import {teamMaterialProperties,type TeamIdentity} from '@/data/teamIdentities';
import {PASS_ENCLOSURE,enclosureProperties} from '@/lib/passEnclosure';

/** Optical casing is a separate layer; it never paints a filter over the ticket face. */
export function EncasedPass({team,children}:{team:TeamIdentity;children:ReactNode}){
 const gradient=`enclosure-${useId().replaceAll(':','')}`;
 return <div className="encased-pass" data-enclosure-team={team.code} data-presentation="front-sidewall" style={{...teamMaterialProperties(team),...enclosureProperties()} as CSSProperties}>
  <span className="slab-rear" aria-hidden="true"/>
  <span className="slab-side-right" aria-hidden="true"/><span className="slab-side-bottom" aria-hidden="true"/>
  <span className="slab-back-plane" aria-hidden="true"/>
  <div className="encased-ticket-slot">{children}</div>
  <span className="slab-front-bevel" aria-hidden="true"/>
  <span className="slab-inner-seam" aria-hidden="true"/>
  <svg className="slab-refraction" viewBox={`0 0 ${PASS_ENCLOSURE.width} ${PASS_ENCLOSURE.height}`} fill="none" aria-hidden="true">
   <defs><linearGradient id={gradient} x1="0" y1="0" x2="760" y2="600" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="currentColor" stopOpacity=".4"/><stop offset=".18" stopColor="currentColor"/><stop offset=".55" stopColor="currentColor" stopOpacity=".12"/><stop offset=".84" stopColor="currentColor" stopOpacity=".75"/><stop offset="1" stopColor="currentColor" stopOpacity=".25"/></linearGradient></defs>
   {PASS_ENCLOSURE.refraction.map(d=><path key={d} d={d} stroke={`url(#${gradient})`}/>)}
  </svg>
  <svg className="slab-corner-optics" viewBox="0 0 760 600" fill="none" aria-hidden="true"><path d="M4 31Q4 4 31 4M756 568Q756 596 728 596"/></svg>
  <span className="slab-light-return" aria-hidden="true"/>
 </div>;
}
