# T64 雪：本機原語音試作

日期：2026-10-12。範圍：已安裝 Eternal Return build `25617366`，雪 `Yuki/S000/ja`。原音只作本機查證，未加入公開教材或部署。

## 原音與逐字稿

- catalog 與 Unity bundle container 逐鍵對應，取得 192 個預設造型日文 AudioClip；不以同名 AudioClip 搜尋代替完整路徑。初次探索發現 S000／S005 同名片段會互相覆蓋，該批探索输出不作證據；正式證據使用精確路徑重新提取。
- 候選：`Assets/Addressables/Sound/VOICE/Yuki/S000/ja/Yuki_PlaySkill1011300seq0_1_ja.wav`，時長 1.621655 秒，44,100 Hz、單聲道 PCM。
- bundle：`6b46d1d82d2d438326a559ee7339e7d8.bundle`，SHA-256 `44b50a6277078ee5c99901bd5381e02e1bac8249f658f15376c77e5d9deb6ed0`。
- 候選 WAV SHA-256：`85eef873d9ca8f6cc6e89eefcb6269ec8156d1c696b4cd15c2a3fe858b20331f`。以 manifest 及再次提取逐位元組檢查為準。
- 使用者已在遊戲中確認完整台詞「少し集中を」；無提示詞的本機 small ASR 結果相同。ASR 不等於人工審聽；未由 agent 做人耳／原作演技判定。
- 讀音：`すこし しゅうちゅうを`；合成發音參考：`すこししゅうちゅうお`（助詞を讀お）。
- 繁中草稿：「稍微集中一下。」對象與實際使用情境待核對，不擅自補成對隊友的命令或角色自言自語。
- 文法：少し表示少量／程度；集中在此是名詞，後接を。台詞在を結束，未說出後續述語，不補寫する／してください／させてください等文字，不判定為命令形。を的基本功能參考 [Tae Kim](https://guidetojapanese.org/learn/grammar/verbparticles)，對此片段的省略分析為本次解說。
- 語氣：`pending`；人耳原作抑揚／情緒 `not_scored`。觸發：檔名指向 `PlaySkill1011300seq0`，可分類為「技能播放（檔名線索）」；技能名稱、按鍵、判定時機與 seq 意義仍待確認。使用者後續說明依 PlaySkill 檔名推定，未提供實際情境名稱。
- 同組 `_2`／`_3` 只保存機器草稿；尤其 `_2` 辨識不可靠，不收為正式台詞。其餘 191 檔沒有完成逐字稿。

## 檔名觀察

以下是本機 catalog 的結構觀察與語義線索，不能代替執行中觸發驗證。

典型鍵：`Assets/Addressables/Sound/VOICE/<角色>/<版本>/<語言>/<角色>_<事件>_<變體>_<語言>.wav`。技能事件另含數字與 seq。不能依下劃線固定欄數切割，事件名稱本身也含下劃線。

| 片段 | 本機觀察／分類線索 | 尚未證明 |
| --- | --- | --- |
| `Yuki`、`S000`／`S005`、`ja`／`en`／`ko` | 角色、版本目錄、語言目錄；雪有不同版本共用同名片段 | S005 的造型名稱、是否現行可用；目錄數不是可玩角色數 |
| `PlaySkill1011300seq0_1` | 技能播放類資產；雪此組有 `_1`、`_2`、`_3`，S000 日文共10個 PlaySkill 檔 | 1011300 對應的技能／按鍵、seq0 的實際階段、變體選取規則 |
| `selected`、`selected2`、`firstMove` | 選取、另一選取類別、首次移動的命名線索 | selected2 與 selected 的觸發差別 |
| `learnweaponskill_DualSword`／`TwoHandSword` | 學習武器技能類別，雪各兩個變體 | 學習或施放的實際判定、武器按鍵 |
| `moveInAlley`、`moveInHospital`、`moveRestrictedArea` | 區域移動／限制區線索 | 邊界、冷卻與播放條件 |
| `craftUncommon`／`Rare`／`Epic`／`Legend`／`Mystic`、`makeFood` | 製作與品質類別、食物製作線索 | 實際道具、品質映射與觸發頻率 |
| `collectwater`、`collectstone`、`collectfishRiver`／`Sea` | 採集水、石頭、河／海魚類別線索 | 每個採集點／成功或開始時播放 |
| `kill1Player`～`kill14Player`、`killMonster` | 擊殺玩家／怪物類別，數字是事件名的一部分 | 擊殺累計／連殺／模式差異，不能把數字當台詞变體 |
| `communicationPing_food`／`goodjob`／`sorry`／`thankyou`、`requestItem` | 溝通標記／物品請求線索 | 實際 UI 指令與播放對象 |
| `revive`、`resurrection`、`save`、`lost`、`victory`、`VictoryCutscene` | 救援／復活／勝敗等不同事件鍵 | revive 與 resurrection 的差異、save／lost 的含義 |
| `box`、`rest`、`targetOn`、`setting1`～`setting6` | 有固定分組，可先保留原事件鍵 | 精確情境，尤其 setting 系列不可直接當遊戲背景台詞 |

跨角色 catalog 可見相同 PlaySkill、box、firstMove、moveIn、craft、learnweaponskill 等命名。雪此批為192檔；catalog 清單存在不代表全部音檔已解包或已驗證觸發。大小寫與拼字不完全一致（如 moveIn／movein、communicationPing／communicationping、collectbrunch），索引保留原文，不能自行修正 asset key。

## 合成與證據

- 本機 VOICEVOX 0.25.2、黒沢冴白（100）待審試音，1.418667 秒。經既有 synthesize.mjs 的發音／句界閘門，ffmpeg 全檔解碼通過，metadata 只有 encoder。
- 本機引擎無 Nemo 男声2（雪既有聲線）；試音明示 `VOICEVOX:黒沢冴白`，未修改正式選角或仿製原配音。正式語氣與聲線仍待驗收。
- 192 檔 SHA-256／ffmpeg 全檔解碼零錯誤。新提取工具以完整資產鍵重跑192檔，拒絕既有輸出目錄及 .cache 外的輸出。
- 離線辨識：faster-whisper 1.2.1／small、CPU int8、6 threads，3個1.24～1.62秒片段，暖模型每檔1.539～1.773秒（單輪，不宣稱p95）。預設 PyAV API 不相容，改為 ffmpeg PCM 解碼；所有辨識僅存待審草稿，未上传原音。
- 效能：Windows、Intel Core i7-12700KF、Python 3.14.4、已快取單一 bundle，工具重跑192檔1.027秒（單樣本，門檻10秒）；192檔全解碼8.887秒（門檻15秒）。本機效能，不代表正式站／手機結果；單次暖快取量測，未量測冷啟動或跨硬體結果。
- 原音與草稿證據位於 `.cache/er-yuki-s000/`，重現提取位於 `.cache/er-yuki-repro/`／`.cache/er-yuki-releasegate/`。全部被 Git 忽略，沒有私人絕對路徑或帳號資料。
- T62 是角色資料教材，不是原語音補齊；本次完成本機定位／提取及一句試作，未宣稱192句教材或全角色原語音完成。

## 重跑

使用者自行以環境變數提供本機安裝位置；不把值寫入 repo。

```powershell
python -m pip install --target .cache/voice-tools -r scripts/requirements-er-voice.txt
$env:PYTHONPATH = (Resolve-Path .cache/voice-tools).Path
python scripts/extract-er-yuki.py --asset-root $env:ER_ASSET_ROOT --out .cache/er-yuki-new
```

`ER_ASSET_ROOT` 指向安裝內的 `EternalReturn_Data/StreamingAssets/aa`。工具只讀遊戲檔案；輸出限定 repo .cache 的新子目錄。不修改 catalog、完整性驗證或遊戲執行檔。解析器參考 [AddressablesToolsPy](https://github.com/anosu/AddressablesToolsPy)，音檔提取參考 [UnityPy](https://github.com/K0lb3/UnityPy)；版本鎖定於 requirements。零月費，未啟用付費 API、雲端轉錄或託管。


## 2026-10-12 重複、語言與劇情分類複查

- 192檔逐位元組SHA-256皆不同；統一ffmpeg解碼成16kHz單聲道float32後，192份PCM雜湊亦皆不同。沒有完全相同檔案／PCM；未驗證相同台詞的不同錄音、增益差異或近似音訊，不把192直接稱為192句不同台詞。
- 全192個資產鍵都在ja目錄。small／CPU int8、不指定語言的全量模型篩查：189檔判日文，3檔判英文候選；模型語言標籤不等於實際語言。總耗時274.324秒，非正式效能驗收。
- 三個候選：PlaySkill1011200seq1_1（0.275秒，en 27.4%）、selected2_1（3.346秒，en 38.1%）、setting6_1（1.922秒，en 84.4%）。再以自動語言ASR查證，前兩個只有不可靠片段（selected2 no_speech約0.76）；setting6輸出重複ha，有可能是笑聲而非英文句子。故沒有確認混入英文／韓文台詞，三檔均保留「非語詞／語言待確認」，不採用MEN／I等機器猜字為逐字稿。不能用84%的語言概率宣稱笑聲為英文。
- setting1～6及VictoryCutscene共7檔，時長1.02～6.02秒。部分機器草稿包含完整句子，可列角色閒聊／演出候選；沒有原作觸發或台本證據，不能確認為劇情對話、背景故事，也不把setting1等直接當故事章節。
- 新證據只存在.cache/er-yuki-s000/duplicate-language-audit.json及context-language-candidates.json；完整逐字稿／人工聽辨仍待確認，未改教材／正式音檔或提交。

## 2026-10-12 雪台詞全量初篩與翡翠盤點

使用者追加範圍：從雪192檔找出有語詞內容的台詞，並檢查翡翠（Hisui）的本機語音份數。沒有擴成其他角色逐字稿、正式教材或原音發布。

### 雪的篩選交付

- 192檔均跑完本機small ASR；沿用先前獨立的自動語言篩查，判為ja者用ja辨識，其餘不強制語言。無初始提示詞、不連用上一片段文字，原始結果保留，未自行改同音字。CPU int8／6 threads，本輪335.0秒，非正式效能Gate。
- 分組187個「有語詞台詞候選」、1個「笑聲候選」、4個「短音／辨識不可靠待確認」。187中僅少し集中を有使用者確認，其他186仍是機器草稿；分類完成不等於逐字稿、讀音、翻譯、語氣或觸發已驗收。
- 待確認：PlaySkill1011200seq1_1／_2／_3與selected2_1。前者可能是短語詞或喊聲，不因ASR輸出MEN／あはっ／はっ就直接剔除或寫成正式台詞。笑聲候選為setting6_1，不把ha當英語台詞。
- ASR同句候選有兩組：VictoryCutscene與victory_1；callRemoteDrone_2與lootCorpsSelfKill_1。聲音雜湊不同，尚未確認是否逐字相同，不直接去掉原音。
- 真實原音已複製至 `.cache/er-yuki-s000/selection/spoken-line/`、`nonverbal-candidate/`、`pending/`，192個拷貝雜湊全部一致。分組m3u8供連續播放，line-selection.json包含檔名、原音雜湊、草稿及確認狀態。沒有補猜ASR的県／剣等同音字，也沒有把完整機器稿加入公開教材。

### 翡翠 Hisui 的實檔數

遊戲版本與雪相同（build25617366）。完整角色鍵為 `Assets/Addressables/Sound/VOICE/Hisui/`；全部1282個catalog鍵均在實際bundle container找到，不計其他角色對翡翠的台詞。S002僅記版本目錄，造型名稱未核對。

| 版本目錄 | 日文 | 日文原WAV雜湊去重 | 英文資產 | 韓文資產 |
| --- | ---: | ---: | ---: | ---: |
| S000 | 220 | 216 | 220 | 221 |
| S002 | 207 | 204 | 207 | 207 |
| 合計 | 427 | 420 | 427 | 428 |

- 日文427檔已提取，全部ffmpeg完整解碼成功、零錯誤。去重是位元組SHA-256，不是台詞語義去重，也沒有完成翡翠的語言／非語詞篩查，因此420不稱為420句台詞。
- 7組完全相同檔案：S000一組PlaySkill1078200seq0_3／_4；S000與S002各三組moveInHarbor_1～3／moveinBargeship_1～3。兩版本間未發現相同WAV雜湊。
- 實際bundle：099cbcb682c0efd64e0047bb4ec125d5.bundle。匿名化索引位於 `.cache/er-hisui/catalog-inventory.json`，提取及雜湊證據位於 `.cache/er-hisui-original/manifest.json`。
- 本機提取427檔2.950秒、完整解碼28.416秒（同機CPU與暖快取；此工作量為427檔，不套用先前192檔15秒門檻，不宣稱新增正式Gate通過）。
- 本次只增本機查證產物與既有文件紀錄，沒有改前端／教材／正式音檔；未重跑前次已通過的252項UI／契約檢查。git check-ignore及diff --check通過，原音不入Git，未提交、推送、部署或繞過hook。

## 2026-10-12 選角命名候選縮小範圍

使用者希望改找選角階段語音。雪S000與翡翠S000／S002各有selected_1與selected2_1，合計6個日文原音。已獨立整理至.cache/er-character-selection/，6個拷貝雜湊與原音一致；selected.m3u8為三個短音、selected2.m3u8為另一類三檔，manifest保留完整遊戲資產鍵。

| 角色／版本 | selected_1 | selected2_1 |
| --- | ---: | ---: |
| 雪 S000 | 1.367秒 | 3.346秒 |
| 翡翠 S000 | 2.425秒 | 9.807秒 |
| 翡翠 S002 | 3.169秒 | 11.032秒 |

雪selected_1的機器草稿為「では僕の番ですね」，未由人耳核對。翡翠三個較長／短的可辨識片段仍保存原ASR草稿，包含自報名字及戰鬥準備內容，不自行修補人名、漢字或同音誤字。雪selected2_1的辨識不可靠，manifest不填正式文字。

本機catalog搜尋未取得能證明一般選角呼叫selected／selected2的事件映射資料。命名只能支持選取相關候選，不能直接標為點頭像、鎖定角色或選角動畫某一階段；selected2也不宣稱就是第二句。實際遊戲選角畫面與逐字稿均保留pending。本次未新增教材／合成檔或部署原音。

使用者後續確認：雪S000 selected_1「では僕の番ですね」確為選角台詞。讀音では ぼくの ばんですね、繁中「那麼，輪到我了呢。」及文法解說已保存選角manifest，點選／鎖定細節與原作語氣仍pending；本機VOICEVOX黒沢冴白待審試音已生成且全解碼通過。本機引擎沒有既有Nemo男声2，不改正式選角。確認台詞現在共2句（含少し集中を）。版本目錄S000／S002與事件鍵selected／selected2是不同層次，兩事件可在同一造型共存，不能直接相互映射。

## 2026-10-12 翡翠原造型／幽靈獵人對應已查證

依使用者要求查證造型，不以台詞內容推斷。專案既有[固定版本CharacterSkin.json](https://github.com/pypy-vrc/er-gamedata/blob/ea359154465075aa61a668efde014db076820a03/data/CharacterSkin.json)直接記載：

| code | 造型名稱／index | voicePath |
| --- | --- | --- |
| 1078000 | Hisui／0，原造型 | Sound/VOICE/Hisui/S000 |
| 1078001 | Street Fiend Hisui／1，暗巷裡 翡翠 | Sound/VOICE/Hisui/S000 |
| 1078002 | Ghost Hunter Hisui／2，幽靈獵人 翡翠 | Sound/VOICE/Hisui/S002 |

同版本Japanese.txt的Skin/Name/1078002為ゴーストハンター ヒスイ，ChineseTraditional.txt為幽靈獵人 翡翠。名稱另以[繁中官方介紹](https://event.playeternalreturn.com/ER/CHARACTER%26SKIN?hl=zh-TW)及[日文官方公告3158](https://playeternalreturn.com/posts/news/3158?hl=ja-JP)核對。造型voicePath與本機已提取完整資產鍵一致，可确认S002是幽靈獵人專用語音；S000是原造型語音且也被暗巷裡造型引用，不應聲稱每個造型皆有獨立語音。

[Japanese.txt](https://github.com/pypy-vrc/er-gamedata/blob/ea359154465075aa61a668efde014db076820a03/l10n/Japanese.txt)的專用Skin/OnSelectVO/1078002明確為「斬り落とすべき悪は、この剣で裁く。」與本機S002 selected_1的ASR音讀相符。已用來源文字修正斬／裁く，保留ASR原稿；不是自行將砂漠猜改成裁く。可確認選角欄位的語句及造型來源，實際UI的點選／鎖定時機仍未實測。

S000 selected_1未找到完整對應文字欄位，先前「ひっすい！いつでも準備オッケー！」仍是待核對ASR草稿，不把造型確認當成逐字稿確認。精簡證據在.cache/er-hisui/skin-mapping-evidence.json，選角manifest已補造型名及S002查證原句，未改公開教材或音檔。
