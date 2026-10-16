'use client';

import {useEffect,useRef,useState} from 'react';
import {CalendarDays,House,UserRound} from 'lucide-react';
import {NumericValue} from './NumericValue';

const items = [
 {name:'首页',en:'HOME',icon:House},
 {name:'赛程',en:'SCHEDULE',icon:CalendarDays},
 {name:'我的',en:'PROFILE',icon:UserRound},
] as const;
export type IslandTab = typeof items[number]['name'];
export interface IslandGameContext {
 /** Selected team, timezone and fixture identity, supplied by existing schedule logic. */
 key:string;
 team:string;
 color:string;
 time:string;
}

export function SystemIsland({tab,onSelect,context}:{
 tab:IslandTab;
 onSelect:(tab:IslandTab)=>void;
 context?:IslandGameContext;
}) {
 const [showContext,setShowContext] = useState(false);
 const previousContext = useRef(context?.key);
 const contextKey = context?.key;

 useEffect(()=>{
  if(previousContext.current===contextKey) return;
  previousContext.current=contextKey;
  if(!contextKey) {setShowContext(false);return;}
  setShowContext(true);
  const timer=window.setTimeout(()=>setShowContext(false),1800);
  return ()=>window.clearTimeout(timer);
 },[contextKey]);

 const visible=showContext&&Boolean(context);
 return <nav className="system-island app-system-island" aria-label="底部导航" data-context={visible?'game-day':'navigation'}>
  <div className="island-context-row">
   <div className="island-context-clip">
    <div className="island-context-label" role="status" aria-live="polite" aria-atomic="true">
     {visible&&context&&<><span className="island-context-dot" style={{background:context.color}} aria-hidden="true"/><span>{context.team}</span><span className="island-context-separator" aria-hidden="true">·</span><span>GAME DAY</span><span className="island-context-separator" aria-hidden="true">·</span><NumericValue value={context.time}/></>}
    </div>
   </div>
  </div>
  <div className="system-island-items">
   {items.map(({name,en,icon:Icon})=><button key={name} className="system-island-item" onClick={()=>{setShowContext(false);onSelect(name);}} aria-current={tab===name?'page':undefined}>
    <Icon size={20} strokeWidth={1.5}/><span className="island-cn">{name}</span><span className="island-en">{en}</span>
   </button>)}
  </div>
 </nav>;
}
