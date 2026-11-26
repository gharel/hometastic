import { useState } from 'preact/hooks';
import { choisirMembre, depot, foyer } from '../app/etat';
import { Icone } from '../app/icones';
import type { Membre } from '../domaine/types';
import { configFirebase, foyerRelie } from '../donnees/synchro/config';
import { decoderInvitation } from '../donnees/synchro/invitation';

/** Après avoir rejoint : on recharge pour lire le foyer partagé plutôt que les données locales. */
function recharger() {
  history.replaceState(null, '', '#/aujourdhui');
  location.reload();
}

function messageErreur(e: unknown): string {
  const code = (e as { code?: string } | null)?.code;
  if (code === 'permission-denied' || code === 'not-found')
    return 'Invitation refusée : ce lien n’est plus valable. Demandez-en un nouveau.';
  if (code === 'unavailable') return 'Pas de réseau : réessayez une fois connecté.';
  return e instanceof Error ? e.message : 'Impossible de rejoindre le foyer.';
}

/** Écran ouvert par le lien d’invitation (#/rejoindre/<code>), avec ou sans foyer sur ce téléphone. */
export function Rejoindre({ code }: { code: string }) {
  const [etat, setEtat] = useState<'attente' | 'en-cours' | 'choix'>('attente');
  const [erreur, setErreur] = useState<string | undefined>();
  const [qui, setQui] = useState<Membre[]>([]);
  const invitation = decoderInvitation(code);
  const dejaRelie = invitation && foyerRelie() === invitation.foyerId;

  let contenu;
  if (!configFirebase) {
    contenu = (
      <p class="vide">
        La synchronisation n’est pas encore branchée sur cette version de Hometastic. Réessayez une fois
        qu’elle le sera.
      </p>
    );
  } else if (!invitation) {
    contenu = <p class="vide">Ce lien d’invitation est incomplet ou abîmé. Demandez un nouveau lien.</p>;
  } else if (dejaRelie) {
    contenu = <p class="vide">Ce téléphone est déjà relié à ce foyer.</p>;
  } else if (etat === 'choix') {
    contenu = (
      <>
        <p class="chapeau">C’est fait. Qui utilise ce téléphone ?</p>
        <div class="pilules" role="group" aria-label="Membre qui utilise ce téléphone">
          {qui.map((m) => (
            <button
              key={m.id}
              type="button"
              class="pilule"
              onClick={() => {
                choisirMembre(m.id);
                recharger();
              }}
            >
              <span class={`avatar ${m.couleur}`} aria-hidden="true">
                {m.nom.charAt(0).toUpperCase()}
              </span>
              {m.nom}
            </button>
          ))}
        </div>
      </>
    );
  } else {
    contenu = (
      <>
        <p class="chapeau">
          Ce téléphone va partager les courses, les tâches et tout le foyer avec celui qui vous a envoyé le
          lien, en temps réel.
        </p>
        {foyer.value ? (
          <p class="chiffre">
            <Icone nom="cadenas" />
            <span>
              Le foyer déjà présent sur ce téléphone ({foyer.value.nom}) ne sera plus affiché. Exportez-le
              d’abord depuis Nous si vous voulez le garder.
            </span>
          </p>
        ) : null}
        <div class="actions">
          <button
            type="button"
            class="bouton bouton-plein"
            disabled={etat === 'en-cours'}
            onClick={async () => {
              setEtat('en-cours');
              setErreur(undefined);
              try {
                const { rejoindre } = await import('../donnees/synchro/synchro');
                const m = await rejoindre(code, depot());
                if (m.length) {
                  setQui(m);
                  setEtat('choix');
                } else recharger();
              } catch (e) {
                setErreur(messageErreur(e));
                setEtat('attente');
              }
            }}
          >
            <Icone nom="nous" />
            {etat === 'en-cours' ? 'Connexion…' : 'Rejoindre le foyer'}
          </button>
        </div>
      </>
    );
  }

  return (
    <main class="accueil" id="contenu">
      <section class="vue" aria-labelledby="titre-rejoindre">
        <h1 id="titre-rejoindre" tabIndex={-1}>
          Rejoindre le foyer
        </h1>
        {contenu}
        {erreur ? (
          <p class="aide" role="alert">
            {erreur}
          </p>
        ) : null}
        <p class="aide">
          <a href="#/aujourdhui">Retour à Hometastic</a>
        </p>
      </section>
    </main>
  );
}
