import type {ReactNode} from 'react';
export function TicketMicroLabel({children,className=''}:{children:ReactNode;className?:string}) {
 return <span className={`eyebrow ticket-micro-label ${className}`}>{children}</span>;
}
