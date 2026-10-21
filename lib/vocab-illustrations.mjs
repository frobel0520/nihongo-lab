/** T151：僅核實過的12張卡；ID、讀音與義項必須同時吻合，不按字面自動擴展。 */
export const VOCAB_ILLUSTRATIONS = [
  {
    "id": "stage0-day6:パン",
    "word": "パン",
    "reading": "パン",
    "zh": "麵包",
    "src": "images/vocab/bread.svg",
    "alt": "切片麵包"
  },
  {
    "id": "stage0-day14:地図",
    "word": "地図",
    "reading": "ちず",
    "zh": "地圖",
    "src": "images/vocab/map.svg",
    "alt": "折疊地圖與位置標記"
  },
  {
    "id": "stage0-day2:傘",
    "word": "傘",
    "reading": "かさ",
    "zh": "雨傘",
    "src": "images/vocab/umbrella.svg",
    "alt": "撐開的雨傘"
  },
  {
    "id": "stage0-day6:卵",
    "word": "卵",
    "reading": "たまご",
    "zh": "蛋",
    "src": "images/vocab/egg.svg",
    "alt": "一顆完整的蛋"
  },
  {
    "id": "stage0-day6:魚",
    "word": "魚",
    "reading": "さかな",
    "zh": "魚",
    "src": "images/vocab/fish.svg",
    "alt": "一條魚"
  },
  {
    "id": "stage0-day2:本",
    "word": "本",
    "reading": "ほん",
    "zh": "書",
    "src": "images/vocab/book.svg",
    "alt": "一本合起來的書"
  },
  {
    "id": "stage0-day7:かぎ",
    "word": "かぎ",
    "reading": "かぎ",
    "zh": "鑰匙",
    "src": "images/vocab/key.svg",
    "alt": "一把鑰匙"
  },
  {
    "id": "stage0-day10:いす",
    "word": "いす",
    "reading": "いす",
    "zh": "椅子",
    "src": "images/vocab/chair.svg",
    "alt": "一張椅子"
  },
  {
    "id": "stage0-day2:時計",
    "word": "時計",
    "reading": "とけい",
    "zh": "鐘、錶",
    "src": "images/vocab/clock.svg",
    "alt": "圓形指針時鐘，鐘錶的一例"
  },
  {
    "id": "stage0-day3:学校",
    "word": "学校",
    "reading": "がっこう",
    "zh": "學校",
    "src": "images/vocab/school.svg",
    "alt": "有教室與校舍的學校"
  },
  {
    "id": "stage0-day14:橋",
    "word": "橋",
    "reading": "はし",
    "zh": "橋",
    "src": "images/vocab/bridge.svg",
    "alt": "跨越河流的拱橋"
  },
  {
    "id": "stage0-day13:公園",
    "word": "公園",
    "reading": "こうえん",
    "zh": "公園",
    "src": "images/vocab/park.svg",
    "alt": "有樹木、長椅與步道的公園"
  }
];

/** @param {Pick<import('./srs.mjs').Card, 'id' | 'word' | 'reading' | 'zh'>} card */
export function illustrationFor(card) {
  return VOCAB_ILLUSTRATIONS.find(item => item.id === card.id && item.word === card.word && item.reading === card.reading && item.zh === card.zh);
}
