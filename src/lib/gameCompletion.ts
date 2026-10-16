/** Replace this data adapter with an NBA status feed without changing Pass/state/storage code. */
export type CompletionInput = {
 readonly startsAt:string;
 readonly final?:boolean;
 readonly endTime?:string;
 readonly estimatedEndTime?:string;
 /** V2.4 snapshots may still contain these legacy fields. */
 readonly finished?:boolean;
 readonly endsAt?:string;
};
export type GameCompletion = {readonly endedAt:string|null;readonly source:'final'|'endTime'|'estimate'|null};

export function resolveGameCompletion(game:CompletionInput,now:Date):GameCompletion {
 const start=Date.parse(game.startsAt),clock=now.getTime();
 if(!Number.isFinite(start)||!Number.isFinite(clock))throw new RangeError('Invalid event clock');
 const parseEnd=(value:string|undefined)=>{
  if(value===undefined)return null;
  const end=Date.parse(value);
  if(!Number.isFinite(end)||end<=start)throw new RangeError('End time must follow tip-off');
  return end;
 };
 const end=parseEnd(game.endTime??game.endsAt),estimated=parseEnd(game.estimatedEndTime);
 // Never infer COLLECTED from tip-off, including an inconsistent final flag at tip-off.
 if(clock<=start)return {endedAt:null,source:null};
 if(game.final===true||game.finished===true)return {endedAt:new Date(end!==null&&end<=clock?end:clock).toISOString(),source:'final'};
 if(end!==null&&clock>=end)return {endedAt:new Date(end).toISOString(),source:'endTime'};
 // An explicit real-feed non-final state (or real end time) supersedes mock estimation.
 if(game.final===false||game.finished===false||end!==null)return {endedAt:null,source:null};
 return estimated!==null&&clock>=estimated?{endedAt:new Date(estimated).toISOString(),source:'estimate'}:{endedAt:null,source:null};
}
