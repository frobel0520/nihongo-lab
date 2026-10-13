import { test } from 'node:test';
import assert from 'node:assert/strict';
import { erVoiceCasting, getErCasting } from '../curriculum/er-voice-casting.mjs';
import { gameCharacterStudy } from '../curriculum/lessons.mjs';
import { voices, getVoice } from '../curriculum/voices.mjs';
import { gameRecordId } from '../lib/game-study.mjs';

const er = gameCharacterStudy.find((g) => g.id === 'er');
test('91位ER角色皆明確選角，性別對應聲線並使用全部八種保留聲音', () => {
  assert.deepEqual(Object.keys(erVoiceCasting).sort(), er.characters.map((c) => c.id).sort());
  assert.equal(Object.values(erVoiceCasting).filter((c) => c.gender === 'female').length, 58);
  assert.equal(Object.values(erVoiceCasting).filter((c) => c.gender === 'male').length, 33);
  const used = new Set();
  for (const c of er.characters) {
    const casting = getErCasting(c.id);
    assert.equal(getVoice(c.voice).gender, casting.gender, c.id);
    assert.equal(c.voice, casting.voice);
    assert.match(casting.referenceUrl, /^https:/);
    used.add(c.voice);
    for (const line of c.lines) assert.equal(line.voice, c.voice);
  }
  assert.deepEqual([...used].sort(), voices.map((v) => v.key).sort());
  assert.throws(() => getErCasting('unknown-character'), /Missing ER voice casting/);
});

test('女性角色不落入男聲預設，年輕男性使用男聲；換聲保留學習id', () => {
  for (const id of ['nadine', 'hart', 'hyejin', 'bianca', 'bihyung', 'seres']) {
    assert.equal(getVoice(getErCasting(id).voice).gender, 'female');
  }
  assert.equal(getErCasting('yuki').voice, 'nemo2');
  const line = er.characters.find((c) => c.id === 'nadine').lines[0];
  assert.equal(gameRecordId(line), gameRecordId({ ...line, voice: 'saehaku', audio: 'old-voice.mp3' }));
  const genshin = gameCharacterStudy.find((g) => g.id === 'genshin');
  for (const id of ['chiori', 'clorinde']) {
    assert.equal(getVoice(genshin.characters.find((c) => c.id === id).voice).gender, 'female');
  }
  assert.equal(getVoice(genshin.characters.find((c) => c.id === 'razor').voice).gender, 'male');
});
