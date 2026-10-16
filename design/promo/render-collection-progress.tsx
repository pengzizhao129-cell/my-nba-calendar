import {renderToStaticMarkup} from 'react-dom/server';
import {CollectionProgress} from '../../src/components/CollectionProgress';
import {createPersonalPass} from '../../src/lib/personalPass';
import {mockGames,DEMO_NOW} from '../../src/data/mockGames';
const pass=createPersonalPass({passId:'0147',teamCode:'HOU',game:mockGames[0],games:mockGames,city:'东京',timezone:'Asia/Tokyo',now:new Date(DEMO_NOW)});
process.stdout.write(renderToStaticMarkup(<CollectionProgress pass={pass}/>));
