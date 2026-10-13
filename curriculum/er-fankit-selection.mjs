/** Official Eternal Return Fankit Japanese selection sources, inventoried 2026-10-13.
 * All 85 Japanese ZIPs and loose JPN folders were scanned; only selected/selected2 WAVs are included.
 * Speech is matched to the existing annotated lesson wording after local Whisper small comparison.
 * Laughter/effort sounds have no lessonId. No game recordings are shipped.
 * @typedef {{ characterId: string, filename: string, family: 'selected' | 'selected2', status: 'speech' | 'nonverbal', lessonId: string | null, sourceUrl: string, sourceContainer: string, sha256: string }} FankitSource
 */
export const erFankitUrl =
  'https://drive.google.com/drive/folders/1bgW32L09YPpRgQKtH4C_TAd3Kr0N9Y90';
/** @type {ReadonlyArray<Readonly<FankitSource>>} */
export const erFankitSources = Object.freeze(
  /** @type {FankitSource[]} */ ([
    {
      characterId: 'abigail',
      filename: 'Abigail_selected_1.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:abigail:selection-voice:5410d6bcfc',
      sourceUrl:
        'https://drive.google.com/file/d/14TCG2shCwMsfQ8nAqsxmyhZ_5U716Ks_/view',
      sourceContainer: '067. Abigail/05. Voice Line/Abigail_JPN.zip',
      sha256:
        'ffd17e0df645ba31c588e36ff600363d837da034d3dd4ce1d8c95d4bf6f3e628',
    },
    {
      characterId: 'adela',
      filename: 'Adela_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:adela:selection-voice:c4711f3e13',
      sourceUrl:
        'https://drive.google.com/file/d/14BGOqXVNRanlcevlWXAWoZdTbh-6snkn/view',
      sourceContainer: '024. Adela/05. Voice Line/Adela_JPN.zip',
      sha256:
        '758a1cd1b95f642783bdfde0e77e27cbfe5c821a990d5ff9fd4a4061ac9b620b',
    },
    {
      characterId: 'adina',
      filename: 'Adina_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:adina:selection-voice:c4edb454c4',
      sourceUrl:
        'https://drive.google.com/file/d/17CUDcK30ijZ8rByG_uCO_TxVHpmbLb8O/view',
      sourceContainer: '052. Adina/05. Voice Line/Adina_JPN.zip',
      sha256:
        'e4813462566b690b40ff5218cb2adcd0ba0b2be61c5336bbb61aeaa678b50fb1',
    },
    {
      characterId: 'adriana',
      filename: 'adriana_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:adriana:selection-voice:24ec185871',
      sourceUrl:
        'https://drive.google.com/file/d/13U5A-ac8zgzbQFMqLt_BUmPuAuXkG0WT/view',
      sourceContainer: '016. Adriana/05. Voice Line/Adriana_JPN.zip',
      sha256:
        '920dd2a3ea2d7c9ff380e8f59c840f656e828171bbf8aec8ac8efd725fb4952e',
    },
    {
      characterId: 'aiden',
      filename: 'Aiden_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:aiden:selection-voice:eaea8b98f3',
      sourceUrl:
        'https://drive.google.com/file/d/16bSaogx2Qja016xbB-ohP7fFnaD75IA0/view',
      sourceContainer: '046. Aiden/05. Voice Line/Aiden_JPN.zip',
      sha256:
        '047107bc00bbd1ccde148c4b32fb8ba5ea5884ce3b4e0e2f3cfb827e72304fc2',
    },
    {
      characterId: 'alex',
      filename: 'Alex_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:alex:selection-voice:e9aed2b3d6',
      sourceUrl:
        'https://drive.google.com/file/d/14zDtjnLnVne2WJ8sQL_kW5EdXfZWs_hq/view',
      sourceContainer: '027. Alex/05. Voice Line/Alex_JPN.zip',
      sha256:
        '3228b2bf077fe308b097cb78d81381c37c6635c36d5652c0f286b17036119913',
    },
    {
      characterId: 'alonso',
      filename: 'Alonso_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:alonso:selection-voice:c44c74a562',
      sourceUrl:
        'https://drive.google.com/file/d/14Lum546_VGAiHsweNaM1iuGZr0HCCMlM/view',
      sourceContainer: '068. Alonso/05. Voice Line/Alonso_JPN.zip',
      sha256:
        '0a649423dcc12a4e7fadba786130cff2f584c4bba4005962bc6afd9b7d1c4896',
    },
    {
      characterId: 'arda',
      filename: 'Arda_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:arda:selection-voice:92400ffdcc',
      sourceUrl:
        'https://drive.google.com/file/d/14cq6Q0CCh6ekotGQPDfxb5Q_JFtw3owi/view',
      sourceContainer: '066. Arda/05. Voice Line/Arda_JPN.zip',
      sha256:
        '074f0ec3823a69efecb04c0cbe91cb87771e9acc9818f458d870d7a15776162f',
    },
    {
      characterId: 'aya',
      filename: 'aya_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:aya:selection-voice:6baf70e37c',
      sourceUrl:
        'https://drive.google.com/file/d/11p7cjyemLJPz66LzzV3P1_25AlXHjglI/view',
      sourceContainer: '002. Aya/05. Voice Line/Aya_JPN.zip',
      sha256:
        '62e2b5a316a180cd8a3bb2ad8990b612f9e07198c8a7016b671f1b3ed30bead9',
    },
    {
      characterId: 'barbara',
      filename: 'Barbara_selected2_1_ja.wav',
      family: 'selected2',
      status: 'nonverbal',
      lessonId: null,
      sourceUrl:
        'https://drive.google.com/file/d/14xzNoSoKI0nTXVugGifR4TnIYBbtFKPy/view',
      sourceContainer: '026. Barbara/05. Voice Line - 음성/Barbara_JPN.zip',
      sha256:
        '9d636cefa8908770894c4d13c85ef3b1eb8e734de3c793a65d178ff85c6f0130',
    },
    {
      characterId: 'barbara',
      filename: 'Barbara_selected_1_ja.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:barbara:selection-voice:16dace1571',
      sourceUrl:
        'https://drive.google.com/file/d/14xzNoSoKI0nTXVugGifR4TnIYBbtFKPy/view',
      sourceContainer: '026. Barbara/05. Voice Line - 음성/Barbara_JPN.zip',
      sha256:
        '97b21bb227d20a4888ad42c3ad7744e6701027b9627c938c7c76c2c3f7db460d',
    },
    {
      characterId: 'bernice',
      filename: 'Bernice_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:bernice:selection-voice:e7caa894f2',
      sourceUrl:
        'https://drive.google.com/file/d/14ELDuad1ERilg4nNec8OAB_AfDiVQfob/view',
      sourceContainer: '025. bERnice/05. Voice Line - 음성/bERnice_JPN.zip',
      sha256:
        'f2e5d9bdc3429d4521e46f0806512f935f11128b1e82962741a079cc2a84c3cb',
    },
    {
      characterId: 'bianca',
      filename: 'Bianca_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:bianca:selection-voice:2598ab2e26',
      sourceUrl:
        'https://drive.google.com/file/d/16AdUCRaMrstIt_Ln-zxQnm5COEL4Gq92/view',
      sourceContainer: '042. Bianca/05. Voice Line/Bianca_JPN.zip',
      sha256:
        '6e15452765b16631afa896d2530539ca257d13c7ad6a45393a286db807fa337d',
    },
    {
      characterId: 'bihyung',
      filename: 'Bihyung_selected2_1_ja.wav',
      family: 'selected2',
      status: 'speech',
      lessonId: 'er:bihyung:selection-voice:cb8b9d1a67',
      sourceUrl:
        'https://drive.google.com/file/d/12K-ROsaH-91x5nzBgwd3qaG4BBSBaZzQ/view',
      sourceContainer: '088. Bihyung/05. Voice Line/Bihyung_JPN.zip',
      sha256:
        'b9caeda2a63b3b8a9590cc43bf6a1ee1ca81acdd9ef6f1777cf8508d021ee694',
    },
    {
      characterId: 'bihyung',
      filename: 'Bihyung_selected_1_ja.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:bihyung:selection-voice:671e7f6098',
      sourceUrl:
        'https://drive.google.com/file/d/12K-ROsaH-91x5nzBgwd3qaG4BBSBaZzQ/view',
      sourceContainer: '088. Bihyung/05. Voice Line/Bihyung_JPN.zip',
      sha256:
        '77b8bb77aa609bd805a1bcafd9fa37fdb10038fa30f95d516c3d9db880de2e4f',
    },
    {
      characterId: 'blair',
      filename: 'Blair_selected_1__01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:blair:selection-voice:3b2445d104',
      sourceUrl:
        'https://drive.google.com/file/d/13nee361Fh6-WHezh0f_bfz3wuzy6NJBg/view',
      sourceContainer: '084. Blair/05. Voice Line/Blair_Voice Line_JPN.zip',
      sha256:
        '1a869d4066a3f928e5ef8bdef55233a9fe1a09949ac58765d58ced0aedd4d4d2',
    },
    {
      characterId: 'camilo',
      filename: 'Camilo_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:camilo:selection-voice:e08df10fef',
      sourceUrl:
        'https://drive.google.com/file/d/16-pvrpCbVGpf5yKt9U0dmtg1dmGLEApO/view',
      sourceContainer: '039. Camilo/05. Voice Line/Camilo_JPN.zip',
      sha256:
        '38835e88d36f26bd6718a8463e9b24ca7b123a25982779466e59a11f9b6a6a68',
    },
    {
      characterId: 'cathy',
      filename: 'Cathy_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:cathy:selection-voice:76205e5443',
      sourceUrl:
        'https://drive.google.com/file/d/143M0bnboRN5vpAZtlHYQTWoUv5WSu2Nq/view',
      sourceContainer: '023. Cathy/05. Voice Line/Cathy_JPN.zip',
      sha256:
        '41ff9b4648473366b489c282e25007abae05a3be69202cc997ee8d720780a67f',
    },
    {
      characterId: 'celine',
      filename: 'Celine_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:celine:selection-voice:e252acb428',
      sourceUrl:
        'https://drive.google.com/file/d/16D1rUTfAEtfhIoUvNEvBkhY-P0H_BtpE/view',
      sourceContainer: '043. Celine/05. Voice Line/Celine_JPN.zip',
      sha256:
        '9f493d20ab335bc1a0f9cec07f05396b1000a3e5c87189af3616aafccd5aadc2',
    },
    {
      characterId: 'charlotte',
      filename: 'charlotte_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:charlotte:selection-voice:db9aa250d9',
      sourceUrl:
        'https://drive.google.com/file/d/1lvlczX0Gz-k5OSpxqFFPZDUErE51x7PT/view',
      sourceContainer: '073. Charlotte/05. Voice Line/JPN.zip',
      sha256:
        '7d1f0fa4d340cccea8f65b4376e11fa2184064d715ace2e507c525b695355198',
    },
    {
      characterId: 'chiara',
      filename: 'kiara_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:chiara:selection-voice:8fc5b683a3',
      sourceUrl:
        'https://drive.google.com/file/d/13N5CDFtYcsavYPSJaq0m44YW22KmaG8T/view',
      sourceContainer: '015. Chiara/05. Voice Line/Chiara_JPN.zip',
      sha256:
        '6f254b9a7a95d9d6a0499e71df3e4b77099eacda27f6cb68e1ee2c0a6f81c751',
    },
    {
      characterId: 'chloe',
      filename: 'Chloe_selected_1.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:chloe:selection-voice:75c7a57e3a',
      sourceUrl:
        'https://drive.google.com/file/d/163N5VAzoD7q3-hG3xXNR0i6qe5KcdnZI/view',
      sourceContainer: '040. Chloe/05. Voice Line/Chloe_JPN.zip',
      sha256:
        'e64dcef0e5a0bed2b8ad904ff6c3e25b14d11b4e254871e50ae29f72faf60dcd',
    },
    {
      characterId: 'coraline',
      filename: 'Coraline_selected_1__01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:coraline:selection-voice:f237f24e60',
      sourceUrl:
        'https://drive.google.com/file/d/1HEWLIo6cvy4sI6fhHaVo-xU81hnCt3qi/view',
      sourceContainer: '087. Coraline/05. Voice Line/Coraline_JPN.zip',
      sha256:
        '5f07b6302c8cb445861f1cb59ee7d754b8086b2ceeaf6b34543b36a702129c6a',
    },
    {
      characterId: 'craver',
      filename: 'Craver_selected2_1_ja.wav',
      family: 'selected2',
      status: 'speech',
      lessonId: 'er:craver:selection-voice:7dd7c79664',
      sourceUrl:
        'https://drive.google.com/file/d/1jAUDK8ww9iNeEWW4ir6VlAG2jfZqRmAX/view',
      sourceContainer: '089. CravER/05. Voice Line/CravER_JPN.zip',
      sha256:
        '67a6f7b03a1cdd902389629ef9891ed8d412f962e9c2cf8e7edf75231e982b0b',
    },
    {
      characterId: 'craver',
      filename: 'Craver_selected_1_ja.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:craver:selection-voice:d323f1b6a0',
      sourceUrl:
        'https://drive.google.com/file/d/1jAUDK8ww9iNeEWW4ir6VlAG2jfZqRmAX/view',
      sourceContainer: '089. CravER/05. Voice Line/CravER_JPN.zip',
      sha256:
        'cc7106300252ef3c8c27d6d730f1d3f8dd92a8e20b6ccc53fd430918dd62e9a4',
    },
    {
      characterId: 'daniel',
      filename: 'Daniel_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:daniel:selection-voice:6d577b2791',
      sourceUrl:
        'https://drive.google.com/file/d/15oLRMunYj3twJLnDXq8NaWs5qjwyHoao/view',
      sourceContainer: '037. Daniel/05. Voice Line/Daniel_JPN.zip',
      sha256:
        'fe396386dd12e49c64010bbf87f943e3b064ad91f11f1e0c1a54c58a9e810b2e',
    },
    {
      characterId: 'darko',
      filename: 'Darko_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:darko:selection-voice:d1eeee4967',
      sourceUrl:
        'https://drive.google.com/file/d/1miWFCEorNyoiw_btv1pJmyPlA-vO524j/view',
      sourceContainer: '074. Darko/05. Voice LIne/Darko_JPN.zip',
      sha256:
        'e3a261fa48e476c02ac52c2edf6c98545154a1d0fc7ec24bcd81482ed69c28c5',
    },
    {
      characterId: 'darko',
      filename: 'Darko_selected_1_02.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:darko:selection-voice:d1eeee4967',
      sourceUrl:
        'https://drive.google.com/file/d/1miWFCEorNyoiw_btv1pJmyPlA-vO524j/view',
      sourceContainer: '074. Darko/05. Voice LIne/Darko_JPN.zip',
      sha256:
        '60666aa28b9b9227c5cd8820175e9a8b4c33de0c1693826036e4c06d9c13bf7c',
    },
    {
      characterId: 'debimarlene',
      filename: 'Debi_Marlene_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:debimarlene:selection-voice:b681e7e669',
      sourceUrl:
        'https://drive.google.com/file/d/14i3Mwf3xHHGdVAiuIRj6KHGRkAB7Oqwg/view',
      sourceContainer:
        '065. Debi & Marlene/05. Voice Line/Debi&Marlene_JPN.zip',
      sha256:
        '05bd7a1549238c6a0947612c67973e437580fcd96b6ebc4956f21f911182dd54',
    },
    {
      characterId: 'echion',
      filename: 'Echion_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:echion:selection-voice:fc89cd8827',
      sourceUrl:
        'https://drive.google.com/file/d/16Gmcx0sKpmaV_LMm8mp4ZGACYqU7fNHq/view',
      sourceContainer: '044. Echion/05. Voice Line/Echion_JPN.zip',
      sha256:
        'c1d45d60d7523b07f1a831db5345cc6f15b8274610bf311568b3bb6f3199f751',
    },
    {
      characterId: 'echion',
      filename: 'Echion_selected_1_02.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:echion:selection-voice:fc89cd8827',
      sourceUrl:
        'https://drive.google.com/file/d/16Gmcx0sKpmaV_LMm8mp4ZGACYqU7fNHq/view',
      sourceContainer: '044. Echion/05. Voice Line/Echion_JPN.zip',
      sha256:
        'ffa218f6ec0357d4ed16749adf543dc5e75e78ff64412b625fc898ce73f1c35c',
    },
    {
      characterId: 'echion',
      filename: 'Echion_selected_1_03.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:echion:selection-voice:fc89cd8827',
      sourceUrl:
        'https://drive.google.com/file/d/16Gmcx0sKpmaV_LMm8mp4ZGACYqU7fNHq/view',
      sourceContainer: '044. Echion/05. Voice Line/Echion_JPN.zip',
      sha256:
        '8cc158dff9ba0f08095a5bd1b17823801709beb835cef44f45312e9646597ce7',
    },
    {
      characterId: 'echion',
      filename: 'Echion_selected_1_04.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:echion:selection-voice:fc89cd8827',
      sourceUrl:
        'https://drive.google.com/file/d/16Gmcx0sKpmaV_LMm8mp4ZGACYqU7fNHq/view',
      sourceContainer: '044. Echion/05. Voice Line/Echion_JPN.zip',
      sha256:
        'de7f42f077afd8ab3835ddf981babebfa851f7458fa26d3d2960ed169fbcc4fc',
    },
    {
      characterId: 'elena',
      filename: 'Elena_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:elena:selection-voice:604742a5d5',
      sourceUrl:
        'https://drive.google.com/file/d/16vtDCf8P0tg4B-6O_02Rebp7sBdlQgvs/view',
      sourceContainer: '050. Elena/05. Voice Line/Elena_JPN.zip',
      sha256:
        '67308a9618f7c733c2c990a5b0e0bec43aa0ddff8085ce7ce2caf42d2e0ea685',
    },
    {
      characterId: 'eleven',
      filename: 'Eleven_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:eleven:selection-voice:e603a02782',
      sourceUrl:
        'https://drive.google.com/file/d/15FSZXWjJ14SWQOrurIpk-nphXi-BQml9/view',
      sourceContainer: '030. Eleven/05. Voice Line/Eleven_JPN.zip',
      sha256:
        '376fde3a4ea463bfbcfe7605269f6eb4c1acdbd8cd50b4d0267426976f219045',
    },
    {
      characterId: 'emma',
      filename: 'Emma_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:emma:selection-voice:6bbda2dee4',
      sourceUrl:
        'https://drive.google.com/file/d/13lpQ8l0OZ6hmDVQgqqoDin-YmI-u1QJW/view',
      sourceContainer: '019. Emma/05. Voice Line/Emma_JPN.zip',
      sha256:
        '3588ed42eb57e3edfce3d62dfaf13f624b61032d511cee0620afd389976eca0f',
    },
    {
      characterId: 'estelle',
      filename: 'Estelle_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:estelle:selection-voice:cec78fc060',
      sourceUrl:
        'https://drive.google.com/file/d/17TtFFZynn9poZ7OO2dPo1U0-14eeAfgg/view',
      sourceContainer: '055. Estelle/05. Voice Line/Estelle_JPN.zip',
      sha256:
        'cfe3585e55e9b8975c2f5a9d11ec40e7e35918da7bf700f6bb0daf713b774ac7',
    },
    {
      characterId: 'eva',
      filename: 'EVA_selected_1.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:eva:selection-voice:1b4ea5830e',
      sourceUrl:
        'https://drive.google.com/file/d/15lvsDepz9OaG_E_QSGTgJ8eAJcHt59O_/view',
      sourceContainer: '036. Eva/05. Voice Line/Eva_JPN.zip',
      sha256:
        '538853418888b5434844400e7eb40f436a8a65610970817d0f1a5b4d94c1e2ed',
    },
    {
      characterId: 'felix',
      filename: 'Felix_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:felix:selection-voice:2299c4b895',
      sourceUrl:
        'https://drive.google.com/file/d/16ub293fh6mD2wI0ievskQZhevOStDkAY/view',
      sourceContainer: '049. Felix/05. Volce Line/Felix_JPN.zip',
      sha256:
        'ec5413b1399ebb583b0f529f0ad21f31ca5fde574beebc179625738f615807a4',
    },
    {
      characterId: 'felix',
      filename: 'Felix_selected_1_02.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:felix:selection-voice:2299c4b895',
      sourceUrl:
        'https://drive.google.com/file/d/16ub293fh6mD2wI0ievskQZhevOStDkAY/view',
      sourceContainer: '049. Felix/05. Volce Line/Felix_JPN.zip',
      sha256:
        'c1fd5e191ab14b1436b0789d23afbf3ac3e0efbfa60c6984e15413c01f4aec82',
    },
    {
      characterId: 'fenrir',
      filename: 'Fenrir_selected_1__01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:fenrir:selection-voice:556c4c56f8',
      sourceUrl:
        'https://drive.google.com/file/d/15Tl6qxG9jk_YYS17O_XLkA1PDgfdj3GS/view',
      sourceContainer: '086. Fenrir/05. Voice Line/Fenrir_JPN.zip',
      sha256:
        'aff26f77cee50cac46aad62accfd851069605f71e7bf79caf39307dfb8a9c970',
    },
    {
      characterId: 'fiora',
      filename: 'fiora_selected .wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:fiora:selection-voice:b3ab960a9b',
      sourceUrl:
        'https://drive.google.com/file/d/12OrbynL6cNOv-XEAez4YvUplaxZUX60G/view',
      sourceContainer: '005. Fiora/05. Voice Line/Fiora_JPN.zip',
      sha256:
        '4fb8688219e384bf18de4b41eed010bdb7c6367c1b5d816c612b99316f87e5c9',
    },
    {
      characterId: 'garnet',
      filename: 'Garnet_selected_1.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:garnet:selection-voice:bd69c98de8',
      sourceUrl:
        'https://drive.google.com/file/d/1bqGFnXLYkEEvvoAZl8B_M4S6bO1seC_t/view',
      sourceContainer: '076. Garnet/05. Voice Line/Garnet_JPN.zip',
      sha256:
        '2da91365d611b00329af0845d28557d0bd25ecfb0c0b39c2249bca4b4319d06b',
    },
    {
      characterId: 'hart',
      filename: 'Hart_selected2_1_ja.wav',
      family: 'selected2',
      status: 'nonverbal',
      lessonId: null,
      sourceUrl:
        'https://drive.google.com/file/d/12i2S2t3jnK_kN60RcnpawXIz6cnMnTZO/view',
      sourceContainer: '008. Hart/05. Voice Line/Hart_JPN.zip',
      sha256:
        'efabbfebab3235e6f93a9cc2518cf4871978652642fad76ee2fb1b860c5dc834',
    },
    {
      characterId: 'hart',
      filename: 'Hart_selected_1_ja.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:hart:selection-voice:1794da56b4',
      sourceUrl:
        'https://drive.google.com/file/d/12i2S2t3jnK_kN60RcnpawXIz6cnMnTZO/view',
      sourceContainer: '008. Hart/05. Voice Line/Hart_JPN.zip',
      sha256:
        '0b191690d05a961367e0ca6a5fbd1bec5034da2e0f60099c26b0b7b7f7ef69b4',
    },
    {
      characterId: 'haze',
      filename: 'Haze_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:haze:selection-voice:a0c7e7eddb',
      sourceUrl:
        'https://drive.google.com/file/d/17lFDmU_mImga4M1e2ALj3WAkRwJMKV3G/view',
      sourceContainer: '058. Haze/05. Voice Line/Haze_JPN.zip',
      sha256:
        '308139ce72aaff74951318f099b022700ed5dd28661549a6a295cc79b28a148c',
    },
    {
      characterId: 'henry',
      filename: 'Henry_selected_1__01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:henry:selection-voice:14062c8934',
      sourceUrl:
        'https://drive.google.com/file/d/1aK-tnXtFmEJVsedy6kOcxzcWe90z6CmW/view',
      sourceContainer: '083. Henry/05. Voice Line/Henry_Voice Line_JPN.zip',
      sha256:
        '5d19b06a1080d38c718d7ecf81e658718931e411ebbc7544e955691a45a8b867',
    },
    {
      characterId: 'hisui',
      filename: 'Hisui_selected_1.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:hisui:selection-voice:bc90e58d35',
      sourceUrl:
        'https://drive.google.com/file/d/1kjLXvLFGlpyr_BDgSBlMcXdsiN-lKBW5/view',
      sourceContainer: '078. Hisui/05. Voice Line/JPN/Hisui_selected_1.wav',
      sha256:
        'dc601b6f4a91c627856b122dac6b4582d58a6e11e25d9f4c863fe11e188f2e97',
    },
    {
      characterId: 'hyejin',
      filename: 'hyejin_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:hyejin:selection-voice:781f963185',
      sourceUrl:
        'https://drive.google.com/file/d/136EB72to_fbuQ-UI8uTBAyfO2SsktKcj/view',
      sourceContainer: '012. Hyejin/05. Voice Line/Hyejin_JPN.zip',
      sha256:
        'b6c0ed568a3069ca29296a706021ececdde49026a20434f7d80a780226d35a4e',
    },
    {
      characterId: 'hyunwoo',
      filename: 'Hyunwoo_selected2_1_ja.wav',
      family: 'selected2',
      status: 'nonverbal',
      lessonId: null,
      sourceUrl:
        'https://drive.google.com/file/d/1_P8TWM36scllrqvjXiKUzos5-MAgzZ7_/view',
      sourceContainer: '003. Hyunwoo/05. Voice Line/Hyunwoo_JPN.zip',
      sha256:
        '1805f73a632c3ee3ff21b65686e44e8d178cb5c95b7a24525474a807953d3f5b',
    },
    {
      characterId: 'hyunwoo',
      filename: 'Hyunwoo_selected_1_ja.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:hyunwoo:selection-voice:149a9f3f71',
      sourceUrl:
        'https://drive.google.com/file/d/1_P8TWM36scllrqvjXiKUzos5-MAgzZ7_/view',
      sourceContainer: '003. Hyunwoo/05. Voice Line/Hyunwoo_JPN.zip',
      sha256:
        '0351566057e42321d1eb4342ac1200596f36e9cb5e30041c418da2d88609c04b',
    },
    {
      characterId: 'irem',
      filename: 'Irem_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:irem:selection-voice:5f7ffa5608',
      sourceUrl:
        'https://drive.google.com/file/d/187C6yk4m8JL4vYkP9jc9Hgtf4ixVKyMs/view',
      sourceContainer: '061. Irem/05. Voice Line/Irem_JPN.zip',
      sha256:
        '3b0287522e1cba81a2979874870d8fdc6e586b9b63b0238861466d556ff6a36f',
    },
    {
      characterId: 'isaac',
      filename: 'Isaac_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:isaac:selection-voice:32a80fc1cf',
      sourceUrl:
        'https://drive.google.com/file/d/17r73pOBLP5peedraKxPfwRwW1uSJK-24/view',
      sourceContainer: '059. Isaac/05. Voice Line/Isaac_JPN.zip',
      sha256:
        '26ee1d677c3d28a6d61d8b6e6e645d82d4b6217d2b88f35892c40c735bcad106',
    },
    {
      characterId: 'isol',
      filename: 'isol_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:isol:selection-voice:1383119911',
      sourceUrl:
        'https://drive.google.com/file/d/12m-QLnZh-jQHMe1WTQbkQvM6xVvA2L1D/view',
      sourceContainer: '009. Isol/05. Voice Line/Isol_JPN.zip',
      sha256:
        '39e1df300b53d6444215ed466a1b4cf9c965881610b6782e600f58f78a878ca2',
    },
    {
      characterId: 'istvan',
      filename: 'Istvan_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:istvan:selection-voice:4bf842ed88',
      sourceUrl:
        'https://drive.google.com/file/d/1eXytKMqQVZhvg5aeNOu8CSjTXn6-u8Do/view',
      sourceContainer: '080. István/05. Voice Line/Istvan_JPN.zip',
      sha256:
        '957dbe9987a3cb37ab703dcc7cc7b7c30b4e6cc7a174c0750345b3bef6b7169f',
    },
    {
      characterId: 'jackie',
      filename: 'jackie_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:jackie:selection-voice:31e28fd5fe',
      sourceUrl:
        'https://drive.google.com/file/d/11j_Ec-6CM-FwEniyHkMfRfMkGU161VvD/view',
      sourceContainer: '001. Jackie/05. Voice Line/Jackie_JPN.zip',
      sha256:
        '07b24d8c22e3492eb671dad0e0d2af0ba39509226aa3a4c9a2f5d644cf8e1fe5',
    },
    {
      characterId: 'jan',
      filename: 'jan_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:jan:selection-voice:f0c3c35f4e',
      sourceUrl:
        'https://drive.google.com/file/d/15gYOogNYiAzlnHSqFS1zwUQHJc74DxAq/view',
      sourceContainer: '035. Jan/05. Voice Line/Jan_JPN.zip',
      sha256:
        'f9051e8b3100cd8de513cb065e732b388d49f13603a900061d6e165d00e5b446',
    },
    {
      characterId: 'jenny',
      filename: 'Jenny_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:jenny:selection-voice:cff54f4b00',
      sourceUrl:
        'https://drive.google.com/file/d/15xgAKOv5xn6HG1hQED-TpxeZmRWGr_gg/view',
      sourceContainer: '038. Jenny/05. Voice Line/Jenny_JPN.zip',
      sha256:
        '98f903b60632f7bb81796e00461f7c2ef2f80616b268dd9b0417ce499d4fa968',
    },
    {
      characterId: 'johann',
      filename: 'Johann_selected_1.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:johann:selection-voice:264977eed5',
      sourceUrl:
        'https://drive.google.com/file/d/1647VuoebMHQNY6ksfddMU1oLZUTnfUw0/view',
      sourceContainer: '041. Johann/05. Voice Line/Johann_JPN.zip',
      sha256:
        'f4f55eeb2bafce032dc98c83c2cc90599a5f0ba13c2803c1d037c7cd972281b9',
    },
    {
      characterId: 'justyna',
      filename: 'Justyna_selected_1.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:justyna:selection-voice:baf13807d0',
      sourceUrl:
        'https://drive.google.com/file/d/1RYiBxAkyEqFB9rg5PzXHsXrUTIlijYpg/view',
      sourceContainer: '079. Justyna/05. Voice Line/JPN/Justyna_selected_1.wav',
      sha256:
        'a54a427c0d3d0a9caa80c50ad39c35059cb8d73a7efbf2671222fc3351160e53',
    },
    {
      characterId: 'karla',
      filename: 'Karla_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:karla:selection-voice:5f98347e3e',
      sourceUrl:
        'https://drive.google.com/file/d/17SKVQVrUFpdPSPxb0bN3W7gxGjHKBA5-/view',
      sourceContainer: '054. Karla/05. Voice Line/Karla_JPN.zip',
      sha256:
        '9f6c1aefc7026eb9462bd8afccd09118a8a9152ac0083e359d9280b777a6bb46',
    },
    {
      characterId: 'katja',
      filename: 'Katja_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:katja:selection-voice:3463cb0924',
      sourceUrl:
        'https://drive.google.com/file/d/1KFw85JLm88ZLwBJ-S_7vrTGQrbCki0GD/view',
      sourceContainer: '072. Katja/05. Voice lIne/JPN/Katja_selected_1_01.wav',
      sha256:
        '98ad525a4d1bbe037ed3c78224228c86611d3553222d3265f2499d7399b232fd',
    },
    {
      characterId: 'kenneth',
      filename: 'Kenneth_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:kenneth:selection-voice:10d8048a50',
      sourceUrl:
        'https://drive.google.com/file/d/14EeAZRmmwDhx1uJdyU-UfQkNBaLBBlcH/view',
      sourceContainer: '071. Kenneth/05. Voice Line/Kenneth_JPN.zip',
      sha256:
        '87b8b60801679f53691f790c00b8a4aedef80333510cc2af97235cc26befe843',
    },
    {
      characterId: 'laura',
      filename: 'Laura_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:laura:selection-voice:5372bd09d8',
      sourceUrl:
        'https://drive.google.com/file/d/16ps6LIMuwQc-LtWULQIefqnG6-xIyn27/view',
      sourceContainer: '047. Laura/05. Voice Line/Laura_JPN.zip',
      sha256:
        '6c82f4a96bb29e7aeee63684c344f47f04318c1f026d0be898d4de5f77bcaa09',
    },
    {
      characterId: 'leni',
      filename: 'Leni_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:leni:selection-voice:7b6dc35e8d',
      sourceUrl:
        'https://drive.google.com/file/d/14LM-ilwt8serDBpiBy92v8YuGwNdLG2Z/view',
      sourceContainer: '069. Leni/05. Voice Line/Leni_JPN.zip',
      sha256:
        '97c15a636c8a24a806aad18275178fd852af80e8fc5b0a33a973acffbcbf96d9',
    },
    {
      characterId: 'lenore',
      filename: 'Lenore_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:lenore:selection-voice:29dbfa6db8',
      sourceUrl:
        'https://drive.google.com/file/d/1o3yWRmDr4llsVNazEWu_6Jq4iAb6v_Rx/view',
      sourceContainer: '075. Lenore/05. Voice Line/Lenore_JPN.zip',
      sha256:
        '5c47721f231ada5f49a4ab4684c9657edd2a51653a3e19de9c0a5c956c27438e',
    },
    {
      characterId: 'lenox',
      filename: 'Lenox _selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:lenox:selection-voice:f5c4bd1fb9',
      sourceUrl:
        'https://drive.google.com/file/d/13oizZmKXG9vpvnZKyw6eLOMJUoBh7kkD/view',
      sourceContainer: '020. Lenox/05. Voice Line/Lenox_JPN.zip',
      sha256:
        'e987c51bf6174286100e5638b00dcfa6f89cc1fddc8555e541eab37dcb17964e',
    },
    {
      characterId: 'leon',
      filename: 'Leon_selected2_1_ja.wav',
      family: 'selected2',
      status: 'nonverbal',
      lessonId: null,
      sourceUrl:
        'https://drive.google.com/file/d/15COu8sA2MUBH5H7-oI0dZSn_9ZnllmVU/view',
      sourceContainer: '029. Leon/05. Voice Line/Leon_JPN.zip',
      sha256:
        'aafea619b318efd9388b844dce3c0e2de57f987cc4da753efba6940ba6f6b681',
    },
    {
      characterId: 'leon',
      filename: 'Leon_selected_1_ja.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:leon:selection-voice:05b267a921',
      sourceUrl:
        'https://drive.google.com/file/d/15COu8sA2MUBH5H7-oI0dZSn_9ZnllmVU/view',
      sourceContainer: '029. Leon/05. Voice Line/Leon_JPN.zip',
      sha256:
        '90364df28eaaf12abfeebd4ae0ba5c4f655042d87ceb9bb2c8836a06c0596fd4',
    },
    {
      characterId: 'lidailin',
      filename: 'lidailin_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:lidailin:selection-voice:45979fc84b',
      sourceUrl:
        'https://drive.google.com/file/d/12ud8lBbl48gGER8rWtxQ1Aw5sUj5StMb/view',
      sourceContainer: '010. Li Dailin/05. Voice Line/Li Dailin_JPN.zip',
      sha256:
        'bea5cc2cd919ec30e597c32e416ab23f4348a5b8b30c7a90b5b7983318f3a173',
    },
    {
      characterId: 'luke',
      filename: 'Luke_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:luke:selection-voice:5876ab0905',
      sourceUrl:
        'https://drive.google.com/file/d/1417wFNFddfRQyyFovk5e0zxYu-3Iv_Nm/view',
      sourceContainer: '022. Luke/05. Voice Line/Luke_JPN.zip',
      sha256:
        '2d2d795cc475f7dfc1b6c87fc5c548b273cd2181da80972acd979bf10d34dbe2',
    },
    {
      characterId: 'lyanh',
      filename: 'Ly_Anh_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:lyanh:selection-voice:ddd410a944',
      sourceUrl:
        'https://drive.google.com/file/d/18KNW1KSNGXKfQrBTZUHDqfosRLJGWQCn/view',
      sourceContainer: '063. Ly anh/05. Voice lIne/Ly Anh_JPN.zip',
      sha256:
        '1299b1009cf4f6674d3a3a792195b9f0d5c333b9ee47c817c47d3d8a324d0c06',
    },
    {
      characterId: 'magnus',
      filename: 'magnus_selected_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:magnus:selection-voice:cf6c2b990a',
      sourceUrl:
        'https://drive.google.com/file/d/127HGiPjxO_6qfn-Tsqpf1L-NUcSBP7H2/view',
      sourceContainer: '004. Magnus/05. Voice Line/Magnus_JPN.zip',
      sha256:
        'd98494d59804f21d30ee1a05b400969162b5f11edb2097d0a32442e3f560e44e',
    },
    {
      characterId: 'magnus',
      filename: 'magnus_selected_02.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:magnus:selection-voice:cf6c2b990a',
      sourceUrl:
        'https://drive.google.com/file/d/127HGiPjxO_6qfn-Tsqpf1L-NUcSBP7H2/view',
      sourceContainer: '004. Magnus/05. Voice Line/Magnus_JPN.zip',
      sha256:
        '45ad32012603583eb8820b7ef2c47e0e2ab56261bfa545b40e7f9ac0154f2157',
    },
    {
      characterId: 'mai',
      filename: 'Mai_selected_1.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:mai:selection-voice:f897e38f0a',
      sourceUrl:
        'https://drive.google.com/file/d/16JMEuuw1axbz3mtu1Ca5TQ35mshaRjbd/view',
      sourceContainer: '045. Mai/05. Voice Line/Mai_JPN.zip',
      sha256:
        '1765739c1c2f5c8e2ab756f92a539635eed4888332d7cd29b4784182d7a644b6',
    },
    {
      characterId: 'markus',
      filename: 'Markus_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:markus:selection-voice:84e9573f28',
      sourceUrl:
        'https://drive.google.com/file/d/17JW074MPj4n4o4LusWbOzN4OuD5YCOPc/view',
      sourceContainer: '053. Markus/05. Voice Line/Markus_JPN.zip',
      sha256:
        'fb7524c88c57e186c251e00797967e82fee36739023fe66d7f58b496b2b7d243',
    },
    {
      characterId: 'martina',
      filename: 'Martina_selected_1.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:martina:selection-voice:86f5b3ae7b',
      sourceUrl:
        'https://drive.google.com/file/d/17Y-cHhXFiV1AW8pXSEoeVdUJ7Pz-NWK0/view',
      sourceContainer: '057. Martina/05. Voice Line/Martina_JPN.zip',
      sha256:
        '67270f8af71c252de5555a29a57219c65b8241207cc96f89b8d6b36ffa2af271',
    },
    {
      characterId: 'martina',
      filename: 'Martina_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:martina:selection-voice:86f5b3ae7b',
      sourceUrl:
        'https://drive.google.com/file/d/17Y-cHhXFiV1AW8pXSEoeVdUJ7Pz-NWK0/view',
      sourceContainer: '057. Martina/05. Voice Line/Martina_JPN.zip',
      sha256:
        '2d8042d6e9b3257e75369008e30adc7d3bd557218ed7487a993610daa51c8361',
    },
    {
      characterId: 'martina',
      filename: 'Martina_selected_1_02.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:martina:selection-voice:86f5b3ae7b',
      sourceUrl:
        'https://drive.google.com/file/d/17Y-cHhXFiV1AW8pXSEoeVdUJ7Pz-NWK0/view',
      sourceContainer: '057. Martina/05. Voice Line/Martina_JPN.zip',
      sha256:
        '9ce73784dc9a03a18d530edabf7dd25658a40ec5c8cf68f85d400847c035b3eb',
    },
    {
      characterId: 'martina',
      filename: 'Martina_selected_1_03.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:martina:selection-voice:86f5b3ae7b',
      sourceUrl:
        'https://drive.google.com/file/d/17Y-cHhXFiV1AW8pXSEoeVdUJ7Pz-NWK0/view',
      sourceContainer: '057. Martina/05. Voice Line/Martina_JPN.zip',
      sha256:
        'b09cdef145cc5b4f12618d320ab515b035af43fc40fb11c35a40cd021022bbf1',
    },
    {
      characterId: 'mirka',
      filename: 'Mirka_selected_1__02.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:mirka:selection-voice:33cecb4094',
      sourceUrl:
        'https://drive.google.com/file/d/1ZoRD_uzXmUwmkMerBbGzdWLzAAYxJtao/view',
      sourceContainer: '085. Mirka/05. Voice Line/Mirka_Voice Line_JPN.zip',
      sha256:
        'e9ac903c85dfa4931b4528fc4fc398d90758afeee224bfbe765ab7a7f6f47134',
    },
    {
      characterId: 'nadine',
      filename: 'nadine_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:nadine:selection-voice:089b7ff647',
      sourceUrl:
        'https://drive.google.com/file/d/12Yn2JPvrt1JFoxsnkXC_7yCoIH2LjvWM/view',
      sourceContainer: '006. Nadine/05. Voice Line/Nadine_JPN.zip',
      sha256:
        '9ee0612dc12a28ecf426b48a833a30301bb366b8a35e2402d126ab9972336970',
    },
    {
      characterId: 'nathapon',
      filename: 'Nathapon_selected_1.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:nathapon:selection-voice:fa1fe340da',
      sourceUrl:
        'https://drive.google.com/file/d/15dZtSSMw-XgyF_vza2_iuD8fgyf51Xz0/view',
      sourceContainer: '034. Nathapon/05. Voice Line/Nathapon_JPN.zip',
      sha256:
        'c2daec8fb52563d6ab0d0ceab585f4631a8238f6d9901e6e2f54af5453170cfa',
    },
    {
      characterId: 'niah',
      filename: 'NiaH_selected_1.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:niah:selection-voice:a92bad0ddc',
      sourceUrl:
        'https://drive.google.com/file/d/1W3_KNsqPZS2qgUDNfqIKSh7nu_PCS87s/view',
      sourceContainer: '081. NiaH/05. Voice Line/NiaH_JPN.zip',
      sha256:
        '2f8869aab7919927fbbd791fe1a901211c17967a2b4db2bce50e1408f78b37ef',
    },
    {
      characterId: 'nicky',
      filename: 'Nicky_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:nicky:selection-voice:ff240e379f',
      sourceUrl:
        'https://drive.google.com/file/d/15VFL2HfcSAvTkSKdrPoSceKXMZkNsecX/view',
      sourceContainer: '033. Nicky/05. Voice Line/Nicky_JPN.zip',
      sha256:
        '09626e392a0747b02537aeb40ab883a9946534b82955eab6478168df4ee54bf6',
    },
    {
      characterId: 'piolo',
      filename: 'Piolo_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:piolo:selection-voice:eb401f4c1f',
      sourceUrl:
        'https://drive.google.com/file/d/17X7zpPj4bake2D0p0NLCzKwW2ZJfj4xT/view',
      sourceContainer: '056. Piolo/05. Voice Line/Piolo_JPN.zip',
      sha256:
        '3c264d8302782fdd63e63d1e2201845d40c942f6579480112854ddc800e9a2aa',
    },
    {
      characterId: 'priya',
      filename: 'Priya_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:priya:selection-voice:165eec9546',
      sourceUrl:
        'https://drive.google.com/file/d/1784Z2pmUxkpOagWmvcLmDEZNvGgwdqmc/view',
      sourceContainer: '051. Priya/05. Voice Line/Priya_JPN.zip',
      sha256:
        '46fe49f8bc429042eb8ccfba9b1b8ea4602e9c3a5def56b7ce6ab2415c59932e',
    },
    {
      characterId: 'priya',
      filename: 'Priya_selected_1_02.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:priya:selection-voice:165eec9546',
      sourceUrl:
        'https://drive.google.com/file/d/1784Z2pmUxkpOagWmvcLmDEZNvGgwdqmc/view',
      sourceContainer: '051. Priya/05. Voice Line/Priya_JPN.zip',
      sha256:
        '6db1d751740ebf3c611e054891973d031d8be7327d56ac7cc26688e7417df41a',
    },
    {
      characterId: 'priya',
      filename: 'Priya_selected_1_03.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:priya:selection-voice:165eec9546',
      sourceUrl:
        'https://drive.google.com/file/d/1784Z2pmUxkpOagWmvcLmDEZNvGgwdqmc/view',
      sourceContainer: '051. Priya/05. Voice Line/Priya_JPN.zip',
      sha256:
        'bcc350e7249cf6fe1b3329c427075ee832ece9d62e07a9db552d70d60223c1bc',
    },
    {
      characterId: 'rio',
      filename: 'Rio_selected2_1_ja.wav',
      family: 'selected2',
      status: 'nonverbal',
      lessonId: null,
      sourceUrl:
        'https://drive.google.com/file/d/15HJaGPu_3WjW1Aiif63USxIDdPYdHKpu/view',
      sourceContainer: '031. Rio/05. Voice Line/Rio_JPN.zip',
      sha256:
        '7a153b2549f8de5a0e491fe850e4a73d19840ac7b87c84363367b1c0c9df273f',
    },
    {
      characterId: 'rio',
      filename: 'Rio_selected_1_ja.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:rio:selection-voice:d1fb44eea8',
      sourceUrl:
        'https://drive.google.com/file/d/15HJaGPu_3WjW1Aiif63USxIDdPYdHKpu/view',
      sourceContainer: '031. Rio/05. Voice Line/Rio_JPN.zip',
      sha256:
        'a6f7b96bd63ace02b46785ce8cfa38a2e9693c73c4c5f152df1849e5c167acd1',
    },
    {
      characterId: 'rozzi',
      filename: 'rozzi_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:rozzi:selection-voice:8cc794ce1c',
      sourceUrl:
        'https://drive.google.com/file/d/13rDewSEApzoyPzfdclmT0CGaIYCEC-U9/view',
      sourceContainer: '021. Rozzi/05. Voice Line/Rozzi_JPN.zip',
      sha256:
        'e39e7f766ea6b8521ad21388b15d9df6e935c6a67c43d9ce7b73e92d37893aca',
    },
    {
      characterId: 'shoichi',
      filename: 'shoichi_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:shoichi:selection-voice:76e7082f4c',
      sourceUrl:
        'https://drive.google.com/file/d/13aL5N_SRtQngeJz0Ft3jG-nVfXNVJisW/view',
      sourceContainer: '017. Shoichi/05. Voice Line/Shoichi_JPN.zip',
      sha256:
        '81144c97a86c64cfad18b53847101289273b3cb1e014898da1cf97691cf1f04d',
    },
    {
      characterId: 'silvia',
      filename: 'silvia_selected_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:silvia:selection-voice:0f1f8a4534',
      sourceUrl:
        'https://drive.google.com/file/d/13XiiSCqoNJGw9XfgVA15pbqJshS3fVYX/view',
      sourceContainer: '018. Silvia/05. Voice Line/Silvia_JPN.zip',
      sha256:
        '89e8fd8fe50b7f72def9e611121811d8f1bbc4141508aaebd7014aa01f674b3f',
    },
    {
      characterId: 'silvia',
      filename: 'silvia_selected_02.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:silvia:selection-voice:0f1f8a4534',
      sourceUrl:
        'https://drive.google.com/file/d/13XiiSCqoNJGw9XfgVA15pbqJshS3fVYX/view',
      sourceContainer: '018. Silvia/05. Voice Line/Silvia_JPN.zip',
      sha256:
        '03affd8f22d68598b8a074448f1bf86706358b48c050c83254b2c7c017219336',
    },
    {
      characterId: 'sissela',
      filename: 'sissela_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:sissela:selection-voice:adc32d5484',
      sourceUrl:
        'https://drive.google.com/file/d/13FRO2NKSKpaYbhro-gtdvmsZFUWosdGF/view',
      sourceContainer: '014. Sissela/05. Voice Line/Sissela_JPN.zip',
      sha256:
        '1b0ec6d43e062a7a7fe5416ce9af25da482e3c4bab97c7b0a94bf2de9e6f877e',
    },
    {
      characterId: 'sua',
      filename: 'sua_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:sua:selection-voice:905526d993',
      sourceUrl:
        'https://drive.google.com/file/d/158w2QsTne_7v_bONsK-5bdJP1nV0WCs_/view',
      sourceContainer: '028. Sua/05. Voice Line/Sua_JPN.zip',
      sha256:
        'bffe26200e5c844f6347b3b5c6fbdcb0dcc1ec13127bbc3c841407d6fc1e98da',
    },
    {
      characterId: 'tazia',
      filename: 'Tazia_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:tazia:selection-voice:11e527ece9',
      sourceUrl:
        'https://drive.google.com/file/d/182vaQxSdzZ9DUvex3MgCvzzSzrnCiAjd/view',
      sourceContainer: '060. Tazia/05. Voice Line/Tazia_JPN.zip',
      sha256:
        '95804929dfa97d9297598b6931fbcac8dff04811f5386b6f51f51da5d3f3883f',
    },
    {
      characterId: 'theodore',
      filename: 'Theodore_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:theodore:selection-voice:70781f9fc0',
      sourceUrl:
        'https://drive.google.com/file/d/18Hw1RwiLzvtaEgSahWM0RbOVxMUpIz6j/view',
      sourceContainer: '062. Theodore/05. Voice Line/Theodore_JPN.zip',
      sha256:
        '76531a9a9e8b790230c21d01e06f2ebe8a5ff851184560d197873f5fa30d4b69',
    },
    {
      characterId: 'tia',
      filename: 'Tia_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:tia:selection-voice:e52dd253e1',
      sourceUrl:
        'https://drive.google.com/file/d/1KvxEYmxvNtljul22diZPjCSYLIGp3TZM/view',
      sourceContainer: '048. Tia/05. Voice Line/Tia_JPN.zip',
      sha256:
        'a12986e3b04e456fe29dff09bb6a84bc34986ef98b895794ea9b3af5f9f36c8a',
    },
    {
      characterId: 'tsubame',
      filename: 'tsubame_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:tsubame:selection-voice:50799f8c51',
      sourceUrl:
        'https://drive.google.com/file/d/14IE42p6LFq2IdVlsH7n5NoeYMqbW8P4W/view',
      sourceContainer: '070. Tsubame/05. Voice Line/Tsubame_JPN.zip',
      sha256:
        '559870ea1ecac01994754e0cfab16987cb6a3b41d93be4410e79ddd5a6a46714',
    },
    {
      characterId: 'vanya',
      filename: 'Vanya_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:vanya:selection-voice:879e357465',
      sourceUrl:
        'https://drive.google.com/file/d/14nk7zGE78qPrI2kl1KFLUi1kRT5ndFyy/view',
      sourceContainer: '064. Vanya/05. Voice Line/Vanya_JPN.zip',
      sha256:
        '700d8123af32710019a3bfc2d62eb3994ea335a1bd6821e1594f241c6192d7eb',
    },
    {
      characterId: 'william',
      filename: 'William_selected_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:william:selection-voice:331bb2b949',
      sourceUrl:
        'https://drive.google.com/file/d/15TiExEr2P8_5ldNVbyeZU2bztQvqlqK4/view',
      sourceContainer: '032. William/05. Voice Line/William_JPN.zip',
      sha256:
        '21c358284b74865a40334206e562702162a69a6fba10fe5539ab5f69fd46ce3e',
    },
    {
      characterId: 'xiukai',
      filename: 'xiukai_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:xiukai:selection-voice:5ee1ad5e4e',
      sourceUrl:
        'https://drive.google.com/file/d/139ETsOc2vG6tqrPHDC22BvFU6ugrKqfT/view',
      sourceContainer: '013. Xiukai/05. Voice Line/Xiukai_JPN.zip',
      sha256:
        '6450ee8e5c7fe15edfbdfdfc671deda24d98e84438f9c0fd183adafe051f6aab',
    },
    {
      characterId: 'xuelin',
      filename: 'Xuelin_selected_1__01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:xuelin:selection-voice:d46bfe65cf',
      sourceUrl:
        'https://drive.google.com/file/d/182mzAKEHgD5HgbtAP_RtqiLktnZ5-4jo/view',
      sourceContainer: '082. Xuelin/05. Voice Line/Xuelin_Voice Line_JPN.zip',
      sha256:
        '9900309fa970693ed16435f315bbdb7181428e28acb56d61acbd85fb7e70bb55',
    },
    {
      characterId: 'yuki',
      filename: 'yuki_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:yuki:selection-voice:b2a055bb61',
      sourceUrl:
        'https://drive.google.com/file/d/134_Vi7Fox0KU_WRo07LgPFSqxkIsOLQr/view',
      sourceContainer: '011. Yuki/05. Voice Line/Yuki_JPN.zip',
      sha256:
        '9e39882636eb45b3634a8b28ffb55d1a5a135e64ef42ab8e65c3f11fadbd7a17',
    },
    {
      characterId: 'yumin',
      filename: 'YuMin_selected_1_01.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:yumin:selection-voice:c4cd5ea772',
      sourceUrl:
        'https://drive.google.com/file/d/10WNgc9V0vK2cC5z2BQDjqk_I95lD1W2H/view',
      sourceContainer: '077. Yumin/05. Voice Line/JPN/YuMin_selected_1_01.wav',
      sha256:
        '5d622d42eab8bd29d0ecb1fae8ac1b9db1d891d10692e9093daefaa2a67edca0',
    },
    {
      characterId: 'zahir',
      filename: 'zahir_selected.wav',
      family: 'selected',
      status: 'speech',
      lessonId: 'er:zahir:selection-voice:332664fbf6',
      sourceUrl:
        'https://drive.google.com/file/d/12_pVIpKcR849fLbFiNoh1G-HnGiEwG40/view',
      sourceContainer: '007. Zahir/05. Voice Line/Zahir_JPN.zip',
      sha256:
        '7acbbaf8e191cedf9205d4ca1c88edbcb82886f9e573d50c5d385c34543f990c',
    },
  ]).map((row) => Object.freeze(row)),
);
export const erFankitTotals = Object.freeze({
  clips: erFankitSources.length,
  characters: new Set(erFankitSources.map((row) => row.characterId)).size,
  withText: erFankitSources.filter((row) => row.status === 'speech').length,
  nonverbal: erFankitSources.filter((row) => row.status === 'nonverbal').length,
  lessons: new Set(
    erFankitSources.filter((row) => row.lessonId).map((row) => row.lessonId),
  ).size,
});
