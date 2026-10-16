import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {teamIdentities} from '../src/data/teamIdentities';
import {passSecuritySvg} from '../src/lib/passDesign';

async function files(directory:string):Promise<string[]> {
 const entries=await readdir(directory,{withFileTypes:true});
 return (await Promise.all(entries.map(entry=>entry.isDirectory()?files(join(directory,entry.name)):[join(directory,entry.name)]))).flat();
}

test('Product components cannot introduce paint literals or Tailwind palette bypasses',async()=>{
 const sources=(await files('src/components')).filter(path=>path.endsWith('.tsx'));
 const violations=[];
 for(const path of sources){const source=await readFile(path,'utf8');if(/#[a-f\d]{3,8}\b|rgba?\(|(?:bg|text|border)-(?:white|black|gray|slate|red)(?:[\s\-/\]"']|$)/i.test(source))violations.push(path);}
 assert.deepEqual(violations,[],'Components must consume semantic tokens or TeamIdentity inputs');
 for(const path of ['src/app/globals.css','src/styles/system-island.css','design/promo/promo.html'])assert.doesNotMatch(await readFile(path,'utf8'),/#[a-f\d]{3,8}\b|rgba?\(/i,'All global paint literals belong in color-material.css');
});

test('Approved base materials stay warm, nonwhite and nonblack, with a fixed graphite hierarchy',async()=>{
 const source=await readFile('src/styles/color-material.css','utf8');
 const tokens=Object.fromEntries([...source.matchAll(/--([\w-]+):\s*(#[a-f\d]{6})\s*;/gi)].map(match=>[match[1],match[2].toLowerCase()]));
 assert.deepEqual(Object.fromEntries(['canvas-base','pass-base','stub-base','graphite-100','graphite-70','graphite-50','graphite-30','brand-red'].map(name=>[name,tokens[name]])),{'canvas-base':'#f1efea','pass-base':'#faf8f4','stub-base':'#f5f3ef','graphite-100':'#1b1c1a','graphite-70':'#4b4c48','graphite-50':'#767771','graphite-30':'#a6a59f','brand-red':'#a92732'});
 assert.ok(Object.values(tokens).every(color=>color!=='#ffffff'&&color!=='#000000'));
 assert.equal(tokens['hou-accent'],teamIdentities.HOU.primaryColor);assert.equal(tokens['lal-accent'],teamIdentities.LAL.primaryColor);
});

test('Every team supplies restrained temperature/security inputs; the SVG supplies no paint',()=>{
 for(const team of Object.values(teamIdentities)){
  const alpha=(value:string)=>Number(value.match(/,([.\d]+)\)$/)![1]);
  assert.ok(alpha(team.temperatureTint)>=.015&&alpha(team.temperatureTint)<=.03);
  assert.ok(alpha(team.securityInk)>=.02&&alpha(team.securityInk)<=.04);
  assert.doesNotMatch(passSecuritySvg(team.code)!,/#[a-f\d]{3,8}\b|rgba?\(/i,'Security SVGs are reusable alpha masks, not embedded team-colored backgrounds');
 }
 assert.notEqual(teamIdentities.HOU.primaryColor,teamIdentities.LAL.primaryColor);
 assert.notEqual(teamIdentities.HOU.temperatureTint,teamIdentities.LAL.temperatureTint);
});
