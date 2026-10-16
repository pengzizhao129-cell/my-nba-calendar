const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
let chromium;
try {({chromium}=require('playwright'));}
catch {({chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const baseURL=process.env.MYGAME_APP_URL||'http://127.0.0.1:3400';
const key='mygame_pass_id';

async function open(context,errors) {
 const page=await context.newPage();
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',message=>{if(message.type()==='error'&&/hydrat|did not match/i.test(message.text()))errors.push(message.text());});
 assert.equal((await page.goto(baseURL,{waitUntil:'networkidle'})).status(),200);
 await page.locator('.pass-id').waitFor();
 await page.waitForFunction(()=>/^PASS \d{4}$/.test(document.querySelector('.pass-id')?.textContent));
 await page.evaluate(()=>document.fonts.ready);
 return page;
}
async function record(page) {return page.locator('.collection-stack>span').allTextContents();}
async function emotion(page,text) {await page.waitForFunction(expected=>document.querySelector('.emotion-mark')?.textContent===expected,text);assert.equal(await page.locator('.emotion-mark').count(),1);assert.equal(await page.locator('.ticket-stub .emotion-mark').count(),1);}
async function fingerprint(page) {return page.evaluate(()=>{
 const hero=document.querySelector('.personal-pass'),h=hero.getBoundingClientRect();
 const rect=element=>{const b=element.getBoundingClientRect();return{x:b.x-h.x,y:b.y-h.y,width:b.width,height:b.height};};
 return {game:hero.dataset.gameId,team:hero.dataset.team,season:hero.dataset.season,record:[...hero.querySelectorAll('.collection-stack>span')].map(e=>e.textContent),serial:hero.querySelector('.ticket-number').textContent,emotion:hero.querySelector('.emotion-mark').textContent,security:[...hero.querySelectorAll('.pass-security')].map(e=>e.style.getPropertyValue('--security-mask')),geometry:Object.fromEntries(['.ticket-main','.ticket-stub','.match','.tipoff','.venue-detail','.collection-stack','.emotion-mark'].map(s=>[s,rect(hero.querySelector(s))]))};
});}
async function selectTeam(page,code) {await page.locator('.team-select').click();await page.locator('.team-choice').filter({hasText:code}).click();}

async function main(){
 const browser=await chromium.launch({executablePath:process.env.PROMO_CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const errors=[],checks=[];
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
  const page=await open(context,errors),id=await page.evaluate(key=>localStorage.getItem(key),key);
  assert.match(id,/^\d{4}$/);assert.deepEqual(await record(page),[`PASS ${id}`,'GAME 01 / 82','SEASON 26–27']);
  await emotion(page,'Tip-off');
  await page.reload({waitUntil:'networkidle'});await page.waitForFunction(id=>document.querySelector('.pass-id')?.textContent===`PASS ${id}`,id);
  const second=await open(context,errors);assert.equal(await second.evaluate(key=>localStorage.getItem(key),key),id);await second.close();
  checks.push('First visit, refresh and another tab retain the same four-digit ID');

  const nav=page.locator('.app-system-island');
  assert.equal(await nav.locator('button').count(),3);assert.equal(await nav.getAttribute('data-context'),'navigation');
  const tokyo=await fingerprint(page);assert.equal(await page.locator('.tipoff-time .quiet-value-current').textContent(),'10:00');
  await page.selectOption('#city','Europe/London');await emotion(page,'Tip-off');
  assert.equal(await page.locator('.tipoff-time .quiet-value-current').textContent(),'01:00');
  assert.match(await page.locator('.time-caption').innerText(),/伦敦 · GMT\+1/);
  const london=await fingerprint(page);assert.deepEqual(london,tokyo,'Location may not alter event identity, paper stock, collection, emotion or geometry');
  assert.equal(await nav.getAttribute('data-context'),'game-day');assert.equal(await nav.locator('button:enabled').count(),3);
  await page.waitForFunction(()=>document.querySelector('.app-system-island').dataset.context==='navigation');
  await page.waitForFunction(()=>document.querySelector('.quiet-value-old')===null);
  checks.push('Tokyo 10:00 / London 01:00, stable collection/security/geometry, 180ms crossfade and contextual reset');

  await page.locator('.schedule-row[data-game-id="hou-2"]').click();
  await emotion(page,'Coming up');assert.deepEqual(await record(page),[`PASS ${id}`,'GAME 02 / 82','SEASON 26–27']);
  assert.match(await page.locator('.match').innerText(),/GSW/);assert.match(await page.locator('.venue-name').innerText(),/大通中心/);
  assert.equal(await page.locator('.personal-pass').getAttribute('data-game-id'),'hou-2');
  assert.deepEqual((await fingerprint(page)).security,tokyo.security,'Game selection must not change team paper');
  await page.selectOption('#city','Asia/Tokyo');await emotion(page,'Coming up');assert.equal(await page.locator('.tipoff-time .quiet-value-current').textContent(),'11:00');
  await page.locator('.schedule-row[data-game-id="hou-1"]').click();await emotion(page,'Tip-off');
  checks.push('Existing programme rows select a pass: opponent/date/venue/ordinal/time/status update, user/team/season remain');

  const stock=[];
  for(const team of ['HOU','LAL','GSW','DAL','DEN','BOS']){
   await selectTeam(page,team);
   const paper=page.locator('.ticket-main>.pass-security');assert.equal(await paper.getAttribute('data-security-team'),team);
   stock.push(await paper.evaluate(e=>e.style.getPropertyValue('--security-mask')));assert.equal((await record(page))[0],`PASS ${id}`);
   assert.equal(await page.locator('.emotion-mark').count(),1);
  }
  assert.equal(new Set(stock).size,6);await selectTeam(page,'HOU');
  await selectTeam(page,'GSW');await page.locator('.schedule-row[data-game-id="hou-2"]').click();
  assert.deepEqual(await record(page),[`PASS ${id}`,'GAME — / 82','SEASON 26–27'],'An unknown opponent-team ordinal must not become a fabricated game number');
  await selectTeam(page,'HOU');await page.locator('.schedule-row[data-game-id="hou-1"]').click();
  checks.push('Different selected teams receive distinct stock and retain the user ID');

  await page.emulateMedia({reducedMotion:'reduce'});await page.selectOption('#city','Europe/London');
  assert.equal(await nav.evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
  assert.equal(await page.locator('.quiet-value-current').first().evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.selectOption('#city','Asia/Tokyo');
  for(const width of [320,390,480,1080]){
   await page.setViewportSize({width,height:844});await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
   const layout=await page.evaluate(()=>{
    const box=s=>{const b=document.querySelector(s).getBoundingClientRect();return{x:b.x,y:b.y,right:b.right,bottom:b.bottom,height:b.height};};
    return {scroll:document.documentElement.scrollWidth,nav:box('.app-system-island'),content:box('.timezone-note'),stub:box('.ticket-stub'),record:box('.collection-stack'),serial:box('.ticket-number'),note:box('.emotion-mark'),venue:box('.venue-detail'),items:[...document.querySelectorAll('.system-island-item')].map(e=>{const b=e.getBoundingClientRect();return{width:b.width,overflow:e.scrollWidth>e.clientWidth+1};})};
   });
   assert.equal(layout.scroll,width);assert.ok(layout.nav.x>0&&layout.nav.right<width);assert.ok(844-layout.nav.bottom>=22);assert.ok(layout.content.bottom<layout.nav.y);
   assert.ok(layout.venue.bottom<layout.stub.y);assert.ok(layout.record.right+8<layout.serial.x);assert.ok(layout.record.right+8<layout.note.x);assert.equal(layout.stub.height,82);
   for(const item of layout.items){assert.ok(!item.overflow);assert.ok(Math.abs(item.width-layout.items[0].width)<.02);}
  }
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:'/tmp/mygame-v2.3-cm-app-tokyo.png',fullPage:true});
  await page.selectOption('#city','Europe/London');await page.screenshot({path:'/tmp/mygame-v2.3-cm-app-london.png',fullPage:true});
  checks.push('320/390/480/1080px: stub fields, annotation and serial do not overlap; navigation and safe area remain intact');

  // Leading-zero IDs and corrupted local data survive the actual hydration path.
  await page.evaluate(key=>localStorage.setItem(key,'0843'),key);await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>document.querySelector('.pass-id')?.textContent==='PASS 0843');
  await page.evaluate(key=>localStorage.setItem(key,'invalid'),key);await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>/^PASS \d{4}$/.test(document.querySelector('.pass-id')?.textContent));
  assert.match(await page.evaluate(key=>localStorage.getItem(key),key),/^\d{4}$/);
  checks.push('Leading-zero identity and invalid stored ID recovery work after hydration');
  await context.close();

  // Drive the real-date mode with a deterministic browser clock; no API/score assumptions.
  const statusContext=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN',reducedMotion:'reduce'});
  const statusPage=await statusContext.newPage();statusPage.on('pageerror',error=>errors.push(error.message));
  await statusPage.clock.install({time:new Date('2026-10-20T21:00:00Z')});
  await statusPage.goto(baseURL,{waitUntil:'networkidle'});
  await statusPage.locator('.system-island-item').filter({hasText:'我的'}).click();
  await statusPage.getByRole('switch',{name:'使用真实日期'}).click();
  await statusPage.locator('.system-island-item').filter({hasText:'首页'}).click();await emotion(statusPage,'Next up');
  await statusPage.clock.fastForward(28*3600000);await emotion(statusPage,'Coming up');
  await statusPage.clock.fastForward(48.1*3600000);await emotion(statusPage,'Tip-off');
  await statusPage.locator('.schedule-row[data-game-id="hou-3"]').click();
  await statusPage.clock.setSystemTime(new Date('2026-10-28T22:00:00Z'));await statusPage.clock.fastForward(31000);await emotion(statusPage,'Home night');
  const night=await fingerprint(statusPage);await statusPage.selectOption('#city','Europe/London');await emotion(statusPage,'Home night');
  assert.deepEqual((await fingerprint(statusPage)).record,night.record);
  await statusPage.clock.setSystemTime(new Date('2026-10-29T04:00:00Z'));await statusPage.clock.fastForward(31000);await emotion(statusPage,'Remember this one');
  assert.equal(await statusPage.locator('.personal-pass').getAttribute('data-game-id'),'hou-3');
  assert.match(await statusPage.locator('.game-status').innerText(),/比赛已结束/);
  await statusContext.close();checks.push('All five emotions follow explicit event state, update on the open-page clock, and remain stub-only');

  const denied=await browser.newContext({viewport:{width:390,height:844}});
  await denied.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError');}}));
  const deniedPage=await open(denied,errors),temporary=await deniedPage.locator('.pass-id').innerText();
  await deniedPage.selectOption('#city','Europe/London');assert.equal(await deniedPage.locator('.pass-id').innerText(),temporary);await denied.close();
  checks.push('Denied browser storage does not crash the app and retains session identity');
  assert.deepEqual(errors,[],'No runtime or hydration errors');
  await fs.writeFile('/tmp/mygame-v2.3-cm-app-validation.json',JSON.stringify({checks,errors},null,2));
  console.log(JSON.stringify({passed:checks.length,checks,errors},null,2));
 }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
