import type {PersonalPass} from '@/lib/personalPass';
import {GamePass} from './GamePass';

/** Future 3:4 renderer entry point. No share button, service or alternate ticket template. */
export function PassShareCard({pass}:{pass:PersonalPass}) {
 return <figure className="pass-share-card" aria-label="MyGame+ 比赛通行证分享画面"><GamePass pass={pass}/></figure>;
}
