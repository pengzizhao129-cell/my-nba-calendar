import type {PersonalPass} from '@/lib/personalPass';
import {PassShareCard} from './PassShareCard';
/** Completion reuses the same share architecture and the season's archived Pass. */
export function SeasonSummaryCard({pass}:{pass:PersonalPass}){
 return <PassShareCard pass={pass} moment="season_complete"/>;
}
