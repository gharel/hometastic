import { signal } from '@preact/signals';
import { modeInstallation, type ModeInstallation } from '../domaine/installation';

/** Événement `beforeinstallprompt` (Chrome, Edge, Android) : pas encore dans les types du DOM. */
interface FenetreInstallation extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let fenetre: FenetreInstallation | undefined;

function lireMode(): ModeInstallation {
  if (typeof window === 'undefined') return 'menu';
  return modeInstallation({
    autonome:
      matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true,
    fenetreDisponible: fenetre !== undefined,
    agent: navigator.userAgent,
    plateforme: navigator.platform,
    pointsTactiles: navigator.maxTouchPoints,
  });
}

/** Comment proposer l’installation sur ce téléphone (spec 006). */
export const installation = signal<ModeInstallation>(lireMode());

/** À appeler au démarrage, avant que le navigateur n’envoie `beforeinstallprompt`. */
export function ecouterInstallation(): void {
  addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // le navigateur attend notre bouton au lieu de sa propre bannière
    fenetre = e as FenetreInstallation;
    installation.value = lireMode();
  });
  addEventListener('appinstalled', () => {
    fenetre = undefined;
    installation.value = 'installee';
  });
  matchMedia('(display-mode: standalone)').addEventListener('change', () => {
    installation.value = lireMode();
  });
}

/** Ouvre la fenêtre d’installation du navigateur ; faux quand il faut montrer la marche à suivre. */
export async function ouvrirFenetreInstallation(): Promise<boolean> {
  const f = fenetre;
  if (!f) return false;
  fenetre = undefined; // l’événement ne sert qu’une fois ; le navigateur en renverra un si besoin
  await f.prompt();
  const { outcome } = await f.userChoice;
  installation.value = outcome === 'accepted' ? 'installee' : lireMode();
  return true;
}

// ---------- « Plus tard » sur l’écran Aujourd’hui ----------
// Les clés locales gardent le préfixe d’origine « nid: » (spec 006, données conservées).
const CLE_PLUS_TARD = 'nid:installation-plus-tard';

function lirePlusTard(): boolean {
  try {
    return localStorage.getItem(CLE_PLUS_TARD) === 'oui';
  } catch {
    return false;
  }
}

export const installationPlusTard = signal(typeof localStorage === 'undefined' ? false : lirePlusTard());

export function remettreInstallationAPlusTard(): void {
  installationPlusTard.value = true;
  try {
    localStorage.setItem(CLE_PLUS_TARD, 'oui');
  } catch {
    // Stockage bloqué : la carte reste masquée pour cette session.
  }
}
