/**
 * 角色語音教材；ER 僅使用 selected／selected2 來源，不混入武器資料或自編練習。
 * 原音索引與 VOICEVOX 教材音檔分開，不宣稱已公開遊戲原音。
 * @typedef {import('./lessons.mjs').Line & { id: string, category: string, kind: 'quote' | 'practice' | 'reference', note: string, referenceUrl: string, referenceNote: string, voicelineId?: number, sourceTitle?: string, voicefile?: string, variant?: string, pronunciation?: string, audioReady?: boolean, selectionAssetCount?: number }} GameLine
 * @typedef {{ id: string, name: string, nameJa: string, voice?: string, referenceUrl: string, portrait?: string, portraitReferenceUrl?: string, voiceReferenceUrl?: string, lines: GameLine[] }} GameCharacter
 * @typedef {{ id: string, title: string, scope: string, characters: GameCharacter[] }} GameStudy
 * @typedef {[string, string, string, string, string, string, string?]} LineSpec id/category/jp/reading/zh/note/pronunciation
 * @typedef {{ skinId: string, characterId: string, skinName: string, jp: string, matchingAssetCount: number }} SelectionSourceRow
 * @typedef {{ characterId: string, candidateAssets: number }} SelectionCandidateCount
 */
import { genshinRoster } from './genshin-character-roster.mjs';
import { genshinQuoteSources } from './genshin-quote-sources.mjs';
import { audioPath, contentHash } from './author.mjs';
import { eternalReturnRoster } from './game-character-roster.mjs';
import { erSelectionAnnotations } from './er-selection-annotations.mjs';
import { erSelectionInventory } from './er-selection-catalog-data.mjs';
import { erSelectionTranscripts } from './er-selection-transcripts.mjs';
import { erSelectionVoiceAnnotations } from './er-selection-voice-annotations.mjs';
const genshinVersion = '49a6544a6c6ae36089cb42fa591fc46f01de8bcf';
const erVersion = 'ea359154465075aa61a668efde014db076820a03';
/** @param {string} game @param {string} id @param {string} name @param {string} nameJa @param {string} voice @param {string} url @param {LineSpec[]} rows @param {'quote'|'practice'} [kind] @returns {GameCharacter} */
function character(game, id, name, nameJa, voice, url, rows, kind = 'quote') {
  return {
    id,
    name,
    nameJa,
    voice,
    referenceUrl: url,
    lines: rows.map(
      ([key, category, jp, reading, zh, note, pronunciation]) => ({
        id: `${game}:${id}:${key}`,
        category,
        kind,
        jp,
        reading,
        zh,
        note,
        voice,
        audio: audioPath(`audio/games/${game}`, 'gram', jp, voice).replace(
          /\.mp3$/,
          `${game === 'genshin' && id === 'bennett' && key === 'skill' ? '-ro-v1' : ''}.mp3`,
        ),
        ...genshinQuoteSources[`${game}:${id}:${key}`],
        referenceUrl: url,
        referenceNote:
          kind === 'practice'
            ? '自行編寫的主題練習，非遊戲台詞；連結僅核對角色名稱。'
            : game === 'er'
              ? '官網連結的日文社群攻略站角色介紹短句；已核對文字，未比對原配音或選角情境。'
              : '固定版本日文角色語音表；依原表的語音情境分類。',
        ...(pronunciation ? { pronunciation } : {}),
      }),
    ),
  };
}
/** @type {GameStudy[]} */
export const gameCharacterStudy = [
  {
    id: 'er',
    title: '永恆輪迴',
    scope: 'selected／selected2 選角台詞，附 VOICEVOX 自製朗讀。',
    characters: [],
  },
  {
    id: 'genshin',
    title: '原神',
    scope:
      '收錄少量已核對的編隊加入、元素技能與元素爆發實際短句；以 VOICEVOX 自製教材音檔，未加入劇情。',
    characters: [
      character(
        'genshin',
        'noelle',
        '諾艾爾',
        'ノエル',
        'hau',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/noelle.json`,
        [
          [
            'join',
            '編隊加入',
            'うれしい…あ、いえ。',
            'うれしい…あ、いえ。',
            '好開心…啊，不，沒什麼。',
            'うれしい後接あ、いえ，表現高興後臨時收回；いえ在此是否定回應。',
          ],
          [
            'skill',
            '元素技能',
            '任せてください。',
            'まかせてください。',
            '請交給我。',
            '任せてください以任せる的て形加ください，禮貌請對方把事情交給自己。',
          ],
          [
            'burst',
            '元素爆發',
            '戦場のお掃除の時間です。',
            'せんじょうの おそうじの じかんです。',
            '該清掃戰場了。',
            '戦場のお掃除以の連接場所與活動；時間です宣告現在是進行該活動的時候。',
          ],
        ],
      ),
      character(
        'genshin',
        'barbara',
        '芭芭拉',
        'バーバラ',
        'tsumugi',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/barbara.json`,
        [
          [
            'join',
            '編隊加入',
            '一緒に頑張ろ！',
            'いっしょに がんばろ！',
            '一起加油吧！',
            '一緒に表示一起；頑張ろ是口語縮短的頑張ろう，邀請一起努力，朗讀保留原句句尾ろ。',
          ],
          [
            'skill',
            '元素技能',
            '元気出してよ！',
            'げんきだしてよ！',
            '打起精神嘛！',
            '元気出して省略了元気を出して的を；て形提出鼓勵，句尾よ加強對對方的呼喚。',
          ],
          [
            'burst',
            '元素爆發',
            '準備できたかな～',
            'じゅんびできたかな～',
            '準備好了嗎～',
            '準備できた省略了準備ができた的が；かな表示自問或柔和確認，不是命令。',
          ],
        ],
      ),
      character(
        'genshin',
        'venti',
        '溫迪',
        'ウェンティ',
        'nemo2',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/venti.json`,
        [
          [
            'join',
            '編隊加入',
            '待たせちゃった？',
            'またせちゃった？',
            '讓你久等了？',
            '待たせちゃった是待たせてしまった的口語縮約；使役形表示讓對方等待，問句帶不好意思的確認語氣。',
          ],
          [
            'skill',
            '元素技能',
            'ここだよ。',
            'ここだよ。',
            '在這裡喔。',
            'ここ是近指場所；だよ是口語斷定加提醒，主語省略，需配合場景理解指的是什麼。',
          ],
          [
            'burst',
            '元素爆發',
            '風だ～',
            'かぜだ～',
            '是風喔～',
            '風だ以名詞加だ作簡短宣告；～表示聲音拉長，風的讀音是かぜ。',
          ],
        ],
      ),
      character(
        'genshin',
        'amber',
        '安柏',
        'アンバー',
        'tsumugi',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/amber.json`,
        [
          [
            'join',
            '編隊加入',
            '任せて！',
            'まかせて！',
            '交給我吧！',
            '任せて是任せる的て形，這裡邀請對方把事情交給自己，不是表示已交付。',
          ],
          [
            'skill',
            '元素技能',
            'ウサギ伯爵、出撃！',
            'ウサギはくしゃく、しゅつげき！',
            '兔兔伯爵，出擊！',
            '出撃是名詞式的簡短號令；伯爵是稱號，不是動詞。',
          ],
        ],
      ),
      character(
        'genshin',
        'bennett',
        '班尼特',
        'ベネット',
        'nemo2',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/bennett.json`,
        [
          [
            'join',
            '編隊加入',
            'すごいなぁ！',
            'すごいなぁ！',
            '真厲害啊！',
            'なぁ在這裡表感嘆，不是辭書形後禁止動作的な；也沒有命令意義。',
            'すごいなあ！',
          ],
          [
            'skill',
            '元素技能',
            '燃えろ！',
            'もえろ！',
            '燃燒吧！',
            '燃えろ是自動詞燃える的命令形；和他動詞燃やす的命令形燃やせ不同。',
          ],
        ],
      ),
      character(
        'genshin',
        'raiden',
        '雷電將軍',
        '雷電将軍',
        'sayo',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/raidenshogun.json`,
        [
          [
            'join',
            '編隊加入',
            '私についてきてください。',
            'わたしに ついてきてください。',
            '請跟著我來。',
            'てください提出禮貌要求；ついてくる表示跟隨而來，不是完成式。',
          ],
          [
            'burst',
            '元素爆發',
            '稲光、すなわち永遠なり。',
            'いなびかり、すなわち えいえん なり。',
            '閃電，即是永恆。',
            'すなわち整理同義關係；なり是文語斷定，近似現代である，帶莊嚴宣言語氣。',
          ],
        ],
      ),
      character(
        'genshin',
        'kaeya',
        '凱亞',
        'ガイア',
        'saehaku',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/kaeya.json`,
        [
          [
            'skill',
            '元素技能',
            'おとなしくしやがれ！',
            'おとなしくしやがれ！',
            '給我老實點！',
            'しやがれ是する加上やがる的命令形，帶粗魯、挑釁語氣；おとなしく表示老實、安分地。',
          ],
          [
            'burst',
            '元素爆發',
            '風邪ひくなよ。',
            'かぜひくなよ。',
            '小心別著涼喔。',
            '風邪ひく省略了風邪をひく的を；動詞辭書形加な表示禁止，よ在此加強提醒。',
          ],
        ],
      ),
      character(
        'genshin',
        'diluc',
        '迪盧克',
        'ディルック',
        'ryusei',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/diluc.json`,
        [
          [
            'join',
            '編隊加入',
            '行こうか。',
            'いこうか。',
            '走吧。',
            '行こう是行く的意志形，加か提出邀請或商量，不是過去式。',
          ],
          [
            'burst',
            '元素爆發',
            '判決を、下す！',
            'はんけつを、くだす！',
            '下達判決！',
            '下す是動詞辭書形，在此宣告將採取的行動；下せ才是命令形。',
            'はんけつお、くだす！',
          ],
        ],
      ),
      character(
        'genshin',
        'keqing',
        '刻晴',
        '刻晴',
        'hau',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/keqing.json`,
        [
          [
            'join',
            '編隊加入',
            '行こう、時間は有限よ。',
            'いこう、じかんは ゆうげんよ。',
            '走吧，時間有限喔。',
            '行こう提出行動邀請；時間は以は提示話題，句尾よ提醒對方時間有限。',
            'いこう、じかんわゆうげんよ。',
          ],
          [
            'skill',
            '元素技能',
            '行けっ！',
            'いけっ！',
            '去吧！',
            '行け是行く的命令形；句尾っ表現短促、強烈的語勢，不改成辭書形行く。',
          ],
        ],
      ),
    ],
  },
];

// 依名冊建立選角教材，不混入其他來源。
const er = gameCharacterStudy.find((game) => game.id === 'er');
if (!er) throw new Error('Missing Eternal Return section');
/** 保留已選配音，角色區僅編排 selected／selected2 來源。 */
const erVoices = /** @type {Record<string, string>} */ ({
  jackie: 'tsumugi',
  aya: 'sayo',
  fiora: 'tsumugi',
  magnus: 'ryusei',
  hyunwoo: 'nemo2',
  yuki: 'nemo2',
  silvia: 'hau',
  rozzi: 'sayo',
  william: 'ryusei',
});
er.characters = eternalReturnRoster.map((row) => ({
  ...row,
  voice: erVoices[row.id] ?? 'saehaku',
  lines: [],
}));
/** @param {import('./er-selection-transcripts.mjs').SelectionTranscript} row */
function selectionEvidenceNote(row) {
  const tail = '細部時機未指定。原配音不公開，教材音檔為 VOICEVOX 自製朗讀。';
  if (row.evidence === 'user')
    return row.officialKey
      ? `使用者已聽本機選角原音確認字面，與固定版本遊戲文字 ${row.officialKey} 一致；${tail}`
      : `逐字稿由使用者聽本機遊戲選角原音確認；${tail}`;
  if (row.evidence === 'official-asr')
    return `字面採固定版本遊戲文字 ${row.officialKey}，並以語音辨識比對本機選角原音一致；尚未經人耳確認，${tail}`;
  if (row.evidence === 'asr-agreement')
    return `逐字稿由兩個語音辨識模型（kotoba-whisper、Whisper small）判讀本機選角原音一致，尚未經人耳確認，可能與原音有出入；${tail}`;
  return `逐字稿是選角原音的語音辨識草稿；兩個模型結果不同，經人工依日文語意整理，尚未經人耳確認，可能與原音有出入；${tail}`;
}
/** @type {SelectionSourceRow[]} */
const selectionRows = erSelectionInventory.officialSelectionRows;
/** @type {SelectionCandidateCount[]} */
const selectionCounts = erSelectionInventory.candidateCounts;
/** @type {Map<string, SelectionSourceRow[]>} */
const selectionByCharacter = new Map();
for (const row of selectionRows) {
  const rows = selectionByCharacter.get(row.characterId) ?? [];
  rows.push(row);
  selectionByCharacter.set(row.characterId, rows);
}
for (const character of er.characters) {
  const inventory = selectionCounts.find(
    (row) => row.characterId === character.id,
  );
  const rows = selectionByCharacter.get(character.id) ?? [];
  const matchedAssets = rows.reduce(
    (total, row) => total + row.matchingAssetCount,
    0,
  );
  if (!inventory || matchedAssets > inventory.candidateAssets)
    throw new Error(`Invalid selection inventory for ${character.id}`);
  const transcripts = erSelectionTranscripts.filter(
    (row) => row.characterId === character.id,
  );
  const voice = character.voice;
  if (!voice) throw new Error(`Missing VOICEVOX choice for ${character.id}`);
  for (const row of rows) {
    if (!row.jp) continue;
    const annotation = Object.entries(erSelectionAnnotations).find(
      ([skinId]) => skinId === row.skinId,
    )?.[1];
    if (!annotation)
      throw new Error(`Missing selection annotation for skin ${row.skinId}`);
    const id = `er:${character.id}:selection:${row.skinId}`;
    const heard = transcripts.some(
      (t) =>
        t.evidence === 'user' &&
        t.officialKey === `Skin/OnSelectVO/${row.skinId}`,
    );
    character.lines.push({
      id,
      category: '角色選擇',
      kind: 'quote',
      sourceTitle: '選角階段',
      variant: row.skinName,
      jp: row.jp,
      reading: annotation.reading,
      zh: annotation.zh,
      note: annotation.note,
      voice,
      audio: audioPath('audio/games/er', 'gram', row.jp, voice),
      referenceUrl: `https://github.com/pypy-vrc/er-gamedata/blob/${erVersion}/l10n/Japanese.txt`,
      referenceNote: heard
        ? '固定版本遊戲資料將此句列為 Skin/OnSelectVO，使用者已聽本機選角原音確認字面；點選或鎖定等細部時機未指定。原配音不公開，教材音檔為 VOICEVOX 自製朗讀。'
        : '固定版本遊戲資料將此句列為 Skin/OnSelectVO，機器辨識對應本機選角原音，人耳確認待完成；細部時機未指定。原配音不公開，教材音檔為 VOICEVOX 自製朗讀。',
      pronunciation: annotation.pronunciation,
      selectionAssetCount: row.matchingAssetCount,
    });
  }
  const official = new Set(rows.map((row) => `Skin/OnSelectVO/${row.skinId}`));
  for (const row of transcripts) {
    if (row.officialKey && official.has(row.officialKey)) continue;
    const annotation = erSelectionVoiceAnnotations[row.jp];
    // Lines stay out of the lessons until their reading, translation and note are written;
    // tests/game-study.test.mjs lists the missing ones.
    if (!annotation) continue;
    const id = `er:${character.id}:selection-voice:${contentHash(row.jp)}`;
    character.lines.push({
      id,
      category: '角色選擇',
      kind: 'quote',
      sourceTitle: '選角階段',
      variant: row.skinNames.join('、'),
      jp: row.jp,
      reading: annotation.reading,
      zh: annotation.zh,
      note: annotation.note,
      voice,
      audio: audioPath('audio/games/er', 'gram', row.jp, voice),
      referenceUrl: row.officialKey
        ? `https://github.com/pypy-vrc/er-gamedata/blob/${erVersion}/l10n/Japanese.txt`
        : `https://github.com/pypy-vrc/er-gamedata/blob/${erVersion}/data/CharacterSkin.json`,
      referenceNote: selectionEvidenceNote(row),
      ...(annotation.ruby ? { ruby: annotation.ruby } : {}),
      pronunciation: annotation.pronunciation,
      selectionAssetCount: row.clipCount,
    });
  }
}
const selectionLineCount = er.characters.reduce(
  (total, c) => total + c.lines.filter((l) => l.category === '角色選擇').length,
  0,
);
er.scope = `91 位角色的 selected／selected2 來源共 316 段，261 段有台詞，整理為 ${selectionLineCount} 句教材；55 段笑聲／喘氣僅列索引。可播放音檔皆為 VOICEVOX 自製朗讀，非遊戲原配音。未加入其他情境或資料練習。`;
const genshin = gameCharacterStudy.find((game) => game.id === 'genshin');
if (!genshin) throw new Error('Missing Genshin section');
const knownGenshin = new Map(genshin.characters.map((c) => [c.id, c]));
genshin.characters = genshinRoster.map((row) => ({
  ...row,
  ...(knownGenshin.get(row.id) ?? { lines: [] }),
  portrait: row.portrait,
  portraitReferenceUrl: row.portraitReferenceUrl,
}));
genshin.scope =
  '固定來源名冊共 124 筆角色條目，包含旅行者與人偶的不同版本。六位角色收錄 12 句已核對短台詞與自製 VOICEVOX 音檔；其餘角色尚待收錄，未加入劇情。';
