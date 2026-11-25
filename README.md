# Nid

Application web du foyer : les courses en un tap, les choses à faire sans rien oublier, tout le foyer suivi au même endroit (maison, voitures, enfants, papiers, voyages).

> **Statut : les quatre briques (Liste, Tâche, Fiche, Projet) fonctionnent**, sur un téléphone à la fois (données dans le navigateur, hors ligne). **En ligne : https://gharel.github.io/nid/** (sur iPhone : Partager, puis « Sur l’écran d’accueil »). **Synchronisation entre les deux téléphones prête** (Firebase Spark, gratuit) : elle s’active dès que le projet Firebase du foyer est branché ([guide](docs/FIREBASE.md)) ; rappels par notification via GitHub Actions. Specs : [001, les quatre briques](docs/specs/001-quatre-briques.md), [002, animaux, finances, sorties](docs/specs/002-animaux-finances-sorties.md), [003, analyse](docs/specs/003-analyse.md), [004, synchronisation et rappels](docs/specs/004-synchronisation-rappels.md), [005, icônes et modification](docs/specs/005-icones-et-modification.md).

## Lancer l’application

```sh
npm install
npm run dev          # http://localhost:5173
npm run build        # version installable dans dist/, servie sous /nid/
npm run apercu       # aperçu du build : http://localhost:4183/nid/
```

Au premier lancement, Nid demande vos prénoms et crée le foyer (une liste « Supermarché » et une fiche « Maison » pour commencer).

## Ce que fait l’application

| Écran       | Rôle                                                                                                                                                                                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aujourd’hui | Tâches du jour et en retard, échéances des 30 prochains jours (contrôle technique, rendez-vous, départs), aperçu des courses                                                                                                                                                             |
| Courses     | **Liste** : tuiles à icônes rangées par rayon (près de 250 produits, du bricolage à la beauté), saisie qui complète (« 2 l lait »), récents à remettre d’un tap, articles modifiables (nom, quantité, icône, rayon), galerie de toutes les icônes, listes à cocher (valise, préparatifs) |
| À faire     | **Tâche** : échéance, heure, assignation (moi, l’autre, nous deux, au premier libre), récurrence (calendaire, après la dernière fois, au kilométrage)                                                                                                                                    |
| Foyer       | **Fiche** (maison, véhicule, personne, papiers) avec infos, kilométrage, santé chiffrée, échéances, historique et coûts ; **Projet** avec tâches, listes, budget                                                                                                                         |
| Nous        | **Analyse** (qui fait quoi, charge mentale, temps par domaine, historique, rééquilibrage), membre de ce téléphone, synchronisation, code de secours, sauvegarde                                                                                                                          |

Sans publicité ni télémétrie. **Santé chiffrée sur le téléphone** avant tout enregistrement (ADR 0004). Charte propre à Nid (DM Sans, crème, bleu nuit, miel), thème clair, sombre ou système, installable (PWA).

## Maquette

`maquette/index.html` reste la référence visuelle (fichier autonome, données fictives). Elle montre aussi ce qui n’est pas encore construit : mode magasin, point de la semaine.

## Documentation

- [Analyse de Bring! et des applications existantes](docs/BENCHMARK.md)
- [Plan produit et technique](docs/PLAN.md)
- [Registre des décisions](docs/DECISIONS.md)
- [Décisions d’architecture](docs/adr/) : pile technique, synchronisation, briques, santé chiffrée, rappels
- [Brancher Firebase](docs/FIREBASE.md) : synchronisation et rappels, pas à pas
- [Consignes pour les agents et les contributeurs](AGENTS.md)
