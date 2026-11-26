import { describe, expect, it } from 'vitest';
import { equilibrer, type BilanMois } from '../../src/domaine/analyse';
import { couleurLibre, libelleEnsemble, listeNoms, membresDepuisPrenoms } from '../../src/domaine/membres';

let n = 0;
const id = () => `m${++n}`;

describe('membres du foyer (spec 007)', () => {
  it('crée un membre par prénom saisi, avec une couleur chacun, six au plus', () => {
    const ms = membresDepuisPrenoms(['Guillaume', ' Hélène ', '', 'Léo'], id);
    expect(ms.map((m) => [m.nom, m.couleur])).toEqual([
      ['Guillaume', 'a'],
      ['Hélène', 'b'],
      ['Léo', 'c'],
    ]);
    expect(membresDepuisPrenoms(['A', 'B', 'C', 'D', 'E', 'F', 'G'], id)).toHaveLength(6);
  });

  it('donne la première couleur libre, même après un départ', () => {
    expect(couleurLibre([{ couleur: 'a' }, { couleur: 'c' }])).toBe('b');
    expect(couleurLibre([])).toBe('a');
  });

  it('libellés : « Nous deux » ou « Tout le monde », liste de prénoms', () => {
    expect(libelleEnsemble(2)).toBe('Nous deux');
    expect(libelleEnsemble(3)).toBe('Tout le monde');
    expect(listeNoms(['Hélène'])).toBe('Hélène');
    expect(listeNoms(['Hélène', 'Léo'])).toBe('Hélène et Léo');
    expect(listeNoms(['Hélène', 'Léo', 'Sam'])).toBe('Hélène, Léo et Sam');
  });

  it('équilibre à plusieurs : le plus chargé face au moins chargé', () => {
    const bilan: BilanMois = {
      mois: '2026-11',
      totalMinutes: 600,
      membres: [
        { membreId: 'a', minutes: 300, passages: 0, tachesCreees: 0, articlesAjoutes: 0 },
        { membreId: 'b', minutes: 240, passages: 0, tachesCreees: 0, articlesAjoutes: 0 },
        { membreId: 'c', minutes: 60, passages: 0, tachesCreees: 0, articlesAjoutes: 0 },
      ],
      parDomaine: [],
    };
    const e = equilibrer(bilan, []);
    expect([e.plusCharge, e.moinsCharge, e.ecart, e.equilibre]).toEqual(['a', 'c', 240, false]);
  });
});
