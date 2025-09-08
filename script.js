// --- HTML要素の取得 ---
const homeScreen = document.getElementById('homeScreen');
const gameScreen = document.getElementById('gameScreen');
const startGameBtn = document.getElementById('startGameBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const homeBtn = document.getElementById('homeBtn');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- ゲームの状態管理 ---
let score = 0;
let highScore = 0;
let isPaused = false;

// --- ハイスコア機能 ---
function loadHighScore() {
    const savedHighScore = localStorage.getItem('pacmanHighScore');
    if (savedHighScore) {
        highScore = parseInt(savedHighScore, 10);
    }
    highScoreElement.textContent = highScore;
}

function saveHighScore() {
    localStorage.setItem('pacmanHighScore', highScore);
}


// --- 画面切り替え ---
function showHomeScreen() {
    homeScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    loadHighScore(); // ホーム画面表示時にハイスコアを更新
}

function showGameScreen() {
    homeScreen.style.display = 'none';
    gameScreen.style.display = 'block';
}

// --- ゲームのメイン処理 ---
function startGame() {
    // スコアリセット
    score = 0;
    scoreElement.textContent = score;
    
    // 画面切り替え
    showGameScreen();

    // TODO: ここにゲームの初期化処理（マップ描画、キャラ配置など）を追加していく
    console.log("ゲーム開始！");
    drawPlaceholder(); // 仮の描画処理
}

// 仮の描画関数
function drawPlaceholder() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'yellow';
    ctx.font = '30px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('ここにゲームが描画されます', canvas.width / 2, canvas.height / 2);
}


// --- イベントリスナー ---
startGameBtn.addEventListener('click', startGame);

homeBtn.addEventListener('click', showHomeScreen);

pauseBtn.addEventListener('click', () => {
    isPaused = true;
    console.log("ゲーム一時停止");
    // TODO: ゲームの一時停止処理
});

resumeBtn.addEventListener('click', () => {
    isPaused = false;
    console.log("ゲーム再開");
    // TODO: ゲームの再開処理
});


// --- 初期化 ---
showHomeScreen(); // 最初にホーム画面を表示