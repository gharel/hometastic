# Plan produit et technique : Hometastic

> Statut : **validé le 25 novembre 2026** (plan, conception, charte). « Hometastic » est le nom de travail (le foyer d’un couple qui s’agrandira). Analyse préalable : `docs/BENCHMARK.md`. Maquette de référence : `maquette/index.html` (captures dans `docs/captures/`). Registre des décisions : `docs/DECISIONS.md`.
>
> **Exigence n°1** : la liste de courses et les tâches sont **synchronisées entre les deux téléphones** du couple, dès le premier lot livré.

## 1. Le problème

Un couple qui gère une maison, des voitures, des voyages et bientôt des enfants jongle avec au moins trois outils : Bring! pour les courses, Rappels ou un carnet pour le reste, et la mémoire de celui ou celle qui « pense à tout ». Bring! est excellent pour ajouter du lait en un tap, mais il ne sait pas qu’il faut passer le contrôle technique, refaire les passeports avant les vacances ou noter le prochain rendez-vous chez le pédiatre, et il est financé par la publicité. Les organiseurs familiaux (Cozi, Maple, FamilyWall) ont des listes de courses pauvres, sont payants ou pensés pour les familles américaines. Aucun ne rend visible **qui porte la charge mentale**.

## 2. La proposition

**Les courses en un tap, les choses à faire sans rien oublier, tout le foyer suivi au même endroit.**

Une application web installable (PWA), synchronisée en temps réel entre les deux téléphones du couple, sans publicité.

### Les cinq écrans

| Écran           | Rôle                                                                                                                                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Aujourd’hui** | Ce qui compte maintenant et bientôt, d’où que ça vienne : tâches du jour et en retard, entretien à faire, échéances des fiches (contrôle technique, rendez-vous), voyages à venir, « il manque sûrement… ». Écran d’accueil. |
| **Courses**     | Grille de tuiles à icônes comme Bring!, plusieurs listes (supermarché, marché, pharmacie et bébé, bricolage), rayons, mode magasin.                                                                                          |
| **À faire**     | Toutes les tâches : échéance, rappel, récurrence, assignation (moi, toi, nous deux, au premier libre), groupées par date ; filtres par personne.                                                                             |
| **Foyer**       | Les **fiches** (maison, voitures, enfants, papiers) et les **projets** (voyages, travaux, arrivée de bébé), chacun avec son historique, ses documents et ses échéances.                                                      |
| **Nous**        | Synchronisation et appareils, qui porte quel domaine, point de la semaine, équilibre, modèles, membres et réglages.                                                                                                          |

Un bouton **Ajouter** toujours visible ouvre la **saisie rapide** : une seule ligne qui comprend « 2 l lait, pain, bananes » (trois articles) comme « payer la facture d’eau avant le 5 @Hélène » (une tâche assignée avec échéance).

### Principes

- **Synchronisé entre vos deux téléphones, toujours** : la liste et les tâches sont les mêmes sur les deux iPhone, une modification apparaît chez l’autre en moins de 2 secondes. Aucune version « un seul téléphone » n’est livrée. Fonctionnement complet sans réseau (au fond du supermarché), modifications gardées puis fusionnées au retour du réseau sans rien écraser. L’état de la synchronisation est toujours visible (pastille en haut de l’écran).
- **Simple** : quelques briques réutilisées partout (section 3), des modèles pré-remplis, aucun champ obligatoire en dehors du titre. Ajouter du pain prend moins de trois secondes, sinon l’autre membre du couple retournera à Bring!.
- **Santé chiffrée** : tout ce qui touche à la santé est chiffré sur les téléphones avant d’être envoyé ; le serveur ne stocke que des données illisibles (section 5).
- **Sans publicité ni pistage** : aucune revente d’intention d’achat, aucune télémétrie, export JSON complet du foyer.
- **Bienveillant** : l’équilibre est montré, jamais transformé en compétition ou en reproche. Pas de classement par défaut.
- **Charte propre à Hometastic**, validée le 25 novembre 2026 (comme Fournée a la sienne ; la charte « gh. » de `www/perso` convient à une page vitrine, pas à une app de tous les jours) : DM Sans, fond crème, cartes blanches arrondies à ombre douce, bleu nuit en couleur principale (boutons, onglet actif, tuiles à acheter façon Bring!), miel en accent (nouveautés, urgent). Une couleur par membre du foyer (vert sapin, terre cuite), toujours accompagnée de l’initiale. Pas de capitales ni de grain. Thème clair, sombre ou système, verrouillé contre le mode nuit de Brave (Dark Reader).
- **Accessible** (WCAG 2.2 AA, testé avec VoiceOver) et en français soigné.

### Hors périmètre

Calendrier complet (on garde l’agenda partagé existant ; Hometastic exporte ses échéances en flux ICS), messagerie, localisation des membres, offres et prospectus, commande en drive, comptabilité (seulement des coûts et budgets simples), dossier médical officiel ou conseil de santé, suivi de bébé minute par minute (tétées, sommeil), IA générative au MVP.

## 3. Les briques

Tout Hometastic se construit avec **quatre briques visibles** et **trois briques de soutien**. Une nouvelle fonctionnalité doit d’abord s’exprimer avec ces briques ; en créer une nouvelle demande un ADR (ADR 0003).

### Briques visibles

| Brique     | Ce que c’est                                                                                                  | Exemples                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Liste**  | Des éléments à cocher, avec icône, quantité et rayon pour les courses                                         | Supermarché, marché, valise d’Hélène, trousse cyclone, liste de naissance |
| **Tâche**  | Une chose à faire : échéance, rappel, récurrence, assignation, domaine ; rattachable à une fiche ou un projet | Payer l’eau, contrôle technique, rappel de vaccin, réserver l’hôtel       |
| **Fiche**  | Une chose ou une personne qu’on suit dans le temps : infos clés, historique, documents, échéances             | La maison, la voiture de Guillaume, Léo, les papiers du foyer             |
| **Projet** | Quelque chose de daté qui se termine : tâches, listes, documents, budget, compte à rebours                    | Vacances aux îles, chambre de bébé, terrasse, déménagement                |

### Briques de soutien

| Brique       | Rôle                                                                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Document** | Photo ou PDF attaché à une fiche, un projet, une tâche ou une entrée d’historique (facture, ordonnance, billet, carte grise) ; date d’expiration facultative qui crée un rappel            |
| **Modèle**   | Un ensemble pré-rempli de tâches, listes et champs qui crée une fiche ou un projet en un geste (Voyage, Voiture, Enfant, Réparation, Rentrée, Préparer l’arrivée de bébé, Trousse cyclone) |
| **Domaine**  | Une catégorie de la vie du foyer avec son porteur (Courses, Repas, Administratif, Santé, Maison, Voiture, Enfants…) : sert à filtrer, assigner par défaut et mesurer l’équilibre           |

Le **Foyer** (membres, appareils, réglages, clé de chiffrement) contient le tout.

### Types de fiches

| Type                            | Infos clés                                                               | Historique                                                              | Échéances typiques                                                            |
| ------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Maison**                      | Pièces, équipements (clim, chauffe-eau, détecteurs), contacts d’artisans | Entretiens et réparations : date, qui, coût, artisan, facture, garantie | Routines selon le besoin (jauges), entretiens périodiques, fin de garantie    |
| **Véhicule**                    | Modèle, année, immatriculation, kilométrage relevé, assurance            | Entretiens et réparations : date, kilométrage, coût, garage, facture    | Contrôle technique, vidange (date **ou** kilométrage), pneus, assurance       |
| **Personne** (enfant ou adulte) | Date de naissance, tailles (vêtements, pointure), école, activités       | Mesures (taille, poids), rendez-vous passés                             | Rendez-vous médicaux, vaccins saisis par les parents, réunions, inscriptions  |
| **Animal**                      | Espèce, race, naissance, puce, vétérinaire, alimentation                 | Carnet de santé : vaccins, vermifuges, visites, coûts                   | Vaccins (annuel), vermifuge (3 mois), antiparasitaire (mensuel), par modèle   |
| **Compte**                      | Banque, titulaires, usage, 4 derniers chiffres (jamais le numéro)        | Virements faits, avec montant                                           | Virements récurrents avec montant (modèle « Compte commun » : le 1er du mois) |
| **Papiers**                     | Pièces d’identité, contrats, assurances, abonnements                     | Renouvellements                                                         | Expirations et renouvellements (passeport six mois avant un voyage)           |

La partie **santé** d’une fiche Personne (rendez-vous médicaux, vaccins, traitements, allergies, ordonnances, mesures) est chiffrée (section 5).

## 4. Fonctionnalités

### 4.1 Courses

- **Tuiles à icônes** : catalogue français de base (environ 400 produits) associé aux illustrations Fluent Emoji Flat (licence MIT). Un article sans icône reçoit une pastille à initiales ; on peut lui choisir une icône par mot-clé, et ce choix est retenu pour le foyer.
- **Ajout** : recherche qui complète (catalogue + historique du foyer), plusieurs articles séparés par des virgules, quantité et unité comprises (« 2 l lait », « lait x2 »), précisions suggérées sous l’article ajouté. Rangée « Récents » pour réajouter en un tap ce qui vient d’être acheté.
- **Détails** : quantité, unité, note, photo, priorité (urgent, en promo, quand ça arrange), « ajouté par » et « coché par ».
- **Rayons** : rangement automatique qui **retient les corrections**.
- **Magasins et ordre appris** : en mode magasin, l’ordre dans lequel on coche est enregistré ; après trois passages, Hometastic propose l’ordre des rayons de _ce_ magasin.
- **Mode magasin** : grandes tuiles, écran maintenu allumé, articles cochés masqués, annulation du dernier geste, ajouts de l’autre mis en évidence, bouton « pas trouvé ».
- **Signaux utiles plutôt que bruit** : « Je pars faire les courses » prévient l’autre, « Courses terminées » envoie le bilan. Les ajouts isolés ne notifient pas, sauf réglage contraire.
- **« Il manque sûrement »** : à partir des dates d’achat, Hometastic propose (sans ajouter tout seul) les produits qui arrivent à échéance.
- **Prix et budget (facultatif)** : prix mémorisé par produit et par magasin, total estimé, dépenses du mois. Devise XPF par défaut, réglable.
- **Liens** : une tâche, un projet ou une fiche peut verser des articles dans une liste (peinture pour la chambre, crème solaire pour le voyage, couches quand le stock baisse).

### 4.2 À faire

- **Tâche** : titre, note, échéance (date, heure facultative), rappels, récurrence, assignation, domaine, fiche ou projet, sous-tâches, documents, effort estimé, « en attente de ».
- **Trois récurrences** : calendaire (« le 1er de chaque mois »), **après la dernière fois** (« 90 jours après le dernier changement du filtre ») et **au kilométrage** (« tous les 15 000 km ou tous les 12 mois, au premier atteint »).
- **Assignation** : moi, toi, nous deux, au premier libre. Par défaut, le porteur du domaine.
- **Vues** : Aujourd’hui (en retard, du jour), Semaine, Par personne, Un jour (sans date).
- **Gestes** : glisser pour terminer ; reporter à « demain », « ce week-end », « la semaine prochaine ».
- **Rappels** par notification push sur les deux téléphones ; badge sur l’icône avec le nombre de tâches du jour.

### 4.3 Foyer : maison

- **Entretien selon le besoin** : routines par pièce avec une jauge qui se remplit avec le temps ; « Fait » la vide et crédite la personne. Pas d’échéance stricte ni de culpabilité.
- **Équipements** : entretien périodique (filtre de clim, piles des détecteurs, chauffe-eau) en récurrence « après la dernière fois ».
- **Réparations** : une réparation est une tâche rattachée à la fiche, avec photos du problème, artisan, devis, coût final, facture et garantie (rappel avant la fin). Une fois terminée, elle entre dans l’historique.
- **Contacts** : plombier, électricien, jardinier, rattachés aux interventions.

### 4.4 Foyer : véhicules

- **Kilométrage** relevé à la main ; Hometastic le demande une fois par mois (notification facultative) et l’utilise pour les échéances au kilométrage.
- **Échéances** : contrôle technique, vidange, pneus, assurance, avec la règle « date ou kilométrage, au premier atteint ».
- **Carnet** : chaque entretien ou réparation (date, kilométrage, coût, garage, facture). Coût total par an.
- **Documents** : carte grise, assurance, factures.

### 4.5 Foyer : personnes et enfants

- **Fiche par personne** sans compte (les enfants n’ont pas de compte ; les adultes peuvent avoir la leur).
- **Santé (chiffrée)** : rendez-vous médicaux avec rappels, vaccins faits et prochains **saisis par les parents** (jamais un calendrier officiel), traitements en cours, allergies, ordonnances en photo, contacts des soignants, mesures (taille, poids). Hometastic n’est jamais présenté comme un avis médical.
- **Vie quotidienne** : école ou crèche (réunions, inscriptions, fournitures versées aux courses), activités (horaires, paiements), tailles de vêtements et pointure, anniversaires.
- **Stocks bébé** : couches, lait infantile, lingettes ; consommation estimée, article versé aux courses sous un seuil.
- **Plus tard** : tâches au nom des enfants, points et récompenses, mode tablette familiale.

### 4.5 bis Foyer : animaux, finances, sorties

- **Animaux** : fiche « Animal » créée avec le modèle (vaccins, vermifuge, antiparasitaire récurrents) ; un soin avec montant, une fois fait, entre au carnet de santé.
- **Finances** : fiche « Compte » ; les virements à faire sont des tâches récurrentes avec montant, assignées « nous deux » par défaut ; chaque virement coché s’inscrit dans « Virements faits ». Jamais de numéro de compte complet.
- **Films, spectacles, soirées** : liste « À voir » (créée avec le foyer) : genre, date, lieu, billets. « Billets à acheter » crée la tâche de rappel ; la cocher passe les billets à « achetés ». Les sorties datées apparaissent dans « Bientôt ».

### 4.6 Foyer : papiers

- Pièces d’identité, contrats, assurances, abonnements, avec date d’expiration ou de renouvellement et rappel (passeports vérifiés automatiquement six mois avant un voyage).
- Documents en photo ou PDF.

### 4.7 Projets : voyages, travaux, grands moments

- **Projet** : dates de début et de fin, compte à rebours, avancement, tâches (« avant de partir »), listes (valise par personne, courses avant le départ), documents (billets, réservations, location), budget prévu et dépensé.
- **Modèles** : Voyage, Week-end, Travaux, Préparer l’arrivée de bébé, Déménagement, Rentrée.
- Un projet terminé s’archive et reste consultable (« comment on avait fait l’an dernier »).

### 4.8 Nous : la charge mentale partagée

- **Synchronisation** : appareils du foyer, état, invitation par lien ou QR code (qui transmet aussi la clé de chiffrement).
- **Domaines et porteurs** (inspiré de Fair Play) : chaque domaine a un porteur qui _y pense_ ; il reçoit par défaut les tâches du domaine.
- **Point de la semaine** (10 minutes, guidé) : ce qui a été fait (et un merci), ce qui traîne, la semaine qui vient (échéances, rendez-vous, voyages), repas et courses, on se répartit.
- **Analyse** (livrée le 26 novembre 2026, spec 003) : mois par mois, **qui fait quoi** (temps passé par personne, d’après les tâches cochées et les courses), **charge mentale** (tâches créées, articles ajoutés), temps **par domaine** (repas, courses, linge, ménage, enfants, santé, animaux, administratif, finances, voiture, maison, sorties), **historique** de six mois et **pistes pour rééquilibrer** (tâches récurrentes à confier à l’autre d’un geste). Chaque tâche a une **durée** saisie ou estimée d’après son titre. Présentation neutre, sans classement.
- **Modèles** du foyer, membres, réglages.

### 4.9 Intégrations

- **Raccourcis Apple** : « Dis Siri, ajoute du lait dans Hometastic » via un raccourci qui appelle l’API du foyer avec un jeton personnel révocable.
- **Flux ICS** des tâches datées et des projets, abonnable depuis Calendrier ou Google Agenda (sans le contenu santé : « Rendez-vous santé » seulement).
- **Fournée** (`www/cooking`) : verser la liste de courses de la fournée de la semaine dans la liste Courses de Hometastic.
- **Export et import JSON** du foyer, versionnés (la partie santé exportée chiffrée, ou en clair sur demande explicite).

## 5. Santé chiffrée de bout en bout

Décision du 25 novembre 2026 (ADR 0004).

- **Clé du foyer** générée sur le premier téléphone (Web Crypto, AES-GCM 256 bits), conservée sur chaque appareil, **jamais envoyée en clair** au serveur.
- **Partage** : l’invitation (QR code affiché sur un téléphone, scanné par l’autre) transmet la clé d’appareil à appareil.
- **Code de secours** à imprimer ou ranger dans un gestionnaire de mots de passe : sans lui, perdre les deux téléphones fait perdre la partie santé (le reste est intact).
- **Ce qui est chiffré** : contenu de la partie santé des fiches Personne (rendez-vous médicaux, vaccins, traitements, allergies, mesures, notes) et documents santé (ordonnances, comptes rendus).
- **Ce qui reste lisible par le serveur** : l’identifiant, la date et l’heure d’un rappel (pour envoyer la notification), sans aucun texte. Les notifications disent « Rappel santé » ; le détail s’affiche une fois l’app ouverte.
- **Conséquences** : pas de recherche côté serveur dans la santé, pas d’aperçu santé dans le flux ICS, tests dédiés (chiffrer, déchiffrer, mauvaise clé refusée, rien de lisible côté serveur).

## 6. Utilisateurs

| Profil                      | Besoin                                                                     | Usage type                                    |
| --------------------------- | -------------------------------------------------------------------------- | --------------------------------------------- |
| Celui ou celle qui organise | Sortir les choses de sa tête, déléguer sans tout réexpliquer               | Tâches, fiches, domaines, point de la semaine |
| Celui ou celle qui exécute  | Savoir quoi acheter et quoi faire, sans application compliquée             | Courses en tuiles, « mes tâches du jour »     |
| Les parents                 | Ne rien oublier pour les enfants, partager les infos de santé en confiance | Fiches enfants chiffrées, rendez-vous, stocks |

Les rôles changent selon les domaines : c’est le principe de « Nous ».

## 7. Parcours clés

1. **Ajouter du lait en trois secondes** : ouvrir Hometastic, Courses, taper la tuile « Lait » dans Récents. Ou « Dis Siri, ajoute du lait dans Hometastic ».
2. **Faire les courses** : « Je pars faire les courses » (l’autre est prévenu), mode magasin, cocher dans l’ordre des rayons appris, « Courses terminées ».
3. **Déléguer une tâche** : « prendre RDV garage avant vendredi @Hélène », l’autre reçoit la notification.
4. **Noter une réparation** : Foyer, Maison, « Ajouter une réparation », photo de la fuite, contact du plombier ; plus tard, coût et facture ; elle rejoint l’historique.
5. **Préparer un voyage** : modèle Voyage, dates, Hometastic crée les préparatifs, les valises de chacun, vérifie les passeports, et compte à rebours dans Aujourd’hui.
6. **Suivre la santé d’un enfant** : fiche de l’enfant, rendez-vous chez le pédiatre avec rappel « Rappel santé » aux deux parents ; ordonnance en photo, chiffrée.
7. **Point du dimanche** : 10 minutes guidées, la semaine est claire et répartie.

## 8. Modèle de données (première version)

```ts
type IdMembre = string;
type Assignation = IdMembre | 'nous' | 'libre';
type Rattachement = { ficheId?: string; projetId?: string };

interface Foyer {
  id: string;
  nom: string;
  membres: Membre[];
  devise: 'XPF' | 'EUR';
  domaines: Domaine[];
}
interface Membre {
  id: IdMembre;
  nom: string;
  couleur: string;
  role: 'adulte' | 'enfant';
  compte?: string;
}
interface Domaine {
  id: string;
  nom: string;
  icone: string;
  porteur?: IdMembre | 'nous';
}

// Liste et articles
interface Liste extends Rattachement {
  id: string;
  nom: string;
  icone: string;
  type: 'courses' | 'checklist';
  magasinId?: string;
}
interface Produit {
  id: string;
  nom: string;
  synonymes: string[];
  rayon: string;
  icone?: string;
  uniteParDefaut?: string;
  achats: string[];
  prix: Record<string, number>;
}
interface Article {
  id: string;
  listeId: string;
  produitId?: string;
  nom: string;
  quantite?: number;
  unite?: string;
  note?: string;
  photoId?: string;
  priorite?: 'urgent' | 'promo' | 'quand-possible';
  ajoutePar: IdMembre;
  ajouteLe: string;
  coche?: { par: IdMembre; le: string; introuvable?: boolean };
}
interface Magasin {
  id: string;
  nom: string;
  ordreRayons: string[];
  passages: { le: string; rayonsDansLOrdre: string[] }[];
}

// Tâche
type Recurrence =
  | {
      type: 'calendaire';
      frequence: 'jour' | 'semaine' | 'mois' | 'an';
      intervalle: number;
      jours?: number[];
    }
  | { type: 'apres'; jours: number }
  | { type: 'kilometrage'; km: number; ouMois?: number };
interface Tache extends Rattachement {
  id: string;
  titre: string;
  note?: string;
  domaineId?: string;
  assignation: Assignation;
  echeance?: { date: string; heure?: string; km?: number };
  rappels: string[];
  recurrence?: Recurrence;
  sousTaches: { titre: string; fait: boolean }[];
  documents: string[];
  effort?: 'petit' | 'moyen' | 'gros';
  enAttenteDe?: string;
  articles?: string[];
  cout?: number;
  sante?: boolean; // sante = contenu chiffré
  creeePar: IdMembre;
  creeeLe: string;
  faite?: { par: IdMembre; le: string };
}

// Fiche et historique
interface Fiche {
  id: string;
  type: 'maison' | 'vehicule' | 'personne' | 'papiers';
  nom: string;
  icone: string;
  infos: Record<string, string | number>; // modèle, année, kilométrage, date de naissance…
  routines?: Routine[]; // maison
  contacts: { nom: string; role: string; tel?: string }[];
  santeChiffree?: string; // personne : bloc AES-GCM (base64), jamais en clair
}
interface Entree {
  id: string;
  ficheId: string;
  date: string;
  titre: string;
  par?: IdMembre;
  cout?: number;
  km?: number;
  prestataire?: string;
  documents: string[];
  garantieJusquAu?: string;
}
interface Routine {
  id: string;
  titre: string;
  piece: string;
  frequenceJours: number;
  historique: { par: IdMembre; le: string }[];
}

// Projet
interface Projet {
  id: string;
  type: 'voyage' | 'travaux' | 'evenement' | 'autre';
  nom: string;
  icone: string;
  debut?: string;
  fin?: string;
  budgetPrevu?: number;
  archive: boolean;
}

// Document
interface Document extends Rattachement {
  id: string;
  nom: string;
  type: string;
  taille: number;
  expireLe?: string;
  chiffre: boolean;
  tacheId?: string;
  entreeId?: string;
}

// Modèle
interface Modele {
  id: string;
  nom: string;
  cree: 'fiche' | 'projet' | 'liste';
  contenu: unknown;
}
```

Fonctions pures du domaine (testées avec Vitest et fast-check) : `analyserSaisie`, `prochaineOccurrence` (trois récurrences), `jauge`, `ordreAppris`, `suggestionsRachat`, `equilibre`, `echeancesAVenir` (agrège tâches, fiches, projets, documents pour Aujourd’hui), `typographie`. Module `chiffrement` isolé (Web Crypto), testé à part.

## 9. Architecture technique (voir `docs/adr/`)

- **Front** : Vite, TypeScript strict, Preact et signaux, CSS natif à jetons (ADR 0001, accepté).
- **Synchronisation et fichiers** : un service hébergé avec cache hors ligne, temps réel et stockage de fichiers. **Firebase** recommandé (Firestore hors ligne, Auth par lien e-mail, Storage pour les photos et PDF, Cloud Messaging et fonctions planifiées pour les rappels) ; Dexie Cloud en alternative. Confirmé ou non par un essai d’une journée au lot 0 (ADR 0002).
- **Briques** : modèle de données de la section 8 (ADR 0003).
- **Santé chiffrée** côté téléphone avant envoi (ADR 0004).
- **Domaine isolé** derrière une interface de dépôt : changer de service ne touche ni le domaine ni l’interface.
- **Photos** : compressées sur le téléphone avant envoi (largeur maximale 1 600 px).
- **Icônes** : Fluent Emoji Flat (MIT) extraites au build dans un sprite ; Lucide (ISC) pour l’interface.
- **PWA** : vite-plugin-pwa, hors ligne complet, badge, push web (iOS 16.4+ depuis l’écran d’accueil).
- **Hébergement** : GitHub Pages (`gharel.github.io/hometastic`).
- **Tests** : Vitest + fast-check (domaine, chiffrement), Playwright + axe-core (5 écrans × 2 thèmes × 390 et 1280 px), essai manuel sur iPhone avec VoiceOver.

## 10. Lots et critères d’acceptation

| Lot                                 | Contenu                                                                                                                                                                                                                                                                                                                                               | Terminé quand                                                                                                                                                            |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **0 · Socle**                       | Projet Vite, jetons clair et sombre, PWA, `npm run check`, **essai de synchronisation** (deux téléphones, mode avion, modifications simultanées, fichier joint, push sur iPhone ajouté depuis Brave), **essai de chiffrement** (clé partagée par QR code)                                                                                             | L’essai tranche l’ADR 0002 et valide l’approche de l’ADR 0004                                                                                                            |
| **1 · Courses synchronisées**       | Comptes (lien e-mail), foyer et invitation par QR code, **synchronisation temps réel et hors ligne**, pastille d’état ; tuiles à icônes, catalogue, recherche, quantités, rayons qui retiennent les corrections, plusieurs listes, Récents, « ajouté par », mode magasin, « Je pars faire les courses » et « Courses terminées » en push, export JSON | Sur deux iPhone : un ajout apparaît chez l’autre en moins de 2 s ; aucune perte après des modifications simultanées hors ligne ; ajouter 10 articles prend moins de 30 s |
| **2 · À faire synchronisé**         | Tâches, échéances, rappels push sur les deux téléphones, récurrences calendaire et « après la dernière fois », assignation, sous-tâches, vues, badge, écran Aujourd’hui                                                                                                                                                                               | Une tâche cochée par l’un l’est chez l’autre en moins de 2 s ; un rappel arrive à l’heure sur les deux iPhone ; les récurrences passent les tests de propriétés          |
| **3 · Foyer : maison et véhicules** | Briques Fiche, Entrée et Document ; fiche Maison (routines et jauges, équipements, réparations, contacts, garanties) ; fiches Véhicule (kilométrage, échéances date ou km, carnet, coûts)                                                                                                                                                             | Une réparation suit son cycle (signalée, en cours, réparée, historique) ; une vidange « 15 000 km ou 12 mois » tombe à la bonne échéance                                 |
| **4 · Projets et papiers**          | Brique Projet ; modèles Voyage, Travaux ; valises par personne, documents, budget, compte à rebours ; fiche Papiers avec expirations                                                                                                                                                                                                                  | Un voyage créé depuis le modèle contient préparatifs, valises et vérification des passeports ; une expiration crée son rappel                                            |
| **5 · Personnes, enfants et santé** | Fiches Personne ; **santé chiffrée** (rendez-vous, vaccins saisis, traitements, allergies, ordonnances, mesures), code de secours ; école, activités, tailles ; stocks bébé                                                                                                                                                                           | Le serveur ne contient aucun texte de santé lisible (test automatisé) ; un rendez-vous santé notifie « Rappel santé » aux deux parents                                   |
| **6 · Nous**                        | Domaines et porteurs, point de la semaine guidé, équilibre, merci, modèles (bébé, valise, cyclone), flux ICS                                                                                                                                                                                                                                          | Un point de la semaine se boucle en moins de 10 minutes à deux                                                                                                           |
| **7 · Saisie rapide**               | Analyseur français (quantités, dates relatives, @personne, #domaine), aiguillage courses, tâche ou fiche, raccourci Siri                                                                                                                                                                                                                              | 95 % d’un corpus de 200 saisies réelles bien interprétées                                                                                                                |
| **8 · Courses intelligentes**       | Ordre appris par magasin, « il manque sûrement », prix et budget, import depuis Fournée                                                                                                                                                                                                                                                               | Après 3 passages, l’ordre proposé suit le parcours réel                                                                                                                  |

La synchronisation n’est pas un lot à part : elle est dans le lot 1 et tout ce qui suit en hérite. Le lot 1 remplace Bring! ; le lot 2 remplace l’application de tâches. Après le lot 2, faire un bilan d’usage de deux semaines avant de continuer. L’ordre des lots 3 à 8 peut changer selon les besoins du moment (le lot 5 avancera à l’approche d’une naissance).

**Option native (après le lot 6, si la PWA montre ses limites)** : envelopper l’app avec Capacitor pour gagner widgets, Apple Watch, rappels géolocalisés et Siri natif. Coût : compte développeur Apple (99 $ par an) et publication sur l’App Store ou TestFlight.

## 11. Qualité et vérifications

- `npm run check` avant chaque commit (ESLint, Prettier, TypeScript, Vitest), `npm run test:e2e` avant chaque envoi.
- Domaine pur couvert par des tests de propriétés (récurrences, jauges, ordre appris, analyseur de saisie, échéances agrégées).
- Chiffrement : tests dédiés (aller-retour, mauvaise clé refusée, aucune donnée santé lisible dans ce qui part au serveur).
- Contraste AA vérifié dans les deux thèmes, y compris sur les tuiles.
- Essai réel sur les deux iPhone (Brave, ajout à l’écran d’accueil, mode nuit actif) à chaque lot.
- Compte rendu honnête : ce qui a été vérifié, ce qui ne l’a pas été.

## 12. Risques

| Risque                                        | Parade                                                                                                           |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| L’autre membre du couple ne l’adopte pas      | Lot 1 jugé à l’aune de Bring! (trois secondes pour ajouter un article) ; le reste est facultatif                 |
| Désynchronisation entre les deux téléphones   | Essai dès le lot 0, pastille d’état toujours visible, tests de modifications simultanées hors ligne à chaque lot |
| Perte de la clé santé                         | Code de secours à la création du foyer, rappel de le ranger ; la perte ne touche que la partie santé             |
| Push web fragile sur iOS                      | Réinscription à chaque ouverture, rappels toujours visibles dans Aujourd’hui et sur le badge                     |
| Pas de widget ni de rappel géolocalisé en PWA | Raccourcis Siri ; option Capacitor plus tard                                                                     |
| Dépendance à un service hébergé               | Domaine derrière une interface de dépôt, export JSON complet                                                     |
| Volume des photos                             | Compression sur le téléphone, quota surveillé dans Nous                                                          |
| « Équilibre » vécu comme un tribunal          | Formulation neutre, pas de classement, désactivable                                                              |
| Périmètre trop large                          | Quatre briques réutilisées, lots livrables seuls, bilan d’usage après le lot 2                                   |

## 13. Reste à trancher

Voir `docs/DECISIONS.md` : visibilité du dépôt GitHub (public ou privé), région de stockage (Paris ou Sydney), confirmation du service de synchronisation par l’essai du lot 0.
