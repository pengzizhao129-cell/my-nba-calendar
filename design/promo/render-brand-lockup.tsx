import {renderToStaticMarkup} from 'react-dom/server';
import {BrandLockup} from '../../src/components/BrandLockup';
process.stdout.write(renderToStaticMarkup(<BrandLockup/>));
