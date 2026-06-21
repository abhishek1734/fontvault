const fs = require('fs');
const appJs = fs.readFileSync('app.js', 'utf8');

// Extract fontsData
const fdStart = appJs.indexOf('const fontsData = [');
const fdEnd = appJs.indexOf('];', fdStart) + 2;
const fontsDataContent = appJs.substring(fdStart, fdEnd);
fs.writeFileSync('fonts.js', fontsDataContent + '\n');

// Extract loadExternalFont
const lefStart = appJs.indexOf('function loadExternalFont(font)');
const lefEnd = appJs.indexOf('}', appJs.indexOf('document.head.appendChild(link);', lefStart)) + 1;
const loadExternalFontContent = appJs.substring(lefStart, lefEnd);

// Extract theme stuff
const atStart = appJs.indexOf('function applyTheme(dark)');
const tdmEnd = appJs.indexOf('}', appJs.indexOf('function toggleDarkMode()')) + 1;
const themeContent = appJs.substring(atStart, tdmEnd);

// Extract auth stuff
const oamStart = appJs.indexOf('function openAuthModal()');
const camEnd = appJs.indexOf('}', appJs.indexOf('document.body.style.overflow = "";', oamStart)) + 1;
const authContent = appJs.substring(oamStart, camEnd);

fs.writeFileSync('shared.js', [loadExternalFontContent, themeContent, authContent].join('\n\n') + '\n');

// Remove from app.js
let newAppJs = appJs.replace(fontsDataContent, '');
newAppJs = newAppJs.replace(loadExternalFontContent, '');
newAppJs = newAppJs.replace(themeContent, '');
newAppJs = newAppJs.replace(authContent, '');
fs.writeFileSync('app.js', newAppJs);
