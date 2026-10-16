const fs=require('node:fs/promises');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {execFile}=require('node:child_process');
const {promisify}=require('node:util');
const sharp=require('sharp');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const directory=__dirname,repository=path.resolve(directory,'../..');
const names=['mygame-plus-douyin-01-tokyo.png','mygame-plus-douyin-02-london.png'];
// Historical study: never overwrite the current full-mobile delivery.
const output=path.join(repository,'output/studies/v2.7');
async function contract(page){return page.locator('.pass').evaluate(pass=>{
 const origin=pass.getBoundingClientRect(),scale=origin.width/parseFloat(getComputedStyle(pass).width);
 const selectors=['.pass-main','.stub','.date','.game-day','.team-tint','.team-tint.away','.versus','.tipoff','.time-caption','.venue','.collection-stack','.serial','.emotion-mark','.mg-bridge','.collectible-spine','.perforation'];
 const rect=e=>{const r=e.getBoundingClientRect();return{x:(r.x-origin.x)/scale,y:(r.y-origin.y)/scale,width:r.width/scale,height:r.height/scale};};
 return {dna:pass.dataset.dna,outline:pass.style.getPropertyValue('--pass-outline'),html:pass.outerHTML,geometry:Object.fromEntries(selectors.map(s=>[s,rect(pass.querySelector(s))])),
  typography:Object.fromEntries(['.team-abbr','.team-chinese','.tipoff','.date .day','.date .month','.time-caption','.serial','.collection-stack','.event-annotation','.micro'].map(selector=>{const s=getComputedStyle(pass.querySelector(selector));return[selector,{font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,tracking:s.letterSpacing,color:s.color}]})),
  texts:{record:[...pass.querySelectorAll('.collection-stack>span')].map(e=>e.textContent),serial:pass.querySelector('.serial').textContent,time:pass.querySelector('.tipoff').textContent,local:pass.querySelector('.time-caption').textContent,emotion:pass.querySelector('.emotion-mark').textContent},
  material:{paper:getComputedStyle(pass.querySelector('.ticket-paper')).backgroundImage,stub:getComputedStyle(pass.querySelector('.stub')).backgroundImage,security:[...pass.querySelectorAll('.pass-security')].map(e=>getComputedStyle(e,'::before').maskImage)},
 };
});}
async function main(){
 const source=(await fs.readFile(path.join(directory,'promo.html'),'utf8')).replace('<link rel="stylesheet" href="mobile-pass-enclosure.css">','').replace('class="pass has-mobile-enclosure"','class="pass"');
 const frames=await Promise.all(['tokyo','london'].map(async city=>(await promisify(execFile)(process.execPath,[path.join(repository,'node_modules/tsx/dist/cli.mjs'),'--tsconfig',path.join(repository,'tsconfig.tests.json'),path.join(directory,'render-encased-frame.tsx'),city],{cwd:repository,maxBuffer:1024*1024})).stdout));
 const pages=frames.map(frame=>source.replace(/<title>[^<]*<\/title>/,'<title>MyGame+ V2.7 — Encased Pass Artifact</title>').replace('<link rel="stylesheet" href="pass-dna.css">','<link rel="stylesheet" href="pass-dna.css"><link rel="stylesheet" href="encased-pass.css">').replace('<main aria-label="MyGame+ 宣传图">',`<main class="encased-export-mode" aria-label="MyGame+ 封装赛事通行证">${frame}`));
 const ts=require('typescript'),modules=new Map();
 for(const [url,name] of [['/pass-design.js','passDesign'],['/pass-status.js','passStatus'],['/game-completion.js','gameCompletion'],['/pass-id.js','passIdentity'],['/pass-dna.js','passDNA']])modules.set(url,ts.transpileModule(await fs.readFile(path.join(repository,`src/lib/${name}.ts`),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2017}}).outputText.replaceAll('../data/teamIdentities','./team-identities.js').replaceAll("'./passDNA'","'./pass-dna.js'").replaceAll("'./gameCompletion'","'./game-completion.js'"));
 for(const [url,file] of [['/seasons.js','seasons'],['/team-identities.js','teamIdentities']])modules.set(url,ts.transpileModule(await fs.readFile(path.join(repository,`src/data/${file}.ts`),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2017}}).outputText);
 const assets=new Map([
  ['/promo.html',[path.join(directory,'promo.html'),'text/html']],
  ['/wordmark.png',[path.join(directory,'wordmark.png'),'image/png']],
  ['/brand/mygame-plus.png',[path.join(repository,'public/brand/mygame-plus.png'),'image/png']],
  ['/GeistSans.woff2',[path.join(repository,'src/app/fonts/GeistSans.woff2'),'font/woff2']],
  ...['timing-500.woff2','timing-550.woff2','identity-600.woff2','event-annotation.woff2'].map(name=>['/'+name,[path.join(directory,name),'font/woff2']]),
  ...['color-material.css','pass-dna.css','system-island.css','encased-pass.css','brand-lockup.css','personal-season.css'].map(name=>['/'+name,[path.join(repository,'src/styles',name),'text/css']]),
 ]);
 const server=http.createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/promo.html'){res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});res.end(source);return;}
  if(url.pathname==='/encased.html'){res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});res.end(pages[url.searchParams.get('city')==='london'?1:0]);return;}
  if(modules.has(url.pathname)){res.writeHead(200,{'Content-Type':'text/javascript'});res.end(modules.get(url.pathname));return;}
  const asset=assets.get(url.pathname);if(!asset){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':asset[1]});res.end(await fs.readFile(asset[0]));
 }catch(error){res.writeHead(500);res.end(String(error));}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 const reports=[],errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1080,height:1440},deviceScaleFactor:1,reducedMotion:'reduce',locale:'zh-CN'});
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${new URL(r.url()).pathname}`);});
  await page.addInitScript(()=>localStorage.setItem('mygame_pass_id','0147'));
  const base=`http://127.0.0.1:${server.address().port}`;
  for(const [i,city] of ['tokyo','london'].entries()){
   await page.goto(`${base}/promo.html?city=${city}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const original=await contract(page);
   await page.goto(`${base}/encased.html?city=${city}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(async()=>{document.querySelector('#encased-ticket-anchor').replaceWith(document.querySelector('.pass'));document.querySelector('.pass').getBoundingClientRect();await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(resolve));});
   const enclosed=await contract(page);
   assert.equal(enclosed.html,original.html,'Enclosure must reuse the approved Pass DOM verbatim');
   assert.equal(enclosed.outline,original.outline);assert.equal(enclosed.dna,'MG-DNA-1');assert.deepEqual(enclosed.typography,original.typography);assert.deepEqual(enclosed.texts,original.texts);assert.deepEqual(enclosed.material,original.material);
   for(const [selector,rectangle] of Object.entries(original.geometry))for(const [key,value] of Object.entries(rectangle))assert.ok(Math.abs(enclosed.geometry[selector][key]-value)<.06,`${selector} ${key} must retain its normalized master coordinate`);
   const detail=await page.evaluate(()=>{
    const rect=selector=>{const b=document.querySelector(selector).getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};};
    const shell=document.querySelector('.encased-pass'),pass=document.querySelector('.pass');
    const perimeter=2*(760+600)-8*26+2*Math.PI*26;
    const casingNodes=[shell,...shell.children];
    return {geometry:Object.fromEntries(['.artifact-brand-signature','.artifact-context','.artifact-display','.encased-pass','.slab-rear','.encased-ticket-slot','.slab-side-right','.slab-side-bottom','.slab-inner-seam','.pass','.artifact-caption','.artifact-city-state'].map(s=>[s,rect(s)])),
     dynamic:[...document.querySelectorAll('[data-artifact-state],.pass [data-state]')].map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};}),
     shellRatio:{width:shell.getBoundingClientRect().width/pass.getBoundingClientRect().width,height:shell.getBoundingClientRect().height/pass.getBoundingClientRect().height},
     totalShellRatio:(()=>{const front=shell.getBoundingClientRect(),rear=document.querySelector('.slab-rear').getBoundingClientRect(),paper=pass.getBoundingClientRect();return{width:(rear.right-front.x)/paper.width,height:(rear.bottom-front.y)/paper.height};})(),
     rimCoverage:[...document.querySelectorAll('.slab-refraction>path')].reduce((sum,p)=>sum+p.getTotalLength(),0)/perimeter,
     rimPaths:[...document.querySelectorAll('.slab-refraction>path')].map(p=>p.getAttribute('d')),
     rimInk:getComputedStyle(document.querySelector('.slab-refraction')).color,
     blur:casingNodes.map(e=>getComputedStyle(e).backdropFilter),
     plane:getComputedStyle(document.querySelector('.slab-back-plane')).backgroundColor,
     faceCover:document.querySelectorAll('.slab-face-film').length,
     viewport:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},
     copy:document.body.innerText,
     fonts:document.fonts.check('530 32px Geist')&&document.fonts.check('600 64px "MyGame Identity"')&&document.fonts.check('550 100px "MyGame Timing"')&&document.fonts.check('400 16px "Event Annotation"','Tip-off'),
     noTransform:getComputedStyle(shell).transform,
    };
   });
   assert.deepEqual(detail.viewport,{width:1080,height:1440});assert.ok(detail.fonts);assert.ok(detail.blur.every(value=>value==='none'));assert.equal(detail.faceCover,0);
   assert.ok(detail.shellRatio.width>=1.03&&detail.shellRatio.width<=1.05);assert.ok(detail.shellRatio.height>=1.03&&detail.shellRatio.height<=1.05);
   assert.ok(detail.totalShellRatio.width<=1.05&&detail.totalShellRatio.height<=1.05,'Physical sidewall is included in the 3–5% size budget');
   assert.ok(detail.rimCoverage>=.20&&detail.rimCoverage<=.35);assert.equal(detail.rimPaths.length,2);
   assert.ok(!/WEB APP BETA|NEXT 7 DAYS|SCHEDULE|PROFILE|评级|GEM MINT|CLAIM/.test(detail.copy));
   assert.ok(detail.copy.includes('NBA')&&detail.copy.includes('HOU')&&detail.copy.includes('LAL'));
   assert.ok(detail.geometry['.encased-pass'].x>50&&detail.geometry['.encased-pass'].x+detail.geometry['.encased-pass'].width<1030);
   const filename=path.join(output,names[i]);await page.screenshot({path:filename,type:'png',animations:'disabled'});await sharp(filename).raw().toBuffer();const metadata=await sharp(filename).metadata(),stat=await fs.stat(filename);assert.equal(metadata.width,1080);assert.equal(metadata.height,1440);assert.ok(stat.size>0);
   await sharp(filename).resize(324,432).png().toFile(`/tmp/mygame-v2.7-${city}-30.png`);
   await sharp(filename).greyscale().png().toFile(`/tmp/mygame-v2.7-${city}-greyscale.png`);
   await sharp(filename).blur(5).resize(324,432).png().toFile(`/tmp/mygame-v2.7-${city}-blur-30.png`);
   // Material separation: removing the casing must change only its optical boundary and shadow.
   const noShell=await page.addStyleTag({content:'.slab-rear,.slab-side-right,.slab-side-bottom,.slab-back-plane,.slab-front-bevel,.slab-inner-seam,.slab-refraction,.slab-corner-optics,.slab-light-return{visibility:hidden!important}'});
   await page.screenshot({path:`/tmp/mygame-v2.7-${city}-paper-only.png`,animations:'disabled'});await noShell.evaluate(e=>e.remove());
   const noShellPixels=await sharp(`/tmp/mygame-v2.7-${city}-paper-only.png`).removeAlpha().raw().toBuffer();
   const encasedPixels=await sharp(filename).removeAlpha().raw().toBuffer();
   const box=detail.geometry['.pass'],safe=24*box.width/728;let paperFaceDifferences=0;
   for(let y=Math.ceil(box.y+safe);y<Math.floor(box.y+box.height-safe);y++)for(let x=Math.ceil(box.x+safe);x<Math.floor(box.x+box.width-safe);x++){const k=(y*1080+x)*3;if(encasedPixels[k]!==noShellPixels[k]||encasedPixels[k+1]!==noShellPixels[k+1]||encasedPixels[k+2]!==noShellPixels[k+2])paperFaceDifferences++;}
   assert.equal(paperFaceDifferences,0,'The acrylic enclosure must not glass-filter the paper face');
   detail.paperFaceDifferences=paperFaceDifferences;
   const paper=await page.locator('.pass').screenshot({animations:'disabled'});
   await page.locator('.encased-pass').evaluate(e=>e.style.setProperty('--team-accent',getComputedStyle(document.documentElement).getPropertyValue('--lal-accent')));
   const lalInk=await page.locator('.slab-refraction').evaluate(e=>getComputedStyle(e).color);assert.notEqual(lalInk,detail.rimInk);
   const after=await page.locator('.pass').screenshot({animations:'disabled'});assert.ok((await sharp(paper).raw().toBuffer()).equals(await sharp(after).raw().toBuffer()),'Team rim swap must not recolor the enclosed paper');
   await page.locator('.encased-pass').evaluate(e=>e.style.removeProperty('--team-accent'));
   reports.push({city,file:filename,bytes:stat.size,decode:'passed',...detail,passDNAUnchanged:true,lalRimInk:lalInk});
  }
  assert.deepEqual(reports[0].geometry,reports[1].geometry,'Cities must share the same environment, display and enclosure coordinates');
  const a=await sharp(path.join(output,names[0])).removeAlpha().raw().toBuffer(),b=await sharp(path.join(output,names[1])).removeAlpha().raw().toBuffer();let outside=0,total=0;
  const regions=[...reports[0].dynamic,...reports[1].dynamic];
  for(let y=0;y<1440;y++)for(let x=0;x<1080;x++){const k=(y*1080+x)*3;if(a[k]!==b[k]||a[k+1]!==b[k+1]||a[k+2]!==b[k+2]){total++;if(!regions.some(r=>x>=r.x-3&&x<=r.x+r.width+3&&y>=r.y-3&&y<=r.y+r.height+3))outside++;}}
  assert.equal(outside,0,'Only city/slogan/GMT/local-time pixels may differ');assert.deepEqual(errors,[]);
  const halfLondon=await sharp(path.join(output,names[1])).removeAlpha().ensureAlpha(.5).png().toBuffer();
  await sharp(path.join(output,names[0])).composite([{input:halfLondon,blend:'over'}]).png().toFile('/tmp/mygame-v2.7-overlay.png');
  await fs.writeFile('/tmp/mygame-v2.7-validation.json',JSON.stringify({reports,staticPixelDifferences:outside,changedPixels:total,errors},null,2));
  console.log(JSON.stringify({files:reports.map(r=>({city:r.city,bytes:r.bytes,width:1080,height:1440,decode:r.decode})),passDNA:'unchanged',shellRatio:reports[0].shellRatio,totalShellRatio:reports[0].totalShellRatio,paperFaceDifferences:reports[0].paperFaceDifferences,rimCoverage:reports[0].rimCoverage,staticPixelDifferences:outside,errors},null,2));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
