// Remplace les espaces insécables écrites en dur dans le code par leur échappement (\u00a0, \u202f),
// pour que le source reste lisible et que ESLint (no-irregular-whitespace) passe. Le texte affiché
// n’en a pas besoin : la typographie les ajoute à l’affichage.
//   node outils/espaces.mjs src/**/*.ts*
import { readFileSync, writeFileSync } from 'node:fs';

const NBSP = String.fromCharCode(0xa0);
const NNBSP = String.fromCharCode(0x202f);

for (const fichier of process.argv.slice(2)) {
  const avant = readFileSync(fichier, 'utf8');
  const apres = avant.split(NBSP).join('\\u00a0').split(NNBSP).join('\\u202f');
  if (apres !== avant) {
    writeFileSync(fichier, apres);
    console.log(`corrigé : ${fichier}`);
  }
}
