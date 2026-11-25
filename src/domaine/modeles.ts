/**
 * Modèles (brique de soutien, ADR 0003) : à la création d’une fiche, les échéances habituelles
 * sont créées en tâches récurrentes, modifiables ensuite comme n’importe quelle tâche.
 */
import { ajouterJours, ajouterMois } from './dates';
import type { Assignation, Recurrence, TypeFiche } from './types';

export interface TacheModele {
  titre: string;
  recurrence: Recurrence;
  /** Première échéance, en jours après la création (0 = aujourd’hui). */
  dansJours?: number;
  /** Première échéance en mois (le 1er du mois suivant pour un virement). */
  premierDuMois?: boolean;
  /** Échéance au kilométrage : intervalle ajouté au compteur actuel. */
  auKm?: boolean;
  montant?: number;
  note?: string;
}

export interface Modele {
  id: string;
  type: TypeFiche;
  /** Pour un véhicule : voiture ou moto. */
  genre?: string;
  nom: string;
  description: string;
  taches: readonly TacheModele[];
}

export const MODELES: readonly Modele[] = [
  {
    id: 'animal',
    type: 'animal',
    nom: 'Animal',
    description: 'Vaccins chaque année, vermifuge tous les 3 mois, antiparasitaire chaque mois',
    taches: [
      {
        titre: 'Vaccins chez le vétérinaire',
        recurrence: { type: 'calendaire', unite: 'an', intervalle: 1 },
        dansJours: 30,
      },
      { titre: 'Vermifuge', recurrence: { type: 'calendaire', unite: 'mois', intervalle: 3 }, dansJours: 7 },
      {
        titre: 'Antiparasitaire (puces, tiques)',
        recurrence: { type: 'calendaire', unite: 'mois', intervalle: 1 },
        dansJours: 7,
      },
    ],
  },
  {
    id: 'compte',
    type: 'compte',
    nom: 'Compte commun',
    description: 'Un virement mensuel le 1er, montant à ajuster',
    taches: [
      {
        titre: 'Virement vers le compte commun',
        recurrence: { type: 'calendaire', unite: 'mois', intervalle: 1 },
        premierDuMois: true,
        note: 'Montant à ajuster dans la tâche.',
      },
    ],
  },
  {
    id: 'voiture',
    type: 'vehicule',
    genre: 'voiture',
    nom: 'Voiture',
    description: 'Vidange tous les 15 000 km ou 12 mois, pneus tous les 6 mois, assurance chaque année',
    taches: [
      { titre: 'Vidange', recurrence: { type: 'kilometrage', km: 15000, ouMois: 12 }, auKm: true },
      {
        titre: 'Vérifier les pneus',
        recurrence: { type: 'calendaire', unite: 'mois', intervalle: 6 },
        dansJours: 30,
      },
      {
        titre: 'Renouveler l’assurance',
        recurrence: { type: 'calendaire', unite: 'an', intervalle: 1 },
        dansJours: 365,
      },
    ],
  },
  {
    id: 'moto',
    type: 'vehicule',
    genre: 'moto',
    nom: 'Moto',
    description:
      'Vidange tous les 6 000 km ou 12 mois, chaîne tous les 1 000 km, pneus chaque mois, assurance chaque année',
    taches: [
      { titre: 'Vidange', recurrence: { type: 'kilometrage', km: 6000, ouMois: 12 }, auKm: true },
      { titre: 'Graisser et tendre la chaîne', recurrence: { type: 'kilometrage', km: 1000 }, auKm: true },
      {
        titre: 'Vérifier pression et usure des pneus',
        recurrence: { type: 'calendaire', unite: 'mois', intervalle: 1 },
        dansJours: 14,
      },
      {
        titre: 'Renouveler l’assurance',
        recurrence: { type: 'calendaire', unite: 'an', intervalle: 1 },
        dansJours: 365,
      },
    ],
  },
];

/** Modèle d’un type de fiche ; pour un véhicule, celui de son genre (voiture par défaut). */
export const modelePour = (type: TypeFiche, genre?: string): Modele | undefined =>
  MODELES.find((m) => m.type === type && (m.genre === undefined || m.genre === (genre || 'voiture')));

export interface TacheCreee {
  titre: string;
  recurrence: Recurrence;
  echeance?: string | undefined;
  echeanceKm?: number | undefined;
  montant?: number | undefined;
  note?: string | undefined;
  assignation: Assignation;
}

/** Tâches à créer pour une nouvelle fiche à partir de son modèle. Fonction pure. */
export function tachesDuModele(
  modele: Modele,
  aujourdhui: string,
  assignation: Assignation,
  kmActuel?: number,
): TacheCreee[] {
  return modele.taches.map((t) => {
    let echeance: string | undefined;
    let echeanceKm: number | undefined;
    if (t.premierDuMois) echeance = `${ajouterMois(aujourdhui, 1).slice(0, 8)}01`;
    else if (t.auKm && t.recurrence.type === 'kilometrage') {
      echeanceKm = kmActuel === undefined ? undefined : kmActuel + t.recurrence.km;
      echeance = t.recurrence.ouMois ? ajouterMois(aujourdhui, t.recurrence.ouMois) : undefined;
    } else echeance = ajouterJours(aujourdhui, t.dansJours ?? 0);
    return {
      titre: t.titre,
      recurrence: t.recurrence,
      echeance,
      echeanceKm,
      montant: t.montant,
      note: t.note,
      assignation,
    };
  });
}
