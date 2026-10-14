import { buildNotesIndex } from './ruby-notes.mjs';
/** @type {Map<string, import('./furigana.mjs').RubyPart[]>} */
let index = new Map();
const listeners = new Set();
/** @param {readonly string[]} notes */
export function registerRubyNotes(notes) {
  const added = buildNotesIndex(notes);
  if (![...added.keys()].some((k) => !index.has(k))) return;
  index = new Map([...index, ...added]);
  for (const listener of listeners) listener();
}
export const getRubyNotes = () => index;
/** @param {()=>void} listener */
export function subscribeRubyNotes(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
