# 007 : foyers à plusieurs (couple et ado, colocation)

## Contexte

Demande du 26 novembre 2026 : « Propose d’ajouter plusieurs personnes au foyer comme un couple avec adolescent ou collocation. Revois aussi l’icône qui a un liseré blanc qui est moche. » Le foyer était pensé pour deux personnes (couleurs vert sapin et terre cuite, « Nous deux », équilibre à deux, invitation de « l’autre »).

Première version (choix « En couple », « Couple et ado », « Colocation ») remplacée le jour même à la demande de l’utilisateur : « Non propose juste ajouter une personne sans mettre l’autre personne du foyer ».

Un membre est une personne qui prend des tâches et peut avoir l’app sur son téléphone ; un jeune enfant reste une fiche « personne » dans Foyer.

## Critères d’acceptation

- [x] Premier lancement : seulement « Votre prénom », puis « Ajouter une personne » autant de fois que nécessaire (« Prénom de la personne 2 », 3…, une croix par ligne, le curseur va dans le champ ajouté) ; aucun champ « autre personne » ni composition imposés ; un foyer d’une seule personne est possible ; six personnes au plus.
- [x] Feuille « Le foyer » (Nous) : renommer, ajouter ou retirer une personne (pas celle de ce téléphone) ; après confirmation, les tâches d’une personne retirée passent « au premier libre ».
- [x] Six couleurs de membres (vert sapin, terre cuite, prune, bleu canard, ocre, framboise), texte blanc lisible (4,5:1 au moins), jamais la couleur seule (initiale, prénom).
- [x] « Pour qui » et les filtres d’À faire listent toutes les personnes ; « Nous deux » devient « Tout le monde » au-delà de deux (avatar « Tous »).
- [x] En-tête : trois avatars au plus, sinon deux et « +N », sans débordement à 360 px.
- [x] Analyse : barres et légendes pour chaque personne ; l’équilibre compare la personne la plus chargée et la moins chargée ; « Merci à tous » au-delà de deux.
- [x] Synchronisation : un même lien d’invitation pour tous (« envoyez-le seulement à Hélène et Léo »), chacun choisit son prénom en rejoignant (règles Firestore : huit téléphones au plus).
- [x] Grand logo du premier écran sans liseré (le trait des icônes ne s’applique plus au logo).
- [x] Tests : `membres.test.ts` (prénoms, couleurs, libellés, équilibre à trois) et `foyer.spec.ts` (seul, trois personnes avec une tâche pour l’ado, colocation à quatre, retrait et ajout, axe).

## Hors périmètre

Rôles et droits différents (parent, ado), répartition des dépenses entre colocataires, plus de six personnes.
