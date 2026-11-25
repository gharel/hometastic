/** Configuration du projet Firebase (formule Spark, ADR 0002), injectée au build ; absente = mode local seul. */
export interface ConfigFirebase {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  messagingSenderId?: string;
  storageBucket?: string;
}

function lireConfig(brut: string | undefined): ConfigFirebase | undefined {
  if (!brut) return undefined;
  try {
    const c = JSON.parse(brut) as Partial<ConfigFirebase>;
    return c.apiKey && c.projectId && c.appId && c.authDomain ? (c as ConfigFirebase) : undefined;
  } catch {
    return undefined;
  }
}

export const configFirebase = lireConfig(import.meta.env.VITE_FIREBASE_CONFIG);
export const cleVapid = import.meta.env.VITE_FIREBASE_VAPID || undefined;

const CLE_SYNCHRO = 'nid:synchro';

/** Foyer partagé auquel ce téléphone est relié, s’il l’est. */
export function foyerRelie(): string | undefined {
  try {
    const v = JSON.parse(localStorage.getItem(CLE_SYNCHRO) ?? 'null') as { foyerId?: unknown } | null;
    return typeof v?.foyerId === 'string' ? v.foyerId : undefined;
  } catch {
    return undefined;
  }
}

export function relierFoyer(foyerId: string | undefined): void {
  try {
    if (foyerId) localStorage.setItem(CLE_SYNCHRO, JSON.stringify({ foyerId }));
    else localStorage.removeItem(CLE_SYNCHRO);
  } catch {
    // Stockage bloqué : la synchronisation ne pourra pas être retenue sur ce téléphone.
  }
}
