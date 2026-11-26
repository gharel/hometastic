import { useId, useState } from 'preact/hooks';
import { Icone } from '../app/icones';
import {
  installation,
  installationPlusTard,
  ouvrirFenetreInstallation,
  remettreInstallationAPlusTard,
} from '../app/installation';
import { Logo } from '../app/Logo';

/** Où la carte s’affiche : premier écran, en tête d’Aujourd’hui (avec « Plus tard »), ou dans Nous. */
type Lieu = 'accueil' | 'aujourdhui' | 'nous';

function MarcheIOS() {
  return (
    <ol class="marche">
      <li>
        Touchez <strong>Partager</strong> <Icone nom="partagerIos" classe="en-ligne" />, le carré avec une
        flèche. S’il n’apparaît pas, ouvrez d’abord le menu <strong>…</strong> à côté de l’adresse.
      </li>
      <li>
        Choisissez <strong>Sur l’écran d’accueil</strong> (faites défiler la liste si besoin).
      </li>
      <li>
        Laissez l’ouverture en app web activée, puis touchez <strong>Ajouter</strong>.
      </li>
    </ol>
  );
}

function MarcheMenu() {
  return (
    <ol class="marche">
      <li>
        Ouvrez le menu du navigateur <Icone nom="plusOptions" classe="en-ligne" />.
      </li>
      <li>
        Choisissez <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.
      </li>
    </ol>
  );
}

/** Carte « Installer Hometastic sur l’écran d’accueil » (spec 006). */
export function CarteInstallation({ lieu }: { lieu: Lieu }) {
  const mode = installation.value;
  const [marche, setMarche] = useState(false);
  const id = useId();

  if (mode === 'installee') {
    return lieu === 'nous' ? <p class="aide">Hometastic est installée sur ce téléphone.</p> : null;
  }
  if (lieu === 'aujourdhui' && installationPlusTard.value) return null;

  const deplie = mode !== 'fenetre';
  return (
    <section class="carte installation" aria-labelledby={`${id}-t`}>
      <div class="installation-tete">
        <Logo />
        <div>
          <h2 id={`${id}-t`}>Installer Hometastic sur l’écran d’accueil</h2>
          <p class="sous">Elle s’ouvre alors comme une app : en plein écran, même hors ligne.</p>
        </div>
      </div>
      {lieu === 'accueil' && mode === 'ios' && (
        <p class="aide">
          Sur iPhone, installez-la avant de commencer : ce que vous saisissez dans le navigateur ne suit pas
          dans l’app.
        </p>
      )}
      <div class="actions">
        <button
          type="button"
          class="bouton bouton-plein"
          aria-expanded={deplie ? (marche ? 'true' : 'false') : undefined}
          aria-controls={deplie ? `${id}-m` : undefined}
          onClick={async () => {
            if (!(await ouvrirFenetreInstallation())) setMarche(!marche);
          }}
        >
          <Icone nom="telecharger" />
          Installer
        </button>
        {lieu === 'aujourdhui' && (
          <button type="button" class="bouton" onClick={remettreInstallationAPlusTard}>
            Plus tard
          </button>
        )}
      </div>
      {deplie && (
        <div id={`${id}-m`} hidden={!marche}>
          {mode === 'ios' ? <MarcheIOS /> : <MarcheMenu />}
        </div>
      )}
    </section>
  );
}
