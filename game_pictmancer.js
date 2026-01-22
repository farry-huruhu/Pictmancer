document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. 問題データベース (全約100問)
    // ==========================================
    const allQuestions = [
        // --- 第一次世界大戦とロシア革命 ---
        { q: "1914年、オーストリア皇位継承者夫妻が暗殺された事件は？", a: ["サライェヴォ事件", "サラエボ事件"] },
        { q: "1910年の大逆事件以降、社会主義運動が厳しく弾圧され、活動が停滞した時期を何という？", a: ["冬の時代"] },
        { q: "第一次世界大戦で、ドイツ・オーストリア・トルコなどの陣営を何という？", a: ["同盟国"] },
        { q: "第一次世界大戦で、イギリス・フランス・ロシア・日本などの陣営を何という？", a: ["連合国", "協商国"] },
        { q: "第一次世界大戦中、国家が国民や経済を総動員して戦う体制を何という？", a: ["総力戦"] },
        { q: "第一次世界大戦の新兵器で、塹壕戦を打開するために登場した車両は？", a: ["戦車"] },
        { q: "第一次世界大戦で、ドイツが対抗するために用いた海中の兵器は？", a: ["潜水艦"] },
        { q: "毒ガスや飛行機が本格的に実戦投入された最初の大規模な戦争は？", a: ["第一次世界大戦"] },
        { q: "1917年、ロシアで「パンと平和」を求めて起こった革命は？", a: ["ロシア革命"] },
        { q: "ロシア革命を指導し、世界初の社会主義政府を樹立した人物は？", a: ["レーニン"] },
        { q: "ロシア革命後、皇帝による政治が倒され、成立した世界初の社会主義国は？", a: ["ソ連", "ソビエト社会主義共和国連邦"] },
        { q: "ロシア革命の影響が広がるのを防ぐため、日本などが兵を送った出来事は？", a: ["シベリア出兵"] },
        { q: "1917年、ドイツの無制限潜水艦作戦をきっかけに参戦した国は？", a: ["アメリカ","アメリカ合衆国"] },
        { q: "1919年、パリ講和会議で結ばれた、第一次世界大戦の講和条約は？", a: ["ヴェルサイユ条約"] },
        { q: "パリ講和会議に基づいて設立された、世界平和を守るための国際機関は？", a: ["国際連盟"] },
        { q: "国際連盟の設立を提案したアメリカ大統領は？", a: ["ウィルソン"] },
        { q: "国際連盟の本部はどこに置かれた？", a: ["ジュネーブ"] },
        { q: "当時のドイツで制定された、生存権の保障などを認めた民主的な憲法は？", a: ["ワイマール憲法"] },

        // --- アジア・アフリカの民族運動 ---
        { q: "インドで「非暴力・不服従」を掲げ、イギリスからの独立運動を指導した人物は？", a: ["ガンディー", "ガンジー"] },
        { q: "1919年、朝鮮で日本からの独立を求めて起こった運動は？", a: ["三・一独立運動", "3・1独立運動"] },
        { q: "1919年、中国で日本の二十一か条の要求などに反対して起こった運動は？", a: ["五・四運動",] },
        { q: "辛亥革命の指導者で、中国国民党を結成して中国の統一を目指した人物は？", a: ["孫文"] },
        { q: "孫文の死後、中国国民党の指導者となり、北伐を行って中国を統一した人物は？", a: ["蒋介石", "蔣介石"] },
        { q: "オスマン帝国が倒れた後、トルコ共和国を建国し近代化を進めた初代大統領は？", a: ["ムスタファ・ケマル", "ケマル・パシャ"] },
        { q: "エジプトで、イギリスからの独立運動の中心となった政党（組織）は？", a: ["ワフド党"] },
        { q: "ベトナムで、日本への留学を通じて近代化を目指した「ドンズー運動」を提唱した人物は？", a: ["ファン・ボイ・チャウ"] },

        // --- アメリカの繁栄と世界恐慌前夜 ---
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

        // --- 大正デモクラシーと日本の社会 ---
        { q: "大正時代に広まった、民主主義や自由主義を求める風潮を何という？", a: ["大正デモクラシー"] },
        { q: "民本主義を唱え、普通選挙の実現などを主張した政治学者は？", a: ["吉野作造"] },
        { q: "天皇機関説を唱え、政党政治の理論的支柱となった法学者は？", a: ["美濃部達吉"] },
        { q: "1918年、米の価格急騰に対し、富山県の主婦らが起こした騒動は？", a: ["米騒動"] },
        { q: "米騒動の責任をとって内閣が倒れた後、初の本格的な政党内閣を組織した人物は？", a: ["原敬"] },
        { q: "原敬首相は、華族ではなく衆議院議員であったため、何宰相と呼ばれた？", a: ["平民宰相"] },
        { q: "1925年に制定された、25歳以上のすべての男子に選挙権を与えた法律は？", a: ["普通選挙法"] },
        { q: "普通選挙法と同時に制定された、社会主義運動を取り締まるための法律は？", a: ["治安維持法"] },
        { q: "女性解放運動を指導し、「青鞜社」を結成した人物は？", a: ["平塚らいてう"] },
        { q: "平塚らいてうらが発行した、女性による女性のための文芸雑誌は？", a: ["青鞜"] },
        { q: "部落差別からの解放を目指し、1922年に結成された組織は？", a: ["全国水平社"] },
        { q: "全国水平社の創立大会で読み上げられた宣言は？", a: ["水平社宣言"] },
        { q: "労働者が団結して、賃上げや労働条件の改善を求めた運動を何という？", a: ["労働争議"] },
        { q: "小作人が地主に対して、小作料の減免などを求めた運動を何という？", a: ["小作争議"] },
        { q: "大正・昭和初期に登場した、西洋風のファッションをした女性を何と呼んだ？", a: ["モダンガール", "モガ"] },
        { q: "1923年9月1日に発生し、東京・横浜などに甚大な被害をもたらした災害は？", a: ["関東大震災"] },
        { q: "関東大震災の際、デマによって虐殺されたりした人々は？", a: ["朝鮮人", "中国人", "社会主義者"] },
        { q: "大正時代に創刊され、1冊で多くの読み物が安く読めるため流行した出版物は？", a: ["円本"] },
        { q: "1925年に始まり、情報の伝達速度を飛躍的に高めたメディアは？", a: ["ラジオ放送", "ラジオ"] },
        
        // --- 世界と日本のつながり・移民 ---
        { q: "明治以降、多くの日本人がサトウキビ栽培などのために移住した場所は？", a: ["ハワイ"] },
        { q: "アメリカへの移民が制限された後、日本からの移民が増加した南米の国は？", a: ["ブラジル"] },
        { q: "第一次世界大戦中、日本経済が好景気となり、急激に金持ちになった人々を何という？", a: ["成金"] },
        { q: "第一次世界大戦の好景気を何という？", a: ["大戦景気"] },
        
        // --- その他・文化・補足 ---
        { q: "第一次世界大戦後、ドイツやオーストリアで崩壊した政治体制は？", a: ["帝政"] },
        { q: "パリ講和会議で、日本が提案したが否決された原則は？", a: ["人種差別撤廃", "人種差別撤廃提案"] },
        { q: "国際連盟の常任理事国となった4カ国は、イギリス、フランス、イタリアとどこ？", a: ["日本"] },
        { q: "中国国民党と中国共産党が協力して軍閥や帝国主義と戦ったことを何という？", a: ["国共合作"] },
        { q: "1920年代、日本が中国東北部（満州）に持っていた権益を守るために行った出兵は？", a: ["山東出兵"] },
        { q: "大正時代、宝塚などで人気を博した、女性だけで演じられる劇団は？", a: ["少女歌劇"] },
        { q: "1920年代、都市部で増加した、会社員などの新しい中間層を何と呼んだ？", a: ["サラリーマン"] },
        { q: "都市部で発達した、電車やバスなどの交通機関によって郊外に広がったものは？", a: ["住宅地"] },
        { q: "都市の生活様式が画一化・標準化されていく社会を何という？", a: ["大衆社会"] },
        { q: "第一次世界大戦中に、日本がドイツ権益を奪う形で占領した中国の場所は？", a: ["山東半島"] },
        { q: "1915年、日本が中国の袁世凱政府に突きつけた要求は？", a: ["二十一か条の要求", "21か条の要求"] },
        { q: "ワシントン会議で決定された、海軍の主力艦の保有比率制限などを行う条約は？", a: ["海軍軍縮条約"] },
        { q: "ワシントン会議で確認された、中国の領土保全や門戸開放などを決めた条約は？", a: ["九カ国条約"] },
        { q: "ワシントン会議で解消されることになった、日本とイギリスの同盟は？", a: ["日英同盟"] },
        { q: "国際協調の時代における、日本の外交方針（外相の名から）を何という？", a: ["幣原外交"] },
        { q: "治安維持法で最高刑はどうなっていた？（当初または改正後）", a: ["死刑"] },
        { q: "普通選挙法で選挙権が与えられなかったのは、女性と、何を受け取っている人？", a: ["公的扶助", "貧困者"] },
        { q: "改造などの総合雑誌で活躍した、貧困や社会問題をテーマにした作家たちの文学は？", a: ["プロレタリア文学"] },
        { q: "関東大震災後、復興のシンボルとして建設された鉄筋コンクリートの建物は？", a: ["同潤会アパート"] },
        { q: "ラジオ放送が始まったのは、東京、大阪とどこ？", a: ["名古屋"] },
        { q: "1920年代、アメリカ資本が大量に流入し、経済発展が進んだヨーロッパの国は？", a: ["ドイツ"] },
        { q: "第一次世界大戦後のドイツが支払いを命じられた、莫大な金銭を何という？", a: ["賠償金"] },
        { q: "フランスとベルギーが、ドイツの賠償金不払いを理由に占領した地域は？", a: ["ルール地方"] },
        { q: "イタリアでファシスト党を率いて独裁政治を行った人物は？", a: ["ムッソリーニ"] },
        { q: "ドイツでナチ党（国家社会主義ドイツ労働者党）を率いた人物は？", a: ["ヒトラー,ヒトラー・ユーゲント"] },
        { q: "第一次世界大戦中にロシアで成立した、労働者や兵士の代表会議を何という？", a: ["ソビエト"] },
        { q: "シベリア出兵を見込んで、商人が米を買い占めたことが原因で起きた騒動は？", a: ["米騒動"] },
        { q: "原敬内閣が、教育・交通・産業などの充実を図った政策を何という？", a: ["積極政策"] },
        { q: "沖縄県出身の伊波普猷らが研究を進めた、沖縄の文化や歴史に関する学問は？", a: ["沖縄学"] },

        // --- 追加分：20世紀初頭の帝国主義と社会運動 ---
        { q: "日露戦争後、講和条約の内容に不満を持った民衆が東京で起こした暴動は？", a: ["日比谷焼打事件"] },
        { q: "1910年、天皇暗殺を計画したとして幸徳秋水らが処刑された事件は？", a: ["大逆事件"] },
        { q: "大逆事件で処刑された、社会主義者で『平民新聞』の中心人物は？", a: ["幸徳秋水"] },
        { q: "日露戦争中、幸徳秋水や堺利彦らが結成し、反戦を訴えた新聞は？", a: ["平民新聞"] },
        { q: "1905年、ロシアで皇帝への請願デモに軍隊が発砲し、革命のきっかけとなった事件は？", a: ["血の日曜日事件"] },
        { q: "日露戦争中のロシア第一革命の結果、皇帝ニコライ2世が開設を約束した国会（議会）を何という？", a: ["ドゥーマ"] },
        { q: "1905年、皇帝ニコライ2世が国会の開設や国民の自由を認めた宣言は？", a: ["十月宣言", "10月宣言"] },
        { q: "オスマン帝国で、憲法の復活を目指して青年将校らが起こした革命は？", a: ["青年トルコ革命"] },
        { q: "1911年、孫文らが中心となり清を倒して中華民国を成立させた革命は？", a: ["辛亥革命"] },
        { q: "孫文が唱えた「民族・民権・民生」からなる革命の指導理論は？", a: ["三民主義"] },
        { q: "辛亥革命の後、孫文に代わって実権を握り、独裁的な政治を行った人物は？", a: ["袁世凱"] },
        
        // --- 追加分：日本の植民地支配 ---
        { q: "日本が台湾や朝鮮を支配するために設置した統治機関を何という？", a: ["総督府"] },
        { q: "朝鮮で、日本の植民地化に抵抗して戦った人々による武装抗争を何という？", a: ["義兵運動"] },
        { q: "植民地の人々に日本語や日本風の生活様式を強制した政策を何という？", a: ["同化政策"] },
        { q: "植民地で特定の作物を大規模に栽培させ、経済を支配した農場経営の形態は？", a: ["プランテーション"] },

        // --- 追加分：第一次世界大戦後の世界とアジア ---
        { q: "第一次世界大戦中、英仏ロがオスマン帝国領の分割を秘密裏に決めた協定は？", a: ["サイクス・ピコ協定"] },
        { q: "1928年、満州の実力者である張作霖が日本軍によって爆殺された事件は？", a: ["張作霖爆殺事件"] },
        
        // --- 追加分：大衆社会と文化 ---
        { q: "ナチス・ドイツで、子供たちをナチズムに染めるために組織された団体は？", a: ["ヒトラー・ユーゲント"] },
        { q: "1920年代のアメリカで、白人至上主義を掲げて黒人排斥を行った秘密結社は？", a: ["KKK", "クー・クラックス・クラン"] },
        { q: "映画において、映像に合わせて音声やセリフが出るようになったものを何という？", a: ["トーキー", "有声映画"] },
        { q: "大正・昭和初期、鉄道の主要駅に直結して作られ、消費の中心となった商業施設は？", a: ["ターミナルデパート", "百貨店"] },
        { q: "関東大震災の混乱の中、デマを信じた人々によって組織され、朝鮮人などを殺傷した集団は？", a: ["自警団"] }
    ];

// ==========================================
    // 2. ゲームの状態管理
    // ==========================================
    let currentLife = 3;
    let currentStage = 1;
    let questionsPool = []; 
    let currentRoundQuestions = [];        
    let activeInkIndex = -1;
    let gameMode = 'all'; 
    let totalPurified = 0;
    
    // ★追加：スキル用変数
    let currentCombo = 0; 
    let isSkyReservation = false; // スカイの効果（次ウェーブ金確定）フラグ

    // UI要素の取得
    const startScreen = document.getElementById('start-screen');
    const btnQuick = document.getElementById('btn-mode-quick');
    const btnAll = document.getElementById('btn-mode-all');
    
    const gameHeader = document.getElementById('game-header');
    const gameArea = document.getElementById('game-area');
    const lifeContainer = document.getElementById('life-container');
    const stageDisplay = document.getElementById('stage-display');
    const inkRemainingDisplay = document.getElementById('ink-remaining');
    const scoreBox = document.getElementById('score-box');
    const scoreDisplay = document.getElementById('score-display');

    const inkWrapper = document.getElementById('ink-wrapper');
    const questionPanel = document.getElementById('question-panel');
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-btn');
    const feedbackMsg = document.getElementById('feedback-msg');
    const btnBack = document.getElementById('btn-back');
    
    // ★スキルUI要素
    const magicArea = document.getElementById('magic-area');
    const comboCountSpan = document.getElementById('combo-count');
    const btnHammer = document.getElementById('btn-hammer');
    const btnSky = document.getElementById('btn-sky');
    const skyActiveMsg = document.getElementById('sky-active-msg');

    const stageClearMsg = document.getElementById('stage-clear-msg');
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreMsg = document.getElementById('final-score-msg');
    const gameClearScreen = document.getElementById('game-clear-screen');
    
    // ★削除：実績関連の変数は削除済み

    // ==========================================
    // 3. スタート処理 & ゲーム開始
    // ==========================================
    
    btnQuick.addEventListener('click', () => startGame('quick'));
    btnAll.addEventListener('click', () => startGame('all'));

    if(btnBack) {
        btnBack.addEventListener('click', closePanel);
    }
    
    function startGame(mode) {
        gameMode = mode;
        startScreen.classList.add('hidden');
        gameHeader.classList.remove('hidden');
        gameArea.classList.remove('hidden');
        initGame();
    }

    function initGame() {
        currentLife = 3;
        currentStage = 1;
        totalPurified = 0;
        
        // ★スキル初期化
        currentCombo = 0;
        isSkyReservation = false;
        
        renderLives();
        
        // 全問モードの時だけスキルエリアを表示
        if (gameMode === 'all') {
            scoreBox.classList.remove('hidden');
            scoreDisplay.textContent = "0";
            magicArea.classList.remove('hidden');
            updateMagicUI();
        } else {
            scoreBox.classList.add('hidden');
            magicArea.classList.add('hidden');
        }

        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        questionsPool = (gameMode === 'quick') ? shuffled.slice(0, 10) : shuffled;

        startRound();
    }

    // ==========================================
    // 4. ラウンド管理 (ウェーブ開始)
    // ==========================================
    function startRound() {
        if (questionsPool.length === 0) {
            gameClear();
            return;
        }

        stageDisplay.textContent = currentStage;
        inkWrapper.innerHTML = '';
        currentRoundQuestions = [];
        
        // スカイ予約があればメッセージを消す
        skyActiveMsg.classList.add('hidden');

        const count = Math.min(7, questionsPool.length);

        // ★スカイ発動中なら、ランダムで1つを確実に金にする
        let guaranteedGoldIndex = -1;
        if (isSkyReservation) {
            guaranteedGoldIndex = Math.floor(Math.random() * count);
            isSkyReservation = false; // 効果消費
            
            // エフェクト（画面が少し青く光るなど）
            const flash = document.createElement('div');
            flash.classList.add('heal-effect');
            flash.style.backgroundColor = 'rgba(0, 191, 255, 0.3)';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 1000);
        }

        for (let i = 0; i < count; i++) {
            const q = questionsPool.shift();
            q.gameId = `ink-${i}`;
            currentRoundQuestions.push(q);
        }
        
        inkRemainingDisplay.textContent = currentRoundQuestions.length;

        currentRoundQuestions.forEach((q, index) => {
            // もともとの確率(10%) OR スカイの効果(確定)
            let forceGold = (index === guaranteedGoldIndex);
            createInkSpot(q, index, forceGold);
        });

        closePanel();
    }

    function createInkSpot(qData, index, forceGold) {
        const ink = document.createElement('div');
        ink.classList.add('ink-spot');
        
        // 金のインク判定
        const isGoldRandom = Math.random() < 0.1; 
        if (forceGold || isGoldRandom) {
            ink.classList.add('gold');
            ink.dataset.isGold = "true"; 
        }

        const colorType = Math.floor(Math.random() * 3) + 1; 
        ink.classList.add(`ink-type-${colorType}`); 

        ink.id = qData.gameId;
        ink.textContent = "?";
        ink.style.top = (Math.random() * 80) + '%';
        ink.style.left = (Math.random() * 80) + '%';

        ink.addEventListener('click', () => {
            openQuestion(qData, index);
        });

        inkWrapper.appendChild(ink);
    }

    // ==========================================
    // 5. 問題・回答処理
    // ==========================================
    
    function openQuestion(qData, index) {
        activeInkIndex = index;
        questionPanel.classList.remove('hidden');
        questionText.textContent = qData.q;
        answerInput.value = "";
        answerInput.focus();
        feedbackMsg.textContent = "";

        // UI更新（現在のコンボ状況などを反映）
        updateMagicUI();

        document.querySelectorAll('.ink-spot').forEach(el => el.style.opacity = '0.5');
        document.getElementById(qData.gameId).style.opacity = '1';
    }

    function closePanel() {
        questionPanel.classList.add('hidden');
        document.querySelectorAll('.ink-spot').forEach(el => el.style.opacity = '1');
        activeInkIndex = -1;
    }

    submitBtn.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') checkAnswer(); });

    function checkAnswer() {
        if (activeInkIndex === -1) return;
        const userVal = answerInput.value.trim().replace(/\s+/g, '');
        const currentQ = currentRoundQuestions[activeInkIndex];
        
        // 部分一致チェック
        let isCorrect = false;
        // 配列かどうかチェックして対応
        if (Array.isArray(currentQ.a)) {
             if (currentQ.a.includes(userVal)) isCorrect = true;
        } else {
             if (currentQ.a === userVal) isCorrect = true;
        }

        if (isCorrect) {
            handleCorrect();
        } else {
            handleWrong();
        }
    }

    function handleCorrect() {
        // コンボ加算
        if (gameMode === 'all') {
            currentCombo++;
            updateMagicUI();
        }

        totalPurified++;
        if (gameMode === 'all') scoreDisplay.textContent = totalPurified;

        feedbackMsg.style.color = "green";
        feedbackMsg.textContent = "浄化成功！";

        processCleanUp();
    }

    // インクを消して次へ進む共通処理
    function processCleanUp() {
        const inkEl = document.getElementById(currentRoundQuestions[activeInkIndex].gameId);
        
        // 金のインク回復処理
        if (inkEl && inkEl.dataset.isGold === "true") {
            if (currentLife < 3) {
                currentLife++;
                renderLives();
                feedbackMsg.innerHTML += " <br>ライフ回復！";
                feedbackMsg.style.color = "#d4af37";
                
                // ライフが変わったのでスキル条件を再チェック
                updateMagicUI();

                const flash = document.createElement('div');
                flash.classList.add('heal-effect');
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 500);
            }
        }

        if (inkEl) {
            inkEl.classList.add('cleaning');
            setTimeout(() => {
                inkEl.remove();
                currentRoundQuestions[activeInkIndex] = null;
                const remaining = currentRoundQuestions.filter(q => q !== null).length;
                inkRemainingDisplay.textContent = remaining;
                closePanel();
                if (remaining === 0) handleRoundClear();
            }, 500);
        }
    }

    function handleWrong() {
        // コンボリセット
        if (gameMode === 'all') {
            currentCombo = 0;
            updateMagicUI();
        }

        const currentQ = currentRoundQuestions[activeInkIndex];
        // 答えが配列なら最初の1つを表示
        const correctText = Array.isArray(currentQ.a) ? currentQ.a[0] : currentQ.a;

        feedbackMsg.style.color = "#ff4444";
        feedbackMsg.innerHTML = `浄化失敗...<br><span class="answer-reveal">正解: ${correctText}</span>`;
        
        gameArea.classList.add('shake');
        setTimeout(() => gameArea.classList.remove('shake'), 500);

        currentLife--;
        renderLives();

        // ライフが減ったのでUI更新（スカイが使えるようになるかもしれない）
        updateMagicUI();

        const inkEl = document.getElementById(currentRoundQuestions[activeInkIndex].gameId);
        if(inkEl) {
            inkEl.style.transform = "scale(1.2) rotate(10deg)";
            setTimeout(() => inkEl.style.transform = "", 200);
        }

        if (currentLife <= 0) gameOver();
    }

    // ==========================================
    // 6. スキル (イマジネス) 関連処理
    // ==========================================

    function updateMagicUI() {
        if(gameMode !== 'all') return;

        comboCountSpan.textContent = currentCombo;

        // --- イマジネスハンマー (10連) ---
        if (currentCombo >= 10) {
            btnHammer.disabled = false;
            btnHammer.classList.add('ready');
        } else {
            btnHammer.disabled = true;
            btnHammer.classList.remove('ready');
        }

        // --- イマジネススカイ (15連 AND ダメージあり) ---
        // ダメージあり = currentLife < 3
        if (currentCombo >= 15 && currentLife < 3) {
            btnSky.disabled = false;
            btnSky.classList.add('ready');
        } else {
            btnSky.disabled = true;
            btnSky.classList.remove('ready');
        }
    }

    // ハンマー発動
    btnHammer.addEventListener('click', function() {
        if (currentCombo >= 10 && activeInkIndex !== -1) {
            // コンボ消費（0にする）
            currentCombo = 0;
            updateMagicUI();

            // 演出
            feedbackMsg.innerHTML = "<strong>イマジネスハンマー発動！</strong><br>インクを粉砕した！";
            feedbackMsg.style.color = "#ff5722";
            
            // 画面フラッシュ（赤）
            const flash = document.createElement('div');
            Object.assign(flash.style, {
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                background: 'rgba(255, 87, 34, 0.5)', zIndex: '9999', transition: 'opacity 0.5s'
            });
            document.body.appendChild(flash);
            setTimeout(() => { flash.style.opacity = '0'; }, 50);
            setTimeout(() => flash.remove(), 500);

            // 正解処理へ直行（スコア加算あり）
            // handleCorrectを呼ぶとまたコンボが増えてしまうので、スコアだけ足して片付け
            totalPurified++;
            if (gameMode === 'all') scoreDisplay.textContent = totalPurified;
            processCleanUp();
        }
    });

    // スカイ発動
    btnSky.addEventListener('click', function() {
        if (currentCombo >= 15 && currentLife < 3) {
            // コンボ消費
            currentCombo = 0;
            updateMagicUI();

            // 予約フラグON
            isSkyReservation = true;
            
            // 演出
            skyActiveMsg.classList.remove('hidden');
            feedbackMsg.innerHTML = "<strong>イマジネススカイ発動！</strong><br>空が輝き始めた... (次ウェーブ金確定)";
            feedbackMsg.style.color = "#03a9f4";

            // 画面フラッシュ（青）
            const flash = document.createElement('div');
            Object.assign(flash.style, {
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                background: 'rgba(3, 169, 244, 0.5)', zIndex: '9999', transition: 'opacity 0.5s'
            });
            document.body.appendChild(flash);
            setTimeout(() => { flash.style.opacity = '0'; }, 50);
            setTimeout(() => flash.remove(), 500);
        }
    });


    // ==========================================
    // 7. その他 UI更新・終了処理
    // ==========================================

    function renderLives() {
        lifeContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const bottle = document.createElement('span');
            bottle.classList.add('ink-bottle');
            if (i >= currentLife) bottle.classList.add('lost');
            lifeContainer.appendChild(bottle);
        }
    }

    function handleRoundClear() {
        if (questionsPool.length > 0) {
            currentStage++;
            stageClearMsg.classList.add('show');
            setTimeout(() => {
                stageClearMsg.classList.remove('show');
                startRound(); 
            }, 2000);
        } else {
            gameClear();
        }
    }

    function gameOver() {
        closePanel();
        gameOverScreen.classList.remove('hidden');
        if (gameMode === 'all') {
            finalScoreMsg.textContent = `今回の記録: ${totalPurified} 問浄化`;
        } else {
            finalScoreMsg.textContent = "";
        }
    }

    function gameClear() {
        closePanel();
        gameClearScreen.classList.remove('hidden');
        // 実績解除処理は削除済み
    }

    // ★削除：unlockAchievement関数は削除済み
});