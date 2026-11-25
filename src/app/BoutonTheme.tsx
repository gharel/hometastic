import { useEffect, useState } from 'preact/hooks';
import { Icone } from './icones';
import {
  CLE_THEME,
  ICONES_THEME,
  NOMS_THEME,
  appliquerTheme,
  enregistrerTheme,
  etatDuTheme,
  lireTheme,
  themeSuivant,
  type Theme,
} from './theme';

export function BoutonTheme() {
  const [theme, setTheme] = useState<Theme>(() => lireTheme());

  useEffect(() => appliquerTheme(theme), [theme]);

  // Un choix fait dans un autre onglet ou un autre outil, ou un retour arrière depuis le cache.
  useEffect(() => {
    const relire = () => setTheme(lireTheme());
    const surStockage = (e: StorageEvent) => {
      if (e.key === CLE_THEME || e.key === null) relire();
    };
    const surRetour = (e: PageTransitionEvent) => {
      if (e.persisted) relire();
    };
    addEventListener('storage', surStockage);
    addEventListener('pageshow', surRetour);
    return () => {
      removeEventListener('storage', surStockage);
      removeEventListener('pageshow', surRetour);
    };
  }, []);

  const etat = etatDuTheme(theme);
  return (
    <button
      id="bouton-theme"
      type="button"
      class="bouton bouton-secondaire bouton-icone"
      aria-label={NOMS_THEME[etat]}
      title={NOMS_THEME[etat]}
      onClick={() => {
        const suivant = themeSuivant(theme);
        enregistrerTheme(suivant);
        setTheme(suivant);
      }}
    >
      <Icone nom={ICONES_THEME[etat]} />
    </button>
  );
}
