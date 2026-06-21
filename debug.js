const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="filter-groups-container"></div><div id="font-grid"></div><div id="trending-strip"></div><div id="progress-bar"></div></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = { getItem: () => null, setItem: () => {} };

// Need fontsData
const fontsJs = fs.readFileSync('fonts.js', 'utf8');
eval(fontsJs);

// Need shared.js
const sharedJs = fs.readFileSync('shared.js', 'utf8');
eval(sharedJs);

const appJs = fs.readFileSync('app.js', 'utf8');
try {
  eval(appJs);
  console.log('App evaluated successfully');
  if (typeof init === 'function') {
    init();
    console.log('Init ran successfully');
  }
} catch (e) {
  console.error('Error:', e);
}
