import type {PassStatus} from '@/lib/passStatus';
/** Exactly one annotation, owned by the ticket stub, never a status badge. */
export function EmotionMark({status}:{status:PassStatus}) {
 return status.emotionMark?<span className="emotion-mark" data-emotion={status.emotionMark} data-pass-layer="status" aria-hidden="true">{status.emotionMark}</span>:null;
}
