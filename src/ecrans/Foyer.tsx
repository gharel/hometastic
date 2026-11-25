import { aujourdhui, fiches, ouvrir, projets, taches } from '../app/etat';
import { Icone, Illustration } from '../app/icones';
import { TYPES_PROJET, iconeFiche, pluriel } from '../app/libelles';
import { BlocTete, Vide } from '../composants/communs';
import { relatif } from '../domaine/dates';
import { avancement, compteARebours } from '../domaine/projets';
import { groupeDe, prochaineTacheDe } from '../domaine/taches';
import type { Fiche, Projet } from '../domaine/types';

const milliers = (n: number) => n.toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ');

function CarteFiche({ fiche }: { fiche: Fiche }) {
  const auj = aujourdhui.value;
  const prochaine = prochaineTacheDe(fiche, taches.value, auj);
  const urgente = prochaine && ['retard', 'aujourdhui'].includes(groupeDe(prochaine, auj, fiche.km?.valeur));
  return (
    <li>
      <a class="fiche" href={`#/fiche/${fiche.id}`}>
        <Illustration nom={iconeFiche(fiche)} />
        <strong>{fiche.nom}</strong>
        {prochaine ? (
          <span class={`sous${urgente ? ' alerte-texte' : ''}`}>
            {prochaine.sante ? 'Rappel santé' : prochaine.titre}
            {prochaine.echeance ? ` · ${relatif(prochaine.echeance, auj).toLowerCase()}` : ''}
          </span>
        ) : (
          <span class="sous">Rien de prévu</span>
        )}
        {fiche.type === 'vehicule' && fiche.km && <span class="sous">{milliers(fiche.km.valeur)} km</span>}
        {fiche.type === 'personne' && (
          <span class="fiche-cadenas">
            <Icone nom="cadenas" />
            Santé chiffrée
          </span>
        )}
      </a>
    </li>
  );
}

export function LigneProjet({ projet }: { projet: Projet }) {
  const { faites, total } = avancement(projet.id, taches.value);
  const rebours = compteARebours(projet, aujourdhui.value);
  return (
    <li>
      <a class="ligne" href={`#/projet/${projet.id}`}>
        <Illustration nom={TYPES_PROJET[projet.type].icone} />
        <span>
          <strong>{projet.nom}</strong>
          <span class="sous">
            {[
              TYPES_PROJET[projet.type].nom,
              total ? `${faites} sur ${pluriel(total, 'tâche', 'tâches')}` : '',
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
        </span>
        {rebours && <span class="droite">{rebours}</span>}
      </a>
    </li>
  );
}

export function Foyer() {
  const actifs = projets.value
    .filter((p) => !p.archive)
    .sort((a, b) => (a.debut ?? '9999').localeCompare(b.debut ?? '9999'));
  const archives = projets.value.filter((p) => p.archive);
  return (
    <section class="vue" aria-labelledby="titre-foyer">
      <h1 id="titre-foyer" tabIndex={-1}>
        Foyer
      </h1>
      <p class="chapeau">
        Tout ce que vous suivez dans le temps : la maison, les voitures, les enfants, les papiers, et vos
        projets.
      </p>

      <section class="bloc" aria-labelledby="t-fiches">
        <BlocTete titre="Fiches" id="t-fiches">
          <button type="button" class="lien-bouton" onClick={() => ouvrir({ type: 'fiche' })}>
            <Icone nom="plus" />
            Fiche
          </button>
        </BlocTete>
        {fiches.value.length ? (
          <ul class="fiches">
            {fiches.value.map((f) => (
              <CarteFiche key={f.id} fiche={f} />
            ))}
          </ul>
        ) : (
          <Vide>Aucune fiche. Créez celle de la maison, d’une voiture ou d’un enfant.</Vide>
        )}
      </section>

      <section class="bloc" aria-labelledby="t-projets">
        <BlocTete titre="Projets" id="t-projets">
          <button type="button" class="lien-bouton" onClick={() => ouvrir({ type: 'projet' })}>
            <Icone nom="plus" />
            Projet
          </button>
        </BlocTete>
        {actifs.length ? (
          <ul class="lignes">
            {actifs.map((p) => (
              <LigneProjet key={p.id} projet={p} />
            ))}
          </ul>
        ) : (
          <Vide>Aucun projet en cours. Un voyage, des travaux, l’arrivée d’un bébé ?</Vide>
        )}
        {archives.length > 0 && (
          <details class="repli">
            <summary>Projets terminés ({archives.length})</summary>
            <ul class="lignes">
              {archives.map((p) => (
                <LigneProjet key={p.id} projet={p} />
              ))}
            </ul>
          </details>
        )}
      </section>
    </section>
  );
}
