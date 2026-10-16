/** Solid branded numerals and a separate, quieter two-dot timing colon. */
export function TimingNumber({value}:{value:string}) {
 const [hours,minutes]=value.split(':');
 return <span className="timing-run" aria-label={value}><span>{hours}</span><span className="timing-colon"><span className="colon-text">:</span></span><span>{minutes}</span></span>;
}
