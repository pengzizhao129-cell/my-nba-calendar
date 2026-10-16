import type {ReactNode} from 'react';
import type {PersonalPass} from '@/lib/personalPass';
import {GamePass} from './GamePass';
import {EncasedPass} from './EncasedPass';

/** Legacy V2.7 standalone study; current promo exports keep the full mobile interface. */
export function PassShareCard({pass,caption,cityLabel,cityState,children}:{pass:PersonalPass;caption?:string;cityLabel?:string;cityState?:string;children?:ReactNode}) {
 return <figure className="pass-share-card encased-artifact" aria-label="MyGame+ 封装赛事通行证" data-artifact-city={pass.location.city}>
  <span className="artifact-brand-signature" role="img" aria-label="MyGame+"/>
  <div className="artifact-context"><span className="artifact-nba">NBA</span><span className="artifact-city" data-artifact-state>{cityLabel??pass.location.city}</span></div>
  <div className="artifact-display"><EncasedPass team={pass.team}>{children??<GamePass pass={pass} enclosure="none"/>}</EncasedPass></div>
  {caption&&<figcaption className="artifact-caption" data-artifact-state>{caption}</figcaption>}
  <p className="artifact-city-state" data-artifact-state>{cityState??`${pass.location.city} · ${pass.location.offset}`}</p>
 </figure>;
}
