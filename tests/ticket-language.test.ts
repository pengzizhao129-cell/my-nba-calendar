import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createPersonalPass} from '../src/lib/personalPass';
import {mockGames,DEMO_NOW} from '../src/data/mockGames';
import {ticketIssueNumber} from '../src/lib/ticketIdentity';
import {GamePass} from '../src/components/GamePass';
import {PASS_DNA} from '../src/lib/passDNA';

const pass=(timezone='Asia/Tokyo',game=mockGames[0],passId='0147')=>createPersonalPass({passId,teamCode:'HOU',game,games:mockGames,city:timezone==='Asia/Tokyo'?'东京':'伦敦',timezone,now:new Date(DEMO_NOW)});

test('The edition number belongs to user/team/game/season, never the city or lifecycle',()=>{
 const tokyo=pass(),london=pass('Europe/London'),number=ticketIssueNumber(tokyo);
 assert.match(number!,/^\d{6}$/);assert.equal(ticketIssueNumber(london),number);
 assert.equal(ticketIssueNumber({...tokyo,status:{...tokyo.status,phase:'archived'}}),number);
 assert.notEqual(ticketIssueNumber(pass('Asia/Tokyo',mockGames[1])),number);
 assert.notEqual(ticketIssueNumber(pass('Asia/Tokyo',mockGames[0],'0843')),number);
 assert.equal(ticketIssueNumber({...tokyo,user:{passId:null}}),null);
 const preview=renderToStaticMarkup(createElement(GamePass,{pass:{...tokyo,user:{passId:null}}}));
 assert.doesNotMatch(preview,/>ISSUED</,'A preview cannot claim an unissued identity');
});

test('82 separate ticks identify an ordinal, not completion progress; every state preserves the same construction',()=>{
 const source=pass();
 for(const phase of ['upcoming','next_up','game_day','archived'] as const){
  const html=renderToStaticMarkup(createElement(GamePass,{pass:{...source,status:{...source.status,phase}}}));
  assert.equal((html.match(/data-season-tick=/g)??[]).length,82);
  assert.equal((html.match(/data-current="true"/g)??[]).length,1);
  assert.ok(html.includes('data-season-tick="1" data-current="true"'));
  assert.ok(html.includes(`data-dna="${PASS_DNA.version}"`));
  assert.ok(html.includes('class="time-route"')&&html.includes('TOKYO')&&html.includes('ISSUE'));
  assert.doesNotMatch(html,/mobile-pass-enclosure|\bGATE\b|\bSEAT\b|\bFLIGHT\b|barcode/i);
 }
 assert.equal(PASS_DNA.main.height,PASS_DNA.height);assert.equal(PASS_DNA.stub.height,PASS_DNA.height);
 assert.ok(PASS_DNA.main.width<PASS_DNA.stub.x);assert.ok(PASS_DNA.perforation.height>PASS_DNA.height*.9);
 const unknown=renderToStaticMarkup(createElement(GamePass,{pass:{...source,game:{...source.game,gameNumber:null}}}));
 assert.equal((unknown.match(/data-current="true"/g)??[]).length,0,'An unknown ordinal never highlights a fabricated season position');
});

test('Watched-from and final scores require an explicit viewing record and an archived game',()=>{
 const source=pass(),commemoration={score:{team:112,opponent:108},watchedFrom:'Tokyo'};
 const before=renderToStaticMarkup(createElement(GamePass,{pass:source,commemoration}));
 assert.doesNotMatch(before,/WATCHED FROM|112 — 108/);
 const archived={...source,status:{...source.status,phase:'archived' as const}};
 const untouched=renderToStaticMarkup(createElement(GamePass,{pass:archived}));assert.doesNotMatch(untouched,/WATCHED FROM|112 — 108/);
 const recorded=renderToStaticMarkup(createElement(GamePass,{pass:archived,commemoration}));
 assert.ok(recorded.includes('WATCHED FROM TOKYO'));assert.ok(recorded.includes('FINAL · 112 — 108'));
 assert.equal((recorded.match(/class="emotion-mark"/g)??[]).length,1);
});
