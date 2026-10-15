import { stages, gameCharacterStudy } from '../curriculum/lessons.mjs';
import { createStudyCatalog } from './catalog-build.mjs';
/** @typedef {{ cards: import('./srs.mjs').Card[], sentences: import('./dictation.mjs').Sentence[] }} StudyCatalog */
export const STUDY_CATALOG = createStudyCatalog(stages, gameCharacterStudy);
