import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gameCharacterStudy,
  genshinActionCoverage,
  genshinSupplement,
} from '../curriculum/lessons.mjs';
import { getVoice, voices } from '../curriculum/voices.mjs';

// Gender fixture independently checked against the Japanese character profiles, gender field:
// https://github.com/theBowja/genshin-db/tree/49a6544a6c6ae36089cb42fa591fc46f01de8bcf/src/data/Japanese/characters
// Exact profile URLs are the corresponding genshinRoster referenceUrl entries.
const genders = {
  female: [
    'aloy',
    'amber',
    'arlecchino',
    'barbara',
    'beidou',
    'candace',
    'charlotte',
    'chasca',
    'chevreuse',
    'chiori',
    'citlali',
    'clorinde',
    'collei',
    'dehya',
    'diona',
    'dori',
    'emilie',
    'eula',
    'faruzan',
    'fischl',
    'furina',
    'ganyu',
    'hutao',
    'jean',
    'kachina',
    'kamisatoayaka',
    'keqing',
    'kirara',
    'klee',
    'kujousara',
    'kukishinobu',
    'lanyan',
    'layla',
    'lisa',
    'lumine',
    'lynette',
    'mavuika',
    'mona',
    'mualani',
    'nahida',
    'navia',
    'nilou',
    'ningguang',
    'noelle',
    'qiqi',
    'raiden',
    'rosaria',
    'sangonomiyakokomi',
    'sayu',
    'shenhe',
    'sigewinne',
    'sucrose',
    'xiangling',
    'xianyun',
    'xilonen',
    'xinyan',
    'yaemiko',
    'yanfei',
    'yaoyao',
    'yelan',
    'yoimiya',
    'yumemizukimizuki',
    'yunjin',
    'aino',
    'columbina',
    'escoffier',
    'iansan',
    'ineffa',
    'jahoda',
    'lauma',
    'linnea',
    'nefer',
    'nicole',
    'odette',
    'prune',
    'sandrone',
    'skirk',
    'varesa',
    'zibai',
  ],
  male: [
    'aether',
    'albedo',
    'alhaitham',
    'aratakiitto',
    'baizhu',
    'bennett',
    'chongyun',
    'cyno',
    'diluc',
    'freminet',
    'gaming',
    'gorou',
    'kaedeharakazuha',
    'kaeya',
    'kamisatoayato',
    'kaveh',
    'kinich',
    'lyney',
    'mika',
    'neuvillette',
    'ororon',
    'razor',
    'sethos',
    'shikanoinheizou',
    'tartaglia',
    'thoma',
    'tighnari',
    'venti',
    'wanderer',
    'wriothesley',
    'xiao',
    'xingqiu',
    'zhongli',
    'alyosha',
    'dahlia',
    'durin',
    'flins',
    'ifa',
    'illuga',
    'lohen',
    'varka',
  ],
};

const game = gameCharacterStudy.find((g) => g.id === 'genshin');
test('固定來源96位與日文Wiki補錄角色分別核對；缺句角色保持待教材', () => {
  const actionable = game.characters.filter((c) =>
    Object.values(genshinActionCoverage[c.id].categories).some(
      (v) => v.entries > 0,
    ),
  );
  const collected = game.characters.filter((c) => c.lines.length);
  assert.equal(actionable.length, 96);
  assert.deepEqual(
    collected.map((c) => c.id).sort(),
    [
      ...actionable.map((c) => c.id),
      ...genshinSupplement.map((c) => c.id),
    ].sort(),
  );
  assert.equal(
    collected.flatMap((c) => c.lines).length,
    286 + genshinSupplement.length * 3,
  );
  for (const c of collected) {
    const expected = ['diluc', 'hutao'].includes(c.id)
      ? ['元素爆發', '編隊加入']
      : ['元素技能', '元素爆發', '編隊加入'];
    assert.deepEqual(
      c.lines.map((l) => l.category).sort(),
      expected.sort(),
      c.id,
    );
  }
  assert.equal(
    game.characters.filter((c) => !c.lines.length).length,
    28 - genshinSupplement.length,
  );
  for (const c of game.characters.filter((c) => !c.lines.length)) {
    assert.ok(
      Object.values(genshinActionCoverage[c.id].categories).every(
        (v) => v.entries === 0,
      ),
    );
    assert.equal(c.voice, undefined);
  }
});

test('原神已收錄角色的聲線與獨立性別資料一致，同角色所有短句使用同一聲線，八種聲線皆使用', () => {
  const expected = new Map(
    Object.entries(genders).flatMap(([gender, ids]) =>
      ids.map((id) => [id, gender]),
    ),
  );
  const collected = game.characters.filter((c) => c.lines.length);
  assert.equal(expected.size, 120);
  assert.ok(collected.every((c) => expected.has(c.id)));
  for (const c of collected) {
    assert.equal(getVoice(c.voice).gender, expected.get(c.id), c.id);
    for (const l of c.lines) assert.equal(l.voice, c.voice, l.id);
  }
  assert.deepEqual(
    [...new Set(collected.map((c) => c.voice))].sort(),
    voices.map((v) => v.key).sort(),
  );
});
