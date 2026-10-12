/** T59：角色短句的大意題干擾選項，解說沿用已核對教材，不增加作品台詞。 */
import { erReferenceDistractors } from './game-character-reference.mjs';
/** @type {Record<string, [string, string]>} */
export const gameMeaningDistractors = {
  ...erReferenceDistractors,
  'er:jackie:prepare': ['刀刃已經不需要磨了。', '禁止任何人磨刀。'],
  'er:jackie:pursue': ['讓敵人安全離開。', '敵人已經投降了。'],
  'er:aya:aim': ['已經放棄瞄準。', '請不要瞄準。'],
  'er:aya:protect': ['我已經保護過同伴。', '我不會保護同伴。'],
  'er:hyunwoo:resolve': ['我必須立刻倒下。', '我想休息，已經不在乎了。'],
  'er:hyunwoo:stand': ['再也不站起來了。', '命令對方保持坐著。'],
  'er:magnus:profile': [
    '詢問馬格努斯是不是別人。',
    '說自己從來沒有騎過摩托車。',
  ],
  'er:fiora:profile': ['稱讚對方姿勢很標準。', '說自己的腰已經不痛了。'],
  'er:rozzi:profile': ['請立刻開始工作。', '我完全不累。'],
  'er:yuki:profile': ['我確定自己什麼都做不到。', '請你把所有工作都交給別人。'],
  'er:silvia:profile': ['那看起來很無聊。', '我不想知道那件事。'],
  'er:william:profile': ['我會繼續讓著你。', '請你不要對我認真。'],
  'genshin:amber:join': ['我拒絕接受這件事。', '你已經把事情交給別人了。'],
  'genshin:amber:skill': ['兔兔伯爵，停止行動！', '兔兔伯爵已經戰敗。'],
  'genshin:bennett:join': ['禁止對方行動。', '命令對方立刻變厲害。'],
  'genshin:bennett:skill': ['燃燒已經停止了。', '不要燃燒。'],
  'genshin:raiden:join': ['請先離開我。', '你已經跟著我回來了。'],
  'genshin:raiden:burst': ['閃電即將停止。', '向對方詢問永恆是什麼。'],
  'genshin:kaeya:skill': ['請對方自由活動。', '說對方已經很安分。'],
  'genshin:kaeya:burst': ['希望對方感冒。', '自己已經感冒了。'],
  'genshin:diluc:join': ['不准對方離開。', '已經出發了。'],
  'genshin:diluc:burst': ['判決已被撤銷。', '請對方替自己下判決。'],
  'genshin:keqing:join': ['時間多得用不完。', '邀請對方繼續等待。'],
  'genshin:keqing:skill': ['禁止對方前進。', '對方已經回來了。'],
};
