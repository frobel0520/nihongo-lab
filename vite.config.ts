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
        name: 'かなの日本語',
        short_name: 'かなの日本語',
        description: '用單字卡、聽寫與跟讀練日文，從 N5 到動畫與遊戲日文。',
        lang: 'zh-Hant',
        start_url: '.',
        display: 'standalone',
        background_color: '#f5f6f3',
        theme_color: '#f5f6f3',
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
          // Google Fonts：第一次連網載入後存起來，離線時仍顯示同一套字型（否則會退回系統字）。
          // 樣式表偶爾更新，用 StaleWhileRevalidate；字型檔內容固定，用 CacheFirst。
          // 跨網域的請求是 opaque 回應（status 0），要明說才會存。
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-styles',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              cacheableResponse: { statuses: [0, 200] },
              // Noto Sans TC 依字元範圍切成很多小檔，只會載入實際用到的幾個
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  server: { watch: { usePolling: true } },
});
