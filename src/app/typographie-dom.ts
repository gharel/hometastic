import { typographier } from '../domaine/typographie';

const IGNORES = 'script, style, textarea, code, pre';

function corrigerTexte(noeud: Text): void {
  const parent = noeud.parentElement;
  if (!parent || parent.closest(IGNORES)) return;
  const corrige = typographier(noeud.data);
  if (corrige !== noeud.data) noeud.data = corrige;
}

function corrigerArbre(racine: Node): void {
  if (racine instanceof Text) {
    corrigerTexte(racine);
    return;
  }
  const parcours = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT);
  for (let n = parcours.nextNode(); n; n = parcours.nextNode()) corrigerTexte(n as Text);
}

/** Applique la typographie au texte affiché, puis à chaque texte ajouté ou modifié par Preact. */
export function demarrerTypographie(racine: HTMLElement): void {
  corrigerArbre(racine);
  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'characterData' && m.target instanceof Text) corrigerTexte(m.target);
      else m.addedNodes.forEach(corrigerArbre);
    }
  }).observe(racine, { childList: true, subtree: true, characterData: true });
}
