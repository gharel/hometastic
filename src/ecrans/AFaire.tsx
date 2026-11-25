import { useState } from 'preact/hooks';
import { aujourdhui, autre, kmParFiche, moi, ouvrir, taches } from '../app/etat';
import { BlocTete, ListeTaches, Vide } from '../composants/communs';
import { ORDRE_GROUPES, TITRES_GROUPES, filtrer, regrouper, type Filtre } from '../domaine/taches';

export function AFaire() {
  const [filtre, setFiltre] = useState<Filtre>('tout');
  const visibles = filtrer(taches.value, filtre);
  const groupes = regrouper(visibles, aujourdhui.value, kmParFiche.value);
  const aFaire = ORDRE_GROUPES.reduce((n, g) => n + groupes[g].length, 0);
  const faites = visibles
    .filter((t) => t.faite)
    .sort((a, b) => (b.faite?.le ?? '').localeCompare(a.faite?.le ?? ''))
    .slice(0, 20);
  const filtres: (readonly [Filtre, string])[] = [['tout', 'Tout']];
  if (moi.value) filtres.push([moi.value.id, moi.value.nom]);
  if (autre.value) filtres.push([autre.value.id, autre.value.nom]);
  filtres.push(['nous', 'Nous deux'], ['libre', 'Au premier libre']);

  return (
    <section class="vue" aria-labelledby="titre-a-faire">
      <h1 id="titre-a-faire" tabIndex={-1}>
        À faire <span class="compte-titre">{aFaire}</span>
      </h1>
      <div class="pilules" role="group" aria-label="Filtrer les tâches">
        {filtres.map(([v, libelle]) => (
          <button
            key={v}
            type="button"
            class="pilule"
            aria-pressed={filtre === v ? 'true' : 'false'}
            onClick={() => setFiltre(v)}
          >
            {libelle}
          </button>
        ))}
      </div>
      {aFaire === 0 && (
        <div class="bloc">
          <Vide>
            Rien à faire{filtre === 'tout' ? '' : ' pour ce filtre'}.{' '}
            <button type="button" class="lien-bouton" onClick={() => ouvrir({ type: 'tache' })}>
              Ajouter une tâche
            </button>
          </Vide>
        </div>
      )}
      {ORDRE_GROUPES.map((g) =>
        groupes[g].length ? (
          <section key={g} class="bloc" aria-labelledby={`g-${g}`}>
            <BlocTete titre={TITRES_GROUPES[g]} id={`g-${g}`}>
              <span class="mono">{groupes[g].length}</span>
            </BlocTete>
            <ListeTaches taches={groupes[g]} />
          </section>
        ) : null,
      )}
      {faites.length > 0 && (
        <details class="bloc repli">
          <summary>Faites récemment ({faites.length})</summary>
          <ListeTaches taches={faites} />
        </details>
      )}
    </section>
  );
}
