import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listeningChoices } from '../lib/listening-choices.mjs';
import { stages } from '../curriculum/lessons.mjs';
import { checkListeningChoice } from '../lib/anime-training.mjs';
import { sceneRecordId } from '../lib/scene-listening.mjs';
const q = {id:'synthetic',prompt:'選出符合對話的內容',options:['red','green','blue'],answer:1,explanation:'green'};
test('all six possible three-option presentations preserve grading and the canonical question', () => {
  const orders = new Set();
  for (let first = 0; first < 3; first++) for (let second = 0; second < 2; second++) {
    const draws = [(first + .5) / 3, (second + .5) / 2];
    const original = structuredClone(q);
    const choices = listeningChoices(q, () => draws.shift());
    orders.add(choices.map(c => c.index).join(','));
    for (const choice of choices) assert.equal(checkListeningChoice(q, choice.index), choice.text === 'green');
    assert.deepEqual(q, original);
  }
  assert.equal(orders.size, 6);
});
test('independent question permutations allow repeated answer positions; fixed references do not move', () => {
  const questions = [q, {...q,answer:0}, {...q,answer:2}];
  const draws = [0,.75,0,0,.9,.9];
  const positions = questions.map(x => listeningChoices(x, () => draws.shift()).findIndex(c=>c.index===x.answer));
  assert.ok(new Set(positions).size < questions.length, 'a question set must not force one answer per position');
  for (const fixed of [{...q,optionOrder:'fixed'}, {...q, options:['第一個選項','以上皆是','none of the above']}]) {
    assert.deepEqual(listeningChoices(fixed, () => {throw Error('must not shuffle');}).map(c=>c.index), [0,1,2]);
  }
});
test('all 540 actual scene questions retain answer text and progress IDs across every permutation', () => {
  for (const l of stages.flatMap(s=>s.lessons).filter(l=>l.scene)) for (const q of l.scene.questions) {
    const id=sceneRecordId(l,q), correct=q.options[q.answer];
    for (let first=0;first<3;first++) for (let second=0;second<2;second++) {
      const draws=[(first+.5)/3,(second+.5)/2];
      const choices=listeningChoices(q,()=>draws.shift());
      assert.equal(choices.find(c=>c.index===q.answer).text,correct);
      assert.equal(sceneRecordId(l,q),id);
    }
  }
});
