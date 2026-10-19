import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { curriculumChunks } from './scripts/curriculum-chunks.mjs';
import { VitePWA } from 'vite-plugin-pwa';
import { AUDIO_CACHE_NAME, AUDIO_ROUTE_PATTERN } from './lib/offline.mjs';
import { downloadCachePolicy } from './lib/download-cache-policy.mjs';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    curriculumChunks(),
    react(),
    VitePWA({
      registerType: 'prompt',
      devOptions: { enabled: true },
      includeAssets: [
        'jinwoo-favicon.ico',
        'jinwoo-apple-touch-icon-180x180.png',
      ],
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
          { src: 'jinwoo-pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          {
            src: 'jinwoo-pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'jinwoo-pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'jinwoo-maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        skipWaiting: false,
        clientsClaim: true,
        importScripts: ['sw-update-control.js'],
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],
        // 原始插畫只供圖示產生器使用，離線只需快取縮小後的圖示。
        globIgnores: ['**/icon-source-jinwoo.png'],
        runtimeCaching: [
          {
            urlPattern: AUDIO_ROUTE_PATTERN,
            handler: 'CacheFirst',
            options: {
              // 保留既有下載，不搬移／刪除 v5。只有明確下載可寫入，播放不自動儲存。
              cacheName: AUDIO_CACHE_NAME,
              // Public MP3 bytes are identical after HTTP decoding. Media uses a
              // different Accept-Encoding than the explicit download request;
              // Pages' Vary header must not hide an already-downloaded file.
              matchOptions: { ignoreVary: true },
              plugins: [downloadCachePolicy],
              // <audio> 一律送 Range 請求；快取裡是整檔（200），要由這個外掛切成 206 回給播放器。
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
  server: { watch: { usePolling: true } },
});
