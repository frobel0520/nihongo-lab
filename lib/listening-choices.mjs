/** Presentation only: keep the canonical option index for grading and progress.
 * Relative references cannot move safely; authors can also explicitly pin order.
 * @param {import('./anime-training.mjs').ListeningQuestion} question
 * @param {() => number} [random] injectable for deterministic regression tests
 * @returns {{ text: string, index: number }[]} */
export function listeningChoices(question, random = Math.random) {
  const choices = question.options.map((text, index) => ({ text, index }));
  if (question.optionOrder === 'fixed' || question.options.some(text =>
    /以上|以下|上述|前述|上面|下面|選項|第[一二三四五六七八九十0-9]+[個項]|[①②③④⑤⑥]|\b(?:all|none) of the above\b/i.test(text),
  )) return choices;
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}
