/** Season definitions never depend on the user's currently selected season. */
export type Season={readonly id:string;readonly seasonCode:string;readonly totalGames:number};
export type PersonalSeason={readonly seasonId:string;readonly seasonCode:string;readonly teamCode:string;readonly totalGames:number;readonly collectedGames:number;readonly archivedGameIds:readonly string[]};
export const DEMO_SEASON:Season=Object.freeze({id:'2026-27',seasonCode:'26–27',totalGames:82});
export const seasons:Readonly<Record<string,Season>>={[DEMO_SEASON.id]:DEMO_SEASON};
