/** T59：角色短句的大意題干擾選項，解說沿用已核對教材，不增加作品台詞。 */
/** @type {Record<string, [string, string]>} */
export const gameMeaningDistractors = {
"genshin:citlali:join": [
  "我不會幫忙。",
  "我打算自己離開。"
],
"genshin:citlali:skill": [
  "來休息一下！",
  "請不要工作。"
],
"genshin:citlali:burst": [
  "請把事情公開說明。",
  "我會自己處理，不需要幫忙。"
],
"genshin:clorinde:join": [
  "是要我退出決鬥嗎？",
  "我會替你製作服裝。"
],
"genshin:clorinde:skill": [
  "我會躲在影子後面。",
  "請守護影子。"
],
"genshin:clorinde:burst": [
  "可以休息一下了。",
  "清白已經無法挽回。"
],
"genshin:collei:join": [
  "還沒準備好，先別出發。",
  "任務已經結束了。"
],
"genshin:collei:skill": [
  "停下來。",
  "留在這裡。"
],
"genshin:collei:burst": [
  "請把柯里安柏帶走。",
  "這不是柯里安柏。"
],

"genshin:chevreuse:join": [
  "任務已經結束了。",
  "我現在要休息。"
],
"genshin:chevreuse:skill": [
  "把武器拿起來！",
  "請把武器交給我保管。"
],
"genshin:chevreuse:burst": [
  "繼續抵抗！",
  "請先觀察情況。"
],
"genshin:chiori:join": [
  "我現在要離開店裡。",
  "這裡不是千織屋。"
],
"genshin:chiori:skill": [
  "我會自己做完。",
  "請你不要插手。"
],
"genshin:chiori:burst": [
  "由別人決定時尚。",
  "時尚不需要定義。"
],
"genshin:chongyun:join": [
  "我還是不懂。",
  "我忘記這件事了。"
],
"genshin:chongyun:skill": [
  "劍啊，保持原樣。",
  "請把劍交給我。"
],
"genshin:chongyun:burst": [
  "妖魔，請留在這裡。",
  "我來替你帶路。"
],

"genshin:arlecchino:join": [
  "請你讓我安心。",
  "我會把事情交給其他人。"
],
"genshin:arlecchino:skill": [
  "到此為止吧。",
  "請在這裡停下。"
],
"genshin:arlecchino:burst": [
  "如月亮一樣短暫。",
  "月亮已經消失了。"
],
"genshin:charlotte:join": [
  "越是遠離，報導越有真實感。",
  "報導的真實感完全沒有改變。"
],
"genshin:charlotte:skill": [
  "不，現在不要拍照。",
  "拍照已經結束了。"
],
"genshin:charlotte:burst": [
  "由你來報導。",
  "夏洛蒂不會報導。"
],
"genshin:chasca:join": [
  "子彈還沒有裝填。",
  "我打算一個人留下。"
],
"genshin:chasca:skill": [
  "風已經停了。",
  "天氣一直沒有變化。"
],
"genshin:chasca:burst": [
  "請你留在這裡。",
  "快點出現。"
],

  'genshin:aratakiitto:join': [
    '這件事太困難，我會逃走。',
    '請你替我解決這件小事。',
  ],
  'genshin:aratakiitto:skill': ['輪到我上場了。', '你已經完成演出了。'],
  'genshin:aratakiitto:burst': ['請把事情交給別人。', '我不想負責處理。'],
  'genshin:baizhu:join': ['傷口不需要處理。', '我希望別人替我看診。'],
  'genshin:baizhu:skill': ['好吃的藥最沒有用。', '藥物一點也不苦。'],
  'genshin:baizhu:burst': ['治療還需要很長時間。', '我不會替你治療。'],
  'genshin:candace:join': ['請你保障我的安全。', '你的安全無法確認。'],
  'genshin:candace:skill': ['請你離開這裡。', '歡迎你改天再來。'],
  'genshin:candace:burst': ['祝福已經離開我們。', '只有我一人需要祝福。'],

  'genshin:aether:join': ['世界上沒有任何謎團。', '我已經解開所有謎團。'],
  'genshin:aether:skill': ['請把東西撿起來。', '我不會讓任何東西掉落。'],
  'genshin:aether:burst': ['請迎著風走過來。', '風已經停止了。'],
  'genshin:alhaitham:join': ['我有事情要找你。', '我現在很忙。'],
  'genshin:alhaitham:skill': ['我還沒有拿到。', '請把它交還給你。'],
  'genshin:alhaitham:burst': ['整齊地排列好。', '集中在同一個地方。'],
  'genshin:aloy:join': ['請你把手借給我。', '我不需要任何幫助。'],
  'genshin:aloy:skill': ['爆炸已經結束了。', '我不會讓它爆炸。'],
  'genshin:aloy:burst': ['請放開被綁住的人。', '沒有人受到限制。'],

  'genshin:albedo:join': ['我想獨自去探索。', '探索已經結束了。'],
  'genshin:albedo:skill': ['花已經凋謝了。', '請把花收起來。'],
  'genshin:albedo:burst': ['請忘記這項成就。', '我還沒開始做任何事。'],
  'genshin:beidou:join': ['我懷疑你說的話。', '請你相信我。'],
  'genshin:beidou:skill': ['我會把所有東西留下。', '請把東西全部還給我。'],
  'genshin:beidou:burst': ['不要看這裡。', '我已經看過了。'],
  'genshin:razor:join': ['請你自己去。', '我不會去。'],
  'genshin:razor:skill': ['快點過來！', '我會過去。'],
  'genshin:razor:burst': ['停下攻擊吧。', '目標已經逃走。'],

  'genshin:jean:join': ['今天無法出發。', '出發時間還沒決定。'],
  'genshin:jean:skill': ['勝負已經結束。', '這次不想戰鬥。'],
  'genshin:jean:burst': ['請你把劍收起來。', '我不會立下誓言。'],
  'genshin:klee:join': ['可莉需要別人幫忙。', '可莉不願意幫忙。'],
  'genshin:klee:skill': ['請把炸彈收好。', '爆炸已經停止。'],
  'genshin:klee:burst': ['完全停止攻擊。', '只使用很小的火力。'],
  'genshin:diona:join': ['我會把工作交給你。', '我沒有辦法處理。'],
  'genshin:diona:skill': ['請你對我溫柔一點。', '我想要甜的東西。'],
  'genshin:diona:burst': ['醉鬼先生，繼續喝吧。', '我已經反省過了。'],

  'genshin:xiangling:join': ['我忘記帶食材了。', '請你把食材都買回來。'],
  'genshin:xiangling:skill': ['料理時間已經結束了。', '現在沒有時間做料理。'],
  'genshin:xiangling:burst': ['請師父教我新的招式。', '我不會使用師父的招式。'],
  'genshin:xingqiu:join': ['雨水無法改變石頭。', '只有一次努力就能成功。'],
  'genshin:xingqiu:skill': ['這把劍已經壞掉了。', '請把這把劍交給我。'],
  'genshin:xingqiu:burst': ['詩已經消失不見了。', '不要讓詩變得華美。'],
  'genshin:fischl:join': ['請告訴我皇女的名字。', '我會忘記皇女的名字。'],
  'genshin:fischl:skill': ['奧茲，請藏好身影。', '奧茲已經離開了。'],
  'genshin:fischl:burst': ['漆黑之翼啊，停止飛翔吧。', '晝夜已經恢復平靜了。'],

  'genshin:amber:burst': ['每次出手都失敗。', '要求大家停止射擊。'],
  'genshin:bennett:burst': ['大家都必須保護我。', '我不會保護任何人。'],
  'genshin:kaeya:join': ['對這件事毫無期待。', '要求對方不要期待。'],
  'genshin:keqing:burst': ['我自己不會逃走。', '我會放你走。'],
  'genshin:raiden:skill': ['還有很多逃走的路。', '詢問退路在哪裡。'],
  'genshin:zhongli:join': ['我什麼都不需要做。', '所有工作都已完成。'],
  'genshin:zhongli:skill': ['將會持續動搖。', '請對方稍微搖晃。'],
  'genshin:zhongli:burst': ['天道不在這裡。', '詢問天道在哪裡。'],
  'genshin:nahida:join': ['我剛剛才到。', '希望你再等很久。'],
  'genshin:nahida:skill': ['請把手放開。', '大家已經牽好手了。'],
  'genshin:nahida:burst': ['知識只留給自己。', '希望對方失去知識。'],
  'genshin:sucrose:join': ['我不能提供任何幫助。', '我已經幫忙完成了。'],
  'genshin:sucrose:skill': ['吸引測試已結束。', '吸引測試無法開始。'],
  'genshin:sucrose:burst': ['完全不會擴散的狀態。', '回到一般集中形態。'],

  'genshin:noelle:join': ['明確拒絕這次邀請。', '要求對方別再說話。'],
  'genshin:noelle:skill': ['請把事情交給別人。', '說事情已經做完了。'],
  'genshin:noelle:burst': ['現在是休息的時候。', '戰場已經清掃完畢。'],
  'genshin:barbara:join': ['請對方獨自努力。', '勸對方放棄。'],
  'genshin:barbara:skill': ['叫對方不要振作。', '說自己已經累了。'],
  'genshin:barbara:burst': ['命令對方立刻準備。', '確定大家還沒準備好。'],
  'genshin:venti:join': ['要求對方繼續等待。', '說自己早就到了。'],
  'genshin:venti:skill': ['在那邊喔。', '詢問東西在哪裡。'],
  'genshin:venti:burst': ['是火喔。', '要求風停止。'],

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
