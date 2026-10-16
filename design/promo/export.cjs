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
        const selectors = ['.top-label', '.brand', '.wordmark', '.subtitle', '.beta', '.city-status', '.identity', '.identity-label', '.pass', '.week', '.schedule', '.dock'];
        const rect = element => { const b = element.getBoundingClientRect(); return { x:b.x, y:b.y, width:b.width, height:b.height }; };
        const styles = selector => { const s = getComputedStyle(document.querySelector(selector)); return { radius:s.borderRadius, border:s.borderTopWidth + ' ' + s.borderTopColor, background:s.backgroundColor, backgroundImage:s.backgroundImage, shadow:s.boxShadow, filter:s.filter, blur:s.backdropFilter, font:s.fontFamily }; };
        const paper=getComputedStyle(document.querySelector('.pass'),'::before');
        const overflow = [...document.querySelectorAll('[data-fit]')].filter(element => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1).map(element => element.className);
        return {
          geometry: Object.fromEntries(selectors.map(selector => [selector, rect(document.querySelector(selector))])),
          dynamic: [...document.querySelectorAll('[data-state]')].map(rect),
          radius: Object.fromEntries(['.team-tint','.beta','.pass','.dock'].map(selector => [selector, styles(selector).radius])),
          surfaces: Object.fromEntries(['.beta','.pass','.dock'].map(selector => [selector, styles(selector)])),
          fontsLoaded: document.fonts.check('530 92px Geist'),
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
      assert.equal(report.geometry['.beta'].width,672);
      assert.equal(report.geometry['.beta'].height,54);
      assert.equal(report.activeBackground,'rgba(255, 255, 255, 0.12)');
      assert.equal(report.canvas,'rgb(245, 243, 239)');
      assert.ok(report.wordmarkMask.includes('wordmark.png'),'Keep the original wordmark silhouette');
      assert.equal(report.notches.length,2,'Retain exactly two ticket cutouts');
      assert.ok(report.paperMaterial.composition.split(',').every(value=>value.trim()==='intersect'));
      assert.ok(report.paperMaterial.mask.includes('radial-gradient'),'Paper must be genuinely cut at the sides');
      for(const notch of report.notches) assert.equal(notch.y+notch.height/2,report.perforation.y);
      for (const item of report.navigation) {
        assert.ok(Math.abs(item.rect.width-report.navigation[0].rect.width)<.02);
        for (const key of ['icon','cn','en']) assert.equal(item[key].y,report.navigation[0][key].y);
        assert.equal(item.cnSize,'15px'); assert.equal(item.enSize,'10px');
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
        assert.deepEqual([...corners.subarray(offset,offset+3)],[245,243,239],'No black borders');
      }
      report.file = { name:names[i], width:meta.width, height:meta.height, bytes:stat.size, decode:'passed' };
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
  assert.equal(staticDifferences, 0, 'Only city, GMT and time content may differ');
  const dock = { left:76, top:1334, width:928, height:80 };
  const docks = await Promise.all(names.map(name => sharp(path.join(output,name)).extract(dock).raw().toBuffer()));
  assert.ok(docks[0].equals(docks[1]), 'Dock pixels must match exactly');
  const result = { version:'MyGame+ Promo V1.4 — Luxury Sports Material System', reports, differingPixels, staticDifferences, dockIdentical:true };
  await fs.writeFile('/tmp/mygame-promo-v1.4-validation.json', JSON.stringify(result,null,2));
  console.log(JSON.stringify({ files:reports.map(report=>report.file), sharedGeometry:'identical', staticDifferences, dockIdentical:true, fonts:'Geist loaded', radius:reports[0].radius },null,2));
}

main().catch(error=>{ console.error(error); process.exitCode=1; });
