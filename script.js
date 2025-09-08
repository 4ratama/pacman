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
// --- キャラクターの定義 ---
const pacman = {
    x: TILE_SIZE * 13.5, // X座標（マップの中央付近）
    y: TILE_SIZE * 23,  // Y座標
    radius: TILE_SIZE / 2 * 0.8, // 半径
    speed: 2, // 移動速度
    direction: 'stop', // 現在の進行方向
    nextDirection: 'stop' // 次に進みたい方向
};

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
    isPaused = false; // ポーズ状態をリセット

    // パックマンの位置と方向をリセット
    pacman.x = TILE_SIZE * 13.5;
    pacman.y = TILE_SIZE * 23;
    pacman.direction = 'stop';
    pacman.nextDirection = 'stop';
    
    gameMap = JSON.parse(JSON.stringify(originalMap));
    
    showGameScreen();
    // drawMap(); // gameLoopの中で描画されるので不要

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


// --- イベントリスナーの修正 ---
// startGameBtnのイベントリスナーを一度削除し、再度設定します。
// （古いリスナーが残っている可能性をなくすため）
const oldBtn = document.getElementById('startGameBtn');
const newBtn = oldBtn.cloneNode(true);
oldBtn.parentNode.replaceChild(newBtn, oldBtn);

newBtn.addEventListener('click', () => {
    startGame();
    gameLoop(); // ★ゲーム開始ボタンが押された時にループを開始する
});


// --- キーボード入力の処理 ---
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            pacman.nextDirection = 'up';
            break;
        case 'ArrowDown':
            pacman.nextDirection = 'down';
            break;
        case 'ArrowLeft':
            pacman.nextDirection = 'left';
            break;
        case 'ArrowRight':
            pacman.nextDirection = 'right';
            break;
    }
});


// --- パックマンの描画 ---
function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.radius, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.closePath();
    ctx.fill();
}


// --- パックマンの移動と壁判定 ---
function movePacman() {
    // 壁との衝突判定
    function checkCollision(x, y) {
        const gridX = Math.floor(x / TILE_SIZE);
        const gridY = Math.floor(y / TILE_SIZE);
        // マップの範囲外に出ないようにチェック
        if (gridY < 0 || gridY >= MAP_HEIGHT || gridX < 0 || gridX >= MAP_WIDTH) {
            return true; // 範囲外は壁とみなす
        }
        return gameMap[gridY][gridX] === 1; // 1が壁
    }

    // 次の方向へ進めるかチェック
    if (pacman.nextDirection === 'up' && !checkCollision(pacman.x, pacman.y - pacman.speed)) {
        pacman.direction = pacman.nextDirection;
    }
    if (pacman.nextDirection === 'down' && !checkCollision(pacman.x, pacman.y + pacman.speed)) {
        pacman.direction = pacman.nextDirection;
    }
    if (pacman.nextDirection === 'left' && !checkCollision(pacman.x - pacman.speed, pacman.y)) {
        pacman.direction = pacman.nextDirection;
    }
    if (pacman.nextDirection === 'right' && !checkCollision(pacman.x + pacman.speed, pacman.y)) {
        pacman.direction = pacman.nextDirection;
    }
    
    // 現在の方向へ移動
    switch (pacman.direction) {
        case 'up':
            if (!checkCollision(pacman.x, pacman.y - pacman.speed)) {
                pacman.y -= pacman.speed;
            }
            break;
        case 'down':
            if (!checkCollision(pacman.x, pacman.y + pacman.speed)) {
                pacman.y += pacman.speed;
            }
            break;
        case 'left':
            if (!checkCollision(pacman.x - pacman.speed, pacman.y)) {
                pacman.x -= pacman.speed;
            }
            break;
        case 'right':
            if (!checkCollision(pacman.x + pacman.speed, pacman.y)) {
                pacman.x += pacman.speed;
            }
            break;
    }

    // 画面の左右をループする（ワープトンネル）
    if (pacman.x < 0) {
        pacman.x = canvas.width;
    } else if (pacman.x > canvas.width) {
        pacman.x = 0;
    }
}


// --- ゲームループ ---
function gameLoop() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 画面をクリア
        drawMap();    // マップを再描画
        movePacman(); // パックマンを移動
        drawPacman(); // パックマンを描画
    }
    requestAnimationFrame(gameLoop); // 次のフレームを要求
}