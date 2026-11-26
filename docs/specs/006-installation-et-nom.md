# 006 : bouton d’installation, nouveau nom Hometastic

## Contexte

Demande du 26 novembre 2026 : « Ajoute un bouton pour ajouter l’app en page d’accueil sur un iPhone ou Android. Change le nom de l’appli ainsi que l’icône, le repo GitHub et le nom du dossier aussi dans www. » Nom choisi : **Hometastic** ; icône choisie parmi cinq : n°1, « maison étincelante » (maison crème, porte bleu nuit, deux étincelles miel sur fond bleu nuit).

Sur iPhone, aucune page web ne peut ouvrir elle-même la fenêtre d’ajout à l’écran d’accueil : il faut passer par Partager. Une app ajoutée à l’écran d’accueil y a son propre stockage, séparé de celui du navigateur : ce qui est saisi dans Safari ou Brave ne la suit pas.

## Critères d’acceptation

- [x] Une carte « Installer Hometastic sur l’écran d’accueil » sur le premier écran (avant la création du foyer), en tête d’« Aujourd’hui » (bouton « Plus tard » qui la masque sur ce téléphone) et dans « Nous » (toujours là) ; aucune carte quand l’app est déjà ouverte depuis l’écran d’accueil.
- [x] Android, Chrome, Edge : « Installer » ouvre la fenêtre d’installation du navigateur ; une fois l’app installée, la carte disparaît.
- [x] iPhone et iPad : « Installer » déplie la marche à suivre (Partager, « Sur l’écran d’accueil », Ajouter) ; sur le premier écran, rappel d’installer avant de saisir quoi que ce soit.
- [x] Autres navigateurs (Firefox…) : la marche à suivre par le menu du navigateur.
- [x] Choix du mode (installée, fenêtre du navigateur, iPhone, menu) dans une fonction pure testée (`src/domaine/installation.ts`).
- [x] Nom **Hometastic** partout où il s’affiche : titre de l’onglet, manifeste, écran d’accueil du téléphone, en-tête, barre latérale, messages, partage d’invitation, notifications, nom du fichier de sauvegarde ; nouvelle icône (favicon, icônes du manifeste, icône iPhone) et logo de l’en-tête.
- [x] Dépôt `gharel/hometastic`, adresse https://gharel.github.io/hometastic/, dossier `www/hometastic`.
- [x] Données conservées : les identifiants internes gardent `nid` (base IndexedDB, clés locales, format de sauvegarde, illustrations `nid-…`), pour qu’une mise à jour ne perde rien.
- [x] En-tête sans débordement à 360 px avec le nom plus long, en clair et en sombre, sans erreur axe (test `installation.spec.ts` ; sous 440 px, l’en-tête montre le logo seul).

## Hors périmètre

Redirection de l’ancienne adresse `/nid/` (il faudrait garder un dépôt `nid`), publication dans les stores, nom de domaine propre.
