import { aujourdhui, devise, entrees, fiches, listes, articles, ouvrir, taches } from '../app/etat';
import { Icone, Illustration } from '../app/icones';
import { CHAMPS_FICHE, TYPES_FICHE, iconeFiche } from '../app/libelles';
import { BlocTete, ListeTaches, Retour, Vide } from '../composants/communs';
import { ecartJours, formatCourt } from '../domaine/dates';
import { formatMontant } from '../domaine/montants';
import { regrouper, ORDRE_GROUPES } from '../domaine/taches';
import type { Fiche as TypeFiche, Liste } from '../domaine/types';

const milliers = (n: number) => n.toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ');

export function ListesRattachees({
  listesLiees,
  defauts,
}: {
  listesLiees: Liste[];
  defauts: Partial<Liste>;
}) {
  return (
    <section class="bloc" aria-labelledby="t-listes-liees">
      <BlocTete titre="Listes" id="t-listes-liees">
        <button
          type="button"
          class="lien-bouton"
          onClick={() => ouvrir({ type: 'liste', defauts: { type: 'checklist', ...defauts } })}
        >
          <Icone nom="plus" />
          Liste
        </button>
      </BlocTete>
      {listesLiees.length ? (
        <ul class="lignes">
          {listesLiees.map((l) => {
            const contenu = articles.value.filter((a) => a.listeId === l.id);
            const faits = contenu.filter((a) => a.coche).length;
            return (
              <li key={l.id}>
                <a class="ligne" href={`#/courses/${l.id}`}>
                  <Illustration nom={l.type === 'courses' ? 'shopping-cart' : 'clipboard'} />
                  <span>
                    <strong>{l.nom}</strong>
                    <span class="sous">{l.type === 'courses' ? 'Courses' : 'À cocher'}</span>
                  </span>
                  <span class="droite">
                    {l.type === 'courses'
                      ? `${contenu.length - faits} à acheter`
                      : `${faits} sur ${contenu.length}`}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <Vide>Aucune liste rattachée (valise, matériel, courses dédiées).</Vide>
      )}
    </section>
  );
}

function Infos({ fiche }: { fiche: TypeFiche }) {
  const champs = CHAMPS_FICHE[fiche.type].filter((c) => fiche.infos[c.cle]);
  if (!champs.length) return null;
  return (
    <dl class="infos">
      {champs.map((c) => (
        <div key={c.cle}>
          <dt>{c.libelle}</dt>
          <dd>{c.type === 'date' ? formatCourt(fiche.infos[c.cle] ?? '') : fiche.infos[c.cle]}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Fiche({ id }: { id: string }) {
  const fiche = fiches.value.find((f) => f.id === id);
  if (!fiche)
    return (
      <section class="vue" aria-labelledby="titre-fiche">
        <Retour href="#/foyer" libelle="Foyer" />
        <h1 id="titre-fiche" tabIndex={-1}>
          Fiche introuvable
        </h1>
        <Vide>Elle a peut-être été supprimée.</Vide>
      </section>
    );
  const auj = aujourdhui.value;
  const liees = taches.value.filter((t) => t.ficheId === fiche.id);
  const groupes = regrouper(liees, auj, fiche.km ? { [fiche.id]: fiche.km.valeur } : {});
  const aFaire = ORDRE_GROUPES.flatMap((g) => groupes[g]);
  const historique = entrees.value
    .filter((e) => e.ficheId === fiche.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const annee = auj.slice(0, 4);
  const coutAnnee = historique.filter((e) => e.date.startsWith(annee)).reduce((s, e) => s + (e.cout ?? 0), 0);
  const sante = fiche.sante;
  const santeRemplie = sante && Object.values(sante).some((v) => v.trim());
  const libelles =
    fiche.type === 'compte'
      ? {
          aFaire: 'Virements à faire',
          ajouter: 'Virement',
          historique: 'Virements faits',
          vide: 'Aucun virement fait pour l’instant. Chaque virement coché s’inscrit ici.',
        }
      : fiche.type === 'animal'
        ? {
            aFaire: 'Soins à venir',
            ajouter: 'Soin',
            historique: 'Carnet de santé',
            vide: 'Vaccins, vermifuges, visites chez le vétérinaire : rien encore.',
          }
        : {
            aFaire: 'À faire',
            ajouter: 'Échéance',
            historique: 'Historique',
            vide: 'Entretiens, réparations, rendez-vous passés : rien encore.',
          };

  return (
    <section class="vue" aria-labelledby="titre-fiche">
      <Retour href="#/foyer" libelle="Foyer" />
      <div class="titre-avec-icone">
        <Illustration nom={iconeFiche(fiche)} />
        <h1 id="titre-fiche" tabIndex={-1}>
          {fiche.nom}
        </h1>
      </div>
      <div class="entete-liste">
        <span class="doux">{TYPES_FICHE[fiche.type].nom}</span>
        <button type="button" class="lien-bouton" onClick={() => ouvrir({ type: 'fiche', fiche })}>
          <Icone nom="crayon" />
          Modifier
        </button>
      </div>
      <Infos fiche={fiche} />

      {fiche.type === 'vehicule' && (
        <section class="bloc" aria-labelledby="t-km">
          <BlocTete titre="Kilométrage" id="t-km" />
          <div class="grand-chiffre">
            <span>
              <strong>{fiche.km ? `${milliers(fiche.km.valeur)} km` : 'Non relevé'}</strong>
              {fiche.km && (
                <span class="sous">
                  Relevé{' '}
                  {ecartJours(fiche.km.le, auj) === 0 ? 'aujourd’hui' : `le ${formatCourt(fiche.km.le, auj)}`}
                </span>
              )}
            </span>
            <button type="button" class="bouton bouton-petit" onClick={() => ouvrir({ type: 'km', fiche })}>
              Mettre à jour
            </button>
          </div>
        </section>
      )}

      {fiche.type === 'personne' && (
        <section class="bloc" aria-labelledby="t-sante">
          <BlocTete titre="Santé" id="t-sante">
            <button type="button" class="lien-bouton" onClick={() => ouvrir({ type: 'sante', fiche })}>
              <Icone nom="crayon" />
              Modifier
            </button>
          </BlocTete>
          <p class="chiffre">
            <Icone nom="cadenas" />
            <span>
              Chiffrée sur ce téléphone avant d’être enregistrée. Les rappels disent seulement « Rappel santé
              ».
            </span>
          </p>
          {santeRemplie && sante ? (
            <dl class="infos">
              {(
                [
                  ['allergies', 'Allergies'],
                  ['traitements', 'Traitements'],
                  ['vaccins', 'Vaccins'],
                  ['notes', 'Notes'],
                ] as const
              )
                .filter(([cle]) => sante[cle].trim())
                .map(([cle, libelle]) => (
                  <div key={cle}>
                    <dt>{libelle}</dt>
                    <dd>{sante[cle]}</dd>
                  </div>
                ))}
            </dl>
          ) : (
            <Vide>Allergies, traitements, vaccins : rien de noté.</Vide>
          )}
        </section>
      )}

      <section class="bloc" aria-labelledby="t-echeances-fiche">
        <BlocTete titre={libelles.aFaire} id="t-echeances-fiche">
          <button
            type="button"
            class="lien-bouton"
            onClick={() =>
              ouvrir({
                type: 'tache',
                defauts:
                  fiche.type === 'compte'
                    ? {
                        ficheId: fiche.id,
                        titre: `Virement vers ${fiche.nom.toLowerCase()}`,
                        assignation: 'nous',
                        recurrence: { type: 'calendaire', unite: 'mois', intervalle: 1 },
                      }
                    : { ficheId: fiche.id, sante: fiche.type === 'personne' || undefined },
              })
            }
          >
            <Icone nom="plus" />
            {libelles.ajouter}
          </button>
        </BlocTete>
        {aFaire.length ? (
          <ListeTaches taches={aFaire} avecRattachement={false} />
        ) : (
          <Vide>Rien de prévu pour cette fiche.</Vide>
        )}
      </section>

      <section class="bloc" aria-labelledby="t-historique">
        <BlocTete titre={libelles.historique} id="t-historique">
          <button
            type="button"
            class="lien-bouton"
            onClick={() => ouvrir({ type: 'entree', ficheId: fiche.id })}
          >
            <Icone nom="plus" />
            Ajouter
          </button>
        </BlocTete>
        {coutAnnee > 0 && (
          <p class="aide">
            Dépensé en {annee} : {formatMontant(coutAnnee, devise.value)}
          </p>
        )}
        {historique.length ? (
          <ul class="lignes">
            {historique.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  class="ligne"
                  onClick={() => ouvrir({ type: 'entree', ficheId: fiche.id, entree: e })}
                >
                  {e.sante ? <Icone nom="cadenas" /> : <Icone nom="calendrier" />}
                  <span>
                    <strong>{e.titre}</strong>
                    <span class="sous">
                      {[
                        formatCourt(e.date, auj),
                        e.km !== undefined ? `${milliers(e.km)} km` : '',
                        e.prestataire ?? '',
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </span>
                  {e.cout !== undefined && <span class="droite">{formatMontant(e.cout, devise.value)}</span>}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <Vide>{libelles.vide}</Vide>
        )}
      </section>

      <ListesRattachees
        listesLiees={listes.value.filter((l) => l.ficheId === fiche.id)}
        defauts={{ ficheId: fiche.id }}
      />
    </section>
  );
}
