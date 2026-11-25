import { cpSync } from 'node:fs';
import preact from '@preact/preset-vite';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/** La maquette reste en ligne sous /nid/maquette/ : référence visuelle. */
function copierMaquette(): Plugin {
  return {
    name: 'copier-maquette',
    apply: 'build',
    closeBundle() {
      cpSync('maquette', 'dist/maquette', { recursive: true });
    },
  };
}

// Publié sous https://gharel.github.io/nid/ : même chemin pour le build et son aperçu (tests e2e).
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/nid/' : '/',
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      pwaAssets: { config: true, overrideManifestIcons: true, injectThemeColor: false },
      manifest: {
        name: 'Nid',
        short_name: 'Nid',
        description: 'Le foyer : courses, tâches, maison, voitures, enfants, voyages.',
        lang: 'fr',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#f6f3ee',
        theme_color: '#f6f3ee',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        globIgnores: ['maquette/**', '**/*vietnamese*', '**/*cyrillic*', '**/*greek*'],
        navigateFallbackDenylist: [/\/maquette\//],
        // Rappels reçus par notification (Firebase Cloud Messaging, ADR 0005).
        importScripts: ['notifications-sw.js'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
    copierMaquette(),
  ],
}));
