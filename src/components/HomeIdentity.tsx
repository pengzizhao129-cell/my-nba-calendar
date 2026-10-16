'use client';
import {ChevronDown,Navigation} from 'lucide-react';
import type {Team} from '@/data/teams';
import {timezones} from '@/lib/timezone';
import {BrandLockup} from './BrandLockup';
import {QuietValue} from './QuietValue';

export function HomeHeader({city,country}:{city:string;country?:string}){
 const tokyo=city==='TOKYO';
 return <header className="brand-header">
  <div className="home-edition"><span className="city-state">{tokyo?'TOKYO':`TOKYO → ${city}`}{country&&` · ${country}`}</span><span>WEB APP BETA</span></div>
  <div className="brand-line"><BrandLockup/></div>
  <div className="header-detail"><p>NBA 主队赛程 · 本地时间</p><p className="home-slogan">{tokyo?'无论在哪，主队准时见。':'换个城市，不换主队。'}</p></div>
 </header>;
}

export function HomeCoordinates({team,zone,city,offset,onTeam,onZone,onLocate}:{team:Team;zone:string;city:string;offset?:string;onTeam:()=>void;onZone:(value:string)=>void;onLocate:()=>void}){
 return <section className="preferences" aria-label="主队与所在城市">
  <button className="team-select" onClick={onTeam}><span className="eyebrow">MY TEAM</span><strong><span className="team-code">{team.abbr}</span><span className="team-name">{team.city}{team.name}</span><ChevronDown size={12}/></strong></button>
  <div className="timezone-select"><span className="eyebrow global-label">LOCAL<button onClick={onLocate} aria-label="自动识别时区"><Navigation size={11} strokeWidth={1.4}/></button></span><div className="zone-label"><label htmlFor="city"><QuietValue value={city}/></label><ChevronDown size={12}/><select id="city" aria-label="我所在的城市 / 时区" value={zone} onChange={event=>onZone(event.target.value)}>{!timezones.some(t=>t.id===zone)&&<option value={zone}>{zone}</option>}{timezones.map(t=><option key={t.id} value={t.id}>{t.city}</option>)}</select></div><span className="offset">{offset}</span></div>
 </section>;
}
