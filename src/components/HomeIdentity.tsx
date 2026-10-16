'use client';
import {ChevronDown,Navigation} from 'lucide-react';
import type {Team} from '@/data/teams';
import {CITIES,type CityIdentity} from '@/data/cities';
import {BrandLockup} from './BrandLockup';
import {QuietValue} from './QuietValue';

export function HomeHeader({city,country}:{city:string;country?:string}){
 const tokyo=city==='TOKYO';
 const displayCountry=country==='GB'?'UK':country;
 return <header className="brand-header">
  <div className="home-edition"><span className="city-state">{city}{displayCountry&&` · ${displayCountry}`}</span><span>WEB APP BETA</span></div>
  <div className="brand-line"><BrandLockup/></div>
  <div className="header-detail"><p>NBA 主队赛程 · 本地时间</p><p className="home-slogan">{tokyo?'无论在哪，主队准时见。':'换个城市，不换主队。'}</p></div>
 </header>;
}

export function HomeCoordinates({team,city,offset,onTeam,onCity,onLocate}:{team:Team;city:CityIdentity;offset?:string;onTeam:()=>void;onCity:(value:string)=>void;onLocate:()=>void}){
 const displayCountry=city.countryCode==='GB'?'UK':city.countryCode;
 return <section className="preferences" aria-label="主队与所在城市">
  <button className="team-select" onClick={onTeam} aria-label={`更改主队：${team.city}${team.name}`}><span className="eyebrow">MY TEAM</span><strong><span className="team-code">{team.abbr}</span><ChevronDown size={12}/></strong><span className="team-name">{team.city}{team.name}</span></button>
  <div className="timezone-select"><span className="eyebrow global-label">WATCHING FROM<button onClick={onLocate} aria-label="自动识别时区"><Navigation size={11} strokeWidth={1.4}/></button></span><div className="zone-label" data-city-length={city.name.length>10?'long':'short'}><label htmlFor="city"><QuietValue value={city.name}/><span className="coordinate-country"> · {displayCountry}</span></label><ChevronDown size={12}/><select id="city" aria-label="我所在的城市 / 时区" value={city.id} onChange={event=>onCity(event.target.value)}>{CITIES.map(option=><option key={option.id} value={option.id}>{option.nameZh} · {option.name} / {option.countryCode==='GB'?'UK':option.countryCode}</option>)}</select></div><span className="offset">{offset}</span></div>
 </section>;
}
