/** 82 independent positions, not a filled progress bar. One tick identifies this ticket. */
export function SeasonSpine({gameNumber,total=82}:{gameNumber:number|null;total?:number}){
 return <svg className="collectible-spine season-spine" data-dna="spine" viewBox="0 0 12 410" role="img" aria-label={`赛季位置 ${gameNumber??'—'} / ${total}`}>
  {Array.from({length:total},(_,i)=>{
   const active=gameNumber===i+1,y=2+i*406/Math.max(1,total-1);
   return <line key={i} data-season-tick={i+1} data-current={active||undefined} x1={active?0:i%10===0?4:8} x2="12" y1={y} y2={y}/>;
  })}
 </svg>;
}
