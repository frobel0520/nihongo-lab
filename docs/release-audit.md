# Release audit — 0.1.0

已發布並在手機真機驗證成功：<https://frobel0520.github.io/nihongo-lab/>。目前上線版完成 T01～T06、T09（PWA）；T07、T13 的文字內容已上線、音檔待產生，見 [task-breakdown.md](task-breakdown.md)。

## 已執行

- `npm install`：0 vulnerabilities。
- `npm run check`：typecheck、2 項測試、lint 全通過。
- `npm run dev` 起本機伺服器並用瀏覽器開啟首頁：四個學習階段正常渲染，無 console 錯誤。
- `npm run build`：純靜態產物建置通過（dist/ 3 個檔案）。
- 2026-09-29：`scripts/synthesize.mjs` 對本機 VOICEVOX 引擎（DirectML 版）實測一句（ずんだもん），輸出 96kbps mp3（50KB），ffmpeg 轉檔正常，`npm run check` 加入新檔後仍全過。
- 2026-09-29：第 0 階段第 1 天教材（です／は／も、9 單字、4 個文法點、6 句對話、5 題練習）寫入 `curriculum/lessons.mjs`，`scripts/build-audio-jobs.mjs` 產生 23 筆合成清單，`scripts/synthesize.mjs --batch` 全部成功，音檔共 532KB 存在 `public/audio/stage-0/day1/`。App.tsx 接上畫面渲染，瀏覽器驗證：頁面文字、練習題「看答案」互動、音檔 HTTP 200 且 content-type 正確，均正常，無 console 錯誤。`npm run check` 全過（新增 `jsx-a11y/media-has-caption` 例外，因每個 `<audio>` 旁都已有對應文字逐字稿）。
- 2026-09-29：public repository 建立並推送：[github.com/frobel0520/nihongo-lab](https://github.com/frobel0520/nihongo-lab)。
- 2026-09-29：PWA 骨架（`vite-plugin-pwa` + `@vite-pwa/assets-generator`）。`npm run build` 產出 `dist/sw.js`、`dist/manifest.webmanifest`，precache 18 項（約 206KB）。瀏覽器驗證：`npm run dev` 下 service worker 註冊並 `activated`、manifest 可抓到且含 4 個 icon、無 console 錯誤。UI 改版套用 learning-atlas 的設計系統（卡片、CSS 變數色票、Noto Sans TC + IBM Plex Mono），固定亮色模式，桌面與手機寬度（375px）都截圖確認排版正常。`npm run check`、`npm run build` 全過。
- 2026-09-29：GitHub Pages 部署上線（GitHub Actions，`.github/workflows/ci.yml`），<https://frobel0520.github.io/nihongo-lab/> HTTP 200，正式網址上 service worker `activated`、無 console 錯誤。
- 2026-09-29：Android 手機真機安裝測試。第一次安裝後音檔播不出來，查出教材音檔路徑寫死絕對路徑、在 `/nihongo-lab/` 子路徑下變成 404；改用 `import.meta.env.BASE_URL` 組路徑後修正。診斷過程中一度誤判是 Range request 問題、加了 `RangeRequestsPlugin`，後來發現這套件在 Node 環境匯入會噴 `self is not defined`，把 `npm run dev` 弄壞，已移除復原。修正版部署後，手機清除網站資料重新安裝，**確認可開啟、音檔正常播放**。
- 2026-09-29：手機版排版問題——`<audio controls>` 原生寬度較寬，把兩欄式排版的文字欄擠壓變窄。加 640px 斷點改成文字滿版、播放器獨立一行；`npm run dev` 下手機寬度（375px）截圖確認修正後正常。
- 2026-09-30：T06 SRS 單字卡與 T04 聽寫（分支 `feature/T06-T04`）。純邏輯放 `lib/`（`srs.mjs`、`dictation.mjs`、`progress.mjs`），新增 3 個測試檔共 19 項測試，`npm test` 21 項全過；`npm run typecheck`、`npm run lint`（`npm run check`）通過，`npm run build` 通過（PWA precache 18 項）。瀏覽器（桌面與 375px 寬）實測：單字卡翻面、鍵盤 1～4 評分、答「還不會」的卡排回佇列尾端、`localStorage` 寫入的到期日／ease 與預期一致、重新整理後佇列由存檔重建；聽寫比對標出漏聽字、答對後 `passed` 記入存檔且不被之後答錯洗掉、一次 Enter 只送出一次；模擬 `setItem` 丟例外時畫面顯示「無法儲存進度」且仍可繼續複習；音檔請求 206。無 console 錯誤。
- 2026-09-30：T05 跟讀（分支 `feature/T05`，疊在 `feature/T06-T04` 之上）。新增 `lib/shadowing.mjs`（留白長度）與 3 項測試。瀏覽器實測：開始跟讀 3 輪，狀態依序為「聽 → 換你念 → 聽 → 換你念 → 聽」後自動停止；中途按停止立即靜音、不誤報「音檔無法播放」；無 console 錯誤。不含調速（2026-09-30 決定不做）。
- 2026-09-30：T07 口語轉換表與 T13 動畫名句首批（文字內容，音檔未合成）。`curriculum/lessons.mjs` 新增第 2 階段兩課：口語轉換表（10 個重點、20 句對照例句、6 題練習）、動畫名句（8 句，每句含出處與解說、3 題練習）。新增 `tests/lessons.test.mjs`（課程 id 唯一、角色合法、音檔路徑唯一、`audioReady` 不是 false 的課程音檔必須存在、名句必須有出處與解說、`audioReady: false` 的課程不進聽寫與跟讀句庫），`npm run check` 30 項測試全過，`npm run build` 通過。瀏覽器實測：課程下拉選單可切到名句課，顯示 8 句、8 個「音檔待產生」、沒有播放器；聽寫與跟讀仍是 14 句，未混入待產生的課程。`scripts/build-audio-jobs.mjs --missing` 列出 28 筆待合成項目。
- 2026-09-30：部署與正式站驗證。PR [#1](https://github.com/frobel0520/nihongo-lab/pull/1) 用 rebase 接回 main（遠端 `main` 為 `9ecb09d`），GitHub Actions run `36663190159` 的 `check`、`deploy` 兩個 job 都成功。在正式站 <https://frobel0520.github.io/nihongo-lab/> 實測：四個分頁都在；跟讀 3 輪輪播正常、音檔路徑帶 `/nihongo-lab/`；課程選單有 3 課，口語轉換表 10 個重點、20 處「音檔待產生」且沒有播放器，動畫名句 8 句；單字卡 9 張新卡、聽寫 14 句且未混入待產生的課程；無 console 錯誤。未在正式站送出任何答案或評分。
- 2026-09-30：T13 增補ちいかわ 2 句、ポケモン 3 句、原神 2 句（分支 `feature/T13-games-quotes`），名句課共 15 句，課名改為「動畫與遊戲名句」，另加 3 題練習。`npm run check`（30 項測試）通過；`build-audio-jobs.mjs --missing` 現列出 35 筆待合成項目。台詞用字用網路搜尋與網頁讀取查證，沒有找到確切用字的（例如鍾離的「塵となれ」）不收。
- 2026-09-30：T13 再增補NARUTO 1 句、葬送のフリーレン 2 句、崩壊：スターレイル 3 句、鬼滅の刃 3 句（分支 `feature/T13-games-quotes`），名句課共 24 句、10 題練習。`npm run check`（30 項測試）通過；`build-audio-jobs.mjs --missing` 現列出 44 筆待合成項目。
- 2026-09-30：T13 第三批增補ジョジョ 3、しゅごキャラ 1、こどものおもちゃ（玩偶遊戲）2、犬夜叉 1、涼宮ハルヒ 2、ヴァイオレット・エヴァーガーデン 2、地縛少年花子くん 2、薬屋のひとりごと 2、俺だけレベルアップな件 2 共 17 句，名句課共 41 句、15 題練習。`npm run check`（30 項測試）通過；`build-audio-jobs.mjs --missing` 現列出 61 筆待合成項目。
- 2026-09-30：T13 第四批增補進撃の巨人 2、呪術廻戦 1、SPY×FAMILY 1、僕のヒーローアカデミア 2、機動戦士ガンダム 2、ドラゴンボール 2、魔法少女まどか☆マギカ 1、推しの子 1、天空の城ラピュタ 2、ドラゴンクエスト 1、スプラトゥーン 1，共 16 句（分支 `feature/T13-quotes-batch4`），名句課共 57 句、20 題練習。作品由我自行挑選（Michael 只說「再新增一批作品」），選擇標準是招牌句夠短、口語特徵明顯、找得到來源對照。`npm run check`（30 項測試）通過；`build-audio-jobs.mjs --missing` 現列出 77 筆待合成項目。

## 驗證邊界

聽寫的答案比對只接受「整句漢字原文」或「整句假名讀音」；混合寫法（例如「田中さんはせんせいです」）會被判有差異並標出漢字與假名的落差。日文輸入法選字時按 Enter 不送出的防護（`isComposing`）已寫入，但瀏覽器自動化工具無法輸入日文，實際 IME 與手機鍵盤未測。單字卡與聽寫只在桌面瀏覽器與 375px 模擬寬度驗證，未在 Android／iOS 真機操作。SRS 排程參數（間隔倍率、每日新卡 10 張）是 SM-2 簡化版的預設值，尚未用長期使用資料調整。

動畫名句的台詞用字：8 句都用網路搜尋交叉確認過寫法（2026-09-30），查到的都是二手來源（百科、名言整理網站），不是原作台本。查證過程更正了兩處：「僕は新世界の神となる」原本記成「になる」，「月に代わっておしおきよ」多寫了逗號。來源：[SLAM DUNK](https://www.sladunclub.com/dont-give-up/)、[北斗の拳](https://news.mynavi.jp/article/20230123-2567747/)、[名探偵コナン](https://dic.pixiv.net/a/%E7%9C%9F%E5%AE%9F%E3%81%AF%E3%81%84%E3%81%A4%E3%82%82%E3%81%B2%E3%81%A8%E3%81%A4)、[エヴァンゲリオン](https://www.animatetimes.com/news/details.php?id=1622773829)、[セーラームーン](https://dic.pixiv.net/a/%E6%9C%88%E3%81%AB%E4%BB%A3%E3%82%8F%E3%81%A3%E3%81%A6%E3%81%8A%E3%81%97%E3%81%8A%E3%81%8D%E3%82%88)、[ONE PIECE](https://www.animatetimes.com/news/details.php?id=1633076586)、[氷菓](http://phoenix-wind.com/character/chitanda_eru.php)、[DEATH NOTE](https://dic.pixiv.net/a/%E6%96%B0%E4%B8%96%E7%95%8C%E3%81%AE%E7%A5%9E)。標點、漢字與假名的表記各站略有出入，採較常見的寫法。口語轉換表的例句是自行撰寫的原創句子，未查證外部資料。VOICEVOX 的 9 個角色沒有依作品角色的性別或年齡挑選，合成後的語氣與原配音不同，只能訓練聽詞與語速。口語轉換表與名句兩課的音檔都還沒合成，也就沒有聽過音質。

9 個角色只各自驗證音檔可播放，未逐一人耳確認音質是否符合預期語氣。第 0 階段只做了第 1 天，後續天數與跨裝置同步（T10）還沒開始；口語轉換表（T07）與動畫名句（T13）只有文字，音檔待產生。iOS 上的安裝與播放行為未測試，只驗證過 Android Chrome。

新增 7 句的查證強度不一：ちいかわ「なんとかなれーッ！」有兩個網站與百科標題可對照；「ヤダッ！」只在一個網站（マイナビニュース）看到。ポケモン「ポケモンゲットだぜ！」「ピカチュウ、きみに決めた！」有百科標題與搜尋結果可對照；「やなかんじー！」各站表記不同（やなカンジー／やなかんじィー），採平假名寫法。原神「えへってなんだよ！」讀過 [AUTOMATON 的報導](https://automaton-media.com/articles/newsjp/20201019-140524/)；「稲光、すなわち永遠なり」的表記各站有「即ち／すなわち」「なり／也」之分，採較常見的寫法。ポケモン的幾個百科與整理網站讀取被拒（HTTP 403），只能用搜尋結果的摘要與頁面標題核對，查證比其他作品弱。這些都是二手來源，不是原作台本或遊戲內文字。

第二批 9 句的查證：鬼滅の刃「心を燃やせ」「うまい！」「胸を張って生きろ」有[マイナビニュース](https://news.mynavi.jp/article/20240527-2953528/)的名句整理與搜尋結果可對照，是這批最穩的。葬送のフリーレン「勇者ヒンメルならそうした」有多個整理網站提到（「ヒンメル理論」），「魔法は探し求めている時が一番楽しいんだよ」只在[マイナビニュース](https://news.mynavi.jp/article/20240409-2921510/)一處讀到。NARUTO「それがオレの忍道だ」各處表記不完全一致（有「オレの…忍道だ」「それがオレの忍道だからよ」），且漫畫與動畫用字可能不同，我取共同的核心寫法；「だってばよ」是口癖，沒有找到可靠的整句例子，只寫在解說裡。崩壊：スターレイル的三句：黄泉「涙雨 降りて溢るる 渡り川」與ヘルタ「クルクルー」在[砂場俗語集](https://wikiwiki.jp/star-rail/%E7%A0%82%E5%A0%B4/%E4%BF%97%E8%AA%9E%E9%9B%86)與[AUTOMATON 的報導](https://automaton-media.com/articles/newsjp/20230521-248437/)都對得上（ヘルタ的表記另有「くるくる～」「クルリン」）；三月なのか「殴ったね？」來自[攻略 Wiki](https://wikiwiki.jp/star-rail/%E4%B8%89%E6%9C%88%E3%81%AA%E3%81%AE%E3%81%8B)與搜尋結果，是戰鬥語音。星穹鐵道另有「罪を認めるか？」是玩家常提的流行語，但查不到確切是哪個角色的哪一句，沒有收。三月なのか、ヘルタ的語音出處都是遊戲攻略站，不是遊戲內文字；「涙雨…」據說是向和歌致敬，這點我沒有查到可靠出處，所以解說沒有提。

第三批 17 句的查證強度：
- 較穩：ジョジョ「だが断る」「無駄無駄無駄無駄」有[マイナビニュース的人氣排名](https://news.mynavi.jp/article/20220512-2339271/)對照（排名第 1、第 2）；ヴァイオレット的兩句有[アニメイトタイムズ](https://www.animatetimes.com/news/details.php?id=1628807288)的台詞整理；薬屋のひとりごと「もし私を処刑する場合、毒殺にしていただけませんか」有 [U-NEXT SQUARE](https://square.unext.jp/article/kusuriyanohitorigoto-review-2024-01) 與搜尋結果兩處；花子くん「女のコなんだから気をつけなきゃ」有[官方 TikTok 帳號公布的名台詞排名](https://www.tiktok.com/@hanakokun_info/video/7494246859754540296)（標題文字）；しゅごキャラ「あたしのココロ、アンロック！」有[決めゼリフ大事典](https://cozalweb.com/ctv/kimezerifu/anime/sa/syugochara.html)（讀點的有無我沒有確認，採常見寫法）。
- 較弱（只有搜尋結果摘要或單一頁面）：ジョジョ「やれやれだぜ」（搜尋摘要提到，但排名文章沒有收）、犬夜叉「おすわり」（有[ピクシブ百科的詞條](https://dic.pixiv.net/a/%E3%81%8A%E3%81%99%E3%82%8F%E3%82%8A(%E7%8A%AC%E5%A4%9C%E5%8F%89))標題與搜尋摘要，但頁面內容讀取被拒）、涼宮ハルヒ「ただの人間には興味ありません」與キョン「やれやれ」（搜尋摘要）、こどものおもちゃ的兩句（搜尋摘要，來源是名言整理網站）、花子くん寧々「好きな人に会いに来たの」（搜尋摘要）、俺だけレベルアップな件「俺は絶えずレベルアップしている」（[だるまの冒険](https://daruma.link/solo-leveling-meigen)單一頁面）與「弱いからなめられるんだ」（搜尋摘要）、薬屋のひとりごと「みんな、閉じこもった空気に毒されていく」（U-NEXT SQUARE 單一頁面）。
- 讀取失敗：レビューン（reviewne.jp）的名言頁面回傳 502，ピクシブ百科回傳 403，phoenix-wind 與 likiroku 連線失敗，所以涼宮ハルヒ、犬夜叉、こどものおもちゃ、花子くん的核對只能靠搜尋摘要。
- 沒收：玩偶遊戲的「逆境こそ楽しんで生きなさい」（只在一處摘要出現，且無法確認是誰說的）、俺だけレベルアップな件影の軍勢召喚時的短句（查不到確切用字）、犬夜叉的其他短句（查不到確切用字）。
- 作品對應：「玩偶遊戲」是《こどものおもちゃ》的台灣譯名，「守護甜心」是《しゅごキャラ！》，「紫羅蘭」是《ヴァイオレット・エヴァーガーデン》，「花子君」是《地縛少年花子くん》，「藥師少女」是《薬屋のひとりごと》。

第四批 16 句的查證：
- 讀到整理文章原文：進撃の巨人「心臓を捧げよ」「駆逐してやる」（[マイナビニュース](https://news.mynavi.jp/article/20220926-2449636/)）；機動戦士ガンダム「坊やだからさ」「認めたくないものだな」（[マイナビニュース](https://news.mynavi.jp/article/20240625-2969358/)）；呪術廻戦「大丈夫 僕 最強だから」（[マイナビニュース](https://news.mynavi.jp/article/20240513-2944756/)，原文用空格分隔，我加了讀點）；僕のヒーローアカデミア「私が来た」「君が救けを求める顔してた」（[マイナビニュース](https://news.mynavi.jp/article/20220608-2356306/)，前一句原文是「もう大丈夫！何故って!? 私が来た!!」，只收後半）；推しの子「嘘はとびきりの愛なんだよ」（[マイナビニュース](https://news.mynavi.jp/article/20240424-2933200/)，另有網站寫成「とびっきり」）；天空の城ラピュタ「40秒で支度しな！」「見ろ！人がゴミのようだ！」（[シネマトゥデイ的名セリフ投票](https://www.cinematoday.jp/news/N0144717)）。
- 只有搜尋結果摘要或詞條標題可對照：SPY×FAMILY「わくわく」（口癖，搜尋摘要）、ドラゴンボール「オラ、ワクワクしてきたぞ」與「オッス！オラ悟空！」（[ピクシブ百科的詞條](https://dic.pixiv.net/a/%E3%82%AA%E3%83%83%E3%82%B9!%E3%82%AA%E3%83%A9%E6%82%9F%E7%A9%BA!)與搜尋摘要；後者據報導原作漫畫沒有，是動畫預告的開場白）、魔法少女まどか☆マギカ「僕と契約して、魔法少女になってよ！」（[ピクシブ百科的詞條](https://dic.pixiv.net/a/%E5%83%95%E3%81%A8%E5%A5%91%E7%B4%84%E3%81%97%E3%81%A6%E3%80%81%E9%AD%94%E6%B3%95%E5%B0%91%E5%A5%B3%E3%81%AB%E3%81%AA%E3%81%A3%E3%81%A6%E3%82%88!)標題）、ドラゴンクエスト「しんでしまうとは なにごとだ！」（DQ 大辞典的詞條標題與搜尋摘要，這是初代的用字，系列各作結尾不同）、スプラトゥーン「イカ、よろしくー！」（多個整理標題與搜尋摘要，長音的寫法各站不同）。
- 沒收：ヒロアカ的「プルスウルトラ」（文章沒有收錄，用字沒有確認）、ガンダムアムロ的「殴ったね」（與崩壊：スターレイル三月なのか的句子字面相同，避免重複）。
