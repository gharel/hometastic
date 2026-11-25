# 004 : synchronisation entre les téléphones et rappels

## Contexte

Exigence n°1 du plan : la liste de courses et les tâches partagées en temps réel entre les deux téléphones. Service retenu le 26 novembre 2026 : Firebase, formule Spark gratuite (ADR 0002) ; rappels par GitHub Actions (ADR 0005). Branchement derrière le dépôt (`src/donnees/`), sans toucher au domaine ni aux écrans existants.

## Critères d’acceptation

- [x] Sans projet Firebase configuré, l’app reste locale et Nous l’explique ; un lien d’invitation affiche un message clair (test e2e `synchro.spec.ts`).
- [x] Firebase n’est chargé qu’à l’usage (import dynamique) : le mode local reste léger.
- [x] Nous → « Activer la synchronisation » copie le foyer dans `foyers/{id}/{table}` ; la table des clés ne quitte jamais le téléphone ; la santé part chiffrée (ADR 0004).
- [x] « Inviter » partage un lien `#/rejoindre/<foyer>.<secret>.<clé santé>` (feuille de partage, sinon copie) ; l’autre téléphone rejoint, installe la clé de santé et choisit qui il est.
- [x] Règles Firestore (`firestore.rules`) : un téléphone ne lit et n’écrit que dans son foyer ; il ne s’y ajoute qu’avec le secret d’invitation.
- [x] Hors ligne, les changements partent au retour du réseau (cache Firestore persistant) ; la pastille de l’en-tête dit Synchronisé, Hors ligne, Connexion ou À vérifier.
- [x] « Recevoir les rappels » enregistre le téléphone (jeton Cloud Messaging) ; le service worker affiche les rappels.
- [x] Rappels dus calculés par une fonction pure testée : heure de la tâche ou 8 h, fuseau du foyer (heure d’été comprise), une seule fois, au plus 24 h après, « Rappel santé » sans détail.
- [ ] Essai sur les deux iPhone avec le vrai projet (critères 2, 3, 4 et 6 de l’ADR 0002) : à faire une fois le projet créé.

## Hors périmètre

Photos et documents (Cloud Storage exige Blaze), invitation par QR code, fusion fine champ par champ (la dernière écriture d’un document gagne), notifications à l’ajout d’un article par l’autre.
