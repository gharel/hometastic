import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

const fond = { background: '#22416a' };

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: fond },
    apple: { ...minimal2023Preset.apple, resizeOptions: fond },
  },
  images: ['public/favicon.svg'],
});
