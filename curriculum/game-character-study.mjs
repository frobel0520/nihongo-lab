/**
 * 角色短句與原創主題練習。作品短句僅選少量核對用例；不宣稱完整台詞庫。
 * ER 原創練習與社群角色介紹短句分開，不把介紹短句當成已核對的選角語音。
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
import { createErReferenceCharacter } from './game-character-reference.mjs';
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
    scope:
      '首批三位角色的原創主題練習。遊戲原句、角色選擇及造型語音尚待查證，未收錄劇情。',
    characters: [
      character(
        'er',
        'jackie',
        '傑琪',
        'ジャッキー',
        'tsumugi',
        `https://github.com/pypy-vrc/er-gamedata/blob/${erVersion}/l10n/Japanese.txt`,
        [
          [
            'prepare',
            '主題練習',
            '刃を研いでおこう。',
            'はを といでおこう。',
            '先把刀刃磨好吧。',
            'ておこう來自ておく的意志形，表達預先準備；此句為自行編寫，不代表角色說過。',
            'はおといでおこう。',
          ],
          [
            'pursue',
            '主題練習',
            '敵を追い詰めろ。',
            'てきを おいつめろ。',
            '把敵人逼到無路可退。',
            '追い詰めろ是追い詰める的命令形；不等於只是追在後面。此句為自行編寫。',
            'てきおおいつめろ。',
          ],
        ],
        'practice',
      ),
      character(
        'er',
        'aya',
        '綾',
        'アヤ',
        'sayo',
        `https://github.com/pypy-vrc/er-gamedata/blob/${erVersion}/l10n/Japanese.txt`,
        [
          [
            'aim',
            '主題練習',
            '狙いを定めて。',
            'ねらいを さだめて。',
            '瞄準目標。',
            '句尾て形可提出較簡短的要求；不因沒有命令形就變成動作已完成。此句為自行編寫。',
            'ねらいおさだめて。',
          ],
          [
            'protect',
            '主題練習',
            '仲間を守ります。',
            'なかまを まもります。',
            '我會保護同伴。',
            'ます是禮貌形式；這裡可表意圖，不表示動作已完成。此句為自行編寫。',
            'なかまおまもります。',
          ],
        ],
        'practice',
      ),
      character(
        'er',
        'hyunwoo',
        '玹雨',
        'ヒョヌ',
        'nemo2',
        `https://github.com/pypy-vrc/er-gamedata/blob/${erVersion}/l10n/Japanese.txt`,
        [
          [
            'resolve',
            '主題練習',
            'まだ倒れるわけにはいかない。',
            'まだ たおれる わけには いかない。',
            '我還不能倒下。',
            'わけにはいかない強調情勢或責任不允許，不一定是身體能力不足。此句為自行編寫。',
            'まだたおれるわけにわいかない。',
          ],
          [
            'stand',
            '主題練習',
            'もう一度、立ち上がる。',
            'もういちど、たちあがる。',
            '再一次站起來。',
            '辭書形在這裡表達將採取的行動；不是た形的過去陳述。此句為自行編寫。',
          ],
        ],
        'practice',
      ),
    ],
  },
  {
    id: 'genshin',
    title: '原神',
    scope:
      '收錄少量已核對的編隊加入、元素技能與元素爆發實際短句；以 VOICEVOX 自製教材音檔，未加入劇情。',
    characters: [
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

// 合併角色名冊與既有教材；其餘82位使用已核對的角色／武器資料教材。
const er = gameCharacterStudy.find((game) => game.id === 'er');
if (!er) throw new Error('Missing Eternal Return section');
const erProfileSource = 'https://asatamin-eternalreturn.com/characterlist/';
er.characters.push(
  character('er', 'yuki', '雪', '雪', 'nemo2', `${erProfileSource}#Yuki`, [
    [
      'profile',
      '角色介紹短句',
      '何か、僕にできることはないでしょうか。',
      'なにか、ぼくに できることは ないでしょうか。',
      '有什麼我能做的事嗎？',
      'できること以可能形修飾名詞，表示能做的事。ないでしょうか在此委婉詢問是否有能幫忙的事，不是斷定自己什麼都做不到。僕是男性常用的自稱。',
      'なにか、ぼくにできることわないでしょうか。',
    ],
  ]),
  character(
    'er',
    'silvia',
    '希爾維婭',
    'シルヴィア',
    'hau',
    `${erProfileSource}#Silvia`,
    [
      [
        'profile',
        '角色介紹短句',
        'ワオ、それ面白そうじゃん！！',
        'ワオ、それ おもしろそうじゃん！！',
        '哇，那看起來很有趣嘛！！',
        '形容詞去い＋そう表示看起來如此；這裡的じゃん是じゃない的口語說法，用來表達發現或認同，不是否定有趣。沒有單靠此句推定遊戲觸發情境。',
      ],
    ],
  ),
  character(
    'er',
    'william',
    '威廉',
    'ウィリアム',
    'ryusei',
    `${erProfileSource}#William`,
    [
      [
        'profile',
        '角色介紹短句',
        'もう手加減はしない',
        'もう てかげんは しない',
        '我不會再手下留情。',
        '手加減する表示控制力道或放水；は將手下留情作為話題，もう與否定連用表示不再這麼做。這不是要求對方手下留情。',
        'もうてかげんわしない',
      ],
    ],
  ),
  character(
    'er',
    'magnus',
    '馬格努斯',
    'マグヌス',
    'ryusei',
    `${erProfileSource}#Magnus`,
    [
      [
        'profile',
        '角色介紹短句',
        '伝説のバイカーマグヌスとはこの俺様のことだ。',
        'でんせつの バイカーマグヌスとは この おれさまの ことだ。',
        '傳說中的摩托車騎士馬格努斯，說的就是本大爺。',
        '名詞＋とは在此提出要解釋的稱號；この俺様のことだ指出那就是自己。俺様是自大的自稱，帶誇耀語氣。バイカー指騎摩托車的人。',
        'でんせつのバイカーマグヌストワこのおれさまのことだ。',
      ],
    ],
  ),
  character(
    'er',
    'fiora',
    '菲歐拉',
    'フィオラ',
    'tsumugi',
    `${erProfileSource}#Fiora`,
    [
      [
        'profile',
        '角色介紹短句',
        '首！ 腰！ 姿勢がなってないわよ！',
        'くび！ こし！ しせいが なってないわよ！',
        '脖子！腰！你的姿勢不像樣喔！',
        'なってない是なっていない的口語縮約；姿勢がなっていない批評姿勢不到位。わよ在此加強提醒或責備，不能只按字面理解成沒有變成某物。',
        'くび！こし！しせいがなってないわよ！',
      ],
    ],
  ),
  character(
    'er',
    'rozzi',
    '洛茲',
    'ロッジ',
    'sayo',
    `${erProfileSource}#Rozzi`,
    [
      [
        'profile',
        '角色介紹短句',
        'おつかれ。',
        'おつかれ。',
        '辛苦了。',
        'おつかれ是お疲れ様的簡短口語招呼，可用來慰勞或道別；單憑這句不能判斷遊戲中的觸發情境。對陌生人或正式場合宜使用完整禮貌說法。',
      ],
    ],
  ),
);
const existing = new Map(
  er.characters.map((character) => [character.id, character]),
);
er.characters = eternalReturnRoster.map((row) => ({
  ...row,
  ...(existing.get(row.id) ?? createErReferenceCharacter(row)),
  portrait: row.portrait,
  portraitReferenceUrl: row.portraitReferenceUrl,
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
/** 本機 VOICEVOX 引擎沒有的聲線：這些角色的選角句先提供文字，音檔待有 Nemo 引擎時再產製。 */
const pendingSelectionVoices = new Set(['nemo2']);
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
      ...(pendingSelectionVoices.has(voice) ? { audioReady: false } : {}),
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
      ...(pendingSelectionVoices.has(voice) ? { audioReady: false } : {}),
    });
  }
}
const selectionLineCount = er.characters.reduce(
  (total, c) => total + c.lines.filter((l) => l.category === '角色選擇').length,
  0,
);
er.scope = `91 位角色都有教材。82 位各有武器詞彙與資料句型，依固定版本遊戲資料編寫，非角色原台詞；另有六位介紹短句、三位原創練習，以及 ${selectionLineCount} 句角色選擇台詞（字面取自遊戲文字或選角原音的語音辨識，每句標明依據；教材音檔為 VOICEVOX 自製朗讀）。未加入劇情。`;
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
