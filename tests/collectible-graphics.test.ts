import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {SeasonSpine} from '../src/components/SeasonSpine';
import {TimeRoute} from '../src/components/TimeRoute';
import {TIME_ROUTE_DOMAIN,timeRoutePosition,utcOffsetMinutes} from '../src/lib/timeRoute';
import {createPersonalPass} from '../src/lib/personalPass';
import {mockGames,DEMO_NOW} from '../src/data/mockGames';

const pass=(cityId:string)=>createPersonalPass({passId:'0147',teamCode:'HOU',game:mockGames[0],games:mockGames,cityId,city:'',timezone:'Asia/Tokyo',now:new Date(DEMO_NOW)});

test('Season index has 82 unique physical positions in two horizontal registers, with one current game and no completion track',()=>{
 const html=renderToStaticMarkup(createElement(SeasonSpine,{gameNumber:41}));
 assert.match(html,/viewBox="0 0 104 40"/);
 const marks=[...html.matchAll(/<line data-season-tick="(\d+)"(?: data-current="true")? x1="([^"]+)" x2="([^"]+)" y1="([^"]+)" y2="([^"]+)"/g)];
 assert.equal(marks.length,82);
 assert.deepEqual(marks.map(mark=>Number(mark[1])),Array.from({length:82},(_,i)=>i+1));
 assert.equal(new Set(marks.map(mark=>`${mark[2]},${mark[5]}`)).size,82);
 assert.equal(new Set(marks.map(mark=>mark[5])).size,2);
 assert.ok(marks.every(mark=>mark[2]===mark[3]),'All marks are precision vertical cuts within horizontal registers');
 assert.equal((html.match(/data-current="true"/g)??[]).length,1);
 assert.match(html,/data-season-tick="41" data-current="true"/);
 assert.doesNotMatch(html,/<rect|progressbar|stroke-dasharray/);
 const first=renderToStaticMarkup(createElement(SeasonSpine,{gameNumber:1}));
 const last=renderToStaticMarkup(createElement(SeasonSpine,{gameNumber:82}));
 const positionMap=(source:string)=>[...source.matchAll(/data-season-tick="(\d+)"(?: data-current="true")? x1="([^"]+)" x2="[^"]+" y1="[^"]+" y2="([^"]+)"/g)].map(mark=>`${mark[1]}:${mark[2]}:${mark[3]}`);
 assert.deepEqual(positionMap(first),positionMap(last),'Changing a game only highlights its existing slot');
 assert.doesNotMatch(renderToStaticMarkup(createElement(SeasonSpine,{gameNumber:null})),/data-current/);
});

test('Time Route coordinates use real offsets including half and quarter hours within the civil-time domain',()=>{
 assert.deepEqual(TIME_ROUTE_DOMAIN,{minMinutes:-720,maxMinutes:840});
 for(const [printed,minutes] of [['GMT',0],['UTC',0],['GMT+9',540],['GMT+1',60],['GMT-3:30',-210],['GMT−3:30',-210],['GMT+5:45',345],['GMT+12:45',765],['GMT-12',-720],['GMT+14',840]] as const){
  assert.equal(utcOffsetMinutes(printed),minutes);
  assert.equal(timeRoutePosition(printed),(minutes+720)/1560);
 }
 assert.equal(timeRoutePosition('GMT-12'),0);assert.equal(timeRoutePosition('GMT+14'),1);
 for(const invalid of ['GMT+15','GMT-13','GMT+5:60','TOKYO','GMT+9.5',''])assert.throws(()=>timeRoutePosition(invalid),RangeError);
});

test('Time Route keeps its geometry and team origin while the event-local offset changes its marker; cities sharing an IANA zone keep distinct labels',()=>{
 const tokyo=renderToStaticMarkup(createElement(TimeRoute,{pass:pass('tokyo')}));
 const london=renderToStaticMarkup(createElement(TimeRoute,{pass:pass('london')}));
 const kobe=renderToStaticMarkup(createElement(TimeRoute,{pass:pass('kobe')}));
 const paths=(html:string,kind:string)=>[...html.matchAll(new RegExp(`<path class="${kind}"[^>]*d="([^"]+)"`,'g'))].map(match=>match[1]);
 assert.deepEqual(paths(tokyo,'route-scale-line'),paths(london,'route-scale-line'));
 assert.deepEqual(paths(tokyo,'route-scale-tick'),paths(london,'route-scale-tick'));
 assert.notDeepEqual(paths(tokyo,'route-scale-marker'),paths(london,'route-scale-marker'));
 assert.deepEqual(paths(tokyo,'route-scale-marker'),paths(kobe,'route-scale-marker'));
 assert.match(tokyo,/>HOU<\/span>/);assert.match(london,/>HOU<\/span>/);
 assert.match(tokyo,/TOKYO/);assert.match(kobe,/KOBE/);assert.match(london,/LONDON/);
 assert.match(london,/<small> · UK<\/small>/);assert.equal(pass('london').location.countryCode,'GB','Public UK label never rewrites the canonical country/reference data');
 assert.match(tokyo,/data-offset-minutes="540"/);
 assert.match(london,/data-offset-minutes="0"/,'The real DST-boundary event is GMT in London; never copy a fixed +1 offset');
});
