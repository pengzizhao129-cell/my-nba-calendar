'use client';
import {useEffect,useState} from 'react';
import {X,Check} from 'lucide-react';
import {teams,getTeam} from '@/data/teams';
import {mockGames} from '@/data/mockGames';
import {dateKey,detectTimezone,formatDate} from '@/lib/timezone';
import {DEFAULT_CITY,cityById,readSelectedCity,writeSelectedCity,formatTimezoneOffset} from '@/lib/cityIdentity';
import {getSchedule} from '@/lib/schedule';
import {SportsSignal} from './SportsSignal';
import {NumericValue} from './NumericValue';
import {SystemIsland,type IslandTab} from './SystemIsland';
import {GamePass,type GamePassVariant} from './GamePass';
import {HomeHeader,HomeCoordinates} from './HomeIdentity';
import {getTeamIdentity,teamMaterialProperties} from '@/data/teamIdentities';
import {createPersonalPass,selectPassGame} from '@/lib/personalPass';
import {usePassId} from '@/hooks/usePassId';
import {usePassClock} from '@/hooks/usePassClock';
import {useSeasonArchive} from '@/hooks/useSeasonArchive';
import {seasonFixtures} from '@/lib/seasonLifecycle';
import {completedAt} from '@/lib/passStatus';

const debugUI = process.env.NEXT_PUBLIC_DEBUG_UI === 'true';

export default function CalendarApp({passVariant='full'}:{passVariant?:GamePassVariant}={}){
 const [teamId,setTeamId]=useState('HOU');const [cityId,setCityId]=useState(DEFAULT_CITY.id);const city=cityById(cityId)??DEFAULT_CITY,zone=city.timezone;const [tab,setTab]=useState<IslandTab>('首页');const [teamPicker,setTeamPicker]=useState(false);const [notice,setNotice]=useState('');const [live,setLive]=useState(false);
 const {passId,ready:identityReady,issuance,confirmIdentity}=usePassId();const [selectedGameId,setSelectedGameId]=useState<string|null>(null);
 const [selectionReady,setSelectionReady]=useState(false);const now=usePassClock(live);const {archive,ready:archiveReady}=useSeasonArchive(teamId,now,selectionReady&&identityReady&&passId!==null);const availableGames=seasonFixtures(mockGames,archive,teamId);const team=getTeam(teamId);const archivedIds=new Set(Object.values(archive).filter(item=>item.teamCode===teamId).map(item=>item.gameId));const schedule=getSchedule(availableGames,teamId,zone,now,archivedIds);
 const time=(date:Date)=>formatDate(date,zone,{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 function selectCity(id:string){setCityId(writeSelectedCity(id).id);setNotice('');}
 function locate(){try{const detected=detectTimezone();setNotice(`设备时区为 ${detected}；时区无法确定城市，请选择实际所在地。`);}catch{setNotice('暂时无法识别，请手动选择城市。');}}
 const featured=schedule.today[0];
 const selected=selectPassGame(availableGames,teamId,selectedGameId,now,archivedIds);
 const pass=selected?createPersonalPass({passId,teamCode:teamId,game:selected,city:city.nameZh,cityId:city.id,timezone:zone,now,games:availableGames,archive}):null;
 const offset=pass?.location.offset??formatTimezoneOffset(now,zone);
 useEffect(()=>{setCityId(readSelectedCity().id);try{const savedTeam=window.localStorage.getItem('mygame_selected_team');if(savedTeam&&teams.some(team=>team.id===savedTeam))setTeamId(savedTeam);}catch{}setSelectionReady(true);},[]);
 useEffect(()=>{if(!selectionReady||!archiveReady||!selected)return;try{window.localStorage.setItem('mygame_selected_game',selected.id);window.localStorage.setItem('mygame_selected_team',teamId);}catch{}},[selectionReady,archiveReady,selected?.id,teamId]);
 const visibleGames=tab==='赛程'?schedule.all:schedule.week;
 const previewGames=tab==='赛程'?visibleGames:visibleGames.slice(0,2);
 useEffect(()=>{if(identityReady&&selectionReady&&!passId)setTeamPicker(true);},[identityReady,selectionReady,passId]);
 function selectTeam(id:string){
  setTeamId(id);
  setSelectedGameId(null);
  setTeamPicker(false);
  try{window.localStorage.setItem('mygame_selected_team',id);}catch{}
  void confirmIdentity();
 }
 function selectGame(id:string){setSelectedGameId(id);setTab('首页');}
 return <main className="app-shell" >
 <HomeHeader city={city.name} country={city.countryCode}/>
 <HomeCoordinates team={team} city={city} offset={offset} onTeam={()=>setTeamPicker(true)} onCity={selectCity} onLocate={locate}/>
 {notice&&<p role="status" className="notice">{notice}</p>}
 <div className="content">{tab==='我的'?<section className="profile"><span className="eyebrow">PROFILE</span><h2>我的看球偏好</h2><div className="card space-y-5 p-5"><p className="flex justify-between text-sm"><span className="ink-secondary">主队</span><span>{team.city}{team.name}</span></p><p className="flex justify-between gap-3 text-sm"><span className="ink-secondary">时区</span><span className="break-all">{zone}</span></p><div className="flex items-center justify-between gap-3"><div><p className="text-sm">使用真实日期</p>{debugUI&&<p className="mt-1 text-[11px] ink-secondary">关闭时展示 2026.10.25 演示赛程</p>}</div><button role="switch" aria-checked={live} aria-label="使用真实日期" onClick={()=>{setLive(!live);setSelectedGameId(null)}} className={`h-6 w-10 shrink-0 rounded-full p-1 preference-switch ${live?'is-on':''}`}><span className={`block h-4 w-4 rounded-full switch-thumb transition-transform ${live?'translate-x-4':''}`}/></button></div>{debugUI&&<p className="border-t border-semantic pt-4 text-xs leading-6 ink-secondary">所有比赛均为本地模拟数据，不代表 NBA 官方赛程。比赛时间按 IANA 时区转换，自动处理夏令时。</p>}</div></section>:<>
 {tab==='首页'&&(pass?<GamePass pass={pass} issuance={issuance} variant={passVariant}/>:<section className="rest-state"><p>暂无后续赛程</p></section>)}
 <section className="week"><div className="section-heading"><div><span className="eyebrow">{tab==='赛程'?'SCHEDULE':'NEXT 7 DAYS'}</span><h2>{tab==='赛程'?'我的赛程':'未来比赛索引'}</h2></div><div className="week-count"><strong><NumericValue value={visibleGames.length}/></strong><span>场</span>{tab==='首页'&&<button className="schedule-link" aria-label="查看我的赛程" onClick={()=>setTab('赛程')}>全部</button>}</div></div><div className="schedule-list">{previewGames.map(game=>{const start=new Date(game.startsAt);const opponent=getTeam(game.home===teamId?game.away:game.home);const today=dateKey(start,zone)===dateKey(now,zone);return <button type="button" className="schedule-row" key={game.id} data-game-id={game.id} aria-pressed={selected?.id===game.id} aria-label={`查看 ${formatDate(start,zone,{month:'numeric',day:'numeric'})} 对阵${opponent.name}的比赛通行证`} onClick={()=>selectGame(game.id)}><div className="row-date"><b>{formatDate(start,zone,{month:'2-digit',day:'2-digit'}).replace('/','.').replace('月','.').replace('日','')}</b><small>{schedule.next?.id===game.id?<SportsSignal type="next" label="NEXT"/>:today?'今天':formatDate(start,zone,{weekday:'short'})}</small></div><div className="row-team"><small className="team-chip" style={{...teamMaterialProperties(getTeamIdentity(opponent.id)!),color:'var(--team-print-ink)'} as React.CSSProperties}>{opponent.abbr}</small><strong>{opponent.name}</strong></div><span className={`venue-tag ${game.home===teamId?'is-home':''}`}>{game.home===teamId?'HOME':'AWAY'}</span><b className="row-time"><NumericValue value={time(start)}/></b></button>})}{!visibleGames.length&&<p className="empty-week">未来 7 天暂无比赛</p>}</div></section>
</>}
 {debugUI&&<footer>本地模拟数据 · {live?'真实日期模式':'演示日期 2026.10.25'} · 非官方赛程</footer>}</div>
 <SystemIsland tab={tab} onSelect={value=>{if(value==='首页')setSelectedGameId(null);setTab(value)}} context={featured&&!completedAt(featured,now)?{key:`${teamId}:${city.id}:${featured.id}:${live?'live':'demo'}`,team:team.abbr,time:time(new Date(featured.startsAt))}:undefined}/>
 {teamPicker&&<div className="fixed inset-0 z-40 flex items-end justify-center dialog-scrim p-3 backdrop-blur-sm" onClick={()=>setTeamPicker(false)}><section role="dialog" aria-modal="true" aria-label="选择我的主队" onClick={e=>e.stopPropagation()} className="max-h-[85dvh] w-full max-w-[456px] overflow-auto team-picker surface-dialog p-5"><div className="mb-1 flex items-center justify-between"><h2 className="text-lg font-semibold">选择我的主队</h2><button aria-label="关闭球队选择" onClick={()=>setTeamPicker(false)}><X size={20}/></button></div><p className="mb-5 text-xs ink-micro">30 支球队，只为你的热爱</p><div className="grid grid-cols-3 gap-2">{teams.map(t=><button key={t.id} onClick={()=>selectTeam(t.id)} className={`team-choice relative border p-3 text-left ${passId&&t.id===teamId?'is-selected':'border-semantic'}`}><span className="text-lg font-semibold" style={{...teamMaterialProperties(getTeamIdentity(t.id)!),color:'var(--team-print-ink)'} as React.CSSProperties}>{t.abbr}</span><p className="mt-1 text-[10px] ink-micro">{t.city}</p><p className="mt-0.5 text-xs font-medium">{t.name}</p>{passId&&t.id===teamId&&<Check size={13} className="absolute right-2 top-2 ink-secondary"/>}</button>)}</div></section></div>} </main>
}
