import { normaliser } from '../domaine/catalogue';
import type { TypeFiche, TypeListe, TypeProjet } from '../domaine/types';

export const TYPES_FICHE: Record<TypeFiche, { nom: string; icone: string }> = {
  maison: { nom: 'Maison', icone: 'house' },
  vehicule: { nom: 'Véhicule', icone: 'automobile' },
  personne: { nom: 'Personne', icone: 'child' },
  animal: { nom: 'Animal', icone: 'dog-face' },
  compte: { nom: 'Compte', icone: 'bank' },
  papiers: { nom: 'Papiers', icone: 'identification-card' },
  autre: { nom: 'Autre', icone: 'card-index-dividers' },
};

export const TYPES_PROJET: Record<TypeProjet, { nom: string; icone: string }> = {
  voyage: { nom: 'Voyage', icone: 'desert-island' },
  travaux: { nom: 'Travaux', icone: 'hammer-and-wrench' },
  evenement: { nom: 'Événement', icone: 'party-popper' },
  autre: { nom: 'Autre', icone: 'pushpin' },
};

export interface ChampInfo {
  cle: string;
  libelle: string;
  type: 'text' | 'date' | 'textarea';
  numerique?: boolean;
}

/** Infos clés propres à chaque type de fiche. */
export const CHAMPS_FICHE: Record<TypeFiche, readonly ChampInfo[]> = {
  maison: [
    { cle: 'adresse', libelle: 'Adresse', type: 'text' },
    { cle: 'notes', libelle: 'Notes', type: 'textarea' },
  ],
  vehicule: [
    { cle: 'modele', libelle: 'Modèle', type: 'text' },
    { cle: 'annee', libelle: 'Année', type: 'text', numerique: true },
    { cle: 'immatriculation', libelle: 'Immatriculation', type: 'text' },
    { cle: 'assurance', libelle: 'Assurance', type: 'text' },
  ],
  personne: [
    { cle: 'naissance', libelle: 'Date de naissance', type: 'date' },
    { cle: 'ecole', libelle: 'École ou crèche', type: 'text' },
    { cle: 'vetements', libelle: 'Taille de vêtements', type: 'text' },
    { cle: 'pointure', libelle: 'Pointure', type: 'text' },
  ],
  animal: [
    { cle: 'espece', libelle: 'Espèce', type: 'text' },
    { cle: 'race', libelle: 'Race', type: 'text' },
    { cle: 'naissance', libelle: 'Date de naissance', type: 'date' },
    { cle: 'puce', libelle: 'Puce ou tatouage', type: 'text' },
    { cle: 'veterinaire', libelle: 'Vétérinaire', type: 'text' },
    { cle: 'alimentation', libelle: 'Alimentation', type: 'text' },
  ],
  compte: [
    { cle: 'banque', libelle: 'Banque', type: 'text' },
    { cle: 'titulaires', libelle: 'Titulaires', type: 'text' },
    { cle: 'usage', libelle: 'À quoi il sert', type: 'text' },
    {
      cle: 'finNumero',
      libelle: 'Fin du numéro (4 chiffres, jamais le numéro complet)',
      type: 'text',
      numerique: true,
    },
  ],
  papiers: [{ cle: 'notes', libelle: 'Ce que vous y suivez', type: 'textarea' }],
  autre: [{ cle: 'notes', libelle: 'Notes', type: 'textarea' }],
};

/** Icône d’un animal d’après son espèce (« Chatte », « chiot », « lapin nain »…), sinon des empreintes. */
const ESPECES: readonly (readonly [RegExp, string])[] = [
  [/\bchat/, 'cat-face'],
  [/\bchien|\bchiot/, 'dog-face'],
  [/lapin/, 'rabbit-face'],
  [/cheval|poney|jument|ane\b/, 'horse-face'],
  [/hamster|cochon d.inde|gerbille|souris|\brat\b/, 'hamster'],
  [/tortue/, 'turtle'],
  [/poisson/, 'tropical-fish'],
  [/oiseau|perruche|perroquet|canari|poule/, 'bird'],
];

export const iconeEspece = (espece: string | undefined): string => {
  const e = normaliser(espece ?? '');
  return ESPECES.find(([motif]) => motif.test(e))?.[1] ?? 'paw-prints';
};

/** Icône d’une fiche : la moto a la sienne, l’animal celle de son espèce. */
export const iconeFiche = (fiche: { type: TypeFiche; infos?: Record<string, string> }): string =>
  fiche.type === 'vehicule' && fiche.infos?.genre === 'moto'
    ? 'motorcycle'
    : fiche.type === 'animal'
      ? iconeEspece(fiche.infos?.espece)
      : TYPES_FICHE[fiche.type].icone;

/** Illustration par défaut d’une liste, selon son type. */
const ICONE_TYPE_LISTE: Record<TypeListe, string> = {
  courses: 'shopping-cart',
  checklist: 'clipboard',
  sorties: 'clapper-board',
};

export const iconeListe = (liste: { type: TypeListe; icone?: string | undefined }): string =>
  liste.icone ?? ICONE_TYPE_LISTE[liste.type];

/** Illustrations proposées en tête du choix d’icône d’une liste (avant celles du catalogue). */
export const ICONES_LISTE: readonly { icone: string; nom: string; mots: string }[] = [
  { icone: 'shopping-cart', nom: 'Courses', mots: 'supermarche chariot' },
  { icone: 'basket', nom: 'Marché', mots: 'panier' },
  { icone: 'shopping-bags', nom: 'Magasins', mots: 'shopping vetements' },
  { icone: 'clipboard', nom: 'À cocher', mots: 'liste preparatifs' },
  { icone: 'spiral-notepad', nom: 'Notes', mots: 'bloc idees' },
  { icone: 'luggage', nom: 'Valise', mots: 'bagages voyage' },
  { icone: 'backpack', nom: 'Sac à dos', mots: 'ecole rentree randonnee' },
  { icone: 'desert-island', nom: 'Vacances', mots: 'ile' },
  { icone: 'beach-with-umbrella', nom: 'Plage', mots: 'mer baignade' },
  { icone: 'camping', nom: 'Camping', mots: 'tente' },
  { icone: 'airplane', nom: 'Voyage', mots: 'avion' },
  { icone: 'automobile', nom: 'Voiture', mots: 'route' },
  { icone: 'house', nom: 'Maison', mots: 'logement' },
  { icone: 'hammer-and-wrench', nom: 'Bricolage', mots: 'travaux outils' },
  { icone: 'seedling', nom: 'Jardin', mots: 'plantes' },
  { icone: 'broom', nom: 'Ménage', mots: 'entretien' },
  { icone: 'pot-of-food', nom: 'Repas', mots: 'menus cuisine' },
  { icone: 'party-popper', nom: 'Fête', mots: 'soiree' },
  { icone: 'birthday-cake', nom: 'Anniversaire', mots: 'gateau' },
  { icone: 'wrapped-gift', nom: 'Cadeaux', mots: 'idees cadeau' },
  { icone: 'christmas-tree', nom: 'Noël', mots: 'sapin fetes' },
  { icone: 'baby-bottle', nom: 'Bébé', mots: 'enfant' },
  { icone: 'pill', nom: 'Pharmacie', mots: 'medicaments sante' },
  { icone: 'paw-prints', nom: 'Animaux', mots: 'chat chien' },
  { icone: 'clapper-board', nom: 'Films', mots: 'cinema series a voir' },
  { icone: 'books', nom: 'Livres', mots: 'lecture' },
  { icone: 'red-heart', nom: 'Envies', mots: 'favoris coeur' },
];

export const pluriel = (n: number, un: string, plusieurs: string) => `${n} ${n > 1 ? plusieurs : un}`;
