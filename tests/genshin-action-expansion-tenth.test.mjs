import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { gameCharacterStudy, loadCategory } from '../curriculum/lessons.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import {
  VOCAB_ILLUSTRATIONS,
  illustrationFor,
} from '../lib/vocab-illustrations.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import {
  tenthLineIds,
  tenthAssetNames,
  tenthProsodyPaths,
  beforeTenthGameCharacterStudy,
  beforeTenthCards,
  beforeTenthIllustrations,
  beforeTenthProsody,
} from './helpers/before-tenth-action-expansion.mjs';
const sha = (value) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');
const expected = [
  {
    "id": "genshin:baizhu:skill-82047",
    "group": "action-0073",
    "character": "baizhu",
    "category": "元素技能",
    "jp": "治療しないとな～",
    "sourceSha256": "856d681b8fd14354af2e5e89f841cb879d70849a09ce984eb46b348cc46b3ff5",
    "voice": "tsumugi",
    "speaker": "長生"
  },
  {
    "id": "genshin:beidou:burst-14149",
    "group": "action-0090",
    "character": "beidou",
    "category": "元素爆發",
    "jp": "これが「海山」を滅ぼした力だ！",
    "sourceSha256": "44720b83b2e734a2047e1da83844935dfaa3e579d183129285c0c68965cb5bbb",
    "voice": "tsumugi",
    "speaker": null
  },
  {
    "id": "genshin:chiori:burst-94050",
    "group": "action-0134",
    "character": "chiori",
    "category": "元素爆發",
    "jp": "紅に染まって散りなさい。",
    "sourceSha256": "09892798fd7a695a009ffc1a398cdaceac01352e68dd7f89da4cac0c9d27dcb5",
    "voice": "sayo",
    "speaker": null
  },
  {
    "id": "genshin:fischl:skill-19053",
    "group": "action-0229",
    "character": "fischl",
    "category": "元素技能",
    "jp": "またか…",
    "sourceSha256": "bae74a4affdd33a52c6b7c947e83d5a41ada2917afbfa37fe381085f73284705",
    "voice": "saehaku",
    "speaker": "オズ"
  },
  {
    "id": "genshin:fischl:burst-19055",
    "group": "action-0231",
    "character": "fischl",
    "category": "元素爆發",
    "jp": "夜の幻現！",
    "sourceSha256": "bae74a4affdd33a52c6b7c947e83d5a41ada2917afbfa37fe381085f73284705",
    "voice": "sayo",
    "speaker": null
  },
  {
    "id": "genshin:fischl:burst-19057",
    "group": "action-0233",
    "character": "fischl",
    "category": "元素爆發",
    "jp": "お嬢様の仰せのままに！",
    "sourceSha256": "bae74a4affdd33a52c6b7c947e83d5a41ada2917afbfa37fe381085f73284705",
    "voice": "saehaku",
    "speaker": "オズ"
  },
  {
    "id": "genshin:fischl:burst-19058",
    "group": "action-0234",
    "character": "fischl",
    "category": "元素爆發",
    "jp": "夜の幻現！",
    "sourceSha256": "bae74a4affdd33a52c6b7c947e83d5a41ada2917afbfa37fe381085f73284705",
    "voice": "saehaku",
    "speaker": "オズ"
  },
  {
    "id": "genshin:gaming:skill-92049",
    "group": "action-0251",
    "character": "gaming",
    "category": "元素技能",
    "jp": "採青！",
    "sourceSha256": "eb76f3e403f11b6df8fb8b0314bc0f87098888572e47e4116e556866195f3711",
    "voice": "nemo2",
    "speaker": null
  },
  {
    "id": "genshin:kaedeharakazuha:burst-40058",
    "group": "action-0298",
    "character": "kaedeharakazuha",
    "category": "元素爆發",
    "jp": "黄葉を、散らまく惜しみ。",
    "sourceSha256": "330edbe4dfe3c45299868e90f7978a0c40ace715b7c961f8dfd19178ec230444",
    "voice": "nemo2",
    "speaker": null
  },
  {
    "id": "genshin:kinich:skill-101046",
    "group": "action-0331",
    "character": "kinich",
    "category": "元素技能",
    "jp": "思ったより素早いじゃねぇか？",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:skill-101047",
    "group": "action-0332",
    "character": "kinich",
    "category": "元素技能",
    "jp": "もう逃げんのか？",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:skill-101048",
    "group": "action-0333",
    "character": "kinich",
    "category": "元素技能",
    "jp": "どの技も似たり寄ったりだな…",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:burst-101052",
    "group": "action-0337",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "夜神に報いるために。",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "saehaku",
    "speaker": null
  },
  {
    "id": "genshin:kinich:burst-101055",
    "group": "action-0340",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "聖龍降臨！",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:burst-101056",
    "group": "action-0341",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "原霊顕現！",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:burst-101057-part-1",
    "group": "action-0342",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "聖龍の烈炎で、朽ちゆく汝らを照らそう。",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:burst-101057-part-2",
    "group": "action-0342",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "一切合切燃やし尽くせ。",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:burst-101057-part-3",
    "group": "action-0342",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "ヒャッハー！愉快爽快！",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:burst-101058-part-1",
    "group": "action-0343",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "汝の魂を我輩に捧げよ。",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:burst-101058-part-2",
    "group": "action-0343",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "はぁ？返事もロクにできねぇのか？",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:burst-101058-part-3",
    "group": "action-0343",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "んなら、永遠に黙らせてやる！",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:burst-101059-part-1",
    "group": "action-0344",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "我輩の威光は、比類なきもの！",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:burst-101059-part-2",
    "group": "action-0344",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "今はどうも気分が晴れないのだ。",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kinich:burst-101059-part-3",
    "group": "action-0344",
    "character": "kinich",
    "category": "元素爆發",
    "jp": "虫けらども、きっちり代償を払ってもらうぞ！",
    "sourceSha256": "a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15",
    "voice": "ryusei",
    "speaker": "アハウ"
  },
  {
    "id": "genshin:kujousara:skill-56049",
    "group": "action-0359",
    "character": "kujousara",
    "category": "元素技能",
    "jp": "雷閃！",
    "sourceSha256": "71cadb14da8df55c0bf8cc09efda115cfe2ceceadf2961e7ff4f6da5118cee93",
    "voice": "sayo",
    "speaker": null
  },
  {
    "id": "genshin:neuvillette:burst-87056",
    "group": "action-0493",
    "character": "neuvillette",
    "category": "元素爆發",
    "jp": "泡沫となるがいい。",
    "sourceSha256": "e4fb27adb60db9702de77f59be7fc120b5caafb091713d5887b26e0b34f840e7",
    "voice": "ryusei",
    "speaker": null
  },
  {
    "id": "genshin:raiden:skill-52055",
    "group": "action-0526",
    "character": "raiden",
    "category": "元素技能",
    "jp": "裁きの雷。",
    "sourceSha256": "099353efecc7bd6e1a9306036fb5dc64d95f9ccddd2c4a2109de00674071ca1b",
    "voice": "sayo",
    "speaker": null
  },
  {
    "id": "genshin:sucrose:skill-31055",
    "group": "action-0592",
    "character": "sucrose",
    "category": "元素技能",
    "jp": "六三〇八式ユニット！",
    "sourceSha256": "8ed087fa7557a6c69ab225f50db28c57613ab0091f769fed5aee009d06833f15",
    "voice": "sayo",
    "speaker": null
  },
  {
    "id": "genshin:sucrose:burst-31058",
    "group": "action-0595",
    "character": "sucrose",
    "category": "元素爆發",
    "jp": "七五式モジュール！",
    "sourceSha256": "8ed087fa7557a6c69ab225f50db28c57613ab0091f769fed5aee009d06833f15",
    "voice": "sayo",
    "speaker": null
  },
  {
    "id": "genshin:tighnari:burst-69051",
    "group": "action-0617",
    "character": "tighnari",
    "category": "元素爆發",
    "jp": "株連蔓引だよ！",
    "sourceSha256": "4aa7f47533735d4e7bc394bfb06fc6e389eff63ac0b3fb9d71077f9260012b0c",
    "voice": "nemo2",
    "speaker": null
  },
  {
    "id": "genshin:xiangling:skill-12143",
    "group": "action-0640",
    "character": "xiangling",
    "category": "元素技能",
    "jp": "グゥオパァー、火を噴け！",
    "sourceSha256": "1b1584a7f51d3c85ef6830fb65411cc411d3c3cf91e0042edb885451d2f20168",
    "voice": "tsumugi",
    "speaker": null
  },
  {
    "id": "genshin:yanfei:burst-38055",
    "group": "action-0687",
    "character": "yanfei",
    "category": "元素爆發",
    "jp": "律炎、引！",
    "sourceSha256": "e9036af41f27d8a2e81ad4c7735975c232b28fa8f03008e69d79a628a512d23e",
    "voice": "tsumugi",
    "speaker": null
  },
  {
    "id": "genshin:yoimiya:skill-49009",
    "group": "action-0702",
    "character": "yoimiya",
    "category": "元素技能",
    "jp": "花火見ぃひん？",
    "sourceSha256": "cd886bfbc54b937bbd20a08430c3ef1908c2aee3cf2a7a8dd2965cd4f65742ff",
    "voice": "tsumugi",
    "speaker": null
  },
  {
    "id": "genshin:yoimiya:skill-49010",
    "group": "action-0703",
    "character": "yoimiya",
    "category": "元素技能",
    "jp": "火ぃつけるで！",
    "sourceSha256": "cd886bfbc54b937bbd20a08430c3ef1908c2aee3cf2a7a8dd2965cd4f65742ff",
    "voice": "tsumugi",
    "speaker": null
  },
  {
    "id": "genshin:yumemizukimizuki:burst-109052",
    "group": "action-0712",
    "character": "yumemizukimizuki",
    "category": "元素爆發",
    "jp": "やっちゃん、てっちゃん。",
    "sourceSha256": "ba1525a198dd957f7be53770da1cf28bb371bcb222e4173e23a0d1172e1974fd",
    "voice": "hau",
    "speaker": null
  },
  {
    "id": "genshin:zhongli:burst-17151",
    "group": "action-0730",
    "character": "zhongli",
    "category": "元素爆發",
    "jp": "天動万象。",
    "sourceSha256": "c4c38103a26530c0a10d6dadbd3cdfee59d0ea4ba5d754f4d303f3e0d6862834",
    "voice": "ryusei",
    "speaker": null
  },
  {
    "id": "genshin:skirk:skill-table-50-0",
    "group": "action-0766",
    "character": "skirk",
    "category": "元素技能",
    "jp": "裂空。",
    "sourceSha256": "9afc2bd92cc3b940ee173afa04c4cb51e3f0eb7cc9d54fe2835cc07fb7d46987",
    "voice": "sayo",
    "speaker": null
  }
];
test('T177 preserves the published T176 corpus, card identities, exact meanings and reading profiles', async () => {
  assert.equal(
    sha(beforeTenthGameCharacterStudy),
    '67a4fe9bd0fc57ecd8b67060b7dba5e4492fb39e42337c000971dcf0aaa69535',
  );
  assert.equal(
    sha(beforeTenthCards(await collectInventoryCards())),
    '1b6e2cee5d08dc3fb6b2f77031f9b77be457c8632ac041df10a6e31ef9489342',
  );
  assert.equal(
    sha(beforeTenthIllustrations),
    'e0e9c53fdcf6758e543902271ccdaab53904746d6d3e0af86ab5dc7ae2df76c7',
  );
  assert.equal(
    sha(beforeTenthProsody),
    '7236963c67466929e35ba47a78577dadabe80623ec66d21e975d4a7d0ed305e2',
  );
  assert.equal(tenthProsodyPaths.size, 19);
});
test('T177 source identities remain character-scoped and new E/Q lines reach both cards and listening', async () => {
  const genshin = gameCharacterStudy.find((g) => g.id === 'genshin'),
    catalog = await loadCategory('games');
  assert.equal(tenthLineIds.size, 37);
  assert.equal(new Set(expected.map((r) => r.group)).size, 31);
  for (const row of expected) {
    const character = genshin.characters.find((c) => c.id === row.character),
      line = character.lines.find((l) => l.id === row.id);
    assert.ok(line, row.id);
    assert.equal(line.jp, row.jp);
    assert.equal(line.category, row.category);
    assert.equal(line.sourceSha256, row.sourceSha256);
    assert.equal(line.voice, row.voice);
    assert.equal(line.sourceSpeaker, row.speaker ?? undefined);
    assert.equal(character.lines.filter((l) => l.jp === row.jp).length, expected.filter((r) => r.character === row.character && r.jp === row.jp).length);
    assert.equal(line.ruby.replace(/\{([^{}|]+)\|[^{}|]+\}/g, '$1'), row.jp);
    if (line.sourceType === 'community-wiki') {
      assert.equal(line.voicelineId, undefined);
      assert.equal(line.voicefile, undefined);
      assert.match(
        line.sourceTitle,
        row.category === '元素技能'
          ? /元素(?:スキル|战技)/
          : /元素(?:爆発|爆发)/,
      );
      assert.match(line.sourceCondition, /未細分/);
    } else {
      assert.ok(Number.isInteger(line.voicelineId));
      assert.ok(line.voicefile);
    }
    const question = gameListeningQuestion(line);
    assert.equal(question.options[question.answer], line.zh);
    assert.equal(new Set(question.options).size, 3);
    const card = catalog.cards.find(
      (c) => c.id === 'game-card:' + gameRecordId(line),
    );
    assert.ok(card);
    const image = illustrationFor(card);
    assert.ok(image);
    assert.equal(
      illustrationFor({ ...card, zh: card.zh + '（異義）' }),
      undefined,
    );
    assert.ok(catalog.sentences.some((s) => s.audio === line.audio));
    assert.ok(
      (await readFile(new URL('../public/' + line.audio, import.meta.url)))
        .length > 1000,
    );
  }
  assert.equal(
    VOCAB_ILLUSTRATIONS.length - beforeTenthIllustrations.length,
    37,
  );
});
test('T177 adds only 34 safe originals and preserves all 2579 released SVGs byte for byte', async () => {
  const dir = new URL('../public/images/vocab/', import.meta.url),
    names = (await readdir(dir)).filter((n) => n.endsWith('.svg')).sort();
  assert.equal(tenthAssetNames.size, 34);
  assert.equal(names.length, 2613);
  const originals = names.filter(
    (n) => !tenthAssetNames.has(n) && !tenthAssetNames.has(n),
  );
  assert.equal(originals.length, 2579);
  const hashBytes = (v) => createHash('sha256').update(v).digest('hex');
  const entries = await Promise.all(
    originals.map(
      async (n) =>
        n +
        ':' +
        hashBytes(
          (await readFile(new URL(n, dir), 'utf8')).replace(/\r\n/g, '\n'),
        ),
    ),
  );
  assert.equal(
    hashBytes(entries.join('\n')),
    '73d5121a7a1add2189a50316bd8a1b7c6e51ee94e8e127057fb8619456b31e5c',
  );
  for (const name of tenthAssetNames) {
    const svg = await readFile(new URL(name, dir), 'utf8');
    assert.match(svg, /viewBox="0 0 224 168"/);
    assert.doesNotMatch(
      svg,
      /<(?:script|foreignObject|image|text)\b|\bon\w+\s*=|(?:href|src)\s*=|url\(/i,
    );
  }
});

test('T177 keeps short single-sentence entries and source-part provenance without overcounting groups', () => {
  const game = gameCharacterStudy.find((g) => g.id === 'genshin');
  const lines = game.characters.flatMap((c) => c.lines).filter((l) => tenthLineIds.has(l.id));
  assert.equal(lines.length, 37);
  assert.ok(lines.every((l) => !l.jp.includes('\n')));
  for (const sourceId of [101057, 101058, 101059]) {
    const parts = lines.filter((l) => l.voicelineId === sourceId);
    assert.equal(parts.length, 3);
    assert.deepEqual(parts.map((l) => l.sourcePart).sort(), [1, 2, 3]);
    assert.ok(parts.every((l) => l.sourcePartCount === 3 && l.sourceSpeaker === 'アハウ' && l.voice === 'ryusei'));
    assert.equal(new Set(parts.map((l) => l.id)).size, 3);
    assert.equal(new Set(parts.map((l) => l.audio)).size, 3);
    assert.ok(parts.every((l) => l.id.endsWith('-part-' + l.sourcePart)));
  }
  assert.equal(new Set(expected.map((r) => r.group)).size, 31);
});
