import { computed, signal } from '@preact/signals';
import { aujourdhuiIso } from '../domaine/dates';
import type {
  Article,
  Depense,
  Entree,
  Fiche,
  Foyer,
  Liste,
  Membre,
  Projet,
  Rattachement,
  Tache,
} from '../domaine/types';
import type { Depot } from '../donnees/depot';
import { lireAncre, type Route } from './routage';

// ---------- Données (alimentées par le dépôt) ----------
export const foyer = signal<Foyer | undefined>(undefined);
export const pret = signal(false);
export const listes = signal<Liste[]>([]);
export const articles = signal<Article[]>([]);
export const taches = signal<Tache[]>([]);
export const fiches = signal<Fiche[]>([]);
export const entrees = signal<Entree[]>([]);
export const projets = signal<Projet[]>([]);
export const depenses = signal<Depense[]>([]);

// ---------- Interface ----------
export const route = signal<Route>(lireAncre(typeof location === 'undefined' ? '' : location.hash));
export const aujourdhui = signal(aujourdhuiIso());
export const annonce = signal<{ texte: string; n: number } | undefined>(undefined);

export type Feuille =
  | { type: 'ajout' }
  | { type: 'tache'; tache?: Tache | undefined; defauts?: Partial<Tache> | undefined }
  | { type: 'fiche'; fiche?: Fiche | undefined }
  | { type: 'sante'; fiche: Fiche }
  | { type: 'km'; fiche: Fiche }
  | { type: 'entree'; ficheId: string; entree?: Entree | undefined }
  | { type: 'projet'; projet?: Projet | undefined }
  | { type: 'depense'; projetId: string; depense?: Depense | undefined }
  | { type: 'liste'; liste?: Liste | undefined; defauts?: Partial<Liste> | undefined }
  | { type: 'article'; article: Article }
  | { type: 'sortie'; listeId: string; sortie?: Article | undefined }
  | { type: 'foyer' };

export const feuille = signal<Feuille | undefined>(undefined);
export const ouvrir = (f: Feuille) => (feuille.value = f);
export const fermer = () => (feuille.value = undefined);

let compteurAnnonces = 0;
export function annoncer(texte: string): void {
  annonce.value = { texte, n: ++compteurAnnonces };
}

// ---------- Membre de ce téléphone ----------
const CLE_MEMBRE = 'nid:membre';

function lireMembre(): string | undefined {
  try {
    return localStorage.getItem(CLE_MEMBRE) ?? undefined;
  } catch {
    return undefined;
  }
}

export const membreCourant = signal<string | undefined>(
  typeof localStorage === 'undefined' ? undefined : lireMembre(),
);

export function choisirMembre(id: string): void {
  membreCourant.value = id;
  try {
    localStorage.setItem(CLE_MEMBRE, id);
  } catch {
    // Stockage bloqué : le choix vaut pour cette session.
  }
}

export const membres = computed<Membre[]>(() => foyer.value?.membres ?? []);
export const moi = computed(
  () => membres.value.find((m) => m.id === membreCourant.value) ?? membres.value[0],
);
/** Les autres membres du foyer (un seul en couple, plusieurs en famille ou en colocation). */
export const autres = computed(() => membres.value.filter((m) => m.id !== moi.value?.id));
export const devise = computed(() => foyer.value?.devise ?? 'XPF');

export const kmParFiche = computed<Record<string, number>>(() =>
  Object.fromEntries(fiches.value.flatMap((f) => (f.km ? [[f.id, f.km.valeur]] : []))),
);

/** Nom lisible d’un rattachement (« Voiture de Guillaume », « Vacances »). */
export function nomRattachement(r: Rattachement): string | undefined {
  if (r.ficheId) return fiches.value.find((f) => f.id === r.ficheId)?.nom;
  if (r.projetId) return projets.value.find((p) => p.id === r.projetId)?.nom;
  return undefined;
}

// ---------- Démarrage ----------
let depotCourant: Depot | undefined;

export function depot(): Depot {
  if (!depotCourant) throw new Error('Dépôt non démarré');
  return depotCourant;
}

export async function demarrer(d: Depot): Promise<void> {
  depotCourant = d;
  await d.ouvrir();
  d.ecouterFoyer((f) => {
    foyer.value = f;
    pret.value = true;
  });
  d.ecouter(
    'listes',
    (v) => (listes.value = v.sort((a, b) => a.ordre - b.ordre || a.creeLe.localeCompare(b.creeLe))),
  );
  d.ecouter('articles', (v) => (articles.value = v));
  d.ecouter('taches', (v) => (taches.value = v));
  d.ecouter('fiches', (v) => (fiches.value = v.sort((a, b) => a.creeLe.localeCompare(b.creeLe))));
  d.ecouter('entrees', (v) => (entrees.value = v));
  d.ecouter('projets', (v) => (projets.value = v));
  d.ecouter('depenses', (v) => (depenses.value = v));
  // La date du jour change à minuit, ou au retour dans l’app.
  addEventListener('visibilitychange', () => (aujourdhui.value = aujourdhuiIso()));
}
