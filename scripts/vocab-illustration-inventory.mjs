// Authoring inventory only: consumes the same four catalogs as the application.
// Text signatures are candidates for sense review, never automatic image mappings.
import { loadCategory } from '../curriculum/lessons.mjs';
import { STUDY_CATEGORIES } from '../lib/study-categories.mjs';
import { illustrationFor } from '../lib/vocab-illustrations.mjs';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** @typedef {import('../lib/srs.mjs').Card & {category:string}} InventoryCard */
const concreteHints = new Set('パン 牛乳 ご飯 肉 お弁当 カレー 飴 かばん 靴 帽子 眼鏡 鉛筆 コップ 机 電話 テレビ カメラ ラジオ 花瓶 自動車 自転車 電車 バス 飛行機 船 駅 病院 郵便局 図書館 銀行 山 地図 傘 卵 魚 本 かぎ いす 時計 学校 橋 公園 水 お茶 コーヒー 紅茶 ジュース りんご みかん 野菜 果物 お菓子 砂糖 塩 肉料理 皿 箸 スプーン フォーク ナイフ タオル 石鹸 歯ブラシ 窓 ドア 部屋 家 店 道 川 海 空 雲 雨 雪 太陽 月 星 木 花 森 犬 猫 鳥 馬 手 足 目 耳 鼻 口 頭 顔 髪 体 腕 指 膝 肩 背中 財布 切符 入口 出口 階段 廊下 庭 建物 港 空港 道具 箱 荷物 服 上着 シャツ ズボン スカート 靴下 傘 画面 端末 電池 電源 充電器 鍵 旗 紙 手紙 写真 料理 食事 夕食 朝食 昼食 地下鉄 車 扉 壁 床 天井 棚 受付 窓口 会議室 教室 宿屋 城 門 広場 交差点 信号 植物 動物 ペン ノート 消しゴム 黒板 時計 棒 石 剣 盾 弓 矢 縄 ロープ 宝箱 宝石 机椅子'.split(' '));
const abstractHints = new Set('約束 理由 安心 心配 目的 原因 結果 気持ち 感情 希望 夢 記憶 責任 関係 信頼 努力 条件 可能性 必要 危険 安全 状況 場合 立場 態度 意味 内容 方法 影響 選択 決心 判断 決定 計画 予定 相談 連絡 確認 報告 依頼 許可 禁止 規則 ルール 任務 使命 役割 協力 応援 友情 愛情 孤独 不安 平和 自由 正義 勇気 幸せ 幸福 成功 失敗 問題 答え 質問 解決 誤解 理解 説明 意見 考え 気分 興味 経験 習慣 変化 改善 準備 覚悟 運命 命 生命 世界 時間 期限 期間 事情 都合 きっかけ 結論 根拠 証拠 印象 評価 比較 違い 共通点 感謝 謝罪 遠慮 期待 納得 了承 反対 賛成 承認 復旧 再開 中止 延期 継続 優先 順番 余裕 意志 意識 約定'.split(' '));
const adverbHints = new Set('ゆっくり 一緒に すぐ もう まだ ずっと きっと たぶん 多分 ぜひ よく ちょっと 少し たくさん いつも 時々 たいてい どうして なぜ とても 大変 本当に ちょうど だんだん 急に まず 次に 最後に 特に 必ず 絶対に 全然 あまり かなり もっと 最も ほとんど すっかり しっかり はっきり こっそり そっと やっと とうとう さっき これから 今 もうすぐ なるべく できるだけ 早く 遅く 強く 弱く'.split(' '));
const expressionHints = new Set('もう一度 ありがとう ありがとうございます どうも すみません ごめんなさい おはよう こんにちは こんばんは さようなら またね いただきます ごちそうさま お願いします よろしく お疲れ様 お疲れさま 大丈夫 仕方がない しょうがない おかげさまで どういたしまして いってきます いってらっしゃい ただいま おかえりなさい 失礼します'.split(' '));

/** @param {InventoryCard} card */
export function signatureFor(card) {
  return JSON.stringify([card.word, card.reading, card.zh]);
}
/** Planning hints are deliberately not authoritative POS or semantic approval.
 * @param {InventoryCard} card */
export function designHintFor(card) {
  if (card.category === 'games') return 'fixed-expression';
  if (expressionHints.has(card.word) || /[。！？!?]/.test(card.word)) return 'fixed-expression';
  if (adverbHints.has(card.word)) return 'adverb';
  if (/な形容詞|い形容詞/.test(card.zh) || (card.word.endsWith('い') && /的/.test(card.zh))) return 'adjective';
  if (abstractHints.has(card.word)) return 'abstract';
  if (concreteHints.has(card.word)) return 'concrete-noun';
  if (/（[^）]*(?:て形|禮貌形|ます形)/.test(card.zh) || /する$|[うくぐすつぬぶむる]$/.test(card.word)) return 'verb';
  return 'needs-design';
}

export async function collectInventoryCards() {
  /** @type {InventoryCard[]} */ const cards = [];
  for (const category of STUDY_CATEGORIES) {
    const catalog = await loadCategory(category.id);
    cards.push(...catalog.cards.map(card => ({ ...card, category: category.id })));
  }
  return cards;
}
/** @param {InventoryCard[]} cards @param {string} sourceCommit */
export function buildIllustrationInventory(cards, sourceCommit) {
  const ids = new Set(cards.map(c => c.id));
  if (ids.size !== cards.length) throw new Error('Duplicate card ID in inventory');
  const mapped = cards.filter(c => illustrationFor(c));
  /** @param {InventoryCard[]} scope */
  const counts = scope => ({
    cardEntries: scope.length,
    distinctWordForms: new Set(scope.map(c => c.word)).size,
    senseSignatures: new Set(scope.map(signatureFor)).size,
    illustratedEntries: scope.filter(c => illustrationFor(c)).length,
    missingEntries: scope.filter(c => !illustrationFor(c)).length,
  });
  /** @type {Map<string, InventoryCard[]>} */ const grouped = new Map();
  for (const card of cards) {
    const key = signatureFor(card);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)?.push(card);
  }
  const groups = [...grouped].map(([key, entries]) => ({
    groupId: createHash('sha256').update(key).digest('hex').slice(0, 16),
    word: entries[0].word,
    reading: entries[0].reading,
    zh: entries[0].zh,
    designHint: designHintFor(entries[0]),
    classificationStatus: 'planning-hint-needs-context-review',
    semanticSharingApproved: false,
    candidateAssets: [...new Set(entries.map(c => illustrationFor(c)?.src).filter(Boolean))],
    entries: entries.map(c => ({ category: c.category, id: c.id, lessonId: c.lessonId, mappedSrc: illustrationFor(c)?.src ?? null })),
  }));
  /** @type {Record<string, number>} */ const designHintCounts = {};
  for (const group of groups) designHintCounts[group.designHint] = (designHintCounts[group.designHint] ?? 0) + 1;
  const multiSignatureForms = [...new Set(cards.map(c => c.word))].filter(word => new Set(cards.filter(c => c.word === word).map(signatureFor)).size > 1).length;
  return {
    schema: 1,
    sourceCommit,
    countingPolicy: 'Exact unnormalized word; candidate sense signature = JSON.stringify([word,reading,zh]). No automatic sharing; true senses may require translation merges or splitting multi-meaning entries.',
    cardContractSha256: createHash('sha256').update(JSON.stringify(cards)).digest('hex'),
    total: counts(cards),
    byCategory: Object.fromEntries(STUDY_CATEGORIES.map(cat => [cat.id, counts(cards.filter(c => c.category === cat.id))])),
    assetCount: new Set(mapped.map(c => illustrationFor(c)?.src)).size,
    illustratedSenseSignatures: groups.filter(g => g.candidateAssets.length).length,
    missingSenseSignatures: groups.filter(g => !g.candidateAssets.length).length,
    unmappedEntriesWithCandidateExistingAsset: groups.filter(g => g.candidateAssets.length).reduce((n, g) => n + g.entries.filter(e => !e.mappedSrc).length, 0),
    multiSignatureForms,
    designHintCounts,
    groups,
  };
}

/** @param {ReturnType<typeof buildIllustrationInventory>} inventory */
export function inventoryCsv(inventory) {
  /** @param {string} value */
  const cell = value => '"' + value.replaceAll('"', '""') + '"';
  const header = ['category', 'cardId', 'word', 'reading', 'zh', 'senseSignatureGroup', 'designHint', 'mappedImage'];
  const rows = inventory.groups.flatMap(group => group.entries.map(entry => [entry.category, entry.id, group.word, group.reading, group.zh, group.groupId, group.designHint, entry.mappedSrc ?? '']));
  return [header, ...rows].map(row => row.map(cell).join(',')).join('\n') + '\n';
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const sourceIndex = process.argv.indexOf('--source');
  const sourceCommit = sourceIndex >= 0 ? process.argv[sourceIndex + 1] : '';
  if (!/^[a-f0-9]{40}$/.test(sourceCommit)) throw new Error('--source requires the exact source commit SHA');
  const inventory = buildIllustrationInventory(await collectInventoryCards(), sourceCommit);
  const outputIndex = process.argv.indexOf('--out');
  const { groups: _groups, ...summary } = inventory;
  if (outputIndex >= 0) {
    const output = process.argv[outputIndex + 1];
    if (!output.endsWith('.csv')) throw new Error('--out requires a .csv path');
    writeFileSync(output, inventoryCsv(inventory));
    writeFileSync(output.replace(/\.csv$/, '-summary.json'), JSON.stringify(summary, null, 2) + '\n');
  } else console.log(JSON.stringify(summary, null, 2));
}
