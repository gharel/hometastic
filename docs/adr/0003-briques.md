# ADR 0003 : quatre briques pour tout le foyer

- Statut : **accepté** (validé avec le plan le 25 novembre 2026)
- Date : 2026-11-25

## Contexte

Le couple veut suivre au même endroit les courses, les tâches, les vacances et voyages, l’entretien et les réparations de la maison et des voitures, la santé et la vie des enfants, les papiers. Un module par sujet ferait une application lourde, incohérente et longue à construire. La demande est explicite : « de façon simple ».

## Décision

Tout se construit avec **quatre briques visibles** et **trois briques de soutien** (détail et modèle de données dans `docs/PLAN.md`, sections 3 et 8) :

| Brique             | Rôle                                                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Liste              | Éléments à cocher (courses avec icônes, valises, checklists)                                                                     |
| Tâche              | Chose à faire : échéance, rappel, récurrence (calendaire, après la dernière fois, au kilométrage), assignation, domaine          |
| Fiche              | Chose ou personne suivie dans le temps (maison, véhicule, personne, papiers) : infos, historique (entrées), documents, échéances |
| Projet             | Chose datée qui se termine (voyage, travaux, arrivée de bébé) : tâches, listes, documents, budget                                |
| Document (soutien) | Photo ou PDF rattaché, avec expiration facultative                                                                               |
| Modèle (soutien)   | Ensemble pré-rempli qui crée une fiche, un projet ou une liste                                                                   |
| Domaine (soutien)  | Catégorie avec porteur, pour filtrer, assigner et mesurer l’équilibre                                                            |

Les tâches, listes et documents se **rattachent** à une fiche ou un projet (`ficheId`, `projetId`). L’écran Aujourd’hui agrège les échéances de toutes les briques (`echeancesAVenir`). L’écran Foyer présente fiches et projets.

## Options écartées

- **Un module par sujet** (voyages, voitures, santé…) : interfaces différentes à apprendre, code dupliqué, chaque sujet devient un mini-produit.
- **Tout en tâches et étiquettes** : trop pauvre pour un historique de réparations, un kilométrage ou un budget de voyage.

## Conséquences

- Une nouvelle fonctionnalité s’exprime d’abord avec ces briques ; une nouvelle brique demande un nouvel ADR.
- Les types de fiches (maison, véhicule, personne, papiers) et de projets (voyage, travaux, événement) ne diffèrent que par leurs champs et leurs modèles.
- La partie santé d’une fiche Personne est chiffrée (ADR 0004).
