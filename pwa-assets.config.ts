import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

const fond = { background: '#22416a' };

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: fond },
    // Icône iPhone : peu de marge (l’iPhone arrondit les coins lui-même), la maison reste lisible.
    apple: { ...minimal2023Preset.apple, padding: 0.12, resizeOptions: fond },
  },
  images: ['public/favicon.svg'],
});
