import { ajouterJours, ajouterMois } from './dates';
import { dureeDe } from './durees';
import type { IdMembre, Recurrence, Tache, UniteCalendaire } from './types';

function ajouterUnite(iso: string, unite: UniteCalendaire, n: number): string {
  switch (unite) {
    case 'jour':
      return ajouterJours(iso, n);
    case 'semaine':
      return ajouterJours(iso, 7 * n);
    case 'mois':
      return ajouterMois(iso, n);
    case 'an':
      return ajouterMois(iso, 12 * n);
  }
}

export interface ProchaineEcheance {
  echeance?: string | undefined;
  echeanceKm?: number | undefined;
}

/**
 * Prochaine échéance d’une tâche récurrente faite le `faiteLe`.
 * - calendaire : à partir de l’échéance prévue, en sautant les périodes déjà passées ;
 * - après la dernière fois : `jours` après le passage ;
 * - au kilométrage : `km` après le compteur du passage, ou `ouMois` mois après, au premier atteint.
 */
export function prochaineEcheance(
  recurrence: Recurrence,
  echeancePrevue: string | undefined,
  faiteLe: string,
  kmActuel?: number,
): ProchaineEcheance {
  switch (recurrence.type) {
    case 'calendaire': {
      const pas = Math.max(1, Math.floor(recurrence.intervalle));
      let suivante = ajouterUnite(echeancePrevue ?? faiteLe, recurrence.unite, pas);
      while (suivante <= faiteLe) suivante = ajouterUnite(suivante, recurrence.unite, pas);
      return { echeance: suivante };
    }
    case 'apres':
      return { echeance: ajouterJours(faiteLe, Math.max(1, Math.floor(recurrence.jours))) };
    case 'kilometrage':
      return {
        echeanceKm: kmActuel === undefined ? undefined : kmActuel + Math.max(1, Math.floor(recurrence.km)),
        echeance: recurrence.ouMois ? ajouterMois(faiteLe, recurrence.ouMois) : undefined,
      };
  }
}

/** Marque une tâche faite. Une tâche récurrente garde le passage dans son historique et repart à sa prochaine échéance. */
export function terminerTache(tache: Tache, faiteLe: string, par?: IdMembre, kmActuel?: number): Tache {
  const passage = { par, le: faiteLe, km: kmActuel, duree: dureeDe(tache) };
  if (!tache.recurrence) return { ...tache, faite: passage };
  const suite = prochaineEcheance(tache.recurrence, tache.echeance, faiteLe, kmActuel);
  return {
    ...tache,
    faite: undefined,
    historique: [...tache.historique, passage],
    echeance: suite.echeance ?? (tache.recurrence.type === 'kilometrage' ? undefined : tache.echeance),
    echeanceKm: suite.echeanceKm,
  };
}

/** Annule « faite » sur une tâche simple. */
export function rouvrirTache(tache: Tache): Tache {
  return { ...tache, faite: undefined };
}

const UNITES: Record<UniteCalendaire, [string, string]> = {
  jour: ['Tous les jours', 'jours'],
  semaine: ['Toutes les semaines', 'semaines'],
  mois: ['Tous les mois', 'mois'],
  an: ['Tous les ans', 'ans'],
};

const milliers = (n: number) => n.toLocaleString('fr-FR').replace(/\u202f/g, ' ');

export function decrireRecurrence(r: Recurrence): string {
  switch (r.type) {
    case 'calendaire': {
      const [un, plusieurs] = UNITES[r.unite];
      if (r.intervalle <= 1) return un;
      const tous = r.unite === 'semaine' ? 'Toutes les' : 'Tous les';
      return `${tous} ${r.intervalle} ${plusieurs}`;
    }
    case 'apres':
      return `${r.jours} j après la dernière fois`;
    case 'kilometrage':
      return `Tous les ${milliers(r.km)} km${r.ouMois ? ` ou ${r.ouMois} mois` : ''}`;
  }
}
