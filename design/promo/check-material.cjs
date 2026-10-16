const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const sharp=require('sharp');
let chromium;
try{({chromium}=require('playwright'));}
catch{({chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const baseURL=process.env.MYGAME_APP_URL||'http://127.0.0.1:3600';

async function read(page){return page.evaluate(()=>{
 const pass=document.querySelector('.personal-pass'),origin=pass.getBoundingClientRect(),style=getComputedStyle(pass),root=getComputedStyle(document.documentElement);
 const rect=selector=>{const b=pass.querySelector(selector).getBoundingClientRect();return{x:b.x-origin.x,y:b.y-origin.y,width:b.width,height:b.height};};
 const security=pass.querySelector('.pass-security'),signal=pass.querySelector('.sports-signal-mark'),symbol=pass.querySelector('.team-symbol');
 return {team:pass.dataset.team,phase:pass.dataset.passStatus,game:pass.dataset.gameId,record:[...pass.querySelectorAll('.collection-stack>span')].map(e=>e.textContent),emotion:pass.querySelector('.emotion-mark').textContent,
  geometry:Object.fromEntries(['.ticket-main','.ticket-stub','.match','.tipoff','.venue-detail','.collection-stack'].map(s=>[s,rect(s)])),
  canvas:getComputedStyle(document.querySelector('.app-shell')).backgroundColor,
  passBackground:style.backgroundImage,passSurface:style.getPropertyValue('--pass-surface').trim(),shadow:style.boxShadow,
  temperature:style.getPropertyValue('--team-temperature-tint').trim(),intensity:style.getPropertyValue('--temperature-intensity').trim(),accent:getComputedStyle(pass.querySelector('.team-identity>strong')).color,
  print:{mask:security.style.getPropertyValue('--security-mask'),ink:getComputedStyle(security,'::before').backgroundColor,light:getComputedStyle(security,'::after').backgroundColor,offset:getComputedStyle(security,'::after').transform,mode:getComputedStyle(security,'::before').maskMode,finish:security.dataset.securityFinish},
  signal:{color:getComputedStyle(signal).backgroundColor,opacity:getComputedStyle(signal).opacity,type:signal.parentElement.dataset.type},
  serial:getComputedStyle(pass.querySelector('.ticket-number')).color,
  island:{color:getComputedStyle(document.querySelector('.system-island')).backgroundColor,shadow:getComputedStyle(document.querySelector('.system-island')).boxShadow},
  light:[root.getPropertyValue('--light-source-x').trim(),root.getPropertyValue('--light-source-y').trim()],
  baseTokens:Object.fromEntries(['--canvas-base','--pass-base','--pass-highlight','--stub-base','--stub-cool','--graphite-100','--brand-red','--hou-accent','--lal-accent'].map(token=>[token,root.getPropertyValue(token).trim()])),
  mainTime:getComputedStyle(pass.querySelector('.tipoff-time')).color,
  hasBlur:[pass,pass.querySelector('.ticket-stub')].some(e=>getComputedStyle(e).backdropFilter!=='none'),
 };
});}
async function waitEmotion(page,text){await page.waitForFunction(value=>document.querySelector('.emotion-mark')?.textContent===value,text);}
async function main(){
 const browser=await chromium.launch({executablePath:process.env.PROMO_CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const errors=[];
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>localStorage.setItem('mygame_pass_id','0147'));
  await page.goto(baseURL,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await waitEmotion(page,'Tip-off');
  const hou=await read(page);
  assert.equal(hou.canvas,'rgb(241, 239, 234)');assert.equal(hou.island.color,'rgb(27, 28, 26)');assert.equal(hou.mainTime,'rgb(27, 28, 26)');
  assert.equal(hou.signal.color,'rgb(169, 39, 50)');assert.equal(hou.signal.opacity,'1');
  assert.equal(hou.accent,'rgb(188, 58, 64)');assert.deepEqual(hou.light,['24%','12%']);
  assert.equal(hou.print.finish,'blind');assert.equal(hou.print.mode,'alpha');assert.notEqual(hou.print.ink,'rgba(0, 0, 0, 0)');assert.ok(!hou.hasBlur);
  await page.locator('.team-select').click();await page.locator('.team-choice').filter({hasText:'LAL'}).click();
  await page.locator('.system-island-item').filter({hasText:'首页'}).click();
  const lal=await read(page);
  assert.equal(lal.accent,'rgb(98, 83, 130)');assert.notEqual(hou.print.mask,lal.print.mask);assert.notEqual(hou.temperature,lal.temperature);
  for(const key of ['geometry','canvas','passBackground','shadow','record','island','light','game','phase'])assert.deepEqual(lal[key],hou[key],'Team swap must preserve '+key);
  assert.equal(lal.signal.color,hou.signal.color,'Team color must not recolor brand active signals');
  await page.locator('.personal-pass').screenshot({path:'/tmp/mygame-v2.3-cm-lal-pass.png'});
  await page.locator('.team-select').click();await page.locator('.team-choice').filter({hasText:'HOU'}).click();
  await page.locator('.personal-pass').screenshot({path:'/tmp/mygame-v2.3-cm-hou-pass.png'});
  for(const team of ['hou','lal']){
   await sharp(`/tmp/mygame-v2.3-cm-${team}-pass.png`).greyscale().png().toFile(`/tmp/mygame-v2.3-cm-${team}-pass-grey.png`);
   await sharp(`/tmp/mygame-v2.3-cm-${team}-pass.png`).modulate({saturation:.1}).png().toFile(`/tmp/mygame-v2.3-cm-${team}-pass-saturation-10.png`);
  }
  const statusPage=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  statusPage.on('pageerror',error=>errors.push(error.message));await statusPage.addInitScript(()=>localStorage.setItem('mygame_pass_id','0147'));
  await statusPage.clock.install({time:new Date('2026-10-20T21:00:00Z')});await statusPage.goto(baseURL,{waitUntil:'networkidle'});
  await statusPage.locator('.system-island-item').filter({hasText:'我的'}).click();await statusPage.getByRole('switch',{name:'使用真实日期'}).click();await statusPage.locator('.system-island-item').filter({hasText:'首页'}).click();
  await waitEmotion(statusPage,'Next up');const upcoming=await read(statusPage);
  await statusPage.clock.fastForward(28*3600000);await waitEmotion(statusPage,'Coming up');const next=await read(statusPage);
  await statusPage.clock.fastForward(48.1*3600000);await waitEmotion(statusPage,'Tip-off');const gameDay=await read(statusPage);
  await statusPage.locator('.schedule-row[data-game-id="hou-1"]').click();
  await statusPage.clock.setSystemTime(new Date('2026-10-25T05:00:00Z'));await statusPage.clock.fastForward(31000);await waitEmotion(statusPage,'Remember this one');const collected=await read(statusPage);
  assert.notEqual(upcoming.passSurface,next.passSurface);assert.notEqual(next.passSurface,gameDay.passSurface);
  assert.ok(Number(upcoming.signal.opacity)<Number(next.signal.opacity));assert.equal(gameDay.signal.color,'rgb(169, 39, 50)');
  assert.equal(collected.signal.type,'completed');assert.equal(collected.signal.color,'rgba(0, 0, 0, 0)');assert.notEqual(collected.accent,gameDay.accent);assert.notEqual(collected.serial,gameDay.serial);
  assert.ok(Number(collected.intensity)<Number(gameDay.intensity));
  for(const state of [next,gameDay,collected]){assert.deepEqual(state.geometry,upcoming.geometry);assert.deepEqual(state.record,upcoming.record);assert.deepEqual(state.island,upcoming.island);}
  assert.deepEqual(errors,[]);
  await fs.writeFile('/tmp/mygame-v2.3-cm-material-validation.json',JSON.stringify({teamSwap:{hou,lal},states:{upcoming,next,gameDay,collected},errors},null,2));
  console.log('PASS: semantic palette, distinct brand/team reds, HOU/LAL stock and temperature swap, single-source paper light, matte+blind print, unchanged ticket geometry, and quieter/next/game-day/collected material states.');
 }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
