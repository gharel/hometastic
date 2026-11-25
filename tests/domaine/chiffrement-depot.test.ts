import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import {
  chiffrer,
  dechiffrer,
  exporterCle,
  genererCle,
  importerCle,
} from '../../src/chiffrement/chiffrement';
import { Depot } from '../../src/donnees/depot';
import { StockageMemoire, type Stockage } from '../../src/donnees/stockage';
import { StockageDexie } from '../../src/donnees/stockage-dexie';
import type { Fiche, Tache } from '../../src/domaine/types';

const AUJ = '2026-11-25';

describe('chiffrement (ADR 0004)', () => {
  it('aller-retour et vecteur aléatoire', async () => {
    const cle = await genererCle();
    const a = await chiffrer(cle, 'Pédiatre le 12 janvier');
    const b = await chiffrer(cle, 'Pédiatre le 12 janvier');
    expect(a).not.toBe(b);
    expect(a).not.toContain('Pédiatre');
    expect(await dechiffrer(cle, a)).toBe('Pédiatre le 12 janvier');
  });

  it('refuse une mauvaise clé ou un bloc altéré', async () => {
    const bloc = await chiffrer(await genererCle(), 'secret');
    await expect(dechiffrer(await genererCle(), bloc)).rejects.toThrow();
    await expect(dechiffrer(await genererCle(), 'v1.abc')).rejects.toThrow();
  });

  it('le code de secours restitue la clé', async () => {
    const cle = await genererCle();
    const code = await exporterCle(cle);
    expect(code).toHaveLength(43);
    expect(await dechiffrer(await importerCle(code), await chiffrer(cle, 'ok'))).toBe('ok');
    await expect(importerCle('trop-court')).rejects.toThrow();
  });
});

const tacheSante: Tache = {
  id: 't1',
  titre: 'Pédiatre de Léo',
  note: 'Apporter le carnet de santé',
  assignation: 'nous',
  echeance: '2027-01-12',
  sante: true,
  creeeLe: AUJ,
  historique: [],
};
const fiche: Fiche = {
  id: 'f1',
  type: 'personne',
  nom: 'Léo',
  infos: { naissance: '2024-03-14' },
  sante: { allergies: 'Arachide', traitements: '', vaccins: 'ROR 2 nov.', notes: '' },
  creeLe: AUJ,
};

async function verifierDepot(stockage: Stockage) {
  const depot = new Depot(stockage);
  await depot.ouvrir();
  await depot.mettre('taches', tacheSante);
  await depot.mettre('fiches', fiche);

  // Ce qui est réellement stocké (et partira au serveur) ne contient aucun texte de santé lisible.
  const brut = JSON.stringify([await stockage.tout('taches'), await stockage.tout('fiches')]);
  for (const secret of ['Pédiatre', 'carnet', 'Arachide', 'ROR']) expect(brut).not.toContain(secret);
  expect(brut).toContain('2027-01-12'); // la date du rappel reste lisible pour la notification
  expect(brut).toContain('Léo'); // le nom de la fiche n’est pas une donnée de santé

  // Le dépôt restitue les données en clair.
  expect(await depot.tout('taches')).toEqual([tacheSante]);
  expect(await depot.tout('fiches')).toEqual([fiche]);
  return depot;
}

describe('dépôt', () => {
  it('chiffre la santé en mémoire', async () => {
    await verifierDepot(new StockageMemoire());
  });

  it('chiffre la santé dans IndexedDB et relit après réouverture', async () => {
    const nom = `nid-test-${Date.now()}`;
    await verifierDepot(new StockageDexie(nom));
    const relu = new Depot(new StockageDexie(nom));
    await relu.ouvrir();
    expect((await relu.tout('taches'))[0]?.titre).toBe('Pédiatre de Léo');
  });

  it('un autre téléphone sans la clé ne lit pas la santé', async () => {
    const stockage = new StockageMemoire();
    await verifierDepot(stockage);
    await stockage.supprimer('cles', 'sante');
    const autre = new Depot(stockage);
    await autre.ouvrir();
    const [t] = await autre.tout('taches');
    expect(t?.titre).toBe('Contenu chiffré illisible sur ce téléphone');
  });

  it('écoute les changements', async () => {
    const depot = new Depot(new StockageMemoire());
    await depot.ouvrir();
    const recus: number[] = [];
    depot.ecouter('taches', (ts) => recus.push(ts.length));
    await depot.mettre('taches', { ...tacheSante, id: 't2', sante: false });
    await new Promise((r) => setTimeout(r, 10));
    expect(recus.at(-1)).toBe(1);
  });

  it('exporte puis réimporte ; refuse une sauvegarde invalide sans rien écraser', async () => {
    const source = await verifierDepot(new StockageMemoire());
    await source.ecrireFoyer({ id: 'foyer', nom: 'Test', membres: [], devise: 'XPF', creeLe: AUJ });
    const sauvegarde = JSON.parse(JSON.stringify(await source.exporter()));
    expect(JSON.stringify(sauvegarde)).not.toContain('Pédiatre');

    const cible = new Depot(new StockageMemoire());
    await cible.ouvrir();
    await cible.utiliserCode(await source.codeDeSecours());
    await cible.importer(sauvegarde);
    expect((await cible.tout('taches'))[0]?.titre).toBe('Pédiatre de Léo');
    expect((await cible.lireFoyer())?.nom).toBe('Test');

    await expect(cible.importer({ format: 'autre' })).rejects.toThrow();
    expect(await cible.tout('taches')).toHaveLength(1);
  });
});
