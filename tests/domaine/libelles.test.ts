import { describe, expect, it } from 'vitest';
import { iconeEspece, iconeFiche } from '../../src/app/libelles';

describe('icône d’une fiche', () => {
  it('animal : d’après son espèce, sinon des empreintes', () => {
    expect(iconeEspece('Chatte')).toBe('cat-face');
    expect(iconeEspece('chaton')).toBe('cat-face');
    expect(iconeEspece('Chien')).toBe('dog-face');
    expect(iconeEspece('Lapin nain')).toBe('rabbit-face');
    expect(iconeEspece('Perruche')).toBe('bird');
    expect(iconeEspece('Poisson rouge')).toBe('tropical-fish');
    expect(iconeEspece('Âne')).toBe('horse-face');
    expect(iconeEspece('')).toBe('paw-prints');
    expect(iconeEspece(undefined)).toBe('paw-prints');
    expect(iconeFiche({ type: 'animal', infos: { espece: 'Chatte' } })).toBe('cat-face');
  });

  it('véhicule : la moto a la sienne', () => {
    expect(iconeFiche({ type: 'vehicule', infos: { genre: 'moto' } })).toBe('motorcycle');
    expect(iconeFiche({ type: 'vehicule' })).toBe('automobile');
  });
});

describe('illustrations des fiches et des sorties', () => {
  it('existent toutes dans le sprite', async () => {
    const fluent = (await import('../../src/icones/fluent.json')).default;
    const { CATEGORIES_SORTIE } = await import('../../src/domaine/sorties');
    const noms = [
      ...['Chatte', 'Chien', 'Lapin', 'Perruche', 'Poisson', 'Âne', 'Hamster', 'Tortue', ''].map(iconeEspece),
      'motorcycle',
      ...Object.values(CATEGORIES_SORTIE).map((c) => c.icone),
    ];
    for (const n of noms) expect(fluent.icones, n).toHaveProperty(n);
  });
});
