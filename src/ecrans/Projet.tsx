import { aujourdhui, depenses, devise, listes, ouvrir, projets, taches } from '../app/etat';
import { Icone, Illustration } from '../app/icones';
import { TYPES_PROJET } from '../app/libelles';
import { BlocTete, ListeTaches, Retour, Vide } from '../composants/communs';
import { formatCourt } from '../domaine/dates';
import { formatMontant } from '../domaine/montants';
import { avancement, compteARebours, totalDepenses } from '../domaine/projets';
import { ListesRattachees } from './Fiche';

export function Projet({ id }: { id: string }) {
  const projet = projets.value.find((p) => p.id === id);
  if (!projet)
    return (
      <section class="vue" aria-labelledby="titre-projet">
        <Retour href="#/foyer" libelle="Foyer" />
        <h1 id="titre-projet" tabIndex={-1}>
          Projet introuvable
        </h1>
        <Vide>Il a peut-être été supprimé.</Vide>
      </section>
    );
  const auj = aujourdhui.value;
  const liees = taches.value
    .filter((t) => t.projetId === projet.id)
    .sort(
      (a, b) =>
        Number(!!a.faite) - Number(!!b.faite) ||
        (a.echeance ?? '9999').localeCompare(b.echeance ?? '9999') ||
        a.titre.localeCompare(b.titre, 'fr'),
    );
  const { faites, total } = avancement(projet.id, taches.value);
  const depensesProjet = depenses.value
    .filter((d) => d.projetId === projet.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const depense = totalDepenses(projet.id, depenses.value);
  const rebours = compteARebours(projet, auj);
  const dates =
    projet.debut && projet.fin
      ? `Du ${formatCourt(projet.debut, auj)} au ${formatCourt(projet.fin, auj)}`
      : projet.debut
        ? `Le ${formatCourt(projet.debut, auj)}`
        : undefined;

  return (
    <section class="vue" aria-labelledby="titre-projet">
      <Retour href="#/foyer" libelle="Foyer" />
      <div class="titre-avec-icone">
        <Illustration nom={TYPES_PROJET[projet.type].icone} />
        <h1 id="titre-projet" tabIndex={-1}>
          {projet.nom}
        </h1>
      </div>
      <div class="entete-liste">
        <span class="doux">
          {[TYPES_PROJET[projet.type].nom, projet.lieu, dates, rebours, projet.archive ? 'archivé' : '']
            .filter(Boolean)
            .join(' · ')}
        </span>
        <button type="button" class="lien-bouton" onClick={() => ouvrir({ type: 'projet', projet })}>
          <Icone nom="crayon" />
          Modifier
        </button>
      </div>
      {projet.note && <p class="chapeau">{projet.note}</p>}

      {total > 0 && (
        <div class="avancement">
          <div class="chiffres">
            <span>Préparatifs</span>
            <span>
              {faites} sur {total}
            </span>
          </div>
          <div class="barre-fine" style={{ '--v': `${Math.round((faites / total) * 100)}%` }}>
            <span />
          </div>
        </div>
      )}

      <section class="bloc" aria-labelledby="t-taches-projet">
        <BlocTete titre="Tâches" id="t-taches-projet">
          <button
            type="button"
            class="lien-bouton"
            onClick={() => ouvrir({ type: 'tache', defauts: { projetId: projet.id } })}
          >
            <Icone nom="plus" />
            Tâche
          </button>
        </BlocTete>
        {liees.length ? (
          <ListeTaches taches={liees} avecRattachement={false} />
        ) : (
          <Vide>Aucune tâche pour ce projet.</Vide>
        )}
      </section>

      <ListesRattachees
        listesLiees={listes.value.filter((l) => l.projetId === projet.id)}
        defauts={{ projetId: projet.id }}
      />

      <section class="bloc" aria-labelledby="t-budget">
        <BlocTete titre="Budget" id="t-budget">
          <button
            type="button"
            class="lien-bouton"
            onClick={() => ouvrir({ type: 'depense', projetId: projet.id })}
          >
            <Icone nom="plus" />
            Dépense
          </button>
        </BlocTete>
        <div class="avancement" style={{ marginTop: 0 }}>
          <div class="chiffres">
            <span>Dépensé {formatMontant(depense, devise.value)}</span>
            <span>
              {projet.budget !== undefined
                ? `Prévu ${formatMontant(projet.budget, devise.value)}`
                : 'Pas de budget prévu'}
            </span>
          </div>
          {projet.budget ? (
            <div
              class={`barre-fine${depense > projet.budget ? ' depasse' : ''}`}
              style={{ '--v': `${Math.min(100, Math.round((depense / projet.budget) * 100))}%` }}
            >
              <span />
            </div>
          ) : null}
        </div>
        {depensesProjet.length > 0 && (
          <ul class="lignes" style={{ marginTop: '10px' }}>
            {depensesProjet.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  class="ligne"
                  onClick={() => ouvrir({ type: 'depense', projetId: projet.id, depense: d })}
                >
                  <Illustration nom="receipt" />
                  <span>
                    <strong>{d.libelle}</strong>
                    <span class="sous">{formatCourt(d.date, auj)}</span>
                  </span>
                  <span class="droite">{formatMontant(d.montant, devise.value)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
