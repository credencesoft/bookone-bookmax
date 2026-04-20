import { environment } from './src/environments/environment';
import 'node_modules/zone.js/dist/zone.js';
import 'localstorage-polyfill';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';

export function app(): express.Express {
  const server = express();
  const domino = require('domino');
  const CircularJSON = require('circular-json');
  const obj = CircularJSON.stringify(Object);

  const distFolder = join(process.cwd(), 'dist/demoSSR/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  const win = domino.createWindow(indexHtml).toString();
  (global as any).self = global;
  global['self'] = win;
  global['document'] = win.document;
  global['IDBIndex'] = win.IDBIndex;
  global['navigator'] = win.navigator;
  global['getComputedStyle'] = win.getComputedStyle;
  global['Event'] = null;
  global['localStorage'] = localStorage;

  server.engine('html', ngExpressEngine({ bootstrap: AppServerModule }));
  server.set('view engine', 'html');
  server.set('views', distFolder);

  // ================================================================
  // JS / CSS / fonts — cache 1 year (hashed filenames, safe forever)
  // ================================================================
  server.get(
    /\.(js|css|woff2|woff|ttf|eot)$/,
    express.static(distFolder, {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    })
  );

  // ================================================================
  // Images — cache 30 days
  // ================================================================
  server.get(
    /\.(png|jpg|jpeg|svg|ico|webp|gif)$/,
    express.static(distFolder, {
      maxAge: '30d',
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=2592000');
      }
    })
  );

  // ================================================================
  // All other static files
  // ================================================================
  server.get(
    '.',
    express.static(distFolder, {
      maxAge: '1y',
      immutable: true
    })
  );

  // ================================================================
  // HTML routes — NEVER cache
  // CloudFront will not cache, Chrome will not cache
  // No hard reload ever needed after deploy
  // ================================================================
  server.get('*', (req, res) => {
    // Tell browser never to cache HTML
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    // Tell CloudFront never to cache HTML
    res.setHeader('Surrogate-Control', 'no-store');
    // Tell CDNs (Cloudflare etc) never to cache HTML
    res.setHeader('CDN-Cache-Control', 'no-store');

    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }]
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4200;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';