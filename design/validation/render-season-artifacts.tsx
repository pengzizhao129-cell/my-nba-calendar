import {renderToStaticMarkup} from 'react-dom/server';
import {PassShareCard} from '../../src/components/PassShareCard';
import {SeasonSummaryCard} from '../../src/components/SeasonSummaryCard';
import {GamePass} from '../../src/components/GamePass';
import {seasonSeriesFixture,seriesPass} from './seasonSeriesFixture';
import {createPersonalPass} from '../../src/lib/personalPass';
import {mockGames,DEMO_NOW} from '../../src/data/mockGames';

const name=process.argv[2],games=seasonSeriesFixture(),end=(i:number)=>new Date(Date.parse(games[i].estimatedEndTime!)+1000);
let content;
if(name==='series'){
 const now=new Date(Date.parse(games[41].startsAt)+3600000);
 content=<main className="series-preview"><header><strong>HOU · SEASON 26–27</strong><span>PASS 0147 · 82-PASS SERIES · VALIDATION MOCK</span></header><div className="series-grid">{games.map((game,i)=><GamePass key={game.id} pass={seriesPass(i,now)} variant="collection"/>)}</div></main>;
}else if(name==='variants'){
 const pass=seriesPass(0,new Date(DEMO_NOW));
 content=<main className="variant-preview">{(['full','compact','collection'] as const).map(variant=><div key={variant}><p>{variant}</p><GamePass pass={pass} variant={variant}/></div>)}</main>;
}else if(name==='kobe'||name==='tokyo-story'||name==='london-story'||name==='kobe-story'){
 const london=name==='london-story',kobe=name==='kobe'||name==='kobe-story';
 const pass=createPersonalPass({passId:'0147',teamCode:'HOU',game:mockGames[0],games:mockGames,now:new Date(DEMO_NOW),city:london?'伦敦':kobe?'神户':'东京',timezone:london?'Europe/London':'Asia/Tokyo'});
 content=<PassShareCard pass={pass} format={name.endsWith('-story')?'story':'feed'}/>;
}else{
 let pass=seriesPass(0,new Date(DEMO_NOW));
 if(name==='next-up')pass=seriesPass(0,new Date(Date.parse(games[0].startsAt)-10*86400000));
 else if(name==='collected')pass=seriesPass(0,end(0));
 else if(name==='milestone')pass=seriesPass(40,end(40));
 else if(name==='season-complete')pass=seriesPass(81,end(81));
 else if(name==='london')pass=seriesPass(0,new Date(DEMO_NOW),{city:'伦敦',timezone:'Europe/London'});
 else if(name==='lal')pass=createPersonalPass({passId:'0147',teamCode:'LAL',game:mockGames[0],games:mockGames,now:new Date(DEMO_NOW),city:'东京',timezone:'Asia/Tokyo'});
 content=name==='season-complete'?<SeasonSummaryCard pass={pass}/>:<PassShareCard pass={pass} moment={name==='milestone'?'milestone':undefined}/>;
}
const styles=`<style>
@font-face{font-family:Geist;src:url('/GeistSans.woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'MyGame Timing';src:url('/timing-450.woff2');font-weight:450;font-display:block}
@font-face{font-family:'MyGame Timing';src:url('/timing-500.woff2');font-weight:500;font-display:block}
@font-face{font-family:'MyGame Timing';src:url('/timing-550.woff2');font-weight:550;font-display:block}
@font-face{font-family:'MyGame Identity';src:url('/identity-600.woff2');font-weight:600;font-display:block}
@font-face{font-family:'Event Annotation';src:url('/event-annotation.woff2');font-weight:400;font-display:block}
:root{--font-geist:Geist;--font-timing:'MyGame Timing';--font-identity:'MyGame Identity';--font-annotation:'Event Annotation'}
body{margin:0;font-family:Geist,'Noto Sans CJK SC',sans-serif;font-synthesis:none}
.series-preview{width:2160px;padding:64px;background:var(--canvas-base)}
.series-preview>header{height:112px;display:flex;align-items:baseline;justify-content:space-between;color:var(--text-secondary);letter-spacing:.12em;font-size:24px}
.series-preview>header>span{font-size:16px;color:var(--text-tertiary)}
.series-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:24px}
.variant-preview{width:1080px;padding:64px;display:grid;grid-template-columns:1fr;gap:48px;background:var(--canvas-base)}
.variant-preview>div{width:728px}.variant-preview p{font-size:16px;line-height:24px;color:var(--text-tertiary);margin:0 0 24px}
</style>`;
const css=['color-material','app-base','system-island','pass-dna','pass-app','mobile-pass-enclosure','brand-lockup','personal-season','pass-share'].map(file=>`<link rel="stylesheet" href="/${file}.css">`).join('');
process.stdout.write(`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${css}${styles}<body>${renderToStaticMarkup(content)}</body></html>`);
