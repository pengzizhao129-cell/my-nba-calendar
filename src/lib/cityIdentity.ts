import {CITIES,DEFAULT_CITY,cityById,type CityIdentity} from '../data/cities';

export {CITIES,DEFAULT_CITY,cityById,type CityIdentity} from '../data/cities';

export interface CityIdentityInput {
 readonly cityId?:string|null;
 readonly city?:string|null;
 readonly timezone?:string|null;
}

const normalizeName=(value:string)=>value.trim().replace(/\s+/g,' ').toLowerCase();
const citiesByName=new Map(CITIES.flatMap(city=>[city.id,city.name,city.nameZh,city.cityCode].map(name=>[normalizeName(name),city] as const)));

// The earlier selector represented both Chinese cities in one timezone option.
// Preserve that legacy label deterministically; explicit Shanghai remains Shanghai.
for(const alias of ['北京 / 上海','北京/上海','beijing / shanghai'])citiesByName.set(normalizeName(alias),cityById('beijing')!);
for(const [alias,id] of [['東京','tokyo'],['神戸','kobe'],['神戶','kobe'],['休士顿','houston']] as const) {
 citiesByName.set(normalizeName(alias),cityById(id)!);
}

/** Explicit city identity wins over legacy names and timezone-only fallback. */
export function resolveCityIdentity({cityId,city,timezone}:CityIdentityInput={}):CityIdentity {
 const explicit=cityById(cityId);
 if(explicit)return explicit;
 const named=typeof city==='string'?citiesByName.get(normalizeName(city)):undefined;
 if(named)return named;
 // The first authored city in a timezone is its legacy fallback, never a guess
 // that a viewer in Asia/Tokyo selected Kobe instead of Tokyo.
 return CITIES.find(candidate=>candidate.timezone===timezone)??DEFAULT_CITY;
}

/** Printed coordinates come from authored metadata, never an IANA path suffix. */
export function locationCoordinate(city:CityIdentity) {
 return {city:city.name,country:city.countryCode,cityCode:city.cityCode};
}

/** An offset describes an instant in a timezone, including daylight saving time. */
export function formatTimezoneOffset(date:Date,timezone:string):string {
 const offset=new Intl.DateTimeFormat('en-US',{timeZone:timezone,timeZoneName:'shortOffset'})
  .formatToParts(date).find(part=>part.type==='timeZoneName')!.value;
 return /^GMT[+-]0(?::00)?$/.test(offset)?'GMT':offset;
}

export const CITY_STORAGE_KEY='mygame_city_id';
export type CityStorage=Pick<Storage,'getItem'|'setItem'>;
type CityStorageSource=CityStorage|(()=>CityStorage);
const browserStorage=()=>window.localStorage;
const getStorage=(source:CityStorageSource)=>typeof source==='function'?source():source;

/** Storage is optional and untrusted; reading never creates or repairs an entry. */
export function readSelectedCity(storage:CityStorageSource=browserStorage):CityIdentity {
 try{return cityById(getStorage(storage).getItem(CITY_STORAGE_KEY))??DEFAULT_CITY;}
 catch{return DEFAULT_CITY;}
}

/** Return the selected identity even when a browser denies persistence. */
export function writeSelectedCity(cityId:string,storage:CityStorageSource=browserStorage):CityIdentity {
 const city=resolveCityIdentity({cityId});
 try{getStorage(storage).setItem(CITY_STORAGE_KEY,city.id);}catch{/* The caller can retain its selection in session state. */}
 return city;
}
