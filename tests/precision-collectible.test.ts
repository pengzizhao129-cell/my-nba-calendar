import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {GamePass} from '../src/components/GamePass';
import {PRECISION_PASS_DNA,precisionClockAngle} from '../src/components/PrecisionCollectiblePass';
import {createPersonalPass,type PersonalPass} from '../src/lib/personalPass';
import {mockGames} from '../src/data/mockGames';
import {personalPassReference} from '../src/lib/ticketIdentity';

const pass=(cityId='tokyo',now='2026-10-25T00:00:00Z',passId:string|null='0147')=>createPersonalPass({passId,teamCode:'HOU',game:mockGames[0],games:mockGames,cityId,city:'',timezone:'Asia/Tokyo',now:new Date(now)});
const render=(data:PersonalPass)=>renderToStaticMarkup(createElement(GamePass,{pass:data,variant:'precision'}));

test('The formal collectible uses the existing personal issue and immutable event data, not another issuing system',()=>{
 const data=pass(),before=JSON.stringify(data),html=render(data);
 for(const value of ['data-pass-variant="precision"','data-dna="MG-P4.1"','data-game-id="hou-1"','data-team="HOU"','data-opponent="LAL"','data-pass-id="0147"','data-game-number="1"','data-season="2026-27"','data-personal-issue="047295"'])assert.ok(html.includes(value),value);
 assert.equal(personalPassReference(data)!.serial.padStart(6,'0'),'047295');
 assert.match(html,/MG\+ Nº/);assert.match(html,/TOYOTA CENTER/);assert.match(html,/26—27/);
 assert.equal(JSON.stringify(data),before,'Rendering must not mutate user, fixture, location, status or season');
 assert.doesNotMatch(html,/data-art-direction=|role="progressbar"|<progress|<meter/);
});

test('A single local-clock instrument has a real 24-hour coordinate and moves independently of the issue or print structure',()=>{
 const tokyo=render(pass('tokyo')),london=render(pass('london'));
 assert.equal(precisionClockAngle(0),135);assert.equal(precisionClockAngle(600),247.5);assert.equal(precisionClockAngle(60),146.25);assert.equal(precisionClockAngle(1440),405);
 for(const [html,city,time,gmt,minute,angle]of[[tokyo,'tokyo','10:00','GMT+9',600,247.5],[london,'london','01:00','GMT',60,146.25]]as const){
  for(const value of [`data-city-id="${city}"`,`data-local-time="${time}"`,`data-gmt="${gmt}"`,`data-clock-minutes="${minute}"`,`data-clock-angle="${angle}"`])assert.ok(html.includes(value),value);
  assert.equal((html.match(/data-time-marker=/g)??[]).length,1);
  assert.match(html,/data-personal-issue="047295"/);assert.match(html,/data-pass-id="0147"/);
  assert.ok(html.includes(`d="${PRECISION_PASS_DNA.silhouette}"`));
 }
 const marker=(html:string)=>html.match(/<g class="pc-clock-marker"[^>]*>[\s\S]*?<\/g>/)?.[0];
 assert.ok(marker(tokyo));assert.notEqual(marker(tokyo),marker(london));
});

test('All four lifecycle states retain the same silhouette, print zones, season positions and single annotation',()=>{
 const fixtures=[['2026-10-01T00:00:00Z','next_up'],['2026-10-25T00:00:00Z','game_day'],['2026-10-25T04:00:00Z','archived']]as const;
 const baseline=pass(),upcoming:PersonalPass={...baseline,status:{phase:'upcoming',label:'UPCOMING',emotionMark:'Upcoming',energy:'quiet',archivedAt:null}};
 const states=[upcoming,...fixtures.map(([now,phase])=>{const data=pass('tokyo',now);assert.equal(data.status.phase,phase);return data;})];
 for(const data of states){
  const html=render(data);assert.ok(html.includes(`d="${PRECISION_PASS_DNA.silhouette}"`));
  for(const region of['silhouette','main','stub','bridge','perforation','spine','security','timing'])assert.equal((html.match(new RegExp(`data-dna-layer="${region}"`,'g'))??[]).length,1,`${data.status.phase}: fixed ${region} region`);
  assert.equal((html.match(/data-season-tick=/g)??[]).length,82);assert.equal((html.match(/data-current="true"/g)??[]).length,1);assert.equal((html.match(/class="emotion-mark"/g)??[]).length,1);
  for(const value of['data-game-number="1"','data-personal-issue="047295"','data-pass-id="0147"'])assert.ok(html.includes(value));
 }
 assert.ok(Object.isFrozen(PRECISION_PASS_DNA));assert.ok(Object.isFrozen(PRECISION_PASS_DNA.clock));
});

test('Unissued or finished previews do not invent identity, scores or a watched location',()=>{
 const preview=render(pass('tokyo','2026-10-25T00:00:00Z',null));
 assert.match(preview,/data-lifecycle="preview"/);assert.match(preview,/data-pass-id=""/);assert.match(preview,/data-personal-issue=""/);assert.doesNotMatch(preview,/data-issue-number="\d/);assert.doesNotMatch(preview,/>ISSUED</);
 const archived=render(pass('tokyo','2026-10-25T04:00:00Z'));
 assert.match(archived,/>COLLECTED</);assert.doesNotMatch(archived,/WATCHED FROM|FINAL · \d|LIVE · \d/,'A finished mock is not proof of a result or a viewing experience');
});
