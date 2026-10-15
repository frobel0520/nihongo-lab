import { useEffect, useState } from 'react';
import {
  loadLesson,
  loadCategory,
  type Lesson,
} from '../curriculum/lessons.mjs';
import type { StudyCatalog } from '../lib/study-catalog.mjs';
export function useRouteData(
  key: string,
  lessonId?: string,
  categoryId?: string,
) {
  const [state, setState] = useState<{
    key: string;
    lesson?: Lesson;
    catalog?: StudyCatalog;
    error: boolean;
    ready: boolean;
  }>({ key: '', error: false, ready: false });
  useEffect(() => {
    let active = true;
    if (!lessonId && !categoryId) {
      setState({ key, error: false, ready: true });
      return;
    }
    setState({ key, error: false, ready: false });
    const request = lessonId
      ? loadLesson(lessonId).then((lesson) => ({ lesson }))
      : loadCategory(categoryId!).then((catalog) => ({ catalog }));
    request
      .then((data) => {
        if (active) setState({ key, ...data, error: false, ready: true });
      })
      .catch(() => {
        if (active) setState({ key, error: true, ready: false });
      });
    return () => {
      active = false;
    };
  }, [key, lessonId, categoryId]);
  return state.key === key ? state : { key, error: false, ready: false };
}
