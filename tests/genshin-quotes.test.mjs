import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { gameCharacterStudy } from '../curriculum/lessons.mjs';
import { RUBY_NOTES } from '../curriculum/ruby-notes.mjs';
import { annotateText, buildNotesIndex } from '../lib/ruby-notes.mjs';
import { gameRecordId, gameListeningRecordId } from '../lib/game-study.mjs';
const game = gameCharacterStudy.find((g) => g.id === 'genshin');
const lines = game.characters.flatMap((c) => c.lines);

test('新角色三類短句與既有情境補齊；未核對讀音的技能喊聲不冒配完整台詞', () => {
  for (const id of [
    'zhongli',
    'nahida',
    'sucrose',
    'xiangling',
    'xingqiu',
    'fischl',
    'albedo',
    'beidou',
    'razor',
    'aether',
    'alhaitham',
    'aloy',
    'aratakiitto',
    'baizhu',
    'candace',
    'arlecchino',
    'charlotte',
    'chasca',
    'chevreuse',
    'chiori',
    'chongyun',
    'citlali',
    'clorinde',
    'collei',
    'jean',
    'klee',
    'diona',
    'cyno',
    'dehya',
    'dori',
    'emilie',
    'eula',
    'faruzan',
    'freminet',
    'furina',
    'gaming',
    'ganyu',
    'gorou',
    'kachina',
    'kaedeharakazuha',
    'kamisatoayaka',
    'kamisatoayato',
    'kaveh',
    'kinich',
    'kirara',
    'kujousara',
    'kukishinobu',
    'lanyan',
    'layla',
    'lisa',
    'lumine',
    'lynette',
    'lyney',
    'mavuika',
    'mika',
    'mona',
    'mualani',
    'navia',
    'neuvillette',
    'nilou',
    'ningguang',
    'ororon',
    'qiqi',
    'rosaria',
    'sangonomiyakokomi',
    'sayu',
    'sethos',
    'shenhe',
    'shikanoinheizou',
    'sigewinne',
    'tartaglia',
    'thoma',
    'tighnari',
    'wanderer',
    'wriothesley',
    'xianyun',
    'xiao',
  ]) {
    const character = game.characters.find((c) => c.id === id);
    assert.deepEqual(
      new Set(character.lines.map((l) => l.category)),
      new Set(['編隊加入', '元素技能', '元素爆發']),
    );
  }
  for (const id of ['amber', 'bennett', 'kaeya', 'keqing', 'raiden']) {
    assert.equal(game.characters.find((c) => c.id === id).lines.length, 3);
  }
  for (const id of ['diluc', 'hutao']) {
    assert.equal(
      game.characters.find((c) => c.id === id).lines.some((l) => l.category === '元素技能'),
      false,
    );
  }
  const zhongli = lines.find((l) => l.id === 'genshin:zhongli:join');
  assert.equal(zhongli.jp, '何をすればいい…');
  assert.equal(zhongli.voicelineId, 17167);
  const nahida = lines.find((l) => l.id === 'genshin:nahida:skill');
  assert.equal(nahida.jp, '手をつなぎましょう～');
  assert.equal(nahida.voicelineId, 73053);
  const sucrose = lines.find((l) => l.id === 'genshin:sucrose:skill');
  assert.equal(sucrose.jp, '吸引テスト開始。');
  assert.equal(sucrose.voicelineId, 31054);
});

test('原神固定名冊 124 筆，已收錄角色有短句，其餘明確待收錄，語音文字來源僅連已有表格', () => {
  assert.equal(game.characters.length, 124);
  assert.equal(new Set(game.characters.map((c) => c.id)).size, 124);
  assert.equal(game.characters.filter((c) => c.lines.length).length, 87);
  assert.equal(game.characters.filter((c) => !c.lines.length).length, 37);
  assert.equal(game.characters.filter((c) => c.voiceReferenceUrl).length, 109);
  assert.equal(lines.length, 259);
  for (const c of game.characters) {
    if (/[\p{Script=Han}々]/u.test(c.nameJa)) {
      const parts = annotateText(c.nameJa, buildNotesIndex(RUBY_NOTES));
      assert.ok(
        parts?.some((p) => p.ruby),
        c.nameJa,
      );
      assert.equal(parts.map((p) => p.text).join(''), c.nameJa);
    }
    if (!c.lines.length) assert.equal(c.voice, undefined);
  }
});

test('少量台詞保留確切語音識別與預設造型，不用資料句或替換語尾', () => {
  for (const line of lines) {
    assert.equal(line.kind, 'quote');
    assert.equal(line.variant, '預設造型');
    assert.ok(Number.isInteger(line.voicelineId));
    assert.ok(line.sourceTitle && line.voicefile);
    assert.doesNotMatch(line.voicefile, /suit_aristocrat/);
  }
  const diluc = lines.find((l) => l.id === 'genshin:diluc:burst');
  assert.equal(diluc.jp, '判決を、下す！');
  assert.equal(diluc.voicelineId, 8143);
  const bennett = lines.find((l) => l.id === 'genshin:bennett:skill');
  assert.equal(bennett.jp, '燃えろ！');
  assert.equal(bennett.reading, 'もえろ！');
  assert.match(bennett.audio, /-ro-v1\.mp3$/);
  const old = { ...bennett, audio: 'audio/games/genshin/gram-641caa85ab.mp3' };
  assert.equal(gameRecordId(bennett), gameRecordId(old));
  assert.equal(gameListeningRecordId(bennett), gameListeningRecordId(old));
  assert.equal(existsSync('public/' + old.audio), false);
});
