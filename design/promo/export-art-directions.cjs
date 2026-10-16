// Review exports are screenshots of the real mobile product, with opt-in artwork.
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const sharp=require('sharp');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const root=path.resolve(__dirname,'../..'),output=path.join(root,'output/art-direction');
const base=process.env.MYGAME_APP_URL||'http://127.0.0.1:5200';
const directions=[['a','editorial','EDITORIAL SPORTS TICKET'],['b','instrument','PRECISION TIME INSTRUMENT'],['c','collectible','MODERN COLLECTIBLE STUB']];
const round=value=>Math.round(value*1000)/1000;
async function decoded(file,width,height){const metadata=await sharp(file,{failOn:'warning'}).metadata();assert.equal(metadata.format,'png');if(width)assert.equal(metadata.width,width);if(height)assert.equal(metadata.height,height);const raw=await sharp(file,{failOn:'warning'}).ensureAlpha().raw().toBuffer();assert.equal(raw.length,metadata.width*metadata.height*4);assert.ok((await fs.stat(file)).size>1000);return{width:metadata.width,height:metadata.height,bytes:(await fs.stat(file)).size};}
async function main(){
 let browser;const errors=[],nonArtworkRequests=[],reports=[],phonePixels=new Map(),responsive=[],reviewInteractions=[];
 try{
  await fs.mkdir(output,{recursive:true});
  browser=await chromium.launch({executablePath:process.env.PROMO_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
  const context=await browser.newContext({viewport:{width:600,height:800},deviceScaleFactor:1.8,reducedMotion:'reduce',locale:'zh-CN'});
  await context.addInitScript(()=>{localStorage.setItem('mygame_pass_id','0147');localStorage.setItem('mygame_selected_team','HOU');localStorage.setItem('mygame_selected_game','hou-1');localStorage.setItem('mygame_city_id','tokyo');});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()!=='error')return;const location=message.location();if(location.url===`${base}/favicon.ico`&&/404/.test(message.text()))nonArtworkRequests.push({url:location.url,message:message.text()});else errors.push(message.text());});
  assert.equal((await page.goto(base,{waitUntil:'networkidle'})).status(),200);await page.waitForSelector('.personal-pass[data-game-id="hou-1"]');await page.waitForFunction(()=>document.querySelector('.pass-id')?.textContent==='PASS 0147'&&document.querySelector('.app-system-island')?.dataset.context==='navigation');await page.evaluate(()=>document.fonts.ready);
  const homepage=await page.screenshot({animations:'disabled'}),baseline=path.join(root,'output/douyin/mygame-plus-douyin-01-tokyo.png');
  const baselineMetadata=await decoded(baseline,1080,1440),before=await sharp(baseline).removeAlpha().raw().toBuffer(),after=await sharp(homepage).removeAlpha().raw().toBuffer();assert.equal(after.length,before.length);let homepagePixelDifferences=0;for(let i=0;i<before.length;i+=3)if(before[i]!==after[i]||before[i+1]!==after[i+1]||before[i+2]!==after[i+2])homepagePixelDifferences++;
  assert.equal(homepagePixelDifferences,0,'The opt-in art review must not overwrite the approved homepage');
  const homepageFreeze={baseline:path.relative(root,baseline),width:baselineMetadata.width,height:baselineMetadata.height,pixelDifferences:homepagePixelDifferences};
  for(const [letter,direction,label] of directions){
   assert.equal((await page.goto(`${base}/review/art-direction?variant=${direction}&capture=1`,{waitUntil:'networkidle'})).status(),200);
   await page.waitForSelector(`.art-pass[data-art-direction="${direction}"][data-pass-id="0147"]`);await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('nextjs-portal').count(),0,'Use a production build for the review');
   for(const [city,localTime,gmt] of [['tokyo','10:00','GMT+9'],['london','01:00','GMT']]){
    await page.selectOption('#city',city);await page.waitForFunction(({city,time})=>{const pass=document.querySelector('.art-pass');return pass?.dataset.cityId===city&&pass.dataset.localTime===time;},{city,time:localTime});
    await page.waitForFunction(()=>document.querySelector('.app-system-island')?.dataset.context==='navigation');await page.evaluate(()=>document.fonts.ready);
    const details=await page.evaluate(()=>{
     const pass=document.querySelector('.art-pass'),rect=element=>{const b=element.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height,right:b.right,bottom:b.bottom};};
     const marker=pass.querySelector('[data-time-marker]');
     const text=pass.textContent.replace(/\s+/g,' ').trim();
     const team=pass.querySelector('[data-art-layer="team"] strong')??pass.querySelector('[data-art-layer="team"]');
     const opponent=pass.querySelector('[data-art-layer="opponent"] strong')??pass.querySelector('[data-art-layer="opponent"]');
     return{identity:{gameId:pass.dataset.gameId,team:pass.dataset.team,opponent:pass.dataset.opponent,passId:pass.dataset.passId,issue:pass.dataset.personalIssue,gameNumber:pass.dataset.gameNumber,season:pass.dataset.season},location:{cityId:pass.dataset.cityId,timezone:pass.dataset.timezone,localTime:pass.dataset.localTime,gmt:pass.dataset.gmt},frame:rect(pass),viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio,scrollWidth:document.documentElement.scrollWidth},team:rect(team),opponent:rect(opponent),nav:rect(document.querySelector('.app-system-island')),rows:[...document.querySelectorAll('.schedule-row')].map(rect),seasonTicks:[...pass.querySelectorAll('[data-season-tick]')].map(e=>({ordinal:e.getAttribute('data-season-tick'),x:e.getAttribute('x1'),y:e.getAttribute('y2'),current:e.getAttribute('data-current')})),seasonEdge:rect(pass.querySelector('.art-season-edge')),marker:marker?.outerHTML,instrument:rect(pass.querySelector('[data-art-layer="instrument"]')),text,peripheral:Object.fromEntries(['.brand-header','.brand-lockup','.preferences','.week','.app-system-island'].map(selector=>[selector,rect(document.querySelector(selector))]))};
    });
    assert.deepEqual(details.identity,{gameId:'hou-1',team:'HOU',opponent:'LAL',passId:'0147',issue:'047295',gameNumber:'1',season:'2026-27'});
    assert.equal(details.location.cityId,city);assert.equal(details.location.localTime,localTime);assert.equal(details.location.gmt,gmt);
    assert.equal(details.viewport.scrollWidth,600,'No horizontal scrollbar');assert.ok(details.frame.y>0);assert.ok(Math.abs(details.frame.width/details.frame.height-728/576)<0.001);
    assert.equal(details.seasonTicks.length,82);assert.equal(new Set(details.seasonTicks.map(t=>t.ordinal)).size,82);assert.equal(details.seasonTicks.filter(t=>t.current==='true').length,1);assert.equal(details.seasonTicks.find(t=>t.current==='true').ordinal,'1');
    assert.ok(details.seasonEdge.y>details.frame.y+details.frame.height*.8,'Season marks belong to the physical lower ticket edge');
    for(const word of ['HOU','LAL','OCT','2026','TOYOTA CENTER','047295'])assert.ok(details.text.includes(word),`${direction}: ${word}`);
    assert.match(details.text,/26[–—]27/);assert.ok(details.marker,'A real time marker exists');
    assert.ok(details.rows.length>=2,'Future schedule is retained');assert.ok(details.rows.at(-1).bottom+12<=details.nav.y,'Schedule never overlaps the controller');assert.ok(details.nav.bottom<=800);assert.ok(details.frame.bottom<details.rows[0].y);
    for(const key of ['team','opponent'])assert.ok(details[key].width>35&&details[key].height>20,`${direction}: ${key} is a graphic display, not microcopy`);
    const prefix=`${letter}-${direction}-${city}`,phoneFile=path.join(output,`${prefix}.png`),passFile=path.join(output,`${prefix}-pass.png`);
    await page.screenshot({path:phoneFile,animations:'disabled'});const phone=await decoded(phoneFile,1080,1440);phonePixels.set(prefix,await sharp(phoneFile).removeAlpha().raw().toBuffer());
    const crop=await page.locator('.art-pass').screenshot({animations:'disabled'});await sharp(crop).resize({width:1080}).png().toFile(passFile);const isolated=await decoded(passFile,1080);
    await sharp(phoneFile).resize(324,432).png().toFile(path.join(output,`${prefix}-30.png`));
    await sharp(passFile).resize(540).blur(9).png().toFile(path.join(output,`${prefix}-silhouette.png`));
    const masked=[];const mask=async(name,code)=>{await page.evaluate(code);const buffer=await page.locator('.art-pass').screenshot({animations:'disabled'});const file=path.join(output,`${prefix}-${name}.png`);await sharp(buffer).resize({width:1080}).png().toFile(file);masked.push(path.relative(root,file));await page.evaluate(()=>{document.querySelectorAll('[data-art-diagnostic-visibility]').forEach(e=>{e.style.visibility=e.dataset.artDiagnosticVisibility;delete e.dataset.artDiagnosticVisibility;});});};
    if(city==='tokyo'){
     await mask('sports-test',()=>{const hide=e=>{e.dataset.artDiagnosticVisibility=e.style.visibility;e.style.visibility='hidden';};document.querySelectorAll('.art-pass [data-art-layer="team"],.art-pass [data-art-layer="opponent"],.art-pass .c-rail-code,.art-pass .instrument-team-names,.art-pass .c-stub-reference,.art-pass .instrument-stub-signature>span:last-child,.art-pass .instrument-venue>span:last-child').forEach(hide);document.querySelectorAll('.art-pass .editorial-edition>span:first-child,.art-pass .instrument-topline>span:first-child,.art-pass .c-ticket-label').forEach(hide);});
     await mask('ticket-test',()=>{for(const selector of ['.editorial-edition>span:first-child','.instrument-topline>span:first-child','.c-ticket-label>span'])document.querySelectorAll(`.art-pass ${selector}`).forEach(e=>{e.dataset.artDiagnosticVisibility=e.style.visibility;e.style.visibility='hidden';});});
     await mask('brand-test',()=>{document.querySelectorAll('.art-pass .art-serial>small,.art-pass .c-rail-brand,.art-pass .c-stub-title,.art-pass .instrument-stub-signature>span:last-child').forEach(e=>{e.dataset.artDiagnosticVisibility=e.style.visibility;e.style.visibility='hidden';});});
    }
    reports.push({letter,direction,label,city,files:{phone:path.relative(root,phoneFile),pass:path.relative(root,passFile),diagnostics:masked},phone,isolated,...details});
   }
   const [a,b]=reports.filter(r=>r.direction===direction);for(const key of ['frame','identity','peripheral'])assert.deepEqual(a[key],b[key],`${direction}: ${key} remains frozen when location changes`);assert.notEqual(a.marker,b.marker,`${direction}: the actual time instrument updates`);
  }
  const first=reports[0];for(const report of reports){assert.deepEqual(report.identity,first.identity,'All directions compare the same event and personal issue');assert.deepEqual(report.frame,first.frame,'All directions occupy the same phone crop and ticket footprint');assert.deepEqual(report.peripheral,first.peripheral,'Page framing remains frozen across artwork directions');}
  const frozenPage=[];
  for(const city of ['tokyo','london']){
   const peers=reports.filter(report=>report.city===city),reference=phonePixels.get(`${peers[0].letter}-${peers[0].direction}-${city}`),frame=peers[0].frame;
   const left=Math.floor(frame.x*1.8)-2,top=Math.floor(frame.y*1.8)-2,right=Math.ceil(frame.right*1.8)+2,bottom=Math.ceil(frame.bottom*1.8)+2;
   for(const peer of peers.slice(1)){
    const pixels=phonePixels.get(`${peer.letter}-${peer.direction}-${city}`);let differences=0;
    for(let y=0;y<1440;y++)for(let x=0;x<1080;x++){if(x>=left&&x<=right&&y>=top&&y<=bottom)continue;const i=(y*1080+x)*3;if(reference[i]!==pixels[i]||reference[i+1]!==pixels[i+1]||reference[i+2]!==pixels[i+2])differences++;}
    assert.equal(differences,0,`${city}: variant ${peer.letter.toUpperCase()} changes only the Pass, not the surrounding page`);frozenPage.push({city,compared:`A / ${peer.letter.toUpperCase()}`,outsideTicketPixelDifferences:differences});
   }
  }
  for(const [,direction] of directions){
   await page.goto(`${base}/review/art-direction?variant=${direction}&capture=1`,{waitUntil:'networkidle'});
   await page.waitForSelector(`.art-pass[data-art-direction="${direction}"][data-pass-id="0147"]`);
   for(const width of [320,390,480]){
    await page.setViewportSize({width,height:800});await page.evaluate(()=>document.fonts.ready);
    const layout=await page.evaluate(()=>{const pass=document.querySelector('.art-pass').getBoundingClientRect();return{viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,pass:{left:pass.left,right:pass.right,width:pass.width,height:pass.height}};});
    assert.equal(layout.scrollWidth,width,`${direction}: responsive page has no horizontal overflow`);assert.ok(layout.pass.left>=0&&layout.pass.right<=width);assert.ok(Math.abs(layout.pass.width/layout.pass.height-728/576)<.001);responsive.push({direction,...layout});
   }
  }
  await page.setViewportSize({width:600,height:800});await page.goto(`${base}/review/art-direction?variant=editorial`,{waitUntil:'networkidle'});await page.waitForSelector('.art-pass[data-art-direction="editorial"][data-pass-id="0147"]');
  assert.ok(await page.locator('.art-review-tools').isVisible(),'The development variant switch is available outside capture mode');
  await page.evaluate(()=>{window.__artIdentityWrites=[];const prototype=Object.getPrototypeOf(localStorage),write=prototype.setItem;prototype.setItem=function(key,value){if(key==='mygame_pass_id')window.__artIdentityWrites.push(String(value));return write.call(this,key,value);};});
  await page.selectOption('#city','london');await page.waitForFunction(()=>document.querySelector('.art-pass')?.dataset.cityId==='london');
  const snapshot=()=>page.evaluate(()=>{const pass=document.querySelector('.art-pass');return{direction:pass.dataset.artDirection,team:pass.dataset.team,opponent:pass.dataset.opponent,game:pass.dataset.gameId,issue:pass.dataset.personalIssue,passId:pass.dataset.passId,city:pass.dataset.cityId,time:pass.dataset.localTime,gmt:pass.dataset.gmt,season:pass.dataset.season,ordinal:pass.dataset.gameNumber,storedId:localStorage.getItem('mygame_pass_id')};});
  const initial=await snapshot();assert.equal(initial.issue,'047295');assert.equal(initial.time,'01:00');
  for(const [letter,direction] of directions.slice(1)){
   await page.getByRole('button',{name:`查看方案 ${letter.toUpperCase()}`,exact:true}).click();await page.waitForSelector(`.art-pass[data-art-direction="${direction}"]`);const current=await snapshot();assert.deepEqual({...current,direction:initial.direction},initial,'Changing the review direction preserves user, selected team, city and the actual event');reviewInteractions.push({action:`switch-${letter.toUpperCase()}`,snapshot:current});
  }
  for(const [letter,direction] of directions){
   await page.getByRole('button',{name:`查看方案 ${letter.toUpperCase()}`,exact:true}).click();await page.waitForSelector(`.art-pass[data-art-direction="${direction}"]`);
   for(const team of ['LAL','GSW']){
    await page.getByRole('button',{name:/更改主队/}).click();await page.locator('.team-choice').filter({hasText:team}).click();await page.waitForSelector(`.art-pass[data-team="${team}"]`);
    const current=await snapshot();assert.equal(current.direction,direction);assert.equal(current.passId,'0147');assert.equal(current.storedId,'0147');assert.equal(current.city,'london');assert.notEqual(current.team,current.opponent);assert.match(current.issue,/^\d{6}$/);assert.notEqual(current.issue,'047295','A different team/event gets its own existing personal reference, without reissuing the user');assert.ok(current.game);reviewInteractions.push({action:`${direction}-select-${team}`,snapshot:current});
   }
   await page.getByRole('button',{name:/更改主队/}).click();await page.locator('.team-choice').filter({hasText:'HOU'}).click();await page.waitForSelector('.art-pass[data-team="HOU"][data-personal-issue="047295"]');const restored=await snapshot();assert.equal(restored.city,'london');assert.equal(restored.time,'01:00');reviewInteractions.push({action:`${direction}-restore-HOU`,snapshot:restored});
  }
  const reviewIdentityWrites=await page.evaluate(()=>window.__artIdentityWrites);assert.deepEqual(reviewIdentityWrites,[],'Art review switches, city changes and team changes must never reissue an existing personal identity');
  // Diagnostic sheet: identical crops, labels outside the artwork, no new visual concept.
  const tileWidth=540,tileHeight=428,labelHeight=54,margin=28,sheetWidth=margin*4+tileWidth*3,sheetHeight=margin*3+(tileHeight+labelHeight)*2;
  const composites=[];
  for(const report of reports){const col=directions.findIndex(d=>d[1]===report.direction),row=report.city==='tokyo'?0:1,x=margin+col*(tileWidth+margin),y=margin+row*(tileHeight+labelHeight+margin);const image=await sharp(path.join(root,report.files.pass)).resize(tileWidth,tileHeight,{fit:'contain',background:'#F1EFEA'}).png().toBuffer();composites.push({input:image,left:x,top:y+labelHeight});const label=`${report.letter.toUpperCase()} · ${report.city.toUpperCase()}  /  ${report.location.localTime} ${report.location.gmt}`;const svg=Buffer.from(`<svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><text x="0" y="29" font-family="sans-serif" font-size="17" fill="#252623">${label}</text></svg>`);composites.push({input:svg,left:x,top:y});}
  await sharp({create:{width:sheetWidth,height:sheetHeight,channels:3,background:'#F1EFEA'}}).composite(composites).png().toFile(path.join(output,'comparison.png'));
  const phoneComposites=[],phoneTileWidth=324,phoneTileHeight=432,phoneLabelHeight=42,phoneMargin=24;
  for(const report of reports){const col=directions.findIndex(d=>d[1]===report.direction),row=report.city==='tokyo'?0:1,x=phoneMargin+col*(phoneTileWidth+phoneMargin),y=phoneMargin+row*(phoneTileHeight+phoneLabelHeight+phoneMargin);phoneComposites.push({input:await sharp(path.join(root,report.files.phone)).resize(phoneTileWidth,phoneTileHeight).png().toBuffer(),left:x,top:y+phoneLabelHeight});const label=Buffer.from(`<svg width="${phoneTileWidth}" height="${phoneLabelHeight}" xmlns="http://www.w3.org/2000/svg"><text x="0" y="25" font-family="sans-serif" font-size="14" fill="#252623">${report.letter.toUpperCase()} · ${report.city.toUpperCase()}</text></svg>`);phoneComposites.push({input:label,left:x,top:y});}
  await sharp({create:{width:phoneMargin*4+phoneTileWidth*3,height:phoneMargin*3+(phoneTileHeight+phoneLabelHeight)*2,channels:3,background:'#F1EFEA'}}).composite(phoneComposites).png().toFile(path.join(output,'mobile-comparison.png'));
  assert.deepEqual(errors,[],'No application, hydration or artwork asset-loading errors');
  const result={version:'PHASE 3 — ART DIRECTION BREAKTHROUGH',viewport:{width:600,height:800,dpr:1.8},selection:'No direction promoted to the homepage',sharedIdentity:first.identity,review:{automated:['Six real mobile screenshots decode at 1080×1440','Same data, frame and peripheral geometry across all six','All 82 marks exist independently with one current event','Each Tokyo/London pair moves a real local-clock marker','No horizontal scrollbar, hydration errors or schedule/navigation overlap','320 / 390 / 480px responsive checks for each direction','Approved homepage pixel-identical to its committed Phase 2 screenshot','A / B / C review switch preserves London, event and personal identity','Each art direction supports LAL / GSW team changes without issuing another PASS ID'],humanRequired:['Graphic impact and sports recognition','Collectible desire: only user feedback can establish save/share intent','Silhouette, sports-masked, ticket-label-hidden and brand-hidden review']},homepageFreeze,frozenPage,responsive,reviewInteractions,reviewIdentityWrites,reports,errors,nonArtworkRequests};
  await fs.writeFile(path.join(output,'validation.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify({output:path.relative(root,output),screenshots:reports.map(({direction,city,files,phone,isolated,frame})=>({direction,city,files,phone,isolated,frame:Object.fromEntries(Object.entries(frame).map(([key,value])=>[key,round(value)]))})),errors},null,2));
 }finally{if(browser)await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
