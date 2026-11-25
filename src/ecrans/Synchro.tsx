import { useEffect, useState } from 'preact/hooks';
import { annoncer, autre, depot, moi } from '../app/etat';
import { Icone } from '../app/icones';
import { BlocTete } from '../composants/communs';
import { de } from '../domaine/francais';
import { cleVapid } from '../donnees/synchro/config';
import { decoderInvitation, encoderInvitation } from '../donnees/synchro/invitation';
import {
  activerSynchro,
  erreurSynchro,
  estRelie,
  etatSynchro,
  lienInvitation,
  nombreDeTelephones,
  quitter,
  type EtatSynchro,
} from '../donnees/synchro/synchro';

const ETATS: Record<EtatSynchro, string> = {
  indisponible: 'Enregistré',
  locale: 'Enregistré',
  connexion: 'Connexion…',
  synchronisee: 'Synchronisé',
  'hors-ligne': 'Hors ligne',
  erreur: 'À vérifier',
};

function recharger(ancre = '#/nous') {
  history.replaceState(null, '', ancre);
  location.reload();
}

function message(e: unknown, defaut: string): string {
  return e instanceof Error && e.message ? e.message : defaut;
}

/** Partage du lien d’invitation : feuille de partage du téléphone, sinon copie. */
async function inviter(): Promise<string | undefined> {
  const lien = await lienInvitation(depot());
  const nom = autre.value?.nom;
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Nid',
        text: `Rejoins notre foyer sur Nid${nom ? `, ${nom}` : ''} :`,
        url: lien,
      });
      return lien;
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return lien;
  }
  try {
    await navigator.clipboard.writeText(lien);
    annoncer('Lien d’invitation copié');
  } catch {
    annoncer('Copiez le lien affiché');
  }
  return lien;
}

function Appareil({
  nom,
  detail,
  etat,
  attente,
}: {
  nom: string;
  detail: string;
  etat: string;
  attente?: boolean;
}) {
  return (
    <li class="appareil">
      <Icone nom="telephone" />
      <span>
        <strong>{nom}</strong>
        <br />
        <span class="mono">{detail}</span>
      </span>
      <span class={attente ? 'mono attente' : 'mono'}>{etat}</span>
    </li>
  );
}

export function BlocSynchro() {
  const [enCours, setEnCours] = useState(false);
  const [lien, setLien] = useState<string | undefined>();
  const [lienSaisi, setLienSaisi] = useState('');
  const [telephones, setTelephones] = useState<number | undefined>();
  const etat = etatSynchro.value;
  const relie = estRelie() && etat !== 'indisponible';
  const nomAutre = autre.value ? `Téléphone ${de(autre.value.nom)}` : 'Téléphone de l’autre membre';

  useEffect(() => {
    if (relie) void nombreDeTelephones().then(setTelephones, () => undefined);
  }, [relie]);

  const action = (f: () => Promise<void>) => async () => {
    setEnCours(true);
    try {
      await f();
    } finally {
      setEnCours(false);
    }
  };

  if (etat === 'indisponible') {
    return (
      <section class="bloc" aria-labelledby="t-synchro">
        <BlocTete titre="Synchronisation" id="t-synchro">
          <span class="mono">Non partagé</span>
        </BlocTete>
        <ul class="appareils">
          <Appareil nom="Ce téléphone" detail="Toutes les données, même hors ligne" etat="Enregistré" />
          <Appareil nom={nomAutre} detail="Synchronisation en temps réel à brancher" etat="À venir" attente />
        </ul>
        <p class="aide">
          La synchronisation est prête dans l’app : elle s’activera dès que le projet Firebase du foyer sera
          branché. D’ici là, une sauvegarde exportée ici peut être importée sur l’autre téléphone.
        </p>
      </section>
    );
  }

  if (!relie) {
    return (
      <section class="bloc" aria-labelledby="t-synchro">
        <BlocTete titre="Synchronisation" id="t-synchro">
          <span class="mono">Non partagé</span>
        </BlocTete>
        <ul class="appareils">
          <Appareil nom="Ce téléphone" detail="Toutes les données, même hors ligne" etat="Enregistré" />
          <Appareil nom={nomAutre} detail="Pas encore relié" etat="À inviter" attente />
        </ul>
        <p class="aide">
          Le foyer est copié sur votre espace Firebase (gratuit) ; la santé y part chiffrée. Vous enverrez
          ensuite un lien {autre.value ? `à ${autre.value.nom}` : 'à l’autre membre'}.
        </p>
        <div class="actions">
          <button
            type="button"
            class="bouton bouton-plein"
            disabled={enCours}
            onClick={action(async () => {
              try {
                await activerSynchro(depot());
                recharger();
              } catch (e) {
                annoncer(message(e, 'Activation impossible, réessayez une fois connecté'));
              }
            })}
          >
            <Icone nom="nuage" />
            {enCours ? 'Activation…' : 'Activer la synchronisation'}
          </button>
        </div>
        <form
          class="saisie-article"
          onSubmit={(e) => {
            e.preventDefault();
            const invitation = decoderInvitation(lienSaisi);
            if (invitation) location.hash = `#/rejoindre/${encoderInvitation(invitation)}`;
            else annoncer('Ce lien d’invitation n’est pas valide');
          }}
        >
          <label class="vh" for="lien-saisi">
            Lien d’invitation reçu
          </label>
          <input
            id="lien-saisi"
            class="champ"
            autoComplete="off"
            placeholder="Ou collez le lien reçu"
            value={lienSaisi}
            onInput={(e) => setLienSaisi(e.currentTarget.value)}
          />
          <button type="submit" class="bouton" disabled={!lienSaisi.trim()}>
            Rejoindre
          </button>
        </form>
      </section>
    );
  }

  return (
    <section class="bloc" aria-labelledby="t-synchro">
      <BlocTete titre="Synchronisation" id="t-synchro">
        <span class="mono">{ETATS[etat]}</span>
      </BlocTete>
      <ul class="appareils">
        <Appareil
          nom="Ce téléphone"
          detail={
            etat === 'hors-ligne'
              ? 'Les changements partiront au retour du réseau'
              : 'Foyer partagé, même hors ligne'
          }
          etat={ETATS[etat]}
          attente={etat !== 'synchronisee'}
        />
        <Appareil
          nom={nomAutre}
          detail={
            telephones !== undefined && telephones > 1 ? 'Relié au foyer' : 'En attente du lien d’invitation'
          }
          etat={telephones !== undefined && telephones > 1 ? 'Relié' : 'À inviter'}
          attente={!(telephones !== undefined && telephones > 1)}
        />
      </ul>
      {etat === 'erreur' && erreurSynchro.value ? (
        <p class="aide" role="alert">
          Souci de synchronisation : {erreurSynchro.value}
        </p>
      ) : null}
      <div class="actions">
        <button
          type="button"
          class="bouton bouton-plein"
          disabled={enCours}
          onClick={action(async () => {
            try {
              setLien(await inviter());
            } catch (e) {
              annoncer(message(e, 'Lien indisponible hors ligne'));
            }
          })}
        >
          <Icone nom="partager" />
          {autre.value ? `Inviter ${autre.value.nom}` : 'Inviter'}
        </button>
        {cleVapid ? (
          <button
            type="button"
            class="bouton"
            disabled={enCours}
            onClick={action(async () => {
              try {
                const { activerRappels } = await import('../donnees/synchro/notifications');
                await activerRappels(moi.value?.id);
                annoncer('Rappels activés sur ce téléphone');
              } catch (e) {
                annoncer(message(e, 'Rappels indisponibles sur ce téléphone'));
              }
            })}
          >
            <Icone nom="cloche" />
            Recevoir les rappels
          </button>
        ) : null}
      </div>
      {lien ? (
        <>
          <label class="vh" for="lien-invitation">
            Lien d’invitation
          </label>
          <input
            id="lien-invitation"
            class="champ lien-invitation"
            readOnly
            value={lien}
            onFocus={(e) => e.currentTarget.select()}
          />
        </>
      ) : null}
      <p class="aide">
        Le lien ouvre le foyer et sa santé chiffrée : envoyez-le seulement{' '}
        {autre.value ? `à ${autre.value.nom}` : 'à l’autre membre du foyer'}.
        {cleVapid
          ? ' Rappels sur iPhone : ajoutez d’abord Nid à l’écran d’accueil (Partager, « Sur l’écran d’accueil ») et ouvrez-le depuis l’icône. Un rappel de santé dit seulement « Rappel santé ».'
          : ''}
      </p>
      <details class="repli">
        <summary>Ne plus synchroniser ce téléphone</summary>
        <p class="aide">
          Ce téléphone reviendra à ses données d’avant la synchronisation ; le foyer partagé reste sur l’autre
          téléphone.
        </p>
        <button
          type="button"
          class="bouton"
          onClick={() => {
            if (!window.confirm('Ne plus synchroniser ce téléphone ?')) return;
            quitter();
            recharger();
          }}
        >
          Ne plus synchroniser
        </button>
      </details>
    </section>
  );
}
