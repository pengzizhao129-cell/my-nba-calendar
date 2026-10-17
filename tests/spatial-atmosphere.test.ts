import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {GamePass} from '../src/components/GamePass';
import {PRECISION_INK_WINDOW,PRECISION_PASS_DNA} from '../src/components/PrecisionCollectiblePass';
import {createPersonalPass,type PersonalPass} from '../src/lib/personalPass';
import {mockGames} from '../src/data/mockGames';

const tokens=readFileSync(new URL('../src/styles/spatial-atmosphere-tokens.css',import.meta.url),'utf8');
const printStyle=readFileSync(new URL('../src/styles/spatial-pass.css',import.meta.url),'utf8');
const token=(name:string)=>{const value=tokens.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`))?.[1].trim();assert.ok(value,`Missing semantic token --${name}`);return value;};
const rgb=(hex:string)=>{assert.match(hex,/^#[\da-f]{6}$/i);return[1,3,5].map(index=>parseInt(hex.slice(index,index+2),16));};
const luminance=(value:number[])=>value.map(channel=>channel/255).map(channel=>channel<=.04045?channel/12.92:((channel+.055)/1.055)**2.4).reduce((sum,channel,index)=>sum+channel*[.2126,.7152,.0722][index],0);
const pass=(now='2026-10-25T00:00:00Z')=>createPersonalPass({passId:'0147',teamCode:'HOU',game:mockGames[0],games:mockGames,cityId:'tokyo',city:'',timezone:'Asia/Tokyo',now:new Date(now)});

test('Spatial paint has distinct paper, neutral carbon, signal and team roles with readable knockout contrast',()=>{
 const paper=rgb(token('paper-ivory')),carbon=rgb(token('carbon-ink'));
 assert.ok((luminance(paper)+.05)/(luminance(carbon)+.05)>=7,'The fixed time instrument remains readable on carbon ink');
 assert.ok(Math.max(...carbon)-Math.min(...carbon)<=12,'Instrument ink is neutral carbon rather than a selected team color');
 for(const name of['instrument-ink','instrument-lit','instrument-on-ink','instrument-muted-on-ink','signal','signal-on-ink','shadow-contact','shadow-ambient','shadow-occlusion'])assert.doesNotMatch(token(name),/--team-/,'Material and product signals must not inherit team identity');
 assert.match(token('instrument-ink'),/--carbon-ink/);assert.match(token('instrument-on-ink'),/--paper-ivory/);
 assert.doesNotMatch(printStyle,/#(?:[\da-f]{3}){1,2}\b|rgba?\(/i,'Component material paint resolves through semantic tokens');
});

test('Fine grain and physical shadow roles have independent bounded material budgets',()=>{
 for(const name of['grain-canvas','grain-paper']){const alpha=Number(token(name));assert.ok(alpha>0&&alpha<=.025,`${name} must stay below visible texture-overlay strength`);}
 const shadows=['shadow-contact','shadow-ambient','shadow-occlusion'].map(token);assert.equal(new Set(shadows).size,3,'Contact, ambient depth and local occlusion have different physical jobs');
 assert.match(printStyle,/\.pc-stock\s*\{[^}]*--shadow-contact[^}]*--shadow-ambient/);
 assert.match(printStyle,/\.pc-perforation\s*\{[^}]*--shadow-occlusion/);
});

test('The ink material does not create a new template or move the fixed world-time and ticket structures across states',()=>{
 const baseline=pass(),upcoming:PersonalPass={...baseline,status:{phase:'upcoming',label:'UPCOMING',emotionMark:'Upcoming',energy:'quiet',archivedAt:null}};
 const states=[upcoming,pass('2026-10-01T00:00:00Z'),baseline,pass('2026-10-25T04:00:00Z')];
 const materialGeometry=[];
 for(const data of states){
  const html=renderToStaticMarkup(createElement(GamePass,{pass:data,variant:'precision'}));
  assert.equal((html.match(/data-material-layer="ink-time"/g)??[]).length,1);
  assert.equal((html.match(/data-time-marker=/g)??[]).length,1);
  assert.equal((html.match(/data-team-color-moment=/g)??[]).length,1,'The printed team rail is the sole strong identity color event');
  for(const role of['state','time-index','season-position'])assert.equal((html.match(new RegExp(`data-signal-role="${role}"`,'g'))??[]).length,1);
  const rectangle=html.match(/<rect[^>]*data-material-layer="ink-time"[^>]*>/)?.[0];assert.ok(rectangle);materialGeometry.push(Object.fromEntries(['x','y','width','height'].map(name=>[name,rectangle.match(new RegExp(` ${name}="([^"]+)"`))?.[1]])));
  assert.ok(html.includes(`d="${PRECISION_PASS_DNA.silhouette}"`));assert.match(html,/data-dna="MG-P4.1"/);assert.match(html,/data-personal-issue="047295"/);assert.equal((html.match(/data-season-tick=/g)??[]).length,82);
 }
 for(const geometry of materialGeometry)assert.deepEqual(geometry,materialGeometry[0],'State changes only paint; the material window is fixed');
 assert.ok(Object.isFrozen(PRECISION_INK_WINDOW));assert.ok(Object.isFrozen(PRECISION_PASS_DNA));
});
