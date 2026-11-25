import { useState } from 'preact/hooks';
import { annoncer, choisirMembre, depot, foyer, membreCourant, membres, ouvrir } from '../app/etat';
import { Icone, Illustration } from '../app/icones';
import { BlocTete } from '../composants/communs';
import { estRelie, quitter } from '../donnees/synchro/synchro';
import { BlocSynchro } from './Synchro';

async function exporter() {
  const sauvegarde = await depot().exporter();
  const fichier = new Blob([JSON.stringify(sauvegarde, null, 2)], { type: 'application/json' });
  const lien = document.createElement('a');
  lien.href = URL.createObjectURL(fichier);
  lien.download = `nid-${sauvegarde.exporteLe.slice(0, 10)}.json`;
  lien.click();
  setTimeout(() => URL.revokeObjectURL(lien.href), 1000);
  annoncer('Sauvegarde téléchargée (la santé y reste chiffrée)');
}

async function importer(fichier: File | undefined) {
  if (!fichier) return;
  if (!window.confirm('Remplacer toutes les données de ce téléphone par cette sauvegarde ?')) return;
  try {
    await depot().importer(JSON.parse(await fichier.text()));
    annoncer('Sauvegarde restaurée');
  } catch (e) {
    annoncer(e instanceof Error ? e.message : 'Fichier illisible');
  }
}

export function Nous() {
  const [code, setCode] = useState<string | undefined>();
  const [codeSaisi, setCodeSaisi] = useState('');
  const f = foyer.value;
  return (
    <section class="vue" aria-labelledby="titre-nous">
      <h1 id="titre-nous" tabIndex={-1}>
        Nous
      </h1>
      <p class="chapeau">{f?.nom}</p>

      <section class="bloc" aria-labelledby="t-analyse-lien">
        <BlocTete titre="Analyse" id="t-analyse-lien" />
        <a class="ligne carte lien-analyse" href="#/analyse">
          <Illustration nom="balance-scale" />
          <span>
            <strong>Qui fait quoi, charge mentale, équilibre</strong>
            <span class="sous">
              Temps passé ce mois-ci par domaine, historique et pistes pour rééquilibrer
            </span>
          </span>
          <Icone nom="chevronDroite" />
        </a>
      </section>

      <section class="bloc" aria-labelledby="t-membres">
        <BlocTete titre="Ce téléphone est celui de" id="t-membres">
          <button type="button" class="lien-bouton" onClick={() => ouvrir({ type: 'foyer' })}>
            <Icone nom="crayon" />
            Foyer
          </button>
        </BlocTete>
        <div class="pilules" role="group" aria-label="Membre qui utilise ce téléphone">
          {membres.value.map((m) => (
            <button
              key={m.id}
              type="button"
              class="pilule"
              aria-pressed={(membreCourant.value ?? membres.value[0]?.id) === m.id ? 'true' : 'false'}
              onClick={() => {
                choisirMembre(m.id);
                annoncer(`Ce téléphone est celui de ${m.nom}`);
              }}
            >
              <span class={`avatar ${m.couleur}`} aria-hidden="true">
                {m.nom.charAt(0).toUpperCase()}
              </span>
              {m.nom}
            </button>
          ))}
        </div>
      </section>

      <BlocSynchro />

      <section class="bloc" aria-labelledby="t-cle">
        <BlocTete titre="Santé chiffrée" id="t-cle" />
        <p class="chiffre">
          <Icone nom="cadenas" />
          <span>
            Les informations de santé sont chiffrées sur ce téléphone avec la clé du foyer. Sans elle,
            personne ne peut les lire, pas même le serveur. Gardez le code de secours à l’abri (gestionnaire
            de mots de passe).
          </span>
        </p>
        {code ? (
          <p class="code-secours" aria-label="Code de secours">
            {code}
          </p>
        ) : null}
        <div class="actions">
          <button
            type="button"
            class="bouton"
            onClick={async () => setCode(code ? undefined : await depot().codeDeSecours())}
          >
            <Icone nom="cle" />
            {code ? 'Masquer le code de secours' : 'Afficher le code de secours'}
          </button>
        </div>
        <form
          class="saisie-article"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await depot().utiliserCode(codeSaisi);
              setCodeSaisi('');
              annoncer('Clé du foyer installée sur ce téléphone');
            } catch {
              annoncer('Code de secours invalide');
            }
          }}
        >
          <label class="vh" for="code-saisi">
            Code de secours du foyer
          </label>
          <input
            id="code-saisi"
            class="champ"
            autoComplete="off"
            placeholder="Coller le code de l’autre téléphone"
            value={codeSaisi}
            onInput={(e) => setCodeSaisi(e.currentTarget.value)}
          />
          <button type="submit" class="bouton bouton-plein" disabled={!codeSaisi.trim()}>
            Utiliser
          </button>
        </form>
      </section>

      <section class="bloc" aria-labelledby="t-sauvegarde">
        <BlocTete titre="Sauvegarde" id="t-sauvegarde" />
        <div class="actions" style={{ marginTop: 0 }}>
          <button type="button" class="bouton" onClick={() => void exporter()}>
            <Icone nom="telecharger" />
            Exporter
          </button>
          <label class="bouton">
            <Icone nom="televerser" />
            Importer
            <input
              type="file"
              accept="application/json,.json"
              class="vh"
              onChange={(e) => void importer(e.currentTarget.files?.[0])}
            />
          </label>
        </div>
        <p class="aide">Un fichier JSON avec tout le foyer ; la santé y reste chiffrée.</p>
      </section>

      <section class="bloc" aria-labelledby="t-danger">
        <BlocTete titre="Effacer" id="t-danger" />
        <button
          type="button"
          class="bouton bouton-danger"
          onClick={async () => {
            if (
              window.confirm(
                'Effacer toutes les données de Nid sur ce téléphone ? Exportez d’abord une sauvegarde si besoin.',
              )
            ) {
              await depot().toutEffacer();
              if (estRelie()) {
                // Le foyer partagé reste pour l’autre téléphone ; celui-ci repart de zéro.
                quitter();
                history.replaceState(null, '', '#/aujourdhui');
                location.reload();
                return;
              }
              location.hash = '#/aujourdhui';
            }
          }}
        >
          <Icone nom="corbeille" />
          Effacer toutes les données
        </button>
      </section>
    </section>
  );
}
