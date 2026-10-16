const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const sharp=require('sharp');
let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const baseURL=process.env.MYGAME_APP_URL||'http://127.0.0.1:4000';
const archiveKey='mygame_archived_games:HOU:26-27';
const errors=[];
async function open(context){const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error'&&/hydration|did not match/i.test(e.text()))errors.push(e.text());});assert.equal((await page.goto(baseURL,{waitUntil:'networkidle'})).status(),200);await page.waitForFunction(()=>/^PASS \d{4}$/.test(document.querySelector('.pass-id')?.textContent)||document.querySelector('[role=dialog]'));if(await page.getByRole('dialog').count())await page.locator('.team-choice').filter({hasText:'HOU'}).click();await page.waitForFunction(()=>/^PASS \d{4}$/.test(document.querySelector('.pass-id')?.textContent));await page.waitForFunction(()=>!document.querySelector('.personal-pass[data-issuance]'));await page.evaluate(()=>document.fonts.ready);return page;}
async function team(page,code){await page.locator('.team-select').click();await page.locator('.team-choice').filter({hasText:code}).click();}
async function state(page,phase,energy){await page.waitForFunction(({phase,energy})=>{const e=document.querySelector('.personal-pass');return e?.dataset.passStatus===phase&&(!energy||e.dataset.passEnergy===energy);},{phase,energy});}
async function fingerprint(page){return page.locator('.personal-pass').evaluate(pass=>{
 const h=pass.getBoundingClientRect(),s=getComputedStyle(pass),rect=selector=>{const b=pass.querySelector(selector).getBoundingClientRect();return{x:b.x-h.x,y:b.y-h.y,width:b.width,height:b.height};};
 const symbol=pass.querySelector('.team-identity>strong'),signal=pass.querySelector('.sports-signal-mark'),pattern=pass.querySelector('.pass-security');
 return {id:pass.dataset.gameId,team:pass.dataset.team,season:pass.dataset.season,phase:pass.dataset.passStatus,energy:pass.dataset.passEnergy,collected:Number(pass.dataset.collectedGames),record:[...pass.querySelectorAll('.collection-stack>span')].map(e=>e.textContent),serial:pass.querySelector('.ticket-number').textContent,emotion:pass.querySelector('.emotion-mark')?.textContent,progress:pass.querySelector('.collection-count')?.textContent,
  architecture:{version:pass.dataset.dna,ratio:h.width/h.height,outline:getComputedStyle(pass.querySelector('.ticket-object')).maskImage,cuts:[...pass.querySelectorAll('.ticket-cut-edges path')].map(e=>e.getAttribute('d')),geometry:Object.fromEntries(['.ticket-main','.ticket-stub','.match','.tipoff','.venue-detail','.collection-stack','.collection-progress','.emotion-mark','.ticket-join','.mg-bridge','.collectible-spine','.pass-security','.mobile-pass-enclosure','.mobile-shell-signature'].map(selector=>[selector,rect(selector)])),enclosure:{version:pass.querySelector('.mobile-pass-enclosure').dataset.enclosureDna,paths:[...pass.querySelectorAll('.mobile-pass-enclosure path')].map(e=>e.getAttribute('d'))},font:getComputedStyle(pass.querySelector('.timing-run')).fontFamily},
  enclosure:{opacity:Number(getComputedStyle(pass.querySelector('.mobile-shell-refraction')).opacity),ink:getComputedStyle(pass.querySelector('.mobile-shell-refraction')).color,gradient:getComputedStyle(pass.querySelector('.mobile-refraction-gradient stop')).stopColor,pointer:getComputedStyle(pass.querySelector('.mobile-pass-enclosure')).pointerEvents},
  paper:{surface:s.getPropertyValue('--pass-surface').trim(),temperature:s.getPropertyValue('--temperature-intensity').trim(),security:getComputedStyle(pattern).opacity,annotation:getComputedStyle(pass.querySelector('.emotion-mark')).opacity,time:getComputedStyle(pass.querySelector('.tipoff-time')).color,serial:getComputedStyle(pass.querySelector('.ticket-number')).color},
  stock:pattern.style.getPropertyValue('--security-mask'),accent:getComputedStyle(symbol).color,
  signal:{type:signal.parentElement.dataset.type,color:getComputedStyle(signal).backgroundColor,opacity:getComputedStyle(signal).opacity},
  canvas:getComputedStyle(document.querySelector('.app-shell')).backgroundColor,island:getComputedStyle(document.querySelector('.system-island')).backgroundColor,
  stencil:pass.querySelector('.perforation')?getComputedStyle(pass.querySelector('.perforation')).maskImage:'',
 };
});}
async function live(page){await page.locator('.system-island-item').filter({hasText:'我的'}).click();const control=page.getByRole('switch',{name:'使用真实日期'});if(await control.getAttribute('aria-checked')!=='true')await control.click();await page.locator('.system-island-item').filter({hasText:'首页'}).click();}
async function clock(page,time){await page.clock.setSystemTime(new Date(time));await page.clock.fastForward(31000);}
/** Paint-neutral diagnostics reveal geometry; these styles never reach exported artwork. */
async function dnaRaster(page,name){
 const style=await page.addStyleTag({content:`
 .personal-pass{filter:none!important}
 .personal-pass *,.personal-pass *::before,.personal-pass *::after{visibility:hidden!important;transition:none!important;animation:none!important}
 .personal-pass .ticket-paper{visibility:visible!important;background:var(--pass-base)!important;box-shadow:none!important;border-color:transparent!important}
 .personal-pass .perforation,.personal-pass .mg-bridge,.personal-pass .collectible-spine{visibility:visible!important;background:var(--graphite-100)!important;opacity:1!important}
 .personal-pass .ticket-cut-edges,.personal-pass .ticket-cut-edges path{visibility:visible!important;stroke:var(--graphite-100)!important}
 .personal-pass .dna-probe{visibility:visible!important;background:var(--graphite-70)!important;position:absolute!important}
 `});
 try{
  await page.locator('.personal-pass').evaluate(pass=>{
   const css=getComputedStyle(pass),unit=pass.getBoundingClientRect().width/Number(css.getPropertyValue('--dna-master-width'));
   for(const region of ['security','timing']){
    const frame=document.createElement('span');frame.className='dna-probe';
    for(const [field,property] of [['x','left'],['y','top'],['width','width'],['height','height']])frame.style[property]=`${Number(css.getPropertyValue(`--dna-${region}-${field}`))*unit}px`;
    pass.querySelector('.ticket-object').append(frame);
   }
  });
  const png=await page.locator('.personal-pass').screenshot({path:`/tmp/mygame-v2.4-dna-${name}.png`,animations:'disabled'});
  return sharp(png).ensureAlpha().raw().toBuffer();
 }finally{await page.locator('.dna-probe').evaluateAll(nodes=>nodes.forEach(node=>node.remove()));await style.evaluate(node=>node.remove());}
}
async function main({materialOnly=false}={}){
 errors.length=0;
 const browser=await chromium.launch({executablePath:process.env.PROMO_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 const checks=[],report={};
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN',reducedMotion:'reduce'}),page=await open(context);
  const id=await page.evaluate(()=>localStorage.getItem('mygame_pass_id'));
  const tokyo=await fingerprint(page);assert.deepEqual(tokyo.record,[`PASS ${id}`,'GAME 01 / 82','SEASON 26–27']);assert.equal(tokyo.emotion,'Tip-off');
  await page.reload({waitUntil:'networkidle'});await state(page,'game_day');assert.equal((await fingerprint(page)).record[0],`PASS ${id}`);
  const second=await open(context);assert.equal((await fingerprint(second)).record[0],`PASS ${id}`);await second.close();
  await page.selectOption('#city','Europe/London');await state(page,'game_day');const london=await fingerprint(page);
  for(const key of ['architecture','record','stock','id','season'])assert.deepEqual(london[key],tokyo[key]);
  assert.equal(await page.locator('.tipoff-time .quiet-value-current').textContent(),'01:00');assert.match(await page.locator('.time-caption').innerText(),/伦敦 · GMT\+1/);
  await page.waitForFunction(()=>document.querySelector('.app-system-island').dataset.context==='navigation');
  assert.equal(await page.locator('.system-island-item').count(),3);checks.push('Persistent four-digit ID; Tokyo/London location conversion and identical DNA; contextual navigation reset');
  const stocks=[];for(const code of ['HOU','LAL','GSW','DAL','DEN','BOS']){await team(page,code);stocks.push((await fingerprint(page)).stock);assert.equal((await fingerprint(page)).record[0],`PASS ${id}`);assert.equal(await page.locator('.emotion-mark').count(),1);}
  assert.equal(new Set(stocks).size,6);
  await team(page,'HOU');await page.locator('.system-island-item').filter({hasText:'赛程'}).click();await page.locator('[data-game-id="hou-1"].schedule-row').click();
  await team(page,'LAL');const lal=await fingerprint(page);assert.notEqual(lal.accent,'rgb(98, 83, 130)','Identity uses quiet printed ink, not raw team accent');assert.ok(lal.accent.startsWith('color(srgb')); assert.notEqual(lal.stock,tokyo.stock);assert.deepEqual(lal.architecture,tokyo.architecture);assert.notEqual(lal.enclosure.ink,tokyo.enclosure.ink);assert.equal(lal.enclosure.pointer,'none');assert.equal(lal.enclosure.gradient,lal.enclosure.ink);assert.equal(tokyo.enclosure.gradient,tokyo.enclosure.ink);
  await team(page,'HOU');await page.selectOption('#city','Asia/Tokyo');checks.push('Six team identity/security stocks with the same master geometry and user ID');
  for(const width of [320,390,480,1080]){
   await page.setViewportSize({width,height:844});await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
   const layout=await page.evaluate(()=>{const r=s=>{const b=document.querySelector(s).getBoundingClientRect();return{x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height};};return{scroll:document.documentElement.scrollWidth,brand:r('.brand-lockup'),seal:r('.app-mark'),brandName:r('.brand-lockup h1'),signature:r('.brand-signature'),identityFont:getComputedStyle(document.querySelector('.personal-pass .team-identity>strong')).fontFamily,pass:r('.personal-pass'),main:r('.ticket-main'),stub:r('.ticket-stub'),join:r('.ticket-join'),bridge:r('.mg-bridge'),record:r('.collection-stack'),serial:r('.ticket-number'),emotion:r('.emotion-mark'),time:r('.tipoff'),caption:r('.time-caption'),venue:r('.venue-detail'),island:r('.app-system-island'),last:r('.timezone-note')};});
   assert.equal(layout.scroll,width);assert.ok(layout.seal.right+4<=layout.brandName.x&&layout.brandName.right+8<=layout.signature.x&&layout.signature.right<=layout.brand.right+.5,'Brand seal/name/signature must retain their gaps on every viewport');assert.ok(layout.seal.y>=layout.brand.y&&layout.seal.bottom<=layout.brand.bottom+.1);assert.ok(/identity/i.test(layout.identityFont),'The live identity print must use the shared custom alphabet');assert.ok(Math.abs(layout.pass.width/layout.pass.height-728/576)<.001);assert.ok(Math.abs(layout.main.height/layout.pass.height-480/576)<.001);
   assert.ok(layout.record.right+4<layout.serial.x);assert.ok(layout.record.right+4<layout.emotion.x);assert.ok(layout.time.bottom<=layout.join.y);assert.ok(layout.venue.bottom<=layout.join.y);assert.ok(layout.caption.right+2<=layout.venue.x);
   assert.ok(layout.last.bottom<layout.island.y);assert.ok(844-layout.island.bottom>=22);assert.ok(layout.island.x>0&&layout.island.right<width);
  }
  checks.push('320/390/480/1080px: fixed Brand Lockup, shared identity alphabet, main/stub ratio, separated timing/venue and dock safe area');
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'/tmp/mygame-v2.4-app-tokyo.png',fullPage:true});
  await page.selectOption('#city','Europe/London');await page.screenshot({path:'/tmp/mygame-v2.4-app-london.png',fullPage:true});await context.close();

  const timed=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN',reducedMotion:'reduce'});await timed.addInitScript(()=>localStorage.setItem('mygame_pass_id','0147'));
  const p=await timed.newPage();p.on('pageerror',e=>errors.push(e.message));await p.clock.install({time:new Date('2026-10-01T00:00:00Z')});await p.goto(baseURL,{waitUntil:'networkidle'});await live(p);await state(p,'next_up');const next=await fingerprint(p);const nextDNA=await dnaRaster(p,'next_up');await p.locator(".personal-pass").screenshot({path:"/tmp/mygame-v2.4-next-material.png"});
  await p.locator('.system-island-item').filter({hasText:'赛程'}).click();await p.locator('.schedule-row[data-game-id="hou-2"]').click();await state(p,'upcoming');const upcoming=await fingerprint(p);const upcomingDNA=await dnaRaster(p,'upcoming');await p.locator(".personal-pass").screenshot({path:"/tmp/mygame-v2.4-upcoming-material.png"});
  await p.locator('.system-island-item').filter({hasText:'赛程'}).click();await p.locator('.schedule-row[data-game-id="hou-1"]').click();await state(p,'next_up');
  await clock(p,'2026-10-24T16:00:00Z');await state(p,'game_day','day');const day=await fingerprint(p);const dayDNA=await dnaRaster(p,'game_day');await p.locator(".personal-pass").screenshot({path:"/tmp/mygame-v2.4-day-material.png"});
  await p.selectOption('#city','Europe/London');await state(p,'next_up');const londonBefore=await fingerprint(p);assert.deepEqual(londonBefore.architecture,day.architecture);assert.deepEqual(londonBefore.record,day.record);
  await p.selectOption('#city','Asia/Tokyo');await state(p,'game_day','day');
  await clock(p,'2026-10-24T19:00:00Z');await state(p,'game_day','approaching');const approaching=await fingerprint(p);await p.locator(".personal-pass").screenshot({path:"/tmp/mygame-v2.4-approaching-material.png"});
  await clock(p,'2026-10-24T22:00:01Z');await state(p,'game_day','imminent');const imminent=await fingerprint(p);await p.locator(".personal-pass").screenshot({path:"/tmp/mygame-v2.4-imminent-material.png"});
  await clock(p,'2026-10-25T01:00:00Z');await state(p,'game_day');assert.equal((await fingerprint(p)).collected,0,'Tip-off does not archive');
  await clock(p,'2026-10-25T04:00:00Z');await state(p,'archived');await p.waitForFunction(()=>document.querySelector('.personal-pass').dataset.collectedGames==='1');const collected=await fingerprint(p);const collectedDNA=await dnaRaster(p,'archived');
  for(const raster of [nextDNA,dayDNA,collectedDNA])assert.ok(raster.equals(upcomingDNA),'All four states must have identical silhouette/bridge/spine/security/timing geometry pixels');await p.locator(".personal-pass").screenshot({path:"/tmp/mygame-v2.4-collected-material.png"});
  assert.equal(collected.id,'hou-1');assert.equal(collected.progress,'01 / 82 COLLECTED');assert.equal(collected.emotion,'Collected');assert.equal(collected.signal.type,'completed');assert.equal(collected.signal.color,'rgba(0, 0, 0, 0)');
  assert.equal(upcoming.phase,'upcoming');assert.equal(next.phase,'next_up');assert.notEqual(upcoming.paper.surface,next.paper.surface);assert.ok(Number(upcoming.paper.security)<Number(next.paper.security));
  for(const item of [next,day,approaching,imminent,collected]){assert.deepEqual(item.architecture,upcoming.architecture);assert.equal(item.canvas,upcoming.canvas);assert.equal(item.island,upcoming.island);}
  for(const item of [day,approaching,imminent,collected])assert.deepEqual(item.record,next.record);
  assert.ok(Number(day.paper.temperature)<Number(imminent.paper.temperature));assert.notEqual(collected.paper.time,imminent.paper.time);assert.notEqual(collected.accent,imminent.accent);
  assert.ok(Math.abs(day.enclosure.opacity/next.enclosure.opacity-1.2)<.001,'GAME DAY rim has only a 20% energy lift');assert.ok(collected.enclosure.opacity<next.enclosure.opacity);assert.equal(collected.architecture.enclosure.version,'MG-ENCLOSURE-1');
  const raw=await p.evaluate(key=>localStorage.getItem(key),archiveKey);assert.deepEqual(JSON.parse(raw),['hou-1']);
  await p.reload({waitUntil:'networkidle'});await state(p,'archived');assert.equal(await p.evaluate(key=>localStorage.getItem(key),archiveKey),raw);assert.equal((await fingerprint(p)).collected,1);
  await live(p);await p.locator('.system-island-item').filter({hasText:'赛程'}).click();await p.locator('.schedule-row[data-game-id="hou-1"]').click();await state(p,'archived');
  for(let i=0;i<3;i++)await p.clock.fastForward(31000);
  assert.equal((await fingerprint(p)).collected,1);assert.equal(await p.evaluate(key=>localStorage.getItem(key),archiveKey),raw);
  await p.evaluate(()=>{
   localStorage.setItem('mygame_archived_games:LAL:26-27',JSON.stringify(['lal-only']));
   localStorage.setItem('mygame_archived_games:HOU:27-28',JSON.stringify(['next-season-only']));
   const original=Storage.prototype.getItem;window.archiveReads=[];
   Storage.prototype.getItem=function(key){if(key.startsWith('mygame_archived_games:')||key.startsWith('mygame_pass_records:'))window.archiveReads.push(key);return original.call(this,key);};
  });
  await team(p,'GSW');await p.waitForFunction(()=>document.querySelector('.personal-pass').dataset.team==='GSW'&&document.querySelector('.personal-pass').dataset.collectedGames==='0');
  assert.deepEqual(await p.evaluate(()=>window.archiveReads.filter(key=>key.includes(':HOU:')||key.includes(':LAL:'))),[],'Switching teams must never read another team archive');
  assert.deepEqual(JSON.parse(await p.evaluate(()=>localStorage.getItem('mygame_archived_games:LAL:26-27'))),['lal-only']);
  assert.deepEqual(JSON.parse(await p.evaluate(()=>localStorage.getItem('mygame_archived_games:HOU:27-28'))),['next-season-only']);
  await team(p,'HOU');await p.locator('.system-island-item').filter({hasText:'赛程'}).click();await p.locator('.schedule-row[data-game-id="hou-1"]').click();await state(p,'archived');
  checks.push('Tip-off cannot collect; repeated archive stays at one; team key reads and other-season bytes stay isolated');
  const other=await open(timed);await state(other,'archived');assert.equal((await fingerprint(other)).collected,1);await other.close();
  await p.locator('.system-island-item').filter({hasText:'赛程'}).click();await p.locator('.schedule-row[data-game-id="hou-2"]').click();await p.locator('.system-island-item').filter({hasText:'赛程'}).click();await p.locator('.schedule-row[data-game-id="hou-1"]').click();await state(p,'archived');
  await live(p);await p.locator('.system-island-item').filter({hasText:'赛程'}).click();await p.locator('.schedule-row[data-game-id="hou-1"]').click();await clock(p,'2026-11-04T00:00:00Z');await p.waitForFunction(()=>document.querySelector('.personal-pass').dataset.collectedGames==='5');assert.equal((await fingerprint(p)).id,'hou-1');
  checks.push('Ranking-based NEXT UP, timezone-local GAME DAY, private energy bands, automatic COLLECTED; four-state DNA raster pixels match exactly');
  checks.push('Archive persists across reload/tabs, deduplicates IDs, retains selected pass after end, and remains reachable from the existing schedule');
  report.states={upcoming,next,day,approaching,imminent,collected,londonBefore};
  report.dnaRaster={compared:['upcoming','next_up','game_day','archived'],pixelDifferences:0};
  assert.equal(collected.canvas,'rgb(241, 239, 234)');assert.equal(collected.island,'rgb(27, 28, 26)');
  await timed.close();

  if(!materialOnly){
   const historic=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
   await historic.addInitScript(()=>{
    localStorage.setItem('mygame_pass_id','0147');localStorage.setItem('mygame_selected_team','HOU');localStorage.setItem('mygame_selected_game','hou-history-17');
    const fixture={id:'hou-history-17',home:'HOU',away:'LAL',startsAt:'2026-10-01T01:00:00Z',endsAt:'2026-10-01T04:00:00Z',venue:'丰田中心',seasonId:'2026-27',gameNumbers:{HOU:17}};
    localStorage.setItem('mygame_archived_games_26_27',JSON.stringify({version:1,passes:[{gameId:fixture.id,teamCode:'HOU',gameNumber:17,seasonId:'2026-27',seasonCode:'26–27',passState:'archived',archivedAt:fixture.endsAt,fixture}]}));
   });
   const history=await open(historic);await state(history,'archived');assert.equal((await fingerprint(history)).id,'hou-history-17');assert.equal((await fingerprint(history)).record[1],'GAME 17 / 82');
   await history.reload({waitUntil:'networkidle'});await state(history,'archived');assert.equal((await fingerprint(history)).id,'hou-history-17');await historic.close();checks.push('A focused historical pass restores from its archive snapshot even after removal from the current fixture data');
   const damaged=await browser.newContext({viewport:{width:390,height:844}});await damaged.addInitScript(()=>{localStorage.setItem('mygame_pass_id','0843');localStorage.setItem('mygame_archived_games:HOU:26-27','bad data');});const d=await open(damaged);assert.equal((await fingerprint(d)).record[0],'PASS 0843');assert.equal((await fingerprint(d)).phase,'game_day');await damaged.close();
   const denied=await browser.newContext({viewport:{width:390,height:844}});await denied.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError');}}));const deniedPage=await open(denied);const before=(await fingerprint(deniedPage)).record[0];await deniedPage.selectOption('#city','Europe/London');assert.equal((await fingerprint(deniedPage)).record[0],before);await denied.close();checks.push('Leading zeroes, corrupt archive and unavailable storage do not crash or replace session identity');
  }
  assert.deepEqual(errors,[]);await fs.writeFile(`/tmp/mygame-v2.4-${materialOnly?'material':'app'}-validation.json`,JSON.stringify({checks,...report,errors},null,2));console.log(JSON.stringify({passed:checks.length,checks,errors},null,2));
 }finally{await browser.close();}
}
module.exports={main};
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
