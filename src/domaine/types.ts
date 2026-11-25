/** Modèle de données de Nid : quatre briques (Liste, Tâche, Fiche, Projet) et leurs compléments (ADR 0003). */

export type IdMembre = string;
/** Un membre précis, les deux ensemble, ou le premier qui s’en charge. */
export type Assignation = IdMembre | 'nous' | 'libre';

export interface Membre {
  id: IdMembre;
  nom: string;
  /** Couleur d’avatar : a = vert sapin, b = terre cuite. */
  couleur: 'a' | 'b';
}

export interface Foyer {
  id: 'foyer';
  nom: string;
  membres: Membre[];
  devise: 'XPF' | 'EUR';
  creeLe: string;
}

/** Une liste, une tâche peut être rattachée à une fiche ou à un projet. */
export interface Rattachement {
  ficheId?: string | undefined;
  projetId?: string | undefined;
}

// ---------- Liste ----------
export type TypeListe = 'courses' | 'checklist' | 'sorties';

export interface Liste extends Rattachement {
  id: string;
  nom: string;
  type: TypeListe;
  ordre: number;
  creeLe: string;
}

export interface Article {
  id: string;
  listeId: string;
  nom: string;
  /** Identifiant du produit du catalogue (icône, rayon), absent pour un article libre. */
  produitId?: string | undefined;
  precision?: string | undefined;
  urgent?: boolean | undefined;
  ajoutePar?: IdMembre | undefined;
  ajouteLe: string;
  /** Courses : acheté ; À voir : vu ; à cocher : fait. */
  coche?: { par?: IdMembre | undefined; le: string } | undefined;
  // Liste « À voir » (films, spectacles, soirées) :
  categorie?: CategorieSortie | undefined;
  /** Date de la séance ou de la soirée (AAAA-MM-JJ). */
  date?: string | undefined;
  lieu?: string | undefined;
  billet?: EtatBillet | undefined;
  /** Tâche « Acheter les billets » créée pour cette sortie. */
  tacheId?: string | undefined;
}

export type CategorieSortie = 'film' | 'serie' | 'spectacle' | 'concert' | 'soiree' | 'expo' | 'autre';
export type EtatBillet = 'aucun' | 'a-acheter' | 'achete';

// ---------- Tâche ----------
export type UniteCalendaire = 'jour' | 'semaine' | 'mois' | 'an';

export type Recurrence =
  | { type: 'calendaire'; unite: UniteCalendaire; intervalle: number }
  | { type: 'apres'; jours: number }
  | { type: 'kilometrage'; km: number; ouMois?: number | undefined };

export interface Passage {
  par?: IdMembre | undefined;
  le: string;
  km?: number | undefined;
}

export interface Tache extends Rattachement {
  id: string;
  titre: string;
  note?: string | undefined;
  assignation: Assignation;
  /** Date AAAA-MM-JJ. */
  echeance?: string | undefined;
  /** Heure HH:MM. */
  heure?: string | undefined;
  /** Échéance au kilométrage (véhicule rattaché). */
  echeanceKm?: number | undefined;
  recurrence?: Recurrence | undefined;
  /** Contenu de santé : titre et note chiffrés avant tout stockage (ADR 0004). */
  sante?: boolean | undefined;
  /** Montant (virement, facture) : à chaque passage, une entrée est ajoutée à l’historique de la fiche. */
  montant?: number | undefined;
  creeePar?: IdMembre | undefined;
  creeeLe: string;
  faite?: Passage | undefined;
  /** Passages précédents d’une tâche récurrente. */
  historique: Passage[];
}

// ---------- Fiche ----------
export type TypeFiche = 'maison' | 'vehicule' | 'personne' | 'animal' | 'compte' | 'papiers' | 'autre';

export interface Sante {
  allergies: string;
  traitements: string;
  vaccins: string;
  notes: string;
}

export interface Fiche {
  id: string;
  type: TypeFiche;
  nom: string;
  /** Infos clés propres au type (modèle, année, date de naissance, pointure…). */
  infos: Record<string, string>;
  /** Véhicule : dernier kilométrage relevé. */
  km?: { valeur: number; le: string; par?: IdMembre | undefined } | undefined;
  /** Personne : partie santé, chiffrée avant tout stockage (ADR 0004). */
  sante?: Sante | undefined;
  creeLe: string;
}

/** Une ligne d’historique d’une fiche : entretien, réparation, rendez-vous passé, renouvellement… */
export interface Entree {
  id: string;
  ficheId: string;
  date: string;
  titre: string;
  note?: string | undefined;
  cout?: number | undefined;
  km?: number | undefined;
  prestataire?: string | undefined;
  sante?: boolean | undefined;
  par?: IdMembre | undefined;
}

// ---------- Projet ----------
export type TypeProjet = 'voyage' | 'travaux' | 'evenement' | 'autre';

export interface Projet {
  id: string;
  type: TypeProjet;
  nom: string;
  debut?: string | undefined;
  fin?: string | undefined;
  lieu?: string | undefined;
  budget?: number | undefined;
  note?: string | undefined;
  archive: boolean;
  creeLe: string;
}

export interface Depense {
  id: string;
  projetId: string;
  libelle: string;
  montant: number;
  date: string;
  par?: IdMembre | undefined;
}

// ---------- Collections ----------
export interface Collections {
  listes: Liste;
  articles: Article;
  taches: Tache;
  fiches: Fiche;
  entrees: Entree;
  projets: Projet;
  depenses: Depense;
}

export type NomCollection = keyof Collections;

export const COLLECTIONS: readonly NomCollection[] = [
  'listes',
  'articles',
  'taches',
  'fiches',
  'entrees',
  'projets',
  'depenses',
];
