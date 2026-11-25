import { describe, expect, it } from 'vitest';
import { MODELES, modelePour, tachesDuModele } from '../../src/domaine/modeles';
import {
  CATEGORIES_SORTIE,
  dateAchatBillets,
  devinerCategorie,
  rangerSorties,
} from '../../src/domaine/sorties';
import { echeancesAVenir } from '../../src/domaine/taches';
import type { Article, TypeFiche } from '../../src/domaine/types';
import fluent from '../../src/icones/fluent.json';

const AUJ = '2026-11-25';

const modele = (type: TypeFiche) => {
  const m = modelePour(type);
  if (!m) throw new Error(`Pas de modèle pour ${type}`);
  return m;
};

describe('modèles de fiches', () => {
  it('animal : vaccins, vermifuge et antiparasitaire récurrents', () => {
    const taches = tachesDuModele(modele('animal'), AUJ, 'm1');
    expect(taches.map((t) => t.titre)).toEqual([
      'Vaccins chez le vétérinaire',
      'Vermifuge',
      'Antiparasitaire (puces, tiques)',
    ]);
    expect(taches.every((t) => t.recurrence.type === 'calendaire' && t.echeance && t.echeance > AUJ)).toBe(
      true,
    );
    expect(taches[1]?.recurrence).toEqual({ type: 'calendaire', unite: 'mois', intervalle: 3 });
  });

  it('compte : un virement mensuel le 1er du mois suivant, pour les deux', () => {
    const [virement] = tachesDuModele(modele('compte'), '2026-12-15', 'nous');
    expect(virement?.echeance).toBe('2027-01-01');
    expect(virement?.assignation).toBe('nous');
    expect(virement?.recurrence).toEqual({ type: 'calendaire', unite: 'mois', intervalle: 1 });
  });

  it('véhicule : vidange au compteur actuel + 15 000 km, ou dans 12 mois', () => {
    const [vidange] = tachesDuModele(modele('vehicule'), AUJ, 'm1', 48250);
    expect(vidange?.echeanceKm).toBe(63250);
    expect(vidange?.echeance).toBe('2027-11-25');
  });

  it('chaque modèle vise un type de fiche distinct', () => {
    expect(new Set(MODELES.map((m) => m.type)).size).toBe(MODELES.length);
    expect(modelePour('maison')).toBeUndefined();
  });
});

const sortie = (s: Partial<Article>): Article => ({
  id: Math.random().toString(36),
  listeId: 'l1',
  nom: 'Sortie',
  ajouteLe: '2026-11-01T10:00:00Z',
  ...s,
});

describe('liste « À voir »', () => {
  it('les icônes des genres existent', () => {
    for (const c of Object.values(CATEGORIES_SORTIE)) expect(fluent.icones).toHaveProperty(c.icone);
  });

  it('date d’achat des billets : deux semaines avant, jamais dans le passé', () => {
    expect(dateAchatBillets('2026-12-20', AUJ)).toBe('2026-12-06');
    expect(dateAchatBillets('2026-11-30', AUJ)).toBe(AUJ);
    expect(dateAchatBillets(undefined, AUJ)).toBe('2026-12-02');
  });

  it('range : prévues par date, à voir un jour, puis vues', () => {
    const r = rangerSorties([
      sortie({ nom: 'Concert', date: '2026-12-20' }),
      sortie({ nom: 'Film', date: '2026-12-01' }),
      sortie({ nom: 'Série' }),
      sortie({ nom: 'Vu', coche: { le: AUJ } }),
    ]);
    expect(r.prevues.map((s) => s.nom)).toEqual(['Film', 'Concert']);
    expect(r.unJour.map((s) => s.nom)).toEqual(['Série']);
    expect(r.vues.map((s) => s.nom)).toEqual(['Vu']);
  });

  it('devine le genre', () => {
    expect(devinerCategorie('Concert de Fauve')).toBe('concert');
    expect(devinerCategorie('Pièce de théâtre au Rex')).toBe('spectacle');
    expect(devinerCategorie('Soirée chez Marie')).toBe('soiree');
    expect(devinerCategorie('Expo photo')).toBe('expo');
    expect(devinerCategorie('Dune 3')).toBe('film');
  });

  it('les sorties datées apparaissent dans « Bientôt », pas celles déjà vues', () => {
    const items = echeancesAVenir([], [], AUJ, 30, [
      sortie({ nom: 'Spectacle', date: '2026-12-10', categorie: 'spectacle' }),
      sortie({ nom: 'Vu', date: '2026-12-11', coche: { le: AUJ } }),
      sortie({ nom: 'Sans date' }),
    ]);
    expect(items.map((i) => [i.titre, i.type])).toEqual([['Spectacle', 'sortie']]);
  });
});
