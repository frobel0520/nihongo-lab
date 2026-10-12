/** T59：角色短句的大意題干擾選項，解說沿用已核對教材，不增加作品台詞。 */
import { erReferenceDistractors } from './game-character-reference.mjs';
/** @type {Record<string, [string, string]>} */
export const gameMeaningDistractors = {
  ...erReferenceDistractors,
  'lol:ahri:select': ['你已經把我抓住了。', '請你不要相信我。'],
  'lol:ahri:attack': ['你可以再逃走一次。', '我已經離開了。'],
  'lol:yasuo:select': ['死亡已經離我們很遠。', '命令對方立刻死亡。'],
  'lol:yasuo:attack': ['我會放你離開。', '你已經逃走了。'],
  'lol:lux:select': ['要求對方把光關掉。', '說自己不在戰場上。'],
  'lol:lux:attack': ['讓黑暗留下來。', '黑暗已經燒盡了。'],
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
};
