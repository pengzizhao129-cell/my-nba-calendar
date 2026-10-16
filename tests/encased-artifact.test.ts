import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {readFile} from 'node:fs/promises';
import {PassShareCard} from '../src/components/PassShareCard';
import {createPersonalPass} from '../src/lib/personalPass';
import {DEMO_NOW,mockGames} from '../src/data/mockGames';

test('Encased share composition retains one complete functional Pass across the lifecycle',()=>{
 for(const instant of ['2026-10-01T00:00:00Z',DEMO_NOW,'2026-10-25T05:00:00Z']){
  const pass=createPersonalPass({passId:'0147',teamCode:'HOU',game:mockGames[0],games:mockGames,city:'东京',timezone:'Asia/Tokyo',now:new Date(instant)});
  const html=renderToStaticMarkup(createElement(PassShareCard,{pass}));
  assert.equal((html.match(/data-dna="MG-DNA-1"/g)??[]).length,1);
  assert.ok(html.includes('data-dna="bridge"'));assert.ok(html.includes('data-dna="spine"'));
  assert.ok(html.includes('PASS</span> 0147'));assert.ok(html.includes('GAME</span> 01 / 82'));assert.ok(html.includes('SEASON</span> 26–27'));
  assert.ok(html.includes(`data-pass-status="${pass.status.phase}"`));
  assert.equal((html.match(/class="emotion-mark"/g)??[]).length,1);
  assert.ok(html.includes('encased-ticket-slot'));assert.ok(html.includes('data-enclosure-team="HOU"'));
  assert.doesNotMatch(html,/SCHEDULE|PROFILE|GEM MINT|CLAIM|rarity/);
 }
});
test('Artifact reuses the approved brand signature asset without redrawing it',async()=>{
 assert.ok((await readFile('public/brand/mygame-plus.png')).equals(await readFile('design/promo/wordmark.png')));
});
