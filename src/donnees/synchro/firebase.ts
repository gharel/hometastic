/**
 * Connexion à Firebase, chargée seulement quand la synchronisation est utilisée (import dynamique) :
 * le mode local reste léger. Compte anonyme par téléphone, cache Firestore hors ligne dans IndexedDB.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore';
import type { ConfigFirebase } from './config';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

export interface Connexion {
  app: FirebaseApp;
  db: Firestore;
  uid: string;
}

export async function connecter(config: ConfigFirebase): Promise<Connexion> {
  app ??= initializeApp(config);
  db ??= initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    ignoreUndefinedProperties: true,
  });
  const auth = getAuth(app);
  await auth.authStateReady();
  const utilisateur = auth.currentUser ?? (await signInAnonymously(auth)).user;
  return { app, db, uid: utilisateur.uid };
}
