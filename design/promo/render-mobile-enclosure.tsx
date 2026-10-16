import {renderToStaticMarkup} from 'react-dom/server';
import {MobilePassEnclosure} from '../../src/components/MobilePassEnclosure';
process.stdout.write(renderToStaticMarkup(<MobilePassEnclosure/>));
