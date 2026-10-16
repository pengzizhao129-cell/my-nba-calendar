import {renderToStaticMarkup} from 'react-dom/server';
import {PassShareCard} from '../../src/components/PassShareCard';
import {createPersonalPass} from '../../src/lib/personalPass';
import {mockGames,DEMO_NOW} from '../../src/data/mockGames';
const london=process.argv[2]==='london';
const pass=createPersonalPass({passId:'0147',teamCode:'HOU',game:mockGames[0],games:mockGames,city:london?'伦敦':'东京',timezone:london?'Europe/London':'Asia/Tokyo',now:new Date(DEMO_NOW)});
process.stdout.write(renderToStaticMarkup(<PassShareCard pass={pass} cityLabel={london?'LONDON · UK':'TOKYO · JP'} caption={london?'换个城市，不换主队。':'无论在哪，主队准时见。'} cityState={london?'城市切换 · TOKYO → LONDON':'当前城市 · TOKYO'}><div id="encased-ticket-anchor"/></PassShareCard>));
