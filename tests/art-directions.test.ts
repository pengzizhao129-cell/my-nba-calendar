import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {GamePass} from '../src/components/GamePass';
import {ArtTimeScale,ART_DIRECTIONS,artClockMinutes,artIssue} from '../src/components/art-directions/ArtPassPrimitives';
import {createPersonalPass} from '../src/lib/personalPass';
import {personalPassReference} from '../src/lib/ticketIdentity';
import {PASS_DNA} from '../src/lib/passDNA';
import {mockGames,DEMO_NOW} from '../src/data/mockGames';

const pass=(cityId='tokyo',passId:string|null='0147')=>createPersonalPass({passId,teamCode:'HOU',game:mockGames[0],games:mockGames,cityId,city:'',timezone:'Asia/Tokyo',now:new Date(DEMO_NOW)});
const render=(variant:typeof ART_DIRECTIONS[number],cityId='tokyo',passId:string|null='0147')=>renderToStaticMarkup(createElement(GamePass,{pass:pass(cityId,passId),variant}));

test('Three opt-in art compositions consume one real event, personal serial and season without changing their input',()=>{
 const data=pass(),before=JSON.stringify(data);
 for(const variant of ART_DIRECTIONS){
  const html=renderToStaticMarkup(createElement(GamePass,{pass:data,variant}));
  for(const attribute of ['data-game-id="hou-1"','data-team="HOU"','data-opponent="LAL"','data-pass-id="0147"','data-personal-issue="047295"','data-game-number="1"','data-season="2026-27"'])assert.ok(html.includes(attribute),`${variant}: ${attribute}`);
  assert.match(html,/TOYOTA CENTER/);assert.match(html,/2026/);assert.match(html,/OCT/);assert.match(html,/25/);assert.match(html,/MG\+ Nº/);
  assert.equal((html.match(/data-art-direction=/g)??[]).length,1);
  assert.equal(JSON.stringify(data),before,'Layout is a pure view, never another issuing system');
 }
 assert.equal(artIssue(data),personalPassReference(data)!.serial.padStart(6,'0'));
});

test('Art direction is genuinely opt-in; the existing homepage ticket retains its own DNA and geometry components',()=>{
 const baseline=renderToStaticMarkup(createElement(GamePass,{pass:pass()}));
 assert.ok(baseline.includes(`data-dna="${PASS_DNA.version}"`));
 for(const selector of ['ticket-main','ticket-stub','ticket-join','season-spine','time-route'])assert.ok(baseline.includes(selector));
 assert.doesNotMatch(baseline,/data-art-direction=/);
 for(const variant of ART_DIRECTIONS){
  const html=render(variant);
  assert.match(html,new RegExp(`data-art-direction="${variant}"`));
  assert.doesNotMatch(html,/class="ticket-main"/,'Independent compositions do not inherit the production ticket grid');
 }
});

test('Tokyo and London change real local clock geometry, never issue identity, ordinal or season',()=>{
 const tokyo=pass('tokyo'),london=pass('london');
 assert.equal(artClockMinutes(tokyo),600);assert.equal(artClockMinutes(london),60);
 assert.equal(tokyo.location.offset,'GMT+9');assert.equal(london.location.offset,'GMT');
 assert.equal(artIssue(tokyo),'047295');assert.equal(artIssue(london),'047295');
 const linearMarker=(data:ReturnType<typeof pass>)=>renderToStaticMarkup(createElement(ArtTimeScale,{pass:data})).match(/data-time-marker="true" d="([^"]+)"/)?.[1];
 assert.notEqual(linearMarker(tokyo),linearMarker(london));
 for(const variant of ART_DIRECTIONS){
  const a=render(variant,'tokyo'),b=render(variant,'london');
  assert.match(a,/data-city-id="tokyo"/);assert.match(b,/data-city-id="london"/);
  assert.match(a,/data-local-time="10:00"/);assert.match(b,/data-local-time="01:00"/);
  assert.match(a,/data-gmt="GMT\+9"/);assert.match(b,/data-gmt="GMT"/);
  const marker=(html:string)=>html.match(/<g class="instrument-local-cursor"[\s\S]*?<\/g>/)?.[0]??html.match(/data-time-marker="true" d="([^"]+)"/)?.[1];
  assert.notEqual(marker(a),marker(b),`${variant}: location updates an actual instrument marker`);
 }
});

test('All three season edges contain 82 unique independent event marks with exactly the current ordinal selected',()=>{
 for(const variant of ART_DIRECTIONS){
  const html=render(variant),marks=[...html.matchAll(/data-season-tick="(\d+)"/g)].map(match=>Number(match[1]));
  assert.deepEqual(marks,Array.from({length:82},(_,i)=>i+1));
  assert.equal((html.match(/data-current="true"/g)??[]).length,1);
  assert.match(html,/data-season-tick="1" data-current="true"/);
  assert.doesNotMatch(html,/role="progressbar"|<progress|<meter/);
 }
});

test('Preview art never invents a personal serial or claims that an unissued identity was issued',()=>{
 for(const variant of ART_DIRECTIONS){
  const html=render(variant,'tokyo',null);
  assert.match(html,/data-pass-id=""/);assert.match(html,/data-personal-issue=""/);
  assert.doesNotMatch(html,/data-issue-number="\d/);
  assert.doesNotMatch(html,/>ISSUED</);
  assert.equal(pass('tokyo',null).user.passId,null);
 }
});

test('The time instrument rejects impossible clock readings instead of drawing false coordinates',()=>{
 for(const localTime of ['24:00','10:60','-1:00','TOKYO','1:00']){
  const data=pass();
  assert.throws(()=>artClockMinutes({...data,location:{...data.location,localTime}}),RangeError);
 }
});
