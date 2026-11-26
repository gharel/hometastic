import { useEffect, useRef, useState } from 'preact/hooks';
import { Feuilles, FormAccueil } from '../composants/formulaires';
import { CarteInstallation } from '../composants/installation';
import { AFaire } from '../ecrans/AFaire';
import { Aujourdhui } from '../ecrans/Aujourdhui';
import { Courses } from '../ecrans/Courses';
import { Fiche } from '../ecrans/Fiche';
import { Foyer } from '../ecrans/Foyer';
import { Analyse } from '../ecrans/Analyse';
import { Catalogue } from '../ecrans/Catalogue';
import { Nous } from '../ecrans/Nous';
import { Projet } from '../ecrans/Projet';
import { Rejoindre } from '../ecrans/Rejoindre';
import { etatSynchro, type EtatSynchro } from '../donnees/synchro/synchro';
import { BoutonTheme } from './BoutonTheme';
import { annoncer, annonce, depot, foyer, membres, ouvrir, pret, route } from './etat';
import { Icone, type NomIcone } from './icones';
import { Logo } from './Logo';
import { TITRES, ongletDe, type Onglet, type Route } from './routage';

const ONGLETS: readonly (readonly [Onglet, NomIcone])[] = [
  ['aujourdhui', 'aujourdhui'],
  ['courses', 'panier'],
  ['a-faire', 'taches'],
  ['foyer', 'maison'],
  ['nous', 'nous'],
];

function Ecran({ r }: { r: Route }) {
  switch (r.ecran) {
    case 'aujourdhui':
      return <Aujourdhui />;
    case 'courses':
      return <Courses id={r.id} />;
    case 'a-faire':
      return <AFaire />;
    case 'foyer':
      return <Foyer />;
    case 'fiche':
      return <Fiche id={r.id} />;
    case 'projet':
      return <Projet id={r.id} />;
    case 'nous':
      return <Nous />;
    case 'analyse':
      return <Analyse mois={r.id} />;
    case 'rejoindre':
      return <Rejoindre code={r.code} />;
    case 'catalogue':
      return <Catalogue listeId={r.id} />;
  }
}

/** Pastille d’état de la synchronisation (en-tête et barre latérale). */
const PASTILLES: Record<EtatSynchro, { etat: string; texte: string; detail: string }> = {
  indisponible: {
    etat: 'local',
    texte: 'Non partagé',
    detail: 'Tout fonctionne hors ligne. La synchronisation entre vos deux téléphones est à brancher (Nous).',
  },
  locale: {
    etat: 'local',
    texte: 'Non partagé',
    detail: 'Tout fonctionne hors ligne. Activez la synchronisation dans Nous.',
  },
  connexion: { etat: 'en-cours', texte: 'Connexion…', detail: 'Connexion au foyer partagé.' },
  synchronisee: {
    etat: 'ok',
    texte: 'Synchronisé',
    detail: 'Les changements arrivent en temps réel sur l’autre téléphone.',
  },
  'hors-ligne': {
    etat: 'hors-ligne',
    texte: 'Hors ligne',
    detail: 'Vos changements partiront au retour du réseau.',
  },
  erreur: {
    etat: 'erreur',
    texte: 'À vérifier',
    detail: 'La synchronisation a rencontré un souci, voir Nous.',
  },
};

function Annonce() {
  const [visible, setVisible] = useState(false);
  const a = annonce.value;
  useEffect(() => {
    if (!a) return;
    setVisible(true);
    const minuterie = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(minuterie);
  }, [a?.n]);
  return (
    <div class="toast" role="status" hidden={!visible || !a}>
      {a?.texte}
    </div>
  );
}

function Accueil() {
  return (
    <main class="accueil" id="contenu">
      <Logo classe="logo-grand" />
      <h1>Bienvenue dans Hometastic</h1>
      <p class="chapeau">
        Les courses en un tap, les choses à faire sans rien oublier, et tout le foyer suivi au même endroit :
        maison, voitures, enfants, voyages.
      </p>
      <CarteInstallation lieu="accueil" />
      <FormAccueil />
      <details class="repli">
        <summary>Restaurer une sauvegarde</summary>
        <label class="bouton">
          <Icone nom="televerser" />
          Choisir le fichier
          <input
            type="file"
            accept="application/json,.json"
            class="vh"
            onChange={async (e) => {
              const fichier = e.currentTarget.files?.[0];
              if (!fichier) return;
              try {
                await depot().importer(JSON.parse(await fichier.text()));
              } catch (err) {
                annoncer(err instanceof Error ? err.message : 'Fichier illisible');
              }
            }}
          />
        </label>
      </details>
      <Annonce />
    </main>
  );
}

export function Coque() {
  const r = route.value;
  const onglet = ongletDe(r);
  const cle = JSON.stringify(r);
  const premier = useRef(true);

  useEffect(() => {
    document.title = `${TITRES[onglet]} · Hometastic`;
    if (premier.current) {
      premier.current = false;
      return;
    }
    scrollTo(0, 0);
    document.querySelector<HTMLElement>('.vue h1')?.focus({ preventScroll: true });
  }, [cle]);

  if (!pret.value) return <div class="chargement" aria-busy="true" />;
  if (r.ecran === 'rejoindre') return <Rejoindre code={r.code} />;
  const f = foyer.value;
  if (!f) return <Accueil />;
  const pastille = PASTILLES[etatSynchro.value];

  return (
    <div class="app">
      <a
        class="lien-evitement"
        href="#contenu"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('contenu')?.focus();
        }}
      >
        Aller au contenu
      </a>
      <nav class="navigation" aria-label="Navigation principale">
        <a class="nav-marque" href="#/aujourdhui">
          <span class="marque">
            <Logo />
            Hometastic
          </span>
          <span class="doux">{f.nom}</span>
        </a>
        <ul>
          {ONGLETS.map(([o, icone]) => (
            <li key={o}>
              <a href={`#/${o}`} aria-current={o === onglet ? 'page' : undefined}>
                <span class="nav-ico">
                  <Icone nom={icone} />
                </span>
                <span>{TITRES[o]}</span>
              </a>
            </li>
          ))}
        </ul>
        <div class="nav-pied">
          <strong>{pastille.texte}</strong>
          <p>{pastille.detail}</p>
        </div>
      </nav>

      <div class="colonne">
        <header class="barre">
          <a class="marque" href="#/aujourdhui" aria-label="Hometastic, aujourd’hui">
            <Logo />
            <span class="marque-nom">Hometastic</span>
          </a>
          <a class="synchro" href="#/nous" data-etat={pastille.etat}>
            <span class="duo" aria-hidden="true">
              {membres.value.map((m) => (
                <span key={m.id} class={`avatar ${m.couleur}`}>
                  {m.nom.charAt(0).toUpperCase()}
                </span>
              ))}
            </span>
            <span class="voyant" aria-hidden="true" />
            <span class="synchro-texte">{pastille.texte}</span>
            <span class="vh"> : {pastille.detail}</span>
          </a>
          <BoutonTheme />
        </header>
        <main id="contenu" tabIndex={-1}>
          <Ecran r={r} />
        </main>
      </div>

      <button
        type="button"
        class="fab"
        aria-label="Ajouter un article, une tâche, une fiche ou un projet"
        onClick={() => ouvrir({ type: 'ajout' })}
      >
        <Icone nom="plus" />
      </button>
      <Feuilles />
      <Annonce />
    </div>
  );
}
