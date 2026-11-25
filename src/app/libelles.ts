import type { TypeFiche, TypeProjet } from '../domaine/types';

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

export const pluriel = (n: number, un: string, plusieurs: string) => `${n} ${n > 1 ? plusieurs : un}`;
