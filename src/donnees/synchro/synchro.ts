/**
 * Synchronisation du foyer entre téléphones (Firebase Spark, ADR 0002) : activer sur le premier téléphone,
 * inviter l’autre par un lien, rejoindre, quitter. Firebase n’est chargé qu’à l’usage.
 */
import { signal } from '@preact/signals';
import type { Depot } from '../depot';
import type { Stockage } from '../stockage';
import { TABLES } from '../stockage';
import type { Membre } from '../../domaine/types';
import { configFirebase, foyerRelie, relierFoyer } from './config';
import { decoderInvitation, encoderInvitation, nouveauSecret } from './invitation';

export type EtatSynchro = 'indisponible' | 'locale' | 'connexion' | 'synchronisee' | 'hors-ligne' | 'erreur';

export const etatSynchro = signal<EtatSynchro>(configFirebase ? 'locale' : 'indisponible');
export const erreurSynchro = signal<string | undefined>(undefined);

const exigerConfig = () => {
  if (!configFirebase) throw new Error('Le projet Firebase n’est pas encore branché.');
  return configFirebase;
};

const connecter = async () => (await import('./firebase')).connecter(exigerConfig());

function suivreReseau() {
  const maj = () => (etatSynchro.value = navigator.onLine ? 'synchronisee' : 'hors-ligne');
  addEventListener('online', maj);
  addEventListener('offline', maj);
  maj();
}

/** Au démarrage : le stockage partagé si ce téléphone est relié à un foyer, sinon `undefined` (mode local). */
export async function ouvrirStockageSynchronise(local: Stockage): Promise<Stockage | undefined> {
  const foyerId = foyerRelie();
  if (!configFirebase || !foyerId) return undefined;
  etatSynchro.value = 'connexion';
  try {
    const { db } = await connecter();
    const { StockageFirestore } = await import('../stockage-firestore');
    suivreReseau();
    return new StockageFirestore(db, foyerId, local, (e) => {
      erreurSynchro.value = e instanceof Error ? e.message : String(e);
      etatSynchro.value = 'erreur';
    });
  } catch (e) {
    erreurSynchro.value = e instanceof Error ? e.message : String(e);
    etatSynchro.value = 'erreur';
    return undefined;
  }
}

/** Premier téléphone : crée le foyer partagé et y copie tout ce qui est sur ce téléphone (santé déjà chiffrée). */
export async function activerSynchro(depot: Depot): Promise<void> {
  const { db, uid } = await connecter();
  const { collection, doc, setDoc, writeBatch } = await import('firebase/firestore');
  const racine = doc(collection(db, 'foyers'));
  await setDoc(racine, {
    uids: [uid],
    invitation: nouveauSecret(),
    preuves: {},
    fuseau: Intl.DateTimeFormat().resolvedOptions().timeZone,
    creeLe: new Date().toISOString(),
  });
  const sauvegarde = await depot.exporter();
  let lot = writeBatch(db);
  let taille = 0;
  for (const table of TABLES) {
    if (table === 'cles') continue;
    for (const d of sauvegarde.tables[table] ?? []) {
      lot.set(doc(db, 'foyers', racine.id, table, d.id), d);
      if (++taille === 400) {
        await lot.commit();
        lot = writeBatch(db);
        taille = 0;
      }
    }
  }
  await lot.commit();
  relierFoyer(racine.id);
}

/** Lien à envoyer à l’autre membre du foyer (contient l’accès au foyer et la clé de santé). */
export async function lienInvitation(depot: Depot): Promise<string> {
  const foyerId = foyerRelie();
  if (!foyerId) throw new Error('Ce téléphone n’est pas relié à un foyer.');
  const { db } = await connecter();
  const { doc, getDoc } = await import('firebase/firestore');
  const secret = (await getDoc(doc(db, 'foyers', foyerId))).get('invitation') as string | undefined;
  if (!secret) throw new Error('Invitation introuvable.');
  const code = encoderInvitation({ foyerId, secret, cle: await depot.codeDeSecours() });
  return `${location.origin}${import.meta.env.BASE_URL}#/rejoindre/${code}`;
}

/** Rejoint un foyer par son lien : installe la clé de santé, puis renvoie les membres pour choisir qui on est. */
export async function rejoindre(texte: string, depot: Depot): Promise<Membre[]> {
  const invitation = decoderInvitation(texte);
  if (!invitation) throw new Error('Ce lien d’invitation n’est pas valide.');
  const { db, uid } = await connecter();
  const { arrayUnion, doc, getDoc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'foyers', invitation.foyerId), {
    uids: arrayUnion(uid),
    [`preuves.${uid}`]: invitation.secret,
  });
  await depot.utiliserCode(invitation.cle);
  relierFoyer(invitation.foyerId);
  const foyer = await getDoc(doc(db, 'foyers', invitation.foyerId, 'foyer', 'foyer'));
  return (foyer.get('membres') as Membre[] | undefined) ?? [];
}

/** Nombre de téléphones reliés au foyer (compte anonyme de chacun). */
export async function nombreDeTelephones(): Promise<number> {
  const foyerId = foyerRelie();
  if (!foyerId) return 1;
  const { db } = await connecter();
  const { doc, getDoc } = await import('firebase/firestore');
  const uids = (await getDoc(doc(db, 'foyers', foyerId))).get('uids') as unknown;
  return Array.isArray(uids) ? uids.length : 1;
}

/** Ce téléphone cesse de suivre le foyer ; les données partagées restent pour les autres. */
export function quitter(): void {
  relierFoyer(undefined);
}

export const estRelie = () => !!foyerRelie();
