/**
 * T56：文字文法練習，獨立於聽力／聽寫／FSRS。
 * 沿用版本 3 的通用練習紀錄及既有 Worker 合併契約，不改同步格式。
 * 主紀錄保存曾答對／最後作答；輔助 :wrong 紀錄保存最後答錯時刻。
 * 比較兩個 lastAt 判斷是否需重練；每题最多兩筆，次數再多也不增加 key。
 * @typedef {import('./progress.mjs').Progress} Progress
 * @typedef {import('../curriculum/lessons.mjs').GrammarPoint} GrammarPoint
 * @typedef {import('../curriculum/lessons.mjs').Lesson} Lesson
 * @typedef {import('../curriculum/anime-grammar-study.mjs').GrammarQuestion} GrammarQuestion
 */
import { contentHash } from '../curriculum/author.mjs';
import { isTimestamp, recordDictation } from './progress.mjs';

/** @param {string} lessonId @param {GrammarPoint} point @param {GrammarQuestion} question */
export function grammarRecordId(lessonId, point, question) {
  if (!point.study) throw new Error('這個文法重點尚未提供文字練習');
  return `grammar:${lessonId}:${point.study.id}:${question.id}:${contentHash(JSON.stringify([point.pattern, question.prompt, question.options, question.answer]))}`;
}

/** @param {Progress} progress @param {string} id */
export function grammarStatus(progress, id) {
  const rec = progress.dictation[id];
  const wrong = progress.dictation[`${id}:wrong`];
  return {
    attempted: !!rec?.attempts,
    passed: rec?.passed ?? false,
    review: !!rec && (!rec.passed || (!!wrong && wrong.lastAt >= rec.lastAt)),
  };
}

/** @param {Progress} progress @param {string} id @param {boolean} correct @param {string} now */
export function recordGrammarAnswer(progress, id, correct, now) {
  if (!id.startsWith('grammar:') || id.endsWith(':wrong') || !isTimestamp(now))
    throw new Error('文法練習紀錄或時間格式不正確');
  // 同一台快速重答或時鐘回退時，最新操作仍需比自己的上一筆晚。
  const previous = progress.dictation[id]?.lastAt;
  const stamp =
    previous && now <= previous
      ? new Date(Date.parse(previous) + 1).toISOString()
      : now;
  const next = recordDictation(progress, id, correct, stamp);
  return correct ? next : recordDictation(next, `${id}:wrong`, true, stamp);
}

/** @param {Lesson} lesson @param {Progress} progress */
export function grammarSummary(lesson, progress) {
  const statuses = lesson.grammar.flatMap((point) =>
    (point.study?.questions ?? []).map((q) =>
      grammarStatus(progress, grammarRecordId(lesson.id, point, q)),
    ),
  );
  return {
    total: statuses.length,
    attempted: statuses.filter((s) => s.attempted).length,
    done: statuses.filter((s) => s.passed).length,
    review: statuses.filter((s) => s.review).length,
  };
}

/** @param {Lesson} lesson @param {Progress} progress */
export function grammarReviewQueue(lesson, progress) {
  return lesson.grammar.flatMap((point, pointIndex) =>
    (point.study?.questions ?? []).flatMap((question, questionIndex) =>
      grammarStatus(progress, grammarRecordId(lesson.id, point, question))
        .review
        ? [{ pointIndex, questionIndex }]
        : [],
    ),
  );
}

/** 設定／備份只計實際練習，不把文法錯題的輔助紀錄另算一題。 @param {Progress} progress */
export function practiceRecordCount(progress) {
  return Object.keys(progress.dictation).filter(
    (id) => !(id.startsWith('grammar:') && id.endsWith(':wrong')),
  ).length;
}

/** 匯入時同一題的主／輔助紀錄更新只算一題。 @param {Progress} before @param {Progress} after */
export function practiceChangeCount(before, after) {
  return Object.keys(after.dictation).filter(
    (id) =>
      !(id.startsWith('grammar:') && id.endsWith(':wrong')) &&
      (JSON.stringify(before.dictation[id]) !==
        JSON.stringify(after.dictation[id]) ||
        (id.startsWith('grammar:') &&
          JSON.stringify(before.dictation[`${id}:wrong`]) !==
            JSON.stringify(after.dictation[`${id}:wrong`]))),
  ).length;
}
