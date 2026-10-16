import {TimingNumber} from './TimingNumber';

// Shared numeric presentation for the calendar and future Game Pass surfaces.
export function NumericValue({value}:{value:string|number}) {
 return /^\d{2}:\d{2}$/.test(String(value))?<TimingNumber value={String(value)}/>:<span className="numeric-value">{value}</span>;
}
