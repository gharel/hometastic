// Reprend la feuille de style de la maquette (référence de la charte) dans src/styles/nid.css.
import { readFileSync, writeFileSync } from 'node:fs';

const maquette = readFileSync(new URL('../maquette/index.html', import.meta.url), 'utf8');
let css = maquette.slice(maquette.indexOf('<style>') + 7, maquette.indexOf('</style>'));
css = css.replace('--police: "DM Sans", ', '--police: "DM Sans Variable", "DM Sans", ');
css = css
  .split('\n')
  .map((l) => l.replace(/^ {6}/, ''))
  .join('\n')
  .trim();
writeFileSync(
  new URL('../src/styles/nid.css', import.meta.url),
  `/* Charte propre à Nid (validée le 25 novembre 2026), reprise de la maquette de référence. */\n${css}\n`,
);
console.log(`${css.length} caractères ; police : ${/--police:[^;]+/.exec(css)?.[0]}`);
