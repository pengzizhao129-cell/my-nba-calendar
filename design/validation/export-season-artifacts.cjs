const fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');const sharp=require('sharp');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const root=path.resolve(__dirname,'../..'),out=path.join(root,'output/share');
const names=['next-up','game-day','collected','milestone','season-complete','london','lal','kobe','tokyo-story','london-story','kobe-story','series','variants'];
function assertMasterGeometry(actual,expected,message){
 for(const [selector,box] of Object.entries(actual))for(const axis of ['x','y','width','height'])assert.ok(Math.abs(box[axis]-expected[selector][axis])<.09,`${message}: ${selector}.${axis}`);
}
async function main(){
 const pages=new Map(names.map(name=>['/'+name,execFileSync(process.execPath,[path.join(root,'node_modules/tsx/dist/cli.mjs'),'--tsconfig',path.join(root,'tsconfig.tests.json'),path.join(__dirname,'render-season-artifacts.tsx'),name],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024})]));
 const base=(await fs.readFile(path.join(root,'src/app/globals.css'),'utf8')).replace(/^@import[^;]+;/gm,'');
 const assets=new Map([['/GeistSans.woff2',path.join(root,'src/app/fonts/GeistSans.woff2')],['/brand/mygame-plus.png',path.join(root,'public/brand/mygame-plus.png')],...['timing-450.woff2','timing-500.woff2','timing-550.woff2','identity-600.woff2','event-annotation.woff2'].map(n=>['/'+n,path.join(root,'design/promo',n)])]);
 const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://127.0.0.1').pathname;if(pages.has(url)){res.setHeader('Content-Type','text/html;charset=utf-8');res.end(pages.get(url));return;}if(url==='/app-base.css'){res.setHeader('Content-Type','text/css');res.end(base);return;}if(url.endsWith('.css')&&/^\/[a-z-]+\.css$/.test(url)){res.setHeader('Content-Type','text/css');res.end(await fs.readFile(path.join(root,'src/styles',url.slice(1))));return;}if(assets.has(url)){res.setHeader('Content-Type',url.endsWith('.png')?'image/png':'font/woff2');res.end(await fs.readFile(assets.get(url)));return;}res.writeHead(404);res.end();}catch(e){res.writeHead(500);res.end(String(e));}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});const errors=[],reports=[],compositions=new Map();let masterGeometry;
 try{
  const page=await browser.newPage({viewport:{width:1080,height:1440},deviceScaleFactor:1,reducedMotion:'reduce',locale:'zh-CN'});
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(`${r.status()} ${r.url()}`);});
  await fs.mkdir(out,{recursive:true});await fs.mkdir(path.join(root,'output/validation'),{recursive:true});
  for(const name of names){
   const isShare=!['series','variants'].includes(name),format=name.endsWith('-story')?'story':'feed',height=format==='story'?1920:1440;
   await page.setViewportSize({width:name==='series'?2160:1080,height});
   await page.goto(`http://127.0.0.1:${server.address().port}/${name}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const detail=await page.evaluate(()=>{
    const cards=[...document.querySelectorAll('.personal-pass')],rect=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};};
    const geometry=cards.map(pass=>{const origin=pass.getBoundingClientRect(),unit=origin.width/728;return Object.fromEntries(['.ticket-object','.ticket-main','.ticket-stub','.mg-bridge','.collectible-spine','.pass-security','.tipoff','.collection-stack','.collection-progress'].map(s=>{const b=pass.querySelector(s).getBoundingClientRect();return[s,{x:(b.x-origin.x)/unit,y:(b.y-origin.y)/unit,width:b.width/unit,height:b.height/unit}];}));});
    const artifact=document.querySelector('.personal-share-card'),caption=document.querySelector('.share-context');
    return {geometry,outer:cards.map(rect),ordinal:cards.map(p=>p.querySelector('[data-pass-layer="game-number"]').textContent),ids:cards.map(p=>p.querySelector('.pass-id').textContent),gameIds:cards.map(p=>p.dataset.gameId),phases:cards.map(p=>p.dataset.passStatus),identity:cards.map(p=>p.querySelector('.pass-security').style.getPropertyValue('--security-mask')),emotion:cards.map(p=>p.querySelectorAll('.emotion-mark').length),rootOpacity:cards.map(p=>getComputedStyle(p).opacity),filters:cards.map(p=>getComputedStyle(p).filter),progress:cards.map(p=>p.querySelector('.collection-count').textContent),share:['.share-brand','.share-pass-stage','.share-context'].filter(s=>document.querySelector(s)).map(s=>rect(document.querySelector(s))),format:artifact?.dataset.shareFormat??null,canvas:artifact?rect(artifact):null,city:artifact?.dataset.shareCity??null,timezone:artifact?.dataset.shareTimezone??null,caption:caption?{city:document.querySelector('.share-location').textContent,localTime:document.querySelector('.share-local-time').textContent,cityBox:rect(document.querySelector('.share-location')),momentBox:rect(document.querySelector('.share-moment'))}:null,scroll:document.documentElement.scrollWidth,forbidden:!!document.querySelector('nav,button,select,input,a')||/DOWNLOAD NOW|TRY NOW|WEB APP BETA|NEXT 7 DAYS|SCHEDULE|PROFILE|QR CODE|WATCHED FROM|\bLIVE\b|\bFINAL\b/.test(document.body.innerText)};
   });
   assert.ok(detail.geometry.length>0,'Every scene renders a real Pass');masterGeometry??=detail.geometry[0];
   for(const geometry of detail.geometry)assertMasterGeometry(geometry,masterGeometry,'Every scene, format, variant and ordinal preserves the normalized Pass master');
   assert.ok(detail.emotion.every(n=>n===1));assert.ok(detail.rootOpacity.every(n=>n==='1'));assert.ok(detail.filters.every(s=>!s.includes('grayscale')));assert.equal(detail.forbidden,false);assert.equal(detail.scroll,name==='series'?2160:1080);
   if(name==='series'){
    assert.equal(detail.ordinal.length,82);assert.deepEqual(detail.ordinal,Array.from({length:82},(_,i)=>`GAME ${String(i+1).padStart(2,'0')} / 82`));assert.equal(new Set(detail.ids).size,1);assert.equal(new Set(detail.identity).size,1);assert.deepEqual([...new Set(detail.phases)].sort(),['archived','game_day','next_up','upcoming']);assert.ok(detail.progress.every(s=>s==='41 / 82 COLLECTED'));
   }
   if(isShare){
    assert.equal(detail.outer.length,1);assert.equal(detail.format,format);assert.equal(detail.canvas.width,1080);assert.equal(detail.canvas.height,height);assert.equal(detail.share.length,3);
    const [brand,stage,context]=detail.share,pass=detail.outer[0];
    assert.ok(brand.y+brand.height<stage.y&&pass.y+pass.height<context.y,'Brand, complete Pass and context occupy separate regions');
    for(const box of [brand,stage,context,pass])assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=1080&&box.y+box.height<=height,'Every share region fits its export canvas');
    assert.ok(Math.abs(pass.width/pass.height-728/576)<.0001,'The complete master is scaled without cropping');
    const reference=compositions.get(format);
    if(reference)assert.deepEqual(detail.share,reference.share,`All ${format} snapshots use one composition`);else compositions.set(format,detail);
    if(format==='story')assert.equal(detail.caption.cityBox.x,context.x,'Story city context aligns to its left safe area');
    else assert.ok(Math.abs(detail.caption.cityBox.x+detail.caption.cityBox.width/2-540)<.1,'Feed city context remains centered');
    if(name==='kobe'||name==='kobe-story'){assert.equal(detail.city,'KOBE');assert.equal(detail.timezone,'Asia/Tokyo');assert.equal(detail.caption.city,'KOBE · JP');assert.equal(detail.caption.localTime,'LOCAL 10:00 / JST / GMT+9');}
    if(name==='tokyo-story'){assert.equal(detail.city,'TOKYO');assert.equal(detail.caption.city,'TOKYO · JP');assert.equal(detail.caption.localTime,'LOCAL 10:00 / JST / GMT+9');}
    if(name==='london-story'){assert.equal(detail.city,'LONDON');assert.equal(detail.caption.city,'LONDON · GB');assert.equal(detail.caption.localTime,'LOCAL 01:00 / GMT','Identical abbreviation and offset print once');}
    if(['kobe','tokyo-story','london-story','kobe-story'].includes(name)){assert.deepEqual(detail.ids,['PASS 0147']);assert.deepEqual(detail.gameIds,['hou-1']);}
   }
   const filename=name==='series'?'output/validation/mygame-plus-82-pass-series.png':name==='variants'?'output/validation/mygame-plus-pass-variants.png':`output/share/mygame-plus-${name}.png`;
   await page.screenshot({path:path.join(root,filename),fullPage:name==='series'||name==='variants',animations:'disabled'});
   const meta=await sharp(path.join(root,filename),{failOn:'warning'}).metadata();await sharp(path.join(root,filename)).raw().toBuffer();if(isShare){assert.equal(meta.width,1080);assert.equal(meta.height,height);}
   reports.push({name,file:filename,bytes:(await fs.stat(path.join(root,filename))).size,width:meta.width,height:meta.height,...detail});
  }
  const feed=compositions.get('feed'),story=compositions.get('story');assert.ok(feed&&story);assert.notDeepEqual(feed.share,story.share,'Feed and Story have distinct compositions');assert.notEqual(feed.outer[0].width,story.outer[0].width,'Story composes the complete Pass at its own scale');
  assert.deepEqual(errors,[]);await fs.writeFile('/tmp/mygame-v2.9-artifacts.json',JSON.stringify({reports,errors},null,2));console.log(JSON.stringify({files:reports.map(r=>({file:r.file,bytes:r.bytes,width:r.width,height:r.height})),series:'82 unique ordinals / one master / one stock / four states',formats:'Feed 1080×1440 / Story 1080×1920 / distinct compositions / one Pass master',errors},null,2));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
