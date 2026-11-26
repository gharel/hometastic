# AGENTS.md : Hometastic (organisation du foyer)

Consignes pour les agents de code (Claude Code, Codex, Copilot…) et pour les humains qui travaillent sur ce dépôt. Le produit est décrit dans `docs/PLAN.md`, l’analyse des applications existantes dans `docs/BENCHMARK.md`, **toutes les décisions dans `docs/DECISIONS.md`** (registre) et les décisions structurantes dans `docs/adr/`.

Les demandes explicites de l’utilisateur priment sur ce document.

## État du projet

**Cadrage validé** le 25 novembre 2026 : plan, conception (briques, ADR 0003), santé chiffrée (ADR 0004), charte et maquette (`maquette/index.html`). Exigence n°1 : liste de courses et tâches synchronisées entre les deux téléphones dès le lot 1. **Livré le 25 novembre 2026** : les quatre briques, puis animaux, finances et sorties (specs 001 et 002), sur un téléphone à la fois (stockage local IndexedDB via le dépôt, santé chiffrée), **en ligne** sur https://gharel.github.io/hometastic/ (dépôt public `gharel/hometastic`). **Synchronisation (26 novembre 2026)** : Firebase Spark validé (ADR 0002, spec 004), `StockageFirestore` derrière l’interface `Stockage`, invitation par lien, règles dans `firestore.rules` ; rappels par GitHub Actions (ADR 0005). Le projet Firebase est créé **par l’utilisateur** en suivant `docs/FIREBASE.md` ; ses valeurs publiques vont dans les variables du dépôt (`FIREBASE_CONFIG`, `FIREBASE_VAPID`, `RAPPELS_ACTIFS`), le compte de service dans le secret `FIREBASE_SERVICE_ACCOUNT` (jamais dans la conversation ni le dépôt). Sans ces variables, l’app reste locale. **Renommée Hometastic le 26 novembre 2026** (spec 006, logo « maison étincelante ») avec un bouton « Installer » (écran d’accueil d’iPhone et d’Android) ; dossier `www/hometastic`. Les identifiants internes gardent `nid` (base IndexedDB, clés locales `nid:`, format de sauvegarde, illustrations `nid-…`, fichiers `src/styles/nid.css` et `src/icones/nid.ts`) : ne pas les renommer, les données des téléphones en dépendent. **Foyers d’une à six personnes** (« Ajouter une personne » au premier lancement ; spec 007). Reste l’essai sur les deux iPhone.

## Git et publication

- Dépôt public `gharel/hometastic`. La branche `main` est publiée sur https://gharel.github.io/hometastic/ par `.github/workflows/pages.yml` (check, tests e2e, build puis publication) : **un envoi sur `main` est une publication**. Vérifier le workflow et la page publiée avant d’annoncer un déploiement réussi.
- Actions épinglées par SHA (commentaire avec la version), comme dans Fournée.
- `.github/workflows/rappels.yml` tourne toutes les 15 minutes quand `RAPPELS_ACTIFS` vaut `oui` ; ses journaux sont publics : `outils/rappels.mjs` n’y écrit que des nombres, jamais un titre, un nom ni un identifiant de foyer.
- Ne pas committer `node_modules/`, `dist/`, rapports de tests, `.env`, identifiants ni réglages d’IDE ; aucune donnée réelle (foyer fictif « Guillaume et Hélène », animaux Martine et Rookie).
- Fins de ligne LF (`.gitattributes`). Pas de `push --force`, de `reset --hard` ni de réécriture d’historique sans demande explicite.

## Le produit

Une application web responsive (téléphone d’abord), installable (PWA), partagée en temps réel entre les membres d’un foyer : liste de courses à tuiles illustrées, tâches du foyer (échéances, rappels, récurrences, assignation), fiches suivies dans le temps (maison, véhicules, personnes et enfants, papiers) et projets datés (voyages, travaux), répartition de la charge mentale. Tout se construit avec quatre briques : Liste, Tâche, Fiche, Projet (plus Document, Modèle, Domaine). Fonctionne hors ligne. Sans publicité ni télémétrie. Interface et contenus en français.

## Organisation prévue (lot 0)

```
maquette/index.html   Maquette de référence (un seul fichier, données fictives) : écrans, jetons, composants
src/domaine/          Logique pure, sans DOM ni réseau : briques, saisie rapide, récurrences (calendaire, après, km), jauges, échéances agrégées, ordre appris, suggestions, équilibre, typographie
src/donnees/          Interface de dépôt et son implémentation (service de synchronisation, ADR 0002), fichiers, export et import JSON
src/chiffrement/      Chiffrement de la santé (Web Crypto, AES-GCM), clé du foyer, code de secours (ADR 0004)
src/catalogue/        Catalogue de base (produits, synonymes, rayons, icônes) et sprite d’icônes généré
src/interface/        Composants Preact par écran : aujourdhui, courses, a-faire, foyer (maison, vehicule, personne, papiers, projet), nous
src/styles/           Jetons clair et sombre (seul endroit où une couleur est écrite) et composants
src/pwa/              Manifeste, service worker, push
tests/domaine/        Vitest + fast-check
tests/e2e/            Playwright + axe-core
tests/chiffrement/    Aller-retour, mauvaise clé, aucun texte santé lisible dans ce qui part au serveur
docs/                 PLAN.md, BENCHMARK.md, DECISIONS.md (registre), adr/ (décisions structurantes), specs/ (une par fonctionnalité), captures/
```

## Commandes

Outils : `node outils/icones.mjs` (télécharge les icônes Fluent du catalogue dans `src/icones/fluent.json`, sauf les `nid-…` dessinées à la main), `node outils/espaces.mjs <fichiers>` (échappe les espaces insécables écrites en dur), `node outils/extraire-css.mjs` (reprend la charte de la maquette, à ne relancer qu’en connaissance de cause : `src/styles/nid.css` a pu évoluer), `node outils/rappels.mjs` (envoi des rappels, lancé par GitHub Actions ; exige `FIREBASE_SERVICE_ACCOUNT`).

| Commande           | Rôle                                                                        |
| ------------------ | --------------------------------------------------------------------------- |
| `npm run dev`      | Serveur de développement Vite                                               |
| `npm run check`    | ESLint, Prettier, TypeScript, Vitest (avant commit)                         |
| `npm run test:e2e` | Build puis Playwright + axe, 5 écrans et les fiches × 2 thèmes (avant push) |
| `npm run build`    | Build de production dans `dist/`                                            |

## Façon de travailler

1. **Lire avant d’écrire** : `docs/PLAN.md`, la spec concernée dans `docs/specs/` et les fichiers touchés.
2. **Une fonctionnalité = une spec courte** (`docs/specs/NNN-nom.md` : contexte, critères d’acceptation vérifiables, hors périmètre), validée par l’utilisateur, **puis les tests, puis le code**.
3. **Toute décision** (nouvelle ou changée) = une ligne datée dans `docs/DECISIONS.md` ; une décision structurante (dépendance d’exécution, service hébergé, format de données, sécurité, hébergement) a aussi son ADR dans `docs/adr/NNNN-titre.md`. Ne pas rediscuter une décision validée sans demande de l’utilisateur.
4. **Briques d’abord** : une fonctionnalité s’exprime avec Liste, Tâche, Fiche, Projet, Document, Modèle, Domaine (ADR 0003) ; une nouvelle brique demande un ADR.
5. **Petits changements ciblés**, un sujet par commit. Fonctions pures dans `src/domaine/`, effets de bord aux bords. L’interface ne parle jamais directement au service de synchronisation : elle passe par le dépôt.
6. **Sous-agents** seulement si l’utilisateur le demande ; leur attribuer des fichiers distincts.
7. **Ce fichier est la mémoire partagée du projet** : le mettre à jour quand une règle ou une commande change, en restant court. `CLAUDE.md` ne fait que l’importer.
8. **Rendre compte honnêtement** : ce qui a changé, ce qui a été vérifié, ce qui ne l’a pas été. Ne jamais annoncer un parcours navigateur, un test, une notification reçue ou un déploiement non exécuté.

## Règles

- **Français partout** : identifiants, commentaires, textes affichés, messages de commit (Conventional Commits : `feat(courses): …`, `fix(taches): …`).
- **Typographie** : apostrophe ’, guillemets « », points de suspension … ; pas de tiret cadratin ni demi-cadratin. Espaces ordinaires dans les sources : la fonction de typographie les rend insécables à l’affichage.
- **Charte propre à Hometastic** (projet personnel ; **ni** la charte Skazy **ni** la charte « gh. » de `www/perso`, jugée inadaptée à l’app) : DM Sans (titres 800, texte 500), fond crème `#F6F3EE`, cartes blanches arrondies (16 px) à ombre douce, bleu nuit `#22416A` en couleur principale et pour les tuiles à acheter, miel `#F2B33D` en accent, membres en vert sapin, terre cuite, prune, bleu canard, ocre et framboise (six au plus, spec 007). Ni capitales décoratives, ni grain, ni bordures épaisses. La maquette fait référence.
- **Icônes** : interface en Lucide (ISC), décoratives (`aria-hidden`). Articles de courses en illustrations **Fluent Emoji Flat** (MIT), extraites au build dans un sprite SVG : c’est la seule exception à la règle « pas d’emoji », et il ne s’agit jamais de caractères emoji dans le texte. Quand Fluent n’a pas l’objet (vis, colle, mastic, déodorant…), illustration **dessinée pour Hometastic** dans le même style (aplats, 32 × 32, teintes Fluent) dans `src/icones/nid.ts`, préfixe `nid-`. **Chaque produit du catalogue a une illustration** (test) et chaque illustration dessinée sert à un produit. Chaque tuile a un nom lisible par les lecteurs d’écran.
- **Couleurs** : uniquement des jetons (`--fond`, `--texte`, `--primaire`, `--rayon-<nom>`, `--membre-<n>`…), définis en clair et en sombre. Contraste AA vérifié pour tout texte (4,5:1) et toute bordure de contrôle (3:1). La couleur d’un membre n’est jamais la seule information (initiale ou nom à côté).
- **Thème commun aux outils de gharel.github.io** (règle « Thème commun aux outils » de `www/pro/AGENTS.md`) : clé `skazy-outils:theme`, bouton `#bouton-theme` à trois états, `<meta name="darkreader-lock" />` après `<meta name="color-scheme" content="light dark" />` contre le mode nuit de Brave sur iPhone.
- **Responsive** : barre d’onglets en bas sur téléphone (zones sûres `env(safe-area-inset-*)`), barre latérale à partir de 900 px. Cibles d’au moins 44 px. Aucun défilement horizontal de la page.
- **Accessibilité** : WCAG 2.2 AA, navigation au clavier, focus visible, `prefers-reduced-motion` respecté, une seule `h1` par écran, focus sur la `h1` après un changement d’écran, essai VoiceOver sur iPhone.
- **Données et vie privée** : aucune publicité, aucune télémétrie, aucune ressource distante à l’exécution hors service de synchronisation (polices et icônes auto-hébergées). Règles d’accès côté serveur : un membre ne lit et n’écrit que dans son foyer. Export et import JSON versionnés ; un import invalide est refusé sans rien écraser. Aucun secret dans le dépôt.
- **Santé chiffrée (ADR 0004)** : tout contenu de santé (rendez-vous médicaux, vaccins, traitements, allergies, mesures, ordonnances, notes) est chiffré sur le téléphone (AES-GCM, clé du foyer) **avant** tout envoi ; le serveur ne reçoit jamais de texte santé lisible, seulement l’heure des rappels. Notifications et flux ICS : « Rappel santé », sans détail. Jamais de donnée de santé réelle dans le dépôt, les tests, les journaux ou les captures. Les informations sont saisies par les parents ; ne jamais présenter l’application comme un avis médical ou un calendrier officiel.
- **Pilules** : rayon égal à la moitié de la hauteur d’une ligne (20 px pour 40 px), jamais `999px` ; vérifier à 360 px qu’un libellé long passe proprement sur deux lignes.
- **Ton** : l’équilibre du foyer est montré sans classement ni reproche ; pas de compétition par défaut.
