/**
 * Durées estimées des tâches du foyer et leur domaine (Repas, Linge, Ménage…), d’après le titre
 * ou la fiche rattachée. Estimations prudentes, toujours modifiables dans la tâche.
 */
import type { Fiche, Tache } from './types';

export type Domaine =
  | 'repas'
  | 'courses'
  | 'linge'
  | 'menage'
  | 'enfants'
  | 'sante'
  | 'animaux'
  | 'administratif'
  | 'finances'
  | 'voiture'
  | 'maison'
  | 'sorties'
  | 'autre';

export const DOMAINES: Record<Domaine, { nom: string; icone: string }> = {
  repas: { nom: 'Repas', icone: 'pot-of-food' },
  courses: { nom: 'Courses', icone: 'shopping-cart' },
  linge: { nom: 'Linge', icone: 'basket' },
  menage: { nom: 'Ménage', icone: 'broom' },
  enfants: { nom: 'Enfants', icone: 'child' },
  sante: { nom: 'Santé', icone: 'stethoscope' },
  animaux: { nom: 'Animaux', icone: 'dog-face' },
  administratif: { nom: 'Administratif', icone: 'receipt' },
  finances: { nom: 'Finances', icone: 'money-bag' },
  voiture: { nom: 'Voiture', icone: 'automobile' },
  maison: { nom: 'Maison et jardin', icone: 'house' },
  sorties: { nom: 'Sorties', icone: 'admission-tickets' },
  autre: { nom: 'Autre', icone: 'card-index-dividers' },
};

/** [motif du titre, minutes, domaine] : le premier motif qui correspond l’emporte. */
const REGLES: readonly (readonly [RegExp, number, Domaine])[] = [
  [/repass/, 45, 'linge'],
  [/[ée]tendre|plier|ranger le linge/, 15, 'linge'],
  [/lessive|machine|linge|s[èe]che.linge/, 20, 'linge'],
  [/vaisselle/, 20, 'repas'],
  [/batch|fourn[ée]e/, 150, 'repas'],
  [/repas|cuisin|d[îi]ner|d[ée]jeuner|petit.d[ée]j|pr[ée]parer (le|à) manger|go[ûu]ter/, 45, 'repas'],
  [/menus?\b|planifier les repas/, 20, 'repas'],
  [/courses|supermarch|march[ée]|drive/, 60, 'courses'],
  [/poubelle|tri\b|recyclage/, 5, 'menage'],
  [/aspirateur|serpill|sol\b|sols\b/, 30, 'menage'],
  [/poussi[èe]re|vitres?/, 30, 'menage'],
  [/douche|baignoire|salle de bains?|toilettes|wc\b/, 25, 'menage'],
  [/m[ée]nage|nettoy|ranger|frigo|four\b|hotte/, 45, 'menage'],
  [/draps|lit\b/, 15, 'menage'],
  [/couches?|biberon|bain de|habiller/, 15, 'enfants'],
  [/cr[èe]che|[ée]cole|devoirs|nounou|garde/, 30, 'enfants'],
  [/p[ée]diatre|m[ée]decin|dentiste|vaccin|ordonnance|pharmacie|kin[ée]|ost[ée]o/, 60, 'sante'],
  [/v[ée]t[ée]rinaire|v[ée]to\b/, 60, 'animaux'],
  [/promen|sortir le chien/, 30, 'animaux'],
  [/vermifuge|antiparasit|liti[èe]re|croquettes|nourrir/, 10, 'animaux'],
  [/virement|[ée]pargne|budget|relev[ée]s?/, 10, 'finances'],
  [/imp[ôo]ts|d[ée]claration/, 90, 'administratif'],
  [
    /payer|facture|assurance|papiers|dossier|passeport|carte d.identit|banque|mutuelle|caf\b|appeler|t[ée]l[ée]phoner|rendez.vous|rdv/,
    20,
    'administratif',
  ],
  [/vidange|contr[ôo]le technique|garage|pneus|carrosserie/, 90, 'voiture'],
  [/laver la voiture|essence|plein\b/, 20, 'voiture'],
  [/tondre|pelouse|jardin|haie|taille/, 60, 'maison'],
  [/arroser|plantes/, 10, 'maison'],
  [/peindre|peinture|bricol|r[ée]parer|monter|installer/, 120, 'maison'],
  [/filtre|clim|chauffe.eau|d[ée]tecteur|ampoule/, 15, 'maison'],
  [/billets?|r[ée]server|cin[ée]ma|spectacle|concert/, 15, 'sorties'],
  [/valise|bagages?/, 45, 'autre'],
];

const DEFAUT = { minutes: 30, domaine: 'autre' as Domaine };

const sansAccentsMinuscules = (t: string) => t.toLowerCase().replace(/[’']/g, ' ');

/** Estimation d’après le titre seul. */
export function estimer(titre: string): { minutes: number; domaine: Domaine } {
  const t = sansAccentsMinuscules(titre);
  for (const [motif, minutes, domaine] of REGLES) if (motif.test(t)) return { minutes, domaine };
  return DEFAUT;
}

const DOMAINE_DE_FICHE: Partial<Record<Fiche['type'], Domaine>> = {
  vehicule: 'voiture',
  animal: 'animaux',
  compte: 'finances',
  personne: 'enfants',
  maison: 'maison',
  papiers: 'administratif',
};

/** Domaine d’une tâche : santé d’abord, puis le titre, puis la fiche rattachée. */
export function domaineDe(tache: Pick<Tache, 'titre' | 'sante'>, fiche?: Pick<Fiche, 'type'>): Domaine {
  if (tache.sante) return 'sante';
  const parTitre = estimer(tache.titre).domaine;
  if (parTitre !== 'autre') return parTitre;
  return (fiche && DOMAINE_DE_FICHE[fiche.type]) ?? 'autre';
}

/** Durée retenue : celle saisie dans la tâche, sinon l’estimation d’après le titre. */
export const dureeDe = (tache: Pick<Tache, 'titre' | 'duree'>): number =>
  tache.duree ?? estimer(tache.titre).minutes;

/** « 45 min », « 1 h », « 12 h 30 ». Espaces ordinaires : la typographie les rend insécables. */
export function formatDuree(minutes: number): string {
  const m = Math.round(minutes);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const reste = m % 60;
  return reste ? `${h} h ${String(reste).padStart(2, '0')}` : `${h} h`;
}
