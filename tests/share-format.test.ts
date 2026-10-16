import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PassShareCard} from '../src/components/PassShareCard';
import {GamePass} from '../src/components/GamePass';
import {createPersonalPass} from '../src/lib/personalPass';
import {passShareContext} from '../src/lib/passShare';
import {mockGames,DEMO_NOW} from '../src/data/mockGames';
import {PASS_DNA} from '../src/lib/passDNA';

const input={passId:'0147',teamCode:'HOU',game:mockGames[0],games:mockGames,city:'东京',timezone:'Asia/Tokyo',now:new Date(DEMO_NOW)};

test('Feed and Story have explicit export dimensions and contain the exact same issued Pass snapshot',()=>{
 const pass=createPersonalPass(input),ticket=renderToStaticMarkup(createElement(GamePass,{pass}));
 for(const [format,height] of [['feed',1440],['story',1920]] as const){
  const html=renderToStaticMarkup(createElement(PassShareCard,{pass,format})),figure=html.slice(0,html.indexOf('>')+1);
  assert.ok(figure.includes(`data-share-format="${format}"`));
  assert.ok(figure.includes('data-share-width="1080"')&&figure.includes(`data-share-height="${height}"`));
  assert.ok(figure.includes(`style="width:1080px;height:${height}px"`));
  assert.ok(figure.includes('data-share-pass-id="0147"')&&figure.includes(`data-share-game-id="${pass.game.id}"`));
  assert.ok(figure.includes('data-share-city="TOKYO"')&&figure.includes('data-share-timezone="Asia/Tokyo"'));
  assert.ok(html.includes(ticket),'Sharing embeds the same complete GamePass, without changing its drawing or data');
  assert.equal((html.match(new RegExp(`data-dna="${PASS_DNA.version}"`,'g'))??[]).length,1);
  assert.doesNotMatch(html,/<(?:nav|button|select|input|a)\b|WATCHED FROM|\bLIVE\b|\bFINAL\b|DOWNLOAD|QR CODE|NEXT 7 DAYS|PROFILE/i);
 }
 const defaultCard=renderToStaticMarkup(createElement(PassShareCard,{pass}));
 assert.ok(defaultCard.includes('data-share-format="feed"'));
});

test('Artifact context uses real city identity even when two cities share a timezone',()=>{
 const tokyo=createPersonalPass(input),kobe=createPersonalPass({...input,city:'神户'});
 for(const format of ['feed','story'] as const){
  const tokyoHtml=renderToStaticMarkup(createElement(PassShareCard,{pass:tokyo,format}));
  const kobeHtml=renderToStaticMarkup(createElement(PassShareCard,{pass:kobe,format}));
  assert.ok(tokyoHtml.includes('TOKYO · JP'));
  assert.ok(kobeHtml.includes('KOBE · JP'));
  assert.ok(kobeHtml.includes('LOCAL 10:00 / JST / GMT+9'));
  assert.ok(kobeHtml.includes('data-share-timezone="Asia/Tokyo"'));
  for(const key of ['user','team','game','season','status'] as const)assert.deepEqual(tokyo[key],kobe[key]);
  assert.doesNotMatch(kobeHtml,/WATCHED FROM/);
 }
});

test('Ordinary issued share captions preserve lifecycle validation without adding a new future tag',()=>{
 const pass=createPersonalPass(input),context=passShareContext(pass);
 assert.equal(context.moment,pass.status.phase);
 assert.equal(context.label,pass.status.label,'Legacy lifecycle labels remain available to existing consumers');
 assert.equal(context.artifactLabel,'ISSUED');
 const html=renderToStaticMarkup(createElement(PassShareCard,{pass}));
 assert.ok(html.includes('class="share-moment">ISSUED</span>'));
 assert.ok(html.includes('SEASON 26–27')&&html.includes('00 / 82 COLLECTED'));
 assert.throws(()=>renderToStaticMarkup(createElement(PassShareCard,{pass,moment:'collected',format:'story'})),RangeError);
 assert.throws(()=>renderToStaticMarkup(createElement(PassShareCard,{pass:{...pass,user:{passId:null}},format:'story'})),RangeError);
});
