import { ecartJours } from './dates';
import type { Depense, Projet, Tache } from './types';

export function avancement(projetId: string, taches: readonly Tache[]): { faites: number; total: number } {
  const liees = taches.filter((t) => t.projetId === projetId);
  return { faites: liees.filter((t) => t.faite).length, total: liees.length };
}

export function totalDepenses(projetId: string, depenses: readonly Depense[]): number {
  return depenses.filter((d) => d.projetId === projetId).reduce((s, d) => s + d.montant, 0);
}

export type Etape = 'sansDate' | 'aVenir' | 'enCours' | 'termine';

/** Où en est le projet par rapport à ses dates. */
export function etape(projet: Projet, aujourdhui: string): Etape {
  if (!projet.debut) return 'sansDate';
  if (aujourdhui < projet.debut) return 'aVenir';
  if (projet.fin && aujourdhui > projet.fin) return 'termine';
  return 'enCours';
}

/** « Dans 25 j », « En cours », « Terminé », ou rien sans date. */
export function compteARebours(projet: Projet, aujourdhui: string): string | undefined {
  switch (etape(projet, aujourdhui)) {
    case 'aVenir': {
      const j = ecartJours(aujourdhui, projet.debut ?? aujourdhui);
      return j === 1 ? 'Demain' : `Dans ${j} j`;
    }
    case 'enCours':
      return 'En cours';
    case 'termine':
      return 'Terminé';
    case 'sansDate':
      return undefined;
  }
}
