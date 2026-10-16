export type SeasonMilestone='First Pass'|'Early Season'|'Halfway'|'Season Complete';
export type MilestoneInput={gameNumber?:number|null;collectedGames:number;totalGames:number};

export function resolveSeasonMilestone(input:MilestoneInput):SeasonMilestone|null;
export function resolveSeasonMilestone(collectedGames:number,totalGames:number):SeasonMilestone|null;
export function resolveSeasonMilestone(input:MilestoneInput|number,total?:number):SeasonMilestone|null {
 const {gameNumber,collectedGames,totalGames}=typeof input==='number'?{collectedGames:input,totalGames:total!,gameNumber:null}:input;
 if(!Number.isInteger(totalGames)||totalGames<1||!Number.isInteger(collectedGames)||collectedGames<0||collectedGames>totalGames
  ||(gameNumber!=null&&(!Number.isInteger(gameNumber)||gameNumber<1||gameNumber>totalGames)))throw new RangeError('Invalid season progress');
 if(collectedGames===totalGames)return 'Season Complete';
 if(collectedGames>=Math.ceil(totalGames/2))return 'Halfway';
 if(collectedGames>=10)return 'Early Season';
 return gameNumber===1||collectedGames>=1?'First Pass':null;
}

/** A ticket keeps its own ordinal mark; later progress never relabels old passes. */
export function resolveTicketMilestone({gameNumber,collectedGames,totalGames,collected}:{gameNumber:number|null;collectedGames:number;totalGames:number;collected:boolean}):SeasonMilestone|null {
 resolveSeasonMilestone({gameNumber,collectedGames,totalGames});
 if(gameNumber===1)return 'First Pass';
 if(!collected||gameNumber===null||collectedGames<gameNumber)return null;
 if(gameNumber===totalGames)return 'Season Complete';
 if(gameNumber===Math.ceil(totalGames/2))return 'Halfway';
 return gameNumber===10?'Early Season':null;
}
