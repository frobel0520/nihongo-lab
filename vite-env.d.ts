/// <reference types="vite/client" />

declare module 'virtual:vocab-image-manifest' {
  /** [檔名（不含 .svg）, 內容版本, bytes]，由 scripts/vocab-image-manifest.mjs 於 build 時產生。 */
  export const VOCAB_IMAGE_ROWS: import('./lib/vocab-image-offline.mjs').VocabImageRow[];
}
