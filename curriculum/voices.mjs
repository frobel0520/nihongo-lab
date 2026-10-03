/**
 * 角色語音陣容（VOICEVOX，2026-10-03 使用者選角）。
 * speakerId 對應本機 VOICEVOX 引擎 GET /speakers 回傳的 styles[].id。
 * 產生教材語音前，VOICEVOX.exe 或 vv-engine/run.exe 需在本機跑在 127.0.0.1:50021。
 */

/** @typedef {{ key: string, name: string, speakerId: number, style: string, note: string }} Voice */

/** @type {Voice[]} */
export const voices = [
  {
    key: 'tsumugi',
    name: '春日部つむぎ',
    speakerId: 8,
    style: 'ノーマル',
    note: '元氣、中階口語',
  },
  {
    key: 'hau',
    name: '雨晴はう',
    speakerId: 10,
    style: 'ノーマル',
    note: '溫柔可愛',
  },
  {
    key: 'sayo',
    name: '小夜/SAYO',
    speakerId: 46,
    style: 'ノーマル',
    note: '溫厚平穩',
  },
  {
    key: 'neko-vy',
    name: '猫使ビィ',
    speakerId: 58,
    style: 'ノーマル',
    note: '純真、年輕',
  },
  {
    key: 'zunko',
    name: '東北ずん子',
    speakerId: 107,
    style: 'ノーマル',
    note: '經典萌系少女聲',
  },
  {
    key: 'takehiro',
    name: '玄野武宏',
    speakerId: 11,
    style: 'ノーマル',
    note: '動畫男性角色、一般對話',
  },
  {
    key: 'ryusei',
    name: '青山龍星',
    speakerId: 13,
    style: 'ノーマル',
    note: '動畫男性角色、戰鬥宣言',
  },
];

/** @param {string} key */
export function getVoice(key) {
  const voice = voices.find((v) => v.key === key);
  if (!voice) {
    throw new Error(`unknown voice key: ${key}`);
  }
  return voice;
}

/** 歷史編排槽位：只用於保留教材音檔 URL／進度 id；公開教材在 lessons.mjs 套用選角。 */
export const lessonVoiceKeys = [
  'zundamon',
  'tsumugi',
  'hau',
  'sayo',
  'miko',
  'nana',
  'neko-vy',
  'chuugoku-usagi',
  'zunko',
];
