import { AUDIO_CACHE_NAME, downloadUrl } from '../../lib/offline.mjs';
import { audioUrl } from '../components/AudioLine';

export const offlineSupported = () => typeof caches !== 'undefined';

const HASH_HEADER = 'X-Nihongo-Audio-SHA256';
const audioType = (response: Response) =>
  (response.headers.get('content-type') ?? '').startsWith('audio/');
const loadVersions = () =>
  import('virtual:audio-versions').then((m) => m.default);

async function sha256(bytes: ArrayBuffer) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

/** 在原播放網址保留完整 200，供 Workbox 產生 206。只有通過驗證才替換。 */
export function createAudioStore(signal?: AbortSignal) {
  const cache = caches.open(AUDIO_CACHE_NAME);

  async function getPlayable(path: string) {
    const cached = await (
      await cache
    ).match(audioUrl(path), { ignoreVary: true });
    return cached?.status === 200 && audioType(cached) ? cached : undefined;
  }

  async function needsUpdate(path: string, cached: Response) {
    const expected = (await loadVersions())[path];
    if (!expected) throw new Error('無法確認音檔版本，已保留現有下載。');
    // 歷史下載沒有驗證標頭，直接比較原本的位元組。
    const actual =
      cached.headers.get(HASH_HEADER) ??
      (await sha256(await cached.arrayBuffer()));
    return actual !== expected;
  }

  return {
    async has(path: string) {
      return Boolean(await getPlayable(path));
    },
    async status(path: string) {
      const cached = await getPlayable(path);
      return {
        playable: Boolean(cached),
        outdated: cached ? await needsUpdate(path, cached) : false,
      };
    },
    async save(path: string) {
      signal?.throwIfAborted();
      const url = audioUrl(path);
      const expected = (await loadVersions())[path];
      if (!expected) throw new Error('找不到音檔版本，請確認 App 更新後再試。');
      signal?.throwIfAborted();
      const response = await fetch(`${downloadUrl(url)}&v=${expected}`, {
        cache: 'no-store',
        signal,
      });
      if (response.status !== 200 || !audioType(response)) {
        const target = await cache;
        const cached = await target.match(url, { ignoreVary: true });
        if (cached && (cached.status !== 200 || !audioType(cached)))
          await target.delete(url, { ignoreVary: true });
        throw new Error(
          response.status !== 200
            ? `HTTP ${response.status}`
            : '伺服器回傳的不是音檔。',
        );
      }

      const bytes = await response.arrayBuffer();
      if ((await sha256(bytes)) !== expected)
        throw new Error('音檔版本驗證失敗，已保留原有下載，請稍後再試。');

      const target = await cache;
      signal?.throwIfAborted();
      // Cache.put 單筆替換失敗時原檔仍在。驗證標頭與位元組一起寫入。
      await target.put(
        url,
        new Response(bytes, {
          headers: {
            'Content-Type': response.headers.get('content-type')!,
            [HASH_HEADER]: expected,
          },
        }),
      );
    },
  };
}

export type AudioStatus = Awaited<
  ReturnType<ReturnType<typeof createAudioStore>['status']>
>;

/** 歷史下載可能需要讀實際位元組，分批檢查以限制記憶體。 */
export async function scanAudio(
  paths: string[],
  store: ReturnType<typeof createAudioStore>,
  signal?: AbortSignal,
) {
  const statuses = new Map<string, AudioStatus>();
  for (let i = 0; i < paths.length; i += 16) {
    signal?.throwIfAborted();
    await Promise.all(
      paths.slice(i, i + 16).map(async (path) => {
        statuses.set(path, await store.status(path));
      }),
    );
  }
  return statuses;
}
