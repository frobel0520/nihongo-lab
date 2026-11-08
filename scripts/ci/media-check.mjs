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

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const rows = checkChangedAudio(
    JSON.parse(process.env.CI_CHANGED_PATHS || '[]'),
  );
  console.log(
    `Changed audio decoded: ${rows.length} files, ${rows.reduce((n, r) => n + r.bytes, 0)} bytes. Not human pronunciation acceptance.`,
  );
}
