const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');

async function enclosureSnapshot(page){return page.evaluate(()=>{
 const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};
 const root=document.querySelector('.mobile-pass-enclosure');
 const selectors=['.pass','.ticket-object','.pass-main','.stub','.ticket-join','.mg-bridge','.collectible-spine','.pass-security','.tipoff','.mobile-pass-enclosure','.mobile-shell-signature'];
 const perimeter=root.querySelector('.mobile-shell-master').getTotalLength();
 const rim=[...root.querySelectorAll('.mobile-shell-refraction path')].reduce((n,p)=>n+p.getTotalLength(),0);
 return {geometry:Object.fromEntries(selectors.map(s=>[s,rect(s)])),version:root.dataset.enclosureDna,
  signature:[...root.querySelectorAll('.mobile-shell-signature path')].map(p=>p.getAttribute('d')),
  rimCoverage:rim/perimeter,rimInk:getComputedStyle(root.querySelector('.mobile-shell-refraction')).color,
  gradientInk:getComputedStyle(root.querySelector('.mobile-refraction-gradient stop')).stopColor,
  rimOpacity:Number(getComputedStyle(root.querySelector('.mobile-shell-refraction')).opacity),
  bevelCoverage:[...root.querySelectorAll('.mobile-shell-bevel')].reduce((n,p)=>n+p.getTotalLength(),0)/perimeter,
  mountingCoverage:root.querySelector('.mobile-shell-mount').getTotalLength()/perimeter,
  closedPaintPaths:[...root.querySelectorAll(':scope>path,:scope>g path')].filter(p=>/Z\s*$/i.test(p.getAttribute('d'))).length,
  backdrop:getComputedStyle(root).backdropFilter,filter:getComputedStyle(root).filter,
  visibleUI:['.top-label','.brand','.app-mark','.subtitle','.slogan','.beta','.city-status','.identity','.time-system','.auto-state','.week','.schedule','.dock'].every(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden';}),
  forbidden:!!document.querySelector('.encased-artifact,.artifact-display'),
 };
});}

async function reviewMobileEnclosure({page,sharp,report,canonicalPixels,city,baselineDirectory}){
 const detail=await enclosureSnapshot(page),shell=detail.geometry['.mobile-pass-enclosure'],paper=report.geometry['.pass'];
 assert.equal(detail.version,'MG-ENCLOSURE-1');assert.ok(detail.visibleUI,'Preserve the complete mobile product interface');assert.equal(detail.forbidden,false);
 for(const [key,value] of Object.entries({x:164,y:445,width:752,height:598}))assert.ok(Math.abs(shell[key]-value)<.02,'Compact shell keeps the original Pass and page placement');
 assert.ok(shell.width/paper.width>=1.03&&shell.width/paper.width<=1.04);
 assert.ok(shell.height/paper.height>=1.03&&shell.height/paper.height<=1.04);
 assert.ok(detail.rimCoverage>=.2&&detail.rimCoverage<=.3,'Team ink belongs to only 20–30% of the perimeter');
 assert.ok(detail.bevelCoverage<.2&&detail.mountingCoverage<.1,'Bevel and mounting are local edge cues, never a continuous double frame');assert.equal(detail.closedPaintPaths,0,'No closed outline or transparent face plane may recreate a plastic sleeve');
 assert.equal(detail.backdrop,'none');assert.equal(detail.filter,'none','The optical frame never filters the printed face');
 assert.equal(detail.gradientInk,detail.rimInk,'SVG gradient stops must use the team optical ink, never inherited primary text ink');
 assert.ok(shell.y>=report.geometry['.identity'].y+report.geometry['.identity'].height+24);
 assert.ok(report.geometry['.week'].y>=shell.y+shell.height+32,'Retain breathing room before the functional schedule');

 const phases={};
 for(const phase of ['upcoming','next_up','game_day','archived']){
  await page.locator('.pass').evaluate((e,phase)=>{e.dataset.passStatus=phase;delete e.dataset.passEnergy;},phase);
  phases[phase]=await enclosureSnapshot(page);
  assert.deepEqual(phases[phase].geometry,detail.geometry,'State may change energy, never Pass or enclosure coordinates');
  assert.deepEqual(phases[phase].signature,detail.signature,'The micro cut and plus remain permanent');
 }
 assert.ok(Math.abs(phases.game_day.rimOpacity/phases.next_up.rimOpacity-1.2)<.001,'GAME DAY refraction rises only 20% over NEXT UP');
 assert.ok(phases.archived.rimOpacity<phases.next_up.rimOpacity,'Collected casing becomes quiet');
 await page.locator('.pass').evaluate(e=>{e.dataset.passStatus='game_day';e.dataset.passEnergy='imminent';});

 const withoutShell=`/tmp/mygame-refine-${city}-without-shell.png`;
 const off=await page.addStyleTag({content:'.mobile-pass-enclosure{visibility:hidden!important}'});
 await page.screenshot({path:withoutShell,type:'png',animations:'disabled'});
 await off.evaluate(e=>e.remove());
 const without=await sharp(withoutShell).removeAlpha().raw().toBuffer();
 let paperDifferences=0,shellPixels=0,maxShellDelta=0;
 for(let y=0;y<1440;y++)for(let x=0;x<1080;x++){
  const k=(y*1080+x)*3,delta=Math.max(...[0,1,2].map(c=>Math.abs(canonicalPixels[k+c]-without[k+c])));
  if(!delta)continue;
  if(x>paper.x+20&&x<paper.x+paper.width-20&&y>paper.y+20&&y<paper.y+paper.height-20)paperDifferences++;
  if(x>=shell.x&&x<=shell.x+shell.width&&y>=shell.y&&y<=shell.y+shell.height){shellPixels++;maxShellDelta=Math.max(maxShellDelta,delta);}
 }
 assert.equal(paperDifferences,0,'The optical shell must leave every interior printed pixel unchanged');
 assert.ok(shellPixels>1000,'The clear enclosure must actually render, not disappear into the canvas');
 // A rim-only team input must not recolor paper, timing, the App or navigation.
 const ticketBefore=await sharp(await page.screenshot({animations:'disabled'})).extract({left:paper.x+20,top:paper.y+20,width:paper.width-40,height:paper.height-40}).raw().toBuffer();
 await page.locator('.pass').evaluate(e=>e.style.setProperty('--mobile-acrylic-team','color-mix(in srgb,var(--lal-accent) 6.5%,transparent)'));
 const lal=await enclosureSnapshot(page);
 assert.notEqual(lal.rimInk,detail.rimInk);assert.deepEqual(lal.geometry,detail.geometry);
 const ticketAfter=await sharp(await page.screenshot({animations:'disabled'})).extract({left:paper.x+20,top:paper.y+20,width:paper.width-40,height:paper.height-40}).raw().toBuffer();
 assert.ok(ticketBefore.equals(ticketAfter),'Changing only the acrylic team ink cannot repaint the ticket');
 await page.locator('.pass').evaluate(e=>e.style.removeProperty('--mobile-acrylic-team'));

 let baselineGeometryMatch=null;
 if(baselineDirectory){
  const baseline=JSON.parse(await fs.readFile(path.join(baselineDirectory,'validation.json'),'utf8')).reports[city==='tokyo'?0:1];
  for(const [selector,rect] of Object.entries(report.geometry))if(!['.brand h1','.app-mark','.wordmark','.dock','.team-preference'].includes(selector))assert.deepEqual(rect,baseline.geometry[selector],'Brand refinements must leave all content architecture intact');
  const preference=report.geometry['.team-preference'],oldPreference=baseline.geometry['.team-preference'];for(const axis of ['x','y','height'])assert.equal(preference[axis],oldPreference[axis]);assert.ok(Math.abs(preference.width-oldPreference.width)<1,'Identity font refinement may only change the selector width by a subpixel');
        baselineGeometryMatch=true;
 }
 return {...detail,phases:Object.fromEntries(Object.entries(phases).map(([p,s])=>[p,{rimOpacity:s.rimOpacity,geometryIdentical:true}])),paperDifferences,shellPixels,maxShellDelta,withoutShell,baselineGeometryMatch,lalRimInk:lal.rimInk};
}
module.exports={reviewMobileEnclosure};
