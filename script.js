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

// --- ゲーム定数 ---
const TILE_SIZE = 20; // 1タイルのサイズ (px)
const MAP_WIDTH = 28; // マップの横タイル数
const MAP_HEIGHT = 31; // マップの縦タイル数

// Canvasのサイズを設定
canvas.width = MAP_WIDTH * TILE_SIZE;
canvas.height = MAP_HEIGHT * TILE_SIZE;

// マップの定義（0:通路, 1:壁, 2:ドット, 3:パワーエサ, 4:ゴーストの巣の入り口）
const originalMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,4,4,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],

    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
let gameMap; // ゲーム中に変更されるマップ状態

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
    loadHighScore();
}

function showGameScreen() {
    homeScreen.style.display = 'none';
    gameScreen.style.display = 'block';
}

// --- マップ描画 ---
function drawMap() {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tile = gameMap[y][x];
            
            // 通路や食べたドットの場所を一度クリア
            ctx.fillStyle = '#000';
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

            if (tile === 1) { // 壁
                ctx.fillStyle = '#0000FF'; // 青
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (tile === 2) { // ドット
                ctx.fillStyle = '#FFC107'; // 黄色
                ctx.beginPath();
                ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 6, 0, Math.PI * 2);
                ctx.fill();
            } else if (tile === 3) { // パワーエサ
                ctx.fillStyle = '#FFC107'; // 黄色
                ctx.beginPath();
                ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 3, TILE_SIZE / 3, 0, Math.PI * 2);
                ctx.fill();
            } else if (tile === 4) { // ゴーストの巣の入り口
                ctx.fillStyle = '#FFB8FF'; // ピンク色
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE + TILE_SIZE * 0.4, TILE_SIZE, TILE_SIZE * 0.2);
            }
        }
    }
}


// --- ゲームのメイン処理 ---
function startGame() {
    score = 0;
    scoreElement.textContent = score;
    
    // ゲーム開始時にマップをリセット
    gameMap = JSON.parse(JSON.stringify(originalMap));
    
    showGameScreen();
    drawMap(); // ゲーム開始時にマップを描画

    console.log("ゲーム開始！");
}


// --- イベントリスナー ---
startGameBtn.addEventListener('click', startGame);
homeBtn.addEventListener('click', showHomeScreen);
pauseBtn.addEventListener('click', () => {
    isPaused = true;
    console.log("ゲーム一時停止");
});
resumeBtn.addEventListener('click', () => {
    isPaused = false;
    console.log("ゲーム再開");
});


// --- 初期化 ---
showHomeScreen();