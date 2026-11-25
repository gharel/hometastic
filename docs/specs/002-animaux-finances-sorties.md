# 002 : animaux, finances, films et spectacles

Livré le 25 novembre 2026 à la demande de l’utilisateur (« en respectant les 4 briques : gestion des animaux comme modèle, suivi des films ou spectacles ou soirées à voir ou billets à acheter, gestion finance avec rappel des virements à faire sur les comptes commun ou autre »). Spec écrite avec le code : à relire. Aucune nouvelle brique (ADR 0003).

## Critères d’acceptation (vérifiés par `npm test` et `npm run test:e2e`)

- [x] **Animal** (Fiche + Modèle) : type « Animal » avec espèce, race, naissance, puce, vétérinaire, alimentation ; la case « Créer les échéances habituelles » crée « Vaccins chez le vétérinaire » (chaque année), « Vermifuge » (tous les 3 mois) et « Antiparasitaire » (chaque mois), au nom de l’animal ; sections « Soins à venir » et « Carnet de santé » ; un soin avec montant fait entre au carnet et se reprogramme.
- [x] **À voir** (Liste + Tâche) : liste « À voir » créée avec le foyer, ou ajoutée par « + Liste » ; saisie rapide avec genre deviné (film, série, concert, spectacle, soirée, expo) ; fiche d’une sortie : genre, date, lieu, billets ; « À acheter » crée la tâche « Acheter les billets : … » (deux semaines avant la date par défaut, jamais dans le passé) ; cocher cette tâche passe les billets à « achetés » ; groupes « Prévu », « À voir un jour », « Déjà vu » ; les sorties datées apparaissent dans « Bientôt ».
- [x] **Finances** (Fiche + Tâche) : type « Compte » (banque, titulaires, usage, 4 derniers chiffres seulement) ; modèle « Compte commun » : virement le 1er de chaque mois, pour les deux ; montant sur la tâche ; chaque virement coché s’inscrit dans « Virements faits » avec son montant, et le suivant est programmé ; raccourci « Virement » dans le bouton Ajouter.
- [x] Accessibilité et débordement vérifiés sur la liste « À voir », un compte, un animal et la feuille « Nouvelle fiche », en clair et en sombre, à 390 et 1280 px.

## Hors périmètre

Solde ou budget du compte, import bancaire, rappels push (avec la synchronisation, ADR 0002), suggestions de films, achat de billets en ligne.
