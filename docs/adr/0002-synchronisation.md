# ADR 0002 : synchronisation du foyer

- Statut : **proposé** : Firebase recommandé, confirmé ou non par l’essai du lot 0 (plan validé le 25 novembre 2026)
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

## Recommandation provisoire

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
