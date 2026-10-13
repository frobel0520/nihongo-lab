import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  genshinActionCoverage,
  gameCharacterStudy,
} from '../curriculum/lessons.mjs';
import {
  genshinActionCategory,
  countGenshinActions,
} from '../lib/genshin-coverage.mjs';

test('來源分類接受新舊兩種中點、拒絕相似前綴與其他情境，來源條目與語音檔數分開', () => {
  assert.equal(genshinActionCategory('チーム加入·1'), 'join');
  assert.equal(genshinActionCategory('元素スキル・1'), 'skill');
  assert.equal(genshinActionCategory('元素爆発･2'), 'burst');
  assert.equal(genshinActionCategory('元素スキルについて'), null);
  assert.equal(genshinActionCategory('宝箱を開ける·1'), null);
  const counts = countGenshinActions([
    { title: 'チーム加入·1', voicefile: 'synthetic/shared' },
    { title: 'チーム加入・2', voicefile: 'synthetic/shared' },
    { title: '元素スキル・1', voicefile: 'synthetic/skill' },
  ]);
  assert.deepEqual(counts.join, { entries: 2, voicefiles: 1 });
  assert.deepEqual(counts.skill, { entries: 1, voicefiles: 1 });
  assert.deepEqual(counts.burst, { entries: 0, voicefiles: 0 });
});

test('124筆都有三類來源狀態；無來源、空語音表與有來源的待教材角色不混淆', () => {
  const g = gameCharacterStudy.find((g) => g.id === 'genshin');
  assert.deepEqual(
    Object.keys(genshinActionCoverage).sort(),
    g.characters.map((c) => c.id).sort(),
  );
  const rows = Object.values(genshinActionCoverage);
  assert.equal(rows.filter((r) => r.sourceAvailable).length, 109);
  assert.equal(
    rows.filter((r) => Object.values(r.categories).every((c) => c.entries > 0))
      .length,
    96,
  );
  assert.equal(
    rows.filter(
      (r) =>
        r.sourceAvailable &&
        Object.values(r.categories).every((c) => c.entries === 0),
    ).length,
    13,
  );
  for (const c of g.characters) {
    const coverage = genshinActionCoverage[c.id];
    assert.equal(coverage.sourceAvailable, !!c.voiceReferenceUrl);
    if (coverage.sourceAvailable)
      assert.match(coverage.sha256, /^[a-f0-9]{64}$/);
    else assert.equal(coverage.sha256, null);
    assert.deepEqual(Object.keys(coverage.categories).sort(), [
      'burst',
      'join',
      'skill',
    ]);
    for (const count of Object.values(coverage.categories)) {
      assert.ok(Number.isInteger(count.entries) && count.entries >= 0);
      assert.ok(
        Number.isInteger(count.voicefiles) &&
          count.voicefiles >= 0 &&
          count.voicefiles <= count.entries,
      );
    }
  }
  assert.equal(
    rows.reduce((s, r) => s + r.categories.join.entries, 0),
    288,
  );
  assert.equal(
    rows.reduce((s, r) => s + r.categories.skill.entries, 0),
    403,
  );
  assert.equal(
    rows.reduce((s, r) => s + r.categories.burst.entries, 0),
    333,
  );
  assert.equal(g.characters.flatMap((c) => c.lines).length, 98);
});
