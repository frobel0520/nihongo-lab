import { STUDY_CATEGORIES } from '../../lib/study-categories.mjs';
import { curriculumSummary } from '../../curriculum/lessons.mjs';
import { summarizeIds } from '../../lib/curriculum-summary.mjs';
import { studyHash, type ViewId } from '../../lib/route.mjs';
import { toDateString } from '../../lib/srs.mjs';
import type { Progress } from '../../lib/progress.mjs';
import { ChevronRightIcon } from './Icons';
export function StudyCategoryPicker({
  view,
  mode,
  progress,
}: {
  view: ViewId;
  mode?: 'new';
  progress: Progress;
}) {
  return (
    <section aria-label="選擇教材類別">
      <h2>選擇教材類別</h2>
      <ul className="lesson-list">
        {STUDY_CATEGORIES.map((category) => {
          const data = curriculumSummary.categories[category.id];
          const stats = summarizeIds(
            data.cardIds,
            progress.srs,
            toDateString(),
          );
          const done = data.sentenceIds.filter(
            (id) => progress.dictation[id]?.passed,
          ).length;
          return (
            <li key={category.id}>
              <a
                className="card lesson-card"
                href={studyHash(
                  view,
                  category.id,
                  view === 'srs' && (mode === 'new' || stats.due === 0)
                    ? 'new'
                    : undefined,
                )}
              >
                <span className="lesson-card-body">
                  <span className="lesson-title">{category.title}</span>
                  <span>{category.description}</span>
                  <span className="muted">
                    {view === 'srs'
                      ? `${stats.total} 張 · 到期 ${stats.due} · 新卡 ${stats.fresh}`
                      : `${data.sentenceIds.length} 句 · 聽寫已通過 ${done} 句`}
                  </span>
                </span>
                <ChevronRightIcon />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
