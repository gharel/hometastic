/** Liste « À voir » : films, séries, spectacles, concerts, soirées, expositions. */
import { ajouterJours } from './dates';
import type { Article, CategorieSortie } from './types';

export const CATEGORIES_SORTIE: Record<CategorieSortie, { nom: string; icone: string }> = {
  film: { nom: 'Film', icone: 'clapper-board' },
  serie: { nom: 'Série', icone: 'television' },
  spectacle: { nom: 'Spectacle', icone: 'performing-arts' },
  concert: { nom: 'Concert', icone: 'guitar' },
  soiree: { nom: 'Soirée', icone: 'party-popper' },
  expo: { nom: 'Expo', icone: 'framed-picture' },
  autre: { nom: 'Autre', icone: 'admission-tickets' },
};

/** Date limite proposée pour acheter les billets : deux semaines avant, sans être dans le passé. */
export function dateAchatBillets(dateSortie: string | undefined, aujourdhui: string): string {
  if (!dateSortie) return ajouterJours(aujourdhui, 7);
  const proposee = ajouterJours(dateSortie, -14);
  if (proposee >= aujourdhui) return proposee;
  return dateSortie > aujourdhui ? aujourdhui : dateSortie;
}

export interface SortiesRangees {
  prevues: Article[];
  unJour: Article[];
  vues: Article[];
}

/** Sorties datées (par date), à voir un jour (par ajout), puis déjà vues (les plus récentes d’abord). */
export function rangerSorties(sorties: readonly Article[]): SortiesRangees {
  const prevues = sorties
    .filter((s) => !s.coche && s.date)
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
  const unJour = sorties
    .filter((s) => !s.coche && !s.date)
    .sort((a, b) => a.ajouteLe.localeCompare(b.ajouteLe));
  const vues = sorties
    .filter((s) => s.coche)
    .sort((a, b) => (b.coche?.le ?? '').localeCompare(a.coche?.le ?? ''));
  return { prevues, unJour, vues };
}

/** Catégorie devinée d’après le texte saisi (« concert de… », « expo… »), film par défaut. */
export function devinerCategorie(texte: string): CategorieSortie {
  const t = texte.toLowerCase();
  if (/\bs[ée]rie\b|saison/.test(t)) return 'serie';
  if (/concert|festival/.test(t)) return 'concert';
  if (/th[ée][âa]tre|spectacle|one.man|danse|cirque|op[ée]ra/.test(t)) return 'spectacle';
  if (/soir[ée]e|restau|d[îi]ner|anniv/.test(t)) return 'soiree';
  if (/expo|mus[ée]e/.test(t)) return 'expo';
  return 'film';
}
