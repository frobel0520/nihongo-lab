import {genshinActionExpansionEleventh} from '../curriculum/genshin-action-expansion-eleventh.mjs';
import {genshinActionExpansionTwelfth} from '../curriculum/genshin-action-expansion-twelfth.mjs';
import { genshinActionExpansionThirteenth } from '../curriculum/genshin-action-expansion-thirteenth.mjs';
import { genshinActionExpansionFourteenth } from '../curriculum/genshin-action-expansion-fourteenth.mjs';
import { secondarySpeakerCasting } from './helpers/genshin-secondary-speakers.mjs';
import { genshinActionExpansionNinth } from '../curriculum/genshin-action-expansion-ninth.mjs';
import { genshinActionExpansionTenth } from '../curriculum/genshin-action-expansion-tenth.mjs';
import { genshinActionExpansionEighth } from '../curriculum/genshin-action-expansion-eighth.mjs';
import { genshinActionExpansionSeventh } from '../curriculum/genshin-action-expansion-seventh.mjs';
import { genshinActionExpansionFifth } from '../curriculum/genshin-action-expansion-fifth.mjs';
import { genshinActionExpansionSixth } from '../curriculum/genshin-action-expansion-sixth.mjs';
import { genshinActionExpansionFourth } from '../curriculum/genshin-action-expansion-fourth.mjs';
import { genshinActionExpansionThird } from '../curriculum/genshin-action-expansion-third.mjs';
import { genshinActionExpansionNext } from '../curriculum/genshin-action-expansion-next.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { genshinActionExpansion } from '../curriculum/genshin-action-expansion.mjs';
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
    'vesna',
    'vodyanitsa',
    'manekina',
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
    'manekin',
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
      ...new Set([
        ...actionable.map((c) => c.id),
        ...genshinSupplement.map((c) => c.id),
      ]),
    ].sort(),
  );
  assert.equal(
    collected.flatMap((c) => c.lines).length,
    286 + genshinSupplement.reduce((n, c) => n + c.lines.length, 0) + genshinActionExpansion.length + genshinActionExpansionNext.length + genshinActionExpansionThird.length + genshinActionExpansionFourth.length + genshinActionExpansionFifth.length + genshinActionExpansionSixth.length + genshinActionExpansionSeventh.length + genshinActionExpansionEighth.length + genshinActionExpansionNinth.length + genshinActionExpansionTenth.length + genshinActionExpansionEleventh.length + genshinActionExpansionTwelfth.length + genshinActionExpansionThirteenth.length + genshinActionExpansionFourteenth.length,
  );
  for (const c of collected) {
    const expected = c.id.startsWith('manekin')
      ? ['編隊加入', '編隊加入', '編隊加入']
      : c.id === 'hutao'
        ? ['元素技能', '元素爆發', '編隊加入', '角色閒聊']
      : c.id === 'diluc'
        ? [
            '元素爆發',
            '編隊加入',
            ...(genshinSupplement.some((s) => s.id === c.id)
              ? ['角色閒聊']
              : []),
          ]
        : ['元素技能', '元素爆發', '編隊加入'];
    assert.deepEqual(
      [...new Set(c.lines.map((l) => l.category))].sort(),
      [...new Set(expected)].sort(),
      c.id,
    );
  }
  assert.equal(
    game.characters.filter((c) => !c.lines.length).length,
    124 -
      new Set([
        ...actionable.map((c) => c.id),
        ...genshinSupplement.map((c) => c.id),
      ]).size,
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

test('原神角色維持原聲線；明示長生、奧茲與阿喬按發話者固定聲線', () => {
  const secondary = secondarySpeakerCasting;
  const speakerGender = { '長生': 'female', 'オズ': 'male', 'アハウ': 'male' };
  const expected = new Map(
    Object.entries(genders).flatMap(([gender, ids]) =>
      ids.map((id) => [id, gender]),
    ),
  );
  const collected = game.characters.filter((c) => c.lines.length);
  assert.equal(expected.size, 124);
  assert.ok(collected.every((c) => expected.has(c.id)));
  for (const c of collected) {
    assert.equal(getVoice(c.voice).gender, expected.get(c.id), c.id);
    for (const l of c.lines) {
      const cast = secondary[l.id];
      if (cast) {
        assert.equal(l.sourceSpeaker, cast.speaker);
        assert.equal(l.voice, cast.voice);
        assert.equal(getVoice(l.voice).gender, speakerGender[cast.speaker]);
      } else {
        assert.equal(l.voice, c.voice, l.id);
        assert.equal(l.sourceSpeaker, undefined, l.id);
      }
    }
  }
  assert.deepEqual(
    [...new Set(collected.map((c) => c.voice))].sort(),
    voices.map((v) => v.key).sort(),
  );
});
