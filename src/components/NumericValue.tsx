import {Fragment} from 'react';

// Shared numeric presentation for the calendar and future Game Pass surfaces.
export function NumericValue({value}:{value:string|number}) {
 return <span className="numeric-value">{String(value).split(':').map((part,index)=><Fragment key={index}>{index>0&&<span className="numeric-separator">:</span>}{part}</Fragment>)}</span>;
}
