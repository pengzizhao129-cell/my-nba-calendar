'use client';
import {useState} from 'react';
import CalendarApp from '../CalendarApp';
import {GamePass} from '../GamePass';
import {createPersonalPass} from '@/lib/personalPass';
import {mockGames,DEMO_NOW} from '@/data/mockGames';
import {cityById} from '@/data/cities';
import {ART_DIRECTIONS,ART_DIRECTION_LABELS,type ArtDirection} from './ArtPassPrimitives';

/** Development review surface only. No direction is promoted to the homepage. */
export function ArtDirectionReview({initialDirection,capture=false}:{initialDirection?:ArtDirection;capture?:boolean}){
 const [direction,setDirection]=useState<ArtDirection|undefined>(initialDirection);
 const [cityId,setCityId]=useState<'tokyo'|'london'>('tokyo');
 const city=cityById(cityId)!;
 const pass=createPersonalPass({passId:'0147',teamCode:'HOU',game:mockGames[0],games:mockGames,city:city.nameZh,cityId:city.id,timezone:city.timezone,now:new Date(DEMO_NOW)});
 return <div className="art-review" data-capture={capture||undefined}>
  <div className="art-review-tools"><span>ART DIRECTION REVIEW · 尚未选定正式方向</span><nav aria-label="开发用票面方向切换"><button aria-current={!direction?'page':undefined} onClick={()=>setDirection(undefined)}>总览</button>{ART_DIRECTIONS.map((value,i)=><button key={value} aria-label={`查看方案 ${String.fromCharCode(65+i)}`} aria-current={direction===value?'page':undefined} onClick={()=>setDirection(value)}>{String.fromCharCode(65+i)}</button>)}<a href="/">当前首页</a></nav></div>
  {direction?<CalendarApp passVariant={direction}/>:<main className="art-direction-overview"><header><div><h1>MyGame+ · Three Art Directions</h1><p>相同数据与编号；以下固定示例不写入本地身份。</p></div><div className="art-review-city-controls">{(['tokyo','london'] as const).map(value=><button key={value} aria-pressed={cityId===value} onClick={()=>setCityId(value)}>{value.toUpperCase()}</button>)}</div></header><div className="art-direction-grid">{ART_DIRECTIONS.map((value,i)=><article key={value}><header><strong>{String.fromCharCode(65+i)}</strong><h2>{ART_DIRECTION_LABELS[value]}</h2></header><GamePass pass={pass} variant={value}/><a href={`/review/art-direction?variant=${value}`}>在完整手机页面中查看</a></article>)}</div></main>}
 </div>;
}
