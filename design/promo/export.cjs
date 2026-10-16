const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const http = require('node:http');
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
  for (const asset of ['wordmark.png','paper-material.png']) {
    const stat=await fs.stat(path.join(directory,asset));
    assert.ok(stat.size>0, asset+' must exist');
  }
}

async function main() {
  await prepareAssets();
  const routes = new Map([
    ['/promo.html', [path.join(directory,'promo.html'),'text/html; charset=utf-8']],
    ['/wordmark.png', [path.join(directory,'wordmark.png'),'image/png']],
    ['/paper-material.png', [path.join(directory,'paper-material.png'),'image/png']],
    ['/GeistSans.woff2', [path.join(repository,'src/app/fonts/GeistSans.woff2'),'font/woff2']],
    ['/system-island.css', [path.join(repository,'src/styles/system-island.css'),'text/css']],
  ]);
  const server = http.createServer(async (request,response) => {
    const route = routes.get(new URL(request.url,'http://127.0.0.1').pathname);
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
    page.on('pageerror', error => { throw error; });
    for (const [i, city] of ['tokyo', 'london'].entries()) {
      await page.goto(baseURL + '/promo.html?city=' + city, { waitUntil: 'load' });
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const report = await page.evaluate(() => {
        const selectors = ['.top-label', '.brand', '.brand h1', '.app-mark', '.wordmark', '.subtitle', '.slogan', '.beta', '.city-status', '.identity', '.identity-label', '.local-label', '.auto-state', '.team-preference', '.city-control', '.pass', '.week', '.schedule', '.dock'];
        const rect = element => { const b = element.getBoundingClientRect(); return { x:b.x, y:b.y, width:b.width, height:b.height }; };
        const styles = selector => { const s = getComputedStyle(document.querySelector(selector)); return { radius:s.borderRadius, border:s.borderTopWidth + ' ' + s.borderTopColor, background:s.backgroundColor, backgroundImage:s.backgroundImage, shadow:s.boxShadow, filter:s.filter, blur:s.backdropFilter, font:s.fontFamily }; };
        const paper=getComputedStyle(document.querySelector('.pass'),'::before');
        const overflow = [...document.querySelectorAll('[data-fit]')].filter(element => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1).map(element => element.className);
        return {
          geometry: Object.fromEntries(selectors.map(selector => [selector, rect(document.querySelector(selector))])),
          dynamic: [...document.querySelectorAll('[data-state]')].map(rect),
          radius: Object.fromEntries(['.team-tint','.beta','.pass','.dock'].map(selector => [selector, styles(selector).radius])),
          surfaces: Object.fromEntries(['.beta','.pass','.dock'].map(selector => [selector, styles(selector)])),
          fontsLoaded: document.fonts.check('530 100px Geist'),
          scrollWidth:document.documentElement.scrollWidth, scrollHeight:document.documentElement.scrollHeight,
          overflow,
          texts: [...document.querySelectorAll('[data-state]')].map(element => element.textContent.trim()),
          navigation: [...document.querySelectorAll('.system-island-item')].map(element=>({rect:rect(element),icon:rect(element.querySelector('svg')),cn:rect(element.querySelector('.island-cn')),en:rect(element.querySelector('.island-en')),cnSize:getComputedStyle(element.querySelector('.island-cn')).fontSize,enSize:getComputedStyle(element.querySelector('.island-en')).fontSize,overflow:element.scrollWidth>element.clientWidth+1||element.scrollHeight>element.clientHeight+1})),
          activeBackground:getComputedStyle(document.querySelector('.system-island-item[aria-current]')).backgroundColor,
          canvas:getComputedStyle(document.body).backgroundColor,
          wordmarkMask:getComputedStyle(document.querySelector('.wordmark')).maskImage,
          paperMaterial:{background:paper.backgroundImage,mask:paper.maskImage,composition:paper.maskComposite,edge:paper.boxShadow},
          notches:[...document.querySelectorAll('.notch')].map(rect),
          perforation:rect(document.querySelector('.perforation')),
          content:{slogan:document.querySelector('.slogan').textContent,cityState:document.querySelector('.city-status').textContent,auto:document.querySelector('.auto-state').textContent,serial:document.querySelector('.serial').textContent,time:document.querySelector('#tipoff').textContent,first:document.querySelector('#time-one').textContent,second:document.querySelector('#time-two').textContent},
          markLetters:{m:rect(document.querySelector('.mark-m')),g:rect(document.querySelector('.mark-g')),mLetter:document.querySelector('.mark-m').dataset.letter,gLetter:document.querySelector('.mark-g').dataset.letter,paths:document.querySelectorAll('.mark-glyph path').length,textNodes:document.querySelectorAll('.mark-glyph text').length},
          typography:Object.fromEntries(['.brand h1','.slogan','.subtitle','.nba','.beta-label','.auto-state','.team-abbr','.tipoff'].map(selector=>{const s=getComputedStyle(document.querySelector(selector));return [selector,{size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,tracking:s.letterSpacing,color:s.color}];})),
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
      assert.ok(report.fontsLoaded, 'Geist must load');
      assert.deepEqual(report.overflow, [], 'Text must fit');
      assert.equal(report.radius['.team-tint'], '12px');
      assert.equal(report.radius['.beta'], '16px');
      assert.equal(report.radius['.pass'], '20px');
      assert.equal(report.radius['.dock'], '32px');
      assert.equal(report.geometry['.beta'].width,728);
      assert.equal(report.geometry['.beta'].height,32);
      assert.deepEqual(report.geometry['.app-mark'],{x:176,y:68,width:56,height:56});
      assert.deepEqual(report.geometry['.pass'],{x:176,y:464,width:728,height:576});
      assert.deepEqual(report.geometry['.week'],{x:176,y:1072,width:728,height:224});
      assert.deepEqual(report.geometry['.dock'],{x:76,y:1334,width:928,height:80});
      assert.ok(report.geometry['.brand'].y+report.geometry['.brand'].height+24<=report.geometry['.slogan'].y);
      assert.ok(report.geometry['.slogan'].y+report.geometry['.slogan'].height+32<=report.geometry['.subtitle'].y);
      assert.ok(report.geometry['.subtitle'].y+report.geometry['.subtitle'].height+4<=report.geometry['.beta'].y);
      assert.ok(report.geometry['.beta'].y+report.geometry['.beta'].height+12<=report.geometry['.city-status'].y);
      assert.ok(report.geometry['.city-status'].y+report.geometry['.city-status'].height+16<=report.geometry['.identity'].y);
      assert.deepEqual(report.litContent,[],'Only the event pass gets object lighting in content');
      assert.ok(!report.visibleURLs,'No visible website URLs');
      assert.equal(report.content.slogan,city==='tokyo'?'无论在哪，主队准时见。':'换个城市，不换主队。');
      assert.equal(report.content.cityState,city==='tokyo'?'当前城市 · TOKYO':'城市切换 · TOKYO → LONDON');
      assert.equal(report.content.auto,'AUTO CONVERTED');
      assert.equal(report.content.serial,'MG+ / HOU–LAL / 01');
      assert.equal(report.content.time,city==='tokyo'?'10:00':'01:00');
      assert.equal(report.content.first,report.content.time);
      assert.equal(report.content.second,city==='tokyo'?'11:00':'02:00');
      assert.equal(report.markLetters.mLetter,'M');assert.equal(report.markLetters.gLetter,'G+');
      assert.equal(report.markLetters.paths,3);assert.equal(report.markLetters.textNodes,0,'Brand seal must use custom contours rather than default font text');
      assert.ok(report.markLetters.m.x<report.markLetters.g.x&&report.markLetters.m.y+report.markLetters.m.height<report.markLetters.g.y,'M upper-left, G+ lower-right with negative space');
      assert.ok(report.brandSeal.backgroundImage.includes('linear-gradient')&&report.brandSeal.shadow!=='none','Brand seal has restrained edge light and contact depth');
      assert.deepEqual(report.typography['.beta-label'],report.typography['.auto-state'],'System microcopy uses one type language');
      assert.ok(parseFloat(report.typography['.brand h1'].size)<parseFloat(report.typography['.team-abbr'].size));
      assert.ok(parseFloat(report.typography['.team-abbr'].size)<parseFloat(report.typography['.tipoff'].size));
      for(const border of report.summaryBorders) assert.deepEqual(border,{top:'0px',bottom:'0px'},'Premium summary relies on spacing rather than table rules');
      assert.equal(report.chevrons.length,2);
      for(const chevron of report.chevrons){assert.equal(chevron.rect.width,18);assert.equal(chevron.rect.height,18);assert.equal(chevron.color,'rgb(129, 122, 109)');}
      assert.equal(report.activeBackground,'rgba(255, 255, 255, 0.12)');
      assert.equal(report.canvas,'rgb(244, 242, 238)');
      assert.ok(report.wordmarkMask.includes('wordmark.png'),'Keep the original wordmark silhouette');
      assert.equal(report.notches.length,2,'Retain exactly two ticket cutouts');
      assert.ok(report.paperMaterial.composition.split(',').every(value=>value.trim()==='intersect'));
      assert.ok(report.paperMaterial.mask.includes('radial-gradient'),'Paper must be genuinely cut at the sides');
      for(const notch of report.notches) {assert.equal(notch.width,20);assert.equal(notch.height,20);assert.equal(notch.y+notch.height/2,report.perforation.y);}
      for (const item of report.navigation) {
        assert.ok(Math.abs(item.rect.width-report.navigation[0].rect.width)<.02);
        for (const key of ['icon','cn','en']) assert.equal(item[key].y,report.navigation[0][key].y);
        assert.equal(item.cnSize,'16px'); assert.equal(item.enSize,'10px');
        assert.equal(item.icon.width,22); assert.equal(item.icon.height,22);
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
        assert.deepEqual([...corners.subarray(offset,offset+3)],[244,242,238],'No black borders');
      }
      report.file = { name:names[i], width:meta.width, height:meta.height, bytes:stat.size, decode:'passed' };
      const thumbnail = '/tmp/mygame-promo-v1.6-'+city+'-30.png';
      await sharp(path.join(output,names[i])).resize(324,432).png().toFile(thumbnail);
      const borderless = '/tmp/mygame-promo-v1.6-'+city+'-borderless.png';
      const borderlessStyle = await page.addStyleTag({content:'*,*::before,*::after{border-color:transparent!important;outline:none!important}'});
      const borderlessGeometry = await page.evaluate(selectors=>Object.fromEntries(selectors.map(selector=>{const b=document.querySelector(selector).getBoundingClientRect();return [selector,{x:b.x,y:b.y,width:b.width,height:b.height}];})),Object.keys(report.geometry));
      assert.deepEqual(borderlessGeometry,report.geometry,'Layout must stand without drawn borders');
      await page.screenshot({path:borderless,type:'png',fullPage:false,animations:'disabled'});
      await sharp(borderless).resize(324,432).png().toFile(borderless.replace('.png','-30.png'));
      await borderlessStyle.evaluate(element=>element.remove());
      report.review={thumbnail,borderless,borderlessGeometryStable:true};
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
  const dock = { left:76, top:1334, width:928, height:80 };
  const docks = await Promise.all(names.map(name => sharp(path.join(output,name)).extract(dock).raw().toBuffer()));
  assert.ok(docks[0].equals(docks[1]), 'Dock pixels must match exactly');
  const result = { version:'MyGame+ Promo V1.6 — Final Art Direction Pass', reports, differingPixels, staticDifferences, dockIdentical:true };
  await fs.writeFile('/tmp/mygame-promo-v1.6-validation.json', JSON.stringify(result,null,2));
  console.log(JSON.stringify({ files:reports.map(report=>report.file), sharedGeometry:'identical', staticDifferences, dockIdentical:true, fonts:'Geist loaded', radius:reports[0].radius },null,2));
}

main().catch(error=>{ console.error(error); process.exitCode=1; });
