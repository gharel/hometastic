# 003 : analyse de la charge du foyer

Livré le 26 novembre 2026 à la demande de l’utilisateur (« une section analyse, avec la charge mentale, qui fait quelle tâche sur le mois avec historique pour équilibrer si besoin et estimation de la durée d’une tâche »). Spec écrite avec le code : à relire. Aucune nouvelle brique : l’analyse se calcule à partir des tâches et des listes.

## Critères d’acceptation (vérifiés par `npm test` et `npm run test:e2e`)

- [x] **Durée** : chaque tâche a un champ « Durée (min) » facultatif ; le libellé montre l’estimation d’après le titre et son domaine (« estimée à 20 min (linge) » pour « Lancer une machine »). La durée est enregistrée dans chaque passage.
- [x] **Qui fait quoi** : temps passé et nombre de tâches par personne sur le mois ; une tâche compte pour qui l’a cochée ; les courses comptent pour qui coche les articles (20 min plus 3 min par article, par jour).
- [x] **Charge mentale** : tâches créées et articles ajoutés par personne sur le mois.
- [x] **Par domaine** : temps par domaine (repas, courses, linge, ménage, enfants, santé, animaux, administratif, finances, voiture, maison, sorties, autre), partagé entre les personnes.
- [x] **Historique** : six derniers mois, chaque mois ouvrable ; navigation mois précédent et suivant (pas au-delà du mois en cours).
- [x] **Équilibre** : au-delà de 20 % d’écart (et d’une heure), message neutre et jusqu’à trois tâches récurrentes du plus chargé à confier à l’autre ; « Confier à … » change l’assignation.
- [x] Accessibilité (axe sans violation) et pas de débordement à 390 px ; barres accompagnées d’une légende et d’une étiquette accessible (jamais la couleur seule).

## Hors périmètre

Saisie du temps réel passé (chronomètre), objectifs de répartition, notifications d’équilibre, analyse entre les deux téléphones tant que la synchronisation n’est pas branchée (chaque téléphone n’analyse que ses propres données).
