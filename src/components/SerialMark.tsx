import type {PersonalPass} from '@/lib/personalPass';
import {personalPassReference} from '@/lib/ticketIdentity';

export function SerialMark({pass}:{pass:PersonalPass}){
 const reference=personalPassReference(pass);
 return <span className="serial-mark" data-pass-layer="issue-number" data-reference={reference?.full} data-personal-serial={reference?.serial} title={reference?.full} aria-label={reference?`Personal issue ${reference.serial}. Reference ${reference.full}`:'尚未签发比赛凭证'}><small>PERSONAL ISSUE</small><span className="reference-serial"><small>NO.</small> {reference?.serial??'—————'}</span><span className="reference-short">REF. {reference?.short??'—'}</span><span className="reference-coordinate">{reference?.coordinate??`${pass.location.cityCode} / ${pass.location.countryCode}`}</span></span>;
}
