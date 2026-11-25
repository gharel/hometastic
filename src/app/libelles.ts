import type { NomIcone } from './icones';
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

/** Pictogramme par défaut d’une liste, selon son type. */
const ICONE_TYPE_LISTE: Record<TypeListe, NomIcone> = {
  courses: 'panier',
  checklist: 'presse-papiers',
  sorties: 'film',
};

/** Pictogrammes proposés pour une liste (au trait, comme le reste de l’interface). */
export const ICONES_LISTE: readonly { icone: NomIcone; nom: string }[] = [
  { icone: 'panier', nom: 'Courses' },
  { icone: 'sac', nom: 'Magasins' },
  { icone: 'presse-papiers', nom: 'À cocher' },
  { icone: 'valise', nom: 'Valise' },
  { icone: 'sac-a-dos', nom: 'Sac à dos' },
  { icone: 'avion', nom: 'Voyage' },
  { icone: 'tente', nom: 'Camping' },
  { icone: 'voiture', nom: 'Voiture' },
  { icone: 'velo', nom: 'Vélo' },
  { icone: 'maison', nom: 'Maison' },
  { icone: 'marteau', nom: 'Bricolage' },
  { icone: 'pousse', nom: 'Jardin' },
  { icone: 'etincelles', nom: 'Ménage' },
  { icone: 'couverts', nom: 'Repas' },
  { icone: 'gateau', nom: 'Anniversaire' },
  { icone: 'cadeau', nom: 'Cadeaux' },
  { icone: 'sapin', nom: 'Noël' },
  { icone: 'bebe', nom: 'Bébé' },
  { icone: 'pilule', nom: 'Pharmacie' },
  { icone: 'patte', nom: 'Animaux' },
  { icone: 'vetement', nom: 'Vêtements' },
  { icone: 'ecole', nom: 'École' },
  { icone: 'livre', nom: 'Livres' },
  { icone: 'film', nom: 'Films' },
  { icone: 'musique', nom: 'Musique' },
  { icone: 'billet', nom: 'Sorties' },
  { icone: 'coeur', nom: 'Envies' },
  { icone: 'etoile', nom: 'Favoris' },
];

const NOMS_ICONES_LISTE = new Set<string>(ICONES_LISTE.map((i) => i.icone));

/** Pictogramme d’une liste : celui choisi, sinon celui de son type. */
export const iconeListe = (liste: { type: TypeListe; icone?: string | undefined }): NomIcone =>
  liste.icone && NOMS_ICONES_LISTE.has(liste.icone)
    ? (liste.icone as NomIcone)
    : ICONE_TYPE_LISTE[liste.type];

export const pluriel = (n: number, un: string, plusieurs: string) => `${n} ${n > 1 ? plusieurs : un}`;
