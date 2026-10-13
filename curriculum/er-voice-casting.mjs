import { getVoice } from './voices.mjs';

/** 教材聲線配置，不模仿原作聲優；每個角色必須明確選角。
 * 聲線特質是教材編排的選擇，不是角色原配音的客觀標籤。
 * @typedef {{ gender: 'female' | 'male', voice: string, direction: string, referenceUrl: string }} Casting
 */
export const erCastingReferences = Object.freeze(/** @type {Record<string, string>} */ ({
  roster: 'https://skdojo.com/en/dle/eternal-return/',
  bihyung: 'https://eternalreturn.fandom.com/wiki/Bihyung',
  craver: 'https://event.playeternalreturn.com/S11/Craver',
  lucia: 'https://event.playeternalreturn.com/ER/CHARACTER%26SKIN?hl=en-US',
  seres: 'https://playeternalreturn.com/posts/news/3857?hl=en-US',
}));

/** @type {Record<string, Casting>} */
export const erVoiceCasting = {};
/** @type {['female' | 'male', string, string, string[]][]} */
const groups = [
  ['female', 'tsumugi', '明亮、活潑', [
    'jackie', 'fiora', 'lidailin', 'emma', 'jenny', 'nicky', 'celine',
    'tia', 'haze', 'abigail', 'mirka', 'bihyung',
  ]],
  ['female', 'hau', '柔和、親切', [
    'silvia', 'hart', 'sua', 'priya', 'adina', 'charlotte', 'vanya', 'lucia',
  ]],
  ['female', 'sayo', '沉穩、成熟', [
    'aya', 'rozzi', 'nadine', 'adriana', 'lenox', 'cathy', 'adela', 'barbara',
    'elena', 'karla', 'estelle', 'martina', 'tazia', 'katja', 'lenore',
    'garnet', 'hisui', 'xuelin', 'blair', 'seres',
  ]],
  ['female', 'neko-vy', '輕盈、年輕', [
    'sissela', 'eleven', 'bianca', 'irem', 'leni', 'niah', 'coraline',
  ]],
  ['female', 'zunko', '清亮、端正', [
    'hyejin', 'chiara', 'chloe', 'rio', 'eva', 'mai', 'laura', 'lyanh',
    'debimarlene', 'tsubame', 'justyna',
  ]],
  ['male', 'ryusei', '厚實、有力', [
    'magnus', 'william', 'xiukai', 'bernice', 'leon', 'jan', 'echion',
    'markus', 'isaac', 'alonso', 'darko', 'istvan', 'craver',
  ]],
  ['male', 'saehaku', '清晰、俐落', [
    'zahir', 'shoichi', 'luke', 'alex', 'nathapon', 'daniel', 'johann',
    'aiden', 'theodore', 'arda', 'henry',
  ]],
  ['male', 'nemo2', '清爽、年輕', [
    'hyunwoo', 'yuki', 'isol', 'camilo', 'felix', 'piolo', 'kenneth',
    'yumin', 'fenrir',
  ]],
];
for (const [gender, voice, direction, ids] of groups) {
  for (const id of ids) {
    if (erVoiceCasting[id]) throw new Error(`Duplicate ER casting: ${id}`);
    const selected = getVoice(voice);
    if (selected.gender !== gender) throw new Error(`ER casting gender mismatch: ${id}`);
    erVoiceCasting[id] = {
      gender, voice, direction,
      referenceUrl: erCastingReferences[id] ?? erCastingReferences.roster,
    };
  }
}

/** @param {string} id */
export function getErCasting(id) {
  const casting = erVoiceCasting[id];
  if (!casting) throw new Error(`Missing ER voice casting: ${id}`);
  return casting;
}
