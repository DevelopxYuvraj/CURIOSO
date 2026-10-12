const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const windEl = document.getElementById("wind");
const timeEl = document.getElementById("time");

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

const resultOverlay = document.getElementById("resultOverlay");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const difficultySelect = document.getElementById("difficulty");

const cutBtn = document.getElementById("cutBtn");
const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");


let W = 900;
let H = 560;

let gameRunning = false;
let animationId = null;

let score = 0;
let lives = 3;
let timeLeft = 60;

let windX = 0;
let windY = 0;

let lastTime = 0;
let windTimer = 0;
let scoreTimer = 0;
let cutCooldown = 0;

let keys = {};

let difficulty = "medium";

const player = {
    x: 250,
    y: 280,
    vx: 0,
    vy: 0,
    size: 22
};

const opponent = {
    x: 650,
    y: 240,
    vx: 0,
    vy: 0,
    size: 21,
    targetX: 650,
    targetY: 240
};

const clouds = [
    { x: 130, y: 90, s: 1.1 },
    { x: 470, y: 120, s: .8 },
    { x: 760, y: 80, s: 1.2 },
    { x: 340, y: 390, s: .9 }
];


function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();

    const ratio = window.devicePixelRatio || 1;

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    W = rect.width;
    H = rect.height;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


function resetGame() {

    score = 0;
    lives = 3;
    timeLeft = 60;

    windX = 0;
    windY = 0;

    windTimer = 0;
    scoreTimer = 0;
    cutCooldown = 0;

    difficulty = difficultySelect.value;

    player.x = W * .28;
    player.y = H * .5;
    player.vx = 0;
    player.vy = 0;

    opponent.x = W * .72;
    opponent.y = H * .42;

    opponent.targetX = opponent.x;
    opponent.targetY = opponent.y;

    updateHUD();
}


function startGame() {

    resetGame();

    startScreen.hidden = true;
    resultOverlay.hidden = true;

    gameRunning = true;

    lastTime = performance.now();

    chooseWind();

    animationId = requestAnimationFrame(gameLoop);
}


function endGame(won = false) {

    gameRunning = false;

    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    finalScore.textContent = Math.floor(score);

    if (won) {

        resultIcon.textContent = "🏆";
        resultTitle.textContent = "Time Up!";
        resultMessage.textContent =
            "Excellent flying! You kept your kite in the sky.";

    } else {

        resultIcon.textContent = "🪁";
        resultTitle.textContent = "Kite Down!";
        resultMessage.textContent =
            "The wind got the better of you. Try again!";

    }

    resultOverlay.hidden = false;
}


function chooseWind() {

    const strength =
        difficulty === "easy" ? .45 :
        difficulty === "medium" ? .7 :
        1;

    const angle = Math.random() * Math.PI * 2;

    windX = Math.cos(angle) * strength;
    windY = Math.sin(angle) * strength;

    updateWindDisplay();
}


function updateWindDisplay() {

    const angle = Math.atan2(windY, windX);

    const arrows = ["→", "↘", "↓", "↙", "←", "↖", "↑", "↗"];

    let index =
        Math.round((angle + Math.PI * 2) / (Math.PI / 4)) % 8;

    windEl.textContent = arrows[index];
}


function updateHUD() {

    scoreEl.textContent = Math.floor(score);

    livesEl.textContent =
        "❤️".repeat(Math.max(0, lives)) +
        "🖤".repeat(Math.max(0, 3 - lives));

    timeEl.textContent = Math.ceil(timeLeft);
}


function gameLoop(timestamp) {

    if (!gameRunning) return;

    const dt = Math.min((timestamp - lastTime) / 1000, .04);

    lastTime = timestamp;

    update(dt);
    draw();

    animationId = requestAnimationFrame(gameLoop);
}


function update(dt) {

    timeLeft -= dt;

    if (timeLeft <= 0) {

        timeLeft = 0;
        updateHUD();
        endGame(true);
        return;
    }


    windTimer += dt;

    if (windTimer > 4) {
        windTimer = 0;
        chooseWind();
    }


    if (cutCooldown > 0) {
        cutCooldown -= dt;
    }


    scoreTimer += dt;

    if (scoreTimer > 1) {

        scoreTimer = 0;

        score += 5;

        updateHUD();
    }


    updatePlayer(dt);
    updateOpponent(dt);

    checkBounds();
    checkCollision();
}


function updatePlayer(dt) {

    let dx = 0;
    let dy = 0;

    if (keys.ArrowLeft || keys.a) dx -= 1;
    if (keys.ArrowRight || keys.d) dx += 1;
    if (keys.ArrowUp || keys.w) dy -= 1;
    if (keys.ArrowDown || keys.s) dy += 1;


    const difficultySpeed =
        difficulty === "easy" ? 250 :
        difficulty === "medium" ? 225 :
        205;


    if (dx !== 0 || dy !== 0) {

        const length = Math.sqrt(dx * dx + dy * dy);

        dx /= length;
        dy /= length;

        player.vx += dx * difficultySpeed * dt;
        player.vy += dy * difficultySpeed * dt;
    }


    player.vx += windX * 18 * dt;
    player.vy += windY * 18 * dt;


    player.vx *= .92;
    player.vy *= .92;


    player.x += player.vx * dt;
    player.y += player.vy * dt;
}


function updateOpponent(dt) {

    const aiSpeed =
        difficulty === "easy" ? 70 :
        difficulty === "medium" ? 105 :
        145;


    if (
        Math.abs(opponent.x - opponent.targetX) < 30 ||
        Math.abs(opponent.y - opponent.targetY) < 30
    ) {

        opponent.targetX =
            120 + Math.random() * Math.max(200, W - 240);

        opponent.targetY =
            100 + Math.random() * Math.max(150, H - 200);
    }


    const dx = opponent.targetX - opponent.x;
    const dy = opponent.targetY - opponent.y;

    const distance = Math.sqrt(dx * dx + dy * dy);


    if (distance > 1) {

        opponent.vx += (dx / distance) * aiSpeed * dt;
        opponent.vy += (dy / distance) * aiSpeed * dt;
    }


    opponent.vx += windX * 12 * dt;
    opponent.vy += windY * 12 * dt;

    opponent.vx *= .94;
    opponent.vy *= .94;

    opponent.x += opponent.vx * dt;
    opponent.y += opponent.vy * dt;


    opponent.x = Math.max(80, Math.min(W - 80, opponent.x));
    opponent.y = Math.max(70, Math.min(H - 80, opponent.y));
}


function checkBounds() {

    const margin = 35;

    if (
        player.x < margin ||
        player.x > W - margin ||
        player.y < margin ||
        player.y > H - margin
    ) {

        loseLife();

        player.x = W * .28;
        player.y = H * .5;
        player.vx = 0;
        player.vy = 0;
    }
}


function checkCollision() {

    const dx = player.x - opponent.x;
    const dy = player.y - opponent.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 48 && cutCooldown <= 0) {

        score += 10;

        updateHUD();

        opponent.targetX =
            100 + Math.random() * (W - 200);

        opponent.targetY =
            80 + Math.random() * (H - 160);

        player.vx -= dx * .4;
        player.vy -= dy * .4;
    }
}


function cutKite() {

    if (!gameRunning || cutCooldown > 0) return;

    cutCooldown = .8;

    const dx = player.x - opponent.x;
    const dy = player.y - opponent.y;

    const distance = Math.sqrt(dx * dx + dy * dy);


    if (distance < 115) {

        score += 50;

        opponent.x =
            100 + Math.random() * (W - 200);

        opponent.y =
            80 + Math.random() * (H - 160);

        opponent.targetX = opponent.x;
        opponent.targetY = opponent.y;

        updateHUD();

    } else {

        score = Math.max(0, score - 5);

        updateHUD();
    }
}


function loseLife() {

    lives--;

    updateHUD();

    if (lives <= 0) {
        endGame(false);
    }
}


function draw() {

    ctx.clearRect(0, 0, W, H);

    drawSky();
    drawClouds();

    drawString(
        player.x,
        player.y,
        opponent.x,
        opponent.y,
        false
    );

    drawString(
        opponent.x,
        opponent.y,
        opponent.x + 30,
        opponent.y + 90,
        true
    );

    drawKite(
        player.x,
        player.y,
        "#e76f24",
        "#174b3b"
    );

    drawKite(
        opponent.x,
        opponent.y,
        "#236b55",
        "#e8b44d"
    );

    drawWindParticles();
}


function drawSky() {

    const gradient = ctx.createLinearGradient(0, 0, 0, H);

    gradient.addColorStop(0, "#87cce4");
    gradient.addColorStop(1, "#e8f5f5");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);


    ctx.fillStyle = "rgba(255,255,255,.3)";

    ctx.beginPath();

    ctx.arc(
        W - 80,
        75,
        38,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


function drawClouds() {

    clouds.forEach(cloud => {

        ctx.save();

        ctx.translate(cloud.x, cloud.y);
        ctx.scale(cloud.s, cloud.s);

        ctx.fillStyle = "rgba(255,255,255,.65)";

        ctx.beginPath();

        ctx.arc(0, 10, 22, 0, Math.PI * 2);
        ctx.arc(25, 4, 28, 0, Math.PI * 2);
        ctx.arc(55, 12, 21, 0, Math.PI * 2);

        ctx.fill();

        ctx.restore();
    });
}


function drawKite(x, y, mainColor, secondaryColor) {

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(-0.15);

    ctx.beginPath();

    ctx.moveTo(0, -28);
    ctx.lineTo(23, 0);
    ctx.lineTo(0, 28);
    ctx.lineTo(-23, 0);
    ctx.closePath();

    ctx.fillStyle = mainColor;
    ctx.fill();

    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 3;
    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(0, -28);
    ctx.lineTo(0, 28);

    ctx.moveTo(-23, 0);
    ctx.lineTo(23, 0);

    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2;

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(0, 28);
    ctx.quadraticCurveTo(12, 48, 0, 62);
    ctx.quadraticCurveTo(-12, 48, 0, 28);

    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 3;

    ctx.stroke();

    ctx.restore();
}


function drawString(x1, y1, x2, y2, opponentString) {

    ctx.beginPath();

    ctx.moveTo(x1, y1 + 25);

    ctx.lineTo(x2, y2 + 25);

    ctx.strokeStyle = opponentString
        ? "rgba(35,107,85,.22)"
        : "rgba(231,111,36,.28)";

    ctx.lineWidth = 1;

    ctx.stroke();
}


function drawWindParticles() {

    ctx.strokeStyle = "rgba(255,255,255,.45)";
    ctx.lineWidth = 2;

    for (let i = 0; i < 7; i++) {

        const x =
            ((i * 137 + performance.now() / 18) %
                (W + 100)) - 50;

        const y =
            100 + i * 55;

        ctx.beginPath();

        ctx.moveTo(x, y);

        ctx.lineTo(
            x + windX * 25,
            y + windY * 25
        );

        ctx.stroke();
    }
}


function keyDown(e) {

    keys[e.key] = true;

    if (
        [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            " "
        ].includes(e.key)
    ) {
        e.preventDefault();
    }

    if (e.key === " ") {
        cutKite();
    }
}


function keyUp(e) {

    keys[e.key] = false;
}


window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);


function holdButton(button, key) {

    button.addEventListener("pointerdown", e => {
        e.preventDefault();
        keys[key] = true;
    });

    button.addEventListener("pointerup", e => {
        e.preventDefault();
        keys[key] = false;
    });

    button.addEventListener("pointerleave", () => {
        keys[key] = false;
    });
}


holdButton(upBtn, "ArrowUp");
holdButton(downBtn, "ArrowDown");
holdButton(leftBtn, "ArrowLeft");
holdButton(rightBtn, "ArrowRight");


cutBtn.addEventListener("pointerdown", e => {
    e.preventDefault();
    cutKite();
});


startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", startGame);


difficultySelect.addEventListener("change", () => {

    if (!gameRunning) {
        difficulty = difficultySelect.value;
    }

});


updateHUD();
draw();