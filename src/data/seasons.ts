export type Season={readonly id:string;readonly seasonCode:string;readonly totalGames:number};
export const DEMO_SEASON:Season=Object.freeze({id:'2026-27',seasonCode:'26–27',totalGames:82});
export const seasons:Readonly<Record<string,Season>>={[DEMO_SEASON.id]:DEMO_SEASON};
