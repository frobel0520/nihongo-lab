import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { encodeMp3 } from '../scripts/ffmpeg.mjs';

/** 假的 spawn：回傳一個可以手動觸發事件的子程序，並記錄呼叫的參數。 */
function fakeSpawn(behave) {
  const calls = [];
  const spawnImpl = (command, args) => {
    calls.push({ command, args });
    const child = new EventEmitter();
    child.stderr = new EventEmitter();
    queueMicrotask(() => behave(child));
    return child;
  };
  return { spawnImpl, calls };
}

test('encodeMp3：呼叫 ffmpeg 轉 96kbps mp3，結束碼 0 就成功', async () => {
  const { spawnImpl, calls } = fakeSpawn((child) => child.emit('close', 0));
  await encodeMp3('in.wav', 'out.mp3', spawnImpl);
  assert.equal(calls[0].command, 'ffmpeg');
  assert.deepEqual(calls[0].args, [
    '-y',
    '-i',
    'in.wav',
    '-codec:a',
    'libmp3lame',
    '-b:a',
    '96k',
    'out.mp3',
  ]);
});

test('encodeMp3：找不到 ffmpeg（ENOENT）時回報明確的錯誤，而不是讓未處理的 error 事件崩潰', async () => {
  const { spawnImpl } = fakeSpawn((child) => {
    const error = new Error('spawn ffmpeg ENOENT');
    error.code = 'ENOENT';
    child.emit('error', error);
  });
  await assert.rejects(
    encodeMp3('in.wav', 'out.mp3', spawnImpl),
    /找不到 ffmpeg/,
  );
});

test('encodeMp3：其他啟動錯誤原樣丟出，非 0 結束碼附上 stderr', async () => {
  const boom = fakeSpawn((child) => child.emit('error', new Error('EACCES')));
  await assert.rejects(encodeMp3('a', 'b', boom.spawnImpl), /EACCES/);

  const failed = fakeSpawn((child) => {
    child.stderr.emit('data', 'Invalid data found\n');
    child.emit('close', 1);
  });
  await assert.rejects(
    encodeMp3('a', 'b', failed.spawnImpl),
    /結束碼 1.*Invalid data found/,
  );
});
