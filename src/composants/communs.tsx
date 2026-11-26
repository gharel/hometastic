import type { ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { basculerTache } from '../app/actions';
import { aujourdhui, devise, fermer, kmParFiche, membres, nomRattachement, ouvrir } from '../app/etat';
import { Icone } from '../app/icones';
import { relatif } from '../domaine/dates';
import { formatMontant } from '../domaine/montants';
import { decrireRecurrence } from '../domaine/recurrence';
import { kmRestants } from '../domaine/taches';
import type { Assignation, Tache } from '../domaine/types';

const INSECABLE = '\u00a0';
const milliers = (n: number) => n.toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ');

export function Avatar({ pour, classe = '' }: { pour: Assignation | undefined; classe?: string }) {
  if (pour === 'nous') {
    // Au-delà de deux, les initiales ne tiendraient plus : « Tous ».
    const ms = membres.value;
    const initiales = ms.length > 2 ? 'Tous' : ms.map((m) => m.nom.charAt(0).toUpperCase()).join('+') || '2';
    return (
      <span class={`avatar nous ${classe}`}>
        <span aria-hidden="true">{initiales}</span>
        <span class="vh">{ms.length > 2 ? 'Pour tout le monde' : 'Pour vous deux'}</span>
      </span>
    );
  }
  if (pour === 'libre')
    return (
      <span class={`avatar libre ${classe}`}>
        <span aria-hidden="true">?</span>
        <span class="vh">Au premier libre</span>
      </span>
    );
  const m = membres.value.find((x) => x.id === pour);
  if (!m) return null;
  return (
    <span class={`avatar ${m.couleur} ${classe}`}>
      <span aria-hidden="true">{m.nom.charAt(0).toUpperCase()}</span>
      <span class="vh">Pour {m.nom}</span>
    </span>
  );
}

/** Feuille modale (en bas sur téléphone, au centre sur ordinateur). Échap ou « Fermer » la referment. */
export function Feuille({ titre, children }: { titre: string; children: ComponentChildren }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog ref={ref} class="feuille" aria-labelledby="titre-feuille" onClose={fermer}>
      <div class="feuille-tete">
        <h2 id="titre-feuille">{titre}</h2>
        <button
          type="button"
          class="bouton bouton-icone"
          aria-label="Fermer"
          onClick={() => ref.current?.close()}
        >
          <Icone nom="croix" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function BlocTete({
  titre,
  id,
  children,
}: {
  titre: string;
  id: string;
  children?: ComponentChildren;
}) {
  return (
    <div class="bloc-tete">
      <h2 id={id}>{titre}</h2>
      {children}
    </div>
  );
}

export function Vide({ children }: { children: ComponentChildren }) {
  return <p class="vide">{children}</p>;
}

export function Retour({ href, libelle }: { href: string; libelle: string }) {
  return (
    <a class="retour" href={href}>
      <Icone nom="chevronGauche" />
      {libelle}
    </a>
  );
}

/** Une tâche dans une liste : case à cocher, titre et détails (ouvre la modification), avatar. */
export function LigneTache({ tache, avecRattachement = true }: { tache: Tache; avecRattachement?: boolean }) {
  const auj = aujourdhui.value;
  const details: ComponentChildren[] = [];
  if (tache.echeance) {
    const texte = relatif(tache.echeance, auj);
    details.push(
      <span class={tache.echeance < auj && !tache.faite ? 'retard' : undefined}>
        {texte}
        {tache.heure ? ` à ${tache.heure.replace(':', ' h ')}` : ''}
      </span>,
    );
  }
  const km = tache.ficheId ? kmRestants(tache, kmParFiche.value[tache.ficheId]) : undefined;
  if (km !== undefined)
    details.push(
      <span class={km <= 0 ? 'retard' : undefined}>
        {km <= 0 ? `Dépassé de ${milliers(-km)} km` : `Dans ${milliers(km)} km`}
      </span>,
    );
  else if (tache.echeanceKm !== undefined) details.push(<span>À {milliers(tache.echeanceKm)} km</span>);
  if (tache.recurrence)
    details.push(
      <span>
        <Icone nom="repeter" />
        {decrireRecurrence(tache.recurrence)}
      </span>,
    );
  if (tache.montant !== undefined) details.push(<span>{formatMontant(tache.montant, devise.value)}</span>);
  const rattache = avecRattachement ? nomRattachement(tache) : undefined;
  if (rattache) details.push(<span>{rattache}</span>);
  if (tache.sante)
    details.push(
      <span>
        <Icone nom="cadenas" />
        Santé chiffrée
      </span>,
    );
  if (tache.faite)
    details.push(<span>Fait le {tache.faite.le.split('-').reverse().slice(0, 2).join('/')}</span>);

  return (
    <li class={`tache${tache.faite ? ' faite' : ''}`}>
      <button
        class="case"
        type="button"
        aria-pressed={tache.faite ? 'true' : 'false'}
        aria-label={`${tache.faite ? 'Rouvrir' : 'Terminer'}${INSECABLE}: ${tache.titre}`}
        onClick={() => void basculerTache(tache, auj)}
      >
        <Icone nom="valider" />
      </button>
      <button class="tache-corps" type="button" onClick={() => ouvrir({ type: 'tache', tache })}>
        <span class="tache-titre">{tache.titre}</span>
        {details.length > 0 && <span class="tache-meta">{details}</span>}
      </button>
      <span class="tache-fin">
        <Avatar pour={tache.assignation} />
        <BoutonModifier nom={tache.titre} onClick={() => ouvrir({ type: 'tache', tache })} />
      </span>
    </li>
  );
}

/** Crayon visible au bout d’une ligne : « Modifier : <nom> » pour les lecteurs d’écran. */
export function BoutonModifier({ nom, onClick }: { nom: string; onClick: () => void }) {
  return (
    <button
      type="button"
      class="bouton-modifier"
      aria-label={`Modifier${INSECABLE}: ${nom}`}
      onClick={onClick}
    >
      <Icone nom="crayon" />
    </button>
  );
}

export function ListeTaches({
  taches,
  avecRattachement = true,
}: {
  taches: Tache[];
  avecRattachement?: boolean;
}) {
  return (
    <ul class="taches">
      {taches.map((t) => (
        <LigneTache key={t.id} tache={t} avecRattachement={avecRattachement} />
      ))}
    </ul>
  );
}
