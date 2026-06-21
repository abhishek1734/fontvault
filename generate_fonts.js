const fs = require('fs');

const fontNames = [
  "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Source Sans Pro", "Slabo 27px", "Raleway", "PT Sans", "Merriweather",
  "Noto Sans", "Nunito", "Concert One", "Promesh", "Bebas Neue", "Ubuntu", "Playfair Display", "Rubik", "Lora", "Work Sans",
  "Fira Sans", "Quicksand", "Barlow", "Inconsolata", "Mukta", "Josefin Sans", "Karla", "Anton", "Cabin", "Hind",
  "Fjalla One", "Oxygen", "Arimo", "Dosis", "Bitter", "Abel", "Varela Round", "Signika", "Libre Baskerville", "PT Serif",
  "Zilla Slab", "Teko", "Exo 2", "Pacifico", "Dancing Script", "Shadows Into Light", "Acme", "Bree Serif", "Asap", "Crete Round",
  "Questrial", "Righteous", "Alfa Slab One", "Patua One", "Rokkitt", "Monda", "Francois One", "Archivo Black", "Abril Fatface", "Vollkorn",
  "Alegreya", "EB Garamond", "Cinzel", "Cardo", "Crimson Text", "Domine", "Cormorant Garamond", "Amatic SC", "Caveat", "Indie Flower",
  "Permanent Marker", "Satisfy", "Courgette", "Great Vibes", "Sacramento", "Cookie", "Handlee", "Kalam", "Gloria Hallelujah", "Architects Daughter",
  "Rock Salt", "Patrick Hand", "Neucha", "Covered By Your Grace", "Kaushan Script", "Yellowtail", "Berkshire Swash", "Leckerli One", "Alegreya Sans", "Muli",
  "Nunito Sans", "Titillium Web", "Catamaran", "Heebo", "Kanit", "Rajdhani", "Yanone Kaffeesatz", "Ropa Sans", "Pathway Gothic One", "Oleo Script"
];

const providers = ["google", "fontshare", "dafont"];
const styles = ["Sans-Serif", "Serif", "Monospace", "Display", "Handwriting", "Script"];
const moods = ["Modern", "Classic", "Playful", "Elegant", "Minimal", "Bold", "Vintage"];
const useCases = ["UI", "Editorial", "Code", "Branding", "Posters", "Packaging"];

const newFonts = fontNames.map((name, i) => {
  const id = name.toLowerCase().replace(/ /g, '-');
  const provider = providers[i % 3];
  const style = styles[i % styles.length];
  const mood = moods[i % moods.length];
  const useCase = useCases[i % useCases.length];
  const availability = provider === "dafont" ? "Free for Personal" : "Free";
  const downloadUrl = provider === "google" 
    ? "https://fonts.google.com/specimen/" + name.replace(/ /g, "+")
    : "https://www." + provider + ".com/search?q=" + name.replace(/ /g, "+");

  return {
    id,
    name,
    provider,
    designer: "Designer " + (i + 1),
    foundry: "Foundry " + (i + 1),
    year: (2000 + (i % 24)).toString(),
    stylesCount: 1 + (i % 8),
    languages: ["Latin", "Cyrillic"],
    description: name + " is a versatile " + style.toLowerCase() + " font that perfectly captures a " + mood.toLowerCase() + " aesthetic. It is highly recommended for " + useCase.toLowerCase() + " applications.",
    availability,
    mood,
    useCase,
    style,
    language: "Latin",
    downloadUrl,
    price: "Free",
    mockupType: "ui",
    mockupTitle: name + " Showcase",
    mockupSubtitle: "A premium typographic experience",
    fileSize: (0.1 + (i % 2)).toFixed(1) + " MB",
    pairsWith: []
  };
});

const appJsPath = './app.js';
let appJs = fs.readFileSync(appJsPath, 'utf-8');

// Find the end of the fontsData array
const trendingIdx = appJs.indexOf('trendingFontIds');
const insertPos = appJs.lastIndexOf('];', trendingIdx);

if (insertPos !== -1) {
  const newFontsStr = newFonts.map(f => '  ' + JSON.stringify(f)).join(',\n') + '\n';
  // Insert with a leading comma
  appJs = appJs.substring(0, insertPos) + ',\n' + newFontsStr + appJs.substring(insertPos);
  fs.writeFileSync(appJsPath, appJs, 'utf-8');
  console.log('Successfully added 100 fonts to app.js!');
} else {
  console.error('Could not find the insertion point in app.js');
}
