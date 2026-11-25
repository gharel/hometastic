# ADR 0005 : rappels envoyés par une tâche GitHub Actions programmée

- Statut : **accepté** (demande de l’utilisateur le 26 novembre 2026 : « Et github actions pour les rappels »)
- Date : 2026-11-26

## Contexte

Les rappels doivent arriver application fermée, sur les deux iPhone. La formule Spark de Firebase (ADR 0002) fournit Cloud Messaging mais pas Cloud Functions : rien côté Firebase ne peut décider « il est 8 h, envoie ». Il faut un planificateur gratuit, sans carte bancaire.

## Décision

- `.github/workflows/rappels.yml` tourne **toutes les 15 minutes** (cron `*/15 * * * *`, plus un lancement manuel), seulement si la variable du dépôt `RAPPELS_ACTIFS` vaut `oui`.
- Il exécute `outils/rappels.mjs` (firebase-admin, compte de service dans le secret `FIREBASE_SERVICE_ACCOUNT`), qui lit pour chaque foyer les tâches dont l’échéance tombe d’avant-hier à demain, et calcule avec `src/domaine/rappels.ts` (fonction pure, testée) ce qui est dû : tâche non faite, heure de la tâche ou 8 h, **dans le fuseau du foyer**, passée depuis moins de 24 h, pas encore envoyée.
- Envoi par Cloud Messaging en message « data » (`titre`, `corps`, `lien`, `tag`), affiché par `public/notifications-sw.js` importé dans le service worker. Destinataires : les téléphones du membre assigné, sinon tout le foyer.
- Chaque rappel envoyé est noté dans `foyers/{id}/rappelsEnvoyes/{tâche_date_heure}` : il ne part qu’une fois, même si deux exécutions se chevauchent à la suite d’un retard.
- Santé : le serveur ne connaît pas le titre (chiffré, ADR 0004) ; la notification dit « Rappel santé ».
- Le dépôt est public, ses journaux aussi : le script n’écrit que des nombres.

## Conséquences

- **Gratuit** : minutes illimitées pour un dépôt public ; quelques lectures Firestore par exécution (requête limitée aux échéances proches).
- **Précision** : à 15 minutes près, plus les retards de GitHub sur les tâches programmées (souvent quelques minutes, parfois davantage aux heures chargées). Le critère 4 de l’essai du lot 0 (« entre H et H + 1 minute ») devient « entre H et H + 15 minutes, en général ».
- **Désactivation** : GitHub suspend une tâche programmée après 60 jours sans activité sur le dépôt ; un envoi ou « Enable workflow » la relance.
- Remplaçable sans toucher à l’app : un autre planificateur (Cloudflare Worker, Blaze et fonctions planifiées) peut appeler le même script ou la même fonction pure.
