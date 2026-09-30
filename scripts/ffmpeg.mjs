import { spawn } from 'node:child_process';

/**
 * 用 ffmpeg 把 wav 轉成 96kbps mp3。
 * 找不到 ffmpeg（spawn 的 error 事件，錯誤碼 ENOENT）與非 0 結束碼都回報明確的錯誤，
 * 不讓未處理的 error 事件直接把整個程序弄崩潰。spawnImpl 給測試注入假的子程序。
 *
 * @param {string} input
 * @param {string} output
 * @param {typeof spawn} [spawnImpl]
 * @returns {Promise<void>}
 */
export function encodeMp3(input, output, spawnImpl = spawn) {
  return new Promise((resolve, reject) => {
    const child = spawnImpl('ffmpeg', [
      '-y',
      '-i',
      input,
      '-codec:a',
      'libmp3lame',
      '-b:a',
      '96k',
      output,
    ]);
    let stderr = '';
    child.stderr?.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', (error) => {
      reject(
        /** @type {NodeJS.ErrnoException} */ (error).code === 'ENOENT'
          ? new Error('找不到 ffmpeg，請先安裝，並確認它在 PATH 裡')
          : error,
      );
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg 失敗（結束碼 ${code}）：${stderr.trim()}`));
    });
  });
}
