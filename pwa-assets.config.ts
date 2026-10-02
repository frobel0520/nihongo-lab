import { defineConfig, defaultAssetName, minimal2023Preset } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    transparent: {
      ...minimal2023Preset.transparent,
      padding: 0,
      favicons: [[48, 'jinwoo-favicon.ico']],
    },
    maskable: { ...minimal2023Preset.maskable, padding: 0 },
    apple: { ...minimal2023Preset.apple, padding: 0 },
    assetName: (type, size) => `jinwoo-${defaultAssetName(type, size)}`,
  },
  images: ['public/icon-source-jinwoo.png'],
});
