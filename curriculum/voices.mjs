/**
 * 角色語音陣容（VOICEVOX，2026-09-29 定案）。
 * speakerId 對應本機 VOICEVOX 引擎 GET /speakers 回傳的 styles[].id。
 * 產生教材語音前，VOICEVOX.exe 或 vv-engine/run.exe 需在本機跑在 127.0.0.1:50021。
 */

/** @typedef {{ key: string, name: string, speakerId: number, style: string, note: string }} Voice */

/** @type {Voice[]} */
export const voices = [
  { key: 'zundamon', name: 'ずんだもん', speakerId: 3, style: 'ノーマル', note: '入門、吉祥物感' },
  { key: 'tsumugi', name: '春日部つむぎ', speakerId: 8, style: 'ノーマル', note: '元氣、中階口語' },
  { key: 'hau', name: '雨晴はう', speakerId: 10, style: 'ノーマル', note: '溫柔可愛' },
  { key: 'sayo', name: '小夜/SAYO', speakerId: 46, style: 'ノーマル', note: '溫厚平穩' },
  { key: 'miko', name: '櫻歌ミコ', speakerId: 43, style: 'ノーマル', note: '少女感最重' },
  { key: 'nana', name: '春歌ナナ', speakerId: 54, style: 'ノーマル', note: '有力、明亮' },
  { key: 'neko-vy', name: '猫使ビィ', speakerId: 58, style: 'ノーマル', note: '純真、年輕' },
  { key: 'chuugoku-usagi', name: '中国うさぎ', speakerId: 61, style: 'ノーマル', note: '幽玄、初々しい' },
  { key: 'zunko', name: '東北ずん子', speakerId: 107, style: 'ノーマル', note: '經典萌系少女聲' },
];

/** @param {string} key */
export function getVoice(key) {
  const voice = voices.find((v) => v.key === key);
  if (!voice) {
    throw new Error(`unknown voice key: ${key}`);
  }
  return voice;
}
