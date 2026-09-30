import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { AUDIO_CACHE_NAME, AUDIO_ROUTE_PATTERN } from './lib/offline.mjs';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: '日本語 Lab',
        short_name: '日本語 Lab',
        description: 'Michael 個人使用的日文學習網站，N5 復健到 N1。',
        lang: 'zh-Hant',
        start_url: '.',
        display: 'standalone',
        background_color: '#2b2f77',
        theme_color: '#2b2f77',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: AUDIO_ROUTE_PATTERN,
            handler: 'CacheFirst',
            options: {
              // 頁面端「下載音檔供離線使用」（lib/offline.mjs）會存進同一個快取，名稱必須一致。
              cacheName: AUDIO_CACHE_NAME,
              // <audio> 一律送 Range 請求；快取裡是整檔（200），要由這個外掛切成 206 回給播放器。
              rangeRequests: true,
              // 25 課預估約 1100 個音檔，上限抓寬一點，避免下載完的音檔被淘汰。
              expiration: { maxEntries: 3000, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  server: { watch: { usePolling: true } },
});
