/** Dates « calendrier » au format AAAA-MM-JJ, sans fuseau : calculs sûrs et déterministes. */

const MOIS_COURTS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];
const MOIS_LONGS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const deuxChiffres = (n: number) => String(n).padStart(2, '0');

export function versIso(annee: number, mois: number, jour: number): string {
  return `${String(annee).padStart(4, '0')}-${deuxChiffres(mois)}-${deuxChiffres(jour)}`;
}

/** Date locale du jour (celle du téléphone). */
export function aujourdhuiIso(maintenant: Date = new Date()): string {
  return versIso(maintenant.getFullYear(), maintenant.getMonth() + 1, maintenant.getDate());
}

export function estDateIso(texte: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texte)) return false;
  const [a, m, j] = decouper(texte);
  return m >= 1 && m <= 12 && j >= 1 && j <= joursDansLeMois(a, m);
}

function decouper(iso: string): [number, number, number] {
  const [a = 0, m = 1, j = 1] = iso.split('-').map(Number);
  return [a, m, j];
}

function joursDansLeMois(annee: number, mois: number): number {
  return new Date(Date.UTC(annee, mois, 0)).getUTCDate();
}

const enJours = (iso: string) => {
  const [a, m, j] = decouper(iso);
  return Math.round(Date.UTC(a, m - 1, j) / 86_400_000);
};

const depuisJours = (n: number) => {
  const d = new Date(n * 86_400_000);
  return versIso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
};

export function ajouterJours(iso: string, jours: number): string {
  return depuisJours(enJours(iso) + jours);
}

/** Ajoute des mois en gardant le jour, ramené au dernier jour du mois si besoin (31 janv. + 1 mois = 28 ou 29 févr.). */
export function ajouterMois(iso: string, mois: number): string {
  const [a, m, j] = decouper(iso);
  const total = a * 12 + (m - 1) + mois;
  const annee = Math.floor(total / 12);
  const moisCible = (total % 12) + 1;
  return versIso(annee, moisCible, Math.min(j, joursDansLeMois(annee, moisCible)));
}

/** Nombre de jours de `de` à `a` (positif si `a` est après). */
export function ecartJours(de: string, a: string): number {
  return enJours(a) - enJours(de);
}

/** « 12 janv. », avec l’année si elle n’est pas celle de référence. */
export function formatCourt(iso: string, reference?: string): string {
  const [a, m, j] = decouper(iso);
  const annee = reference && decouper(reference)[0] !== a ? ` ${a}` : '';
  return `${j === 1 ? '1er' : j} ${MOIS_COURTS[m - 1] ?? ''}${annee}`;
}

/** « mercredi 25 novembre ». */
export function formatLong(iso: string): string {
  const [a, m, j] = decouper(iso);
  const jour = JOURS[new Date(Date.UTC(a, m - 1, j)).getUTCDay()] ?? '';
  return `${jour} ${j === 1 ? '1er' : j} ${MOIS_LONGS[m - 1] ?? ''}`;
}

/** « Aujourd’hui », « Demain », « Dans 3 j », « En retard de 2 j ». */
export function relatif(iso: string, aujourdhui: string): string {
  const ecart = ecartJours(aujourdhui, iso);
  if (ecart === 0) return 'Aujourd’hui';
  if (ecart === 1) return 'Demain';
  if (ecart === -1) return 'Hier';
  if (ecart > 1) return `Dans ${ecart} j`;
  return `En retard de ${-ecart} j`;
}
