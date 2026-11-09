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
  ninthLineIds,
  ninthAssetNames,
  ninthProsodyPaths,
  beforeNinthGameCharacterStudy,
  beforeNinthCards,
  beforeNinthIllustrations,
  beforeNinthProsody,
} from './helpers/before-ninth-action-expansion.mjs';
const sha = (value) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');
const expected = [
  {
    id: 'genshin:aether:skill-1064',
    group: 'action-0003',
    character: 'aether',
    category: '元素技能',
    jp: '風刃…！',
    sourceSha256:
      'f6288625dfe3c22b7ec85bf43beaa335109829888f29e5f9d29a076547164213',
  },
  {
    id: 'genshin:aether:skill-1067',
    group: 'action-0006',
    character: 'aether',
    category: '元素技能',
    jp: '荒星！',
    sourceSha256:
      'f6288625dfe3c22b7ec85bf43beaa335109829888f29e5f9d29a076547164213',
  },
  {
    id: 'genshin:aether:skill-1070',
    group: 'action-0009',
    character: 'aether',
    category: '元素技能',
    jp: '紫影！',
    sourceSha256:
      'f6288625dfe3c22b7ec85bf43beaa335109829888f29e5f9d29a076547164213',
  },
  {
    id: 'genshin:aether:burst-1079',
    group: 'action-0028',
    character: 'aether',
    category: '元素爆發',
    jp: '天鼓雷音！',
    sourceSha256:
      'f6288625dfe3c22b7ec85bf43beaa335109829888f29e5f9d29a076547164213',
  },
  {
    id: 'genshin:aether:burst-1131',
    group: 'action-0031',
    character: 'aether',
    category: '元素爆發',
    jp: '新蕾貫土！',
    sourceSha256:
      'f6288625dfe3c22b7ec85bf43beaa335109829888f29e5f9d29a076547164213',
  },
  {
    id: 'genshin:albedo:skill-35050',
    group: 'action-0038',
    character: 'albedo',
    category: '元素技能',
    jp: '擬似陽華。',
    sourceSha256:
      'af74a82454d66d3c99fa79397d36c8b259582fbba281ebf3272afa2c28e1a11e',
  },
  {
    id: 'genshin:albedo:burst-35053',
    group: 'action-0041',
    character: 'albedo',
    category: '元素爆發',
    jp: '冥王、顕生へ。',
    sourceSha256:
      'af74a82454d66d3c99fa79397d36c8b259582fbba281ebf3272afa2c28e1a11e',
  },
  {
    id: 'genshin:alhaitham:skill-78046',
    group: 'action-0044',
    character: 'alhaitham',
    category: '元素技能',
    jp: '鏡閃。',
    sourceSha256:
      '651836cf6d8177b3288b27ecb74307c3ce12111f838e41fdbb154a8857188dd9',
  },
  {
    id: 'genshin:alhaitham:burst-78049',
    group: 'action-0048',
    character: 'alhaitham',
    category: '元素爆發',
    jp: '理論の演繹。',
    sourceSha256:
      '651836cf6d8177b3288b27ecb74307c3ce12111f838e41fdbb154a8857188dd9',
  },
  {
    id: 'genshin:aratakiitto:skill-57045',
    group: 'action-0061',
    character: 'aratakiitto',
    category: '元素技能',
    jp: '岩闘牛！',
    sourceSha256:
      '6d7ab69bd203513ba21b76bc5fcee6e89cd82b6aadb5185d3e16dbac9dc23121',
  },
  {
    id: 'genshin:aratakiitto:burst-57048',
    group: 'action-0064',
    character: 'aratakiitto',
    category: '元素爆發',
    jp: '鬼王のお通りだ！',
    sourceSha256:
      '6d7ab69bd203513ba21b76bc5fcee6e89cd82b6aadb5185d3e16dbac9dc23121',
  },
  {
    id: 'genshin:chiori:skill-94045',
    group: 'action-0129',
    character: 'chiori',
    category: '元素技能',
    jp: 'たもと。',
    sourceSha256:
      '09892798fd7a695a009ffc1a398cdaceac01352e68dd7f89da4cac0c9d27dcb5',
  },
  {
    id: 'genshin:chongyun:skill-22050',
    group: 'action-0135',
    character: 'chongyun',
    category: '元素技能',
    jp: '剣印染氷！',
    sourceSha256:
      '401c5d9c9449a89c121989a71881be763981bcb95f96acaa0c10ed08a3cb0d1d',
  },
  {
    id: 'genshin:chongyun:skill-22052',
    group: 'action-0137',
    character: 'chongyun',
    category: '元素技能',
    jp: '急急如律令。',
    sourceSha256:
      '401c5d9c9449a89c121989a71881be763981bcb95f96acaa0c10ed08a3cb0d1d',
  },
  {
    id: 'genshin:chongyun:burst-22055',
    group: 'action-0140',
    character: 'chongyun',
    category: '元素爆發',
    jp: '宝印幻剣！',
    sourceSha256:
      '401c5d9c9449a89c121989a71881be763981bcb95f96acaa0c10ed08a3cb0d1d',
  },
  {
    id: 'genshin:eula:burst-39063',
    group: 'action-0218',
    character: 'eula',
    category: '元素爆發',
    jp: '霜降の怨！',
    sourceSha256:
      '73b179bc223dece9f7232b3cdf28894b9874c943309aaaaa60f108b46619cfe7',
  },
  {
    id: 'genshin:ganyu:skill-25059',
    group: 'action-0258',
    character: 'ganyu',
    category: '元素技能',
    jp: '霜寒化生。',
    sourceSha256:
      'b90affc66f29eed47b3a7f77a44deff944d7e023508a47e42fda3252013b0861',
  },
  {
    id: 'genshin:kamisatoayato:skill-66046',
    group: 'action-0311',
    character: 'kamisatoayato',
    category: '元素技能',
    jp: '蒼流水影。',
    sourceSha256:
      '54eb62bce84019672d86ccc95743f91c10b75f630862eda1c137596b288ebdf9',
  },
  {
    id: 'genshin:kujousara:burst-56050',
    group: 'action-0360',
    character: 'kujousara',
    category: '元素爆發',
    jp: '常道を恢弘せしは、永遠なる鳴神なり！',
    sourceSha256:
      '71cadb14da8df55c0bf8cc09efda115cfe2ceceadf2961e7ff4f6da5118cee93',
  },
  {
    id: 'genshin:kukishinobu:burst-65045',
    group: 'action-0367',
    character: 'kukishinobu',
    category: '元素爆發',
    jp: '祈雷…祓除！',
    sourceSha256:
      '685c9fd7f621e299c977c6f88478adadf5f38a94fe549b15fabc133e7cc433f3',
  },
  {
    id: 'genshin:lumine:skill-2063',
    group: 'action-0392',
    character: 'lumine',
    category: '元素技能',
    jp: '風刃…！',
    sourceSha256:
      '158bfdc7fe3293c7672492c0e65e1f5c8343394963d2dc5bb73da8fc911b61fd',
  },
  {
    id: 'genshin:lumine:skill-2066',
    group: 'action-0395',
    character: 'lumine',
    category: '元素技能',
    jp: '荒星！',
    sourceSha256:
      '158bfdc7fe3293c7672492c0e65e1f5c8343394963d2dc5bb73da8fc911b61fd',
  },
  {
    id: 'genshin:lumine:skill-2069',
    group: 'action-0398',
    character: 'lumine',
    category: '元素技能',
    jp: '紫影！',
    sourceSha256:
      '158bfdc7fe3293c7672492c0e65e1f5c8343394963d2dc5bb73da8fc911b61fd',
  },
  {
    id: 'genshin:lumine:burst-2078',
    group: 'action-0417',
    character: 'lumine',
    category: '元素爆發',
    jp: '天鼓雷音！',
    sourceSha256:
      '158bfdc7fe3293c7672492c0e65e1f5c8343394963d2dc5bb73da8fc911b61fd',
  },
  {
    id: 'genshin:lumine:burst-2130',
    group: 'action-0420',
    character: 'lumine',
    category: '元素爆發',
    jp: '新蕾貫土！',
    sourceSha256:
      '158bfdc7fe3293c7672492c0e65e1f5c8343394963d2dc5bb73da8fc911b61fd',
  },
  {
    id: 'genshin:qiqi:burst-24054',
    group: 'action-0524',
    character: 'qiqi',
    category: '元素爆發',
    jp: '我が名は度厄真君なり。',
    sourceSha256:
      '6e66772bfaf55e5d802b4fc87a031e6f8fd6cfd281ed9b2b254272a402bc8cc6',
  },
  {
    id: 'genshin:qiqi:burst-24055',
    group: 'action-0525',
    character: 'qiqi',
    category: '元素爆發',
    jp: '仙法開け、顕現せよ。',
    sourceSha256:
      '6e66772bfaf55e5d802b4fc87a031e6f8fd6cfd281ed9b2b254272a402bc8cc6',
  },
  {
    id: 'genshin:shenhe:skill-63046',
    group: 'action-0570',
    character: 'shenhe',
    category: '元素技能',
    jp: '煉気化神！',
    sourceSha256:
      '3fb75ee28c67b1a6a065e0decc791992b999b5ee1479f34d4eccbb9ed6b5a9f4',
  },
  {
    id: 'genshin:shenhe:burst-63049',
    group: 'action-0573',
    character: 'shenhe',
    category: '元素爆發',
    jp: '天真敕奏！',
    sourceSha256:
      '3fb75ee28c67b1a6a065e0decc791992b999b5ee1479f34d4eccbb9ed6b5a9f4',
  },
  {
    id: 'genshin:shenhe:burst-63050',
    group: 'action-0574',
    character: 'shenhe',
    category: '元素爆發',
    jp: '氷霜よ、化神となれ！',
    sourceSha256:
      '3fb75ee28c67b1a6a065e0decc791992b999b5ee1479f34d4eccbb9ed6b5a9f4',
  },
  {
    id: 'genshin:xingqiu:skill-13058',
    group: 'action-0665',
    character: 'xingqiu',
    category: '元素技能',
    jp: '裁——！',
    sourceSha256:
      '0d38d7805caae36335101245f26f8c53331dc78acb9e736fdd7c47d14d0568d8',
  },
  {
    id: 'genshin:xingqiu:burst-13062',
    group: 'action-0669',
    character: 'xingqiu',
    category: '元素爆發',
    jp: '裁雨留虹。',
    sourceSha256:
      '0d38d7805caae36335101245f26f8c53331dc78acb9e736fdd7c47d14d0568d8',
  },
  {
    id: 'genshin:yaemiko:skill-58048',
    group: 'action-0680',
    character: 'yaemiko',
    category: '元素技能',
    jp: '姿を残さん。',
    sourceSha256:
      '4a57c882355fa18c034236f046a089cdddfc390e3928be37b86b7e683f0083c7',
  },
  {
    id: 'genshin:zhongli:skill-17146',
    group: 'action-0725',
    character: 'zhongli',
    category: '元素技能',
    jp: '岩山破蓄。',
    sourceSha256:
      'c4c38103a26530c0a10d6dadbd3cdfee59d0ea4ba5d754f4d303f3e0d6862834',
  },
  {
    id: 'genshin:zhongli:skill-17147',
    group: 'action-0726',
    character: 'zhongli',
    category: '元素技能',
    jp: '堅如磐石。',
    sourceSha256:
      'c4c38103a26530c0a10d6dadbd3cdfee59d0ea4ba5d754f4d303f3e0d6862834',
  },
  {
    id: 'genshin:zhongli:burst-17149',
    group: 'action-0728',
    character: 'zhongli',
    category: '元素爆發',
    jp: '天理長駆。',
    sourceSha256:
      'c4c38103a26530c0a10d6dadbd3cdfee59d0ea4ba5d754f4d303f3e0d6862834',
  },
  {
    id: 'genshin:skirk:skill-table-51-0',
    group: 'action-0767',
    character: 'skirk',
    category: '元素技能',
    jp: '刃舞。',
    sourceSha256:
      '9afc2bd92cc3b940ee173afa04c4cb51e3f0eb7cc9d54fe2835cc07fb7d46987',
  },
];
test('T176 preserves the published T175 corpus, card identities, exact meanings and reading profiles', async () => {
  assert.equal(
    sha(beforeNinthGameCharacterStudy),
    '553ae693760ed72a4dc93c59df30f091f9cf4244ea10337dac7e7039d18631f2',
  );
  assert.equal(
    sha(beforeNinthCards(await collectInventoryCards())),
    'bfbc1b3b013929ad198821cb8d7ced80c0beb855156eabbe1f3fdcfeab7485bc',
  );
  assert.equal(
    sha(beforeNinthIllustrations),
    'f5d0b78e8e556730498fcf2f042b899a454646af72e33fc13c1b1e130606b856',
  );
  assert.equal(
    sha(beforeNinthProsody),
    '56855c70476835d90b361dd15921ea21cf9be5d53a6f48cdbb6aa2723e9a01c1',
  );
  assert.equal(ninthProsodyPaths.size, 30);
});
test('T176 source identities remain character-scoped and new E/Q lines reach both cards and listening', async () => {
  const genshin = gameCharacterStudy.find((g) => g.id === 'genshin'),
    catalog = await loadCategory('games');
  assert.equal(ninthLineIds.size, 37);
  assert.equal(new Set(expected.map((r) => r.group)).size, 37);
  for (const row of expected) {
    const character = genshin.characters.find((c) => c.id === row.character),
      line = character.lines.find((l) => l.id === row.id);
    assert.ok(line, row.id);
    assert.equal(line.jp, row.jp);
    assert.equal(line.category, row.category);
    assert.equal(line.sourceSha256, row.sourceSha256);
    assert.equal(line.voice, character.voice);
    assert.equal(character.lines.filter((l) => l.jp === row.jp).length, 1);
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
    VOCAB_ILLUSTRATIONS.length - beforeNinthIllustrations.length,
    37,
  );
});
test('T176 adds only 31 safe originals and preserves all 2548 released SVGs byte for byte', async () => {
  const dir = new URL('../public/images/vocab/', import.meta.url),
    names = (await readdir(dir)).filter((n) => n.endsWith('.svg')).sort();
  assert.equal(ninthAssetNames.size, 31);
  assert.equal(names.length, 2579);
  const originals = names.filter(
    (n) => !ninthAssetNames.has(n) && !ninthAssetNames.has(n),
  );
  assert.equal(originals.length, 2548);
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
    '1e3ae7cc91b516d319ea4b4dc36afc66d9d41fb091bdf07fbe9c699379b2c7e6',
  );
  for (const name of ninthAssetNames) {
    const svg = await readFile(new URL(name, dir), 'utf8');
    assert.match(svg, /viewBox="0 0 224 168"/);
    assert.doesNotMatch(
      svg,
      /<(?:script|foreignObject|image|text)\b|\bon\w+\s*=|(?:href|src)\s*=|url\(/i,
    );
  }
});
