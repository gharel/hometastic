/**
 * Envoi des rappels de Hometastic (ADR 0005), lancé toutes les 15 minutes par .github/workflows/rappels.yml.
 * Pour chaque foyer : tâches non faites arrivées à échéance (fuseau du foyer), notification aux
 * téléphones concernés par Firebase Cloud Messaging, rappel noté pour ne partir qu’une fois.
 *
 * Le dépôt est public, ses journaux d’Actions aussi : n’écrire que des nombres, jamais un titre,
 * un nom ni un identifiant de foyer.
 *
 * Usage : FIREBASE_SERVICE_ACCOUNT='<json du compte de service>' node outils/rappels.mjs
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { rappelsDus } from '../src/domaine/rappels.ts';

const brut = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!brut) {
  console.error('FIREBASE_SERVICE_ACCOUNT manquant (secret du dépôt).');
  process.exit(1);
}
initializeApp({ credential: cert(JSON.parse(brut)) });
const db = getFirestore();
const messagerie = getMessaging();

const JOUR = 86_400_000;
const JETONS_PERIMES = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
  'messaging/invalid-argument',
]);

const maintenant = Date.now();
const date = (decalage) => new Date(maintenant + decalage * JOUR).toISOString().slice(0, 10);
let envoyes = 0;
let notifications = 0;
let echecs = 0;

for (const foyer of (await db.collection('foyers').get()).docs) {
  const fuseau = foyer.get('fuseau') || 'Pacific/Noumea';
  // Échéances d’avant-hier à demain (dates UTC) : couvre tous les fuseaux et 24 h de retard.
  const taches = await foyer.ref
    .collection('taches')
    .where('echeance', '>=', date(-2))
    .where('echeance', '<=', date(1))
    .get();
  const candidats = rappelsDus(
    taches.docs.map((d) => ({ ...d.data(), id: d.id })),
    maintenant,
    fuseau,
    new Set(),
  );
  if (!candidats.length) continue;

  const notes = foyer.ref.collection('rappelsEnvoyes');
  const deja = await db.getAll(...candidats.map((r) => notes.doc(r.cle)));
  const aEnvoyer = candidats.filter((_, i) => !deja[i]?.exists);
  if (!aEnvoyer.length) continue;

  const appareils = (await foyer.ref.collection('appareils').get()).docs.filter((a) => a.get('jeton'));
  for (const rappel of aEnvoyer) {
    const vises =
      rappel.pour === 'tous' ? appareils : appareils.filter((a) => rappel.pour.includes(a.get('membreId')));
    // Personne n’a activé les rappels pour ce membre : on prévient tout le foyer.
    const cibles = vises.length ? vises : appareils;
    if (cibles.length) {
      const reponse = await messagerie.sendEachForMulticast({
        tokens: cibles.map((a) => a.get('jeton')),
        data: { titre: rappel.titre, corps: rappel.corps, lien: './#/a-faire', tag: rappel.cle },
        webpush: { headers: { Urgency: 'high', TTL: String(12 * 3600) } },
      });
      notifications += reponse.successCount;
      echecs += reponse.failureCount;
      await Promise.all(
        reponse.responses.map((r, i) =>
          !r.success && JETONS_PERIMES.has(r.error?.code ?? '') ? cibles[i]?.ref.delete() : undefined,
        ),
      );
    }
    await notes.doc(rappel.cle).set({ le: new Date(maintenant).toISOString(), telephones: cibles.length });
    envoyes++;
  }
}

console.log(
  `Rappels : ${envoyes} à l’heure, ${notifications} notification(s) remise(s), ${echecs} échec(s).`,
);
