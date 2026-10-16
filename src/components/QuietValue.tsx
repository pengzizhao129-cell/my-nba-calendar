'use client';

import {useEffect,useRef,useState} from 'react';
import {NumericValue} from './NumericValue';

/** Crossfade only when the supplied value changes; no decorative looping motion. */
export function QuietValue({value,numeric=false}:{value:string;numeric?:boolean}) {
 const last=useRef(value);
 const [previous,setPrevious]=useState<string|null>(null);
 useEffect(()=>{
  if(last.current===value) return;
  setPrevious(last.current);
  last.current=value;
  const timer=window.setTimeout(()=>setPrevious(null),180);
  return ()=>window.clearTimeout(timer);
 },[value]);
 const render=(text:string)=>numeric?<NumericValue value={text}/>:text;
 return <span className="quiet-value" data-changing={previous!==null||undefined}>
  {previous!==null&&<span className="quiet-value-old" aria-hidden="true">{render(previous)}</span>}
  <span className="quiet-value-current">{render(value)}</span>
 </span>;
}
