/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Configuration web du projet Firebase (JSON, valeurs publiques), fournie au build par une variable GitHub. */
  readonly VITE_FIREBASE_CONFIG?: string;
  /** Clé publique Web Push (VAPID) du projet Firebase. */
  readonly VITE_FIREBASE_VAPID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
