/** Thème commun aux outils de gharel.github.io (règle « Thème commun aux outils », AGENTS.md). */
export const CLE_THEME = 'skazy-outils:theme';

/** Choix explicite ; `null` = thème du système. */
export type Theme = 'light' | 'dark' | null;
type Etat = 'systeme' | 'light' | 'dark';

export const NOMS_THEME: Readonly<Record<Etat, string>> = {
  systeme: 'Thème\u00a0: celui du système. Changer de thème',
  light: 'Thème\u00a0: clair. Changer de thème',
  dark: 'Thème\u00a0: sombre. Changer de thème',
};

export const ICONES_THEME = { systeme: 'systeme', light: 'soleil', dark: 'lune' } as const;

export const etatDuTheme = (theme: Theme): Etat => theme ?? 'systeme';

function stockageNavigateur(): Pick<Storage, 'getItem'> | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function lireTheme(stockage: Pick<Storage, 'getItem'> | undefined = stockageNavigateur()): Theme {
  try {
    const valeur: unknown = JSON.parse(stockage?.getItem(CLE_THEME) ?? 'null');
    return valeur === 'light' || valeur === 'dark' ? valeur : null;
  } catch {
    return null;
  }
}

/** Système, puis clair, puis sombre, puis de nouveau système. */
export function themeSuivant(theme: Theme): Theme {
  if (theme === null) return 'light';
  return theme === 'light' ? 'dark' : null;
}

export function enregistrerTheme(theme: Theme): void {
  try {
    if (theme) localStorage.setItem(CLE_THEME, JSON.stringify(theme));
    else localStorage.removeItem(CLE_THEME);
  } catch {
    // Stockage bloqué (navigation privée stricte) : le choix vaut pour cette page seulement.
  }
}

let couleursInitiales: string[] | undefined;

/** Pose `data-theme` et accorde la couleur de la barre du navigateur (`theme-color`). */
export function appliquerTheme(theme: Theme): void {
  const racine = document.documentElement;
  if (theme) racine.dataset.theme = theme;
  else delete racine.dataset.theme;
  const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
  couleursInitiales ??= metas.map((m) => m.content);
  const fond = getComputedStyle(racine).getPropertyValue('--fond').trim();
  metas.forEach((meta, i) => {
    meta.content = theme ? fond : (couleursInitiales?.[i] ?? meta.content);
  });
}
