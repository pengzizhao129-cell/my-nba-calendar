import type {ReactNode} from 'react';
import {TeamSecurityPattern} from './TeamSecurityPattern';
export function MainTicket({teamId,children}:{teamId:string;children:ReactNode}) {
 return <div className="ticket-main" aria-label="赛事主券"><TeamSecurityPattern teamId={teamId}/>{children}</div>;
}
