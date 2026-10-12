/** T62：以可用武器事實撰寫教材，非遊戲原台詞或官方逐字稿。 */
import { audioPath } from './author.mjs';
import { eternalReturnRoster } from './game-character-roster.mjs';
import { erReferenceRows } from './game-character-reference-data.mjs';
import { erWeapons } from './game-character-weapons.mjs';

const version = 'ea359154465075aa61a668efde014db076820a03';
const source = `https://github.com/pypy-vrc/er-gamedata/blob/${version}/data/CharacterMastery.json`;
const voice = 'saehaku';
const referenceNote =
  '固定版本社群遊戲資料的角色／武器對照，名稱另核對日中語系檔。教材資料朗讀，非角色原台詞；不代表最新版本或原配音。';
const weaponNote =
  '按固定版本資料列出此角色可用的武器種類。這是詞彙朗讀，沒有聲稱角色說過這些詞；不是技能名稱或選角語音。';
const sentenceNote =
  'を標示動作的對象；使えます是使う的可能形，表示可以使用，不表示只能使用。這是根據可用武器資料撰寫的說明句，非角色原台詞。';
/** @type {Record<string, string>} */
const nameReadings = {
  shoichi: 'しょういち',
  rio: 'りお',
  eleven: 'イレブン',
  debimarlene: 'デビーとマーリン',
};

/** @param {string} text @param {string} reading */
function marked(text, reading) {
  return /[一-鿿A-Za-z&]/.test(text) ? `{${text}|${reading}}` : text;
}

/** @param {{id: string, code: number, name: string, nameJa: string, referenceUrl: string}} character @returns {import('./game-character-study.mjs').GameCharacter} */
export function createErReferenceCharacter(character) {
  const row = erReferenceRows.find((r) => r.id === character.id);
  if (!row || row.code !== character.code)
    throw new Error(`Unverified character: ${character.id}`);
  const weapons = row.weaponTypes.map((type) => {
    const word = erWeapons[type];
    if (!word) throw new Error(`Unverified weapon: ${type}`);
    return word;
  });
  const first = weapons[0];
  const nameReading = nameReadings[character.id] ?? character.nameJa;
  const nameRuby = marked(character.nameJa, nameReading);
  const names = weapons.map((w) => w.jp).join('・');
  const readings = weapons.map((w) => w.reading).join('・');
  const nameNote =
    character.id === 'eleven'
      ? ' Eleven在教材中讀イレブン。'
      : character.id === 'debimarlene'
        ? ' &在教材中讀と，連接兩個名字。'
        : '';
  const spearNote = row.weaponTypes.includes('Spear')
    ? ' 此處的槍指長柄刺擊武器，與拳銃的手槍不同。'
    : '';
  const rows = [
    {
      id: `er:${character.id}:weapons`,
      category: '武器詞彙',
      jp: names,
      reading: readings,
      ruby: weapons.map((w) => marked(w.jp, w.reading)).join('・'),
      zh: weapons.map((w) => w.zh).join('、'),
      note: weaponNote + spearNote,
      pronunciation: readings,
    },
    {
      id: `er:${character.id}:weapon-use`,
      category: '資料句型',
      jp: `${character.nameJa}は${first.jp}を使えます。`,
      reading: `${nameReading}は ${first.reading}を つかえます。`,
      ruby: `${nameRuby}は${marked(first.jp, first.reading)}を{使|つか}えます。`,
      zh: `${character.name}可以使用${first.zh}。`,
      note: sentenceNote + spearNote + nameNote,
      pronunciation: `${nameReading}わ${first.reading}おつかえます。`,
    },
  ];
  return {
    ...character,
    voice,
    lines: rows.map((row) => ({
      ...row,
      kind: 'reference',
      voice,
      audio: audioPath('audio/games/er', 'gram', row.jp, voice),
      referenceUrl: source,
      referenceNote,
    })),
  };
}

/** @type {Record<string, [string, string]>} */
export const erReferenceDistractors = {};
for (const row of erReferenceRows) {
  const character = eternalReturnRoster.find((c) => c.id === row.id);
  if (!character) throw new Error(`Missing character: ${row.id}`);
  const weapons = row.weaponTypes.map((type) => erWeapons[type]);
  const correct = weapons.map((w) => w.zh).join('、');
  const wrong = Object.values(erWeapons)
    .map((w) => w.zh)
    .filter((w) => w !== correct);
  erReferenceDistractors[`er:${row.id}:weapons`] = [wrong[0], wrong[1]];
  erReferenceDistractors[`er:${row.id}:weapon-use`] = [
    `${character.name}不能使用${weapons[0].zh}。`,
    `只有對手可以使用${weapons[0].zh}。`,
  ];
}
