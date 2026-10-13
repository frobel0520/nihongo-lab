/**
 * 角色語音教材；ER 僅使用 selected／selected2 來源，不混入武器資料或自編練習。
 * 原音索引與 VOICEVOX 教材音檔分開，不宣稱已公開遊戲原音。
 * @typedef {import('./lessons.mjs').Line & { id: string, category: string, kind: 'quote' | 'practice' | 'reference', note: string, referenceUrl: string, referenceNote: string, voicelineId?: number, sourceTitle?: string, voicefile?: string, variant?: string, pronunciation?: string, audioReady?: boolean, selectionAssetCount?: number, officialSources?: ReadonlyArray<Readonly<import('./er-fankit-selection.mjs').FankitSource>> }} GameLine
 * @typedef {{ id: string, name: string, nameJa: string, voice?: string, referenceUrl: string, portrait?: string, portraitReferenceUrl?: string, voiceReferenceUrl?: string, lines: GameLine[] }} GameCharacter
 * @typedef {{ id: string, title: string, scope: string, characters: GameCharacter[] }} GameStudy
 * @typedef {[string, string, string, string, string, string, (string | undefined)?, (string | undefined)?]} LineSpec id/category/jp/reading/zh/note/pronunciation/ruby
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
import { erFankitSources, erFankitTotals } from './er-fankit-selection.mjs';
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
      ([key, category, jp, reading, zh, note, pronunciation, ruby]) => ({
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
        ...(ruby ? { ruby } : {}),
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
character("genshin",
"arlecchino",
"阿蕾奇諾",
"アルレッキーノ",
"sayo",
`https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/arlecchino.json`,
[
  [
    "join",
    "編隊加入",
    "安心して任せたまえ。",
    "あんしんして まかせたまえ。",
    "放心交給我吧。",
    "「安心して」由「安心する」變化而來，表示放心地做某事；「任せたまえ」用較古雅的命令表現請對方交給自己處理。",
    "あんしんしてまかせたまえ"
  ],
  [
    "skill",
    "元素技能",
    "貫こう。",
    "つらぬこう。",
    "貫徹到底吧。",
    "「貫こう」是「貫く」的意向形，表示說話者提議貫徹或穿過某事物。",
    "つらぬこう"
  ],
  [
    "burst",
    "元素爆發",
    "月のように永遠なれ。",
    "つきのように えいえんなれ。",
    "願如月亮般永恆。",
    "「月のように」用「ように」作比喻；「永遠なれ」以文語命令形表達祝願，近似「永遠であれ」。",
    "つきのようにえいえんなれ"
  ]
]),

character("genshin",
"charlotte",
"夏洛蒂",
"シャルロット",
"tsumugi",
`https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/charlotte.json`,
[
  [
    "join",
    "編隊加入",
    "近づけば近づくほど、報道の真実味が増す。",
    "ちかづけば ちかづくほど、ほうどうの しんじつみが ます。",
    "越接近，報導就越有真實感。",
    "「近づけば近づくほど」是ば形搭配「ほど」，表示越……越……；「真実味が増す」表示真實感增強。",
    "ちかづけばちかづくほどほうどうのしんじつみがます"
  ],
  [
    "skill",
    "元素技能",
    "はい、チーズ。",
    "はい、チーズ。",
    "好，說茄子！",
    "「はい」用於招呼或提示；「チーズ」是日本拍照時常用的口令，提示被拍者露出笑容。",
    "はいちーず"
  ],
  [
    "burst",
    "元素爆發",
    "シャルロットが、報道します！",
    "しゃるろっとが、ほうどうします！",
    "由夏洛蒂來報導！",
    "「シャルロットが」以「が」標示動作主體；「報道します」是「報道する」的禮貌形，表示將進行報導。",
    "しゃるろっとがほうどうします"
  ]
]),

character("genshin",
"chasca",
"恰斯卡",
"チャスカ",
"sayo",
`https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/chasca.json`,
[
  [
    "join",
    "編隊加入",
    "行こう、弾は装填した。",
    "いこう、たまは そうてんした。",
    "走吧，子彈已經裝填好了。",
    "「行こう」是「行く」的意向形，表示一起前往；「弾は」提出子彈作為主題；「装填した」表示已裝好彈藥。",
    "いこうたまわそうてんした"
  ],
  [
    "skill",
    "元素技能",
    "風が立つぞ。",
    "かぜが たつぞ。",
    "起風了。",
    "「風が」指出風作為主題；「風が立つ」表示風起；句尾「ぞ」是男性口語的強調語氣。",
    "かぜがたつぞ"
  ],
  [
    "burst",
    "元素爆發",
    "消え失せろ。",
    "きえ うせろ。",
    "給我消失！",
    "「消え失せろ」是「消え失せる」的命令形，帶強烈、粗獷的驅逐語氣。",
    "きえうせろ"
  ]
]),

      character(
        'genshin',
        'aratakiitto',
        '荒瀧一斗',
        '荒瀧一斗',
        'ryusei',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/aratakiitto.json`,
        [
          [
            'join',
            '編隊加入',
            'これしきのこと、俺様が解決してやる！',
            'これしきのこと、おれさまが かいけつして やる！',
            '這點小事，就由本大爺來解決！',
            '「これしきのこと」表示這點程度的小事；「俺様が」強調由我出手；「解決してやる」用て形加やる，帶出替對方解決事情的豪邁口氣。',
            'これしきのことおれさまがかいけつしてやる',
          ],
          [
            'skill',
            '元素技能',
            'お前の出番だぜ！',
            'おまえの でばんだぜ！',
            '輪到你上場了！',
            '「お前」是親暱或粗獷的你；「出番」是上場的時機；句尾だぜ帶男性口語的強調語氣。',
            'おまえのでばんだぜ',
          ],
          [
            'burst',
            '元素爆發',
            '俺様に任せろ！',
            'おれさまに まかせろ！',
            '交給本大爺！',
            '「俺様に」指出應交託的對象；「任せろ」是任せる的命令形，要求對方把事情交給自己。',
            'おれさまにまかせろ',
          ],
        ],
      ),

      character(
        'genshin',
        'baizhu',
        '白朮',
        '白朮',
        'saehaku',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/baizhu.json`,
        [
          [
            'join',
            '編隊加入',
            '傷ならば私が手当てしましょう。',
            'きずならば わたしが てあてしましょう。',
            '如果是傷口，就由我來處理吧。',
            '「傷ならば」用ならば提出假設條件；「私が」指出由我處理；「手当てしましょう」是手当てする的意向形，提出主動照料。',
            'きずならばわたしがてあてしましょう',
          ],
          [
            'skill',
            '元素技能',
            '良薬は口に苦し。',
            'りょうやくは くちに にがし。',
            '良藥苦口。',
            '「良薬は口に苦し」是諺語；「苦し」是表示苦的文語形容詞，整句以簡潔形式陳述良藥通常難以下嚥。',
            'りょうやくわくちににがし',
            '{良薬|りょうやく}は{口|くち}に{苦|にが}し。',
          ],
          [
            'burst',
            '元素爆發',
            'すぐに治してあげましょう。',
            'すぐに なおして あげましょう。',
            '我馬上替你治療吧。',
            '「治してあげる」由治す的て形加あげる，表示為對方治療；「ましょう」用禮貌形式提出意願。',
            'すぐになおしてあげましょう',
          ],
        ],
      ),

      character(
        'genshin',
        'candace',
        '坎蒂絲',
        'キャンディス',
        'sayo',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/candace.json`,
        [
          [
            'join',
            '編隊加入',
            'あなたの安全は私が保証します。',
            'あなたの あんぜんは わたしが ほしょうします。',
            '你的安全由我來保證。',
            '「あなたの安全は」提出你的安全作主題；「私が」強調由我負責；「保証します」是保證的禮貌說法。',
            'あなたのあんぜんわわたしがほしょうします',
          ],
          [
            'skill',
            '元素技能',
            'いらっしゃい！',
            'いらっしゃい！',
            '歡迎光臨！',
            '「いらっしゃい」是「いらっしゃる」的命令形，也常單獨用作歡迎客人的招呼語；此處結合戰鬥情境，也可帶迎接對手的語氣。',
            'いらっしゃい',
          ],
          [
            'burst',
            '元素爆發',
            '我らに祝福あれ！',
            'われらに しゅくふく あれ！',
            '願祝福降臨我們身上！',
            '「我らに」指出祝福所及的對象；「祝福あれ」使用文語「あれ」表達祝願，意思近於「願有祝福」。',
            'われらにしゅくふくあれ',
          ],
        ],
      ),

      character(
        'genshin',
        'aether',
        '空',
        '空',
        'nemo2',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/aether.json`,
        [
          [
            'join',
            '編隊加入',
            '世界は、謎だらけだ…',
            'せかいは、なぞだらけだ…',
            '世界充滿了謎團……',
            '「世界は」提出主題；「謎だらけ」表示到處都是謎，だらけ接名詞時可表示充滿某種事物。',
            'せかいわなぞだらけだ',
          ],
          [
            'skill',
            '元素技能',
            '落ちろ！',
            'おちろ！',
            '落下吧！',
            '「落ちろ」是自動詞「落ちる」的命令形，要求對象落下；這裡省略動作主體。',
            'おちろ',
          ],
          [
            'burst',
            '元素爆發',
            '風と共に去れ！',
            'かぜ ともに され！',
            '隨風而逝吧！',
            '「風と共に」表示與風一起；「去れ」是去る的命令形，要求對方離去。',
            'かぜとともにされ',
          ],
        ],
      ),

      character(
        'genshin',
        'alhaitham',
        '艾爾海森',
        'アルハイゼン',
        'saehaku',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/alhaitham.json`,
        [
          [
            'join',
            '編隊加入',
            '何か用か？',
            'なにか ようか？',
            '有什麼事嗎？',
            '「何か」表示某件事或什麼；「用か」是在問有事找自己嗎，句尾か形成直接疑問。',
            'なにかようか',
          ],
          [
            'skill',
            '元素技能',
            'もらった。',
            'もらった。',
            '得手了。',
            '「もらった」是もらう的過去形；在戰鬥中可作成功取得先機或命中對手的簡短宣告，省略受詞。',
            'もらった',
          ],
          [
            'burst',
            '元素爆發',
            '散乱。',
            'さんらん。',
            '散亂。',
            '「散乱」表示散開而凌亂；名詞單獨作戰鬥宣告，省略後面的動詞。',
            'さんらん',
          ],
        ],
      ),

      character(
        'genshin',
        'aloy',
        '亞蘿伊',
        'アーロイ',
        'sayo',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/aloy.json`,
        [
          [
            'join',
            '編隊加入',
            '手を貸そうか？',
            'てを かそうか？',
            '要我幫忙嗎？',
            '「手を貸す」是幫忙的慣用說法；「貸そうか」由貸す的意向形加か，提出是否要出手幫忙。',
            'ておかそうか',
          ],
          [
            'skill',
            '元素技能',
            '爆発するよ。',
            'ばくはつするよ。',
            '要爆炸囉。',
            '「爆発する」由名詞爆発加する構成動詞；句尾よ告知對方即將發生的事。',
            'ばくはつするよ',
          ],
          [
            'burst',
            '元素爆發',
            '拘束する！',
            'こうそくする！',
            '束縛住你！',
            '「拘束する」表示限制對方行動；名詞加する構成動詞，句尾在此作戰鬥宣告。',
            'こうそくする',
          ],
        ],
      ),

      character(
        'genshin',
        'albedo',
        '阿貝多',
        'アルベド',
        'saehaku',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/albedo.json`,
        [
          [
            'join',
            '編隊加入',
            '一緒に探索しよう。',
            'いっしょに たんさくしよう。',
            '一起去探索吧。',
            '「一緒に」表示一起；「探索しよう」是探索する的意向形，邀請對方共同探索。',
            'いっしょにたんさくしよう',
          ],
          [
            'skill',
            '元素技能',
            '咲け。',
            'さけ。',
            '綻放吧。',
            '「咲け」是咲く的命令形；在戰鬥語境以開花的動作作簡短號令。',
            'さけ',
          ],
          [
            'burst',
            '元素爆發',
            '偉業を見届けよ。',
            'いぎょうを みとどけよ。',
            '見證這項偉業吧。',
            '「偉業を」是要見證的對象；「見届けよ」是見届ける的書面語命令形，要求對方看到事情的結果。',
            'いぎょうおみとどけよ',
          ],
        ],
      ),

      character(
        'genshin',
        'beidou',
        '北斗',
        '北斗',
        'tsumugi',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/beidou.json`,
        [
          [
            'join',
            '編隊加入',
            'あんたを信じるよ。',
            'あんたを しんじるよ。',
            '我相信你。',
            '「あんた」是你，比あなた隨意，須留意關係與場合；「信じる」表示相信，句尾よ傳達自己的態度。',
            'あんたおしんじるよ',
          ],
          [
            'skill',
            '元素技能',
            '全部返してやる！',
            'ぜんぶ かえしてやる！',
            '全都奉還給你！',
            '「全部」表示全部；「返してやる」由返す的て形加やる，在這裡以粗獷語氣宣告把攻擊還給對方。',
            'ぜんぶかえしてやる',
          ],
          [
            'burst',
            '元素爆發',
            'よく見ておけ！',
            'よく みておけ！',
            '給我看清楚！',
            '「よく」在這裡表示仔細；「見ておけ」由見る的て形加おく，再用命令形おけ，要求對方仔細看著並記住。',
            'よくみておけ',
          ],
        ],
      ),

      character(
        'genshin',
        'razor',
        '雷澤',
        'レザー',
        'neko-vy',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/razor.json`,
        [
          [
            'join',
            '編隊加入',
            'オレが行く。',
            'オレが いく。',
            '由我前往。',
            '「オレ」是較粗獷的第一人稱；が強調由我行動；「行く」用辭書形宣告接下來要去。',
            'おれがいく',
          ],
          [
            'skill',
            '元素技能',
            '来るなッ！',
            'くるなっ！',
            '別過來！',
            '「来るな」由動詞辭書形加な，表示強烈禁止；ッ保留原來源的收尾記法。',
            'くるなっ',
          ],
          [
            'burst',
            '元素爆發',
            '貫け…！',
            'つらぬけ…！',
            '貫穿吧……！',
            '「貫け」是貫く的命令形，在戰鬥中作貫穿目標的號令；省略的對象不補寫進日文台詞。',
            'つらぬけ',
          ],
        ],
      ),

      character(
        'genshin',
        'jean',
        '琴',
        'ジン',
        'sayo',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/jean.json`,
        [
          [
            'join',
            '編隊加入',
            'いつでも出発できる。',
            'いつでも しゅっぱつできる。',
            '隨時都能出發。',
            '「いつでも」表示任何時候都可以；「出発できる」是出発する的可能表達，說明已經能夠出發。',
            'いつでもしゅっぱつできる',
          ],
          [
            'skill',
            '元素技能',
            'いざ…勝負！',
            'いざ…しょうぶ！',
            '來吧……一決勝負！',
            '「いざ」是準備採取行動時的號召；「勝負」單獨作戰鬥宣告，省略後面的動詞。',
            'いざしょうぶ',
          ],
          [
            'burst',
            '元素爆發',
            '剣に誓う！',
            'けんに ちかう！',
            '以劍起誓！',
            '「剣に」用に標示誓言所寄託的對象；「誓う」表示發誓，辭書形在這裡作當場宣告。',
            'けんにちかう',
          ],
        ],
      ),

      character(
        'genshin',
        'klee',
        '可莉',
        'クレー',
        'hau',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/klee.json`,
        [
          [
            'join',
            '編隊加入',
            'クレーが手伝うよ！',
            'クレーが てつだうよ！',
            '可莉來幫忙喔！',
            '「クレーが」用が指出提供幫助的人；「手伝う」表示幫忙，句尾よ告知對方自己的打算。',
            'くれーがてつだうよ',
          ],
          [
            'skill',
            '元素技能',
            '弾けろ！',
            'はじけろ！',
            '炸開吧！',
            '「弾けろ」是弾ける的命令形；這裡結合爆彈情境表示炸開，不是他動詞的把某物彈走。',
            'はじけろ',
          ],
          [
            'burst',
            '元素爆發',
            '火力全開！',
            'かりょくぜんかい！',
            '火力全開！',
            '「火力」表示攻擊或燃燒的力量；「全開」表示全部開啟。整句以名詞片語宣告全力出擊。',
            'かりょくぜんかい',
          ],
        ],
      ),

      character(
        'genshin',
        'diona',
        '迪奧娜',
        'ディオナ',
        'neko-vy',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/diona.json`,
        [
          [
            'join',
            '編隊加入',
            'フン、あたしに任せなさい。',
            'フン、あたしに まかせなさい。',
            '哼，交給我吧。',
            '「あたしに」指出交託的對象；「任せなさい」由任せる的ます形去掉ます加なさい，帶要求對方交給自己處理的語氣。',
            'ふんあたしにまかせなさい',
          ],
          [
            'skill',
            '元素技能',
            'あたしを甘く見ないで！',
            'あたしを あまく みないで！',
            '別小看我！',
            '「甘く見る」表示輕視；「見ないで」用ないで要求對方不要做這個動作，整句要求別小看自己。',
            'あたしおあまくみないで',
          ],
          [
            'burst',
            '元素爆發',
            '反省しなさい、酔っぱらいさん！',
            'はんせいしなさい、よっぱらいさん！',
            '好好反省吧，醉鬼先生！',
            '「反省しなさい」由反省する的ます形去掉ます加なさい，要求對方反省。「酔っぱらいさん」是帶さん的呼稱，這裡帶揶揄語氣。',
            'はんせいしなさいよっぱらいさん',
          ],
        ],
      ),

      character(
        'genshin',
        'xiangling',
        '香菱',
        '香菱',
        'tsumugi',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/xiangling.json`,
        [
          [
            'join',
            '編隊加入',
            '食材は全部持ったよ！',
            'しょくざいは ぜんぶ もったよ！',
            '食材都帶齊了喔！',
            '「食材は」提出主題；「全部」表示全部；「持った」是持つ的過去形，在這裡表示已經帶好。句尾よ提醒對方。',
            'しょくざいわぜんぶもったよ',
          ],
          [
            'skill',
            '元素技能',
            '料理の時間だよ！',
            'りょうりの じかんだよ！',
            '是料理時間囉！',
            '「料理の時間」用の連接兩個名詞；だ表示判斷，句尾よ告知對方現在到了料理的時間。',
            'りょうりのじかんだよ',
          ],
          [
            'burst',
            '元素爆發',
            '師匠の技を食らいなさい！',
            'ししょうの わざを くらいなさい！',
            '接下師父的招式吧！',
            '「師匠の技」是師父的招式；「食らう」在戰鬥語境表示承受攻擊。「食らいなさい」由ます形去掉ます加なさい，帶強烈命令語氣。',
            'ししょうのわざおくらいなさい',
          ],
        ],
      ),

      character(
        'genshin',
        'xingqiu',
        '行秋',
        '行秋',
        'nemo2',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/xingqiu.json`,
        [
          [
            'join',
            '編隊加入',
            '雨垂れ石をも穿つ。',
            'あまだれ いしをも うがつ。',
            '滴水也能穿石。',
            '「雨垂れ」是滴落的雨水；「石をも」的も強調連石頭也能穿透。「穿つ」表示鑿穿，整句以諺語說明持續努力能產生成果。',
            'あまだれいしおもうがつ',
          ],
          [
            'skill',
            '元素技能',
            'この剣は分かるかい！',
            'この けんは わかるかい！',
            '你明白這把劍的厲害嗎！',
            '「この剣は」提出眼前這把劍；「分かる」表示明白。句尾かい是口語問法，這裡在戰鬥中帶挑戰意味。',
            'このけんわわかるかい',
          ],
          [
            'burst',
            '元素爆發',
            '詩よ、錦となれ。',
            'しよ、にしきと なれ。',
            '詩啊，化為錦繡吧。',
            '「詩よ」的よ是在呼喚詩；「錦」是華美的織物。「となれ」由と標示變化結果，加なる的命令形なれ，帶詩意宣告語氣。',
            'しよにしきとなれ',
          ],
        ],
      ),

      character(
        'genshin',
        'fischl',
        '菲謝爾',
        'フィッシュル',
        'sayo',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/fischl.json`,
        [
          [
            'join',
            '編隊加入',
            '皇女の名のもとに！',
            'こうじょの なの もとに！',
            '以皇女之名！',
            '「皇女の名のもとに」表示以皇女的名義或權威行事；這裡省略後面的動作，是莊重的宣告。名在此讀な。',
            'こうじょのなのもとに',
          ],
          [
            'skill',
            '元素技能',
            '姿を見せよ、オズ！',
            'すがたを みせよ、オズ！',
            '現身吧，奧茲！',
            '「姿を見せる」表示現身；「見せよ」是見せる的書面語命令形，較口語的見せろ莊重。オズ是呼喚的對象。',
            'すがたおみせよおず',
          ],
          [
            'burst',
            '元素爆發',
            '黒き翼よ、昼夜を切り裂きなさい——',
            'くろき つばさよ、ちゅうやを きりさきなさい——',
            '漆黑之翼啊，撕裂晝夜吧——',
            '「黒き」是黑色的文語說法，修飾翼；よ在這裡呼喚翼。「昼夜」指白天與夜晚；「切り裂きなさい」由切り裂く的ます形去掉ます加なさい，表示命令。',
            'くろきつばさよちゅうやおきりさきなさい',
          ],
        ],
      ),

      character(
        'genshin',
        'zhongli',
        '鍾離',
        '鍾離',
        'ryusei',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/zhongli.json`,
        [
          [
            'join',
            '編隊加入',
            '何をすればいい…',
            'なにを すれば いい…',
            '我該做什麼呢……',
            '「何を」詢問動作對象；「すればいい」是する的條件形すれば加いい，用來問該如何行動。',
            'なにおすればいい',
          ],
          [
            'skill',
            '元素技能',
            '揺らぐことなし。',
            'ゆらぐことなし。',
            '絕不動搖。',
            '「揺らぐ」是動搖；「ことなし」把動作名詞化後否定，接近「ことがない」，是凝縮、莊重的說法。',
            'ゆらぐことなし',
          ],
          [
            'burst',
            '元素爆發',
            '天道、ここにあり。',
            'てんどう、ここに あり。',
            '天道，就在此處。',
            '「ここにあり」用書面語「あり」表示存在，相當於現代口語「ここにある」；「天道」指天之道，這句是宣告。',
            'てんどうここにあり',
          ],
        ],
      ),

      character(
        'genshin',
        'nahida',
        '納西妲',
        'ナヒーダ',
        'hau',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/nahida.json`,
        [
          [
            'join',
            '編隊加入',
            'ずいぶん待ってたのよ。',
            'ずいぶん まってたのよ。',
            '我可是等了好久喔。',
            '「待ってた」是「待っていた」省略い的口語；「ずいぶん」表示程度很大，這裡是等了很久；句尾のよ帶說明與提醒語氣。',
            'ずいぶんまってたのよ',
          ],
          [
            'skill',
            '元素技能',
            '手をつなぎましょう～',
            'てを つなぎましょう～',
            '牽起手吧～',
            '「手をつなぐ」表示牽手；「ましょう」提出禮貌邀請，邀請對方一起做這個動作。',
            'ておつなぎましょう',
          ],
          [
            'burst',
            '元素爆發',
            '知識を、あなたにも。',
            'ちしきを、あなたにも。',
            '也把知識分享給你。',
            '「知識を」提出知識這個對象，後面省略分享等動詞；「にも」結合に與も，表示也給你。',
            'ちしきおあなたにも',
          ],
        ],
      ),

      character(
        'genshin',
        'sucrose',
        '砂糖',
        'スクロース',
        'sayo',
        `https://github.com/theBowja/genshin-db/blob/${genshinVersion}/src/data/Japanese/voiceovers/sucrose.json`,
        [
          [
            'join',
            '編隊加入',
            '力になれるように…',
            'ちからに なれるように…',
            '希望能幫得上忙……',
            '「力になる」表示成為助力；「なれる」是可能形；句尾「ように」省略後面的願望表達，意思是希望能幫上忙。',
            'ちからになれるように',
          ],
          [
            'skill',
            '元素技能',
            '吸引テスト開始。',
            'きゅういんテスト かいし。',
            '吸引測試開始。',
            '「吸引テスト」以名詞修飾另一名詞；「開始」單獨放在句尾作省略「開始する」的號令，常見於實驗或設備操作。',
            'きゅういんてすとかいし',
          ],
          [
            'burst',
            '元素爆發',
            '超拡散形態！',
            'ちょうかくさんけいたい！',
            '超擴散形態！',
            '「超」作前綴，表示超越一般程度；「拡散」是向外散開；「形態」是形式或狀態。整句以名詞片語作簡短宣告。',
            'ちょうかくさんけいたい',
          ],
        ],
      ),

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

          [
            'burst',
            '元素爆發',
            '百発百中！',
            'ひゃっぱつひゃくちゅう！',
            '百發百中！',
            '「百発百中」是每次出手都命中的四字熟語；這裡是省略述語的簡短宣告，不是動詞命令形。',
            'ひゃっぱつひゃくちゅう',
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

          [
            'burst',
            '元素爆發',
            'みんなはオレが守る！',
            'みんなは オレが まもる！',
            '大家就由我來保護！',
            '「みんなは」提出大家這個主題；「オレが」強調由我來做；「守る」以辭書形宣告保護大家。',
            'みんなわおれがまもる',
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

          [
            'skill',
            '元素技能',
            '逃げ道はありません。',
            'にげみちは ありません。',
            '沒有退路了。',
            '「逃げ道」是逃走的路；「はありません」用禮貌否定說明不存在退路，並不是叫對方不要逃跑。',
            'にげみちわありません',
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

          [
            'join',
            '編隊加入',
            '楽しみだな。',
            'たのしみだな。',
            '真令人期待啊。',
            '「楽しみ」在此是名詞，後面接だ；句尾な表自言自語的感嘆，不是辭書形加な的禁止用法。',
            'たのしみだな',
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

          [
            'burst',
            '元素爆發',
            '逃さない！',
            'のがさない！',
            '我不會讓你逃走！',
            '「逃さない」是他動詞「逃す」的否定，表示不讓目標逃走；不同於自動詞「逃げない」所說的自己不逃走。',
            'のがさない',
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
// Attach every supplied official recording to its annotated lesson. Repeated takes
// share one reading; nonverbal files remain visible in the source inventory only.
for (const character of er.characters) {
  for (const line of character.lines) {
    const sources = erFankitSources.filter(
      (source) => source.lessonId === line.id,
    );
    if (!sources.length) continue;
    if (sources.some((source) => source.characterId !== character.id))
      throw new Error(
        `Official source belongs to another character: ${line.id}`,
      );
    line.officialSources = sources;
    line.audio = line.audio.replace(/\.mp3$/, '-fankit-v1.mp3');
  }
  character.lines.sort(
    (a, b) =>
      Number(Boolean(b.officialSources)) - Number(Boolean(a.officialSources)),
  );
}
const selectionLineCount = er.characters.reduce(
  (total, c) => total + c.lines.filter((l) => l.category === '角色選擇').length,
  0,
);
er.scope = `本次官方素材庫共 ${erFankitTotals.clips} 段日文 selected／selected2：${erFankitTotals.withText} 段有台詞，整理為 ${erFankitTotals.lessons} 句教材；${erFankitTotals.nonverbal} 段無台詞音檔僅列來源索引。官方來源句優先顯示，91 位角色既有選角教材共 ${selectionLineCount} 句。可播放音檔皆為 VOICEVOX 自製朗讀。`;
const genshin = gameCharacterStudy.find((game) => game.id === 'genshin');
if (!genshin) throw new Error('Missing Genshin section');
const knownGenshin = new Map(genshin.characters.map((c) => [c.id, c]));
genshin.characters = genshinRoster.map((row) => ({
  ...row,
  ...(knownGenshin.get(row.id) ?? { lines: [] }),
  portrait: row.portrait,
  portraitReferenceUrl: row.portraitReferenceUrl,
}));
const genshinLearnable = genshin.characters.filter((c) => c.lines.length);
genshin.scope = `固定來源名冊共 ${genshin.characters.length} 筆角色條目，包含旅行者與人偶的不同版本。${genshinLearnable.length} 位角色收錄 ${genshinLearnable.reduce((n, c) => n + c.lines.length, 0)} 句短台詞與 VOICEVOX 朗讀；其餘 ${genshin.characters.length - genshinLearnable.length} 筆仍待教材。迪盧克的技能來源只有喊聲，沒有編造完整台詞；未加入劇情。`;
