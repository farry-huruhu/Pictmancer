/* =========================================
   BOSS BATTLE GAME LOGIC (Complete Version)
   ========================================= */

/* === 初期設定 === */
let maxBossHP = 5000; // Phase 2では再設定されます
let maxPlayerHP = 1000;
let bossHP = maxBossHP;
let playerHP = maxPlayerHP;
let isGuardPhase = false; // 敵ターン中は操作不能
let currentQuestion = null;
let currentPhase = 1;

// ラッシュモード（支配の塔）管理変数
let hasTriggeredDesperation = false; // HP3000以下イベント発動済みか
let isRapidMode = false;             // ラッシュモード中か
let rapidTimerVal = 30;
let rapidCorrectCount = 0;
let rapidInterval = null;

// スキルクールダウン (CD)
let cdHammer = 0; 
let cdSky = 0;
let cdTempera = 0; 
let cdRainbow = 0; 
let cdChroma = 0;
let isTemperaActive = false; // テンペラコート効果中か

/* === UI要素の取得 === */
const bossHpBar = document.getElementById('boss-hp-bar');
const bossHpText = document.getElementById('boss-hp-text');
const playerHpBar = document.getElementById('player-hp-bar');
const playerHpText = document.getElementById('player-hp-text');
const logBox = document.getElementById('battle-log');
const bossSprite = document.getElementById('boss-sprite');
const gameContainer = document.querySelector('.game-container');
const bgmPhase2Audio = document.getElementById('bgm-phase2'); // ★この行を追加

// メニュー関連
const menuMain = document.getElementById('menu-main');
const menuSkills = document.getElementById('menu-skills');
const btnAttack = document.getElementById('btn-attack');
const btnHeal = document.getElementById('btn-heal');
const btnSkillMode = document.getElementById('btn-skill-mode');
const btnBackMenu = document.getElementById('btn-back-menu');

// スキルボタン
const btnHammer = document.getElementById('btn-hammer');
const btnSky = document.getElementById('btn-sky');
const btnTempera = document.getElementById('btn-tempera');
const btnRainbow = document.getElementById('btn-rainbow');
const btnChroma = document.getElementById('btn-chroma');

// クイズ・演出関連
const quizModal = document.getElementById('quiz-modal');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const btnAnswer = document.getElementById('btn-answer');
const spellName = document.getElementById('spell-name');

// リザルト・フェーズ移行関連
const resultScreen = document.getElementById('result-screen');
const resultTitle = document.getElementById('result-title');
const resultMsg = document.getElementById('result-msg');
const btnNextPhase = document.getElementById('btn-next-phase');

const phase2IntroOverlay = document.getElementById('phase2-intro-overlay');
const bossDialogueElement = document.getElementById('boss-dialogue');
const introEffectLight = document.querySelector('.intro-effect-light');
const introEffectFlash = document.querySelector('.intro-effect-flash');

// ★ラッシュモード用UI
const rapidUi = document.getElementById('rapid-mode-ui');
const rapidTimerSpan = document.getElementById('rapid-timer');
const rapidScoreSpan = document.getElementById('rapid-score');
const effectOverlay = document.getElementById('effect-overlay');


/* === 敵のデータ === */
const enemySkills = {
    phase1: [
        { name: "ロックカッター", damage: 450 },
        { name: "制裁の刃", damage: 500 },
        { name: "幻影生成", damage: 550 },
        { name: "地脈隆起", damage: 600 },
        { name: "統制の塔", damage: 750 },
        { name: "大地の連槌", damage: 850 },
        { name: "エンシェントクエイジャ", damage: 1200 }
    ],
    phase2: [
        { name: "ロックカッター・改", damage: 600 },
        { name: "制裁の刃・獄", damage: 700 },
        { name: "真・統制の塔群", damage: 900 },
        { name: "崩壊する大地", damage: 1000 },
        { name: "終焉の連槌", damage: 1200 },
        { name: "ディザスタークエイジャ", damage: 1500 }
    ]
};

// クイズデータ
/* =========================================
   クイズデータ設定
   ========================================= */

// ----------------------------------------------------------------
// 第1形態用：WWI、ロシア革命、辛亥革命、明治末～大正初期の騒乱
// ----------------------------------------------------------------
const questionsPhase1 = [
    // --- 第一次世界大戦 ---
    { q: "1914年、オーストリア皇位継承者夫妻が暗殺された事件は？", a: ["サライェヴォ事件", "サラエボ事件"] },
    { q: "第一次世界大戦で、ドイツ・オーストリア・トルコなどの陣営を何という？", a: ["同盟国"] },
    { q: "第一次世界大戦で、イギリス・フランス・ロシア・日本などの陣営を何という？", a: ["連合国", "協商国"] },
    { q: "第一次世界大戦中、国家が国民や経済を総動員して戦う体制を何という？", a: ["総力戦"] },
    { q: "第一次世界大戦の新兵器で、塹壕戦を打開するために登場した車両は？", a: ["戦車"] },
    { q: "第一次世界大戦で、ドイツが対抗するために用いた海中の兵器は？", a: ["潜水艦"] },
    { q: "毒ガスや飛行機が本格的に実戦投入された最初の大規模な戦争は？", a: ["第一次世界大戦"] },
    { q: "1917年、ドイツの無制限潜水艦作戦をきっかけに参戦した国は？", a: ["アメリカ","アメリカ合衆国"] },
    { q: "第一次世界大戦中、英仏ロがオスマン帝国領の分割を秘密裏に決めた協定は？", a: ["サイクス・ピコ協定"] },

    // --- ロシア革命 ---
    { q: "1917年、ロシアで「パンと平和」を求めて起こった革命は？", a: ["ロシア革命"] },
    { q: "ロシア革命を指導し、世界初の社会主義政府を樹立した人物は？", a: ["レーニン"] },
    { q: "ロシア革命後、皇帝による政治が倒され、成立した世界初の社会主義国は？", a: ["ソ連", "ソビエト社会主義共和国連邦"] },
    { q: "ロシア革命の影響が広がるのを防ぐため、日本などが兵を送った出来事は？", a: ["シベリア出兵"] },
    { q: "第一次世界大戦中にロシアで成立した、労働者や兵士の代表会議を何という？", a: ["ソビエト"] },
    { q: "1905年、ロシアで皇帝への請願デモに軍隊が発砲し、革命のきっかけとなった事件は？", a: ["血の日曜日事件"] },
    { q: "日露戦争中のロシア第一革命の結果、皇帝ニコライ2世が開設を約束した国会（議会）を何という？", a: ["ドゥーマ"] },

    // --- 明治末期〜大正初期・日本の植民地支配 ---
    { q: "日露戦争後、講和条約の内容に不満を持った民衆が東京で起こした暴動は？", a: ["日比谷焼打事件"] },
    { q: "1910年の大逆事件以降、社会主義運動が厳しく弾圧され、活動が停滞した時期を何という？", a: ["冬の時代"] },
    { q: "1910年、天皇暗殺を計画したとして幸徳秋水らが処刑された事件は？", a: ["大逆事件"] },
    { q: "大逆事件で処刑された、社会主義者で『平民新聞』の中心人物は？", a: ["幸徳秋水"] },
    { q: "日露戦争中、幸徳秋水や堺利彦らが結成し、反戦を訴えた新聞は？", a: ["平民新聞"] },
    { q: "日本が台湾や朝鮮を支配するために設置した統治機関を何という？", a: ["総督府"] },
    { q: "植民地の人々に日本語や日本風の生活様式を強制した政策を何という？", a: ["同化政策"] },
    { q: "朝鮮で、日本の植民地化に抵抗して戦った人々による武装抗争を何という？", a: ["義兵運動"] },
    { q: "1915年、日本が中国の袁世凱政府に突きつけた要求は？", a: ["二十一か条の要求", "21か条の要求"] },
    { q: "第一次世界大戦中に、日本がドイツ権益を奪う形で占領した中国の場所は？", a: ["山東半島"] },
    { q: "第一次世界大戦中、日本経済が好景気となり、急激に金持ちになった人々を何という？", a: ["成金"] },
    { q: "第一次世界大戦の好景気を何という？", a: ["大戦景気"] },

    // --- 中国革命（辛亥革命前後） ---
    { q: "1911年、孫文らが中心となり清を倒して中華民国を成立させた革命は？", a: ["辛亥革命"] },
    { q: "孫文が唱えた「民族・民権・民生」からなる革命の指導理論は？", a: ["三民主義"] },
    { q: "辛亥革命の後、孫文に代わって実権を握り、独裁的な政治を行った人物は？", a: ["袁世凱"] },
    { q: "オスマン帝国で、憲法の復活を目指して青年将校らが起こした革命は？", a: ["青年トルコ革命"] }
];


// ----------------------------------------------------------------
// 第2形態用：戦後処理、民族運動、1920年代文化、大正デモクラシー
// ----------------------------------------------------------------
const questionsPhase2 = [
    // --- ベルサイユ体制と国際連盟 ---
    { q: "1919年、パリ講和会議で結ばれた、第一次世界大戦の講和条約は？", a: ["ヴェルサイユ条約"] },
    { q: "パリ講和会議に基づいて設立された、世界平和を守るための国際機関は？", a: ["国際連盟"] },
    { q: "国際連盟の設立を提案したアメリカ大統領は？", a: ["ウィルソン"] },
    { q: "国際連盟の本部はどこに置かれた？", a: ["ジュネーブ"] },
    { q: "当時のドイツで制定された、生存権の保障などを認めた民主的な憲法は？", a: ["ワイマール憲法"] },
    { q: "第一次世界大戦後、ドイツやオーストリアで崩壊した政治体制は？", a: ["帝政"] },
    { q: "パリ講和会議で、日本が提案したが否決された原則は？", a: ["人種差別撤廃", "人種差別撤廃提案"] },
    { q: "国際連盟の常任理事国となった4カ国は、イギリス、フランス、イタリアとどこ？", a: ["日本"] },
    { q: "ワシントン会議で決定された、海軍の主力艦の保有比率制限などを行う条約は？", a: ["海軍軍縮条約"] },
    { q: "ワシントン会議で確認された、中国の領土保全や門戸開放などを決めた条約は？", a: ["九カ国条約"] },
    { q: "ワシントン会議で解消されることになった、日本とイギリスの同盟は？", a: ["日英同盟"] },
    { q: "国際協調の時代における、日本の外交方針（外相の名から）を何という？", a: ["幣原外交"] },

    // --- アジア・アフリカの民族運動 ---
    { q: "インドで「非暴力・不服従」を掲げ、イギリスからの独立運動を指導した人物は？", a: ["ガンディー", "ガンジー"] },
    { q: "1919年、朝鮮で日本からの独立を求めて起こった運動は？", a: ["三・一独立運動", "3・1独立運動"] },
    { q: "1919年、中国で日本の二十一か条の要求などに反対して起こった運動は？", a: ["五・四運動"] },
    { q: "辛亥革命の指導者で、中国国民党を結成して中国の統一を目指した人物は？", a: ["孫文"] },
    { q: "孫文の死後、中国国民党の指導者となり、北伐を行って中国を統一した人物は？", a: ["蒋介石", "蔣介石"] },
    { q: "中国国民党と中国共産党が協力して軍閥や帝国主義と戦ったことを何という？", a: ["国共合作"] },
    { q: "オスマン帝国が倒れた後、トルコ共和国を建国し近代化を進めた初代大統領は？", a: ["ムスタファ・ケマル", "ケマル・パシャ"] },
    { q: "エジプトで、イギリスからの独立運動の中心となった政党（組織）は？", a: ["ワフド党"] },
    { q: "ベトナムで、日本への留学を通じて近代化を目指した「ドンズー運動」を提唱した人物は？", a: ["ファン・ボイ・チャウ"] },

    // --- アメリカの繁栄と文化（狂騒の20年代） ---
    { q: "1920年代のアメリカで、大量生産・大量消費の象徴となった自動車の通称は？", a: ["T型フォード", "フォード"] },
    { q: "ベルトコンベア方式などを導入し、製品を安く大量に作る仕組みを何という？", a: ["大量生産"] },
    { q: "1920年代のアメリカで普及した、家庭で食材を保存するための新しい家電は？", a: ["冷蔵庫", "電気冷蔵庫"] },
    { q: "1920年代に普及し、情報伝達や娯楽の中心となったメディアは？", a: ["ラジオ"] },
    { q: "1920年代のアメリカで流行した、黒人音楽をルーツとする音楽ジャンルは？", a: ["ジャズ"] },
    { q: "当時のアメリカで、新しいファッションに身を包んだ自立した女性を何と呼んだ？", a: ["フラッパー"] },
    { q: "アメリカ社会の中心とされた「WASP」の「P」が指す宗教的宗派は？", a: ["プロテスタント"] },
    { q: "1924年にアメリカで制定された、日本からの移民を事実上禁止した法律は？", a: ["排日移民法", "移民法"] },
    { q: "第一次世界大戦後のアメリカで禁止されたが、密造酒などが横行した法律は？", a: ["禁酒法"] },
    { q: "喜劇王と呼ばれ、『モダン・タイムス』などで社会を風刺した映画俳優は？", a: ["チャップリン"] },
    { q: "世界初の大西洋単独無着陸飛行に成功した飛行家は？", a: ["リンドバーグ"] },
    { q: "1920年代、ニューヨークの株式市場を中心に空前の繁栄をした時代を何という？", a: ["永遠の繁栄"] },
    { q: "1920年代、アメリカ資本が大量に流入し、経済発展が進んだヨーロッパの国は？", a: ["ドイツ"] },
    { q: "1920年代のアメリカで、白人至上主義を掲げて黒人排斥を行った秘密結社は？", a: ["KKK", "クー・クラックス・クラン"] },

    // --- 大正デモクラシーと日本の社会 ---
    { q: "大正時代に広まった、民主主義や自由主義を求める風潮を何という？", a: ["大正デモクラシー"] },
    { q: "民本主義を唱え、普通選挙の実現などを主張した政治学者は？", a: ["吉野作造"] },
    { q: "天皇機関説を唱え、政党政治の理論的支柱となった法学者は？", a: ["美濃部達吉"] },
    { q: "1918年、米の価格急騰に対し、富山県の主婦らが起こした騒動は？", a: ["米騒動"] },
    { q: "シベリア出兵を見込んで、商人が米を買い占めたことが原因で起きた騒動は？", a: ["米騒動"] },
    { q: "米騒動の責任をとって内閣が倒れた後、初の本格的な政党内閣を組織した人物は？", a: ["原敬"] },
    { q: "原敬首相は、華族ではなく衆議院議員であったため、何宰相と呼ばれた？", a: ["平民宰相"] },
    { q: "原敬内閣が、教育・交通・産業などの充実を図った政策を何という？", a: ["積極政策"] },
    { q: "1925年に制定された、25歳以上のすべての男子に選挙権を与えた法律は？", a: ["普通選挙法"] },
    { q: "普通選挙法で選挙権が与えられなかったのは、女性と、何を受け取っている人？", a: ["公的扶助", "貧困者"] },
    { q: "普通選挙法と同時に制定された、社会主義運動を取り締まるための法律は？", a: ["治安維持法"] },
    { q: "治安維持法で最高刑はどうなっていた？（当初または改正後）", a: ["死刑"] },
    { q: "女性解放運動を指導し、「青鞜社」を結成した人物は？", a: ["平塚らいてう"] },
    { q: "平塚らいてうらが発行した、女性による女性のための文芸雑誌は？", a: ["青鞜"] },
    { q: "部落差別からの解放を目指し、1922年に結成された組織は？", a: ["全国水平社"] },
    { q: "全国水平社の創立大会で読み上げられた宣言は？", a: ["水平社宣言"] },
    { q: "労働者が団結して、賃上げや労働条件の改善を求めた運動を何という？", a: ["労働争議"] },
    { q: "小作人が地主に対して、小作料の減免などを求めた運動を何という？", a: ["小作争議"] },
    { q: "大正・昭和初期に登場した、西洋風のファッションをした女性を何と呼んだ？", a: ["モダンガール", "モガ"] },
    { q: "1923年9月1日に発生し、東京・横浜などに甚大な被害をもたらした災害は？", a: ["関東大震災"] },
    { q: "関東大震災の際、デマによって虐殺されたりした人々は？", a: ["朝鮮人", "中国人", "社会主義者"] },
    { q: "関東大震災の混乱の中、デマを信じた人々によって組織され、朝鮮人などを殺傷した集団は？", a: ["自警団"] },
    { q: "関東大震災後、復興のシンボルとして建設された鉄筋コンクリートの建物は？", a: ["同潤会アパート"] },
    { q: "大正時代に創刊され、1冊で多くの読み物が安く読めるため流行した出版物は？", a: ["円本"] },
    { q: "1925年に始まり、情報の伝達速度を飛躍的に高めたメディアは？", a: ["ラジオ放送", "ラジオ"] },
    { q: "ラジオ放送が始まったのは、東京、大阪とどこ？", a: ["名古屋"] },
    { q: "改造などの総合雑誌で活躍した、貧困や社会問題をテーマにした作家たちの文学は？", a: ["プロレタリア文学"] },
    { q: "大正時代、宝塚などで人気を博した、女性だけで演じられる劇団は？", a: ["少女歌劇"] },
    { q: "1920年代、都市部で増加した、会社員などの新しい中間層を何と呼んだ？", a: ["サラリーマン"] },
    { q: "都市部で発達した、電車やバスなどの交通機関によって郊外に広がったものは？", a: ["住宅地"] },
    { q: "都市の生活様式が画一化・標準化されていく社会を何という？", a: ["大衆社会"] },
    { q: "明治以降、多くの日本人がサトウキビ栽培などのために移住した場所は？", a: ["ハワイ"] },
    { q: "アメリカへの移民が制限された後、日本からの移民が増加した南米の国は？", a: ["ブラジル"] },
    { q: "沖縄県出身の伊波普猷らが研究を進めた、沖縄の文化や歴史に関する学問は？", a: ["沖縄学"] },

    // --- ファシズムの台頭・暗い影（終盤） ---
    { q: "第一次世界大戦後のドイツが支払いを命じられた、莫大な金銭を何という？", a: ["賠償金"] },
    { q: "フランスとベルギーが、ドイツの賠償金不払いを理由に占領した地域は？", a: ["ルール地方"] },
    { q: "イタリアでファシスト党を率いて独裁政治を行った人物は？", a: ["ムッソリーニ"] },
    { q: "ドイツでナチ党（国家社会主義ドイツ労働者党）を率いた人物は？", a: ["ヒトラー"] },
    { q: "ナチス・ドイツで、子供たちをナチズムに染めるために組織された団体は？", a: ["ヒトラー・ユーゲント"] },
    { q: "1920年代、日本が中国東北部（満州）に持っていた権益を守るために行った出兵は？", a: ["山東出兵"] },
    { q: "1928年、満州の実力者である張作霖が日本軍によって爆殺された事件は？", a: ["張作霖爆殺事件"] },
    { q: "映画において、映像に合わせて音声やセリフが出るようになったものを何という？", a: ["トーキー", "有声映画"] },
    { q: "大正・昭和初期、鉄道の主要駅に直結して作られ、消費の中心となった商業施設は？", a: ["ターミナルデパート", "百貨店"] }
];

/* === ゲーム開始処理 === */
updateUI();


/* -----------------------------------
   イベントリスナー設定
----------------------------------- */

// メニュー切り替え
btnSkillMode.addEventListener('click', () => {
    menuMain.classList.add('hidden');
    menuSkills.classList.remove('hidden');
});

btnBackMenu.addEventListener('click', returnToMainMenu);
function returnToMainMenu() {
    menuSkills.classList.add('hidden');
    menuMain.classList.remove('hidden');
}

// プレイヤーアクションボタン
btnAttack.addEventListener('click', () => playerAction("attack"));
btnHeal.addEventListener('click', () => playerAction("heal"));

if(btnHammer) btnHammer.addEventListener('click', () => { if(cdHammer <= 0) playerAction("hammer"); });
if(btnSky) btnSky.addEventListener('click', () => { if(cdSky <= 0) playerAction("sky"); });
if(btnTempera) btnTempera.addEventListener('click', () => { if(cdTempera <= 0) playerAction("tempera"); });
if(btnRainbow) btnRainbow.addEventListener('click', () => { if(cdRainbow <= 0) playerAction("rainbow"); });
if(btnChroma) btnChroma.addEventListener('click', () => { if(cdChroma <= 0) playerAction("chroma"); });

// クイズ回答
btnAnswer.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') checkAnswer(); });


/* -----------------------------------
   メインバトルロジック (playerAction)
----------------------------------- */
function playerAction(type) {
    if(isGuardPhase || isRapidMode) return; // 敵ターン中・ラッシュ中は操作無効

    let endTurn = true;
    const multiplier = (currentPhase === 2) ? 1.5 : 1.0;

    // --- 行動分岐 ---
    if (type === "attack") {
        const baseDmg = Math.floor(Math.random() * 200) + 400;
        const dmg = Math.floor(baseDmg * multiplier);
        damageBoss(dmg);
        addLog(`⚔ 攻撃！ ハシュマリムに ${dmg} のダメージ！`);
    } 
    else if (type === "heal") {
        const baseHeal = 300;
        const healAmt = Math.floor(baseHeal * multiplier);
        healPlayer(healAmt);
        addLog(`✨ 回復魔法！ HPが ${healAmt} 回復した！`);
    } 
    else if (type === "hammer") {
        const dmg = Math.floor(Math.random() * 200) + 800;
        damageBoss(dmg);
        addLog(`🔨 イマジネスハンマー！！ ${dmg} の大ダメージ！`);
        cdHammer = 3; returnToMainMenu();
    } 
    else if (type === "sky") {
        healPlayer(400); addLog(`🕊️ イマジネススカイ！ HP400回復 & 再行動！`);
        cdSky = 3; endTurn = false; returnToMainMenu();
    }
    else if (type === "tempera") {
        isTemperaActive = true; addLog(`🛡️ テンペラコート！(次ダメ半減)`);
        cdTempera = 2; returnToMainMenu();
    }
    else if (type === "rainbow") {
        const dmg = Math.floor(Math.random() * 300) + 1000;
        damageBoss(dmg); healPlayer(500); addLog(`🌈 レインボードリップ！ ${dmg}ダメ & 回復！`);
        cdRainbow = 3; returnToMainMenu();
    }
    else if (type === "chroma") {
        const dmg = Math.floor(Math.random() * 500) + 2500;
        damageBoss(dmg); addLog(`🎨 クロマチックファンタジー！ ${dmg}ダメ！`);
        cdChroma = 6; returnToMainMenu();
    }

    updateUI();

    // --- ★ラッシュモード判定 (HP < 3000) ---
    // 第2形態、HP3000未満、生存中、かつ未発動の場合
    if (currentPhase === 2 && bossHP < 3000 && bossHP > 0 && !hasTriggeredDesperation) {
        startDesperationSequence(); // イベント開始
        return; // 通常のターン終了処理は行わない
    }

    // --- 撃破チェック ---
    if(bossHP <= 0) {
        if (currentPhase === 1) {
            // 10%で第2形態、90%で演出付き終了
            if (Math.random() < 0.1) {
                addLog(`!!! ハシュマリムは倒れた...しかし、邪悪な魔力が渦巻いている...！`);
                setTimeout(() => startPhase2Intro(), 2000); 
            } else {
                // ★修正: 90%の方はこちらの演出関数へ飛ばす
                handlePhase1Defeat();
            }
        } else {
            // 第2形態撃破時
            handlePhase2Defeat();
        }
        return;
    }
    if (endTurn) {
        setTimeout(() => enemyTurn(), 100);
    }
}
/* -----------------------------------
   ★ HP3000以下イベント (ラッシュモード)
----------------------------------- */
function startDesperationSequence() {
    hasTriggeredDesperation = true;
    isGuardPhase = true; // プレイヤー操作禁止
    disableButtons(true);

    addLog("ハシュマリムの魔力が、冷徹な殺意へと変わる……");

    // 1. セリフ表示（前半）
    phase2IntroOverlay.classList.remove('hidden');
    bossDialogueElement.textContent = "理解した……貴様の力、想定の域を超えている。だが、秩序は守られねばならぬ。";
    bossDialogueElement.style.opacity = 0;
    setTimeout(() => bossDialogueElement.style.opacity = 1, 100);

    // 2. セリフ表示（後半）＆ 技名宣言
    setTimeout(() => {
        bossDialogueElement.style.opacity = 0;
        setTimeout(() => {
            bossDialogueElement.textContent = "この混沌に、楔を打ち込もう。聳えよ、世界の礎……『支配の塔』！！";
            bossDialogueElement.style.opacity = 1;
        }, 500);
    }, 4000);

    // 3. セリフ後、紫色の光でラッシュ開始
    setTimeout(() => {
        phase2IntroOverlay.classList.add('hidden'); // セリフ消す
        effectOverlay.classList.remove('hidden');
        effectOverlay.classList.add('purple-flash'); // 紫エフェクトON
        
        addLog("⚠ 『支配の塔』が起動する！ 30秒間、崩壊を阻止せよ！");
        startRapidQuiz();
    }, 9000);
}


/* ラッシュモード: 開始 */
function startRapidQuiz() {
    isRapidMode = true;
    rapidCorrectCount = 0;
    rapidTimerVal = 30;

    // UI表示
    rapidUi.classList.remove('hidden');
    rapidScoreSpan.textContent = rapidCorrectCount;
    rapidTimerSpan.textContent = rapidTimerVal;

    // タイマー開始
    rapidInterval = setInterval(() => {
        rapidTimerVal--;
        rapidTimerSpan.textContent = rapidTimerVal;
        if (rapidTimerVal <= 0) {
            finishRapidQuiz();
        }
    }, 1000);

    // 最初の問題を表示
    nextRapidQuestion();
}

/* ラッシュモード: 次の問題へ */
function nextRapidQuestion() {
    if (!isRapidMode) return;
    
    // ▼▼▼ 修正箇所：ラッシュ中は第2形態の問題を使う ▼▼▼
    const targetQuestions = questionsPhase2;
    // ▲▲▲ 修正箇所終わり ▲▲▲

    const qIndex = Math.floor(Math.random() * targetQuestions.length);
    currentQuestion = targetQuestions[qIndex]; // ここも修正
    
    // UI表示処理（そのまま）
    quizModal.classList.remove('hidden');
    spellName.textContent = "🏯 支配の塔・構築中..."; 
    spellName.style.color = "#d500f9"; 
    
    questionText.textContent = currentQuestion.q;
    answerInput.value = "";
    answerInput.focus();
}
/* ラッシュモード: 終了判定 */
function finishRapidQuiz() {
    clearInterval(rapidInterval);
    isRapidMode = false;
    quizModal.classList.add('hidden');
    rapidUi.classList.add('hidden');
    effectOverlay.classList.remove('purple-flash');

    // 結果判定
    if (rapidCorrectCount >= 5) {
        // === 成功 (7問以上？ ※ここの数字は判定ロジック依存ですが、コード上は1以上なら成功扱いになっています) ===
        effectOverlay.classList.add('white-out');
        
        setTimeout(() => {
            gameContainer.classList.add('bg-ash-land');
            
            effectOverlay.classList.remove('white-out');
            effectOverlay.classList.add('hidden');
            
            addLog("✨ 『支配の塔』を破壊した！ 空間が砕け、灰の大地へと戦場が移る！");
            
            // ★修正: 先にゲーム操作を有効に戻す（これでフリーズしなくなります）
            isGuardPhase = false;
            disableButtons(false);
            updateUI();

            // ★修正: その後で音を鳴らす（エラーが出てもゲームは止まらない）
            if (bgmPhase2Audio) {
                bgmPhase2Audio.volume = 0.5;
                // ブラウザによってはここでブロックされることがあるため catch で握りつぶす
                bgmPhase2Audio.play().catch(e => console.log("BGM再生エラー(無視してOK):", e));
            }

        }, 2000);
        
    } else {
        // === 失敗 ===
        effectOverlay.classList.add('purple-flash');
        addLog("💥 詠唱阻止失敗... 『支配の塔』が完成し、破滅の光が降り注ぐ！！");

        setTimeout(() => {
            effectOverlay.classList.remove('purple-flash');
            effectOverlay.classList.add('hidden');
            
            const dmg = 2000;
            playerHP -= dmg;
            if (playerHP < 0) playerHP = 0;
            showDamage(document.getElementById('player-damage-text'), dmg);
            
            addLog(`💀 プレイヤーに ${dmg} の致命的ダメージ！`);
            updateUI();

            if (playerHP <= 0) {
                setTimeout(() => endGame(false), 1000);
            } else {
                // 生き残った場合
                
                // ★修正: 先にゲーム操作を有効に戻す
                isGuardPhase = false;
                disableButtons(false);

                // ★修正: その後で音を鳴らす
                if (bgmPhase2Audio) {
                    bgmPhase2Audio.volume = 0.5;
                    bgmPhase2Audio.play().catch(e => console.log("BGM再生エラー(無視してOK):", e));
                }
            }
        }, 1500);
    }
}

/* -----------------------------------
   共通: 答え合わせ (checkAnswer)
----------------------------------- */
function checkAnswer() {
    const inputVal = answerInput.value.trim();
    if(!inputVal) return;
    const isCorrect = currentQuestion.a.some(ans => ans === inputVal);
    
    if (isRapidMode) {
        // ★ラッシュモード中の挙動
        if (isCorrect) {
            rapidCorrectCount++;
            rapidScoreSpan.textContent = rapidCorrectCount;
            // 正解エフェクト（簡易：背景緑フラッシュ）
            document.body.style.backgroundColor = "#2e7d32";
            setTimeout(()=> document.body.style.backgroundColor = "#000", 100);
        } else {
            // 不正解エフェクト（簡易：背景赤フラッシュ）
            document.body.style.backgroundColor = "#b71c1c";
            setTimeout(()=> document.body.style.backgroundColor = "#000", 100);
        }
        // 即座に次の問題へ (モーダルは閉じない)
        nextRapidQuestion();
        
    } else {
        // ★通常モードの挙動
        quizModal.classList.add('hidden');
        resolveEnemyAttack(isCorrect);
    }
}


/* -----------------------------------
   敵のターン (通常時)
----------------------------------- */
function enemyTurn() {
    isGuardPhase = true;
    returnToMainMenu();
    reduceCooldowns();

    const skills = (currentPhase === 1) ? enemySkills.phase1 : enemySkills.phase2;
    const skill = skills[Math.floor(Math.random() * skills.length)];

    // ▼▼▼ 修正箇所：フェーズによって問題リストを切り替える ▼▼▼
    const targetQuestions = (currentPhase === 1) ? questionsPhase1 : questionsPhase2;
    // ▲▲▲ 修正箇所終わり ▲▲▲

    // 選んだリストからランダムに出題
    const qIndex = Math.floor(Math.random() * targetQuestions.length);
    
    // targetQuestions を使うように変更
    currentQuestion = { ...targetQuestions[qIndex], damage: skill.damage };

    addLog(`⚠ 敵の詠唱: ${skill.name}！`);
    setTimeout(() => { openQuiz(skill.name, currentQuestion.q); }, 1200);
}

function openQuiz(skillNameText, qText) {
    quizModal.classList.remove('hidden');
    spellName.textContent = skillNameText;
    spellName.style.color = "#ff5252"; // 通常色は赤
    questionText.textContent = qText;
    answerInput.value = ""; 
    answerInput.focus();
}


/* -----------------------------------
   ダメージ計算・結果処理 (通常時)
----------------------------------- */
function resolveEnemyAttack(isCorrect) {
    let finalDamage = currentQuestion.damage;
    
    if(isCorrect) {
        // 正解時：確率でダメージ軽減・回避・カウンター
        const luck = Math.random(); 
        if (luck < 0.5) { 
            finalDamage = Math.floor(finalDamage / 2); 
            addLog(`🛡 ガード成功!半減(${finalDamage})`); 
        } 
        else if (luck < 0.8) { 
            finalDamage = Math.floor(finalDamage / 4); 
            addLog(`🛡🛡 ジャストガード!1/4(${finalDamage})`); 
        } 
        else { 
            finalDamage = 0; 
            addLog(`✨ 完全回避!`);
            if (Math.random() < 0.1) {
                const counter = Math.floor((Math.random() * 200 + 400) * 1.5);
                setTimeout(()=> { 
                    damageBoss(counter); 
                    addLog(`⚔⚡ カウンター! ${counter}ダメ!`); 
                    updateUI(); 
                }, 500);
            }
        }
    } else { 
        addLog(`💥 直撃! ${finalDamage}ダメ!`); 
    }
    
    // テンペラコート処理
    if(isTemperaActive && finalDamage > 0) { 
        finalDamage = Math.floor(finalDamage / 2); 
        isTemperaActive = false; 
        addLog(`🛡️ テンペラコートで軽減!`); 
    }
    
    // プレイヤーダメージ適用
    if (finalDamage > 0) {
        playerHP -= finalDamage; 
        if(playerHP < 0) playerHP = 0;
        showDamage(document.getElementById('player-damage-text'), finalDamage);
        document.body.classList.add('shake'); 
        setTimeout(()=>document.body.classList.remove('shake'), 500);
    }

    updateUI();

    if(playerHP <= 0) {
        setTimeout(()=>endGame(false), 1000);
    } else { 
        isGuardPhase = false; 
        disableButtons(false); 
    }
}


/* -----------------------------------
   ユーティリティ関数
----------------------------------- */
function damageBoss(amount) {
    bossHP -= amount;
    if(bossHP < 0) bossHP = 0;
    showDamage(document.getElementById('boss-damage-text'), amount);
    
    // ダメージ演出
    bossSprite.classList.remove('shake');
    void bossSprite.offsetWidth; // リフロー強制
    bossSprite.classList.add('shake');
}

function healPlayer(amount) {
    playerHP += amount;
    if(playerHP > maxPlayerHP) playerHP = maxPlayerHP;
    showDamage(document.getElementById('player-damage-text'), amount, true); // true=回復色
}

function reduceCooldowns() {
    if(cdHammer > 0) cdHammer--;
    if(cdSky > 0) cdSky--;
    if(cdTempera > 0) cdTempera--;
    if(cdRainbow > 0) cdRainbow--;
    if(cdChroma > 0) cdChroma--;
}

function updateUI() {
    bossHpBar.style.width = `${(bossHP / maxBossHP) * 100}%`;
    bossHpText.textContent = `HP: ${bossHP}`;
    
    playerHpBar.style.width = `${(playerHP / maxPlayerHP) * 100}%`;
    playerHpText.textContent = `HP: ${playerHP} / ${maxPlayerHP}`;
    
    updateButtonsState();
    
    if (currentPhase === 2) {
        document.querySelector('.boss-hud .name').textContent = "統制者ハシュマリム・覚醒";
    }
}

function updateButtonsState() {
    setBtnState(btnHammer, cdHammer, "大ダメージ (CD:2)");
    setBtnState(btnSky, cdSky, "回復+再行動 (CD:2)");
    setBtnState(btnTempera, cdTempera, "次ダメ半減 (CD:1)");
    setBtnState(btnRainbow, cdRainbow, "回復+攻撃 (CD:2)");
    setBtnState(btnChroma, cdChroma, "超絶ダメージ (CD:5)");
}

function setBtnState(btn, cd, txt) {
    if(btn){
        if(cd > 0){
            btn.disabled = true;
            btn.querySelector('.sub-text').textContent = `あと ${cd} ターン`;
        } else {
            btn.disabled = false;
            btn.querySelector('.sub-text').textContent = txt;
        }
    }
}

function disableButtons(bool) {
    document.querySelectorAll('.cmd-btn').forEach(btn => btn.disabled = bool);
    if(!bool) updateButtonsState(); // 有効化する時はCDを考慮して再設定
}

function addLog(text) {
    const p = document.createElement('p');
    p.textContent = text;
    logBox.prepend(p);
}

function showDamage(element, amount, isHeal = false) {
    element.textContent = amount;
    element.style.color = isHeal ? '#00e676' : (element.id.includes('player') ? '#ff1744' : '#ffea00');
    element.classList.remove('hidden');
    element.style.animation = 'none';
    element.offsetHeight; // リフロー
    element.style.animation = null; // CSSアニメーション再開
}


/* -----------------------------------
   フェーズ移行・ゲーム終了処理
----------------------------------- */

// 第2形態導入
function startPhase2Intro() {
    resultScreen.classList.add('hidden'); 
    phase2IntroOverlay.classList.remove('hidden');
    
    const d = [
        "まだ、終われぬ。我が悲願を叶えるために我はまだ死ねぬ。", 
        "ワインよりも濃く 灼熱の溶岩よりも熱い “血”をその復活のために捧げよう！"
    ];
    let i = 0;

    function show() {
        if(i < d.length){
            bossDialogueElement.textContent = d[i];
            bossDialogueElement.style.opacity = 0;
            setTimeout(() => bossDialogueElement.style.opacity = 1, 50);
            i++;
            setTimeout(show, 4000);
        } else {
            // 光の演出
            setTimeout(() => {
                introEffectLight.classList.remove('hidden');
                introEffectFlash.classList.remove('hidden');
            }, 1000);
            // 本編へ移行
            setTimeout(transitionToPhase2, 3500);
        }
    }
    bossDialogueElement.style.opacity = 1;
    show();
}

// 第2形態へ移行実行
function transitionToPhase2() {
    phase2IntroOverlay.classList.add('hidden');
    currentPhase = 2;
    
    // 画像切り替え & ステータス強化
    bossSprite.style.backgroundImage = "url('hashmalim_p2.png')";
    bossSprite.classList.add('shake');
    
    maxPlayerHP = 2000; 
    playerHP = maxPlayerHP;
    bossHP = 8000; // 第2形態HP
    maxBossHP = 8000; // 変数更新漏れ防止
    
    // スキル解放
    btnHammer.classList.add('hidden'); 
    btnSky.classList.add('hidden');
    btnTempera.classList.remove('hidden'); 
    btnRainbow.classList.remove('hidden'); 
    btnChroma.classList.remove('hidden');
    
    addLog(`🔥🔥 統制者ハシュマリムは第二形態へと変貌を遂げた！`);
    addLog(`✨ プレイヤー覚醒！ステータスUP！`);
    
    updateUI();
    isGuardPhase = false;
    disableButtons(false);
}

// 第2形態撃破時
function handlePhase2Defeat() {
    logBox.innerHTML = "";
    addLog("ハシュマリムの動きが止まった...");
    
    phase2IntroOverlay.classList.remove('hidden');
    introEffectLight.classList.add('hidden');
    introEffectFlash.classList.add('hidden');
    
    bossDialogueElement.textContent = "あぁ...我もここまでか。だが、最後にして心が高揚する闘いだった。";
    bossDialogueElement.style.opacity = 0;
    setTimeout(() => bossDialogueElement.style.opacity = 1, 100);
    
    setTimeout(() => {
        phase2IntroOverlay.classList.add('hidden');
        triggerExplosion();
    }, 5000);
}

// 爆発演出
function triggerExplosion() {
    addLog("ハシュマリムは光に包まれ消滅していく...");
    bossSprite.classList.add('exploding');
    setTimeout(() => {
        bossSprite.style.opacity = 0;
        endGame(true);
    }, 1500);
}

// ゲーム終了画面
function endGame(isWin) {
    quizModal.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    if(isWin) {
        // ★修正: どの形態で勝ったかによってメッセージを変える
        if (currentPhase === 1) {
            // 第1形態で終了した場合
            resultTitle.textContent = "MISSION SUCCESS";
            resultTitle.style.color = "#00e676"; // 少し色を変える（緑系など）
            resultMsg.textContent = "討伐成功...?";
        } else {
            // 第2形態（完全体）を倒した場合
            resultTitle.textContent = "MISSION COMPLETE";
            resultTitle.style.color = "gold";
            resultMsg.textContent = "討伐完了！";
        }

        if(btnNextPhase) btnNextPhase.classList.add('hidden');
    } else {
        // 負けた場合
        resultTitle.textContent = "MISSION FAILED";
        resultTitle.style.color = "red";
        resultMsg.textContent = "全滅...";
        if(btnNextPhase) btnNextPhase.classList.add('hidden');
    }
}
/* -----------------------------------
   ★追加: 第1形態撃破時の演出（光の玉→消滅）
----------------------------------- */
function handlePhase1Defeat() {
    // 1. メッセージ
    addLog("ハシュマリムは最期の力を振り絞り、光の玉を放った！");
    
    // 2. 光の玉をJSで動的に作成して画面に追加
    let ball = document.getElementById('final-light-ball');
    if (!ball) {
        ball = document.createElement('div');
        ball.id = 'final-light-ball';
        document.querySelector('.game-container').appendChild(ball);
    }

    // 3. アニメーション開始（0.5秒後に発射）
    setTimeout(() => {
        // 音があればここで攻撃音などを鳴らすと良い
        ball.classList.add('shoot-ball'); // CSSアニメーション適用
    }, 500);

    // 4. 着弾（画面ホワイトアウト ＆ ボス消滅開始）
    setTimeout(() => {
        // 画面を白くフラッシュさせる（既存のエフェクト使用）
        effectOverlay.classList.remove('hidden');
        effectOverlay.classList.add('white-out');

        // ボスを消す
        bossSprite.classList.add('fade-out-boss');
        
        // 玉を消す
        ball.remove();

        // プレイヤーダメージ演出（演出として揺らすだけ、HPは減らさない）
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 500);

    }, 1300); // 発射から0.8秒後くらいに着弾

    // 5. ホワイトアウトが晴れて、ボスがいなくなっている → リザルトへ
    setTimeout(() => {
        effectOverlay.classList.remove('white-out');
        effectOverlay.classList.add('hidden');
        
        addLog("光が収まると、そこにハシュマリムの姿はなかった...");
        
        // 少し間をおいてリザルト画面へ
        setTimeout(() => {
            endGame(true);
        }, 2000);

    }, 3000);
}
