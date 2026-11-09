import { beforeEighthIllustrations } from './helpers/before-eighth-action-expansion.mjs';
import { eighthAssetNames } from './helpers/before-eighth-action-expansion.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { gameCharacterStudy, loadCategory } from '../curriculum/lessons.mjs';
import { gameListeningQuestion, gameRecordId } from '../lib/game-study.mjs';
import {
  illustrationFor,
} from '../lib/vocab-illustrations.mjs';
import { collectInventoryCards } from '../scripts/vocab-illustration-inventory.mjs';
import {
  seventhLineIds,
  seventhAssetNames,
  seventhProsodyPaths,
  beforeSeventhGameCharacterStudy,
  beforeSeventhCards,
  beforeSeventhIllustrations,
  beforeSeventhProsody,
} from './helpers/before-seventh-action-expansion.mjs';
const sha = (value) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');
const expected = [
  {
    id: 'genshin:baizhu:burst-82052',
    group: 'action-0078',
    character: 'baizhu',
    category: '元素爆發',
    jp: 'さあ、苦尽甘来です。',
    sourceSha256:
      '856d681b8fd14354af2e5e89f841cb879d70849a09ce984eb46b348cc46b3ff5',
  },
  {
    id: 'genshin:cyno:burst-71057',
    group: 'action-0171',
    character: 'cyno',
    category: '元素爆發',
    jp: '秤量してやる——お前の罪を。',
    sourceSha256:
      '01719b2e7dff9bcb71b0cb6ea3b77574aac009e1f5d5157041eb546467cfe681',
  },
  {
    id: 'genshin:emilie:burst-99048',
    group: 'action-0208',
    character: 'emilie',
    category: '元素爆發',
    jp: '馥郁の語り。',
    sourceSha256:
      '17f5bb2dd58fd01e8510a04134a5de5e727968b370e2c1342a1878b5320e8dfb',
  },
  {
    id: 'genshin:eula:burst-39064',
    group: 'action-0219',
    character: 'eula',
    category: '元素爆發',
    jp: '堅氷、怨を絶つ！',
    sourceSha256:
      '73b179bc223dece9f7232b3cdf28894b9874c943309aaaaa60f108b46619cfe7',
  },
  {
    id: 'genshin:freminet:skill-85050',
    group: 'action-0235',
    character: 'freminet',
    category: '元素技能',
    jp: 'ペールス！',
    sourceSha256:
      '8f6b2ab6e4d7670fd323b3ad6744ff4d952d564c4ce83b0b9794b6efd3d567f1',
  },
  {
    id: 'genshin:gorou:burst-55050',
    group: 'action-0268',
    character: 'gorou',
    category: '元素爆發',
    jp: '先声後実！',
    sourceSha256:
      'd2fe61e87308be27d323f58d67ddbb40a47fa87cf6e65880949190fe8e88842f',
  },
  {
    id: 'genshin:kaedeharakazuha:burst-40056',
    group: 'action-0296',
    character: 'kaedeharakazuha',
    category: '元素爆發',
    jp: '雲隠れ…雁鳴く時。',
    sourceSha256:
      '330edbe4dfe3c45299868e90f7978a0c40ace715b7c961f8dfd19178ec230444',
  },
  {
    id: 'genshin:kamisatoayaka:burst-3151',
    group: 'action-0310',
    character: 'kamisatoayaka',
    category: '元素爆發',
    jp: '神里流…霜滅！',
    sourceSha256:
      '0f2e09c7299f81880f1c8f6b2bc169126b508bbbc47744ad0ac0d98b9294a86a',
  },
  {
    id: 'genshin:kamisatoayato:burst-66048',
    group: 'action-0313',
    character: 'kamisatoayato',
    category: '元素爆發',
    jp: '三尺の秋水。',
    sourceSha256:
      '54eb62bce84019672d86ccc95743f91c10b75f630862eda1c137596b288ebdf9',
  },
  {
    id: 'genshin:kamisatoayato:burst-66050',
    group: 'action-0315',
    character: 'kamisatoayato',
    category: '元素爆發',
    jp: '神里流…水囿！',
    sourceSha256:
      '54eb62bce84019672d86ccc95743f91c10b75f630862eda1c137596b288ebdf9',
  },
  {
    id: 'genshin:navia:skill-91051',
    group: 'action-0483',
    character: 'navia',
    category: '元素技能',
    jp: '避けられる？',
    sourceSha256:
      'f74cb80027028e9580bc9d645e38ff94920892b31cc1b57fefe6511d25b1bccb',
  },
  {
    id: 'genshin:neuvillette:skill-87053',
    group: 'action-0490',
    character: 'neuvillette',
    category: '元素技能',
    jp: '頭を垂れろ。',
    sourceSha256:
      'e4fb27adb60db9702de77f59be7fc120b5caafb091713d5887b26e0b34f840e7',
  },
  {
    id: 'genshin:raiden:burst-52059',
    group: 'action-0530',
    character: 'raiden',
    category: '元素爆發',
    jp: 'ここより、寂滅の時！',
    sourceSha256:
      '099353efecc7bd6e1a9306036fb5dc64d95f9ccddd2c4a2109de00674071ca1b',
  },
  {
    id: 'genshin:sethos:skill-97047',
    group: 'action-0563',
    character: 'sethos',
    category: '元素技能',
    jp: 'お互い、一歩退かないか？',
    sourceSha256:
      '2f82fb0cb450c174712f926c0753e6eef38f18a88e973b8e8e80b24da7126e33',
  },
  {
    id: 'genshin:wanderer:burst-75060',
    group: 'action-0633',
    character: 'wanderer',
    category: '元素爆發',
    jp: '君ごときが、僕を直視する気か？',
    sourceSha256:
      'c68ef314d32286c999913c52f4372755283f3c3648834742971e9b0f58f3dd8f',
  },
  {
    id: 'genshin:wriothesley:burst-86049',
    group: 'action-0639',
    character: 'wriothesley',
    category: '元素爆發',
    jp: '恐れなくていいさ、罪に向き合うんだ。',
    sourceSha256:
      '2bdf97d27a1a136012cec8af1f1138cf02e48efcdb5ad85ba90c95f6ca9040d7',
  },
  {
    id: 'genshin:xianyun:burst-93050',
    group: 'action-0649',
    character: 'xianyun',
    category: '元素爆發',
    jp: '八方の風、羽ばたかん。',
    sourceSha256:
      '4bd81d36ca94767740be10f52bffe2aea70fdc973b609dae8f69a427aac03b62',
  },
  {
    id: 'genshin:xingqiu:skill-13057',
    group: 'action-0664',
    character: 'xingqiu',
    category: '元素技能',
    jp: '雨、描きがたし。',
    sourceSha256:
      '0d38d7805caae36335101245f26f8c53331dc78acb9e736fdd7c47d14d0568d8',
  },
  {
    id: 'genshin:xingqiu:burst-13060',
    group: 'action-0667',
    character: 'xingqiu',
    category: '元素爆發',
    jp: '古華奥義。',
    sourceSha256:
      '0d38d7805caae36335101245f26f8c53331dc78acb9e736fdd7c47d14d0568d8',
  },
  {
    id: 'genshin:yaemiko:burst-58050',
    group: 'action-0682',
    character: 'yaemiko',
    category: '元素爆發',
    jp: '幽玄なる雷霆。',
    sourceSha256:
      '4a57c882355fa18c034236f046a089cdddfc390e3928be37b86b7e683f0083c7',
  },
  {
    id: 'genshin:yanfei:burst-38057',
    group: 'action-0689',
    character: 'yanfei',
    category: '元素爆發',
    jp: '丹書鉄契！',
    sourceSha256:
      'e9036af41f27d8a2e81ad4c7735975c232b28fa8f03008e69d79a628a512d23e',
  },
  {
    id: 'genshin:yumemizukimizuki:skill-109049',
    group: 'action-0709',
    character: 'yumemizukimizuki',
    category: '元素技能',
    jp: '夢療法。',
    sourceSha256:
      'ba1525a198dd957f7be53770da1cf28bb371bcb222e4173e23a0d1172e1974fd',
  },
  {
    id: 'genshin:alyosha:burst-table-51-0',
    group: 'action-0747',
    character: 'alyosha',
    category: '元素爆發',
    jp: '行け、トゥガリン！',
    sourceSha256:
      '6cfe882ce75115364855d9d6bc270403285c876686860905441b6ce33ec31045',
  },
  {
    id: 'genshin:alyosha:burst-table-52-0',
    group: 'action-0748',
    character: 'alyosha',
    category: '元素爆發',
    jp: 'トゥガリン、思う存分遊んでこい！',
    sourceSha256:
      '6cfe882ce75115364855d9d6bc270403285c876686860905441b6ce33ec31045',
  },
  {
    id: 'genshin:skirk:burst-table-52-0',
    group: 'action-0768',
    character: 'skirk',
    category: '元素爆發',
    jp: '淵海に沈め。',
    sourceSha256:
      '9afc2bd92cc3b940ee173afa04c4cb51e3f0eb7cc9d54fe2835cc07fb7d46987',
  },
  {
    id: 'genshin:vesna:burst-table-60-0',
    group: 'action-0781',
    character: 'vesna',
    category: '元素爆發',
    jp: '女皇陛下に捧げましょう——',
    sourceSha256:
      'eef47b70897f6b3243fd9fcc13cdc52366cd74cce4b5381ad647c1718ea8dc0a',
  },
  {
    id: 'genshin:vodyanitsa:skill-table-53-0',
    group: 'action-0786',
    character: 'vodyanitsa',
    category: '元素技能',
    jp: '見て見て、あたしの「しっぽ」。',
    sourceSha256:
      '9ee9154f9f916053fd1e00dca0086eddb20fe3f573348f8064073b18f111a7c8',
  },
];
test('T174 preserves the published T173 corpus, card identities, exact meanings and reading profiles', async () => {
  assert.equal(
    sha(beforeSeventhGameCharacterStudy),
    '3eaeb72153451f5bbd9e97a942d48460f3bbdf8b4fb4373064dd49171bb3c959',
  );
  assert.equal(
    sha(beforeSeventhCards(await collectInventoryCards())),
    'eb25344b1bb9d55bb9e40efaffa15e8bfe5594a49f45ce17614820c3a6d0e00f',
  );
  assert.equal(
    sha(beforeSeventhIllustrations),
    'f514e5a099f63b63902e0c378d7ce302c9607b3bae38635b3db52f434468db20',
  );
  assert.equal(
    sha(beforeSeventhProsody),
    '17739101c6227d012aeff7aced92607c61a12b6430c1c7897341f5023e6035f8',
  );
  assert.equal(seventhProsodyPaths.size, 12);
});
test('T174 source identities remain character-scoped and new E/Q lines reach both cards and listening', async () => {
  const genshin = gameCharacterStudy.find((g) => g.id === 'genshin'),
    catalog = await loadCategory('games');
  assert.equal(seventhLineIds.size, 27);
  assert.equal(new Set(expected.map((r) => r.group)).size, 27);
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
    beforeEighthIllustrations.length - beforeSeventhIllustrations.length,
    27,
  );
});
test('T174 adds only 26 safe originals and preserves all 2490 released SVGs byte for byte', async () => {
  const dir = new URL('../public/images/vocab/', import.meta.url),
    names = (await readdir(dir)).filter((n) => n.endsWith('.svg')).sort();
  assert.equal(seventhAssetNames.size, 26);
  assert.equal(names.filter(n => !eighthAssetNames.has(n)).length, 2516);
  const originals = names.filter(
    (n) => !seventhAssetNames.has(n) && !eighthAssetNames.has(n) && !seventhAssetNames.has(n) && !eighthAssetNames.has(n),
  );
  assert.equal(originals.length, 2490);
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
    'c1dffe1909db98ea8b4c009dbec360413bba80744f2603c938a4d27f63df2a8c',
  );
  for (const name of seventhAssetNames) {
    const svg = await readFile(new URL(name, dir), 'utf8');
    assert.match(svg, /viewBox="0 0 224 168"/);
    assert.doesNotMatch(
      svg,
      /<(?:script|foreignObject|image|text)\b|\bon\w+\s*=|(?:href|src)\s*=|url\(/i,
    );
  }
});
