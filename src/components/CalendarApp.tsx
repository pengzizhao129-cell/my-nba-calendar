'use client';
import {useState} from 'react';
import {ChevronDown, Globe2, Navigation, X, Check} from 'lucide-react';
import {teams,getTeam} from '@/data/teams';
import {mockGames} from '@/data/mockGames';
import {dateKey,detectTimezone,formatDate,timezones} from '@/lib/timezone';
import {getSchedule} from '@/lib/schedule';
import {TeamSymbol,teamEnglishNames} from './TeamIdentity';
import {SportsSignal} from './SportsSignal';
import {NumericValue} from './NumericValue';
import {SystemIsland,type IslandTab} from './SystemIsland';
import {QuietValue} from './QuietValue';
import {GamePass} from './GamePass';
import {createPersonalPass,selectPassGame} from '@/lib/personalPass';
import {usePassId} from '@/hooks/usePassId';
import {usePassClock} from '@/hooks/usePassClock';

const debugUI = process.env.NEXT_PUBLIC_DEBUG_UI === 'true';

export default function CalendarApp(){
 const [teamId,setTeamId]=useState('HOU');const [zone,setZone]=useState('Asia/Tokyo');const [tab,setTab]=useState<IslandTab>('首页');const [teamPicker,setTeamPicker]=useState(false);const [notice,setNotice]=useState('');const [live,setLive]=useState(false);
 const passId=usePassId();const [selectedGameId,setSelectedGameId]=useState<string|null>('hou-1');
 const now=usePassClock(live);const team=getTeam(teamId);const city=timezones.find(z=>z.id===zone)?.city??zone;const schedule=getSchedule(mockGames,teamId,zone,now);
 const en=(date:Date,options:Intl.DateTimeFormatOptions)=>new Intl.DateTimeFormat('en-US',{...options,timeZone:zone}).format(date).toUpperCase();
 const cityEnglish=zone.split('/').pop()!.replaceAll('_',' ').toUpperCase();
 const offset=en(now,{timeZoneName:'shortOffset'}).split(', ').pop();
 const countryCodes:Record<string,string>={'日本':'JP','中国':'CN','韩国':'KR','新加坡':'SG','英国':'UK','法国':'FR','德国':'DE','美国':'US','加拿大':'CA','澳大利亚':'AU','新西兰':'NZ'};
 const countryCode=countryCodes[timezones.find(z=>z.id===zone)?.country??''];
 const time=(date:Date)=>formatDate(date,zone,{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 function locate(){try{const detected=detectTimezone();setZone(detected);setNotice(`已识别设备时区：${timezones.find(t=>t.id===detected)?.city??detected}`);}catch{setNotice('暂时无法识别，请手动选择城市。');}}
 const featured=schedule.today[0];
 const selected=selectPassGame(mockGames,teamId,selectedGameId,now);
 const pass=selected?createPersonalPass({passId,teamCode:teamId,game:selected,city,timezone:zone,now}):null;
 function selectTeam(id:string){
  setTeamId(id);
  if(!selected||(selected.home!==id&&selected.away!==id))setSelectedGameId(null);
  setTeamPicker(false);
 }
 function selectGame(id:string){setSelectedGameId(id);setTab('首页');}
 return <main className="app-shell" >
 <header className="brand-header"><div className="brand-line"><h1><span className="brand-name">我的主队日历</span> <span className="wordmark">MyGame<b>+</b></span></h1></div><div className="header-detail"><p>NBA 主队赛程 · 本地时间</p></div></header>
 <section className="preferences"><button className="team-select" onClick={()=>setTeamPicker(true)}><span className="eyebrow">MY TEAM <span>我的主队</span></span><strong><TeamSymbol team={team} size={15}/><span className="team-code" style={{'--team-accent':team.primaryColor,color:'var(--team-accent)'} as React.CSSProperties}>{team.abbr}</span><span className="team-name">{team.city}{team.name}</span><ChevronDown size={10}/></strong><span className="team-english">{teamEnglishNames[teamId]}</span></button><div className="timezone-select"><span className="eyebrow global-label">LOCAL TIME<button onClick={locate} aria-label="自动识别时区"><Navigation size={11} strokeWidth={1.5}/></button></span><div className="zone-label"><Globe2 size={13} strokeWidth={1.5}/><label htmlFor="city"><QuietValue value={city}/></label><ChevronDown size={12}/><select id="city" aria-label="我所在的城市 / 时区" value={zone} onChange={e=>{setZone(e.target.value);setNotice('')}}>{!timezones.some(t=>t.id===zone)&&<option value={zone}>{zone}</option>}{timezones.map(t=><option key={t.id} value={t.id}>{t.city}</option>)}</select></div><div className="offset"><span>{cityEnglish}{countryCode?` · ${countryCode}`:''} / {offset}</span></div></div></section>
 {notice&&<p role="status" className="notice">{notice}</p>}
 <div className="content">{tab==='我的'?<section className="profile"><span className="eyebrow">PROFILE</span><h2>我的看球偏好</h2><div className="card space-y-5 p-5"><p className="flex justify-between text-sm"><span className="ink-secondary">主队</span><span>{team.city}{team.name}</span></p><p className="flex justify-between gap-3 text-sm"><span className="ink-secondary">时区</span><span className="break-all">{zone}</span></p><div className="flex items-center justify-between gap-3"><div><p className="text-sm">使用真实日期</p>{debugUI&&<p className="mt-1 text-[11px] ink-secondary">关闭时展示 2026.10.25 演示赛程</p>}</div><button role="switch" aria-checked={live} aria-label="使用真实日期" onClick={()=>{setLive(!live);setSelectedGameId(null)}} className={`h-6 w-10 shrink-0 rounded-full p-1 preference-switch ${live?'is-on':''}`}><span className={`block h-4 w-4 rounded-full switch-thumb transition-transform ${live?'translate-x-4':''}`}/></button></div>{debugUI&&<p className="border-t border-semantic pt-4 text-xs leading-6 ink-secondary">所有比赛均为本地模拟数据，不代表 NBA 官方赛程。比赛时间按 IANA 时区转换，自动处理夏令时。</p>}</div></section>:<>
 {tab==='首页'&&(pass?<GamePass pass={pass} isToday={pass.location.dateKey===dateKey(now,zone)}/>:<section className="rest-state"><p>暂无后续赛程</p></section>)}
 <section className="week"><div className="section-heading"><div><span className="eyebrow">NEXT 7 DAYS</span><h2>我的一周赛程</h2></div><div className="week-count"><strong><NumericValue value={schedule.week.length}/></strong><span>场比赛</span></div></div><div className="schedule-list">{schedule.week.map(game=>{const start=new Date(game.startsAt);const opponent=getTeam(game.home===teamId?game.away:game.home);const today=dateKey(start,zone)===dateKey(now,zone);return <button type="button" className="schedule-row" key={game.id} data-game-id={game.id} aria-pressed={selected?.id===game.id} aria-label={`查看 ${formatDate(start,zone,{month:'numeric',day:'numeric'})} 对阵${opponent.name}的比赛通行证`} onClick={()=>selectGame(game.id)}><div className="row-date"><b>{formatDate(start,zone,{month:'2-digit',day:'2-digit'}).replace('/','.').replace('月','.').replace('日','')}</b><small>{schedule.next?.id===game.id?<SportsSignal type="next" label="NEXT"/>:today?'今天':formatDate(start,zone,{weekday:'short'})}</small></div><div className="row-team"><small className="team-chip" style={{'--team-accent':opponent.primaryColor,color:'var(--team-accent)'} as React.CSSProperties}>{opponent.abbr}</small><strong>{opponent.name}</strong></div><span className={`venue-tag ${game.home===teamId?'is-home':''}`}>{game.home===teamId?'HOME':'AWAY'}</span><b className="row-time"><NumericValue value={time(start)}/></b></button>})}{!schedule.week.length&&<p className="empty-week">未来 7 天暂无比赛</p>}</div>{tab==='首页'&&<button className="schedule-link" onClick={()=>setTab('赛程')}>查看我的赛程</button>}</section>
 <aside className="timezone-note"><Globe2 size={12} strokeWidth={1.5}/><p>{city} · {offset}<span> · 全部赛程已自动换算</span></p></aside></>}
 {debugUI&&<footer>本地模拟数据 · {live?'真实日期模式':'演示日期 2026.10.25'} · 非官方赛程</footer>}</div>
 <SystemIsland tab={tab} onSelect={setTab} context={featured&&!featured.finished&&(!featured.endsAt||Date.parse(featured.endsAt)>now.getTime())?{key:`${teamId}:${zone}:${featured.id}:${live?'live':'demo'}`,team:team.abbr,time:time(new Date(featured.startsAt))}:undefined}/>
 {teamPicker&&<div className="fixed inset-0 z-40 flex items-end justify-center dialog-scrim p-3 backdrop-blur-sm" onClick={()=>setTeamPicker(false)}><section role="dialog" aria-modal="true" aria-label="选择我的主队" onClick={e=>e.stopPropagation()} className="max-h-[85dvh] w-full max-w-[456px] overflow-auto team-picker surface-dialog p-5"><div className="mb-1 flex items-center justify-between"><h2 className="text-lg font-semibold">选择我的主队</h2><button aria-label="关闭球队选择" onClick={()=>setTeamPicker(false)}><X size={20}/></button></div><p className="mb-5 text-xs ink-micro">30 支球队，只为你的热爱</p><div className="grid grid-cols-3 gap-2">{teams.map(t=><button key={t.id} onClick={()=>selectTeam(t.id)} className={`team-choice relative border p-3 text-left ${t.id===teamId?'is-selected':'border-semantic'}`}><span className="text-lg font-semibold" style={{'--team-accent':t.primaryColor,color:'var(--team-accent)'} as React.CSSProperties}>{t.abbr}</span><p className="mt-1 text-[10px] ink-micro">{t.city}</p><p className="mt-0.5 text-xs font-medium">{t.name}</p>{t.id===teamId&&<Check size={13} className="absolute right-2 top-2 ink-secondary"/>}</button>)}</div></section></div>} </main>
}
