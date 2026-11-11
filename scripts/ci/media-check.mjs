import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, lstatSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

/** Decode every changed MP3. @param {string[]} paths @param {string} [root] @param {(file: string) => unknown} [decode] */
export function checkChangedAudio(
  paths,
  root = '.',
  decode = (file) =>
    execFileSync(
      'ffmpeg',
      [
        '-hide_banner',
        '-v',
        'error',
        '-xerror',
        '-threads',
        '1',
        '-protocol_whitelist',
        'file,pipe',
        '-f',
        'mp3',
        '-i',
        file,
        '-f',
        'null',
        '-',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000 },
    ),
) {
  const results = [];
  for (const file of paths) {
    if (!/^public\/audio\/(?!.*(?:^|\/)\.\.\/).+\.mp3$/.test(file)) continue;
    const absolute = path.resolve(root, file);
    if (!absolute.startsWith(path.resolve(root) + path.sep))
      throw new Error('Audio outside repository');
    if (!existsSync(absolute)) continue;
    if (!lstatSync(absolute).isFile())
      throw new Error(`Audio must be a regular file: ${file}`);
    const bytes = readFileSync(absolute);
    if (!bytes.length) throw new Error(`Empty audio: ${file}`);
    decode(absolute);
    results.push({
      path: file,
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    });
  }
  return results;
}

const hasFfmpeg = () => {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore', timeout: 30000 });
    return true;
  } catch {
    return false;
  }
};

/**
 * Decode with the browser's own audio decoder when ffmpeg cannot be installed
 * (for example while the runner's package mirror is unreachable). Every file
 * must decode to a non-empty buffer; no network is used.
 * @param {string[]} files absolute paths
 */
export async function decodeWithBrowser(files) {
  const { chromium } = await import('playwright-core');
  const executablePath =
    process.env.CHROME_PATH ||
    ['chromium', 'google-chrome']
      .map((name) => {
        try {
          return execFileSync('which', [name], { encoding: 'utf8' }).trim();
        } catch {
          return '';
        }
      })
      .find(Boolean);
  if (!executablePath) throw new Error('No ffmpeg and no browser to decode audio');
  const browser = await chromium.launch({ executablePath });
  try {
    const page = await browser.newPage();
    for (const file of files) {
      const base64 = readFileSync(file).toString('base64');
      const frames = await page.evaluate(async (data) => {
        const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
        const context = new OfflineAudioContext(1, 1, 44100);
        return (await context.decodeAudioData(bytes.buffer)).length;
      }, base64);
      if (!(frames > 0)) throw new Error(`Undecodable audio: ${file}`);
    }
  } finally {
    await browser.close();
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const paths = JSON.parse(process.env.CI_CHANGED_PATHS || '[]');
  const ffmpeg = hasFfmpeg();
  const rows = ffmpeg ? checkChangedAudio(paths) : checkChangedAudio(paths, '.', () => {});
  if (!ffmpeg && rows.length)
    await decodeWithBrowser(rows.map((r) => path.resolve(r.path)));
  console.log(
    `Changed audio decoded with ${ffmpeg ? 'ffmpeg' : 'the browser decoder (ffmpeg unavailable)'}: ${rows.length} files, ${rows.reduce((n, r) => n + r.bytes, 0)} bytes. Not human pronunciation acceptance.`,
  );
}
