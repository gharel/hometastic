import { articles, aujourdhui, fiches, kmParFiche, listes, moi, projets, taches } from '../app/etat';
import { Icone, IconeArticle, Illustration } from '../app/icones';
import { TYPES_PROJET, iconeFiche, pluriel } from '../app/libelles';
import { BlocTete, ListeTaches, Vide } from '../composants/communs';
import { CarteInstallation } from '../composants/installation';
import { formatCourt, formatLong, relatif } from '../domaine/dates';
import { CATEGORIES_SORTIE } from '../domaine/sorties';
import { echeancesAVenir, regrouper } from '../domaine/taches';

export function Aujourdhui() {
  const auj = aujourdhui.value;
  const groupes = regrouper(taches.value, auj, kmParFiche.value);
  const urgent = [...groupes.retard, ...groupes.aujourdhui];
  const listesSorties = new Set(listes.value.filter((l) => l.type === 'sorties').map((l) => l.id));
  const sorties = articles.value.filter((a) => listesSorties.has(a.listeId));
  const bientot = echeancesAVenir(taches.value, projets.value, auj, 30, sorties).slice(0, 8);
  const courses = listes.value.find((l) => l.type === 'courses');
  const aAcheter = courses ? articles.value.filter((a) => a.listeId === courses.id && !a.coche) : [];
  // Les urgents d’abord, comme sur la liste.
  const apercu = [...aAcheter].sort((a, b) => Number(!!b.urgent) - Number(!!a.urgent)).slice(0, 6);
  const date = formatLong(auj);

  return (
    <section class="vue" aria-labelledby="titre-aujourdhui">
      <h1 id="titre-aujourdhui" tabIndex={-1}>
        Aujourd’hui
      </h1>
      <p class="sous-titre">{date.charAt(0).toUpperCase() + date.slice(1)}</p>
      <p class="chapeau">
        Bonjour {moi.value?.nom}.{' '}
        {urgent.length ? (
          <>
            <strong>{pluriel(urgent.length, 'chose à faire', 'choses à faire')}</strong>
            {groupes.retard.length ? ` (dont ${groupes.retard.length} en retard)` : ''}
          </>
        ) : (
          'Rien à faire aujourd’hui'
        )}
        {aAcheter.length ? (
          <>
            {' '}
            et <strong>{pluriel(aAcheter.length, 'article', 'articles')}</strong> sur la liste de courses.
          </>
        ) : (
          ', et la liste de courses est vide.'
        )}
      </p>
      <CarteInstallation lieu="aujourdhui" />

      <section class="bloc" aria-labelledby="t-jour">
        <BlocTete titre="À faire aujourd’hui" id="t-jour">
          <a class="mono lien" href="#/a-faire">
            Tout voir
          </a>
        </BlocTete>
        {urgent.length ? <ListeTaches taches={urgent} /> : <Vide>Rien d’urgent aujourd’hui.</Vide>}
      </section>

      {bientot.length > 0 && (
        <section class="bloc" aria-labelledby="t-bientot">
          <BlocTete titre="Bientôt" id="t-bientot">
            <span class="mono">30 prochains jours</span>
          </BlocTete>
          <ul class="lignes">
            {bientot.map((e) => {
              const fiche = e.ficheId ? fiches.value.find((f) => f.id === e.ficheId) : undefined;
              const projet = e.projetId ? projets.value.find((p) => p.id === e.projetId) : undefined;
              const icone =
                e.type === 'sortie'
                  ? CATEGORIES_SORTIE[e.categorie ?? 'autre'].icone
                  : fiche
                    ? iconeFiche(fiche)
                    : projet
                      ? TYPES_PROJET[projet.type].icone
                      : 'pushpin';
              const href =
                e.type === 'sortie'
                  ? `#/courses/${e.listeId}`
                  : fiche
                    ? `#/fiche/${fiche.id}`
                    : `#/projet/${e.projetId}`;
              return (
                <li key={`${e.type}-${e.id}`}>
                  <a class="ligne" href={href}>
                    <Illustration nom={icone} />
                    <span>
                      <strong>{e.type === 'projet' ? `Départ : ${e.titre}` : e.titre}</strong>
                      <span class="sous">
                        {e.sante && <Icone nom="cadenas" classe="cadenas" />}
                        {[
                          fiche?.nom ?? (e.type === 'tache' ? projet?.nom : undefined),
                          formatCourt(e.date, auj),
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                    <span class="droite">{relatif(e.date, auj)}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {courses && (
        <section class="bloc" aria-labelledby="t-courses-jour">
          <BlocTete titre={courses.nom} id="t-courses-jour">
            <a class="mono lien" href={`#/courses/${courses.id}`}>
              Ouvrir
            </a>
          </BlocTete>
          {aAcheter.length ? (
            <ul class="tuiles tuiles-jour">
              {apercu.map((a) => (
                <li key={a.id}>
                  <a class="tuile sur-liste" href={`#/courses/${courses.id}`}>
                    <IconeArticle article={a} />
                    <span class="tuile-nom">{a.nom}</span>
                    {a.precision && <span class="tuile-precision">{a.precision}</span>}
                    {a.urgent && <span class="drapeau">Urgent</span>}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <Vide>La liste est vide.</Vide>
          )}
          {aAcheter.length > apercu.length && (
            <p class="aide">
              <a class="lien" href={`#/courses/${courses.id}`}>
                Et {pluriel(aAcheter.length - apercu.length, 'autre article', 'autres articles')} sur la liste
              </a>
            </p>
          )}
        </section>
      )}
    </section>
  );
}
