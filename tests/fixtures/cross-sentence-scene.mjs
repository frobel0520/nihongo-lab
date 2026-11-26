// Original dialogue for the playback contract test. Tones are test media only.
const lines = [
  [
    '三時に駅の東口で会おう。',
    'さんじ に えき の ひがしぐち で あおう。',
    '三點在車站東口見吧。',
  ],
  [
    '三時はまだ仕事中なんだ。',
    'さんじ は まだ しごとちゅう なんだ。',
    '三點我還在工作。',
  ],
  [
    'じゃあ、何時なら来られる？',
    'じゃあ、なんじ なら こられる？',
    '那你幾點能來？',
  ],
  ['四時なら大丈夫。', 'よじ なら だいじょうぶ。', '四點的話沒問題。'],
  [
    'お店には四時半までに入ればいいよ。',
    'おみせ には よじはん まで に はいれば いいよ。',
    '四點半以前進店就行。',
  ],
  [
    'お店まで歩いて十分ぐらいだよね。',
    'おみせ まで あるいて じゅっぷん ぐらい だよね。',
    '走到店裡大概十分鐘對吧。',
  ],
  [
    'うん。じゃあ、時間だけ変えよう。',
    'うん。じゃあ、じかん だけ かえよう。',
    '對。那就只改時間吧。',
  ],
  [
    'わかった。場所はそのままで。',
    'わかった。ばしょ は そのまま で。',
    '好，地點照舊。',
  ],
  [
    'じゃあ、駅で待ってるね。',
    'じゃあ、えき で まってる ね。',
    '那我在車站等你喔。',
  ],
];

export const crossSentenceFixture = {
  // The browser harness replaces this lesson payload only in its disposable build.
  id: 'general-listening-01',
  title: '同伴臨時改約',
  vocab: [],
  grammar: [],
  practice: [],
  dialogue: lines.map(([jp, reading, zh], i) => ({
    jp,
    reading,
    zh,
    voice: i % 2 ? 'nemo2' : 'hau',
    audio: `audio/test-cross-sentence/line-${i + 1}.mp3`,
  })),
  scene: {
    goal: '聽兩位同伴商量改約，找出最後的時間、地點和決定理由。',
    questions: [
      {
        id: 'reschedule-gist',
        prompt: '這段對話主要在商量什麼？',
        options: [
          '把見面時間延後，地點照舊',
          '取消見面，改到隔天',
          '照原時間見面，改到店裡集合',
        ],
        answer: 0,
        explanation:
          '有人三點還在工作，四點才能來。兩人最後提議只改時間，並同意保留原地點。',
        evidenceLines: [2, 4, 7, 8],
      },
      {
        id: 'reschedule-detail',
        prompt: '他們最後約幾點、在哪裡見？',
        options: ['三點在車站東口', '四點在車站東口', '四點半直接到店裡'],
        answer: 1,
        explanation:
          '四點是新的會合時間。「地點照舊」指原先約好的車站東口；四點半是最晚進店時間。',
        evidenceLines: [1, 4, 5, 8],
      },
      {
        id: 'reschedule-intent',
        prompt: '提到「走到店裡大概十分鐘」，在確認什麼？',
        options: [
          '工作還剩多久',
          '店家會保留座位多久',
          '四點見面後是否來得及進店',
        ],
        answer: 2,
        explanation: '四點見面後走約十分鐘，仍趕得上四點半的入店時間。',
        evidenceLines: [4, 5, 6],
      },
    ],
  },
};
