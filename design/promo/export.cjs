const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const http = require('node:http');
const {execFileSync}=require('node:child_process');
const {reviewMobileEnclosure}=require('./review-mobile-enclosure.cjs');
const directory = __dirname;
const repository = path.resolve(directory,'../..');
const sharp = require(path.join(repository,'node_modules/sharp'));
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const output = path.join(repository, 'output/douyin');
const names = ['mygame-plus-douyin-01-tokyo.png', 'mygame-plus-douyin-02-london.png'];

async function prepareAssets() {
  // Prepared brand and material assets are retained; exports never reconstruct the logo.
  for (const asset of ['wordmark.png','paper-material.png','timing-500.woff2','timing-550.woff2','identity-600.woff2','event-annotation.woff2']) {
    const stat=await fs.stat(path.join(directory,asset));
    assert.ok(stat.size>0, asset+' must exist');
  }
}

async function main() {
  await prepareAssets();
  const enclosure=execFileSync(process.execPath,[path.join(repository,'node_modules/tsx/dist/cli.mjs'),'--tsconfig',path.join(repository,'tsconfig.tests.json'),path.join(directory,'render-mobile-enclosure.tsx')],{cwd:repository,encoding:'utf8'});
  const brand=execFileSync(process.execPath,[path.join(repository,'node_modules/tsx/dist/cli.mjs'),'--tsconfig',path.join(repository,'tsconfig.tests.json'),path.join(directory,'render-brand-lockup.tsx')],{cwd:repository,encoding:'utf8'});
  const progress=execFileSync(process.execPath,[path.join(repository,'node_modules/tsx/dist/cli.mjs'),'--tsconfig',path.join(repository,'tsconfig.tests.json'),path.join(directory,'render-collection-progress.tsx')],{cwd:repository,encoding:'utf8'});
  const source=(await fs.readFile(path.join(directory,'promo.html'),'utf8')).replace('<!--mygame-mobile-enclosure-->',enclosure).replace('<!--mygame-brand-lockup-->',brand).replace('<!--mygame-collection-progress-->',progress);
  const ts=require('typescript');
  const modules=new Map();
  for(const [url,name] of [['/pass-design.js','passDesign'],['/pass-status.js','passStatus'],['/game-completion.js','gameCompletion'],['/pass-id.js','passIdentity'],['/pass-dna.js','passDNA']])modules.set(url,ts.transpileModule(await fs.readFile(path.join(repository,`src/lib/${name}.ts`),'utf8'), {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2017}}).outputText.replaceAll('../data/teamIdentities','./team-identities.js').replaceAll("'./passDNA'","'./pass-dna.js'").replaceAll("'./gameCompletion'","'./game-completion.js'"));
  modules.set('/seasons.js',ts.transpileModule(await fs.readFile(path.join(repository,'src/data/seasons.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2017}}).outputText);
  modules.set('/team-identities.js',ts.transpileModule(await fs.readFile(path.join(repository,'src/data/teamIdentities.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2017}}).outputText);
  const routes = new Map([
    ['/promo.html', [path.join(directory,'promo.html'),'text/html; charset=utf-8']],
    ['/wordmark.png', [path.join(directory,'wordmark.png'),'image/png']],
    ['/brand/mygame-plus.png', [path.join(repository,'public/brand/mygame-plus.png'),'image/png']],
    ['/paper-material.png', [path.join(directory,'paper-material.png'),'image/png']],
    ['/GeistSans.woff2', [path.join(repository,'src/app/fonts/GeistSans.woff2'),'font/woff2']],
    ...['timing-500.woff2','timing-550.woff2','identity-600.woff2','event-annotation.woff2'].map(name=>['/'+name,[path.join(directory,name),'font/woff2']]),
    ['/system-island.css', [path.join(repository,'src/styles/system-island.css'),'text/css']],
    ['/pass-dna.css', [path.join(repository,'src/styles/pass-dna.css'),'text/css']],
    ['/color-material.css', [path.join(repository,'src/styles/color-material.css'),'text/css']],
    ['/mobile-pass-enclosure.css', [path.join(repository,'src/styles/mobile-pass-enclosure.css'),'text/css']],
    ['/brand-lockup.css', [path.join(repository,'src/styles/brand-lockup.css'),'text/css']],
    ['/personal-season.css', [path.join(repository,'src/styles/personal-season.css'),'text/css']],
  ]);
  const server = http.createServer(async (request,response) => {
    const pathname=new URL(request.url,'http://127.0.0.1').pathname;
    if(pathname==='/promo.html'){response.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});response.end(source);return;}
    if(modules.has(pathname)){response.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'});response.end(modules.get(pathname));return;}
    const route = routes.get(pathname);
    if (!route) { response.writeHead(404); response.end(); return; }
    try { const bytes=await fs.readFile(route[0]); response.writeHead(200,{'Content-Type':route[1],'Cache-Control':'no-store'}); response.end(bytes); }
    catch { response.writeHead(500); response.end(); }
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const baseURL = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({
    executablePath: process.env.PROMO_CHROMIUM || '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const reports = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 1, reducedMotion: 'reduce', locale: 'zh-CN' });
    // Pin a sample identity only in the export browser. Production always issues locally.
    await page.addInitScript(()=>{if(!localStorage.getItem('mygame_pass_id'))localStorage.setItem('mygame_pass_id','0147');});
    page.on('pageerror', error => { throw error; });
    for (const [i, city] of ['tokyo', 'london'].entries()) {
      await page.goto(baseURL + '/promo.html?city=' + city, { waitUntil: 'load' });
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const report = await page.evaluate(() => {
        const selectors = ['.top-label', '.brand', '.brand h1', '.app-mark', '.wordmark', '.subtitle', '.slogan', '.beta', '.city-status', '.identity', '.identity-label', '.time-system', '.local-label', '.auto-state', '.offset', '.team-preference', '.city-control', '.pass', '.pass-main', '.stub', '.collection-stack', '.venue', '.game-status', '.event-annotation', '.team-tint', '.tipoff', '.time-caption', '.week', '.schedule', '.dock'];
        const rect = element => { const b = element.getBoundingClientRect(); return { x:b.x, y:b.y, width:b.width, height:b.height }; };
        const styles = selector => { const s = getComputedStyle(document.querySelector(selector)); return { radius:s.borderRadius, border:s.borderTopWidth + ' ' + s.borderTopColor, background:s.backgroundColor, backgroundImage:s.backgroundImage, shadow:s.boxShadow, filter:s.filter, blur:s.backdropFilter, font:s.fontFamily }; };
        const paper=getComputedStyle(document.querySelector('.ticket-paper'));
        const paint=token=>{const probe=document.createElement('span');probe.style.color=`var(${token})`;document.body.append(probe);const color=getComputedStyle(probe).color;probe.remove();return color;};
        const overflow = [...document.querySelectorAll('[data-fit]')].filter(element => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1).map(element => element.className);
        return {
          paints:Object.fromEntries(['--text-primary','--text-secondary','--text-tertiary','--text-micro','--annotation-ink','--canvas-base','--signal-active','--graphite-100','--brand-red','--hou-accent','--lal-accent'].map(token=>[token,paint(token)])),
          geometry: Object.fromEntries(selectors.map(selector => [selector, rect(document.querySelector(selector))])),
          dynamic: [...document.querySelectorAll('[data-state]')].map(rect),
          radius: Object.fromEntries(['.team-tint','.beta','.pass','.dock'].map(selector => [selector, styles(selector).radius])),
          surfaces: Object.fromEntries(['.beta','.pass','.dock'].map(selector => [selector, styles(selector)])),
          identityPatches: ['.team-tint:not(.away)','.team-tint.away'].map(styles),
          fontsLoaded: document.fonts.check('530 100px Geist')&&document.fonts.check('550 100px "MyGame Timing"')&&document.fonts.check('500 30px "MyGame Timing"')&&document.fonts.check('600 64px "MyGame Identity"')&&document.fonts.check('400 16px "Event Annotation"','Tip-off'),
          annotation:(()=>{const element=document.querySelector('.event-annotation'),s=getComputedStyle(element);return {text:element.textContent,font:s.fontFamily,size:s.fontSize,line:s.lineHeight,weight:s.fontWeight,color:s.color,opacity:s.opacity,decoration:s.textDecorationLine,shadow:s.textShadow,count:document.querySelectorAll('.pass .event-annotation').length,scriptText:[...document.querySelectorAll('.pass *')].filter(node=>getComputedStyle(node).fontFamily.includes('Event Annotation')).map(node=>node.textContent)};})(),
          scrollWidth:document.documentElement.scrollWidth, scrollHeight:document.documentElement.scrollHeight,
          overflow,
          texts: [...document.querySelectorAll('[data-state]')].map(element => element.textContent.trim()),
          navigation: [...document.querySelectorAll('.system-island-item')].map(element=>({rect:rect(element),icon:rect(element.querySelector('svg')),cn:rect(element.querySelector('.island-cn')),en:rect(element.querySelector('.island-en')),cnSize:getComputedStyle(element.querySelector('.island-cn')).fontSize,enSize:getComputedStyle(element.querySelector('.island-en')).fontSize,overflow:element.scrollWidth>element.clientWidth+1||element.scrollHeight>element.clientHeight+1})),
          activeBackground:getComputedStyle(document.querySelector('.system-island-item[aria-current]')).backgroundColor,
          canvas:getComputedStyle(document.body).backgroundColor,
          wordmarkMask:getComputedStyle(document.querySelector('.wordmark')).maskImage,
          paperMaterial:{background:paper.backgroundImage,mask:getComputedStyle(document.querySelector('.ticket-object')).maskImage,composition:getComputedStyle(document.querySelector('.ticket-object')).maskComposite,edge:paper.boxShadow},
          paperBorder:paper.borderTopColor,
          inkLevels:Object.fromEntries(Object.entries({primary:['.brand h1','.tipoff','.date .day','.date .month','.city-control .city','.week h2','.count'],secondary:['.subtitle','.subtitle .nba','.slogan','.venue','.row-team','.row-time','.team-chinese','.team-preference .name','.game-status','.versus','.time-caption .caption-state'],tertiary:['.city-status','.identity-label .cn','.team-preference .chevron','.city-control .chevron','.offset','.weekday','.row-date .number','.row-venue','.venue-status','.beta-label','.micro'],micro:['.top-label','.auto-state','.identity>.identity-english','.serial','.collection-stack','.row-date .sub','.weekday .en']}).map(([level,selectors])=>[level,Object.fromEntries(selectors.map(selector=>[selector,[...new Set([...document.querySelectorAll(selector)].map(element=>getComputedStyle(element).color))]]))])),
          serialStyle:(()=>{const element=document.querySelector('.serial'),s=getComputedStyle(element);return {size:s.fontSize,line:s.lineHeight,tracking:s.letterSpacing,gap:s.columnGap,parts:[...element.children].map(part=>part.textContent.trim()),separators:[...element.querySelectorAll('.separator')].map(part=>({opacity:getComputedStyle(part).opacity,tracking:getComputedStyle(part).letterSpacing})),rect:rect(element)};})(),
          dna:{version:document.querySelector('.pass').dataset.dna,bridge:rect(document.querySelector('.mg-bridge')),spine:rect(document.querySelector('.collectible-spine')),cutPaths:[...document.querySelectorAll('.ticket-cut-edges path')].map(e=>e.getAttribute('d')),join:rect(document.querySelector('.ticket-join'))},
          perforation:rect(document.querySelector('.perforation')),
          collection:[...document.querySelectorAll('.collection-stack>span')].map(element=>({text:element.textContent,rect:rect(element),font:getComputedStyle(element).fontFamily,size:getComputedStyle(element).fontSize,tracking:getComputedStyle(element).letterSpacing,numerals:getComputedStyle(element).fontVariantNumeric})),
          security:[...document.querySelectorAll('.pass-security')].map(element=>({team:element.dataset.securityTeam,image:getComputedStyle(element,'::before').maskImage,ink:getComputedStyle(element,'::before').backgroundColor,finish:element.dataset.securityFinish,light:getComputedStyle(element,'::after').backgroundColor})),
          content:{slogan:document.querySelector('.slogan').textContent,cityState:document.querySelector('.city-status').textContent,auto:document.querySelector('.auto-state').textContent,serial:document.querySelector('.serial').textContent,time:document.querySelector('#tipoff').textContent,first:document.querySelector('#time-one').textContent,second:document.querySelector('#time-two').textContent},
          markLetters:{m:rect(document.querySelector('.mark-m')),g:rect(document.querySelector('.mark-g')),mLetter:document.querySelector('.mark-m').dataset.letter,gLetter:document.querySelector('.mark-g').dataset.letter,paths:document.querySelectorAll('.mark-glyph path').length,textNodes:document.querySelectorAll('.mark-glyph text').length},
          typography:Object.fromEntries(['.brand h1','.slogan','.subtitle','.nba','.beta-label','.auto-state','.team-abbr','.tipoff'].map(selector=>{const s=getComputedStyle(document.querySelector(selector));return [selector,{size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,tracking:s.letterSpacing,color:s.color}];})),
          timing:[...document.querySelectorAll('.timing-run')].map(element=>{const s=getComputedStyle(element);const colon=element.querySelector('.timing-colon'),dot=getComputedStyle(colon,'::before');return {text:element.textContent,label:element.getAttribute('aria-label'),font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,numerals:s.fontVariantNumeric,rect:rect(element),colon:{rect:rect(colon),opacity:getComputedStyle(colon).opacity,width:dot.width,height:dot.height,radius:dot.borderRadius,textSize:getComputedStyle(colon.querySelector('.colon-text')).fontSize}};}),
          digitAdvances:(()=>{const context=document.createElement('canvas').getContext('2d');return Object.fromEntries([500,550].map(weight=>{context.font=weight+' 100px "MyGame Timing"';return [weight,[...'0123456789'].map(digit=>context.measureText(digit).width)];}));})(),
          dateFont:getComputedStyle(document.querySelector('.date .day')).fontFamily,
          localOwnership:document.querySelector('.time-system').contains(document.querySelector('.auto-state')),
          microLabels:[...document.querySelectorAll('.micro,.beta-label,.auto-state')].map(element=>{const s=getComputedStyle(element);return {text:element.textContent,font:s.fontFamily,weight:s.fontWeight,tracking:parseFloat(s.letterSpacing)/parseFloat(s.fontSize)};}),
          summaryBorders:['.schedule','.schedule-row'].map(selector=>{const s=getComputedStyle(document.querySelector(selector));return {top:s.borderTopWidth,bottom:s.borderBottomWidth};}),
          brandSeal:styles('.app-mark'),
          chevrons:[...document.querySelectorAll('.chevron')].map(element=>({rect:rect(element),color:getComputedStyle(element).color})),
          visibleURLs:/https?:\/\/|www\.|vercel\.app/i.test(document.body.innerText),
          litContent:['.identity','.city-status','.week','.beta'].filter(selector=>{
            const s=getComputedStyle(document.querySelector(selector));return s.boxShadow!=='none'||s.filter!=='none'||s.backgroundImage!=='none';
          }),
        };
      });
      assert.equal(report.scrollWidth, 1080);
      assert.equal(report.scrollHeight, 1440);
      assert.ok(report.fontsLoaded, 'Geist and both branded font subsets must load');
      assert.deepEqual(report.overflow, [], 'Text must fit');
      assert.equal(report.annotation.count,1,'Exactly one event annotation; no second handwritten cue');
      assert.equal(report.annotation.text,'Tip-off');assert.deepEqual(report.annotation.scriptText,['Tip-off'],'All technical information stays printed');
      assert.equal(report.annotation.size,'16px');assert.equal(report.annotation.line,'24px');assert.equal(report.annotation.weight,'400');
      assert.equal(report.annotation.color,report.paints['--annotation-ink']);assert.equal(report.annotation.opacity,'1');
      assert.equal(report.annotation.decoration,'none');assert.equal(report.annotation.shadow,'none');
      assert.ok(report.geometry['.event-annotation'].y>=report.geometry['.stub'].y+12,'The only emotion mark belongs to the stub');
      assert.ok(report.geometry['.event-annotation'].y+report.geometry['.event-annotation'].height+8<=report.serialStyle.rect.y,'Handwriting must clear the printed serial');
      assert.equal(report.radius['.team-tint'], '12px');
      assert.equal(report.radius['.beta'], '16px');
      assert.equal(report.radius['.pass'], '20px');
      assert.equal(report.radius['.dock'], '28px');
      assert.equal(report.geometry['.beta'].width,728);
      assert.equal(report.geometry['.beta'].height,24);
      assert.deepEqual(report.geometry['.app-mark'],{x:176,y:70,width:52,height:52});
      assert.deepEqual(report.geometry['.pass'],{x:176,y:456,width:728,height:576});
      assert.equal(report.geometry['.pass-main'].height,480);
      assert.equal(report.perforation.y,report.geometry['.pass-main'].y+480,'Tear guide ends the main ticket');
      assert.ok(report.geometry['.venue'].y+report.geometry['.venue'].height+16<=report.perforation.y,'Venue belongs above the tear guide');
      assert.ok(report.geometry['.time-caption'].y+report.geometry['.time-caption'].height+16<=report.perforation.y);
      assert.equal(report.geometry['.stub'].y,report.perforation.y+2);
      assert.deepEqual(report.collection.map(row=>row.text),['PASS 0147','GAME 01 / 82','SEASON 26–27']);
      for(const row of report.collection){assert.ok(row.rect.y>report.perforation.y);assert.ok(row.rect.y+row.rect.height<=report.geometry['.pass'].y+576-16);assert.equal(row.font,'Geist, sans-serif');assert.equal(row.size,'14px');assert.equal(row.tracking,'1.4px');assert.equal(row.numerals,'tabular-nums');}
      assert.equal(report.collection[2].rect.y+report.collection[2].rect.height,report.serialStyle.rect.y+report.serialStyle.rect.height,'Collection and serial end on one printed baseline');
      assert.equal(report.security.length,2);for(const field of report.security){assert.equal(field.team,'HOU');assert.ok(field.image.startsWith('url("data:image/svg+xml,'));}
      assert.deepEqual(report.geometry['.week'],{x:176,y:1080,width:728,height:224});
      assert.deepEqual(report.geometry['.dock'],{x:76,y:1344,width:928,height:68});
      const gap=(above,below)=>report.geometry[below].y-(report.geometry[above].y+report.geometry[above].height);
      report.verticalRhythm=[gap('.top-label','.brand'),gap('.brand','.subtitle'),gap('.subtitle','.slogan'),gap('.slogan','.beta'),gap('.beta','.city-status'),gap('.city-status','.identity'),gap('.identity','.pass'),gap('.pass','.week'),gap('.week','.dock')];
      assert.deepEqual(report.verticalRhythm,[8,32,4,32,8,8,36,48,40],'Dense semantic groups alternate with deliberate open section gaps');
      assert.equal(gap('.brand','.subtitle'),32,'Separate Brand from Product');
      assert.equal(gap('.subtitle','.slogan'),4,'Product descriptor and slogan form one group');
      assert.equal(gap('.slogan','.beta'),32,'Separate Product from System');
      for(const patch of report.identityPatches) {
        assert.ok(patch.border.startsWith('0px'));assert.equal(patch.shadow,'none');assert.equal(patch.blur,'none');
        assert.ok(patch.backgroundImage.includes(', 0)')&&patch.backgroundImage.includes('75%'),'Team temperature dissolves before the patch edge');
      }
      assert.equal(report.geometry['.time-caption'].y-report.geometry['.tipoff'].y,96,'Local-time detail stays close to the main timing block');
      assert.deepEqual(report.litContent,[],'Only the event pass gets object lighting in content');
      assert.ok(!report.visibleURLs,'No visible website URLs');
      assert.equal(report.content.slogan,city==='tokyo'?'无论在哪，主队准时见。':'换个城市，不换主队。');
      assert.equal(report.content.cityState,city==='tokyo'?'当前城市 · TOKYO':'城市切换 · TOKYO → LONDON');
      assert.equal(report.content.auto,'AUTO CONVERTED');
      assert.equal(report.content.serial,'MG+ / HOU–LAL / 01');
      assert.equal(report.serialStyle.size,'14px');assert.equal(report.serialStyle.line,'20px');assert.equal(report.serialStyle.tracking,'1.4px');assert.equal(report.serialStyle.gap,'8px');
      assert.deepEqual(report.serialStyle.parts,['MG+','/','HOU–LAL','/','01']);
      for(const separator of report.serialStyle.separators){assert.equal(separator.opacity,'0.62');assert.equal(separator.tracking,'normal');}
      assert.equal(report.serialStyle.rect.x+report.serialStyle.rect.width,report.geometry['.pass'].x+report.geometry['.pass'].width-32,'Serial stays on the ticket stub right alignment');
      const inks=Object.fromEntries(['primary','secondary','tertiary','micro'].map(level=>[level,report.paints['--text-'+level]]));
      assert.deepEqual(inks,{primary:'rgb(27, 28, 26)',secondary:'rgb(75, 76, 72)',tertiary:'rgb(118, 119, 113)',micro:'rgb(166, 165, 159)'},'Use the approved warm graphite hierarchy');
      for(const [level,selectors] of Object.entries(report.inkLevels))for(const [selector,colors]of Object.entries(selectors))assert.deepEqual(colors,[inks[level]],selector+' must use its assigned brightness tier');
      assert.ok(parseFloat(report.paperBorder.split(',').at(-1))<=.01,'The frame must be only a minimal support for the illuminated paper');
      assert.equal(report.content.time,city==='tokyo'?'10:00':'01:00');
      assert.equal(report.content.first,report.content.time);
      assert.equal(report.content.second,city==='tokyo'?'11:00':'02:00');
      assert.equal(report.markLetters.mLetter,'M');assert.equal(report.markLetters.gLetter,'G+');
      assert.equal(report.markLetters.paths,3);assert.equal(report.markLetters.textNodes,0,'Brand seal must use custom contours rather than default font text');
      assert.ok(report.markLetters.m.x<report.markLetters.g.x&&report.markLetters.m.y+report.markLetters.m.height<report.markLetters.g.y,'M upper-left, G+ lower-right with negative space');
      assert.ok(report.brandSeal.backgroundImage.includes('radial-gradient')&&report.brandSeal.shadow!=='none','Brand seal has restrained edge light and contact depth');
      for(const key of ['size','weight','line','tracking'])assert.equal(report.typography['.beta-label'][key],report.typography['.auto-state'][key],'System microcopy shares type metrics while its semantic ink tier differs');
      assert.ok(parseFloat(report.typography['.brand h1'].size)<parseFloat(report.typography['.team-abbr'].size));
      assert.ok(parseFloat(report.typography['.brand h1'].size)>parseFloat(report.typography['.slogan'].size));
      assert.ok(parseFloat(report.typography['.slogan'].size)>parseFloat(report.typography['.subtitle'].size));
      assert.ok(parseFloat(report.typography['.team-abbr'].size)<parseFloat(report.typography['.tipoff'].size));
      for(const border of report.summaryBorders) assert.deepEqual(border,{top:'0px',bottom:'0px'},'Premium summary relies on spacing rather than table rules');
      assert.equal(report.typography['.tipoff'].size,'100px','Do not enlarge the main time');
      assert.equal(report.timing.length,3);
      assert.ok(report.digitAdvances[550][0]<55&&report.digitAdvances[550][0]>53,'Timing numerals refine width without increasing cap height');
      for(const widths of Object.values(report.digitAdvances)) assert.ok(widths.every(width=>Math.abs(width-report.digitAdvances[550][0])<.001),'Every timing numeral has the same advance across both weights');
      assert.ok(report.dateFont.includes('MyGame Timing'),'Date inherits the timing numeral family');
      for(const [index,time] of report.timing.entries()) {
        assert.ok(time.font.includes('MyGame Timing'));assert.equal(time.numerals,'tabular-nums');
        assert.equal(time.size,index===0?'100px':'30px');assert.equal(time.weight,index===0?'550':'500');
        assert.equal(time.colon.opacity,index===0?'0.6':'0.52');
        assert.equal(time.colon.textSize,'0px','Colon must be drawn from its own two dots, not a font glyph');
        assert.equal(time.colon.width,time.colon.height);assert.ok(parseFloat(time.colon.width)/parseFloat(time.size)<.05,'Timing dots must stay precise and smaller than 5% of the em');assert.equal(time.text,time.label);
      }
      assert.ok(report.localOwnership,'AUTO CONVERTED belongs inside the LOCAL TIME group');
      for(const selector of ['.local-label','.city-control','.offset','.auto-state']) {
        const b=report.geometry[selector],group=report.geometry['.time-system'];
        assert.ok(b.x>=group.x&&b.y>=group.y&&b.x+b.width<=group.x+group.width+.1&&b.y+b.height<=group.y+group.height+.1);
        assert.equal(b.x+b.width,group.x+group.width,'Time-system details share their right alignment axis');
      }
      for(const micro of report.microLabels){assert.ok(micro.font.startsWith('Geist'));assert.equal(micro.weight,'500');assert.ok(Math.abs(micro.tracking-.13)<.0001);}
      assert.equal(report.chevrons.length,2);
      for(const chevron of report.chevrons){assert.equal(chevron.rect.width,18);assert.equal(chevron.rect.height,18);assert.equal(chevron.color,inks.tertiary);}
      assert.ok(Math.abs(parseFloat(report.activeBackground.split(',').at(-1))-.05)<=.002,'Active segment uses the restrained 5% brightness layer');
      assert.equal(report.canvas,report.paints['--canvas-base']);assert.equal(report.canvas,'rgb(241, 239, 234)');
      assert.ok(report.wordmarkMask.includes('mygame-plus.png'),'Keep the original wordmark silhouette');
      assert.equal(report.dna.cutPaths.length,2,'Retain exactly two structural cutouts');
      assert.notEqual(report.dna.cutPaths[0],report.dna.cutPaths[1]);
      assert.equal(report.dna.version,'MG-DNA-1');
      assert.equal(report.dna.bridge.width,32);assert.equal(report.dna.bridge.height,12);
      assert.equal(report.dna.bridge.x,report.geometry['.pass'].x+348);
      assert.equal(report.dna.spine.x,report.geometry['.pass'].x+16);
      assert.ok(report.paperMaterial.mask.includes('data:image/svg+xml'),'One shared DNA mask must cut paper and printed content');
      assert.ok(report.paperMaterial.mask.includes('M20'),'Silhouette comes from the immutable master outline');
      assert.equal(report.dna.join.y,report.perforation.y);
      for (const item of report.navigation) {
        assert.ok(Math.abs(item.rect.width-report.navigation[0].rect.width)<.02);
        for (const key of ['icon','cn','en']) assert.equal(item[key].y,report.navigation[0][key].y);
        assert.equal(item.cnSize,'22px'); assert.equal(item.enSize,'10px');
        assert.equal(item.icon.width,20); assert.equal(item.icon.height,20);
        assert.ok(!item.overflow,'All navigation labels must fit inside their segment');
      }
      assert.ok(report.geometry['.schedule'].y + report.geometry['.schedule'].height + 24 <= report.geometry['.dock'].y);
      await page.screenshot({ path: path.join(output, names[i]), type:'png', fullPage:false, animations:'disabled' });
      const meta = await sharp(path.join(output, names[i])).metadata();
      const decoded = await sharp(path.join(output, names[i]), { failOn:'warning' }).raw().toBuffer();
      const stat = await fs.stat(path.join(output, names[i]));
      assert.equal(meta.width,1080); assert.equal(meta.height,1440); assert.equal(meta.format,'png');
      assert.ok(decoded.length > 0 && stat.size > 0);
      const {data:corners,info:cornerInfo}=await sharp(path.join(output,names[i])).removeAlpha().raw().toBuffer({resolveWithObject:true});
      for(const [x,y] of [[0,0],[1079,0],[0,1439],[1079,1439]]) {
        const offset=(y*1080+x)*cornerInfo.channels;
        assert.deepEqual([...corners.subarray(offset,offset+3)],[241,239,234],'No black borders');
      }
      report.file = { name:names[i], width:meta.width, height:meta.height, bytes:stat.size, decode:'passed' };
      const withoutAnnotation = '/tmp/mygame-v2.4-'+city+'-without-note.png';
      const annotationOffStyle = await page.addStyleTag({content:'.event-annotation{visibility:hidden!important}'});
      const annotationOffGeometry = await page.evaluate(selectors=>Object.fromEntries(selectors.map(selector=>{const b=document.querySelector(selector).getBoundingClientRect();return [selector,{x:b.x,y:b.y,width:b.width,height:b.height}];})),Object.keys(report.geometry));
      assert.deepEqual(annotationOffGeometry,report.geometry,'Removing the signature must leave all functional layout unchanged');
      await page.screenshot({path:withoutAnnotation,type:'png',fullPage:false,animations:'disabled'});
      await annotationOffStyle.evaluate(element=>element.remove());
      const canonicalPixels=await sharp(path.join(output,names[i])).removeAlpha().raw().toBuffer();
      const withoutPixels=await sharp(withoutAnnotation).removeAlpha().raw().toBuffer();
      const note=report.geometry['.event-annotation'];let notePixels=0,outsideNoteDifferences=0;
      for(let y=0;y<1440;y++)for(let x=0;x<1080;x++){
        const offset=(y*1080+x)*3;
        if(canonicalPixels[offset]!==withoutPixels[offset]||canonicalPixels[offset+1]!==withoutPixels[offset+1]||canonicalPixels[offset+2]!==withoutPixels[offset+2]){
          notePixels++;
          if(x<note.x-3||x>note.x+note.width+3||y<note.y-3||y>note.y+note.height+3)outsideNoteDifferences++;
        }
      }
      assert.ok(notePixels>0,'The annotation must actually render');assert.equal(outsideNoteDifferences,0,'Only the single annotation may change pixels');
      let baselineGeometryMatch=null;
      if(process.env.PROMO_BASELINE_DIR){
        const baseline=JSON.parse(await fs.readFile(path.join(process.env.PROMO_BASELINE_DIR,'validation.json'),'utf8')).reports[i];
        for(const [selector,rect] of Object.entries(report.geometry))if(!['.brand h1','.app-mark','.wordmark','.dock','.team-preference'].includes(selector))assert.deepEqual(rect,baseline.geometry[selector],'Refinement must preserve every content section and ticket landmark');
        assert.deepEqual(report.content,baseline.content,'All approved copy, event information and location logic stay unchanged');
        for(const [selector,type] of Object.entries(report.typography))for(const key of ['size','weight','line','tracking'])if(!(selector==='.brand h1'&&key==='weight')&&!(selector==='.team-abbr'&&key==='tracking'))assert.equal(type[key],baseline.typography[selector][key],'Only the approved Chinese brand weight may change among these font metrics');
        const preference=report.geometry['.team-preference'],oldPreference=baseline.geometry['.team-preference'];for(const axis of ['x','y','height'])assert.equal(preference[axis],oldPreference[axis]);assert.ok(Math.abs(preference.width-oldPreference.width)<1,'Identity font refinement may only change the selector width by a subpixel');
        baselineGeometryMatch=true;
      }
      report.annotationReview={withoutAnnotation,notePixels,outsideNoteDifferences};
      report.baselineGeometryMatch=baselineGeometryMatch;
      const withoutSecurity='/tmp/mygame-v2.4-'+city+'-without-security.png';
      const securityOffStyle=await page.addStyleTag({content:'.pass-security::before,.pass-security::after{background:transparent!important}'});
      await page.screenshot({path:withoutSecurity,type:'png',animations:'disabled'});
      await securityOffStyle.evaluate(element=>element.remove());
      const unprintedPixels=await sharp(withoutSecurity).removeAlpha().raw().toBuffer();
      const protectedRects=await page.evaluate(()=>[...document.querySelectorAll('.pass-label,.date,.weekday,.game-day,.event-annotation,.team-tint,.versus,.tipoff,.time-caption,.venue,.collection-stack,.collection-progress,.serial')].map(element=>{const b=element.getBoundingClientRect();return{x:b.x,y:b.y,right:b.right,bottom:b.bottom};}));
      let printPixels=0,protectedDifferences=0,maxChannelDelta=0;
      for(let y=0;y<1440;y++)for(let x=0;x<1080;x++){
        const k=(y*1080+x)*3,delta=Math.max(...[0,1,2].map(channel=>Math.abs(canonicalPixels[k+channel]-unprintedPixels[k+channel])));
        if(delta){printPixels++;maxChannelDelta=Math.max(maxChannelDelta,delta);if(protectedRects.some(r=>x>=r.x&&x<r.right&&y>=r.y&&y<r.bottom))protectedDifferences++;}
      }
      assert.ok(printPixels>0,'Security printing must render in paper whitespace');
      assert.ok(maxChannelDelta<=10,'Security printing must stay below 4% channel contrast');
      assert.equal(protectedDifferences,0,'Security printing must not cross any core information frame');
      report.securityReview={printPixels,maxChannelDelta,protectedDifferences,withoutSecurity};
      const thumbnail = '/tmp/mygame-v2.4-'+city+'-30.png';
      await sharp(path.join(output,names[i])).resize(324,432).png().toFile(thumbnail);
      const greyscale='/tmp/mygame-v2.4-'+city+'-greyscale.png';
      const lowSaturation='/tmp/mygame-v2.4-'+city+'-saturation-10.png';
      await sharp(path.join(output,names[i])).greyscale().png().toFile(greyscale);
      await sharp(path.join(output,names[i])).modulate({saturation:.1}).png().toFile(lowSaturation);
      for(const review of [greyscale,lowSaturation])await sharp(review).resize(324,432).png().toFile(review.replace('.png','-30.png'));
      const blur = '/tmp/mygame-v2.4-'+city+'-blur.png';
      const blurStyle = await page.addStyleTag({content:'main{filter:blur(5px)}'});
      await page.screenshot({path:blur,type:'png',fullPage:false,animations:'disabled'});
      await sharp(blur).resize(324,432).png().toFile(blur.replace('.png','-30.png'));
      await blurStyle.evaluate(element=>element.remove());
      const borderless = '/tmp/mygame-v2.4-'+city+'-borderless.png';
      const borderlessStyle = await page.addStyleTag({content:'*,*::before,*::after{border-color:transparent!important;outline:none!important}.divider,.perforation{visibility:hidden!important}'});
      const borderlessGeometry = await page.evaluate(selectors=>Object.fromEntries(selectors.map(selector=>{const b=document.querySelector(selector).getBoundingClientRect();return [selector,{x:b.x,y:b.y,width:b.width,height:b.height}];})),Object.keys(report.geometry));
      assert.deepEqual(borderlessGeometry,report.geometry,'Layout must stand without drawn borders');
      const dividersSuppressed = await page.evaluate(()=>[...document.querySelectorAll('.divider,.perforation')].every(element=>getComputedStyle(element).visibility==='hidden'));
      assert.ok(dividersSuppressed,'Border-Off must also suppress drawn divider and perforation rules');
      await page.screenshot({path:borderless,type:'png',fullPage:false,animations:'disabled'});
      await sharp(borderless).resize(324,432).png().toFile(borderless.replace('.png','-30.png'));
      await borderlessStyle.evaluate(element=>element.remove());
      report.review={thumbnail,greyscale,lowSaturation,blur,blurRadius:5,borderless,borderlessGeometryStable:true,dividersSuppressed};
      const materialOnly='/tmp/mygame-v2.4-'+city+'-material-only.png';
      const paperStyle=await page.addStyleTag({content:'.pass-main>*:not(.pass-security),.stub>.collection-stack,.stub>.collection-progress,.stub>.event-annotation,.stub>.serial,.pass-security{visibility:hidden!important}'});
      await page.screenshot({path:materialOnly,type:'png',animations:'disabled'});
      await paperStyle.evaluate(element=>element.remove());
      const materialPixels=await sharp(materialOnly).removeAlpha().raw().toBuffer();
      const luminance=(x,y)=>{const k=(Math.round(y)*1080+Math.round(x))*3;return (.2126*materialPixels[k]+.7152*materialPixels[k+1]+.0722*materialPixels[k+2])/255;};
      const p=report.geometry['.pass'],samples=[];
      for(let y=24;y<=448;y+=16)for(let x=32;x<=p.width-32;x+=16)samples.push(luminance(p.x+x,p.y+y));
      const curvature=Math.max(...samples)-Math.min(...samples),center=luminance(p.x+p.width/2,p.y+240),stub=luminance(p.x+p.width/2,p.y+534),canvas=luminance(8,8);
      assert.ok(curvature<=.03,'Unprinted main paper curvature stays within 3% encoded luminance');
      assert.ok(center>canvas+.02&&center<canvas+.06,'Clean ivory remains distinct from the matte canvas without a spotlight');
      assert.ok(center-stub>=.01&&center-stub<=.03,'Stub stays within the 1–3% archival-paper material difference');
      report.materialReview={materialOnly,curvature,center,stub,canvas,stubDifference:center-stub};
      report.enclosureReview=await reviewMobileEnclosure({page,sharp,report,canonicalPixels,city,baselineDirectory:process.env.PROMO_BASELINE_DIR});
      reports.push(report);
    }
  } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
  assert.deepEqual(reports[0].geometry, reports[1].geometry, 'All shared landmarks must match exactly');
  assert.deepEqual(reports[0].surfaces, reports[1].surfaces, 'Material parameters must match exactly');
  const buffers = await Promise.all(names.map(name => sharp(path.join(output,name)).removeAlpha().raw().toBuffer()));
  const states = reports[0].dynamic.map((b,i) => {
    const other = reports[1].dynamic[i];
    return { x:Math.floor(Math.min(b.x,other.x)-3), y:Math.floor(Math.min(b.y,other.y)-3), right:Math.ceil(Math.max(b.x+b.width,other.x+other.width)+3), bottom:Math.ceil(Math.max(b.y+b.height,other.y+other.height)+3) };
  });
  let differingPixels = 0, staticDifferences = 0;
  for (let y=0; y<1440; y++) for (let x=0; x<1080; x++) {
    const i=(y*1080+x)*3;
    if (buffers[0][i]!==buffers[1][i] || buffers[0][i+1]!==buffers[1][i+1] || buffers[0][i+2]!==buffers[1][i+2]) {
      differingPixels++;
      if (!states.some(b=>x>=b.x && x<=b.right && y>=b.y && y<=b.bottom)) staticDifferences++;
    }
  }
  assert.equal(staticDifferences, 0, 'Only slogan, city state, GMT and time content may differ');
  const dock = { left:76, top:1344, width:928, height:68 };
  const docks = await Promise.all(names.map(name => sharp(path.join(output,name)).extract(dock).raw().toBuffer()));
  assert.ok(docks[0].equals(docks[1]), 'Dock pixels must match exactly');
  const overlay = '/tmp/mygame-v2.4-overlay.png';
  const overlayPixels=Buffer.alloc(buffers[0].length);
  for(let i=0;i<overlayPixels.length;i++)overlayPixels[i]=Math.round((buffers[0][i]+buffers[1][i])/2);
  await sharp(overlayPixels,{raw:{width:1080,height:1440,channels:3}}).png().toFile(overlay);
  await sharp(overlay).resize(324,432).png().toFile(overlay.replace('.png','-30.png'));
  const result = { version:'MyGame+ V2.9 — Personal Season Collection System', reports, differingPixels, staticDifferences, dockIdentical:true,overlay,overlayOpacity:.5 };
  await fs.writeFile('/tmp/mygame-v2.9-promo.json', JSON.stringify(result,null,2));
  await fs.writeFile('/tmp/mygame-v2.4-validation.json', JSON.stringify(result,null,2));
  await fs.writeFile('/tmp/mygame-refine-validation.json', JSON.stringify(result,null,2));
  console.log(JSON.stringify({ files:reports.map(report=>report.file), sharedGeometry:'identical', staticDifferences, dockIdentical:true, fonts:'Geist, MyGame Timing, MyGame Identity and Event Annotation loaded', eventAnnotations:reports.map(report=>({count:report.annotation.count,changedPixels:report.annotationReview.notePixels,outsideChanges:report.annotationReview.outsideNoteDifferences,layoutMatchesV22:report.baselineGeometryMatch})), collection:reports[0].collection.map(row=>row.text), security:reports.map(report=>report.securityReview), material:reports.map(report=>report.materialReview), enclosure:reports.map(r=>({geometry:r.enclosureReview.geometry['.mobile-pass-enclosure'],coverage:r.enclosureReview.rimCoverage,paperDifferences:r.enclosureReview.paperDifferences,phases:r.enclosureReview.phases})), radius:reports[0].radius },null,2));
}

main().catch(error=>{ console.error(error); process.exitCode=1; });
