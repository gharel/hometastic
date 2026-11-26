import { enregistrerTache } from '../app/actions';
import { annoncer, articles, aujourdhui, fiches, listes, membres, taches } from '../app/etat';
import { Icone, Illustration } from '../app/icones';
import { pluriel } from '../app/libelles';
import { BlocTete, Retour, Vide } from '../composants/communs';
import {
  activites,
  bilanDuMois,
  equilibrer,
  historiqueMois,
  nomDuMois,
  type Piste,
} from '../domaine/analyse';
import { ajouterMois } from '../domaine/dates';
import { DOMAINES, formatDuree } from '../domaine/durees';
import { que } from '../domaine/francais';
import { decrireRecurrence } from '../domaine/recurrence';
import type { IdMembre, Membre } from '../domaine/types';

const pourcent = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

/**
 * Barre partagée entre les membres. Les chiffres sont dans la légende et l’étiquette accessible
 * (jamais la couleur seule), pas dans la barre où ils se couperaient.
 */
function Partage({ valeurs }: { valeurs: Record<IdMembre, number> }) {
  const total = Object.values(valeurs).reduce((s, v) => s + v, 0);
  const ms = membres.value;
  const libelle = ms.map((m) => `${m.nom} ${pourcent(valeurs[m.id] ?? 0, total)}\u00a0%`).join(', ');
  return (
    <div class="partage" role="img" aria-label={total ? libelle : 'Rien ce mois-ci'}>
      {total === 0 ? (
        <span class="vide-barre" />
      ) : (
        ms.map((m) => {
          const p = pourcent(valeurs[m.id] ?? 0, total);
          return p > 0 ? (
            <span key={m.id} class={m.couleur} style={{ width: `${p}%` }} aria-hidden="true" />
          ) : null;
        })
      )}
    </div>
  );
}

function LignePiste({ piste, vers }: { piste: Piste; vers: Membre }) {
  const t = piste.tache;
  return (
    <li>
      <div class="ligne">
        <Icone nom="repeter" />
        <span>
          <strong>{t.titre}</strong>
          <span class="sous">
            {t.recurrence ? decrireRecurrence(t.recurrence) : ''} · environ{' '}
            {formatDuree(piste.minutesParMois)} par mois
          </span>
        </span>
        <button
          type="button"
          class="bouton bouton-petit"
          onClick={async () => {
            await enregistrerTache({ ...t, assignation: vers.id });
            annoncer(`« ${t.titre} » confiée à ${vers.nom}`);
          }}
        >
          Confier à {vers.nom}
        </button>
      </div>
    </li>
  );
}

export function Analyse({ mois }: { mois?: string | undefined }) {
  const moisActuel = aujourdhui.value.slice(0, 7);
  const moisVu = mois && mois <= moisActuel ? mois : moisActuel;
  const ms = membres.value;
  const courses = new Set(listes.value.filter((l) => l.type === 'courses').map((l) => l.id));
  const liste = activites(taches.value, articles.value, courses, fiches.value);
  const bilan = bilanDuMois(moisVu, ms, liste, taches.value, articles.value);
  const historique = historiqueMois(moisVu, 6, ms, liste);
  const equilibre = equilibrer(bilan, taches.value);
  const nom = (id: IdMembre | undefined) => ms.find((m) => m.id === id)?.nom ?? '';
  const moinsCharge = ms.find((m) => m.id === equilibre.moinsCharge);
  const precedent = ajouterMois(`${moisVu}-01`, -1).slice(0, 7);
  const suivant = ajouterMois(`${moisVu}-01`, 1).slice(0, 7);
  const temps = Object.fromEntries(bilan.membres.map((b) => [b.membreId, b.minutes]));
  const pensee = Object.fromEntries(
    bilan.membres.map((b) => [b.membreId, b.tachesCreees + b.articlesAjoutes]),
  );
  const maxHisto = Math.max(1, ...historique.map((h) => Object.values(h.minutes).reduce((s, v) => s + v, 0)));

  return (
    <section class="vue" aria-labelledby="titre-analyse">
      <Retour href="#/nous" libelle="Nous" />
      <h1 id="titre-analyse" tabIndex={-1}>
        Analyse
      </h1>
      <div class="mois-nav">
        <a
          class="bouton bouton-icone"
          href={`#/analyse/${precedent}`}
          aria-label={`Mois précédent : ${nomDuMois(precedent)}`}
        >
          <Icone nom="chevronGauche" />
        </a>
        <strong aria-live="polite">{nomDuMois(moisVu).replace(/^./, (c) => c.toUpperCase())}</strong>
        {suivant <= moisActuel ? (
          <a
            class="bouton bouton-icone"
            href={`#/analyse/${suivant}`}
            aria-label={`Mois suivant : ${nomDuMois(suivant)}`}
          >
            <Icone nom="chevronDroite" />
          </a>
        ) : (
          <span class="bouton-icone-vide" />
        )}
      </div>

      <section class="bloc" aria-labelledby="t-temps">
        <BlocTete titre="Qui fait quoi" id="t-temps">
          <span class="mono">{formatDuree(bilan.totalMinutes)} en tout</span>
        </BlocTete>
        {bilan.totalMinutes === 0 ? (
          <Vide>
            Rien de coché ce mois-ci. Le temps se compte quand une tâche est faite ou des courses cochées.
          </Vide>
        ) : (
          <div class="carte analyse-carte">
            <Partage valeurs={temps} />
            <ul class="legende-membres">
              {bilan.membres.map((b) => (
                <li key={b.membreId}>
                  <span
                    class={`pastille-membre ${ms.find((m) => m.id === b.membreId)?.couleur ?? ''}`}
                    aria-hidden="true"
                  />
                  <strong>{nom(b.membreId)}</strong> {formatDuree(b.minutes)} ·{' '}
                  {pluriel(b.passages, 'tâche', 'tâches')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section class="bloc" aria-labelledby="t-charge">
        <BlocTete titre="Charge mentale" id="t-charge">
          <span class="mono">Qui y pense</span>
        </BlocTete>
        <div class="carte analyse-carte">
          <Partage valeurs={pensee} />
          <ul class="legende-membres">
            {bilan.membres.map((b) => (
              <li key={b.membreId}>
                <span
                  class={`pastille-membre ${ms.find((m) => m.id === b.membreId)?.couleur ?? ''}`}
                  aria-hidden="true"
                />
                <strong>{nom(b.membreId)}</strong> {pluriel(b.tachesCreees, 'tâche prévue', 'tâches prévues')}{' '}
                · {pluriel(b.articlesAjoutes, 'article ajouté', 'articles ajoutés')}
              </li>
            ))}
          </ul>
          <p class="aide">
            Penser à prévoir, noter, organiser : les tâches créées et les articles ajoutés aux listes.
          </p>
        </div>
      </section>

      {ms.length > 1 && bilan.totalMinutes > 0 && (
        <section class="bloc" aria-labelledby="t-equilibre">
          <BlocTete titre="Équilibre" id="t-equilibre" />
          {equilibre.equilibre ? (
            <p class="chiffre">
              <Illustration nom="balance-scale" />
              <span>
                {equilibre.ecart > 0 &&
                bilan.membres.find((m) => m.membreId === equilibre.moinsCharge)?.minutes === 0
                  ? 'Encore peu de temps compté ce mois-ci : trop tôt pour parler d’équilibre.'
                  : `Plutôt équilibré ce mois-ci. Merci à ${ms.length > 2 ? 'tous' : 'vous deux'}.`}
              </span>
            </p>
          ) : (
            <>
              <p class="chiffre">
                <Illustration nom="balance-scale" />
                <span>
                  {nom(equilibre.plusCharge)} a passé {formatDuree(equilibre.ecart)} de plus{' '}
                  {que(nom(equilibre.moinsCharge))} ce mois-ci.
                  {equilibre.pistes.length > 0 && moinsCharge
                    ? ` Pour rééquilibrer, ${moinsCharge.nom} pourrait prendre :`
                    : ' Parlez-en au point de la semaine.'}
                </span>
              </p>
              {equilibre.pistes.length > 0 && moinsCharge && (
                <ul class="lignes" style={{ marginTop: '10px' }}>
                  {equilibre.pistes.map((p) => (
                    <LignePiste key={p.tache.id} piste={p} vers={moinsCharge} />
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      )}

      {bilan.parDomaine.length > 0 && (
        <section class="bloc" aria-labelledby="t-domaines">
          <BlocTete titre="Par domaine" id="t-domaines">
            <span class="mono">Temps passé</span>
          </BlocTete>
          <ul class="lignes">
            {bilan.parDomaine.map((d) => (
              <li key={d.domaine}>
                <div class="ligne ligne-domaine">
                  <Illustration nom={DOMAINES[d.domaine].icone} />
                  <span>
                    <strong>{DOMAINES[d.domaine].nom}</strong>
                    <span class="sous">
                      {ms
                        .filter((m) => d.minutes[m.id])
                        .map((m) => `${m.nom} ${formatDuree(d.minutes[m.id] ?? 0)}`)
                        .join(' · ')}
                    </span>
                    <Partage valeurs={d.minutes} />
                  </span>
                  <span class="droite">{formatDuree(d.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section class="bloc" aria-labelledby="t-historique-analyse">
        <BlocTete titre="Six derniers mois" id="t-historique-analyse" />
        <ul class="lignes historique-mois">
          {historique.map((h) => {
            const total = Object.values(h.minutes).reduce((s, v) => s + v, 0);
            return (
              <li key={h.mois}>
                <a
                  class="ligne"
                  href={`#/analyse/${h.mois}`}
                  aria-current={h.mois === moisVu ? 'true' : undefined}
                >
                  <strong class="mois-court">{nomDuMois(h.mois, true)}</strong>
                  <span class="barre-histo" style={{ '--l': `${pourcent(total, maxHisto)}%` }}>
                    <Partage valeurs={h.minutes} />
                  </span>
                  <span class="droite">{total ? formatDuree(total) : '-'}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section class="bloc" aria-labelledby="t-calcul">
        <BlocTete titre="Comment c’est calculé" id="t-calcul">
          <Illustration nom="stopwatch" />
        </BlocTete>
        <ul class="explications">
          <li>
            Chaque tâche cochée compte pour la personne qui l’a cochée, avec sa durée : celle saisie dans la
            tâche, sinon une estimation d’après le titre (repas 45 min, lessive 20 min, ménage 45 min,
            poubelles 5 min…).
          </li>
          <li>
            Les courses comptent pour qui coche les articles : 20 min, plus 3 min par article coché le même
            jour.
          </li>
          <li>La charge mentale compte les tâches créées et les articles ajoutés.</li>
          <li>
            Tout est calculé sur ce téléphone, sans classement : un repère pour en parler, pas un tribunal.
          </li>
        </ul>
      </section>
    </section>
  );
}
