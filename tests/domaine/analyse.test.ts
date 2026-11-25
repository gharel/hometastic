import { describe, expect, it } from 'vitest';
import {
  activites,
  bilanDuMois,
  dureeCourses,
  equilibrer,
  frequenceMensuelle,
  historiqueMois,
  nomDuMois,
} from '../../src/domaine/analyse';
import { DOMAINES, domaineDe, dureeDe, estimer, formatDuree } from '../../src/domaine/durees';
import { terminerTache } from '../../src/domaine/recurrence';
import type { Article, Membre, Tache } from '../../src/domaine/types';
import fluent from '../../src/icones/fluent.json';

const MEMBRES: Membre[] = [
  { id: 'a', nom: 'Guillaume', couleur: 'a' },
  { id: 's', nom: 'Hélène', couleur: 'b' },
];

const tache = (t: Partial<Tache>): Tache => ({
  id: Math.random().toString(36),
  titre: 'Tâche',
  assignation: 'nous',
  creeeLe: '2026-11-01T08:00:00Z',
  historique: [],
  ...t,
});

describe('durées estimées', () => {
  it('reconnaît les tâches courantes du foyer', () => {
    expect(estimer('Préparer le repas du soir')).toEqual({ minutes: 45, domaine: 'repas' });
    expect(estimer('Lancer une machine')).toEqual({ minutes: 20, domaine: 'linge' });
    expect(estimer('Étendre le linge')).toEqual({ minutes: 15, domaine: 'linge' });
    expect(estimer('Repassage')).toEqual({ minutes: 45, domaine: 'linge' });
    expect(estimer('Passer l’aspirateur')).toEqual({ minutes: 30, domaine: 'menage' });
    expect(estimer('Sortir les poubelles')).toEqual({ minutes: 5, domaine: 'menage' });
    expect(estimer('Faire les courses')).toEqual({ minutes: 60, domaine: 'courses' });
    expect(estimer('Vaisselle')).toEqual({ minutes: 20, domaine: 'repas' });
    expect(estimer('Virement vers le compte commun').domaine).toBe('finances');
    expect(estimer('Quelque chose d’inédit')).toEqual({ minutes: 30, domaine: 'autre' });
  });

  it('la durée saisie l’emporte sur l’estimation', () => {
    expect(dureeDe({ titre: 'Ménage', duree: 90 })).toBe(90);
    expect(dureeDe({ titre: 'Ménage' })).toBe(45);
  });

  it('domaine : santé d’abord, puis titre, puis fiche', () => {
    expect(domaineDe({ titre: 'Rendez-vous', sante: true })).toBe('sante');
    expect(domaineDe({ titre: 'Vermifuge (Martine)' })).toBe('animaux');
    expect(domaineDe({ titre: 'Truc' }, { type: 'vehicule' })).toBe('voiture');
  });

  it('formate et a toutes ses icônes', () => {
    expect(formatDuree(45)).toBe('45 min');
    expect(formatDuree(60)).toBe('1 h');
    expect(formatDuree(750)).toBe('12 h 30');
    for (const d of Object.values(DOMAINES)) expect(fluent.icones).toHaveProperty(d.icone);
  });
});

describe('analyse du mois', () => {
  const machine = terminerTache(
    terminerTache(
      tache({
        titre: 'Lessive',
        echeance: '2026-11-02',
        recurrence: { type: 'calendaire', unite: 'semaine', intervalle: 1 },
      }),
      '2026-11-02',
      's',
    ),
    '2026-11-09',
    's',
  );
  const repas = terminerTache(tache({ titre: 'Repas', duree: 60, creeePar: 'a' }), '2026-11-10', 'a');
  const ancien = terminerTache(tache({ titre: 'Ménage' }), '2026-10-15', 'a');
  const courses: Article[] = [
    {
      id: '1',
      listeId: 'c',
      nom: 'Lait',
      ajoutePar: 'a',
      ajouteLe: '2026-11-05T08:00:00Z',
      coche: { par: 's', le: '2026-11-06T17:00:00Z' },
    },
    {
      id: '2',
      listeId: 'c',
      nom: 'Pain',
      ajoutePar: 'a',
      ajouteLe: '2026-11-05T08:00:00Z',
      coche: { par: 's', le: '2026-11-06T17:05:00Z' },
    },
    {
      id: '3',
      listeId: 'v',
      nom: 'Maillot',
      ajouteLe: '2026-11-05T08:00:00Z',
      coche: { par: 'a', le: '2026-11-06T10:00:00Z' },
    },
  ];
  const liste = activites([machine, repas, ancien], courses, new Set(['c']));

  it('compte chaque passage, et les courses cochées le même jour comme une séance', () => {
    expect(liste).toHaveLength(5);
    const seance = liste.find((a) => a.domaine === 'courses');
    expect(seance).toMatchObject({ membreId: 's', date: '2026-11-06', minutes: dureeCourses(2) });
    expect(dureeCourses(100)).toBe(90);
  });

  it('bilan : temps fait par chacun, charge mentale, domaines', () => {
    const bilan = bilanDuMois('2026-11', MEMBRES, liste, [machine, repas, ancien], courses);
    const alex = bilan.membres.find((b) => b.membreId === 'a');
    const sam = bilan.membres.find((b) => b.membreId === 's');
    expect(alex).toMatchObject({ minutes: 60, passages: 1, tachesCreees: 1, articlesAjoutes: 2 });
    expect(sam).toMatchObject({ minutes: 20 + 20 + 26, passages: 3 });
    expect(bilan.totalMinutes).toBe(126);
    expect(bilan.parDomaine.map((d) => d.domaine)).toEqual(['repas', 'linge', 'courses']);
  });

  it('historique sur six mois', () => {
    const h = historiqueMois('2026-11', 6, MEMBRES, liste);
    expect(h.map((x) => x.mois)).toEqual(['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11']);
    expect(h[4]?.minutes).toEqual({ a: 45, s: 0 });
  });

  it('équilibre : propose des tâches récurrentes du plus chargé', () => {
    const repassage = tache({
      titre: 'Repassage',
      assignation: 's',
      recurrence: { type: 'calendaire', unite: 'semaine', intervalle: 1 },
    });
    const sortir = tache({
      titre: 'Poubelles',
      assignation: 's',
      recurrence: { type: 'calendaire', unite: 'semaine', intervalle: 1 },
    });
    const lourd = activites(
      [terminerTache(tache({ titre: 'Ménage', duree: 300 }), '2026-11-20', 's'), repas],
      [],
      new Set(),
    );
    const bilan = bilanDuMois('2026-11', MEMBRES, lourd, [], []);
    const eq = equilibrer(bilan, [repassage, sortir]);
    expect(eq.equilibre).toBe(false);
    expect(eq.plusCharge).toBe('s');
    expect(eq.moinsCharge).toBe('a');
    expect(eq.ecart).toBe(240);
    expect(eq.pistes[0]?.tache.titre).toBe('Repassage');
    expect(eq.pistes[0]?.minutesParMois).toBe(Math.round(45 * 4.3));
  });

  it('équilibré quand l’écart est faible', () => {
    const bilan = bilanDuMois('2026-11', MEMBRES, liste, [], []);
    expect(equilibrer(bilan, []).equilibre).toBe(true);
  });

  it('fréquences et noms de mois', () => {
    expect(frequenceMensuelle({ type: 'calendaire', unite: 'mois', intervalle: 3 })).toBeCloseTo(1 / 3);
    expect(frequenceMensuelle({ type: 'apres', jours: 15 })).toBe(2);
    expect(nomDuMois('2026-11')).toBe('novembre 2026');
    expect(nomDuMois('2026-02', true)).toBe('févr.');
  });
});
