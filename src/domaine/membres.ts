/**
 * Membres du foyer (spec 007) : un couple, un couple et son ado, une colocation… jusqu’à six
 * personnes, chacune avec sa couleur. Un membre est quelqu’un qui prend des tâches ; les jeunes
 * enfants restent des fiches « personne ».
 */
import type { CouleurMembre, IdMembre, Membre } from './types';

export const MEMBRES_MAX = 6;
export const COULEURS_MEMBRES: readonly CouleurMembre[] = ['a', 'b', 'c', 'd', 'e', 'f'];

/** Première couleur que personne n’a encore. */
export function couleurLibre(membres: readonly Pick<Membre, 'couleur'>[]): CouleurMembre {
  const prises = new Set(membres.map((m) => m.couleur));
  return COULEURS_MEMBRES.find((c) => !prises.has(c)) ?? COULEURS_MEMBRES[membres.length % 6] ?? 'a';
}

/**
 * Membres créés à partir des prénoms saisis (le premier est la personne qui crée le foyer) :
 * prénoms vides ignorés, six au plus, une couleur chacun.
 */
export function membresDepuisPrenoms(prenoms: readonly string[], nouvelId: () => IdMembre): Membre[] {
  const membres: Membre[] = [];
  for (const p of prenoms) {
    const nom = p.trim();
    if (!nom || membres.length >= MEMBRES_MAX) continue;
    membres.push({ id: nouvelId(), nom, couleur: couleurLibre(membres) });
  }
  return membres;
}

/** Libellé de l’assignation « nous » : « Nous deux » à deux, « Tout le monde » au-delà. */
export const libelleEnsemble = (nombre: number) => (nombre > 2 ? 'Tout le monde' : 'Nous deux');

/** « Hélène », « Hélène et Léo », « Hélène, Léo et Sam ». */
export function listeNoms(noms: readonly string[]): string {
  if (noms.length <= 1) return noms[0] ?? '';
  return `${noms.slice(0, -1).join(', ')} et ${noms.at(-1) ?? ''}`;
}
