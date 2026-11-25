# 001 : les quatre briques sur un téléphone

Livré le 25 novembre 2026 à la demande de l’utilisateur (« livre l’app avec les 4 briques liste, tâche, fiche et projet fonctionnelles »). Spec écrite avec le code, pas validée avant : à relire.

## Contexte

Plan, conception et charte validés (`docs/PLAN.md`, ADR 0003, ADR 0004). Le service de synchronisation n’est pas encore choisi (ADR 0002, essai du lot 0) : cette livraison enregistre tout sur le téléphone, derrière l’interface de dépôt (`src/donnees/depot.ts`) que la synchronisation remplacera sans toucher au reste.

## Critères d’acceptation (vérifiés par `npm run test:e2e` et `npm test`)

- [x] Premier lancement : prénoms, nom du foyer, devise ; une liste « Supermarché » et une fiche « Maison » sont créées.
- [x] **Liste** : ajouter « 2 l lait » crée la tuile Lait (2 l) en Crèmerie ; suggestions du catalogue ; un article inconnu va en Divers avec une pastille ; toucher une tuile la coche (elle passe dans Récents), toucher un récent la remet ; mode Modifier (précision, urgent, retirer) ; listes à cocher avec compteur et « Tout décocher » ; une liste peut être rattachée à une fiche ou un projet.
- [x] **Tâche** : titre, date, heure, assignation, rattachement, note ; récurrences calendaire, « N jours après la dernière fois » et au kilométrage (véhicule) ; terminer une tâche récurrente la reprogramme et garde l’historique ; groupes En retard, Aujourd’hui, Cette semaine, Plus tard, Un jour ; filtres par personne ; « Faites récemment » permet de rouvrir.
- [x] **Fiche** : maison, véhicule, personne, papiers, autre, avec infos propres au type ; kilométrage relevé et échéances au km (« Dans 15 000 km », « Dépassé de 150 km ») ; historique avec coût, km, intervenant et total de l’année ; santé d’une personne et tâches santé **chiffrées** : aucun texte de santé lisible dans IndexedDB (test e2e) ; listes rattachées.
- [x] **Projet** : voyage, travaux, événement, autre ; dates, destination, compte à rebours ; tâches et avancement ; listes rattachées (valises) ; dépenses, total et budget ; archivage.
- [x] Aujourd’hui regroupe tâches urgentes, « Bientôt » (fiches et projets sur 30 jours) et aperçu des courses.
- [x] Données conservées après rechargement ; export et import JSON (la santé reste chiffrée) ; code de secours de la clé santé.
- [x] Accessibilité : axe sans violation sur les 5 écrans, une fiche, un projet et une feuille, en clair et en sombre, à 390 et 1280 px ; aucun débordement horizontal.

## Hors périmètre (lots suivants)

Synchronisation entre les deux téléphones et rappels push (ADR 0002), photos et documents, mode magasin et ordre appris des rayons, « il manque sûrement », saisie rapide multi-éléments et Siri, domaines et point de la semaine (Nous), modèles pré-remplis, flux ICS, invitation par QR code.
