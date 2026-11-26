/**
 * Rappels par notification (Firebase Cloud Messaging, gratuit) : ce téléphone enregistre son jeton dans
 * foyers/{foyerId}/appareils ; une tâche GitHub Actions programmée envoie les rappels (ADR 0005).
 * Sur iPhone, il faut d’abord ajouter Hometastic à l’écran d’accueil et l’ouvrir depuis l’icône.
 */
import { cleVapid, configFirebase, foyerRelie } from './config';

const CLE_APPAREIL = 'nid:appareil';

function idAppareil(): string {
  try {
    let id = localStorage.getItem(CLE_APPAREIL);
    if (!id) localStorage.setItem(CLE_APPAREIL, (id = crypto.randomUUID()));
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export const rappelsPossibles = () => !!(configFirebase && cleVapid && foyerRelie());

export async function activerRappels(membreId: string | undefined): Promise<void> {
  const foyerId = foyerRelie();
  if (!configFirebase || !cleVapid || !foyerId) throw new Error('Synchronisation à activer d’abord.');
  const { getMessaging, getToken, isSupported } = await import('firebase/messaging');
  if (!(await isSupported()) || !('Notification' in window))
    throw new Error(
      'Notifications indisponibles ici. Sur iPhone : Partager, « Sur l’écran d’accueil », puis ouvrir Hometastic depuis l’icône.',
    );
  if ((await Notification.requestPermission()) !== 'granted')
    throw new Error('Notifications refusées dans les réglages.');
  const { connecter } = await import('./firebase');
  const { app, db } = await connecter(configFirebase);
  const enregistrement = await navigator.serviceWorker.ready;
  const jeton = await getToken(getMessaging(app), {
    vapidKey: cleVapid,
    serviceWorkerRegistration: enregistrement,
  });
  const { doc, setDoc } = await import('firebase/firestore');
  const id = idAppareil();
  await setDoc(doc(db, 'foyers', foyerId, 'appareils', id), {
    id,
    jeton,
    membreId: membreId ?? null,
    majLe: new Date().toISOString(),
  });
}
