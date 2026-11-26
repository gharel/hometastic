/**
 * Analyse du foyer : qui fait quoi (temps passé), qui y pense (charge mentale), par domaine,
 * mois par mois, et pistes pour rééquilibrer. Fonctions pures, calculées sur le téléphone.
 */
import { ajouterMois } from './dates';
import { domaineDe, dureeDe, type Domaine } from './durees';
import type { Article, Fiche, IdMembre, Membre, Recurrence, Tache } from './types';

/** Un passage fait par quelqu’un : une tâche cochée, ou une séance de courses. */
export interface Activite {
  membreId: IdMembre | undefined;
  /** AAAA-MM-JJ */
  date: string;
  minutes: number;
  domaine: Domaine;
  titre: string;
}

/** Durée estimée d’une séance de courses : 20 min, plus 3 min par article, au plus 1 h 30. */
export const dureeCourses = (nbArticles: number) => Math.min(90, 20 + 3 * nbArticles);

export function activites(
  taches: readonly Tache[],
  articles: readonly Article[],
  listesCourses: ReadonlySet<string>,
  fiches: readonly Fiche[] = [],
): Activite[] {
  const resultat: Activite[] = [];
  const ficheDe = new Map(fiches.map((f) => [f.id, f]));
  for (const t of taches) {
    const domaine = domaineDe(t, t.ficheId ? ficheDe.get(t.ficheId) : undefined);
    for (const p of [...t.historique, ...(t.faite ? [t.faite] : [])])
      resultat.push({
        membreId: p.par,
        date: p.le.slice(0, 10),
        minutes: p.duree ?? dureeDe(t),
        domaine,
        titre: t.titre,
      });
  }
  // Courses : les articles cochés le même jour par la même personne forment une séance.
  const seances = new Map<string, { membreId: IdMembre | undefined; date: string; n: number }>();
  for (const a of articles) {
    if (!a.coche || !listesCourses.has(a.listeId)) continue;
    const date = a.coche.le.slice(0, 10);
    const cle = `${a.coche.par ?? '?'}|${date}`;
    const s = seances.get(cle) ?? { membreId: a.coche.par, date, n: 0 };
    s.n++;
    seances.set(cle, s);
  }
  for (const s of seances.values())
    resultat.push({
      membreId: s.membreId,
      date: s.date,
      minutes: dureeCourses(s.n),
      domaine: 'courses',
      titre: `Courses (${s.n} article${s.n > 1 ? 's' : ''})`,
    });
  return resultat;
}

export interface BilanMembre {
  membreId: IdMembre;
  minutes: number;
  passages: number;
  /** Charge mentale : tâches créées et articles ajoutés (penser à, prévoir, organiser). */
  tachesCreees: number;
  articlesAjoutes: number;
}

export interface BilanMois {
  mois: string;
  membres: BilanMembre[];
  totalMinutes: number;
  parDomaine: { domaine: Domaine; minutes: Record<IdMembre, number>; total: number }[];
}

const duMois = (date: string | undefined, mois: string) => !!date && date.startsWith(mois);

export function bilanDuMois(
  mois: string,
  membres: readonly Membre[],
  liste: readonly Activite[],
  taches: readonly Tache[],
  articles: readonly Article[],
): BilanMois {
  const duMoisActivites = liste.filter((a) => duMois(a.date, mois));
  const bilans: BilanMembre[] = membres.map((m) => ({
    membreId: m.id,
    minutes: 0,
    passages: 0,
    tachesCreees: taches.filter((t) => t.creeePar === m.id && duMois(t.creeeLe, mois)).length,
    articlesAjoutes: articles.filter((a) => a.ajoutePar === m.id && duMois(a.ajouteLe, mois)).length,
  }));
  const domaines = new Map<Domaine, Record<IdMembre, number>>();
  for (const a of duMoisActivites) {
    const b = bilans.find((x) => x.membreId === a.membreId);
    if (!b) continue;
    b.minutes += a.minutes;
    b.passages++;
    const parMembre = domaines.get(a.domaine) ?? {};
    parMembre[b.membreId] = (parMembre[b.membreId] ?? 0) + a.minutes;
    domaines.set(a.domaine, parMembre);
  }
  return {
    mois,
    membres: bilans,
    totalMinutes: bilans.reduce((s, b) => s + b.minutes, 0),
    parDomaine: [...domaines.entries()]
      .map(([domaine, minutes]) => ({
        domaine,
        minutes,
        total: Object.values(minutes).reduce((s, v) => s + v, 0),
      }))
      .sort((a, b) => b.total - a.total),
  };
}

/** Minutes par membre sur les `n` derniers mois (le plus ancien d’abord). */
export function historiqueMois(
  moisFin: string,
  n: number,
  membres: readonly Membre[],
  liste: readonly Activite[],
): { mois: string; minutes: Record<IdMembre, number> }[] {
  return Array.from({ length: n }, (_, i) => {
    const mois = ajouterMois(`${moisFin}-01`, i - n + 1).slice(0, 7);
    const minutes: Record<IdMembre, number> = Object.fromEntries(membres.map((m) => [m.id, 0]));
    for (const a of liste)
      if (a.membreId && a.membreId in minutes && duMois(a.date, mois))
        minutes[a.membreId] = (minutes[a.membreId] ?? 0) + a.minutes;
    return { mois, minutes };
  });
}

/** Nombre moyen de passages par mois d’une récurrence. */
export function frequenceMensuelle(r: Recurrence): number {
  switch (r.type) {
    case 'calendaire': {
      const parUnite = { jour: 30, semaine: 4.3, mois: 1, an: 1 / 12 }[r.unite];
      return parUnite / Math.max(1, r.intervalle);
    }
    case 'apres':
      return 30 / Math.max(1, r.jours);
    case 'kilometrage':
      return r.ouMois ? 1 / r.ouMois : 0.1;
  }
}

export interface Piste {
  tache: Tache;
  minutesParMois: number;
}

export interface Equilibre {
  /** Écart de temps sur le mois entre le plus chargé et l’autre, en minutes. */
  ecart: number;
  plusCharge?: IdMembre | undefined;
  moinsCharge?: IdMembre | undefined;
  equilibre: boolean;
  pistes: Piste[];
}

/**
 * Équilibre entre le plus chargé et le moins chargé (à deux comme à plusieurs, spec 007) : écart
 * jugé notable au-delà de 20 % du temps total (et d’une heure).
 * Pistes : tâches récurrentes confiées au plus chargé (ou « au premier libre »), dont le temps mensuel
 * comble le mieux la moitié de l’écart. Rien n’est imposé : ce sont des propositions.
 */
export function equilibrer(bilan: BilanMois, taches: readonly Tache[]): Equilibre {
  const tries = [...bilan.membres].sort((x, y) => y.minutes - x.minutes);
  const a = tries[0];
  const b = tries.at(-1);
  if (a === b) return { ecart: 0, equilibre: true, pistes: [] };
  if (!a || !b) return { ecart: 0, equilibre: true, pistes: [] };
  const ecart = a.minutes - b.minutes;
  const equilibre = ecart <= Math.max(60, 0.2 * bilan.totalMinutes);
  if (equilibre) return { ecart, plusCharge: a.membreId, moinsCharge: b.membreId, equilibre, pistes: [] };
  const cible = ecart / 2;
  const pistes = taches
    .filter((t) => t.recurrence && !t.faite && (t.assignation === a.membreId || t.assignation === 'libre'))
    .map((t) => ({
      tache: t,
      minutesParMois: Math.round(dureeDe(t) * frequenceMensuelle(t.recurrence as Recurrence)),
    }))
    .filter((p) => p.minutesParMois > 0)
    .sort((x, y) => Math.abs(x.minutesParMois - cible) - Math.abs(y.minutesParMois - cible))
    .slice(0, 3);
  return { ecart, plusCharge: a.membreId, moinsCharge: b.membreId, equilibre, pistes };
}

const MOIS = [
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

/** « novembre 2026 » ; court : « nov. ». */
export function nomDuMois(mois: string, court = false): string {
  const [annee = '', m = '1'] = mois.split('-');
  const i = Number(m) - 1;
  return court ? (MOIS_COURTS[i] ?? '') : `${MOIS[i] ?? ''} ${annee}`;
}
