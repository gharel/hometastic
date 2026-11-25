import { describe, expect, it } from 'vitest';
import { analyserArticle, chercherProduits, normaliser, trouverProduit } from '../../src/domaine/catalogue';
import { formatMontant, lireMontant } from '../../src/domaine/montants';
import { avancement, compteARebours, etape, totalDepenses } from '../../src/domaine/projets';
import { echeancesAVenir, filtrer, groupeDe, prochaineTacheDe, regrouper } from '../../src/domaine/taches';
import type { Fiche, Projet, Tache } from '../../src/domaine/types';
import fluent from '../../src/icones/fluent.json';
import { CATALOGUE } from '../../src/domaine/catalogue';

const tache = (t: Partial<Tache>): Tache => ({
  id: Math.random().toString(36),
  titre: 'T',
  assignation: 'nous',
  creeeLe: '2026-11-01',
  historique: [],
  ...t,
});
const projet = (p: Partial<Projet>): Projet => ({
  id: 'p1',
  type: 'voyage',
  nom: 'Vacances',
  archive: false,
  creeLe: '2026-11-01',
  ...p,
});
const AUJ = '2026-11-25';

describe('Liste : catalogue et saisie', () => {
  it('chaque icône du catalogue existe dans le sprite', () => {
    const manquantes = CATALOGUE.filter((p) => p.icone && !(p.icone in fluent.icones)).map((p) => p.icone);
    expect(manquantes).toEqual([]);
  });

  it('trouve un produit malgré pluriel, accents et majuscules', () => {
    expect(trouverProduit('banane')?.id).toBe('bananes');
    expect(trouverProduit('OEUFS')?.id).toBe('oeufs');
    expect(trouverProduit('pates')?.id).toBe('pates');
    expect(trouverProduit('truc inconnu')).toBeUndefined();
  });

  it('propose d’abord les produits qui commencent par la saisie', () => {
    const noms = chercherProduits('po').map((p) => p.id);
    expect(noms[0]).toBe('pommes');
    expect(noms).toContain('poulet');
    expect(chercherProduits('')).toEqual([]);
  });

  it('lit quantités et unités', () => {
    expect(analyserArticle('2 l lait')).toEqual({ nom: 'Lait', precision: '2 l' });
    expect(analyserArticle('lait x2')).toEqual({ nom: 'Lait', precision: 'x2' });
    expect(analyserArticle('3 bananes')).toEqual({ nom: 'Bananes', precision: 'x3' });
    expect(analyserArticle('pain')).toEqual({ nom: 'Pain', precision: undefined });
  });

  it('normalise', () => {
    expect(normaliser('  Crème   Fraîche ')).toBe('creme fraiche');
    expect(normaliser('Œufs')).toBe('oeufs');
  });
});

describe('Tâche : groupes et filtres', () => {
  it('range par échéance', () => {
    expect(groupeDe(tache({ echeance: '2026-11-20' }), AUJ)).toBe('retard');
    expect(groupeDe(tache({ echeance: AUJ }), AUJ)).toBe('aujourdhui');
    expect(groupeDe(tache({ echeance: '2026-12-01' }), AUJ)).toBe('semaine');
    expect(groupeDe(tache({ echeance: '2027-01-01' }), AUJ)).toBe('plusTard');
    expect(groupeDe(tache({}), AUJ)).toBe('sansDate');
  });

  it('une échéance au kilométrage dépassée est en retard', () => {
    expect(groupeDe(tache({ echeanceKm: 50000 }), AUJ, 50100)).toBe('retard');
    expect(groupeDe(tache({ echeanceKm: 50000 }), AUJ, 49500)).toBe('semaine');
    expect(groupeDe(tache({ echeanceKm: 60000 }), AUJ, 49500)).toBe('plusTard');
  });

  it('écarte les tâches faites et trie', () => {
    const g = regrouper(
      [
        tache({ titre: 'b', echeance: AUJ, heure: '14:00' }),
        tache({ titre: 'a', echeance: AUJ, heure: '09:00' }),
        tache({ titre: 'faite', echeance: AUJ, faite: { le: AUJ } }),
      ],
      AUJ,
    );
    expect(g.aujourdhui.map((t) => t.titre)).toEqual(['a', 'b']);
  });

  it('les tâches d’un membre incluent celles à deux', () => {
    const ts = [tache({ assignation: 'm1' }), tache({ assignation: 'm2' }), tache({ assignation: 'nous' })];
    expect(filtrer(ts, 'm1')).toHaveLength(2);
    expect(filtrer(ts, 'nous')).toHaveLength(1);
    expect(filtrer(ts, 'tout')).toHaveLength(3);
  });
});

describe('Fiche et Projet : échéances, avancement, budget', () => {
  it('« Bientôt » regroupe tâches rattachées et départs, dans l’horizon', () => {
    const items = echeancesAVenir(
      [
        tache({ titre: 'CT', ficheId: 'f1', echeance: '2026-12-07' }),
        tache({ titre: 'libre', echeance: '2026-12-01' }),
        tache({ titre: 'loin', ficheId: 'f1', echeance: '2027-06-01' }),
      ],
      [projet({ debut: '2026-12-20' })],
      AUJ,
    );
    expect(items.map((i) => i.titre)).toEqual(['CT', 'Vacances']);
  });

  it('prochaine tâche d’une fiche : la plus urgente', () => {
    const f: Fiche = {
      id: 'f1',
      type: 'vehicule',
      nom: 'Voiture',
      infos: {},
      creeLe: AUJ,
      km: { valeur: 50100, le: AUJ },
    };
    const t = prochaineTacheDe(
      f,
      [
        tache({ titre: 'CT', ficheId: 'f1', echeance: '2026-12-07' }),
        tache({ titre: 'Vidange', ficheId: 'f1', echeanceKm: 50000 }),
      ],
      AUJ,
    );
    expect(t?.titre).toBe('Vidange');
  });

  it('avancement, dépenses et compte à rebours', () => {
    const ts = [
      tache({ projetId: 'p1', faite: { le: AUJ } }),
      tache({ projetId: 'p1' }),
      tache({ projetId: 'p2' }),
    ];
    expect(avancement('p1', ts)).toEqual({ faites: 1, total: 2 });
    expect(
      totalDepenses('p1', [
        { id: 'd1', projetId: 'p1', libelle: 'Billets', montant: 150000, date: AUJ },
        { id: 'd2', projetId: 'p1', libelle: 'Hôtel', montant: 62000, date: AUJ },
      ]),
    ).toBe(212000);
    expect(compteARebours(projet({ debut: '2026-12-20' }), AUJ)).toBe('Dans 25 j');
    expect(etape(projet({ debut: '2026-11-20', fin: '2026-11-30' }), AUJ)).toBe('enCours');
    expect(etape(projet({}), AUJ)).toBe('sansDate');
  });

  it('montants en XPF et en euros', () => {
    expect(formatMontant(14800)).toBe('14 800 F');
    expect(formatMontant(12.5, 'EUR')).toBe('12,50 €');
    expect(lireMontant('14 800')).toBe(14800);
    expect(lireMontant('12,5')).toBe(12.5);
    expect(lireMontant('abc')).toBeUndefined();
    expect(lireMontant('')).toBeUndefined();
  });
});
