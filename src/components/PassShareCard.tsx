import type {PersonalPass} from '@/lib/personalPass';
import {PASS_SHARE_FORMATS,passShareContext,type PassShareFormat,type PassShareMoment} from '@/lib/passShare';
import {BrandSeal} from './BrandLockup';
import {GamePass} from './GamePass';

/** Sharing has its own fixed composition; the homepage continues to be the full App. */
export function PassShareCard({pass,moment,format='feed'}:{pass:PersonalPass;moment?:PassShareMoment;format?:PassShareFormat}){
 const context=passShareContext(pass,moment);
 const {width,height}=PASS_SHARE_FORMATS[format];
 return <figure className="pass-share-card personal-share-card" data-artifact-kind="game" data-share-format={format} data-share-width={width} data-share-height={height} data-share-moment={context.moment} data-share-team={pass.team.code} data-share-pass-id={pass.user.passId} data-share-game-id={pass.game.id} data-share-city={context.city} data-share-timezone={pass.location.timezone} style={{width,height}} aria-label={`MyGame+ ${format==='story'?'Story':'Feed'} 个人赛事通行证分享画面`}>
  <header className="share-brand"><BrandSeal/><span className="share-signature" role="img" aria-label="MyGame+"/></header>
  <div className="share-pass-stage"><GamePass pass={pass}/></div>
  <figcaption className="share-context"><span className="share-moment">{context.artifactLabel}</span><span className="share-location">{context.location}</span><span className="share-local-time">{context.localTime}</span><span className="share-season">{context.season}<span aria-hidden="true"> · </span><span className="share-progress">{context.progress}</span></span></figcaption>
 </figure>;
}
