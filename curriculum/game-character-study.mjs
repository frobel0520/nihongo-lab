/**
 * 角色短句與原創主題練習。作品短句僅選少量核對用例；不宣稱完整台詞庫。
 * ER 原創練習與社群角色介紹短句分開，不把介紹短句當成已核對的選角語音。
 * @typedef {import('./lessons.mjs').Line & { id: string, category: string, kind: 'quote' | 'practice', note: string, referenceUrl: string, referenceNote: string, pronunciation?: string }} GameLine
 * @typedef {{ id: string, name: string, nameJa: string, voice?: string, referenceUrl: string, portrait?: string, portraitReferenceUrl?: string, lines: GameLine[] }} GameCharacter
 * @typedef {{ id: string, title: string, scope: string, characters: GameCharacter[] }} GameStudy
 * @typedef {[string, string, string, string, string, string, string?]} LineSpec id/category/jp/reading/zh/note/pronunciation
 */
import { audioPath } from './author.mjs';
import { eternalReturnRoster } from './game-character-roster.mjs';
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
        audio: audioPath(`audio/games/${game}`, 'gram', jp, voice),
        referenceUrl: url,
        referenceNote:
          kind === 'practice'
            ? '自行編寫的主題練習，非遊戲台詞；連結僅核對角色名稱。'
            : game === 'lol'
              ? 'LoLJPWiki 日文台詞表；是社群紀錄，未聲稱逐句比對現行遊戲版本。'
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
    id: 'lol',
    title: '英雄聯盟',
    scope:
      '首批三位角色的選擇與攻擊短句，預設造型；其他角色、造型與互動待擴充。',
    characters: [
      character(
        'lol',
        'ahri',
        '阿璃',
        'アーリ',
        'hau',
        'https://www.loljp-wiki.jp/wiki/?Champion/Ahri',
        [
          [
            'select',
            '角色選擇',
            '私を捕まえられる？',
            'あたしを つかまえられる？',
            '你抓得到我嗎？',
            'られる在這裡是可能形，以問句挑戰對方能否做到；不是被動描述。私依來源讀あたし。',
            'あたしおつかまえられる？',
          ],
          [
            'attack',
            '攻擊',
            'もう逃がさない',
            'もう にがさない',
            '不會再讓你逃走。',
            'ない否定放走的行動；もう與否定連用可表示不再做某事，不是禁止形。',
            'もうにがさない',
          ],
        ],
      ),
      character(
        'lol',
        'yasuo',
        '犽宿',
        'ヤスオ',
        'saehaku',
        'https://www.loljp-wiki.jp/wiki/?Champion/Yasuo',
        [
          [
            'select',
            '角色選擇',
            '死は風の如し……いつも傍らにあるものよ……',
            'しは かぜの ごとし……いつも かたわらに あるものよ……',
            '死亡如風……總在身旁……',
            '如し是文語的比喻，近似現代的ようだ；不是角色已經死亡的陳述。',
            'しわかぜのごとし……いつもかたわらにあるものよ……',
          ],
          [
            'attack',
            '攻擊',
            '逃がさん',
            'にがさん',
            '休想逃走。',
            '逃がす表示放走；此處さん是さない的較古風否定，不是稱呼人的敬稱。',
          ],
        ],
      ),
      character(
        'lol',
        'lux',
        '拉克絲',
        'ラックス',
        'tsumugi',
        'https://www.loljp-wiki.jp/wiki/?Champion/Lux',
        [
          [
            'select',
            '角色選擇',
            '戦場に瞬く光！ それが私よ',
            'せんじょうに またたく ひかり！ それが わたしよ',
            '戰場上閃耀的光！那就是我。',
            '瞬く光由動詞修飾名詞；それが私よ用が指出那個身分就是自己。',
          ],
          [
            'attack',
            '攻擊',
            '闇を焼き払え！',
            'やみを やきはらえ！',
            '燒盡黑暗！',
            '焼き払え是焼き払う的命令形；複合動詞表示把目標燒除，不只是一般燃燒。',
            'やみおやきはらえ！',
          ],
        ],
      ),
    ],
  },
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
      '首批三位角色的編隊加入與技能短句；編隊加入和英雄聯盟的選角情境分開，其他角色待擴充。',
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
    ],
  },
];

// 以角色名冊補齊頭像；只有已有核對教材的角色保留 lines，其他明示待收錄。
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
  character('er', 'silvia', '希爾維婭', 'シルヴィア', 'hau', `${erProfileSource}#Silvia`, [
    [
      'profile',
      '角色介紹短句',
      'ワオ、それ面白そうじゃん！！',
      'ワオ、それ おもしろそうじゃん！！',
      '哇，那看起來很有趣嘛！！',
      '形容詞去い＋そう表示看起來如此；這裡的じゃん是じゃない的口語說法，用來表達發現或認同，不是否定有趣。沒有單靠此句推定遊戲觸發情境。',
    ],
  ]),
  character('er', 'william', '威廉', 'ウィリアム', 'ryusei', `${erProfileSource}#William`, [
    [
      'profile',
      '角色介紹短句',
      'もう手加減はしない',
      'もう てかげんは しない',
      '我不會再手下留情。',
      '手加減する表示控制力道或放水；は將手下留情作為話題，もう與否定連用表示不再這麼做。這不是要求對方手下留情。',
      'もうてかげんわしない',
    ],
  ]),
  character('er', 'magnus', '馬格努斯', 'マグヌス', 'ryusei', `${erProfileSource}#Magnus`, [
    [
      'profile',
      '角色介紹短句',
      '伝説のバイカーマグヌスとはこの俺様のことだ。',
      'でんせつの バイカーマグヌスとは この おれさまの ことだ。',
      '傳說中的摩托車騎士馬格努斯，說的就是本大爺。',
      '名詞＋とは在此提出要解釋的稱號；この俺様のことだ指出那就是自己。俺様是自大的自稱，帶誇耀語氣。バイカー指騎摩托車的人。',
      'でんせつのバイカーマグヌストワこのおれさまのことだ。',
    ],
  ]),
  character('er', 'fiora', '菲歐拉', 'フィオラ', 'tsumugi', `${erProfileSource}#Fiora`, [
    [
      'profile',
      '角色介紹短句',
      '首！ 腰！ 姿勢がなってないわよ！',
      'くび！ こし！ しせいが なってないわよ！',
      '脖子！腰！你的姿勢不像樣喔！',
      'なってない是なっていない的口語縮約；姿勢がなっていない批評姿勢不到位。わよ在此加強提醒或責備，不能只按字面理解成沒有變成某物。',
      'くび！こし！しせいがなってないわよ！',
    ],
  ]),
  character('er', 'rozzi', '洛茲', 'ロッジ', 'sayo', `${erProfileSource}#Rozzi`, [
    [
      'profile',
      '角色介紹短句',
      'おつかれ。',
      'おつかれ。',
      '辛苦了。',
      'おつかれ是お疲れ様的簡短口語招呼，可用來慰勞或道別；單憑這句不能判斷遊戲中的觸發情境。對陌生人或正式場合宜使用完整禮貌說法。',
    ],
  ]),
);
const existing = new Map(
  er.characters.map((character) => [character.id, character]),
);
er.characters = eternalReturnRoster.map((row) => ({
  ...row,
  ...existing.get(row.id),
  portrait: row.portrait,
  portraitReferenceUrl: row.portraitReferenceUrl,
  lines: existing.get(row.id)?.lines ?? [],
}));
er.scope =
  '角色名冊與預設造型頭像收錄 91 位（固定版本）。三位角色有原創主題練習，另六位各有一句社群角色介紹短句；82 位語音待補。介紹短句未核對原配音或選角情境，未收錄劇情。';
for (const game of gameCharacterStudy) {
  if (game.id === 'er') continue;
  for (const character of game.characters) {
    character.portrait = `game-portraits/${game.id}-${character.id}.${game.id === 'lol' ? 'jpg' : 'png'}`;
    if (game.id === 'lol') {
      const champion = /** @type {Record<string, string>} */ ({
        ahri: 'Ahri',
        yasuo: 'Yasuo',
        lux: 'Lux',
      })[character.id];
      character.portraitReferenceUrl = `https://www.loljp-wiki.jp/wiki/image/champ/80/ico_${champion}.jpg`;
    } else {
      const key = /** @type {Record<string, string>} */ ({
        amber: 'ambor',
        bennett: 'bennett',
        raiden: 'shougun',
      })[character.id];
      character.portraitReferenceUrl = `https://github.com/kgirtxd/Genshin-Assets/blob/acfdf5d1676a7034b0bbdb1177015950833837e3/CharacterIcon/${key}_icon.png`;
    }
  }
}
