/**
 * Comment proposer l’ajout de l’app à l’écran d’accueil (spec 006). Fonction pure : l’interface
 * lui passe ce qu’elle sait du navigateur.
 *
 * - `installee` : l’app est ouverte depuis l’écran d’accueil, rien à proposer ;
 * - `fenetre` : le navigateur sait ouvrir sa fenêtre d’installation (Android, Chrome, Edge) ;
 * - `ios` : iPhone ou iPad, l’ajout passe par Partager (aucune page ne peut le déclencher) ;
 * - `menu` : les autres (Firefox…), par le menu du navigateur.
 */
export type ModeInstallation = 'installee' | 'fenetre' | 'ios' | 'menu';

export interface Navigateur {
  /** Ouverte depuis l’écran d’accueil (`display-mode: standalone`, ou `navigator.standalone` sur iPhone). */
  autonome: boolean;
  /** Événement `beforeinstallprompt` reçu et gardé de côté. */
  fenetreDisponible: boolean;
  agent: string;
  plateforme?: string | undefined;
  pointsTactiles?: number | undefined;
}

/** iPhone, iPod, ou iPad (qui se présente comme un Mac, mais tactile). */
export function estIOS(n: Pick<Navigateur, 'agent' | 'plateforme' | 'pointsTactiles'>): boolean {
  return /iphone|ipad|ipod/i.test(n.agent) || (n.plateforme === 'MacIntel' && (n.pointsTactiles ?? 0) > 1);
}

export function modeInstallation(n: Navigateur): ModeInstallation {
  if (n.autonome) return 'installee';
  if (n.fenetreDisponible) return 'fenetre';
  return estIOS(n) ? 'ios' : 'menu';
}
