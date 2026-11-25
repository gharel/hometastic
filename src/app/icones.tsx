import type { JSX } from 'preact';
import fluent from '../icones/fluent.json';
import { iconeDe, initiales, type Habillage } from '../domaine/catalogue';
import { ICONES_NID } from '../icones/nid';

/** Icônes d’interface : dessins Lucide (licence ISC), toujours décoratives. */
const TRACES = {
  aujourdhui: (
    <path d="M12 2v3M4.2 6.2l1.4 1.4M19.8 6.2l-1.4 1.4M2 14h2M20 14h2M7 14a5 5 0 0 1 10 0M2 18h20M6 22h12" />
  ),
  panier: (
    <path d="m15 11-1 9M19 11l-4-7M2 11h20M3.5 11l1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4M4.5 15.5h15M5 11l4-7M9 11l1 9" />
  ),
  taches: <path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8" />,
  maison: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  nous: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  soleil: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
    </>
  ),
  lune: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />,
  film: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 3v18M17 3v18M3 12h18M3 7.5h4M3 16.5h4M17 7.5h4M17 16.5h4" />
    </>
  ),
  systeme: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor" />
    </>
  ),
  valider: <path d="M20 6 9 17l-5-5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  croix: <path d="M18 6 6 18M6 6l12 12" />,
  horloge: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  repeter: <path d="m17 2 4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3" />,
  telephone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  cadenas: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  chevronGauche: <path d="m15 18-6-6 6-6" />,
  chevronDroite: <path d="m9 18 6-6-6-6" />,
  crayon: <path d="M21.2 6.8a2.8 2.8 0 0 0-4-4L3.8 16.2 3 21l4.8-.8z M15 5l4 4" />,
  corbeille: <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />,
  telecharger: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
  televerser: <path d="M12 21V9M7 14l5-5 5 5M5 3h14" />,
  cle: (
    <>
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="m10.7 12.3 9.8-9.8M17 6l3 3M14 9l2 2" />
    </>
  ),
  dossier: (
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
  ),
  compteur: (
    <>
      <path d="M12 14l4-4" />
      <path d="M3.3 19a10 10 0 1 1 17.4 0z" />
    </>
  ),
  calendrier: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  partager: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </>
  ),
  grille: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  cloche: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0" />,
  nuage: <path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9z" />,
} satisfies Record<string, JSX.Element>;

export type NomIcone = keyof typeof TRACES;

export function Icone({ nom, classe }: { nom: NomIcone; classe?: string }) {
  return (
    <svg class={classe} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {TRACES[nom]}
    </svg>
  );
}

/** Illustrations Fluent Emoji Flat (Microsoft, MIT) et celles dessinées pour Nid, toutes en 32 × 32. */
const ILLUSTRATIONS: Record<string, string> = { ...(fluent.icones as Record<string, string>), ...ICONES_NID };

export const illustrationExiste = (nom: string | null | undefined): nom is string =>
  !!nom && nom in ILLUSTRATIONS;

/** Ajoute une fois au document le sprite des illustrations. */
export function installerSprite(): void {
  if (document.getElementById('sprite-fluent')) return;
  const taille = fluent.taille;
  const symboles = Object.entries(ILLUSTRATIONS)
    .map(([nom, corps]) => `<symbol id="f-${nom}" viewBox="0 0 ${taille} ${taille}">${corps}</symbol>`)
    .join('');
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<svg id="sprite-fluent" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">${symboles}</svg>`,
  );
}

/** Illustration Fluent par son nom (fiches, projets, écrans vides). */
export function Illustration({ nom, classe = 'ico' }: { nom: string; classe?: string }) {
  return (
    <svg class={classe} aria-hidden="true" focusable="false">
      <use href={`#f-${nom}`} />
    </svg>
  );
}

/** Icône d’un article : celle choisie, sinon celle du produit, sinon une pastille à initiales. */
export function IconeArticle({ article }: { article: Habillage & { nom: string } }) {
  const icone = iconeDe(article);
  if (illustrationExiste(icone)) return <Illustration nom={icone} />;
  return (
    <span class="monogramme" aria-hidden="true">
      {initiales(article.nom)}
    </span>
  );
}
