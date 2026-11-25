# 005 : icônes du bricolage et de la beauté, modification des articles et des tâches

## Contexte

Demande du 27 novembre 2026 : « Permet de modifier un article de course ou une tâche ! Prévois des icônes pour tout ce qui est bricolage, comme vis, colle, mastic, bois, embout, grille, etc. Idem pour les produits d’hygiène et de beauté. Propose de changer l’icône et de voir toutes les icônes. » La modification existait (appui long, mode « Modifier ») mais restait trop discrète, et l’appui long ouvrait la feuille sous le doigt encore posé.

## Critères d’acceptation

- [x] Courses : bouton « Modifier les articles » bien visible ; en mode modification, un crayon sur chaque article ; l’appui long ouvre la modification au relâcher et la feuille reste ouverte (test `icones.spec.ts`).
- [x] Un crayon au bout de chaque tâche, de chaque élément d’une liste à cocher et de chaque sortie « À voir » (« Modifier : <nom> » pour VoiceOver).
- [x] Catalogue : bricolage et maison (vis, clous, chevilles, boulons, colle, mastic, enduit, ciment, bois, briques, embouts, forets, perceuse, outils, grille, grillage, ruban adhésif, peinture, électricité, plomberie…), jardin et piscine, auto et moto, entretien et ménage, hygiène et beauté (déodorant, mascara, parfum, cotons, serviettes…) ; chaque produit a une icône (test).
- [x] Icônes Fluent Emoji Flat quand l’objet existe, sinon dessinées pour Nid dans le même style (`src/icones/nid.ts`).
- [x] Feuille « Modifier l’article » : changer l’icône (recherche dans toutes les icônes, rangées par rayon), revenir à l’icône d’origine, changer le rayon ; Nid retient ce choix pour ce nom d’article et le réapplique à chaque ajout, sur les deux téléphones.
- [x] Écran « Toutes les icônes » (Courses, lien sous la saisie) : tout le catalogue par rayon, recherche, un toucher ajoute le produit à la liste ; sans défilement horizontal à 360 px, sans erreur axe.

## Hors périmètre

Icônes importées par l’utilisateur (photo), catalogue modifiable produit par produit, ordre des rayons par magasin (mode magasin, plus tard).
