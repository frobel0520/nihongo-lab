// 與本次建置綁定，讓純音檔換檔也會改變 Workbox 預快取清單。
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const id = 'virtual:audio-versions';
const resolvedId = '\0' + id;

/** @returns {import('vite').Plugin} */
export function audioVersionManifest() {
  let dir = resolve('public/audio');
  return {
    name: 'audio-version-manifest',
    configResolved(config) {
      dir = resolve(config.publicDir, 'audio');
    },
    resolveId(source) {
      return source === id ? resolvedId : null;
    },
    async load(source) {
      if (source !== resolvedId) return null;
      const files = (await readdir(dir, { recursive: true }))
        .filter((file) => file.endsWith('.mp3'))
        .sort();
      /** @type {Record<string, string>} */
      const versions = {};
      // 限制同時開啟的檔案數，適用本機與 CI。
      for (let i = 0; i < files.length; i += 32) {
        const batch = await Promise.all(
          files.slice(i, i + 32).map(async (file) => {
            const path = join(dir, file);
            this.addWatchFile(path);
            return [
              'audio/' + file.replaceAll('\\', '/'),
              createHash('sha256')
                .update(await readFile(path))
                .digest('hex'),
            ];
          }),
        );
        for (const [path, digest] of batch) versions[path] = digest;
      }
      return 'export default ' + JSON.stringify(versions);
    },
  };
}
