const assert=require('node:assert/strict');
let chromium;
try {({chromium}=require('playwright'));}
catch {({chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const baseURL=process.env.MYGAME_APP_URL||'http://127.0.0.1:3200';

async function until(page,fn,message) {
  await page.waitForFunction(fn,undefined,{timeout:5000}).catch(error=>{throw new Error(message+': '+error.message);});
}

async function main() {
 const browser=await chromium.launch({executablePath:process.env.PROMO_CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const errors=[];
 try {
  const page=await browser.newPage({viewport:{width:390,height:844},locale:'zh-CN',reducedMotion:'no-preference'});
  page.on('pageerror',error=>errors.push(error.message));
  const response=await page.goto(baseURL,{waitUntil:'networkidle'});
  assert.equal(response.status(),200);
  await page.locator('.system-island-item').first().waitFor();
  const nav=page.locator('.app-system-island');
  assert.equal(await nav.getAttribute('data-context'),'navigation','No unsolicited initial context');
  assert.equal(await nav.locator('button').count(),3);
  assert.equal(await page.locator('.tipoff-time .quiet-value-current').innerText(),'10:00');
  const initialCollection=await page.locator('.collection-stack>span').allTextContents();
  assert.deepEqual(initialCollection,['PASS 0147','GAME 01 / 82','SEASON 26–27']);
  const originalSecurity=await page.locator('.ticket-main>.pass-security').evaluate(element=>element.style.backgroundImage);
  assert.equal(await nav.locator('[aria-current="page"] .island-cn').innerText(),'首页');
  assert.equal(await nav.evaluate(element=>getComputedStyle(element).backgroundColor),'rgb(24, 25, 23)');

  await page.selectOption('#city','Europe/London');
  await until(page,()=>document.querySelector('.app-system-island')?.getAttribute('data-context')==='game-day','London should open contextual state');
  assert.match(await nav.locator('[role="status"]').innerText(),/HOU\s*·\s*GAME DAY\s*·\s*01:00/);
  assert.equal(await page.locator('.zone-label .quiet-value-current').innerText(),'伦敦');
  assert.equal(await page.locator('.tipoff-time .quiet-value-current').innerText(),'01:00');
  assert.deepEqual(await page.locator('.collection-stack>span').allTextContents(),initialCollection,'Changing city must not issue a different pass');
  assert.equal(await page.locator('.ticket-main>.pass-security').evaluate(element=>element.style.backgroundImage),originalSecurity,'Timezone must not change team paper identity');
  assert.equal(await nav.locator('button:enabled').count(),3,'Navigation stays available during context');
  await until(page,()=>document.querySelector('.app-system-island')?.getAttribute('data-context')==='navigation','Context should automatically close');
  await until(page,()=>Math.abs(document.querySelector('.app-system-island').getBoundingClientRect().height-72)<.1,'Island should return to its 72px resting height');
  assert.equal(await page.locator('.quiet-value-old').count(),0,'Old values must leave the DOM after crossfade');

  await page.selectOption('#city','Asia/Tokyo');
  await until(page,()=>document.querySelector('.app-system-island')?.getAttribute('data-context')==='game-day','Tokyo should update context');
  assert.match(await nav.locator('[role="status"]').innerText(),/10:00/);
  await nav.getByRole('button',{name:/赛程/}).click();
  assert.equal(await nav.getAttribute('data-context'),'navigation','Navigation dismisses context immediately');
  assert.equal(await nav.locator('[aria-current="page"] .island-cn').innerText(),'赛程');
  await nav.getByRole('button',{name:/首页/}).click();
  assert.equal(await nav.getAttribute('data-context'),'navigation','Tab changes do not announce unrelated game context');

  // Rapid changes must neither retain stale time nor manufacture a game-day state.
  await page.selectOption('#city','Europe/London');
  await page.locator('.team-select').click();
  await page.locator('.team-choice').filter({hasText:'BOS'}).click();
  assert.equal(await nav.getAttribute('data-context'),'navigation');
  assert.equal((await nav.locator('[role="status"]').innerText()).trim(),'');
  assert.match(await page.locator('.game-status').innerText(),/今天无比赛/);
  assert.equal(await page.locator('.pass-security').count(),0,'Teams without an authored crest must not receive a borrowed watermark');
  await page.locator('.team-select').click();
  await page.locator('.team-choice').filter({hasText:'HOU'}).click();
  await until(page,()=>document.querySelector('.app-system-island')?.getAttribute('data-context')==='game-day','Valid matchday should restore context');
  assert.match(await nav.locator('[role="status"]').innerText(),/HOU\s*·\s*GAME DAY\s*·\s*01:00/);

  await page.emulateMedia({reducedMotion:'reduce'});
  await page.selectOption('#city','Asia/Tokyo');
  assert.equal(await nav.evaluate(element=>getComputedStyle(element).transitionDuration),'0s');
  assert.equal(await page.locator('.quiet-value-current').first().evaluate(element=>getComputedStyle(element).animationName),'none');
  assert.equal(await page.locator('.tipoff-time .quiet-value-current').innerText(),'10:00');
  await nav.getByRole('button',{name:/我的/}).click();
  await page.getByRole('switch',{name:'使用真实日期'}).click();
  assert.equal(await nav.getAttribute('data-context'),'navigation','Real date without a fixture must not announce a game');
  await page.getByRole('switch',{name:'使用真实日期'}).click();
  await nav.getByRole('button',{name:/首页/}).click();

  const stock=[];
  for(const team of ['HOU','LAL','GSW','DAL','DEN']) {
   await page.locator('.team-select').click();
   await page.locator('.team-choice').filter({hasText:team}).click();
   const paper=page.locator('.ticket-main>.pass-security');
   assert.equal(await paper.getAttribute('data-security-team'),team);
   stock.push(await paper.evaluate(element=>element.style.backgroundImage));
   if(await page.locator('.collection-stack').count())assert.equal(await page.locator('.collection-stack>span').first().innerText(),'PASS 0147','Selecting a team must not replace the user identity');
  }
  assert.equal(new Set(stock).size,5,'Five authored crests must produce five different security stocks');
  await page.locator('.team-select').click();await page.locator('.team-choice').filter({hasText:'HOU'}).click();

  for(const width of [320,390,480,1080]) {
   await page.setViewportSize({width,height:844});
   await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
   const geometry=await page.evaluate(()=>{
    const island=document.querySelector('.app-system-island');
    const b=island.getBoundingClientRect();
    return {x:b.x,right:b.right,width:b.width,bottom:b.bottom,viewport:innerWidth,viewportHeight:innerHeight,scrollWidth:document.documentElement.scrollWidth,items:[...island.querySelectorAll('.system-island-item')].map(element=>{
     const item=element.getBoundingClientRect();const icon=element.querySelector('svg').getBoundingClientRect();const cn=element.querySelector('.island-cn').getBoundingClientRect();const en=element.querySelector('.island-en').getBoundingClientRect();return {width:item.width,icon:icon.y,cn:cn.y,en:en.y,overflow:element.scrollWidth>element.clientWidth+1};
    }),contentBottom:document.querySelector('.timezone-note').getBoundingClientRect().bottom,islandTop:b.y};
   });
   assert.ok(geometry.x>0&&geometry.right<width,'Island must float inside the viewport');
   assert.equal(geometry.scrollWidth,width,'No horizontal scrollbar');
   assert.ok(geometry.viewportHeight-geometry.bottom>=22,'Bottom safe area remains visible');
   assert.ok(geometry.contentBottom<geometry.islandTop,'Bottom content must clear the island');
   for(const item of geometry.items){assert.ok(!item.overflow);for(const key of ['icon','cn','en'])assert.equal(item[key],geometry.items[0][key]);}
   const ticket=await page.evaluate(()=>{
    const box=selector=>{const b=document.querySelector(selector).getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom,height:b.height};};
    return {stub:box('.ticket-stub'),record:box('.collection-stack'),serial:box('.ticket-number'),venue:box('.venue-detail'),rows:[...document.querySelectorAll('.collection-stack>span')].map(element=>({width:element.scrollWidth,available:document.querySelector('.ticket-stub').clientWidth}))};
   });
   assert.ok(ticket.venue.bottom<ticket.stub.y,'Venue stays on the main ticket');
   assert.ok(ticket.record.x>=ticket.stub.x&&ticket.record.bottom<ticket.stub.bottom);
   assert.ok(ticket.record.right+8<ticket.serial.x,'Printed collection and serial must not collide at mobile widths');
   assert.equal(ticket.stub.height,82);
  }
  assert.deepEqual(errors,[],'No runtime page errors');
  console.log('PASS: city/time navigation, contextual reset, reduced motion, no-game handling; independent collection ID, five team-specific security stocks, unknown-team clearing, mobile stub layout, and 320/390/480/1080px navigation safe areas.');
 } finally {await browser.close();}
}

main().catch(error=>{console.error(error);process.exitCode=1;});
