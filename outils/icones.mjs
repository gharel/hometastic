// Télécharge les icônes Fluent Emoji Flat (Microsoft, licence MIT) utilisées par Hometastic depuis l’API Iconify,
// et écrit src/icones/fluent.json (corps SVG seulement). À relancer après un ajout au catalogue :
//   node outils/icones.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const catalogue = readFileSync(new URL('../src/domaine/catalogue.ts', import.meta.url), 'utf8');
// Les illustrations « nid-… » sont dessinées dans src/icones/nid.ts : pas à télécharger.
const noms = new Set(
  [...catalogue.matchAll(/\[\s*'[^']+',\s*'[^']+',\s*'([a-z-]+)'/g)]
    .map((m) => m[1])
    .filter((n) => !n.startsWith('nid-')),
);

// Icônes de l’interface (types de fiches et de projets, écrans vides).
for (const n of [
  'house',
  'automobile',
  'child',
  'identification-card',
  'card-index-dividers',
  'desert-island',
  'hammer-and-wrench',
  'party-popper',
  'pushpin',
  'shopping-cart',
  'clipboard',
  'luggage',
  'stethoscope',
  'receipt',
  'nest-with-eggs',
  'check-mark-button',
  'dog-face',
  'paw-prints',
  'cat-face',
  'rabbit-face',
  'bird',
  'horse-face',
  'hamster',
  'turtle',
  'tropical-fish',
  'bank',
  'money-bag',
  'credit-card',
  'clapper-board',
  'television',
  'performing-arts',
  'guitar',
  'framed-picture',
  'admission-tickets',
  'popcorn',
  'motorcycle',
  'broom',
  'basket',
  'pot-of-food',
  'balance-scale',
  'stopwatch',
]) {
  noms.add(n);
}

const reponse = await fetch(
  `https://api.iconify.design/fluent-emoji-flat.json?icons=${[...noms].sort().join(',')}`,
);
if (!reponse.ok) throw new Error(`Iconify : ${reponse.status}`);
const json = await reponse.json();
const icones = {};
for (const [nom, { body }] of Object.entries(json.icons)) {
  if (/<script|\son\w+=|javascript:/i.test(body)) throw new Error(`Icône suspecte : ${nom}`);
  icones[nom] = body;
}
writeFileSync(
  new URL('../src/icones/fluent.json', import.meta.url),
  `${JSON.stringify({ licence: 'Fluent Emoji Flat, Microsoft, MIT', taille: json.width ?? 32, icones })}\n`,
);
console.log(
  `${Object.keys(icones).length} icônes écrites ; introuvables : ${(json.not_found ?? []).join(', ') || 'aucune'}`,
);
