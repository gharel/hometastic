import { ajouterJours, ecartJours } from './dates';
import type { Article, Assignation, CategorieSortie, Fiche, Projet, Tache } from './types';

export type Groupe = 'retard' | 'aujourdhui' | 'semaine' | 'plusTard' | 'sansDate';

export const TITRES_GROUPES: Record<Groupe, string> = {
  retard: 'En retard',
  aujourdhui: 'Aujourd’hui',
  semaine: 'Cette semaine',
  plusTard: 'Plus tard',
  sansDate: 'Un jour',
};

export const ORDRE_GROUPES: readonly Groupe[] = ['retard', 'aujourdhui', 'semaine', 'plusTard', 'sansDate'];

/** Kilométrage restant avant une échéance au km, ou `undefined`. */
export function kmRestants(tache: Tache, kmFiche: number | undefined): number | undefined {
  if (tache.echeanceKm === undefined || kmFiche === undefined) return undefined;
  return tache.echeanceKm - kmFiche;
}

/** Groupe d’affichage : la date compte d’abord ; une échéance au km dépassée est en retard, proche (1 000 km) cette semaine. */
export function groupeDe(tache: Tache, aujourdhui: string, kmFiche?: number): Groupe {
  const km = kmRestants(tache, kmFiche);
  if (km !== undefined && km <= 0) return 'retard';
  if (tache.echeance) {
    const ecart = ecartJours(aujourdhui, tache.echeance);
    if (ecart < 0) return 'retard';
    if (ecart === 0) return 'aujourdhui';
    if (ecart <= 7) return 'semaine';
    return km !== undefined && km <= 1000 ? 'semaine' : 'plusTard';
  }
  if (km !== undefined) return km <= 1000 ? 'semaine' : 'plusTard';
  return 'sansDate';
}

const comparer = (a: Tache, b: Tache) =>
  (a.echeance ?? '9999').localeCompare(b.echeance ?? '9999') ||
  (a.heure ?? '99').localeCompare(b.heure ?? '99') ||
  a.titre.localeCompare(b.titre, 'fr');

/** Tâches à faire, rangées par groupe puis par échéance. */
export function regrouper(
  taches: readonly Tache[],
  aujourdhui: string,
  kmParFiche: Readonly<Record<string, number>> = {},
): Record<Groupe, Tache[]> {
  const groupes: Record<Groupe, Tache[]> = {
    retard: [],
    aujourdhui: [],
    semaine: [],
    plusTard: [],
    sansDate: [],
  };
  for (const t of taches) {
    if (t.faite) continue;
    groupes[groupeDe(t, aujourdhui, t.ficheId ? kmParFiche[t.ficheId] : undefined)].push(t);
  }
  for (const g of ORDRE_GROUPES) groupes[g].sort(comparer);
  return groupes;
}

export type Filtre = 'tout' | Assignation;

/** Filtre par personne : les tâches d’un membre comprennent aussi celles « à deux ». */
export function filtrer(taches: readonly Tache[], filtre: Filtre): Tache[] {
  if (filtre === 'tout') return [...taches];
  if (filtre === 'nous' || filtre === 'libre') return taches.filter((t) => t.assignation === filtre);
  return taches.filter((t) => t.assignation === filtre || t.assignation === 'nous');
}

export interface Echeance {
  id: string;
  titre: string;
  date: string;
  type: 'tache' | 'projet' | 'sortie';
  ficheId?: string | undefined;
  projetId?: string | undefined;
  listeId?: string | undefined;
  categorie?: CategorieSortie | undefined;
  sante?: boolean | undefined;
}

/**
 * « Bientôt » : tâches rattachées à une fiche ou un projet dont l’échéance tombe après aujourd’hui
 * et dans l’horizon, projets qui commencent et sorties « À voir » datées dans l’horizon. Triés par date.
 */
export function echeancesAVenir(
  taches: readonly Tache[],
  projets: readonly Projet[],
  aujourdhui: string,
  horizon = 30,
  sorties: readonly Article[] = [],
): Echeance[] {
  const limite = ajouterJours(aujourdhui, horizon);
  const dansHorizon = (d: string | undefined): d is string => !!d && d > aujourdhui && d <= limite;
  const items: Echeance[] = [];
  for (const t of taches) {
    if (t.faite || !(t.ficheId || t.projetId) || !dansHorizon(t.echeance)) continue;
    items.push({
      id: t.id,
      titre: t.titre,
      date: t.echeance,
      type: 'tache',
      ficheId: t.ficheId,
      projetId: t.projetId,
      sante: t.sante,
    });
  }
  for (const p of projets) {
    if (!p.archive && dansHorizon(p.debut))
      items.push({ id: p.id, titre: p.nom, date: p.debut, type: 'projet', projetId: p.id });
  }
  for (const s of sorties) {
    if (!s.coche && (s.date === aujourdhui || dansHorizon(s.date)) && s.date)
      items.push({
        id: s.id,
        titre: s.nom,
        date: s.date,
        type: 'sortie',
        listeId: s.listeId,
        categorie: s.categorie,
      });
  }
  return items.sort((a, b) => a.date.localeCompare(b.date) || a.titre.localeCompare(b.titre, 'fr'));
}

/** Prochaine tâche à faire d’une fiche (pour sa carte dans Foyer). */
export function prochaineTacheDe(
  fiche: Fiche,
  taches: readonly Tache[],
  aujourdhui: string,
): Tache | undefined {
  const km = fiche.km?.valeur;
  return taches
    .filter((t) => t.ficheId === fiche.id && !t.faite)
    .sort(
      (a, b) =>
        ORDRE_GROUPES.indexOf(groupeDe(a, aujourdhui, km)) -
          ORDRE_GROUPES.indexOf(groupeDe(b, aujourdhui, km)) || comparer(a, b),
    )[0];
}
