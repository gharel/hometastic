# ADR 0001 : pile technique du front

- Statut : **accepté** (validé avec le plan le 25 novembre 2026)
- Date : 2026-11-25

## Contexte

Nid est une application web installable, téléphone d’abord : plusieurs écrans qui partagent un état synchronisé en temps réel, un fonctionnement hors ligne complet, des notifications push. Le code sera écrit en grande partie par des agents : typage strict et tests rapides servent de garde-fous. Fournée (`www/cooking`) a déjà retenu une pile adaptée à ce type d’application.

## Décision proposée

Reprendre la pile de Fournée pour partager le savoir-faire, les jetons et, plus tard, du code :

- **Vite + TypeScript strict**.
- **Preact + signaux** : environ 3 ko, état réactif branché sur les abonnements temps réel du dépôt.
- **CSS natif à jetons** en clair et en sombre, sans framework CSS.
- **vite-plugin-pwa** pour le service worker, le manifeste et le push.
- **Fluent Emoji Flat** (MIT) via `@iconify-json/fluent-emoji-flat`, uniquement au build : un script extrait les icônes du catalogue dans un sprite SVG. **Lucide** pour l’interface.
- **Vitest + fast-check** pour le domaine, **Playwright + axe-core** pour les parcours et l’accessibilité.

## Options écartées

- **Application native Swift** : widgets, Watch et rappels géolocalisés, mais une seule plateforme, compte Apple payant, cycle de publication lent. Gardée en option via Capacitor (plan, lot « option native »).
- **React** : plus lourd sans bénéfice ici.
- **Icônes chargées depuis un CDN à l’exécution** : casse le hors ligne et fuit l’usage vers un tiers.

## Conséquences

- Une dépendance d’exécution principale (Preact), plus le SDK du service de synchronisation (ADR 0002).
- Toute nouvelle dépendance d’exécution passe par un ADR.
