import type {PersonalPass} from '@/lib/personalPass';
import {personalPassReference} from '@/lib/ticketIdentity';

export function SerialMark({pass}:{pass:PersonalPass}){
 const reference=personalPassReference(pass);
 return <span className="serial-mark" data-pass-layer="issue-number" data-reference={reference?.full} data-personal-serial={reference?.serial} title={reference?.full} aria-label={reference?`Reference ${reference.full}`:'尚未签发比赛凭证'}><small>REF.</small><span className="reference-short">{reference?.short??'—'}</span><span className="reference-coordinate">{reference?.coordinate??`${pass.location.cityCode} / ${pass.location.countryCode}`}</span><span className="reference-serial">№ {reference?.serial??'—————'}</span></span>;
}
