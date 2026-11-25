# ADR 0002 : synchronisation du foyer

- Statut : **accepté** : Firebase, formule Spark gratuite (décision de l’utilisateur le 26 novembre 2026 : « Ok tu peux partir sur firebase spark ») ; rappels par GitHub Actions (ADR 0005)
- Date : 2026-11-25

## Contexte

Contrairement à Fournée, Nid n’a de sens que partagé : deux téléphones (puis plus) doivent voir la même liste en moins de 2 secondes, continuer à fonctionner sans réseau au fond d’un magasin, fusionner les modifications au retour du réseau, et recevoir des rappels à l’heure même application fermée. Volume minuscule (quelques milliers de documents), deux à cinq utilisateurs.

## Options

| Critère                                           | Firebase (Firestore, Auth, Cloud Messaging, Functions)                                                                        | Dexie Cloud                                                          | Supabase                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------- |
| Hors ligne                                        | Cache IndexedDB intégré, écritures en file d’attente                                                                          | Natif : la base locale est la source, la synchronisation suit        | À construire soi-même                                         |
| Temps réel                                        | Oui                                                                                                                           | Oui                                                                  | Oui                                                           |
| Comptes et partage                                | Auth par lien e-mail ; partage par règles de sécurité                                                                         | Comptes et partage par « realms » intégrés                           | Auth + règles SQL (RLS)                                       |
| Push et rappels planifiés                         | Cloud Messaging + fonctions planifiées (formule Blaze à paiement à l’usage, gratuite à cette échelle, carte bancaire requise) | Non fournis : un petit service à part (Cloudflare Worker + Web Push) | Fonctions + `pg_cron`                                         |
| Coût à cette échelle                              | Gratuit                                                                                                                       | Gratuit jusqu’à 3 utilisateurs en production (limites à revérifier)  | Gratuit, mais projet mis en pause après 7 jours sans activité |
| Fichiers (photos, factures, ordonnances, billets) | Storage intégré (5 Go gratuits, règles d’accès par foyer)                                                                     | Pièces jointes à vérifier                                            | Storage intégré                                               |
| Santé chiffrée côté téléphone (ADR 0004)          | Compatible (le serveur stocke des blocs illisibles)                                                                           | Compatible                                                           | Compatible                                                    |
| Proximité avec Fournée                            | Faible                                                                                                                        | Forte (même Dexie)                                                   | Faible                                                        |
| Dépendance                                        | Google, modèle NoSQL propriétaire                                                                                             | Petit éditeur                                                        | Postgres standard                                             |

## Gratuité vérifiée (25 novembre 2026, pages officielles Firebase)

- **Formule Spark** (gratuite, sans moyen de paiement) : Firestore (1 Gio stockés, 50 000 lectures, 20 000 écritures et 20 000 suppressions par jour, 10 Gio sortants par mois), Authentication (la plupart des méthodes), Cloud Messaging, Hosting. Un quota mensuel dépassé coupe le produit jusqu’à la fin du mois, sans facture.
- **Pas sur Spark** : Cloud Storage (Blaze obligatoire depuis le 3 février 2026, même pour le bucket par défaut) et Cloud Functions (donc pas de fonctions planifiées).
- **Blaze** : mêmes quotas gratuits, mais un moyen de paiement est obligatoire et aucun plafond de dépense n’est garanti hors quelques produits.
- **Conséquence pour Nid, tout gratuit** : Spark pour les données, la connexion et les notifications ; une tâche **GitHub Actions programmée** (gratuite pour un dépôt public) envoie les rappels par Cloud Messaging ; les photos attendront (compressées dans Firestore, sous 1 Mo, ou un autre stockage gratuit).

## Décision (26 novembre 2026)

**Firebase, formule Spark**, sans carte bancaire :

- **Firestore** avec cache persistant (IndexedDB) : `foyers/{foyerId}` (membres `uids`, secret d’invitation, fuseau) et une sous-collection par table du dépôt (`foyers/{foyerId}/taches/{id}`…). `StockageFirestore` implémente l’interface `Stockage` : le domaine et les écrans ne changent pas. Écritures sans attendre le serveur (hors ligne compris) ; la dernière écriture d’un document gagne.
- **Authentication anonyme** : un compte par téléphone, sans e-mail ni mot de passe. Un téléphone devient membre en créant le foyer, ou avec le **lien d’invitation** `#/rejoindre/<foyer>.<secret>.<clé santé>` ; les règles (`firestore.rules`) n’acceptent l’ajout que si le secret présenté est celui du foyer.
- La **clé de santé** ne quitte jamais le téléphone (table `cles` locale) sauf dans le lien d’invitation, à n’envoyer qu’à l’autre membre ; le serveur ne voit que des blocs chiffrés (ADR 0004).
- **Cloud Messaging** pour les rappels, planifiés par GitHub Actions (ADR 0005).
- Configuration publique injectée au build par les variables du dépôt (`FIREBASE_CONFIG`, `FIREBASE_VAPID`) ; sans elles, l’app reste locale. Firebase n’est chargé qu’à l’usage.
- Région : **`australia-southeast1` (Sydney)**, la plus proche de Nouméa, choisie à la création du projet (`docs/FIREBASE.md`).
- Photos : plus tard (Cloud Storage exige Blaze).

## Recommandation initiale (25 novembre 2026)

**Firebase**, parce qu’il couvre d’un bloc les cinq besoins durs (hors ligne, temps réel, comptes, push planifié, fichiers ; ce dernier est apparu avec les fiches et projets de l’ADR 0003). **Dexie Cloud** reste l’alternative si l’essai montre une meilleure fusion hors ligne et si la limite de 3 utilisateurs convient. Supabase est écarté : hors ligne à construire et mise en pause des projets inactifs.

Dans les deux cas, le service est caché derrière une interface de dépôt (`src/donnees/`) : l’interface et le domaine n’en dépendent pas.

## Essai du lot 0 (critères)

1. Deux iPhone, l’app ajoutée à l’écran d’accueil **depuis Brave**.
2. Mode avion sur l’un, cinq modifications de chaque côté dont deux sur le même article : aucune perte, résultat prévisible.
3. Une modification en ligne apparaît sur l’autre téléphone en moins de 2 secondes.
4. Un rappel programmé à H arrive entre H et H + 1 minute, application fermée, sur les deux téléphones, trois jours de suite.
5. Une photo jointe sur un téléphone s’affiche sur l’autre, y compris après un passage hors ligne.
6. Un bloc chiffré (ADR 0004) aller-retour entre les deux téléphones, illisible dans la console du service.
7. Coût mensuel prévu nul.

Questions liées, à trancher au même moment : région de stockage (Paris ou Sydney, plus proche de Nouméa).
