# ADR 0004 : santé chiffrée sur les téléphones avant envoi

- Statut : **accepté** (décision de l’utilisateur le 25 novembre 2026 : « santé à chiffrer avant envoi serveur »)
- Date : 2026-11-25

## Contexte

Les fiches des personnes, surtout des enfants, contiendront des données de santé : rendez-vous médicaux, vaccins, traitements, allergies, ordonnances, mesures. Le service de synchronisation (ADR 0002) est hébergé par un tiers. Ces données ne doivent pas y être lisibles.

## Décision

Chiffrement de bout en bout de la partie santé, côté téléphone, avant tout envoi :

- **Algorithme** : AES-GCM 256 bits via Web Crypto (natif dans Safari et Chromium), un vecteur d’initialisation aléatoire par enregistrement.
- **Clé du foyer** : générée sur le premier téléphone, stockée sur chaque appareil (IndexedDB, clé non exportable une fois importée), **jamais envoyée en clair** au serveur.
- **Partage** : transmise d’appareil à appareil par le QR code d’invitation (lu sur place, pas par le réseau).
- **Secours** : code de secours affiché à la création du foyer, à imprimer ou ranger dans un gestionnaire de mots de passe.
- **Périmètre chiffré** : contenu santé des fiches Personne (`santeChiffree`), tâches marquées santé (titre, note), documents santé (fichiers chiffrés avant téléversement).
- **En clair côté serveur** : identifiants, dates et heures des rappels (pour planifier les notifications), sans aucun texte.
- **Notifications** : « Rappel santé », sans détail ; le contenu s’affiche une fois l’app ouverte et déchiffrée.
- **Flux ICS** : « Rendez-vous santé » sans détail.

## Options écartées

- **Faire confiance au chiffrement du fournisseur** : le fournisseur garde la clé, donc peut lire.
- **Tout chiffrer** (courses, tâches) : perd les fonctions serveur utiles (rappels détaillés, raccourci Siri, recherche) pour des données peu sensibles. Pourra être étendu plus tard si besoin.
- **Mot de passe saisi à chaque ouverture** : trop contraignant au quotidien ; la clé reste sur l’appareil, protégé par le verrouillage du téléphone.

## Conséquences

- Perdre les deux téléphones sans le code de secours fait perdre la partie santé (le reste est intact). L’interface le dit clairement à la création.
- Pas de recherche côté serveur dans la santé ; la recherche se fait sur le téléphone après déchiffrement.
- Module `chiffrement` isolé et testé : aller-retour, mauvaise clé refusée, test automatisé qui vérifie qu’aucun texte santé n’apparaît dans ce qui part au serveur.
- Jamais de donnée de santé réelle dans le dépôt, les tests, les journaux ou les captures.
