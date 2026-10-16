export type Emotion='Next up'|'Coming up'|'Tip-off'|'Home night'|'Remember this one';
export type PassStatus={readonly phase:'next-up'|'coming-up'|'game-day'|'started'|'finished';readonly emotionMark:Emotion};
export type StatusInput={startsAt:string;endsAt?:string;finished?:boolean;homeNight?:boolean};

/** Absolute event clock only: a location change must not change the annotation. */
export function resolvePassStatus(game:StatusInput,now:Date):PassStatus {
 const start=Date.parse(game.startsAt),clock=now.getTime(),end=game.endsAt?Date.parse(game.endsAt):null;
 if(!Number.isFinite(start)||!Number.isFinite(clock)||(end!==null&&(!Number.isFinite(end)||end<start)))throw new RangeError('Invalid event clock');
 if(game.finished||(end!==null&&clock>=end))return {phase:'finished',emotionMark:'Remember this one'};
 const distance=(start-clock)/3600000;
 if(distance>72)return {phase:'next-up',emotionMark:'Next up'};
 if(distance>=24)return {phase:'coming-up',emotionMark:'Coming up'};
 return {phase:distance<=0?'started':'game-day',emotionMark:game.homeNight?'Home night':'Tip-off'};
}
