import { defineLesson, audioPath } from './author.mjs';
import { voices } from './voices.mjs';

/** @param {import('./author.mjs').LessonSpec} spec
 * @param {import('../lib/scene-listening.mjs').ListeningScene} scene
 * @returns {import('./lessons.mjs').Lesson} */
export function defineGeneralLesson(spec, scene) {
  const lesson = defineLesson(spec);
  lesson.vocab.forEach((line, i) => {
    line.voice = voices[i % voices.length].key;
    line.audio = audioPath(spec.audio, 'vocab', line.word, line.voice);
  });
  lesson.grammar.forEach((point, i) =>
    point.examples.forEach((line) => {
      line.voice = i % 2 === 0 ? 'sayo' : 'nemo2';
      line.audio = audioPath(spec.audio, 'gram', line.jp, line.voice);
    }),
  );
  lesson.dialogue.forEach((line, i) => {
    line.voice = i % 2 === 0 ? 'hau' : 'nemo2';
    line.audio = audioPath(spec.audio, 'dlg', line.jp, line.voice);
  });
  lesson.scene = scene;
  return lesson;
}

/** 六階段各30課是擴充目標，僅已完成的課程提供入口。 */
export const generalListeningRoadmap = [
  {
    title: '聲音與基本句子',
    goal: '抓住人物、動作、否定與基本指示',
    target: 30,
  },
  { title: '日常互動', goal: '理解請求、邀請、原因與同伴聊天', target: 30 },
  { title: '作品常見口語', goal: '辨認縮略、省略、命令與句尾語氣', target: 30 },
  { title: '劇情理解', goal: '理解條件、意圖、轉折與事件經過', target: 30 },
  { title: '情境詞彙', goal: '探索、戰鬥、魔法、推理與人際關係', target: 30 },
  { title: '綜合聽解', goal: '練習較長對話、指代與隱含意思', target: 30 },
];
