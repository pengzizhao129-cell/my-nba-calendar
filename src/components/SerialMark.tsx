import type {PersonalPass} from '@/lib/personalPass';
import {ticketIssueNumber} from '@/lib/ticketIdentity';

export function SerialMark({pass}:{pass:PersonalPass}){
 return <span className="serial-mark" data-pass-layer="issue-number"><small>ISSUE</small><span>#{ticketIssueNumber(pass)??'——————'}</span></span>;
}
