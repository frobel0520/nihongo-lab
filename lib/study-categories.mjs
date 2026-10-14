/** 四個共用教材類別，所有練習使用相同入口。 */
export const STUDY_CATEGORIES = [
  {
    id: 'n5',
    title: 'N5',
    stageId: 'stage-0',
    description: '基礎單字、文法例句與日常對話。',
  },
  {
    id: 'general',
    title: '動漫遊戲通用',
    stageId: 'stage-1',
    description: '通用課程的單字、句型與原創男女聲對話。',
  },
  {
    id: 'anime',
    title: '口語與動畫',
    stageId: 'stage-2',
    description: '作品口語、動畫短台詞與教學例句。',
  },
  {
    id: 'games',
    title: '遊戲角色',
    stageId: '',
    description: '角色短台詞；卡片以原句與意思練習，另可聽寫與跟讀。',
  },
];
/** @typedef {'n5' | 'general' | 'anime' | 'games'} StudyCategoryId */
