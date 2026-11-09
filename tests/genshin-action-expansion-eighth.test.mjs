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
  eighthLineIds,
  eighthAssetNames,
  eighthProsodyPaths,
  beforeEighthGameCharacterStudy,
  beforeEighthCards,
  beforeEighthIllustrations,
  beforeEighthProsody,
} from './helpers/before-eighth-action-expansion.mjs';
const sha = (value) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');
const expected = [
  {
    id: 'genshin:citlali:skill-107044',
    group: 'action-0143',
    character: 'citlali',
    category: '元素技能',
    jp: 'ツィツィミメよ、契約を果たせ。',
    sourceSha256:
      '0616e6c407f413eddde81fd38e11de3b63f6aab709e1e321c57b3c2dab46325a',
  },
  {
    id: 'genshin:citlali:burst-107050',
    group: 'action-0149',
    character: 'citlali',
    category: '元素爆發',
    jp: 'シトラリン、イツパパ、ゴーよ！',
    sourceSha256:
      '0616e6c407f413eddde81fd38e11de3b63f6aab709e1e321c57b3c2dab46325a',
  },
  {
    id: 'genshin:citlali:burst-107051',
    group: 'action-0150',
    character: 'citlali',
    category: '元素爆發',
    jp: '悪曜のチカラを思い知りなさい！',
    sourceSha256:
      '0616e6c407f413eddde81fd38e11de3b63f6aab709e1e321c57b3c2dab46325a',
  },
  {
    id: 'genshin:fischl:burst-19056',
    group: 'action-0232',
    character: 'fischl',
    category: '元素爆發',
    jp: '影の鴉が、幽夜を求めている——',
    sourceSha256:
      'bae74a4affdd33a52c6b7c947e83d5a41ada2917afbfa37fe381085f73284705',
  },
  {
    id: 'genshin:gaming:burst-92052',
    group: 'action-0254',
    character: 'gaming',
    category: '元素爆發',
    jp: 'ウェンツァイ、出番だ！',
    sourceSha256:
      'eb76f3e403f11b6df8fb8b0314bc0f87098888572e47e4116e556866195f3711',
  },
  {
    id: 'genshin:ganyu:burst-25063',
    group: 'action-0262',
    character: 'ganyu',
    category: '元素爆發',
    jp: '岩王帝君のために！',
    sourceSha256:
      'b90affc66f29eed47b3a7f77a44deff944d7e023508a47e42fda3252013b0861',
  },
  {
    id: 'genshin:kaedeharakazuha:skill-40053',
    group: 'action-0293',
    character: 'kaedeharakazuha',
    category: '元素技能',
    jp: '風の行先よ。',
    sourceSha256:
      '330edbe4dfe3c45299868e90f7978a0c40ace715b7c961f8dfd19178ec230444',
  },
  {
    id: 'genshin:kinich:burst-101054',
    group: 'action-0339',
    character: 'kinich',
    category: '元素爆發',
    jp: '昔日の影よ、我が命を果たせ。',
    sourceSha256:
      'a5922db0cde36f51605c06f77afde5104d92f6b652053214b88fad2e8d4b2c15',
  },
  {
    id: 'genshin:kukishinobu:skill-65041',
    group: 'action-0363',
    character: 'kukishinobu',
    category: '元素技能',
    jp: '鳴草の輪！',
    sourceSha256:
      '685c9fd7f621e299c977c6f88478adadf5f38a94fe549b15fabc133e7cc433f3',
  },
  {
    id: 'genshin:mavuika:burst-106057',
    group: 'action-0446',
    character: 'mavuika',
    category: '元素爆發',
    jp: '赤焔に葬られよ！',
    sourceSha256:
      'a74fc38caa042883562ff17f4fb5f2ecb6832a5cbadede6e788a5e97fab48a99',
  },
  {
    id: 'genshin:mona:skill-30050',
    group: 'action-0456',
    character: 'mona',
    category: '元素技能',
    jp: '水中幻願。',
    sourceSha256:
      'f37b1dd5c47f503fe92c442186dc36c8f3750881f0e9a3632ae39e303760704e',
  },
  {
    id: 'genshin:mona:skill-30051',
    group: 'action-0457',
    character: 'mona',
    category: '元素技能',
    jp: '…運命の虚影。',
    sourceSha256:
      'f37b1dd5c47f503fe92c442186dc36c8f3750881f0e9a3632ae39e303760704e',
  },
  {
    id: 'genshin:navia:skill-91053',
    group: 'action-0485',
    character: 'navia',
    category: '元素技能',
    jp: 'これって…「傘弾銃」？',
    sourceSha256:
      'f74cb80027028e9580bc9d645e38ff94920892b31cc1b57fefe6511d25b1bccb',
  },
  {
    id: 'genshin:navia:burst-91055',
    group: 'action-0487',
    character: 'navia',
    category: '元素爆發',
    jp: 'ローズクラッカー！「棘薔薇の会」特注版よ。',
    sourceSha256:
      'f74cb80027028e9580bc9d645e38ff94920892b31cc1b57fefe6511d25b1bccb',
  },
  {
    id: 'genshin:tighnari:skill-69047',
    group: 'action-0613',
    character: 'tighnari',
    category: '元素技能',
    jp: '一葉目を蔽えば——',
    sourceSha256:
      '4aa7f47533735d4e7bc394bfb06fc6e389eff63ac0b3fb9d71077f9260012b0c',
  },
  {
    id: 'genshin:wanderer:skill-75053',
    group: 'action-0626',
    character: 'wanderer',
    category: '元素技能',
    jp: '俗世を見下ろさん。',
    sourceSha256:
      'c68ef314d32286c999913c52f4372755283f3c3648834742971e9b0f58f3dd8f',
  },
  {
    id: 'genshin:wanderer:skill-75054',
    group: 'action-0627',
    character: 'wanderer',
    category: '元素技能',
    jp: '天へと舞え！',
    sourceSha256:
      'c68ef314d32286c999913c52f4372755283f3c3648834742971e9b0f58f3dd8f',
  },
  {
    id: 'genshin:xianyun:burst-93052',
    group: 'action-0651',
    character: 'xianyun',
    category: '元素爆發',
    jp: '集風、孤雲に帰す。',
    sourceSha256:
      '4bd81d36ca94767740be10f52bffe2aea70fdc973b609dae8f69a427aac03b62',
  },
  {
    id: 'genshin:xiao:burst-16151',
    group: 'action-0656',
    character: 'xiao',
    category: '元素爆發',
    jp: '靖妖儺舞。',
    sourceSha256:
      'e660635a2e48c45615dd1db6e70085639aa8b97d15165b36c421847aaf6556b9',
  },
  {
    id: 'genshin:xilonen:burst-103048',
    group: 'action-0661',
    character: 'xilonen',
    category: '元素爆發',
    jp: '響け、壑の音！',
    sourceSha256:
      '33514e1d11d13ed0f0aba10362a43f009f9dd1931682b48705b1656c13928e6f',
  },
  {
    id: 'genshin:yaemiko:skill-58044',
    group: 'action-0676',
    character: 'yaemiko',
    category: '元素技能',
    jp: '律令。',
    sourceSha256:
      '4a57c882355fa18c034236f046a089cdddfc390e3928be37b86b7e683f0083c7',
  },
  {
    id: 'genshin:yaemiko:skill-58045',
    group: 'action-0677',
    character: 'yaemiko',
    category: '元素技能',
    jp: '呪禁。',
    sourceSha256:
      '4a57c882355fa18c034236f046a089cdddfc390e3928be37b86b7e683f0083c7',
  },
  {
    id: 'genshin:yaemiko:skill-58046',
    group: 'action-0678',
    character: 'yaemiko',
    category: '元素技能',
    jp: '敕。',
    sourceSha256:
      '4a57c882355fa18c034236f046a089cdddfc390e3928be37b86b7e683f0083c7',
  },
  {
    id: 'genshin:yaemiko:burst-58049',
    group: 'action-0681',
    character: 'yaemiko',
    category: '元素爆發',
    jp: '真瞳の顕現。',
    sourceSha256:
      '4a57c882355fa18c034236f046a089cdddfc390e3928be37b86b7e683f0083c7',
  },
  {
    id: 'genshin:yaoyao:skill-77047',
    group: 'action-0690',
    character: 'yaoyao',
    category: '元素技能',
    jp: '月桂、出番だよ。',
    sourceSha256:
      '09c056e154cbe5a477b2ddd453da30a388ea5a32ff48e578ab402d54b2c376df',
  },
  {
    id: 'genshin:yaoyao:burst-77052',
    group: 'action-0695',
    character: 'yaoyao',
    category: '元素爆發',
    jp: '行くよ、月桂！',
    sourceSha256:
      '09c056e154cbe5a477b2ddd453da30a388ea5a32ff48e578ab402d54b2c376df',
  },
  {
    id: 'genshin:yunjin:skill-64044',
    group: 'action-0717',
    character: 'yunjin',
    category: '元素技能',
    jp: '飛雲旗！',
    sourceSha256:
      '69e93790f452cb50f802c5e9bf911b4d069cf12fe8418f9be3e497a498f6e389',
  },
  {
    id: 'genshin:yunjin:burst-64047',
    group: 'action-0720',
    character: 'yunjin',
    category: '元素爆發',
    jp: '戮力同心！',
    sourceSha256:
      '69e93790f452cb50f802c5e9bf911b4d069cf12fe8418f9be3e497a498f6e389',
  },
  {
    id: 'genshin:yunjin:burst-64048',
    group: 'action-0721',
    character: 'yunjin',
    category: '元素爆發',
    jp: '一鼓作気！',
    sourceSha256:
      '69e93790f452cb50f802c5e9bf911b4d069cf12fe8418f9be3e497a498f6e389',
  },
  {
    id: 'genshin:zhongli:skill-17143',
    group: 'action-0722',
    character: 'zhongli',
    category: '元素技能',
    jp: '壁立千仞。',
    sourceSha256:
      'c4c38103a26530c0a10d6dadbd3cdfee59d0ea4ba5d754f4d303f3e0d6862834',
  },
  {
    id: 'genshin:aino:burst-table-56-0',
    group: 'action-0738',
    character: 'aino',
    category: '元素爆發',
    jp: 'バシャバシャ水弾だ！',
    sourceSha256:
      '907bbc08372026aebcd9a758b5350e4f53fb6fc5d560a1cf59142e1aa56632f3',
  },
  {
    id: 'genshin:skirk:skill-table-48-0',
    group: 'action-0764',
    character: 'skirk',
    category: '元素技能',
    jp: '滅。',
    sourceSha256:
      '9afc2bd92cc3b940ee173afa04c4cb51e3f0eb7cc9d54fe2835cc07fb7d46987',
  },
  {
    id: 'genshin:vesna:skill-table-54-0',
    group: 'action-0775',
    character: 'vesna',
    category: '元素技能',
    jp: '剣を掲げて。',
    sourceSha256:
      'eef47b70897f6b3243fd9fcc13cdc52366cd74cce4b5381ad647c1718ea8dc0a',
  },
];
test('T175 preserves the published T174 corpus, card identities, exact meanings and reading profiles', async () => {
  assert.equal(
    sha(beforeEighthGameCharacterStudy),
    'faa726465ec2af322f4c892ea4a0f1a89f5e0c426351b6f70500062386f6aa21',
  );
  assert.equal(
    sha(beforeEighthCards(await collectInventoryCards())),
    '5a4e2ad151d7aa42b16bdf3a1121e6dcce6b8b1295fbd9310d0c691aebd50349',
  );
  assert.equal(
    sha(beforeEighthIllustrations),
    '9bb8bb044d920b96504e707d2d4a0e509ccdb54e7413dd8bf0ce95bc4e763bcd',
  );
  assert.equal(
    sha(beforeEighthProsody),
    'c8351f8151ad04c0151de70ded3751f75ee45cdc71ae23da8ca8b6edf510e82a',
  );
  assert.equal(eighthProsodyPaths.size, 20);
});
test('T175 source identities remain character-scoped and new E/Q lines reach both cards and listening', async () => {
  const genshin = gameCharacterStudy.find((g) => g.id === 'genshin'),
    catalog = await loadCategory('games');
  assert.equal(eighthLineIds.size, 33);
  assert.equal(new Set(expected.map((r) => r.group)).size, 33);
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
    VOCAB_ILLUSTRATIONS.length - beforeEighthIllustrations.length,
    33,
  );
});
test('T175 adds only 32 safe originals and preserves all 2516 released SVGs byte for byte', async () => {
  const dir = new URL('../public/images/vocab/', import.meta.url),
    names = (await readdir(dir)).filter((n) => n.endsWith('.svg')).sort();
  assert.equal(eighthAssetNames.size, 32);
  assert.equal(names.length, 2548);
  const originals = names.filter(
    (n) => !eighthAssetNames.has(n) && !eighthAssetNames.has(n),
  );
  assert.equal(originals.length, 2516);
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
    '2d58a31b72c5748c8e38287d72783eb089416cb6972630eb0351e2d798926e49',
  );
  for (const name of eighthAssetNames) {
    const svg = await readFile(new URL(name, dir), 'utf8');
    assert.match(svg, /viewBox="0 0 224 168"/);
    assert.doesNotMatch(
      svg,
      /<(?:script|foreignObject|image|text)\b|\bon\w+\s*=|(?:href|src)\s*=|url\(/i,
    );
  }
});
