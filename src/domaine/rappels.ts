/**
 * Quels rappels envoyer maintenant (lu par outils/rappels.mjs dans GitHub Actions, sans dépendance :
 * Node l’exécute directement). Une tâche non faite avec une échéance est rappelée à son heure
 * (8 h par défaut) dans le fuseau du foyer, une seule fois, au plus tard 24 h après.
 */

export interface TacheARappeler {
  id: string;
  titre?: string | undefined;
  sante?: boolean | undefined;
  echeance?: string | undefined;
  heure?: string | undefined;
  faite?: unknown;
  assignation?: string | undefined;
}

export interface Rappel {
  cle: string;
  titre: string;
  corps: string;
  /** Membres à prévenir ; `tous` pour « nous deux » ou « au premier libre ». */
  pour: string[] | 'tous';
}

/** Décalage du fuseau à cet instant, en minutes (heure locale moins UTC). */
export function decalage(instant: number, fuseau: string): number {
  const parties = new Intl.DateTimeFormat('en-US', {
    timeZone: fuseau,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date(instant));
  const v = (type: string) => Number(parties.find((p) => p.type === type)?.value);
  const local = Date.UTC(v('year'), v('month') - 1, v('day'), v('hour'), v('minute'));
  return Math.round((local - instant) / 60_000);
}

/** Instant UTC (ms) d’une date et heure locales dans un fuseau, changements d’heure compris. */
export function instantLocal(date: string, heure: string, fuseau: string): number {
  const [a = 0, m = 1, j = 1] = date.split('-').map(Number);
  const [h = 0, mi = 0] = heure.split(':').map(Number);
  const suppose = Date.UTC(a, m - 1, j, h, mi);
  let instant = suppose - decalage(suppose, fuseau) * 60_000;
  const corrige = decalage(instant, fuseau);
  instant = suppose - corrige * 60_000;
  return instant;
}

const RETARD_MAX = 24 * 3_600_000;

export function rappelsDus(
  taches: readonly TacheARappeler[],
  maintenant: number,
  fuseau: string,
  dejaEnvoyes: ReadonlySet<string>,
  heureParDefaut = '08:00',
): Rappel[] {
  const rappels: Rappel[] = [];
  for (const t of taches) {
    if (t.faite || !t.echeance) continue;
    const heure = t.heure || heureParDefaut;
    const cle = `${t.id}_${t.echeance}_${heure.replace(':', 'h')}`;
    if (dejaEnvoyes.has(cle)) continue;
    const instant = instantLocal(t.echeance, heure, fuseau);
    if (instant > maintenant || instant <= maintenant - RETARD_MAX) continue;
    const pour =
      t.assignation && t.assignation !== 'nous' && t.assignation !== 'libre' ? [t.assignation] : 'tous';
    rappels.push({
      cle,
      // La santé est chiffrée : le serveur ne connaît pas le titre et n’en dit rien (ADR 0004).
      titre: t.sante ? 'Rappel santé' : t.titre || 'Rappel',
      corps: t.heure ? `À ${t.heure.replace(':', ' h ')}` : 'Prévu aujourd’hui',
      pour,
    });
  }
  return rappels;
}
