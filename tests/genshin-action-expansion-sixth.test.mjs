import { ninthAssetNames } from './helpers/before-ninth-action-expansion.mjs';
import { eighthAssetNames } from './helpers/before-eighth-action-expansion.mjs';
import { beforeSeventhIllustrations } from './helpers/before-seventh-action-expansion.mjs';
import { seventhAssetNames } from './helpers/before-seventh-action-expansion.mjs';
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
  sixthLineIds,
  sixthAssetNames,
  sixthProsodyPaths,
  beforeSixthGameCharacterStudy,
  beforeSixthCards,
  beforeSixthIllustrations,
  beforeSixthProsody,
} from './helpers/before-sixth-action-expansion.mjs';
const sha = (value) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');
const expected = [
  {
    id: 'genshin:aino:skill-table-50-0',
    group: 'action-0732',
    character: 'aino',
    category: '元素技能',
    jp: 'ガチャガチャ！',
    sourceSha256:
      '907bbc08372026aebcd9a758b5350e4f53fb6fc5d560a1cf59142e1aa56632f3',
  },
  {
    id: 'genshin:aino:skill-table-51-0',
    group: 'action-0733',
    character: 'aino',
    category: '元素技能',
    jp: 'どうだ！',
    sourceSha256:
      '907bbc08372026aebcd9a758b5350e4f53fb6fc5d560a1cf59142e1aa56632f3',
  },
  {
    id: 'genshin:aino:skill-table-52-0',
    group: 'action-0734',
    character: 'aino',
    category: '元素技能',
    jp: '狙い撃ち～！',
    sourceSha256:
      '907bbc08372026aebcd9a758b5350e4f53fb6fc5d560a1cf59142e1aa56632f3',
  },
  {
    id: 'genshin:aino:skill-table-53-0',
    group: 'action-0735',
    character: 'aino',
    category: '元素技能',
    jp: '発射よーい！',
    sourceSha256:
      '907bbc08372026aebcd9a758b5350e4f53fb6fc5d560a1cf59142e1aa56632f3',
  },
  {
    id: 'genshin:aino:burst-table-57-0',
    group: 'action-0739',
    character: 'aino',
    category: '元素爆發',
    jp: '水遊びの時間だよ！',
    sourceSha256:
      '907bbc08372026aebcd9a758b5350e4f53fb6fc5d560a1cf59142e1aa56632f3',
  },
  {
    id: 'genshin:alyosha:skill-table-46-0',
    group: 'action-0742',
    character: 'alyosha',
    category: '元素技能',
    jp: '当たれ！',
    sourceSha256:
      '6cfe882ce75115364855d9d6bc270403285c876686860905441b6ce33ec31045',
  },
  {
    id: 'genshin:alyosha:skill-table-47-0',
    group: 'action-0743',
    character: 'alyosha',
    category: '元素技能',
    jp: '倒れろ！',
    sourceSha256:
      '6cfe882ce75115364855d9d6bc270403285c876686860905441b6ce33ec31045',
  },
  {
    id: 'genshin:alyosha:skill-table-48-0',
    group: 'action-0744',
    character: 'alyosha',
    category: '元素技能',
    jp: '逃げなくていいのか？',
    sourceSha256:
      '6cfe882ce75115364855d9d6bc270403285c876686860905441b6ce33ec31045',
  },
  {
    id: 'genshin:alyosha:skill-table-49-0',
    group: 'action-0745',
    character: 'alyosha',
    category: '元素技能',
    jp: '獲物をマーク。',
    sourceSha256:
      '6cfe882ce75115364855d9d6bc270403285c876686860905441b6ce33ec31045',
  },
  {
    id: 'genshin:alyosha:skill-table-50-0',
    group: 'action-0746',
    character: 'alyosha',
    category: '元素技能',
    jp: 'そこだな。',
    sourceSha256:
      '6cfe882ce75115364855d9d6bc270403285c876686860905441b6ce33ec31045',
  },
  {
    id: 'genshin:lohen:skill-table-51-0',
    group: 'action-0754',
    character: 'lohen',
    category: '元素技能',
    jp: 'やんのか？',
    sourceSha256:
      'e7788440b86cbfbc3db3f6ecfe35dc1371694812b9fce8c760429002792cf209',
  },
  {
    id: 'genshin:lohen:skill-table-52-0',
    group: 'action-0755',
    character: 'lohen',
    category: '元素技能',
    jp: '震えな。',
    sourceSha256:
      'e7788440b86cbfbc3db3f6ecfe35dc1371694812b9fce8c760429002792cf209',
  },
  {
    id: 'genshin:lohen:skill-table-54-0',
    group: 'action-0757',
    character: 'lohen',
    category: '元素技能',
    jp: '奇襲成功。',
    sourceSha256:
      'e7788440b86cbfbc3db3f6ecfe35dc1371694812b9fce8c760429002792cf209',
  },
  {
    id: 'genshin:lohen:skill-table-55-0',
    group: 'action-0758',
    character: 'lohen',
    category: '元素技能',
    jp: 'いいタイミングだ。',
    sourceSha256:
      'e7788440b86cbfbc3db3f6ecfe35dc1371694812b9fce8c760429002792cf209',
  },
  {
    id: 'genshin:lohen:burst-table-57-0',
    group: 'action-0760',
    character: 'lohen',
    category: '元素爆發',
    jp: 'うっせえな…腹くくれ。',
    sourceSha256:
      'e7788440b86cbfbc3db3f6ecfe35dc1371694812b9fce8c760429002792cf209',
  },
  {
    id: 'genshin:skirk:skill-table-49-0',
    group: 'action-0765',
    character: 'skirk',
    category: '元素技能',
    jp: '満ち、溢れよ。',
    sourceSha256:
      '9afc2bd92cc3b940ee173afa04c4cb51e3f0eb7cc9d54fe2835cc07fb7d46987',
  },
  {
    id: 'genshin:skirk:burst-table-54-0',
    group: 'action-0770',
    character: 'skirk',
    category: '元素爆發',
    jp: '万象よ、巡れ。',
    sourceSha256:
      '9afc2bd92cc3b940ee173afa04c4cb51e3f0eb7cc9d54fe2835cc07fb7d46987',
  },
  {
    id: 'genshin:skirk:burst-table-55-0',
    group: 'action-0771',
    character: 'skirk',
    category: '元素爆發',
    jp: '力よ…',
    sourceSha256:
      '9afc2bd92cc3b940ee173afa04c4cb51e3f0eb7cc9d54fe2835cc07fb7d46987',
  },
  {
    id: 'genshin:skirk:burst-table-56-0',
    group: 'action-0772',
    character: 'skirk',
    category: '元素爆發',
    jp: 'この手に。',
    sourceSha256:
      '9afc2bd92cc3b940ee173afa04c4cb51e3f0eb7cc9d54fe2835cc07fb7d46987',
  },
  {
    id: 'genshin:vesna:skill-table-53-0',
    group: 'action-0774',
    character: 'vesna',
    category: '元素技能',
    jp: '敬礼。',
    sourceSha256:
      'eef47b70897f6b3243fd9fcc13cdc52366cd74cce4b5381ad647c1718ea8dc0a',
  },
  {
    id: 'genshin:vesna:skill-table-55-0',
    group: 'action-0776',
    character: 'vesna',
    category: '元素技能',
    jp: 'ちょっと失礼～',
    sourceSha256:
      'eef47b70897f6b3243fd9fcc13cdc52366cd74cce4b5381ad647c1718ea8dc0a',
  },
  {
    id: 'genshin:vesna:skill-table-56-0',
    group: 'action-0777',
    character: 'vesna',
    category: '元素技能',
    jp: 'まだ終わりじゃないわよ！',
    sourceSha256:
      'eef47b70897f6b3243fd9fcc13cdc52366cd74cce4b5381ad647c1718ea8dc0a',
  },
  {
    id: 'genshin:vesna:skill-table-57-0',
    group: 'action-0778',
    character: 'vesna',
    category: '元素技能',
    jp: '心からの敬意を。',
    sourceSha256:
      'eef47b70897f6b3243fd9fcc13cdc52366cd74cce4b5381ad647c1718ea8dc0a',
  },
  {
    id: 'genshin:vesna:burst-table-59-0',
    group: 'action-0780',
    character: 'vesna',
    category: '元素爆發',
    jp: 'そこね！逃がさないわよ！',
    sourceSha256:
      'eef47b70897f6b3243fd9fcc13cdc52366cd74cce4b5381ad647c1718ea8dc0a',
  },
  {
    id: 'genshin:vodyanitsa:skill-table-50-0',
    group: 'action-0783',
    character: 'vodyanitsa',
    category: '元素技能',
    jp: 'まずは発声練習からね。',
    sourceSha256:
      '9ee9154f9f916053fd1e00dca0086eddb20fe3f573348f8064073b18f111a7c8',
  },
  {
    id: 'genshin:vodyanitsa:skill-table-51-0',
    group: 'action-0784',
    character: 'vodyanitsa',
    category: '元素技能',
    jp: '舞台に上がる時間よ。',
    sourceSha256:
      '9ee9154f9f916053fd1e00dca0086eddb20fe3f573348f8064073b18f111a7c8',
  },
  {
    id: 'genshin:vodyanitsa:skill-table-52-0',
    group: 'action-0785',
    character: 'vodyanitsa',
    category: '元素技能',
    jp: 'こうでなくっちゃ。',
    sourceSha256:
      '9ee9154f9f916053fd1e00dca0086eddb20fe3f573348f8064073b18f111a7c8',
  },
  {
    id: 'genshin:vodyanitsa:burst-table-55-0',
    group: 'action-0788',
    character: 'vodyanitsa',
    category: '元素爆發',
    jp: 'これは、塵に還った者への挽歌。',
    sourceSha256:
      '9ee9154f9f916053fd1e00dca0086eddb20fe3f573348f8064073b18f111a7c8',
  },
  {
    id: 'genshin:vodyanitsa:burst-table-56-0',
    group: 'action-0789',
    character: 'vodyanitsa',
    category: '元素爆發',
    jp: '往日の頌歌を捧げるわ。',
    sourceSha256:
      '9ee9154f9f916053fd1e00dca0086eddb20fe3f573348f8064073b18f111a7c8',
  },
  {
    id: 'genshin:navia:burst-91054',
    group: 'action-0486',
    character: 'navia',
    category: '元素爆發',
    jp: 'ファイアー！ま、岩元素なんだけどね。',
    sourceSha256:
      'f74cb80027028e9580bc9d645e38ff94920892b31cc1b57fefe6511d25b1bccb',
  },
  {
    id: 'genshin:raiden:burst-52058',
    group: 'action-0529',
    character: 'raiden',
    category: '元素爆發',
    jp: '無我の境地へ。',
    sourceSha256:
      '099353efecc7bd6e1a9306036fb5dc64d95f9ccddd2c4a2109de00674071ca1b',
  },
  {
    id: 'genshin:zhongli:skill-17144',
    group: 'action-0723',
    character: 'zhongli',
    category: '元素技能',
    jp: '震天動地。',
    sourceSha256:
      'c4c38103a26530c0a10d6dadbd3cdfee59d0ea4ba5d754f4d303f3e0d6862834',
  },
];
test('T173 preserves the published T172 corpus, card identities, exact meanings and reading profiles', async () => {
  assert.equal(
    sha(beforeSixthGameCharacterStudy),
    '044615f0bd4d9b85c61ba0d1166b8bc767791053eeaff1f5469c9567fa4ae2de',
  );
  assert.equal(
    sha(beforeSixthCards(await collectInventoryCards())),
    'df05eaed078f383a6981b8b4c2fd9be5501bc7e20d8e31131746ea7ddf782276',
  );
  assert.equal(
    sha(beforeSixthIllustrations),
    '69380acd05da91be27ee9cffccc479bc603be2fc32646c813fc8b5aafc55f605',
  );
  assert.equal(
    sha(beforeSixthProsody),
    '442d6d81c69883d19932f941275955c65f804a8d96ce4dd67e4a164b9d4aefb5',
  );
  assert.equal(sixthProsodyPaths.size, 1);
});
test('T173 source identities remain character-scoped and new E/Q lines reach both cards and listening', async () => {
  const genshin = gameCharacterStudy.find((g) => g.id === 'genshin'),
    catalog = await loadCategory('games');
  assert.equal(sixthLineIds.size, 32);
  assert.equal(new Set(expected.map((r) => r.group)).size, 32);
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
    beforeSeventhIllustrations.length - beforeSixthIllustrations.length,
    32,
  );
});
test('T173 adds only 29 safe originals and preserves all 2461 released SVGs byte for byte', async () => {
  const dir = new URL('../public/images/vocab/', import.meta.url),
    names = (await readdir(dir)).filter((n) => n.endsWith('.svg') && !ninthAssetNames.has(n)).sort();
  assert.equal(sixthAssetNames.size, 29);
  assert.equal(names.filter(n => !seventhAssetNames.has(n) && !eighthAssetNames.has(n)).length, 2490);
  const originals = names.filter((n) => !sixthAssetNames.has(n) && !seventhAssetNames.has(n) && !eighthAssetNames.has(n));
  assert.equal(originals.length, 2461);
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
    'b8054db030eec8e379f840d07fcf11bdca0a09b29234a06267d6c74f6a52ef08',
  );
  for (const name of sixthAssetNames) {
    const svg = await readFile(new URL(name, dir), 'utf8');
    assert.match(svg, /viewBox="0 0 224 168"/);
    assert.doesNotMatch(
      svg,
      /<(?:script|foreignObject|image|text)\b|\bon\w+\s*=|(?:href|src)\s*=|url\(/i,
    );
  }
});
