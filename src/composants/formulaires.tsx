import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import {
  creerFoyer,
  enregistrerDepense,
  enregistrerEntree,
  enregistrerFiche,
  enregistrerListe,
  enregistrerProjet,
  enregistrerSortie,
  enregistrerTache,
  modifierArticle,
  modifierFoyer,
  retenirHabillage,
  nouveauProjet,
  nouvelleFiche,
  nouvelleListe,
  nouvelleTache,
  releverKm,
  supprimerArticle,
  supprimerDepense,
  supprimerEntree,
  supprimerFiche,
  supprimerListe,
  supprimerProjet,
  supprimerTache,
} from '../app/actions';
import {
  aujourdhui,
  autres,
  devise,
  feuille,
  fermer,
  fiches,
  foyer,
  listes,
  membres,
  moi,
  ouvrir,
  projets,
  taches,
  type Feuille as TypeFeuille,
} from '../app/etat';
import { Icone, IconeArticle, Illustration } from '../app/icones';
import { CHAMPS_FICHE, ICONES_LISTE, TYPES_FICHE, TYPES_PROJET, iconeListe } from '../app/libelles';
import { nouvelId } from '../domaine/id';
import {
  COMPOSITIONS,
  MEMBRES_MAX,
  couleurLibre,
  libelleEnsemble,
  libellePlace,
  listeNoms,
  type Composition,
} from '../domaine/membres';
import { DOMAINES, estimer, formatDuree } from '../domaine/durees';
import { modelePour } from '../domaine/modeles';
import { formatMontant, lireMontant } from '../domaine/montants';
import { CATEGORIES_SORTIE, dateAchatBillets } from '../domaine/sorties';
import { RAYONS, iconeDe, normaliser, produit, rayonDe, trouverProduit } from '../domaine/catalogue';
import { ChoixIcones } from './icones-choix';
import type {
  Article,
  Assignation,
  CategorieSortie,
  EtatBillet,
  Depense,
  Entree,
  Fiche,
  Liste,
  Membre,
  Projet,
  Recurrence,
  Sante,
  Tache,
  TypeFiche,
  TypeListe,
  TypeProjet,
} from '../domaine/types';
import { Feuille } from './communs';

const lireEntier = (texte: string): number | undefined => {
  const n = Number(texte.replace(/[\s\u202f\u00a0]/g, ''));
  return texte.trim() && Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
};

function Champ({ id, libelle, children }: { id: string; libelle: string; children: ComponentChildren }) {
  return (
    <div class="champ-groupe">
      <label for={id}>{libelle}</label>
      {children}
    </div>
  );
}

function Choix<T extends string>({
  nom,
  legende,
  valeur,
  options,
  changer,
}: {
  nom: string;
  legende: string;
  valeur: T;
  options: readonly (readonly [T, ComponentChildren])[];
  changer: (v: T) => void;
}) {
  return (
    <fieldset class="choix">
      <legend class="legende">{legende}</legend>
      {options.map(([v, libelle]) => (
        <label key={v}>
          <input type="radio" name={nom} value={v} checked={valeur === v} onChange={() => changer(v)} />
          {libelle}
        </label>
      ))}
    </fieldset>
  );
}

function Boutons({ supprimer }: { supprimer?: (() => void) | undefined }) {
  return (
    <div class="boutons-feuille">
      <button type="submit" class="bouton bouton-plein">
        Enregistrer
      </button>
      {supprimer && (
        <button type="button" class="bouton bouton-danger" onClick={supprimer}>
          <Icone nom="corbeille" />
          Supprimer
        </button>
      )}
    </div>
  );
}

const confirmer = (question: string) => window.confirm(question);

// ---------- Tâche ----------
type TypeRecurrence = 'aucune' | 'jour' | 'semaine' | 'mois' | 'an' | 'apres' | 'km';

function versTypeRecurrence(r: Recurrence | undefined): TypeRecurrence {
  if (!r) return 'aucune';
  if (r.type === 'calendaire') return r.unite;
  return r.type === 'apres' ? 'apres' : 'km';
}

function FormTache({ tache, defauts }: { tache?: Tache | undefined; defauts?: Partial<Tache> | undefined }) {
  const base = tache ?? nouvelleTache(defauts);
  const [titre, setTitre] = useState(base.titre);
  const [note, setNote] = useState(base.note ?? '');
  const [echeance, setEcheance] = useState(base.echeance ?? '');
  const [heure, setHeure] = useState(base.heure ?? '');
  const [assignation, setAssignation] = useState<Assignation>(base.assignation);
  const [typeRec, setTypeRec] = useState<TypeRecurrence>(versTypeRecurrence(base.recurrence));
  const r = base.recurrence;
  const [intervalle, setIntervalle] = useState(String(r?.type === 'calendaire' ? r.intervalle : 1));
  const [jours, setJours] = useState(String(r?.type === 'apres' ? r.jours : 30));
  const [km, setKm] = useState(String(r?.type === 'kilometrage' ? r.km : 15000));
  const [ouMois, setOuMois] = useState(String(r?.type === 'kilometrage' ? (r.ouMois ?? '') : 12));
  const [echeanceKm, setEcheanceKm] = useState(base.echeanceKm === undefined ? '' : String(base.echeanceKm));
  const [rattache, setRattache] = useState(
    base.ficheId ? `f:${base.ficheId}` : base.projetId ? `p:${base.projetId}` : '',
  );
  const [sante, setSante] = useState(!!base.sante);
  const [montant, setMontant] = useState(base.montant === undefined ? '' : String(base.montant));
  const [duree, setDuree] = useState(base.duree === undefined ? '' : String(base.duree));
  const estimation = estimer(titre);

  const ficheChoisie = rattache.startsWith('f:')
    ? fiches.value.find((f) => `f:${f.id}` === rattache)
    : undefined;
  const vehicule = ficheChoisie?.type === 'vehicule';
  const options: (readonly [Assignation, string])[] = [];
  if (moi.value) options.push([moi.value.id, moi.value.nom]);
  for (const m of autres.value) options.push([m.id, m.nom]);
  options.push(['nous', libelleEnsemble(membres.value.length)], ['libre', 'Au premier libre']);

  const enregistrer = (e: Event) => {
    e.preventDefault();
    if (!titre.trim()) return;
    let recurrence: Recurrence | undefined;
    if (typeRec === 'apres') recurrence = { type: 'apres', jours: lireEntier(jours) || 30 };
    else if (typeRec === 'km' && vehicule)
      recurrence = {
        type: 'kilometrage',
        km: lireEntier(km) || 15000,
        ouMois: lireEntier(ouMois) || undefined,
      };
    else if (typeRec !== 'aucune' && typeRec !== 'km')
      recurrence = { type: 'calendaire', unite: typeRec, intervalle: lireEntier(intervalle) || 1 };
    let date = echeance || undefined;
    if (!date && recurrence && recurrence.type !== 'kilometrage') date = aujourdhui.value;
    let kmEcheance = vehicule ? lireEntier(echeanceKm) : undefined;
    if (kmEcheance === undefined && recurrence?.type === 'kilometrage' && ficheChoisie?.km)
      kmEcheance = ficheChoisie.km.valeur + recurrence.km;
    void enregistrerTache({
      ...base,
      titre: titre.trim(),
      note: note.trim() || undefined,
      echeance: date,
      heure: date && heure ? heure : undefined,
      echeanceKm: kmEcheance,
      assignation,
      recurrence,
      ficheId: rattache.startsWith('f:') ? rattache.slice(2) : undefined,
      projetId: rattache.startsWith('p:') ? rattache.slice(2) : undefined,
      sante: sante || undefined,
      montant: lireMontant(montant),
      duree: lireEntier(duree) || undefined,
    });
    fermer();
  };

  return (
    <Feuille titre={tache ? 'Modifier la tâche' : 'Nouvelle tâche'}>
      <form class="formulaire" onSubmit={enregistrer}>
        <Champ id="tache-titre" libelle="Quoi">
          <input
            id="tache-titre"
            class="champ"
            required
            value={titre}
            placeholder="Prendre rendez-vous au garage"
            onInput={(e) => setTitre(e.currentTarget.value)}
          />
        </Champ>
        <div class="ligne-champs">
          <Champ id="tache-date" libelle="Quand">
            <input
              id="tache-date"
              class="champ"
              type="date"
              value={echeance}
              onInput={(e) => setEcheance(e.currentTarget.value)}
            />
          </Champ>
          <Champ id="tache-heure" libelle="Heure">
            <input
              id="tache-heure"
              class="champ"
              type="time"
              value={heure}
              onInput={(e) => setHeure(e.currentTarget.value)}
            />
          </Champ>
        </div>
        <Choix
          nom="tache-pour"
          legende="Pour"
          valeur={assignation}
          options={options}
          changer={setAssignation}
        />
        <Champ id="tache-lien" libelle="Rattachée à">
          <select
            id="tache-lien"
            class="champ"
            value={rattache}
            onChange={(e) => setRattache(e.currentTarget.value)}
          >
            <option value="">Rien (tâche du foyer)</option>
            {fiches.value.length > 0 && (
              <optgroup label="Fiches">
                {fiches.value.map((f) => (
                  <option key={f.id} value={`f:${f.id}`}>
                    {f.nom}
                  </option>
                ))}
              </optgroup>
            )}
            {projets.value.filter((p) => !p.archive).length > 0 && (
              <optgroup label="Projets">
                {projets.value
                  .filter((p) => !p.archive)
                  .map((p) => (
                    <option key={p.id} value={`p:${p.id}`}>
                      {p.nom}
                    </option>
                  ))}
              </optgroup>
            )}
          </select>
        </Champ>
        <Champ id="tache-repeter" libelle="Répéter">
          <select
            id="tache-repeter"
            class="champ"
            value={typeRec}
            onChange={(e) => setTypeRec(e.currentTarget.value as TypeRecurrence)}
          >
            <option value="aucune">Jamais</option>
            <option value="jour">Tous les jours</option>
            <option value="semaine">Toutes les semaines</option>
            <option value="mois">Tous les mois</option>
            <option value="an">Tous les ans</option>
            <option value="apres">Un certain temps après la dernière fois</option>
            {vehicule && <option value="km">Au kilométrage</option>}
          </select>
        </Champ>
        {['jour', 'semaine', 'mois', 'an'].includes(typeRec) && (
          <Champ id="tache-intervalle" libelle="Tous les combien">
            <input
              id="tache-intervalle"
              class="champ"
              inputMode="numeric"
              value={intervalle}
              onInput={(e) => setIntervalle(e.currentTarget.value)}
            />
          </Champ>
        )}
        {typeRec === 'apres' && (
          <Champ id="tache-jours" libelle="Nombre de jours après la dernière fois">
            <input
              id="tache-jours"
              class="champ"
              inputMode="numeric"
              value={jours}
              onInput={(e) => setJours(e.currentTarget.value)}
            />
          </Champ>
        )}
        {typeRec === 'km' && vehicule && (
          <div class="ligne-champs">
            <Champ id="tache-km" libelle="Tous les (km)">
              <input
                id="tache-km"
                class="champ"
                inputMode="numeric"
                value={km}
                onInput={(e) => setKm(e.currentTarget.value)}
              />
            </Champ>
            <Champ id="tache-mois" libelle="Ou tous les (mois)">
              <input
                id="tache-mois"
                class="champ"
                inputMode="numeric"
                value={ouMois}
                onInput={(e) => setOuMois(e.currentTarget.value)}
              />
            </Champ>
          </div>
        )}
        {vehicule && (
          <Champ id="tache-echeance-km" libelle="À faire à (km), facultatif">
            <input
              id="tache-echeance-km"
              class="champ"
              inputMode="numeric"
              value={echeanceKm}
              placeholder={ficheChoisie?.km ? `Compteur actuel : ${ficheChoisie.km.valeur} km` : ''}
              onInput={(e) => setEcheanceKm(e.currentTarget.value)}
            />
          </Champ>
        )}
        <Champ
          id="tache-duree"
          libelle={`Durée (min) : estimée à ${formatDuree(estimation.minutes)} (${DOMAINES[estimation.domaine].nom.toLowerCase()})`}
        >
          <input
            id="tache-duree"
            class="champ"
            inputMode="numeric"
            value={duree}
            placeholder={`${estimation.minutes}`}
            onInput={(e) => setDuree(e.currentTarget.value)}
          />
        </Champ>
        <Champ
          id="tache-montant"
          libelle={`Montant (${devise.value === 'XPF' ? 'F' : '€'}), facultatif${ficheChoisie ? ' : noté dans l’historique à chaque fois' : ''}`}
        >
          <input
            id="tache-montant"
            class="champ"
            inputMode="decimal"
            value={montant}
            placeholder={ficheChoisie?.type === 'compte' ? 'Montant du virement' : ''}
            onInput={(e) => setMontant(e.currentTarget.value)}
          />
        </Champ>
        <Champ id="tache-note" libelle="Note">
          <textarea
            id="tache-note"
            class="champ"
            value={note}
            onInput={(e) => setNote(e.currentTarget.value)}
          />
        </Champ>
        <label class="case-a-cocher">
          <input type="checkbox" checked={sante} onChange={(e) => setSante(e.currentTarget.checked)} />
          <span>
            Santé : titre et note chiffrés sur le téléphone
            <small>La notification dira seulement « Rappel santé ».</small>
          </span>
        </label>
        <Boutons
          supprimer={
            tache
              ? () => {
                  if (confirmer(`Supprimer « ${tache.titre} » ?`)) {
                    void supprimerTache(tache);
                    fermer();
                  }
                }
              : undefined
          }
        />
      </form>
    </Feuille>
  );
}

// ---------- Liste et article ----------
function FormListe({ liste, defauts }: { liste?: Liste | undefined; defauts?: Partial<Liste> | undefined }) {
  const base = liste ?? nouvelleListe(defauts);
  const [nom, setNom] = useState(base.nom);
  const [type, setType] = useState<TypeListe>(base.type);
  const [rattache, setRattache] = useState(
    base.ficheId ? `f:${base.ficheId}` : base.projetId ? `p:${base.projetId}` : '',
  );
  const [icone, setIcone] = useState(base.icone);
  const [choixOuvert, setChoixOuvert] = useState(false);
  const enregistrer = (e: Event) => {
    e.preventDefault();
    if (!nom.trim()) return;
    void enregistrerListe({
      ...base,
      nom: nom.trim(),
      type,
      icone,
      ficheId: rattache.startsWith('f:') ? rattache.slice(2) : undefined,
      projetId: rattache.startsWith('p:') ? rattache.slice(2) : undefined,
    });
    fermer();
    if (!liste && !base.ficheId && !base.projetId) location.hash = `#/courses/${base.id}`;
  };
  return (
    <Feuille titre={liste ? 'Modifier la liste' : 'Nouvelle liste'}>
      <form class="formulaire" onSubmit={enregistrer}>
        <Champ id="liste-nom" libelle="Nom">
          <input
            id="liste-nom"
            class="champ"
            required
            value={nom}
            placeholder="Valise, bricolage…"
            onInput={(e) => setNom(e.currentTarget.value)}
          />
        </Champ>
        <Choix
          nom="liste-type"
          legende="Type"
          valeur={type}
          options={[
            ['courses', 'Courses (tuiles, rayons)'],
            ['checklist', 'À cocher (valise, préparatifs)'],
            ['sorties', 'À voir (films, spectacles, soirées)'],
          ]}
          changer={setType}
        />
        <div class="champ-groupe">
          <span class="etiquette" id="liste-icone">
            Icône
          </span>
          <div class="icone-actuelle" aria-labelledby="liste-icone">
            <span class="picto-liste">
              <Icone nom={iconeListe({ type, icone })} />
            </span>
            <button
              type="button"
              class="bouton"
              aria-expanded={choixOuvert ? 'true' : 'false'}
              onClick={() => setChoixOuvert(!choixOuvert)}
            >
              {choixOuvert ? 'Fermer le choix' : 'Changer l’icône'}
            </button>
            {icone && (
              <button type="button" class="lien-bouton" onClick={() => setIcone(undefined)}>
                Icône d’origine
              </button>
            )}
          </div>
          {choixOuvert && (
            <ul class="grille-pictos" aria-label="Icônes pour la liste">
              {ICONES_LISTE.map((p) => (
                <li key={p.icone}>
                  <button
                    type="button"
                    class="picto-choix"
                    aria-label={p.nom}
                    title={p.nom}
                    aria-pressed={p.icone === iconeListe({ type, icone }) ? 'true' : 'false'}
                    onClick={() => {
                      setIcone(p.icone);
                      setChoixOuvert(false);
                    }}
                  >
                    <Icone nom={p.icone} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Champ id="liste-lien" libelle="Rattachée à">
          <select
            id="liste-lien"
            class="champ"
            value={rattache}
            onChange={(e) => setRattache(e.currentTarget.value)}
          >
            <option value="">Rien</option>
            {fiches.value.map((f) => (
              <option key={f.id} value={`f:${f.id}`}>
                Fiche : {f.nom}
              </option>
            ))}
            {projets.value
              .filter((p) => !p.archive)
              .map((p) => (
                <option key={p.id} value={`p:${p.id}`}>
                  Projet : {p.nom}
                </option>
              ))}
          </select>
        </Champ>
        <Boutons
          supprimer={
            liste
              ? () => {
                  if (confirmer(`Supprimer la liste « ${liste.nom} » et ses articles ?`)) {
                    void supprimerListe(liste);
                    fermer();
                    location.hash = '#/courses';
                  }
                }
              : undefined
          }
        />
      </form>
    </Feuille>
  );
}

function FormArticle({ article }: { article: Article }) {
  const liste = listes.value.find((l) => l.id === article.listeId);
  const memeType = listes.value.filter((l) => l.type === liste?.type);
  const [nom, setNom] = useState(article.nom);
  const [precision, setPrecision] = useState(article.precision ?? '');
  const [urgent, setUrgent] = useState(!!article.urgent);
  const [listeId, setListeId] = useState(article.listeId);
  const [icone, setIcone] = useState(article.icone);
  const [rayon, setRayon] = useState(article.rayon);
  const [habillageTouche, setHabillageTouche] = useState(false);
  const [choixOuvert, setChoixOuvert] = useState(false);
  const courses = liste?.type === 'courses';
  // Nouveau nom : l’icône et le rayon suivent le produit du catalogue correspondant (ou ce qui a été retenu).
  const nomChange = nom.trim() !== article.nom;
  const produitId = nomChange ? (courses ? trouverProduit(nom)?.id : undefined) : article.produitId;
  const appris = foyer.value?.appris?.[normaliser(nom)];
  const iconeFinale = habillageTouche || !nomChange ? icone : appris?.icone;
  const rayonFinal = habillageTouche || !nomChange ? rayon : appris?.rayon;
  const apercu = { produitId, icone: iconeFinale, rayon: rayonFinal, nom: nom || article.nom };
  const rayonParDefaut = rayonDe({ produitId });
  const enregistrer = (e: Event) => {
    e.preventDefault();
    if (!nom.trim()) return;
    const nomFinal = (nomChange ? produit(produitId)?.nom : undefined) ?? nom.trim();
    void modifierArticle({
      ...article,
      nom: nomFinal,
      produitId,
      icone: iconeFinale,
      rayon: rayonFinal,
      precision: precision.trim() || undefined,
      urgent: urgent || undefined,
      listeId,
    });
    // Retenu pour les prochains ajouts du même article, sur les deux téléphones.
    if (habillageTouche) void retenirHabillage(nomFinal, { icone: iconeFinale, rayon: rayonFinal });
    fermer();
  };
  return (
    <Feuille titre="Modifier l’article">
      <form class="formulaire" onSubmit={enregistrer}>
        <Champ id="article-nom" libelle="Nom">
          <input
            id="article-nom"
            class="champ"
            required
            value={nom}
            onInput={(e) => setNom(e.currentTarget.value)}
          />
        </Champ>
        {memeType.length > 1 && (
          <Champ id="article-liste" libelle="Liste">
            <select
              id="article-liste"
              class="champ"
              value={listeId}
              onChange={(e) => setListeId(e.currentTarget.value)}
            >
              {memeType.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nom}
                </option>
              ))}
            </select>
          </Champ>
        )}
        <Champ id="article-precision" libelle="Quantité ou précision">
          <input
            id="article-precision"
            class="champ"
            value={precision}
            placeholder="2 l, x6, demi-écrémé…"
            onInput={(e) => setPrecision(e.currentTarget.value)}
          />
        </Champ>
        <label class="case-a-cocher">
          <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.currentTarget.checked)} />
          <span>Urgent</span>
        </label>
        {courses && (
          <>
            <div class="champ-groupe">
              <span class="etiquette" id="article-icone">
                Icône
              </span>
              <div class="icone-actuelle" aria-labelledby="article-icone">
                <IconeArticle article={apercu} />
                <button
                  type="button"
                  class="bouton"
                  aria-expanded={choixOuvert ? 'true' : 'false'}
                  onClick={() => setChoixOuvert(!choixOuvert)}
                >
                  {choixOuvert ? 'Fermer le choix' : 'Changer l’icône'}
                </button>
                {iconeFinale && (
                  <button
                    type="button"
                    class="lien-bouton"
                    onClick={() => {
                      setIcone(undefined);
                      setHabillageTouche(true);
                    }}
                  >
                    Icône d’origine
                  </button>
                )}
              </div>
              {choixOuvert && (
                <ChoixIcones
                  choisie={iconeDe(apercu)}
                  choisir={(i) => {
                    setIcone(i);
                    setRayon(rayonFinal);
                    setHabillageTouche(true);
                    setChoixOuvert(false);
                  }}
                />
              )}
            </div>
            <Champ id="article-rayon" libelle="Rayon">
              <select
                id="article-rayon"
                class="champ"
                value={rayonFinal ?? rayonParDefaut}
                onChange={(e) => {
                  const v = e.currentTarget.value;
                  setRayon(v === rayonParDefaut ? undefined : v);
                  setIcone(iconeFinale);
                  setHabillageTouche(true);
                }}
              >
                {RAYONS.map(([cle, titre]) => (
                  <option key={cle} value={cle}>
                    {titre}
                  </option>
                ))}
              </select>
            </Champ>
            {habillageTouche && (
              <p class="aide">
                Hometastic s’en souviendra la prochaine fois que vous ajouterez « {nom.trim()} ».
              </p>
            )}
          </>
        )}
        <Boutons
          supprimer={() => {
            void supprimerArticle(article);
            fermer();
          }}
        />
      </form>
    </Feuille>
  );
}

// ---------- Fiche ----------
function FormFiche({ fiche }: { fiche?: Fiche | undefined }) {
  const [type, setType] = useState<TypeFiche>(fiche?.type ?? 'vehicule');
  const [nom, setNom] = useState(fiche?.nom ?? '');
  const [infos, setInfos] = useState<Record<string, string>>(fiche?.infos ?? {});
  const [km, setKm] = useState('');
  const [avecModele, setAvecModele] = useState(true);
  const genre = infos.genre === 'moto' ? 'moto' : 'voiture';
  const modele = fiche ? undefined : modelePour(type, genre);
  const enregistrer = (e: Event) => {
    e.preventDefault();
    if (!nom.trim()) return;
    const base = fiche ?? nouvelleFiche(type);
    const propres = Object.fromEntries(
      Object.entries(type === 'vehicule' ? { ...infos, genre } : infos).filter(([, v]) => v.trim()),
    );
    const kmInitial = lireEntier(km);
    const resultat: Fiche = {
      ...base,
      type,
      nom: nom.trim(),
      infos: propres,
      km:
        !fiche && kmInitial !== undefined
          ? { valeur: kmInitial, le: aujourdhui.value, par: moi.value?.id }
          : base.km,
      sante:
        type === 'personne'
          ? (base.sante ?? { allergies: '', traitements: '', vaccins: '', notes: '' })
          : undefined,
    };
    void enregistrerFiche(resultat, !!modele && avecModele, aujourdhui.value);
    fermer();
    if (!fiche) location.hash = `#/fiche/${resultat.id}`;
  };
  const exemples: Record<TypeFiche, string> = {
    maison: 'Maison',
    vehicule: genre === 'moto' ? 'Moto de Guillaume' : 'Voiture d’Hélène',
    personne: 'Léo',
    animal: 'Martine, Rookie…',
    compte: 'Compte commun',
    papiers: 'Papiers du foyer',
    autre: 'Piscine',
  };
  return (
    <Feuille titre={fiche ? 'Modifier la fiche' : 'Nouvelle fiche'}>
      <form class="formulaire" onSubmit={enregistrer}>
        {!fiche && (
          <Choix
            nom="fiche-type"
            legende="Ce que vous suivez"
            valeur={type}
            options={(Object.keys(TYPES_FICHE) as TypeFiche[]).map((t) => [
              t,
              <>
                <Illustration nom={TYPES_FICHE[t].icone} />
                {TYPES_FICHE[t].nom}
              </>,
            ])}
            changer={setType}
          />
        )}
        {type === 'vehicule' && (
          <Choix
            nom="fiche-genre"
            legende="Véhicule"
            valeur={genre}
            options={[
              [
                'voiture',
                <>
                  <Illustration nom="automobile" />
                  Voiture
                </>,
              ],
              [
                'moto',
                <>
                  <Illustration nom="motorcycle" />
                  Moto
                </>,
              ],
            ]}
            changer={(g) => setInfos({ ...infos, genre: g })}
          />
        )}
        <Champ id="fiche-nom" libelle="Nom">
          <input
            id="fiche-nom"
            class="champ"
            required
            value={nom}
            placeholder={exemples[type]}
            onInput={(e) => setNom(e.currentTarget.value)}
          />
        </Champ>
        {CHAMPS_FICHE[type].map((c) => (
          <Champ key={c.cle} id={`fiche-${c.cle}`} libelle={c.libelle}>
            {c.type === 'textarea' ? (
              <textarea
                id={`fiche-${c.cle}`}
                class="champ"
                value={infos[c.cle] ?? ''}
                onInput={(e) => setInfos({ ...infos, [c.cle]: e.currentTarget.value })}
              />
            ) : c.type === 'date' ? (
              <input
                id={`fiche-${c.cle}`}
                class="champ"
                type="date"
                value={infos[c.cle] ?? ''}
                onInput={(e) => setInfos({ ...infos, [c.cle]: e.currentTarget.value })}
              />
            ) : (
              <input
                id={`fiche-${c.cle}`}
                class="champ"
                inputMode={c.numerique ? 'numeric' : undefined}
                value={infos[c.cle] ?? ''}
                onInput={(e) => setInfos({ ...infos, [c.cle]: e.currentTarget.value })}
              />
            )}
          </Champ>
        ))}
        {!fiche && type === 'vehicule' && (
          <Champ id="fiche-km" libelle="Kilométrage actuel">
            <input
              id="fiche-km"
              class="champ"
              inputMode="numeric"
              value={km}
              onInput={(e) => setKm(e.currentTarget.value)}
            />
          </Champ>
        )}
        {modele && (
          <label class="case-a-cocher">
            <input
              type="checkbox"
              checked={avecModele}
              onChange={(e) => setAvecModele(e.currentTarget.checked)}
            />
            <span>
              Créer les échéances habituelles (modèle « {modele.nom} »)
              <small>{modele.description}. Modifiables ensuite.</small>
            </span>
          </label>
        )}
        <Boutons
          supprimer={
            fiche
              ? () => {
                  if (
                    confirmer(
                      `Supprimer la fiche « ${fiche.nom} » et son historique ? Ses tâches et listes seront gardées.`,
                    )
                  ) {
                    void supprimerFiche(fiche);
                    fermer();
                    location.hash = '#/foyer';
                  }
                }
              : undefined
          }
        />
      </form>
    </Feuille>
  );
}

function FormSante({ fiche }: { fiche: Fiche }) {
  const [sante, setSante] = useState<Sante>(
    fiche.sante ?? { allergies: '', traitements: '', vaccins: '', notes: '' },
  );
  const champs: readonly (readonly [keyof Sante, string])[] = [
    ['allergies', 'Allergies'],
    ['traitements', 'Traitements en cours'],
    ['vaccins', 'Vaccins (faits et à venir)'],
    ['notes', 'Notes de santé'],
  ];
  return (
    <Feuille titre={`Santé de ${fiche.nom}`}>
      <form
        class="formulaire"
        onSubmit={(e) => {
          e.preventDefault();
          void enregistrerFiche({ ...fiche, sante });
          fermer();
        }}
      >
        <p class="chiffre">
          <Icone nom="cadenas" />
          <span>
            Chiffré sur ce téléphone avant d’être enregistré. Informations saisies par vous : Hometastic n’est
            pas un avis médical.
          </span>
        </p>
        {champs.map(([cle, libelle]) => (
          <Champ key={cle} id={`sante-${cle}`} libelle={libelle}>
            <textarea
              id={`sante-${cle}`}
              class="champ"
              value={sante[cle]}
              onInput={(e) => setSante({ ...sante, [cle]: e.currentTarget.value })}
            />
          </Champ>
        ))}
        <Boutons />
      </form>
    </Feuille>
  );
}

function FormKm({ fiche }: { fiche: Fiche }) {
  const [valeur, setValeur] = useState(fiche.km ? String(fiche.km.valeur) : '');
  return (
    <Feuille titre="Kilométrage">
      <form
        class="formulaire"
        onSubmit={(e) => {
          e.preventDefault();
          const km = lireEntier(valeur);
          if (km === undefined) return;
          void releverKm(fiche, km);
          fermer();
        }}
      >
        <Champ id="km-valeur" libelle="Compteur (km)">
          <input
            id="km-valeur"
            class="champ"
            inputMode="numeric"
            required
            value={valeur}
            onInput={(e) => setValeur(e.currentTarget.value)}
          />
        </Champ>
        <Boutons />
      </form>
    </Feuille>
  );
}

function FormEntree({ ficheId, entree }: { ficheId: string; entree?: Entree | undefined }) {
  const fiche = fiches.value.find((f) => f.id === ficheId);
  const [date, setDate] = useState(entree?.date ?? aujourdhui.value);
  const [titre, setTitre] = useState(entree?.titre ?? '');
  const [cout, setCout] = useState(entree?.cout === undefined ? '' : String(entree.cout));
  const [km, setKm] = useState(
    entree?.km === undefined ? (fiche?.km ? String(fiche.km.valeur) : '') : String(entree.km),
  );
  const [prestataire, setPrestataire] = useState(entree?.prestataire ?? '');
  const [note, setNote] = useState(entree?.note ?? '');
  const [sante, setSante] = useState(entree?.sante ?? false);
  const enregistrer = (e: Event) => {
    e.preventDefault();
    if (!titre.trim() || !date) return;
    void enregistrerEntree({
      id: entree?.id ?? nouvelId(),
      ficheId,
      date,
      titre: titre.trim(),
      cout: lireMontant(cout),
      km: fiche?.type === 'vehicule' ? lireEntier(km) : undefined,
      prestataire: prestataire.trim() || undefined,
      note: note.trim() || undefined,
      sante: sante || undefined,
      par: entree?.par ?? moi.value?.id,
    });
    fermer();
  };
  return (
    <Feuille titre={entree ? 'Modifier l’entrée' : 'Ajouter à l’historique'}>
      <form class="formulaire" onSubmit={enregistrer}>
        <Champ id="entree-titre" libelle="Quoi">
          <input
            id="entree-titre"
            class="champ"
            required
            value={titre}
            placeholder="Vidange, fuite réparée, vaccin…"
            onInput={(e) => setTitre(e.currentTarget.value)}
          />
        </Champ>
        <div class="ligne-champs">
          <Champ id="entree-date" libelle="Date">
            <input
              id="entree-date"
              class="champ"
              type="date"
              required
              value={date}
              onInput={(e) => setDate(e.currentTarget.value)}
            />
          </Champ>
          <Champ id="entree-cout" libelle={`Coût (${devise.value === 'XPF' ? 'F' : '€'})`}>
            <input
              id="entree-cout"
              class="champ"
              inputMode="decimal"
              value={cout}
              onInput={(e) => setCout(e.currentTarget.value)}
            />
          </Champ>
        </div>
        {fiche?.type === 'vehicule' && (
          <Champ id="entree-km" libelle="Kilométrage">
            <input
              id="entree-km"
              class="champ"
              inputMode="numeric"
              value={km}
              onInput={(e) => setKm(e.currentTarget.value)}
            />
          </Champ>
        )}
        <Champ id="entree-prestataire" libelle="Qui est intervenu">
          <input
            id="entree-prestataire"
            class="champ"
            value={prestataire}
            placeholder="Garage du centre, plombier…"
            onInput={(e) => setPrestataire(e.currentTarget.value)}
          />
        </Champ>
        <Champ id="entree-note" libelle="Note">
          <textarea
            id="entree-note"
            class="champ"
            value={note}
            onInput={(e) => setNote(e.currentTarget.value)}
          />
        </Champ>
        {fiche?.type === 'personne' && (
          <label class="case-a-cocher">
            <input type="checkbox" checked={sante} onChange={(e) => setSante(e.currentTarget.checked)} />
            <span>Santé : chiffré sur le téléphone</span>
          </label>
        )}
        <Boutons
          supprimer={
            entree
              ? () => {
                  void supprimerEntree(entree);
                  fermer();
                }
              : undefined
          }
        />
      </form>
    </Feuille>
  );
}

// ---------- Projet ----------
function FormProjet({ projet }: { projet?: Projet | undefined }) {
  const [type, setType] = useState<TypeProjet>(projet?.type ?? 'voyage');
  const [nom, setNom] = useState(projet?.nom ?? '');
  const [lieu, setLieu] = useState(projet?.lieu ?? '');
  const [debut, setDebut] = useState(projet?.debut ?? '');
  const [fin, setFin] = useState(projet?.fin ?? '');
  const [budget, setBudget] = useState(projet?.budget === undefined ? '' : String(projet.budget));
  const [note, setNote] = useState(projet?.note ?? '');
  const [archive, setArchive] = useState(projet?.archive ?? false);
  const enregistrer = (e: Event) => {
    e.preventDefault();
    if (!nom.trim()) return;
    const base = projet ?? nouveauProjet(type);
    void enregistrerProjet({
      ...base,
      type,
      nom: nom.trim(),
      lieu: lieu.trim() || undefined,
      debut: debut || undefined,
      fin: fin && (!debut || fin >= debut) ? fin : undefined,
      budget: lireMontant(budget),
      note: note.trim() || undefined,
      archive,
    });
    fermer();
    if (!projet) location.hash = `#/projet/${base.id}`;
  };
  return (
    <Feuille titre={projet ? 'Modifier le projet' : 'Nouveau projet'}>
      <form class="formulaire" onSubmit={enregistrer}>
        {!projet && (
          <Choix
            nom="projet-type"
            legende="Type"
            valeur={type}
            options={(Object.keys(TYPES_PROJET) as TypeProjet[]).map((t) => [
              t,
              <>
                <Illustration nom={TYPES_PROJET[t].icone} />
                {TYPES_PROJET[t].nom}
              </>,
            ])}
            changer={setType}
          />
        )}
        <Champ id="projet-nom" libelle="Nom">
          <input
            id="projet-nom"
            class="champ"
            required
            value={nom}
            placeholder="Vacances aux îles, terrasse…"
            onInput={(e) => setNom(e.currentTarget.value)}
          />
        </Champ>
        {type === 'voyage' && (
          <Champ id="projet-lieu" libelle="Destination">
            <input
              id="projet-lieu"
              class="champ"
              value={lieu}
              onInput={(e) => setLieu(e.currentTarget.value)}
            />
          </Champ>
        )}
        <div class="ligne-champs">
          <Champ id="projet-debut" libelle="Début">
            <input
              id="projet-debut"
              class="champ"
              type="date"
              value={debut}
              onInput={(e) => setDebut(e.currentTarget.value)}
            />
          </Champ>
          <Champ id="projet-fin" libelle="Fin">
            <input
              id="projet-fin"
              class="champ"
              type="date"
              value={fin}
              min={debut || undefined}
              onInput={(e) => setFin(e.currentTarget.value)}
            />
          </Champ>
        </div>
        <Champ id="projet-budget" libelle={`Budget prévu (${devise.value === 'XPF' ? 'F' : '€'})`}>
          <input
            id="projet-budget"
            class="champ"
            inputMode="decimal"
            value={budget}
            onInput={(e) => setBudget(e.currentTarget.value)}
          />
        </Champ>
        <Champ id="projet-note" libelle="Note">
          <textarea
            id="projet-note"
            class="champ"
            value={note}
            onInput={(e) => setNote(e.currentTarget.value)}
          />
        </Champ>
        {projet && (
          <label class="case-a-cocher">
            <input type="checkbox" checked={archive} onChange={(e) => setArchive(e.currentTarget.checked)} />
            <span>Projet terminé (archivé, toujours consultable)</span>
          </label>
        )}
        <Boutons
          supprimer={
            projet
              ? () => {
                  if (
                    confirmer(
                      `Supprimer le projet « ${projet.nom} » et ses dépenses ? Ses tâches et listes seront gardées.`,
                    )
                  ) {
                    void supprimerProjet(projet);
                    fermer();
                    location.hash = '#/foyer';
                  }
                }
              : undefined
          }
        />
      </form>
    </Feuille>
  );
}

function FormDepense({ projetId, depense }: { projetId: string; depense?: Depense | undefined }) {
  const [libelle, setLibelle] = useState(depense?.libelle ?? '');
  const [montant, setMontant] = useState(depense ? String(depense.montant) : '');
  const [date, setDate] = useState(depense?.date ?? aujourdhui.value);
  const enregistrer = (e: Event) => {
    e.preventDefault();
    const m = lireMontant(montant);
    if (!libelle.trim() || m === undefined) return;
    void enregistrerDepense({
      id: depense?.id ?? nouvelId(),
      projetId,
      libelle: libelle.trim(),
      montant: m,
      date: date || aujourdhui.value,
      par: depense?.par ?? moi.value?.id,
    });
    fermer();
  };
  return (
    <Feuille titre={depense ? 'Modifier la dépense' : 'Nouvelle dépense'}>
      <form class="formulaire" onSubmit={enregistrer}>
        <Champ id="depense-libelle" libelle="Quoi">
          <input
            id="depense-libelle"
            class="champ"
            required
            value={libelle}
            placeholder="Billets d’avion"
            onInput={(e) => setLibelle(e.currentTarget.value)}
          />
        </Champ>
        <div class="ligne-champs">
          <Champ id="depense-montant" libelle={`Montant (${devise.value === 'XPF' ? 'F' : '€'})`}>
            <input
              id="depense-montant"
              class="champ"
              inputMode="decimal"
              required
              value={montant}
              onInput={(e) => setMontant(e.currentTarget.value)}
            />
          </Champ>
          <Champ id="depense-date" libelle="Date">
            <input
              id="depense-date"
              class="champ"
              type="date"
              value={date}
              onInput={(e) => setDate(e.currentTarget.value)}
            />
          </Champ>
        </div>
        {lireMontant(montant) !== undefined && (
          <p class="aide">{formatMontant(lireMontant(montant) ?? 0, devise.value)}</p>
        )}
        <Boutons
          supprimer={
            depense
              ? () => {
                  void supprimerDepense(depense);
                  fermer();
                }
              : undefined
          }
        />
      </form>
    </Feuille>
  );
}

// ---------- Foyer et menu ----------
function FormFoyer() {
  const f = foyer.value;
  const [nom, setNom] = useState(f?.nom ?? '');
  const [liste, setListe] = useState<Membre[]>(f?.membres ?? []);
  const [dev, setDev] = useState(f?.devise ?? 'XPF');
  if (!f) return null;
  const moiId = moi.value?.id;
  const changerNom = (id: string, n: string) =>
    setListe(liste.map((m) => (m.id === id ? { ...m, nom: n } : m)));
  return (
    <Feuille titre="Le foyer">
      <form
        class="formulaire"
        onSubmit={(e) => {
          e.preventDefault();
          // Un prénom effacé garde l’ancien ; une personne ajoutée sans prénom est ignorée.
          const membres = liste.flatMap((m) => {
            const n = m.nom.trim();
            const avant = f.membres.find((x) => x.id === m.id);
            return n ? [{ ...m, nom: n }] : avant ? [avant] : [];
          });
          const retires = f.membres.filter((m) => !liste.some((x) => x.id === m.id));
          if (
            retires.length &&
            !window.confirm(
              `Retirer ${listeNoms(retires.map((m) => m.nom))} du foyer ? Ses tâches passeront « au premier libre ».`,
            )
          )
            return;
          void modifierFoyer(
            { ...f, nom: nom.trim() || f.nom, membres, devise: dev },
            retires.map((m) => m.id),
          );
          fermer();
        }}
      >
        <Champ id="foyer-nom" libelle="Nom du foyer">
          <input id="foyer-nom" class="champ" value={nom} onInput={(e) => setNom(e.currentTarget.value)} />
        </Champ>
        <fieldset class="personnes">
          <legend class="legende">Les personnes du foyer</legend>
          {liste.map((m, i) => (
            <div key={m.id} class="ligne-personne">
              <span class={`avatar ${m.couleur}`} aria-hidden="true">
                {m.nom.trim().charAt(0).toUpperCase() || i + 1}
              </span>
              <label class="vh" for={`foyer-membre-${m.id}`}>
                {`Prénom de la personne ${i + 1}`}
              </label>
              <input
                id={`foyer-membre-${m.id}`}
                class="champ"
                value={m.nom}
                onInput={(e) => changerNom(m.id, e.currentTarget.value)}
              />
              {m.id !== moiId && (
                <button
                  type="button"
                  class="bouton bouton-icone"
                  aria-label={`Retirer ${m.nom.trim() || `la personne ${i + 1}`}`}
                  onClick={() => setListe(liste.filter((x) => x.id !== m.id))}
                >
                  <Icone nom="croix" />
                </button>
              )}
            </div>
          ))}
          {liste.length < MEMBRES_MAX && (
            <button
              type="button"
              class="lien-bouton"
              onClick={() => setListe([...liste, { id: nouvelId(), nom: '', couleur: couleurLibre(liste) }])}
            >
              <Icone nom="plus" />
              Ajouter une personne
            </button>
          )}
          <p class="aide">
            Ado, colocataire… : six personnes au plus. Les jeunes enfants ont plutôt leur fiche dans Foyer.
          </p>
        </fieldset>
        <Choix
          nom="foyer-devise"
          legende="Devise"
          valeur={dev}
          options={[
            ['XPF', 'Franc pacifique (F)'],
            ['EUR', 'Euro (€)'],
          ]}
          changer={setDev}
        />
        <Boutons />
      </form>
    </Feuille>
  );
}

// ---------- Sortie « À voir » (brique Liste, billets en Tâche) ----------
function FormSortie({ listeId, sortie }: { listeId: string; sortie?: Article | undefined }) {
  const [nom, setNom] = useState(sortie?.nom ?? '');
  const [categorie, setCategorie] = useState<CategorieSortie>(sortie?.categorie ?? 'film');
  const [date, setDate] = useState(sortie?.date ?? '');
  const [lieu, setLieu] = useState(sortie?.lieu ?? '');
  const [billet, setBillet] = useState<EtatBillet>(sortie?.billet ?? 'aucun');
  const tache = sortie?.tacheId ? taches.value.find((t) => t.id === sortie.tacheId) : undefined;
  const [achatAvant, setAchatAvant] = useState(tache?.echeance ?? '');
  const [vu, setVu] = useState(!!sortie?.coche);
  const proposee = dateAchatBillets(date || undefined, aujourdhui.value);
  const enregistrer = (e: Event) => {
    e.preventDefault();
    if (!nom.trim()) return;
    const base: Article = sortie ?? {
      id: nouvelId(),
      listeId,
      nom: '',
      ajoutePar: moi.value?.id,
      ajouteLe: new Date().toISOString(),
    };
    void enregistrerSortie(
      {
        ...base,
        nom: nom.trim(),
        categorie,
        date: date || undefined,
        lieu: lieu.trim() || undefined,
        billet,
        coche: vu ? (base.coche ?? { par: moi.value?.id, le: aujourdhui.value }) : undefined,
      },
      achatAvant || undefined,
      aujourdhui.value,
    );
    fermer();
  };
  return (
    <Feuille titre={sortie ? 'Modifier la sortie' : 'À voir'}>
      <form class="formulaire" onSubmit={enregistrer}>
        <Champ id="sortie-nom" libelle="Quoi">
          <input
            id="sortie-nom"
            class="champ"
            required
            value={nom}
            placeholder="Film, pièce, concert, soirée…"
            onInput={(e) => setNom(e.currentTarget.value)}
          />
        </Champ>
        <Choix
          nom="sortie-categorie"
          legende="Genre"
          valeur={categorie}
          options={(Object.keys(CATEGORIES_SORTIE) as CategorieSortie[]).map((c) => [
            c,
            <>
              <Illustration nom={CATEGORIES_SORTIE[c].icone} />
              {CATEGORIES_SORTIE[c].nom}
            </>,
          ])}
          changer={setCategorie}
        />
        <div class="ligne-champs">
          <Champ id="sortie-date" libelle="Date (facultatif)">
            <input
              id="sortie-date"
              class="champ"
              type="date"
              value={date}
              onInput={(e) => setDate(e.currentTarget.value)}
            />
          </Champ>
          <Champ id="sortie-lieu" libelle="Où">
            <input
              id="sortie-lieu"
              class="champ"
              value={lieu}
              placeholder="Cinéma…"
              onInput={(e) => setLieu(e.currentTarget.value)}
            />
          </Champ>
        </div>
        <Choix
          nom="sortie-billet"
          legende="Billets"
          valeur={billet}
          options={[
            ['aucun', 'Pas besoin'],
            ['a-acheter', 'À acheter'],
            ['achete', 'Achetés'],
          ]}
          changer={setBillet}
        />
        {billet === 'a-acheter' && (
          <Champ id="sortie-achat" libelle="Rappel : acheter les billets avant le">
            <input
              id="sortie-achat"
              class="champ"
              type="date"
              value={achatAvant || proposee}
              onInput={(e) => setAchatAvant(e.currentTarget.value)}
            />
          </Champ>
        )}
        {sortie && (
          <label class="case-a-cocher">
            <input type="checkbox" checked={vu} onChange={(e) => setVu(e.currentTarget.checked)} />
            <span>Déjà vu</span>
          </label>
        )}
        <Boutons
          supprimer={
            sortie
              ? () => {
                  void supprimerArticle(sortie);
                  fermer();
                }
              : undefined
          }
        />
      </form>
    </Feuille>
  );
}

function MenuAjout() {
  const listeSorties = listes.value.find((l) => l.type === 'sorties');
  const compte = fiches.value.find((f) => f.type === 'compte');
  const choix: readonly (readonly [string, string, string, TypeFeuille | 'article'])[] = [
    ['shopping-cart', 'Article', 'Sur la liste de courses', 'article'],
    ['check-mark-button', 'Tâche', 'Avec date, rappel, répétition', { type: 'tache' }],
    ['card-index-dividers', 'Fiche', 'Maison, voiture, enfant, animal, compte', { type: 'fiche' }],
    ['desert-island', 'Projet', 'Voyage, travaux, événement', { type: 'projet' }],
    [
      'clapper-board',
      'À voir',
      'Film, spectacle, soirée, billets',
      listeSorties
        ? { type: 'sortie', listeId: listeSorties.id }
        : { type: 'liste', defauts: { nom: 'À voir', type: 'sorties' } },
    ],
    [
      'money-bag',
      'Virement',
      'Rappel récurrent avec montant',
      {
        type: 'tache',
        defauts: {
          titre: compte ? `Virement vers ${compte.nom.toLowerCase()}` : 'Virement',
          assignation: 'nous',
          recurrence: { type: 'calendaire', unite: 'mois', intervalle: 1 },
          ficheId: compte?.id,
        },
      },
    ],
  ];
  return (
    <Feuille titre="Ajouter">
      <div class="menu-ajout">
        {choix.map(([icone, titre, sous, action]) => (
          <button
            key={titre}
            type="button"
            onClick={() => {
              if (action === 'article') {
                fermer();
                location.hash = '#/courses';
                requestAnimationFrame(() => document.getElementById('saisie-article')?.focus());
              } else ouvrir(action);
            }}
          >
            <Illustration nom={icone} />
            <strong>{titre}</strong>
            <span>{sous}</span>
          </button>
        ))}
      </div>
    </Feuille>
  );
}

/** La feuille ouverte, s’il y en a une. */
export function Feuilles() {
  const f = feuille.value;
  if (!f) return null;
  switch (f.type) {
    case 'ajout':
      return <MenuAjout />;
    case 'tache':
      return <FormTache tache={f.tache} defauts={f.defauts} />;
    case 'liste':
      return <FormListe liste={f.liste} defauts={f.defauts} />;
    case 'article':
      return <FormArticle article={f.article} />;
    case 'sortie':
      return <FormSortie listeId={f.listeId} sortie={f.sortie} />;
    case 'fiche':
      return <FormFiche fiche={f.fiche} />;
    case 'sante':
      return <FormSante fiche={f.fiche} />;
    case 'km':
      return <FormKm fiche={f.fiche} />;
    case 'entree':
      return <FormEntree ficheId={f.ficheId} entree={f.entree} />;
    case 'projet':
      return <FormProjet projet={f.projet} />;
    case 'depense':
      return <FormDepense projetId={f.projetId} depense={f.depense} />;
    case 'foyer':
      return <FormFoyer />;
  }
}

/** Premier lancement : créer le foyer. */
/** Premier lancement : votre prénom, la composition du foyer et les autres personnes (spec 007). */
export function FormAccueil() {
  const [moiNom, setMoiNom] = useState('');
  const [composition, setComposition] = useState<Composition>('couple');
  const [autresNoms, setAutresNoms] = useState<string[]>(['']);
  const [nom, setNom] = useState('');
  const [dev, setDev] = useState<'XPF' | 'EUR'>('XPF');
  const composer = (c: Composition) => {
    setComposition(c);
    const n = COMPOSITIONS[c].places.length;
    // Autant de champs que la composition en propose, sans perdre un prénom déjà saisi.
    const gardes = autresNoms.filter((x, i) => i < n || x.trim());
    while (gardes.length < n) gardes.push('');
    setAutresNoms(gardes);
  };
  return (
    <form
      class="formulaire"
      onSubmit={(e) => {
        e.preventDefault();
        if (moiNom.trim())
          void creerFoyer(nom, [moiNom, ...autresNoms], dev, COMPOSITIONS[composition].nomFoyer);
      }}
    >
      <Champ id="accueil-moi" libelle="Votre prénom">
        <input
          id="accueil-moi"
          class="champ"
          required
          autoComplete="given-name"
          value={moiNom}
          onInput={(e) => setMoiNom(e.currentTarget.value)}
        />
      </Champ>
      <Choix
        nom="accueil-composition"
        legende="Qui vit dans le foyer ?"
        valeur={composition}
        options={(Object.keys(COMPOSITIONS) as Composition[]).map(
          (c) => [c, COMPOSITIONS[c].libelle] as const,
        )}
        changer={composer}
      />
      {autresNoms.map((v, i) => (
        <div key={i} class="ligne-personne">
          <Champ id={`accueil-autre-${i}`} libelle={libellePlace(composition, i)}>
            <input
              id={`accueil-autre-${i}`}
              class="champ"
              value={v}
              onInput={(e) => setAutresNoms(autresNoms.map((x, j) => (j === i ? e.currentTarget.value : x)))}
            />
          </Champ>
          {autresNoms.length > 1 && (
            <button
              type="button"
              class="bouton bouton-icone"
              aria-label={`Retirer ${v.trim() || `la personne ${i + 2}`}`}
              onClick={() => setAutresNoms(autresNoms.filter((_, j) => j !== i))}
            >
              <Icone nom="croix" />
            </button>
          )}
        </div>
      ))}
      {autresNoms.length < MEMBRES_MAX - 1 && (
        <button type="button" class="lien-bouton" onClick={() => setAutresNoms([...autresNoms, ''])}>
          <Icone nom="plus" />
          Ajouter une personne
        </button>
      )}
      <Champ id="accueil-foyer" libelle="Nom du foyer (facultatif)">
        <input
          id="accueil-foyer"
          class="champ"
          placeholder={COMPOSITIONS[composition].nomFoyer}
          value={nom}
          onInput={(e) => setNom(e.currentTarget.value)}
        />
      </Champ>
      <Choix
        nom="accueil-devise"
        legende="Devise"
        valeur={dev}
        options={[
          ['XPF', 'Franc pacifique (F)'],
          ['EUR', 'Euro (€)'],
        ]}
        changer={setDev}
      />
      <button type="submit" class="bouton bouton-plein">
        Créer le foyer
      </button>
    </form>
  );
}
