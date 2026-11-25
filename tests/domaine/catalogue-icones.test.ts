import { describe, expect, it } from 'vitest';
import {
  CATALOGUE,
  CHOIX_ICONES,
  RAYONS,
  chercherProduits,
  iconeDe,
  rayonDe,
  trouverProduit,
} from '../../src/domaine/catalogue';
import fluent from '../../src/icones/fluent.json';
import { ICONES_NID, NOMS_ICONES_NID } from '../../src/icones/nid';

const existe = (nom: string) => nom in fluent.icones || nom in ICONES_NID;

describe('Catalogue et illustrations', () => {
  it('chaque produit a une illustration qui existe, et un rayon connu', () => {
    const rayons = new Set(RAYONS.map(([cle]) => cle));
    for (const p of CATALOGUE) {
      expect(p.icone, p.nom).not.toBeNull();
      expect(existe(p.icone ?? ''), `${p.nom} : ${p.icone}`).toBe(true);
      expect(rayons.has(p.rayon), p.nom).toBe(true);
    }
  });

  it('identifiants uniques', () => {
    const ids = CATALOGUE.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('chaque illustration dessinée pour Nid sert à un produit, sans script', () => {
    const utilisees = new Set(CATALOGUE.map((p) => p.icone));
    for (const nom of NOMS_ICONES_NID) {
      expect(utilisees.has(nom), nom).toBe(true);
      expect(ICONES_NID[nom]).not.toMatch(/<script|\son\w+=|javascript:/i);
    }
  });

  it('bricolage, hygiène et beauté sont couverts', () => {
    const du = (rayon: string) => CATALOGUE.filter((p) => p.rayon === rayon).map((p) => p.id);
    expect(du('bricolage')).toEqual(
      expect.arrayContaining(['vis', 'clous', 'chevilles', 'colle', 'mastic', 'bois', 'embouts', 'grille']),
    );
    expect(du('hygiene')).toEqual(
      expect.arrayContaining(['deodorant', 'mascara', 'parfum', 'cotons-tiges', 'serviettes-hygieniques']),
    );
    expect(du('entretien')).toEqual(
      expect.arrayContaining(['javel', 'nettoyant', 'pastilles-lave-vaisselle']),
    );
  });

  it('retrouve les produits par leurs noms courants', () => {
    const cas: [string, string][] = [
      ['vis', 'vis'],
      ['Scotch', 'ruban-adhesif'],
      ['silicone', 'mastic'],
      ['WD-40', 'degrippant'],
      ['déo', 'deodorant'],
      ['embout', 'embouts'],
      ['grille d’aération', 'grille'],
      ['clé', 'cles'],
      ['huile moteur', 'huile-moteur'],
      ['huile', 'huile'],
      ['joint', 'joints'],
      ['pq', 'papier-toilette'],
    ];
    for (const [saisie, id] of cas) expect(trouverProduit(saisie)?.id, saisie).toBe(id);
  });

  it('propose aussi les produits dont un mot commence par la saisie', () => {
    expect(chercherProduits('col').map((p) => p.id)).toContain('colle');
    expect(chercherProduits('vis')[0]?.id).toBe('vis');
    expect(chercherProduits('ongles').map((p) => p.id)).toEqual(
      expect.arrayContaining(['vernis', 'coupe-ongles']),
    );
  });

  it('une illustration et un rayon choisis à la main passent avant ceux du produit', () => {
    expect(iconeDe({ produitId: 'lait' })).toBe('glass-of-milk');
    expect(iconeDe({ produitId: 'lait', icone: 'nid-vis' })).toBe('nid-vis');
    expect(iconeDe({})).toBeNull();
    expect(rayonDe({ produitId: 'vis' })).toBe('bricolage');
    expect(rayonDe({ produitId: 'vis', rayon: 'divers' })).toBe('divers');
    expect(rayonDe({})).toBe('divers');
  });

  it('le choix d’icônes présente chaque illustration une seule fois', () => {
    const icones = CHOIX_ICONES.map((c) => c.icone);
    expect(new Set(icones).size).toBe(icones.length);
    expect(new Set(icones)).toEqual(new Set(CATALOGUE.map((p) => p.icone)));
  });
});
