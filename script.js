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

// マップの定義
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
let gameMap;

// --- キャラクターの定義 ---
const pacman = {
    x: 0, y: 0, radius: TILE_SIZE / 2 * 0.8, speed: 2,
    direction: 'stop', nextDirection: 'stop'
};
const ghosts = [
    { x: 0, y: 0, color: 'red', direction: 'right' },
    { x: 0, y: 0, color: 'pink', direction: 'left' },
    { x: 0, y: 0, color: 'cyan', direction: 'up' },
    { x: 0, y: 0, color: 'orange', direction: 'down' }
];
const GHOST_SPEED = 1.5;

// --- ゲームの状態管理 ---
let score = 0;
let highScore = 0;
let isPaused = false;
let animationFrameId;

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
            ctx.fillStyle = '#000';
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            if (tile === 1) { ctx.fillStyle = '#0000FF'; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
            else if (tile === 2) { ctx.fillStyle = '#FFC107'; ctx.beginPath(); ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 6, 0, Math.PI * 2); ctx.fill(); }
            else if (tile === 3) { ctx.fillStyle = '#FFC107'; ctx.beginPath(); ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 3, TILE_SIZE / 3, 0, Math.PI * 2); ctx.fill(); }
            else if (tile === 4) { ctx.fillStyle = '#FFB8FF'; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE + TILE_SIZE * 0.4, TILE_SIZE, TILE_SIZE * 0.2); }
        }
    }
}

// --- パックマンの描画・移動 ---
function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.radius, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.closePath();
    ctx.fill();
}
function movePacman() {
    function checkCollision(x, y) {
        const gridX = Math.floor(x / TILE_SIZE);
        const gridY = Math.floor(y / TILE_SIZE);
        if (gridY < 0 || gridY >= MAP_HEIGHT || gridX < 0 || gridX >= MAP_WIDTH) return true;
        return gameMap[gridY][gridX] === 1;
    }
    if (pacman.nextDirection === 'up' && !checkCollision(pacman.x, pacman.y - pacman.speed)) pacman.direction = pacman.nextDirection;
    if (pacman.nextDirection === 'down' && !checkCollision(pacman.x, pacman.y + pacman.speed)) pacman.direction = pacman.nextDirection;
    if (pacman.nextDirection === 'left' && !checkCollision(pacman.x - pacman.speed, pacman.y)) pacman.direction = pacman.nextDirection;
    if (pacman.nextDirection === 'right' && !checkCollision(pacman.x + pacman.speed, pacman.y)) pacman.direction = pacman.nextDirection;

    switch (pacman.direction) {
        case 'up': if (!checkCollision(pacman.x, pacman.y - pacman.speed)) pacman.y -= pacman.speed; break;
        case 'down': if (!checkCollision(pacman.x, pacman.y + pacman.speed)) pacman.y += pacman.speed; break;
        case 'left': if (!checkCollision(pacman.x - pacman.speed, pacman.y)) pacman.x -= pacman.speed; break;
        case 'right': if (!checkCollision(pacman.x + pacman.speed, pacman.y)) pacman.x += pacman.speed; break;
    }
    if (pacman.x < 0) pacman.x = canvas.width; else if (pacman.x > canvas.width) pacman.x = 0;

    const gridX = Math.round(pacman.x / TILE_SIZE);
    const gridY = Math.round(pacman.y / TILE_SIZE);
    if (gameMap[gridY] && gameMap[gridY][gridX] !== undefined) {
        if (gameMap[gridY][gridX] === 2) { gameMap[gridY][gridX] = 0; score += 10; scoreElement.textContent = score; }
        else if (gameMap[gridY][gridX] === 3) { gameMap[gridY][gridX] = 0; score += 50; scoreElement.textContent = score; console.log("パワーアップ！"); }
    }
}

// --- ゴーストの描画・移動 ---
function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, pacman.radius * 0.9, Math.PI, 0);
        ctx.lineTo(ghost.x + pacman.radius * 0.9, ghost.y + pacman.radius);
        ctx.lineTo(ghost.x - pacman.radius * 0.9, ghost.y + pacman.radius);
        ctx.closePath();
        ctx.fill();
    });
}
function moveGhosts() {
    ghosts.forEach(ghost => {
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        if (Math.abs(dx) > Math.abs(dy)) ghost.x += Math.sign(dx) * GHOST_SPEED;
        else ghost.y += Math.sign(dy) * GHOST_SPEED;
    });
}

// --- ゲームオーバー判定 ---
function checkGameOver() {
    ghosts.forEach(ghost => {
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        if (Math.sqrt(dx * dx + dy * dy) < pacman.radius * 2) {
            cancelAnimationFrame(animationFrameId);
            if (score > highScore) { highScore = score; saveHighScore(); }
            showHomeScreen();
        }
    });
}

// --- ゲームループ ---
function gameLoop() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap();
        movePacman();
        drawPacman();
        moveGhosts();
        drawGhosts();
        checkGameOver();
    }
    animationFrameId = requestAnimationFrame(gameLoop);
}

// --- ゲームのメイン処理 ---
function startGame() {
    score = 0;
    scoreElement.textContent = score;
    isPaused = false;
    pacman.x = TILE_SIZE * 13.5; pacman.y = TILE_SIZE * 23;
    pacman.direction = 'stop'; pacman.nextDirection = 'stop';
    ghosts[0].x = TILE_SIZE * 13.5; ghosts[0].y = TILE_SIZE * 11;
    ghosts[1].x = TILE_SIZE * 13.5; ghosts[1].y = TILE_SIZE * 14;
    ghosts[2].x = TILE_SIZE * 11.5; ghosts[2].y = TILE_SIZE * 14;
    ghosts[3].x = TILE_SIZE * 15.5; ghosts[3].y = TILE_SIZE * 14;
    gameMap = JSON.parse(JSON.stringify(originalMap));
    showGameScreen();

    // 既存のループがあれば停止してから新しいループを開始
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    gameLoop();
}

// --- イベントリスナー ---
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': pacman.nextDirection = 'up'; break;
        case 'ArrowDown': pacman.nextDirection = 'down'; break;
        case 'ArrowLeft': pacman.nextDirection = 'left'; break;
        case 'ArrowRight': pacman.nextDirection = 'right'; break;
    }
});
startGameBtn.addEventListener('click', startGame);
homeBtn.addEventListener('click', () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    showHomeScreen();
});
pauseBtn.addEventListener('click', () => { isPaused = true; });
resumeBtn.addEventListener('click', () => { isPaused = false; });

// --- 初期化 ---
showHomeScreen();