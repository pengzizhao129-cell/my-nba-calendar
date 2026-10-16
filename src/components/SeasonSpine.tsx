/**
 * Two horizontal index registers, not a completed/remaining progress track.
 * Each physical mark belongs to one game. A mark's position never depends on
 * the current ordinal, the number of collected games or the Pass state.
 */
export function SeasonSpine({gameNumber,total=82}:{gameNumber:number|null;total?:number}){
 const count=Number.isInteger(total)&&total>0?total:82;
 const columns=Math.ceil(count/(count>41?2:1));
 return <svg className="collectible-spine season-spine" data-dna="spine" viewBox="0 0 104 40" role="img" aria-label={`赛季位置 ${gameNumber??'—'} / ${count}`}>
  {Array.from({length:count},(_,i)=>{
   const ordinal=i+1,active=gameNumber===ordinal;
   const x=2+(i%columns)*100/Math.max(1,columns-1),base=count>41?(i<columns?12:31):22;
   const height=active?7.5:ordinal%10===0?6:ordinal%5===0?4:2.5;
   return <line key={ordinal} data-season-tick={ordinal} data-current={active||undefined} x1={x} x2={x} y1={base-height} y2={base} strokeLinecap="square"/>;
  })}
 </svg>;
}
