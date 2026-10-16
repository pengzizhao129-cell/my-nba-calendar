import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {GamePass} from '../src/components/GamePass';
import {createPersonalPass} from '../src/lib/personalPass';
import {mockGames,DEMO_NOW} from '../src/data/mockGames';

test('The mobile optical drawing is identical across team, location and all four lifecycle states',()=>{
 let drawing:string|undefined;
 for(const teamCode of ['HOU','LAL'])for(const timezone of ['Asia/Tokyo','Europe/London']){
  const pass=createPersonalPass({passId:'0147',teamCode,game:mockGames[0],games:mockGames,city:timezone==='Asia/Tokyo'?'东京':'伦敦',timezone,now:new Date(DEMO_NOW)});
  for(const phase of ['upcoming','next_up','game_day','archived'] as const){
   const html=renderToStaticMarkup(createElement(GamePass,{pass:{...pass,status:{...pass.status,phase}}}));
   const shell=html.match(/<svg class="mobile-pass-enclosure"[\s\S]*?<\/svg>/g)??[];
   assert.equal(shell.length,1,'One protective shell per product ticket');
   drawing??=shell[0];assert.equal(shell[0],drawing,'Variable inputs cannot redraw casing, micro cut, plus or mounting');
   assert.ok(html.includes('data-enclosure-signature="fixed-upper-right"'));
   assert.ok(html.includes('data-dna="bridge"')&&html.includes('data-dna="spine"'));
   assert.equal((html.match(/class="emotion-mark"/g)??[]).length,1);
   assert.ok(html.includes('PASS</span> 0147')&&html.includes('GAME</span> 01 / 82')&&html.includes('SEASON</span> 26–27'));
   assert.doesNotMatch(html,/GEM MINT|barcode|holographic|rarity/);
  }
 }
});

test('A parent presentation can own its shell without nesting a second enclosure around the ticket',()=>{
 const pass=createPersonalPass({passId:'0147',teamCode:'HOU',game:mockGames[0],city:'东京',timezone:'Asia/Tokyo',now:new Date(DEMO_NOW)});
 const html=renderToStaticMarkup(createElement(GamePass,{pass,enclosure:'none'}));
 assert.doesNotMatch(html,/mobile-pass-enclosure|has-mobile-enclosure/);
 assert.ok(html.includes('data-dna="MG-DNA-1"')&&html.includes('data-dna="bridge"'));
});
