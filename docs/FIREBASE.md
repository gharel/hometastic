# Brancher Firebase (synchronisation et rappels)

Guide pas à pas pour relier Hometastic à **votre** projet Firebase, formule **Spark** (gratuite, sans carte bancaire). Compter 15 minutes. Tout se fait dans la console Firebase (https://console.firebase.google.com) avec votre compte Google.

Ce que vous m’envoyez ensuite : la configuration web (étape 4) et la clé Web Push (étape 5). Ce sont des valeurs **publiques** (elles finissent dans l’app en ligne ; la sécurité vient des règles de l’étape 3). Le compte de service (étape 6) est **secret** : ne me l’envoyez pas, déposez-le vous-même dans GitHub.

## 1. Créer le projet

1. « Créer un projet », nom : `hometastic`.
2. **Désactiver Google Analytics** (Hometastic n’a aucune télémétrie).
3. Rester en formule **Spark** : ne jamais passer à Blaze (il demanderait une carte bancaire).

## 2. Connexion anonyme

Chaque téléphone a un compte anonyme, invisible pour vous ; il devient membre du foyer en le créant ou avec le lien d’invitation.

1. Menu Build (Créer) → **Authentication** → Commencer.
2. Onglet « Méthode de connexion » → **Anonyme** → Activer → Enregistrer.
3. Onglet « Paramètres » → Domaines autorisés : vérifier que `gharel.github.io` y est, sinon l’ajouter.

## 3. Base Firestore et règles

1. Build → **Firestore Database** → Créer une base de données.
2. Édition Standard, emplacement **`australia-southeast1` (Sydney)**, le plus proche de Nouméa. Ce choix est définitif.
3. Démarrer en **mode production**.
4. Onglet **Règles** : remplacer tout le contenu par celui du fichier [`firestore.rules`](../firestore.rules) du dépôt, puis **Publier**.

## 4. Application web (configuration publique)

1. Roue dentée → Paramètres du projet → Général → « Vos applications » → icône Web `</>`.
2. Surnom : `Hometastic`. Ne pas cocher Firebase Hosting (l’app reste sur GitHub Pages).
3. Copier l’objet `firebaseConfig` affiché (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) et me l’envoyer.

## 5. Notifications (clé Web Push publique)

1. Paramètres du projet → onglet **Cloud Messaging**.
2. Section « Configuration Web » → Certificats Web Push → **Générer une paire de clés**.
3. Copier la clé affichée (longue chaîne qui commence souvent par `B`) et me l’envoyer.

## 6. Compte de service pour les rappels (secret)

La tâche GitHub Actions qui envoie les rappels a besoin d’un accès serveur.

1. Paramètres du projet → onglet **Comptes de service** → « Générer une nouvelle clé privée » → un fichier JSON se télécharge.
2. Sur GitHub, dépôt `gharel/hometastic` → Settings → Secrets and variables → Actions → **New repository secret** :
   - Name : `FIREBASE_SERVICE_ACCOUNT`
   - Secret : tout le contenu du fichier JSON.

   Ou, dans un terminal où `gh` est connecté :

   ```powershell
   gh secret set FIREBASE_SERVICE_ACCOUNT --repo gharel/hometastic --body (Get-Content -Raw "$HOME\Downloads\hometastic-xxxx.json")
   ```

3. **Supprimer le fichier JSON** téléchargé.

## 7. Ce que je fais ensuite

Avec vos valeurs publiques, je crée les variables du dépôt `FIREBASE_CONFIG`, `FIREBASE_VAPID` et `RAPPELS_ACTIFS` (`oui`), puis je relance la publication : l’app en ligne sait alors se synchroniser, et la tâche « Rappels » tourne toutes les 15 minutes.

## 8. Sur les téléphones

Sur iPhone, Hometastic ajoutée à l’écran d’accueil a **son propre stockage**, séparé de celui de Brave. Tout se fait donc **depuis l’icône**, jamais dans le navigateur : sinon le lien avec le foyer, la clé de santé et les rappels resteraient dans Brave, invisibles pour l’app installée.

1. **Installer d’abord**, sur chaque téléphone : dans Brave, ouvrir https://gharel.github.io/hometastic/, Partager → « Sur l’écran d’accueil » → Ajouter. Ouvrir ensuite Hometastic **depuis l’icône**.
2. **Téléphone de Guillaume**, depuis l’icône : Nous → **Activer la synchronisation**. Si ses données sont restées dans Brave, les exporter d’abord depuis Brave, puis « Restaurer une sauvegarde » au premier lancement de l’app installée. Le foyer est copié dans Firestore (la santé part chiffrée).
3. Nous → **Inviter Hélène** : la feuille de partage s’ouvre ; envoyer le lien par Messages ou WhatsApp. Ce lien donne accès au foyer **et à la clé de santé** : à n’envoyer qu’aux membres du foyer. Au-delà de deux personnes, le bouton s’appelle « Inviter » et le même lien sert pour chacune.
4. **Téléphone d’Hélène** : dans Messages, **appui long sur le lien → Copier**. Ne pas le toucher : il s’ouvrirait dans Brave, pas dans l’app installée.
5. Ouvrir Hometastic **depuis l’icône**. Au premier lancement, taper son prénom et valider : ce foyer provisoire sert seulement à entrer dans l’app et ne sera plus affiché.
6. Nous → champ « Ou collez le lien reçu » → coller → **Rejoindre** → **Rejoindre le foyer** → toucher son prénom. Ce qui était déjà dans l’app de ce téléphone n’est plus affiché (exporter avant si besoin).
7. **Rappels**, sur chaque téléphone, toujours depuis l’icône : Nous → **Recevoir les rappels** et accepter les notifications. Sur iPhone, les notifications web ne marchent que dans l’app installée (iOS 16.4 ou plus).

## Bon à savoir

- **Gratuit** : 50 000 lectures et 20 000 écritures par jour, 1 Gio stocké ; un foyer en utilise une infime partie. Si un quota était dépassé, Firestore s’arrête jusqu’au lendemain, sans facture.
- **Rappels** : à l’heure de la tâche (8 h si aucune heure), dans le fuseau du foyer. GitHub lance la tâche toutes les 15 minutes, parfois avec quelques minutes de retard. Un rappel de santé dit seulement « Rappel santé ».
- **GitHub désactive** une tâche programmée après 60 jours sans activité sur le dépôt : un envoi (commit) ou « Enable workflow » dans l’onglet Actions la relance.
- **Quitter** : Nous → « Ne plus synchroniser ce téléphone ». Les données partagées restent pour l’autre téléphone.
- **Option** : dans Google Cloud Console → API et services → Identifiants, restreindre la clé d’API du navigateur aux sites `https://gharel.github.io/*`.
