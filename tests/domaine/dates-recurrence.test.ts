import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  ajouterJours,
  ajouterMois,
  ecartJours,
  estDateIso,
  formatCourt,
  formatLong,
  relatif,
  versIso,
} from '../../src/domaine/dates';
import {
  decrireRecurrence,
  prochaineEcheance,
  rouvrirTache,
  terminerTache,
} from '../../src/domaine/recurrence';
import type { Recurrence, Tache } from '../../src/domaine/types';

const dateArb = fc
  .record({
    a: fc.integer({ min: 2000, max: 2100 }),
    m: fc.integer({ min: 1, max: 12 }),
    j: fc.integer({ min: 1, max: 28 }),
  })
  .map(({ a, m, j }) => versIso(a, m, j));

const tache = (t: Partial<Tache> = {}): Tache => ({
  id: 't',
  titre: 'Tâche',
  assignation: 'nous',
  creeeLe: '2026-11-01',
  historique: [],
  ...t,
});

describe('dates', () => {
  it('ajoute et compte des jours de façon réversible', () => {
    fc.assert(
      fc.property(dateArb, fc.integer({ min: -2000, max: 2000 }), (d, n) => {
        const e = ajouterJours(d, n);
        expect(estDateIso(e)).toBe(true);
        expect(ecartJours(d, e)).toBe(n);
      }),
    );
  });

  it('ramène le jour au dernier jour du mois', () => {
    expect(ajouterMois('2026-01-31', 1)).toBe('2026-02-28');
    expect(ajouterMois('2028-01-31', 1)).toBe('2028-02-29');
    expect(ajouterMois('2026-12-15', 1)).toBe('2027-01-15');
    expect(ajouterMois('2026-03-31', -1)).toBe('2026-02-28');
  });

  it('formate en français', () => {
    expect(formatCourt('2027-01-12', '2026-11-25')).toBe('12 janv. 2027');
    expect(formatCourt('2026-12-01', '2026-11-25')).toBe('1er déc.');
    expect(formatLong('2026-11-25')).toBe('mercredi 25 novembre');
    expect(relatif('2026-11-25', '2026-11-25')).toBe('Aujourd’hui');
    expect(relatif('2026-11-26', '2026-11-25')).toBe('Demain');
    expect(relatif('2026-12-07', '2026-11-25')).toBe('Dans 12 j');
    expect(relatif('2026-11-23', '2026-11-25')).toBe('En retard de 2 j');
  });

  it('refuse une date impossible', () => {
    expect(estDateIso('2026-02-30')).toBe(false);
    expect(estDateIso('2026-13-01')).toBe(false);
    expect(estDateIso('25/11/2026')).toBe(false);
  });
});

describe('récurrences', () => {
  const recurrenceArb: fc.Arbitrary<Recurrence> = fc.oneof(
    fc.record({
      type: fc.constant('calendaire' as const),
      unite: fc.constantFrom('jour' as const, 'semaine' as const, 'mois' as const, 'an' as const),
      intervalle: fc.integer({ min: 1, max: 12 }),
    }),
    fc.record({ type: fc.constant('apres' as const), jours: fc.integer({ min: 1, max: 400 }) }),
  );

  it('la prochaine échéance tombe toujours après le passage', () => {
    fc.assert(
      fc.property(recurrenceArb, dateArb, dateArb, (r, prevue, faite) => {
        const { echeance } = prochaineEcheance(r, prevue, faite);
        expect(echeance && echeance > faite).toBe(true);
      }),
    );
  });

  it('« après la dernière fois » compte depuis le passage, pas depuis la date prévue', () => {
    expect(prochaineEcheance({ type: 'apres', jours: 90 }, '2026-01-01', '2026-11-25').echeance).toBe(
      '2027-02-23',
    );
  });

  it('calendaire garde le rythme prévu même fait en retard', () => {
    const r: Recurrence = { type: 'calendaire', unite: 'mois', intervalle: 1 };
    expect(prochaineEcheance(r, '2026-11-05', '2026-11-08').echeance).toBe('2026-12-05');
    expect(prochaineEcheance(r, '2026-08-05', '2026-11-08').echeance).toBe('2026-12-05');
  });

  it('au kilométrage : compteur du passage + intervalle, ou date au premier atteint', () => {
    const r: Recurrence = { type: 'kilometrage', km: 15000, ouMois: 12 };
    expect(prochaineEcheance(r, undefined, '2026-11-25', 48250)).toEqual({
      echeanceKm: 63250,
      echeance: '2027-11-25',
    });
  });

  it('terminer une tâche récurrente la relance et garde l’historique', () => {
    const t = tache({
      echeance: '2026-11-25',
      recurrence: { type: 'calendaire', unite: 'semaine', intervalle: 1 },
    });
    const suite = terminerTache(t, '2026-11-25', 'm1');
    expect(suite.faite).toBeUndefined();
    expect(suite.echeance).toBe('2026-12-02');
    expect(suite.historique).toEqual([{ par: 'm1', le: '2026-11-25', km: undefined, duree: 30 }]);
  });

  it('terminer puis rouvrir une tâche simple', () => {
    const faite = terminerTache(tache(), '2026-11-25', 'm1');
    expect(faite.faite?.le).toBe('2026-11-25');
    expect(rouvrirTache(faite).faite).toBeUndefined();
  });

  it('décrit les récurrences', () => {
    expect(decrireRecurrence({ type: 'calendaire', unite: 'semaine', intervalle: 1 })).toBe(
      'Toutes les semaines',
    );
    expect(decrireRecurrence({ type: 'calendaire', unite: 'mois', intervalle: 3 })).toBe('Tous les 3 mois');
    expect(decrireRecurrence({ type: 'apres', jours: 90 })).toBe('90 j après la dernière fois');
    expect(decrireRecurrence({ type: 'kilometrage', km: 15000, ouMois: 12 })).toBe(
      'Tous les 15 000 km ou 12 mois',
    );
  });
});
