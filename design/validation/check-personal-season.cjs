const assert=require('node:assert/strict'),fs=require('node:fs/promises');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const base=process.env.MYGAME_APP_URL||'http://127.0.0.1:4800';
const errors=[];
async function observe(context){await context.addInitScript(()=>{
 window.__idWrites=[];const set=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='mygame_pass_id')window.__idWrites.push(value);return set.call(this,key,value);};
});}
async function load(context){const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);return p;}
async function geometry(p){return p.locator('.personal-pass').evaluate(pass=>{
 const o=pass.getBoundingClientRect(),rect=e=>{const b=e.getBoundingClientRect();return{x:b.x-o.x,y:b.y-o.y,width:b.width,height:b.height};};
 return Object.fromEntries(['.ticket-object','.ticket-main','.ticket-stub','.match','.tipoff','.ticket-join','.mg-bridge','.collectible-spine','.pass-security','.collection-stack','.collection-progress','.time-route'].map(s=>[s,rect(pass.querySelector(s))]));
});}
async function seek(p,ms){return p.locator('.personal-pass').evaluate((pass,ms)=>{
 for(const a of pass.getAnimations({subtree:true})){a.pause();a.currentTime=ms;}
 pass.getBoundingClientRect();const opacity=s=>Number(getComputedStyle(pass.querySelector(s)).opacity);
 return {team:opacity('.team-identity'),security:opacity('.time-route'),id:opacity('.pass-id'),game:opacity('[data-pass-layer="game-number"]'),season:opacity('[data-pass-layer="season"]'),progress:opacity('.collection-progress')};
},ms);}
async function main(){
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});const checks=[];
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN',reducedMotion:'no-preference'});await observe(context);const p=await load(context);
  await p.getByRole('dialog',{name:'选择我的主队'}).waitFor();
  assert.equal(await p.evaluate(()=>localStorage.getItem('mygame_pass_id')),null);assert.equal(await p.evaluate(()=>window.__idWrites.length),0);
  assert.equal(await p.locator('.issue-state').textContent(),'','Preview must not claim an issued identity');
  await p.getByRole('button',{name:'关闭球队选择'}).click();await p.selectOption('#city','Europe/London');assert.equal(await p.evaluate(()=>localStorage.getItem('mygame_pass_id')),null);
  await p.reload({waitUntil:'networkidle'});await p.getByRole('dialog').waitFor();assert.equal(await p.evaluate(()=>localStorage.getItem('mygame_pass_id')),null);
  await p.clock.install({time:new Date('2026-10-25T00:00:00Z')});await p.clock.pauseAt(new Date('2026-10-25T00:01:00Z'));
  const before=await geometry(p);await p.locator('.team-choice').filter({hasText:'HOU'}).click({force:true});await p.locator('.personal-pass[data-issuance]').waitFor();
  const id=await p.evaluate(()=>localStorage.getItem('mygame_pass_id'));assert.match(id,/^\d{4}$/);assert.equal(await p.evaluate(()=>window.__idWrites.length),1);
  assert.equal(await p.locator('.issue-state').textContent(),'ISSUED');
  const stages=[];
  for(const ms of [0,200,450,620,799]){stages.push({ms,...await seek(p,ms)});assert.deepEqual(await geometry(p),before,'Issuance must not move any ticket architecture');}
  assert.equal(stages[0].id,0);assert.equal(stages[0].game,0);assert.ok(stages[1].security>0&&stages[1].security<1);assert.equal(stages[1].id,0);
  assert.ok(stages[2].id>0&&stages[2].id<1);assert.equal(stages[2].game,0);assert.ok(stages[3].game>0&&stages[3].game<1);assert.equal(stages[4].id,1);
  await p.clock.runFor(799);assert.equal(await p.locator('.personal-pass[data-issuance]').count(),1);await p.clock.runFor(21);await p.waitForFunction(()=>!document.querySelector('.personal-pass[data-issuance]'));
  assert.equal(await p.locator('.pass-issued-note').count(),0);assert.deepEqual(await geometry(p),before);assert.equal(await p.locator('.ticket-milestone').textContent(),'FIRST PASS');await p.clock.resume();
  await p.reload({waitUntil:'networkidle'});assert.equal(await p.getByRole('dialog').count(),0);assert.equal(await p.locator('.pass-issued-note').count(),0);assert.equal(await p.evaluate(()=>localStorage.getItem('mygame_pass_id')),id);assert.equal(await p.evaluate(()=>window.__idWrites.length),0);
  await p.selectOption('#city','Europe/London');await p.locator('.system-island-item').filter({hasText:'赛程'}).click();await p.locator('.schedule-row[data-game-id="hou-2"]').click();
  await p.locator('.team-select').click();await p.locator('.team-choice').filter({hasText:'LAL'}).click();assert.equal(await p.evaluate(()=>localStorage.getItem('mygame_pass_id')),id);assert.equal(await p.locator('.pass-issued-note').count(),0);assert.equal(await p.evaluate(()=>window.__idWrites.length),0);
  checks.push('No identity on load/dismiss/location/refresh; explicit team confirmation issues once; 800ms stages preserve every DNA frame; refresh/city/game/team never reissue');
  await context.close();

  const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});await observe(reduced);const r=await load(reduced);await r.getByRole('dialog').waitFor();await r.locator('.team-choice').filter({hasText:'HOU'}).click();await r.locator('.personal-pass[data-issuance]').waitFor();
  assert.ok(await r.locator('.personal-pass').evaluate(pass=>[...pass.querySelectorAll('.team-identity,.pass-security,.pass-id,[data-pass-layer="game-number"]')].every(e=>getComputedStyle(e).animationName==='none'&&getComputedStyle(e).opacity==='1')));
  const reducedId=await r.evaluate(()=>localStorage.getItem('mygame_pass_id'));await r.reload({waitUntil:'networkidle'});assert.equal(await r.evaluate(()=>localStorage.getItem('mygame_pass_id')),reducedId);assert.equal(await r.locator('[data-issuance]').count(),0);checks.push('Reduced motion resolves readable content immediately; reload during issuance preserves identity and skips replay');await reduced.close();

  const race=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});await observe(race);const a=await load(race),b=await load(race);await a.getByRole('dialog').waitFor();await b.getByRole('dialog').waitFor();
  await Promise.all([a.locator('.team-choice').filter({hasText:'HOU'}).click(),b.locator('.team-choice').filter({hasText:'LAL'}).click()]);
  await Promise.all([a,b].map(p=>p.waitForFunction(()=>/^PASS \d{4}$/.test(document.querySelector('.pass-id').textContent))));
  // A storage event may arrive before the other tab's React commit. Both must settle on the stored ID.
  try{await Promise.all([a,b].map(p=>p.waitForFunction(()=>document.querySelector('.pass-id').textContent===`PASS ${localStorage.getItem('mygame_pass_id')}`,null,{timeout:5000})));}
  catch(error){console.error('Concurrent issuance snapshots',await Promise.all([a,b].map(p=>p.evaluate(()=>({visible:document.querySelector('.pass-id').textContent,stored:localStorage.getItem('mygame_pass_id'),writes:window.__idWrites,locks:!!navigator.locks})))));throw error;}
  const aid=await a.locator('.pass-id').textContent(),bid=await b.locator('.pass-id').textContent();assert.equal(aid,bid);assert.equal(await a.evaluate(()=>window.__idWrites.length)+await b.evaluate(()=>window.__idWrites.length),1);checks.push('Simultaneous first confirmation in two tabs shares one issued ID and one storage write');await race.close();
  assert.deepEqual(errors,[]);await fs.writeFile('/tmp/mygame-v2.9-issuance.json',JSON.stringify({checks,stages,duration:800,errors},null,2));console.log(JSON.stringify({passed:checks.length,checks,stages,duration:800,errors},null,2));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
