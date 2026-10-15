import { resolve, dirname } from 'node:path';
import { packCurriculumIndex } from '../lib/curriculum-pack.mjs';
import { serializeCurriculumPayload } from './serialize-curriculum.mjs';
import {
  stages,
  gameCharacterStudy,
  genshinActionCoverage,
  genshinSupplement,
  gameMeaningDistractors,
  curriculumSummary,
} from '../curriculum/lessons.mjs';
import { RUBY_NOTES } from '../curriculum/ruby-notes.mjs';
import { createStudyCatalog } from '../lib/catalog-build.mjs';
import { allAudioPaths } from '../lib/offline.mjs';
import { plainText, parseRuby } from '../lib/furigana.mjs';
const PREFIX = 'virtual:nihongo-curriculum/';
const root = resolve(import.meta.dirname, '..');
/** Include only annotations for strings displayed by this payload.
 * @param {unknown} value */
export function notesFor(value) {
  const strings = new Set();
  const visit = (/** @type {unknown} */ item) => {
    if (typeof item === 'string') strings.add(item);
    else if (Array.isArray(item)) item.forEach(visit);
    else if (item && typeof item === 'object')
      Object.values(item).forEach(visit);
  };
  visit(value);
  // Plain entries record author review, but add no ruby at runtime.
  // Keep them in RUBY_NOTES for the review gate; transmit only actual annotations.
  return RUBY_NOTES.filter((note) => {
    const parts = parseRuby(note);
    return parts.some((part) => part.ruby) && strings.has(plainText(parts));
  });
}
/** Build artifacts are derived exclusively from curriculum/lessons.mjs; never a second authored source. */
export function curriculumPayloads() {
  const lessons = stages.flatMap((s) => s.lessons);
  const categories = createStudyCatalog(stages, gameCharacterStudy);
  const games = {
    gameCharacterStudy,
    genshinActionCoverage,
    genshinSupplement,
  };
  /** @type {Map<string,{data:unknown,notes:string[]}>} */
  const payloads = new Map();
  for (const l of lessons)
    payloads.set('lesson/' + l.id, { data: l, notes: notesFor(l) });
  for (const [id, c] of Object.entries(categories))
    payloads.set('category/' + id, { data: c, notes: notesFor(c) });
  payloads.set('games', { data: games, notes: notesFor(games) });
  payloads.set('all-audio', {
    data: allAudioPaths(
      stages,
      gameCharacterStudy.flatMap((g) =>
        g.characters.flatMap((c) =>
          c.lines.filter((l) => l.audioReady !== false).map((l) => l.audio),
        ),
      ),
    ),
    notes: [],
  });
  for (const stage of stages)
    payloads.set('stage-audio/' + stage.id, {
      data: allAudioPaths([stage]),
      notes: [],
    });
  return payloads;
}
/** @returns {import('vite').Plugin} */
export function curriculumChunks() {
  const payloads = curriculumPayloads();
  const loaders = [...payloads.keys()]
    .map(
      (key) =>
        `${JSON.stringify(key)}:()=>import(${JSON.stringify(PREFIX + key)})`,
    )
    .join(',\n');
  const facade = `
import {registerRubyNotes} from ${JSON.stringify(resolve(root, 'lib/ruby-note-store.mjs'))};
import {createPayloadLoader} from ${JSON.stringify(resolve(root, 'lib/payload-loader.mjs'))};
import {unpackCurriculumIndex} from ${JSON.stringify(resolve(root, 'lib/curriculum-pack.mjs'))};
export const curriculumSummary=unpackCurriculumIndex(${JSON.stringify(packCurriculumIndex(curriculumSummary))});
export {generalListeningRoadmap,generalListeningGroupTitle,GENERAL_LISTENING_GROUP_SIZE} from ${JSON.stringify(resolve(root, 'curriculum/general-listening.mjs'))};
export const gameMeaningDistractors=${JSON.stringify(gameMeaningDistractors)};
registerRubyNotes(${JSON.stringify(notesFor(curriculumSummary))});
const loaders={${loaders}};
const load=createPayloadLoader(loaders,registerRubyNotes);
export const loadLesson=id=>load('lesson/'+id);
export const loadCategory=id=>load('category/'+id);
export const loadGameData=()=>load('games');
export const loadStageAudioPaths=id=>load('stage-audio/'+id);
export const loadAllAudioPaths=()=>load('all-audio');
export async function loadLessonAudioPaths(id){const l=await loadLesson(id);if(!l)return [];return [...new Set([...l.vocab.map(v=>v.audio),...l.grammar.flatMap(g=>g.examples.map(e=>e.audio)),...l.grammar.flatMap(g=>(g.quoteExamples??[]).map(e=>e.quote.audio)),...l.dialogue.map(d=>d.audio),...(l.quotes??[]).map(q=>q.audio),...(l.training?[...l.training.clips,...l.training.review].map(c=>c.quote.audio):[])])];}
`;
  return {
    name: 'nihongo-curriculum-chunks',
    enforce: 'pre',
    resolveId(id, importer) {
      if (id.startsWith(PREFIX)) return '\0' + id;
      if (
        importer &&
        resolve(dirname(importer), id) ===
          resolve(root, 'curriculum/lessons.mjs')
      )
        return '\0' + PREFIX + 'entry';
    },
    load(id) {
      if (id === '\0' + PREFIX + 'entry') return facade;
      if (id.startsWith('\0' + PREFIX)) {
        const payload = payloads.get(id.slice(PREFIX.length + 1));
        if (payload) return serializeCurriculumPayload(payload);
      }
    },
  };
}
