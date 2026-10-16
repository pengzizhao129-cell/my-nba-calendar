import test from 'node:test';
import assert from 'node:assert/strict';
import {timezones} from '../src/lib/timezone';
import {CITIES,DEFAULT_CITY,cityById,CITY_STORAGE_KEY,resolveCityIdentity,locationCoordinate,formatTimezoneOffset,readSelectedCity,writeSelectedCity} from '../src/lib/cityIdentity';

test('Cities sharing an IANA timezone keep their own identity and printed coordinates',()=>{
 const tokyo=cityById('tokyo')!,kobe=cityById('kobe')!;
 assert.equal(tokyo.timezone,kobe.timezone);
 assert.notEqual(tokyo.id,kobe.id);
 assert.deepEqual(locationCoordinate(tokyo),{city:'TOKYO',country:'JP',cityCode:'TYO'});
 assert.deepEqual(locationCoordinate(kobe),{city:'KOBE',country:'JP',cityCode:'KOB'});
 assert.equal(resolveCityIdentity({cityId:'kobe',city:'东京',timezone:'Europe/London'}),kobe);
 assert.equal(resolveCityIdentity({city:'神户',timezone:'Asia/Tokyo'}),kobe);
 assert.equal(resolveCityIdentity({timezone:'Asia/Tokyo'}),tokyo,'Timezone alone cannot imply Kobe');
 const beijing=cityById('beijing')!,shanghai=cityById('shanghai')!;
 assert.equal(beijing.timezone,shanghai.timezone);
 assert.notEqual(beijing.cityCode,shanghai.cityCode);
 assert.equal(resolveCityIdentity({city:'上海',timezone:'Asia/Shanghai'}),shanghai);
 assert.equal(resolveCityIdentity({timezone:'Asia/Shanghai'}),beijing);
});

test('The city catalog covers every legacy city with stable unique codes and valid zones',()=>{
 assert.equal(new Set(CITIES.map(city=>city.id)).size,CITIES.length);
 assert.equal(new Set(CITIES.map(city=>city.cityCode)).size,CITIES.length);
 assert.equal(new Set(CITIES.map(city=>`${city.countryCode}/${city.cityCode}`)).size,CITIES.length);
 for(const city of CITIES){
  assert.match(city.id,/^[a-z]+(?:-[a-z]+)*$/);
  assert.match(city.countryCode,/^[A-Z]{2}$/);
  assert.match(city.cityCode,/^[A-Z]{3}$/);
  assert.equal(city.cityCode3,city.cityCode);
  assert.ok(city.nameZh&&city.country);
  assert.doesNotThrow(()=>new Intl.DateTimeFormat('en',{timeZone:city.timezone}).format(new Date('2026-10-25T00:00:00Z')));
 }
 for(const legacy of timezones){
  assert.ok(CITIES.some(city=>city.timezone===legacy.id));
  assert.equal(resolveCityIdentity({city:legacy.city,timezone:legacy.id}).timezone,legacy.id);
 }
 assert.equal(cityById('london')?.countryCode,'GB');
 assert.equal(cityById('constructor'),undefined);
 assert.equal(cityById('toString'),undefined);
 assert.equal(cityById(null),undefined);
});

test('Legacy names resolve before timezone fallback and unknown data defaults to Tokyo',()=>{
 for(const [name,id] of [['东京','tokyo'],['北京 / 上海','beijing'],['NEW YORK','new-york'],['los angeles','los-angeles'],[' 神户 ','kobe'],['上海','shanghai']]) {
  assert.equal(resolveCityIdentity({city:name,timezone:'Europe/London'}).id,id);
 }
 assert.equal(resolveCityIdentity({cityId:'missing',city:'伦敦'}).id,'london');
 assert.equal(resolveCityIdentity({city:'unknown',timezone:'Australia/Sydney'}).id,'sydney');
 assert.equal(resolveCityIdentity({cityId:'missing',city:'unknown',timezone:'unknown'}),DEFAULT_CITY);
 assert.equal(resolveCityIdentity(),DEFAULT_CITY);
});

test('Selected city storage preserves stable IDs and tolerates corrupt or unavailable storage',()=>{
 const values=new Map<string,string>();let writes=0;
 const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{writes++;values.set(key,value);}};
 assert.equal(readSelectedCity(storage),DEFAULT_CITY);
 assert.equal(writes,0,'Reading an empty store must not issue an implicit selection');
 assert.equal(writeSelectedCity('kobe',storage).id,'kobe');
 assert.equal(values.get(CITY_STORAGE_KEY),'kobe');
 assert.equal(readSelectedCity(()=>storage).id,'kobe');
 assert.equal(writes,1);
 for(const corrupt of ['', 'Asia/Tokyo','{"id":"kobe"}','"kobe"','constructor','unknown']) {
  values.set(CITY_STORAGE_KEY,corrupt);
  assert.equal(readSelectedCity(storage),DEFAULT_CITY);
 }
 assert.equal(writes,1,'A corrupt stored ID is ignored without mutating storage');
 const denied=()=>{throw new Error('Storage denied');};
 assert.equal(readSelectedCity(denied),DEFAULT_CITY);
 assert.equal(writeSelectedCity('kobe',denied).id,'kobe');
 assert.equal(readSelectedCity(),DEFAULT_CITY,'Server use does not require a browser');
});

test('Offset formatting follows the requested instant, including daylight saving transitions',()=>{
 assert.equal(formatTimezoneOffset(new Date('2026-10-25T00:00:00Z'),'Asia/Tokyo'),'GMT+9');
 assert.equal(formatTimezoneOffset(new Date('2026-11-01T05:30:00Z'),'America/New_York'),'GMT-4');
 assert.equal(formatTimezoneOffset(new Date('2026-11-01T06:30:00Z'),'America/New_York'),'GMT-5');
 assert.equal(formatTimezoneOffset(new Date('2026-01-01T00:00:00Z'),'Europe/London'),'GMT');
});
