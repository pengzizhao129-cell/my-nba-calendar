// The delivered promo is a screenshot of the running App, never a parallel HTML layout.
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {spawn}=require('node:child_process'),sharp=require('sharp');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const root=path.resolve(__dirname,'../..'),base=process.env.MYGAME_APP_URL||'http://127.0.0.1:5050';
async function main(){
 let server,browser;
 try{
  if(!process.env.MYGAME_APP_URL){
   server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','5050'],{cwd:root,stdio:'ignore'});
   let ready=false;for(let i=0;i<80;i++){try{if((await fetch(base)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}assert.ok(ready,'Build the App before exporting');
  }
  browser=await chromium.launch({executablePath:process.env.PROMO_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
  const context=await browser.newContext({viewport:{width:600,height:800},deviceScaleFactor:1.8,reducedMotion:'reduce',locale:'zh-CN'});
  await context.addInitScript(()=>{localStorage.setItem('mygame_pass_id','0147');localStorage.setItem('mygame_selected_team','HOU');localStorage.setItem('mygame_selected_game','hou-1');});
  const page=await context.newPage(),errors=[],reports=[],pixels=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&/hydration|did not match/i.test(m.text()))errors.push(m.text());});
  assert.equal((await page.goto(base,{waitUntil:'networkidle'})).status(),200);await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('.pass-id')?.textContent==='PASS 0147');
  assert.equal(await page.locator('nextjs-portal').count(),0,'Export the production App, without development controls');
  await fs.mkdir(path.join(root,'output/douyin'),{recursive:true});
  for(const [city,zone,filename,time] of [['tokyo','Asia/Tokyo','mygame-plus-douyin-01-tokyo.png','10:00'],['london','Europe/London','mygame-plus-douyin-02-london.png','01:00']]){
   await page.selectOption('#city',zone);await page.waitForFunction(()=>document.querySelector('.app-system-island').dataset.context==='navigation');await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('.tipoff-time .quiet-value-current').textContent(),time);
   const detail=await page.evaluate(()=>{
    const r=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height,right:b.right,bottom:b.bottom};},pass=document.querySelector('.personal-pass');
    return {source:'live-next-app',viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},scroll:document.documentElement.scrollWidth,pass:r(pass),match:r(pass.querySelector('.match')),matchSize:parseFloat(getComputedStyle(pass.querySelector('.team-identity>strong')).fontSize),timeSize:parseFloat(getComputedStyle(pass.querySelector('.tipoff-time')).fontSize),nav:r(document.querySelector('.app-system-island')),rows:[...document.querySelectorAll('.schedule-row')].map(r),geometry:Object.fromEntries(['.ticket-main','.ticket-stub','.match','.tipoff','.time-route','.ticket-join','.mg-bridge','.season-spine','.serial-mark'].map(s=>[s,r(pass.querySelector(s))])),changes:['.city-state','.home-slogan','.zone-label label','.offset','.route-destination','.tipoff-time','.time-caption>span:last-child','.row-time'].flatMap(s=>[...document.querySelectorAll(s)].map(r)),ticks:pass.querySelectorAll('[data-season-tick]').length,current:pass.querySelector('[data-season-tick][data-current]')?.getAttribute('data-season-tick'),issue:pass.querySelector('.serial-mark').textContent};
   });
   assert.equal(detail.scroll,600);assert.equal(detail.ticks,82);assert.equal(detail.current,'1');assert.ok(detail.matchSize>detail.timeSize*1.25,'Matchup owns the display hierarchy');
   assert.ok(detail.rows.at(-1).bottom+16<=detail.nav.y,'Controller never covers the schedule');assert.ok(detail.nav.bottom<=780);assert.ok(detail.pass.bottom<detail.rows[0].y);
   const file=path.join(root,'output/douyin',filename);await page.screenshot({path:file,animations:'disabled'});
   const meta=await sharp(file,{failOn:'warning'}).metadata(),raw=await sharp(file).removeAlpha().raw().toBuffer();assert.equal(meta.width,1080);assert.equal(meta.height,1440);assert.ok((await fs.stat(file)).size>10000);
   pixels.push(raw);reports.push({city,path:path.relative(root,file),bytes:(await fs.stat(file)).size,width:meta.width,height:meta.height,...detail});
   await sharp(file).resize(324,432).png().toFile(`/tmp/mygame-ticket-${city}-30.png`);
   const borders=await page.addStyleTag({content:'.ticket-paper,.schedule-list,.schedule-row{border:0!important}.ticket-join{visibility:hidden!important}'});await page.screenshot({path:`/tmp/mygame-ticket-${city}-border-off.png`});await borders.evaluate(e=>e.remove());
   const label=await page.addStyleTag({content:'.pass-label,.brand-lockup>.app-mark,.brand-signature{visibility:hidden!important}'});await page.screenshot({path:`/tmp/mygame-ticket-${city}-no-logo-label.png`});await label.evaluate(e=>e.remove());
  }
  assert.deepEqual(reports[0].geometry,reports[1].geometry,'Location cannot redraw or move the ticket');assert.equal(reports[0].issue,reports[1].issue,'Location never reissues identity');
  const regions=reports.flatMap(r=>r.changes).map(b=>({x:Math.floor(b.x*1.8)-2,y:Math.floor(b.y*1.8)-2,right:Math.ceil(b.right*1.8)+2,bottom:Math.ceil(b.bottom*1.8)+2}));
  let changed=0,staticDifferences=0;for(let y=0;y<1440;y++)for(let x=0;x<1080;x++){const i=(y*1080+x)*3;if(pixels[0][i]===pixels[1][i]&&pixels[0][i+1]===pixels[1][i+1]&&pixels[0][i+2]===pixels[1][i+2])continue;changed++;if(!regions.some(b=>x>=b.x&&x<=b.right&&y>=b.y&&y<=b.bottom))staticDifferences++;}
  assert.equal(staticDifferences,0,'Only location, slogan and converted schedule times change');assert.ok(changed>0);
  assert.deepEqual(errors,[]);const result={version:'MyGame+ Digital Game Ticket / MG-DNA-2',reports,changed,staticDifferences,errors};await fs.writeFile('/tmp/mygame-ticket-promo.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{if(browser)await browser.close();if(server)server.kill('SIGTERM');}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
