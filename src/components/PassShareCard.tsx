import type {PersonalPass} from '@/lib/personalPass';
import {passShareContext,type PassShareMoment} from '@/lib/passShare';
import {BrandSeal} from './BrandLockup';
import {GamePass} from './GamePass';

/** Sharing has its own fixed composition; the homepage continues to be the full App. */
export function PassShareCard({pass,moment}:{pass:PersonalPass;moment?:PassShareMoment}){
 const context=passShareContext(pass,moment);
 return <figure className="pass-share-card personal-share-card" data-share-moment={context.moment} data-share-team={pass.team.code} aria-label="MyGame+ 个人赛事通行证分享画面">
  <header className="share-brand"><BrandSeal/><span className="share-signature" role="img" aria-label="MyGame+"/></header>
  <div className="share-pass-stage"><GamePass pass={pass}/></div>
  <figcaption className="share-context"><span className="share-moment">{context.label}</span><span className="share-location">{context.location}</span><span className="share-progress">{context.progress}</span></figcaption>
 </figure>;
}
