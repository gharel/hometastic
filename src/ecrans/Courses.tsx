import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { ajouterArticle, ajouterSortie, cocherArticle, decocherArticle, toutDecocher } from '../app/actions';
import { articles, aujourdhui, fiches, listes, ouvrir, projets } from '../app/etat';
import { Icone, IconeArticle, Illustration } from '../app/icones';
import { pluriel } from '../app/libelles';
import { BlocTete, Vide } from '../composants/communs';
import { RAYONS, analyserArticle, chercherProduits, rayonDe } from '../domaine/catalogue';
import { formatCourt, relatif } from '../domaine/dates';
import { CATEGORIES_SORTIE, rangerSorties } from '../domaine/sorties';
import type { Article, Liste } from '../domaine/types';

function Tuile({ article, surListe, edition }: { article: Article; surListe: boolean; edition: boolean }) {
  // Nom accessible = texte visible (WCAG 2.5.3), complété par l’action en texte masqué.
  const action = edition ? 'modifier' : surListe ? 'cocher' : 'remettre sur la liste';
  return (
    <li>
      <button
        type="button"
        class={`tuile ${surListe ? 'sur-liste' : 'recente'}`}
        data-article={article.nom}
        onClick={() => {
          if (edition) ouvrir({ type: 'article', article });
          else void (surListe ? cocherArticle(article) : decocherArticle(article));
        }}
      >
        <IconeArticle produitId={article.produitId} nom={article.nom} />
        <span class="tuile-nom">{article.nom}</span>
        {article.precision && <span class="tuile-precision">{article.precision}</span>}
        {article.urgent && surListe && <span class="drapeau">Urgent</span>}
        <span class="vh">, {action}</span>
      </button>
    </li>
  );
}

function SaisieArticle({ liste }: { liste: Liste }) {
  const [texte, setTexte] = useState('');
  const { nom } = analyserArticle(texte);
  const propositions = texte.trim().length >= 2 ? chercherProduits(nom, 6) : [];
  const ajouter = async (produitId?: string, nomProduit?: string) => {
    const { precision } = analyserArticle(texte);
    const saisie = nomProduit ? `${precision ? `${precision.replace(/^x/, '')} ` : ''}${nomProduit}` : texte;
    if (liste.type === 'sorties') {
      if (await ajouterSortie(liste.id, texte)) setTexte('');
      return;
    }
    if (await ajouterArticle(liste.id, saisie, produitId)) setTexte('');
  };
  return (
    <div class="saisie-zone">
      <form
        class="saisie-article"
        onSubmit={(e) => {
          e.preventDefault();
          void ajouter();
        }}
      >
        <label class="vh" for="saisie-article">
          Ajouter un article
        </label>
        <input
          id="saisie-article"
          class="champ"
          autoComplete="off"
          enterKeyHint="done"
          placeholder={
            liste.type === 'courses'
              ? 'Ajouter (ex. 2 l lait)'
              : liste.type === 'sorties'
                ? 'Un film, un spectacle, une soirée…'
                : 'Ajouter un élément'
          }
          value={texte}
          onInput={(e) => setTexte(e.currentTarget.value)}
        />
        <button type="submit" class="bouton bouton-plein bouton-icone-plein" aria-label="Ajouter">
          <Icone nom="plus" />
        </button>
      </form>
      {liste.type === 'courses' && propositions.length > 0 && (
        <ul class="propositions" aria-label="Suggestions du catalogue">
          {propositions.map((p) => (
            <li key={p.id}>
              <button type="button" class="proposition" onClick={() => void ajouter(p.id, p.nom)}>
                <IconeArticle produitId={p.id} nom={p.nom} />
                {p.nom}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function VueCourses({ liste, contenu }: { liste: Liste; contenu: Article[] }) {
  const [edition, setEdition] = useState(false);
  const aAcheter = contenu.filter((a) => !a.coche);
  const recents = contenu
    .filter((a) => a.coche)
    .sort((a, b) => (b.coche?.le ?? '').localeCompare(a.coche?.le ?? ''))
    .slice(0, 30);
  return (
    <>
      <SaisieArticle liste={liste} />
      <section class="bloc" aria-labelledby="t-acheter">
        <BlocTete titre="À acheter" id="t-acheter">
          <button
            type="button"
            class="lien-bouton"
            aria-pressed={edition ? 'true' : 'false'}
            onClick={() => setEdition(!edition)}
          >
            {edition ? 'Terminer' : 'Modifier'}
          </button>
        </BlocTete>
        {aAcheter.length === 0 ? (
          <Vide>Rien à acheter. Ajoutez un article ou touchez un récent.</Vide>
        ) : (
          RAYONS.map(([cle, titre]) => {
            const duRayon = aAcheter
              .filter((a) => rayonDe(a.produitId) === cle)
              .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
            if (!duRayon.length) return null;
            return (
              <section class="rayon" key={cle} aria-labelledby={`r-${cle}`}>
                <h3 id={`r-${cle}`}>
                  {titre} <span>{duRayon.length}</span>
                </h3>
                <ul class={`tuiles${edition ? ' edition' : ''}`}>
                  {duRayon.map((a) => (
                    <Tuile key={a.id} article={a} surListe edition={edition} />
                  ))}
                </ul>
              </section>
            );
          })
        )}
      </section>
      {recents.length > 0 && (
        <section class="bloc" aria-labelledby="t-recents">
          <BlocTete titre="Récents" id="t-recents">
            <span class="mono">Touchez pour remettre</span>
          </BlocTete>
          <ul class={`tuiles${edition ? ' edition' : ''}`}>
            {recents.map((a) => (
              <Tuile key={a.id} article={a} surListe={false} edition={edition} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function VueChecklist({ liste, contenu }: { liste: Liste; contenu: Article[] }) {
  const tries = [...contenu].sort(
    (a, b) => Number(!!a.coche) - Number(!!b.coche) || a.ajouteLe.localeCompare(b.ajouteLe),
  );
  const faits = contenu.filter((a) => a.coche).length;
  return (
    <>
      <SaisieArticle liste={liste} />
      <section class="bloc" aria-labelledby="t-elements">
        <BlocTete titre={`${faits} sur ${contenu.length}`} id="t-elements">
          {faits > 0 && (
            <button type="button" class="lien-bouton" onClick={() => void toutDecocher(liste.id)}>
              Tout décocher
            </button>
          )}
        </BlocTete>
        {tries.length === 0 ? (
          <Vide>Liste vide. Ajoutez les éléments à préparer.</Vide>
        ) : (
          <ul class="taches">
            {tries.map((a) => (
              <li key={a.id} class={`tache${a.coche ? ' faite' : ''}`}>
                <button
                  type="button"
                  class="case"
                  aria-pressed={a.coche ? 'true' : 'false'}
                  aria-label={`${a.coche ? 'Décocher' : 'Cocher'}\u00a0: ${a.nom}`}
                  onClick={() => void (a.coche ? decocherArticle(a) : cocherArticle(a))}
                >
                  <Icone nom="valider" />
                </button>
                <button
                  type="button"
                  class="tache-corps"
                  onClick={() => ouvrir({ type: 'article', article: a })}
                >
                  <span class="tache-titre">{a.nom}</span>
                  {a.precision && <span class="tache-meta">{a.precision}</span>}
                </button>
                <span />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function LigneSortie({ sortie }: { sortie: Article }) {
  const auj = aujourdhui.value;
  const categorie = CATEGORIES_SORTIE[sortie.categorie ?? 'autre'];
  const details: ComponentChildren[] = [<span>{categorie.nom}</span>];
  if (sortie.date)
    details.push(
      <span>
        {formatCourt(sortie.date, auj)} ({relatif(sortie.date, auj).toLowerCase()})
      </span>,
    );
  if (sortie.lieu) details.push(<span>{sortie.lieu}</span>);
  if (sortie.billet === 'a-acheter' && !sortie.coche)
    details.push(<span class="retard">Billets à acheter</span>);
  if (sortie.billet === 'achete') details.push(<span>Billets achetés</span>);
  return (
    <li class={`tache${sortie.coche ? ' faite' : ''}`}>
      <button
        type="button"
        class="case"
        aria-pressed={sortie.coche ? 'true' : 'false'}
        aria-label={`${sortie.coche ? 'Remettre à voir' : 'Marquer vu'}\u00a0: ${sortie.nom}`}
        onClick={() => void (sortie.coche ? decocherArticle(sortie) : cocherArticle(sortie))}
      >
        <Icone nom="valider" />
      </button>
      <button
        type="button"
        class="tache-corps"
        onClick={() => ouvrir({ type: 'sortie', listeId: sortie.listeId, sortie })}
      >
        <span class="tache-titre">{sortie.nom}</span>
        <span class="tache-meta">{details}</span>
      </button>
      <Illustration nom={categorie.icone} />
    </li>
  );
}

function VueSorties({ liste, contenu }: { liste: Liste; contenu: Article[] }) {
  const { prevues, unJour, vues } = rangerSorties(contenu);
  const groupes: readonly (readonly [string, string, Article[]])[] = [
    ['prevues', 'Prévu', prevues],
    ['un-jour', 'À voir un jour', unJour],
  ];
  return (
    <>
      <SaisieArticle liste={liste} />
      {prevues.length + unJour.length === 0 && (
        <div class="bloc">
          <Vide>Rien à voir pour l’instant. Ajoutez un film, une pièce, un concert, une soirée…</Vide>
        </div>
      )}
      {groupes.map(([cle, titre, sorties]) =>
        sorties.length ? (
          <section key={cle} class="bloc" aria-labelledby={`s-${cle}`}>
            <BlocTete titre={titre} id={`s-${cle}`}>
              <span class="mono">{sorties.length}</span>
            </BlocTete>
            <ul class="taches">
              {sorties.map((s) => (
                <LigneSortie key={s.id} sortie={s} />
              ))}
            </ul>
          </section>
        ) : null,
      )}
      {vues.length > 0 && (
        <details class="bloc repli">
          <summary>Déjà vu ({vues.length})</summary>
          <ul class="taches">
            {vues.map((s) => (
              <LigneSortie key={s.id} sortie={s} />
            ))}
          </ul>
        </details>
      )}
    </>
  );
}

const ORDRE_TYPES: Record<Liste['type'], number> = { courses: 0, sorties: 1, checklist: 2 };

export function Courses({ id }: { id?: string | undefined }) {
  const toutes = [...listes.value].sort((a, b) => ORDRE_TYPES[a.type] - ORDRE_TYPES[b.type]);
  const liste = toutes.find((l) => l.id === id) ?? toutes.find((l) => l.type === 'courses') ?? toutes[0];
  const contenu = liste ? articles.value.filter((a) => a.listeId === liste.id) : [];
  const restants = contenu.filter((a) => !a.coche).length;
  const rattache = liste?.ficheId
    ? fiches.value.find((f) => f.id === liste.ficheId)
    : liste?.projetId
      ? projets.value.find((p) => p.id === liste.projetId)
      : undefined;
  return (
    <section class="vue" aria-labelledby="titre-courses">
      <h1 id="titre-courses" tabIndex={-1}>
        {liste && liste.type !== 'courses' ? liste.nom : 'Courses'}
        {liste && <span class="compte-titre">{restants}</span>}
      </h1>
      <div class="pilules" role="group" aria-label="Listes">
        {toutes.map((l) => {
          const n = articles.value.filter((a) => a.listeId === l.id && !a.coche).length;
          return (
            <a
              key={l.id}
              class="pilule"
              href={`#/courses/${l.id}`}
              aria-current={l.id === liste?.id ? 'page' : undefined}
            >
              {l.type === 'courses' && <Icone nom="panier" />}
              {l.type === 'sorties' && <Icone nom="film" />}
              {l.nom} {n}
            </a>
          );
        })}
        <button type="button" class="pilule" onClick={() => ouvrir({ type: 'liste' })}>
          <Icone nom="plus" />
          Liste
        </button>
      </div>
      {liste ? (
        <>
          <div class="entete-liste">
            <span class="doux">
              {liste.type === 'courses'
                ? pluriel(restants, 'article à acheter', 'articles à acheter')
                : liste.type === 'sorties'
                  ? `${restants} à voir`
                  : 'Liste à cocher'}
              {rattache && (
                <>
                  {' · '}
                  <a href={liste.ficheId ? `#/fiche/${liste.ficheId}` : `#/projet/${liste.projetId}`}>
                    {rattache.nom}
                  </a>
                </>
              )}
            </span>
            <button type="button" class="lien-bouton" onClick={() => ouvrir({ type: 'liste', liste })}>
              <Icone nom="crayon" />
              Liste
            </button>
          </div>
          {liste.type === 'courses' ? (
            <VueCourses key={liste.id} liste={liste} contenu={contenu} />
          ) : liste.type === 'sorties' ? (
            <VueSorties key={liste.id} liste={liste} contenu={contenu} />
          ) : (
            <VueChecklist key={liste.id} liste={liste} contenu={contenu} />
          )}
        </>
      ) : (
        <Vide>Aucune liste. Créez-en une avec « Liste ».</Vide>
      )}
    </section>
  );
}
