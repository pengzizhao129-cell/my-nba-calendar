/** A viewing city is an identity; several cities may share one IANA timezone. */
export interface CityIdentity {
 readonly id:string;
 readonly name:string;
 readonly nameZh:string;
 readonly country:string;
 readonly countryCode:string;
 readonly cityCode:string;
 /** Compatibility alias for consumers that explicitly name the three-letter code. */
 readonly cityCode3:string;
 readonly timezone:string;
}

const citySeeds = [
 ['tokyo','TOKYO','东京','Japan','JP','TYO','Asia/Tokyo'],
 ['kobe','KOBE','神户','Japan','JP','KOB','Asia/Tokyo'],
 ['beijing','BEIJING','北京','China','CN','BJS','Asia/Shanghai'],
 ['shanghai','SHANGHAI','上海','China','CN','SHA','Asia/Shanghai'],
 ['seoul','SEOUL','首尔','South Korea','KR','SEL','Asia/Seoul'],
 ['singapore','SINGAPORE','新加坡','Singapore','SG','SIN','Asia/Singapore'],
 ['london','LONDON','伦敦','United Kingdom','GB','LON','Europe/London'],
 ['paris','PARIS','巴黎','France','FR','PAR','Europe/Paris'],
 ['berlin','BERLIN','柏林','Germany','DE','BER','Europe/Berlin'],
 ['new-york','NEW YORK','纽约','United States','US','NYC','America/New_York'],
 ['toronto','TORONTO','多伦多','Canada','CA','TOR','America/Toronto'],
 ['los-angeles','LOS ANGELES','洛杉矶','United States','US','LAX','America/Los_Angeles'],
 ['vancouver','VANCOUVER','温哥华','Canada','CA','VAN','America/Vancouver'],
 ['sydney','SYDNEY','悉尼','Australia','AU','SYD','Australia/Sydney'],
 ['melbourne','MELBOURNE','墨尔本','Australia','AU','MEL','Australia/Melbourne'],
 ['brisbane','BRISBANE','布里斯班','Australia','AU','BNE','Australia/Brisbane'],
 ['auckland','AUCKLAND','奥克兰','New Zealand','NZ','AKL','Pacific/Auckland'],
 ['houston','HOUSTON','休斯敦','United States','US','HOU','America/Chicago'],
 ['san-antonio','SAN ANTONIO','圣安东尼奥','United States','US','SAT','America/Chicago'],
] as const;

export const CITIES:readonly CityIdentity[]=Object.freeze(citySeeds.map(([id,name,nameZh,country,countryCode,cityCode,timezone])=>
 Object.freeze({id,name,nameZh,country,countryCode,cityCode,cityCode3:cityCode,timezone})
));

export const DEFAULT_CITY:CityIdentity=CITIES[0];

const citiesById=new Map(CITIES.map(city=>[city.id,city]));
export function cityById(id:unknown):CityIdentity|undefined {
 return typeof id==='string'?citiesById.get(id):undefined;
}
