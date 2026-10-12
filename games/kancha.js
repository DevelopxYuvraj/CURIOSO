const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const targetsEl = document.getElementById("targets");
const turnEl = document.getElementById("turn");

const powerFill = document.getElementById("powerFill");

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

const difficultySelect =
    document.getElementById("difficulty");

const resultOverlay =
    document.getElementById("resultOverlay");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const finalScore =
    document.getElementById("finalScore");

const restartBtn =
    document.getElementById("restartBtn");


let W = 900;
let H = 560;

let gameRunning = false;

let animationId = null;

let score = 0;

let lives = 3;

let turn = "player";

let targetsRemaining = 8;

let difficulty = "medium";

let mouseDown = false;

let aimX = 0;
let aimY = 0;

let lastTime = 0;

let computerTimer = 0;

let shotInProgress = false;


const shooter = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 15
};


let marbles = [];


const arena = {
    padding: 45
};


function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    const ratio =
        window.devicePixelRatio || 1;

    canvas.width =
        rect.width * ratio;

    canvas.height =
        rect.height * ratio;

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

    W = rect.width;
    H = rect.height;

    if (!gameRunning) {
        resetPositions();
        draw();
    }
}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();


function resetPositions() {

    shooter.x = W * .5;
    shooter.y = H - 75;

    shooter.vx = 0;
    shooter.vy = 0;

    marbles = [];

    const centerX = W * .5;
    const centerY = H * .42;

    const positions = [
        [-70, -25],
        [0, -40],
        [70, -20],

        [-105, 35],
        [-35, 25],
        [35, 30],
        [105, 38],

        [0, 90]
    ];

    positions.forEach(
        ([dx, dy], index) => {

            marbles.push({
                x: centerX + dx,
                y: centerY + dy,
                vx: 0,
                vy: 0,
                radius: 13,
                active: true,
                id: index
            });

        }
    );
}


function resetGame() {

    difficulty =
        difficultySelect.value;

    score = 0;

    lives = 3;

    turn = "player";

    targetsRemaining = 8;

    mouseDown = false;

    shotInProgress = false;

    computerTimer = 0;

    resetPositions();

    updateHUD();

    powerFill.style.width = "0%";
}


function startGame() {

    resetGame();

    startScreen.hidden = true;

    resultOverlay.hidden = true;

    gameRunning = true;

    lastTime = performance.now();

    animationId =
        requestAnimationFrame(gameLoop);
}


function endGame(playerWon) {

    gameRunning = false;

    if (animationId) {
        cancelAnimationFrame(
            animationId
        );
    }

    finalScore.textContent =
        Math.floor(score);

    if (playerWon) {

        resultIcon.textContent = "🏆";

        resultTitle.textContent =
            "You Win!";

        resultMessage.textContent =
            "Amazing aim! You cleared the marbles.";

    } else {

        resultIcon.textContent = "🟤";

        resultTitle.textContent =
            "Game Over";

        resultMessage.textContent =
            "Good attempt! Try a more accurate shot.";
    }

    resultOverlay.hidden = false;
}


function updateHUD() {

    scoreEl.textContent =
        Math.floor(score);

    livesEl.textContent =
        "❤️".repeat(lives) +
        "🖤".repeat(3 - lives);

    targetsEl.textContent =
        targetsRemaining;

    turnEl.textContent =
        turn === "player"
            ? "YOU"
            : "CPU";
}


function gameLoop(timestamp) {

    if (!gameRunning) return;

    const dt =
        Math.min(
            (timestamp - lastTime) / 1000,
            .04
        );

    lastTime = timestamp;

    update(dt);

    draw();

    animationId =
        requestAnimationFrame(
            gameLoop
        );
}


function update(dt) {

    updateShooter(dt);

    updateMarbles(dt);

    checkMarbleCollisions();

    checkTargetCount();

    if (turn === "computer" &&
        !shotInProgress) {

        computerTimer += dt;

        if (computerTimer > 1) {

            computerTimer = 0;

            computerShoot();
        }
    }

    if (
        turn === "player" &&
        !shotInProgress &&
        !mouseDown
    ) {

        powerFill.style.width = "0%";
    }
}


function updateShooter(dt) {

    if (shotInProgress) {

        shooter.x +=
            shooter.vx * dt;

        shooter.y +=
            shooter.vy * dt;

        shooter.vx *= .985;

        shooter.vy *= .985;

        const speed =
            Math.sqrt(
                shooter.vx ** 2 +
                shooter.vy ** 2
            );

        if (speed < 8) {

            shooter.vx = 0;
            shooter.vy = 0;

            shotInProgress = false;

            nextTurn();
        }
    }


    shooter.x =
        Math.max(
            arena.padding,
            Math.min(
                W - arena.padding,
                shooter.x
            )
        );

    shooter.y =
        Math.max(
            arena.padding,
            Math.min(
                H - arena.padding,
                shooter.y
            )
        );
}


function updateMarbles(dt) {

    marbles.forEach(marble => {

        if (!marble.active) return;

        marble.x +=
            marble.vx * dt;

        marble.y +=
            marble.vy * dt;

        marble.vx *= .985;
        marble.vy *= .985;


        if (
            marble.x < marble.radius ||
            marble.x > W - marble.radius
        ) {

            marble.vx *= -0.75;

            marble.x =
                Math.max(
                    marble.radius,
                    Math.min(
                        W - marble.radius,
                        marble.x
                    )
                );
        }


        if (
            marble.y < marble.radius ||
            marble.y > H - marble.radius
        ) {

            marble.vy *= -0.75;

            marble.y =
                Math.max(
                    marble.radius,
                    Math.min(
                        H - marble.radius,
                        marble.y
                    )
                );
        }
    });
}


function checkMarbleCollisions() {

    marbles.forEach(marble => {

        if (!marble.active) return;

        const dx =
            shooter.x - marble.x;

        const dy =
            shooter.y - marble.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <
            shooter.radius + marble.radius
        ) {

            if (shotInProgress) {

                const angle =
                    Math.atan2(dy, dx);

                const power =
                    Math.sqrt(
                        shooter.vx ** 2 +
                        shooter.vy ** 2
                    );

                marble.vx =
                    Math.cos(angle) *
                    power *
                    .65;

                marble.vy =
                    Math.sin(angle) *
                    power *
                    .65;

                const hitPower =
                    Math.min(
                        10,
                        power / 100
                    );

                if (hitPower > 3) {

                    marble.active = false;

                    targetsRemaining--;

                    score += 25;

                    updateHUD();
                }
            }
        }
    });


    for (
        let i = 0;
        i < marbles.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < marbles.length;
            j++
        ) {

            const a = marbles[i];
            const b = marbles[j];

            if (!a.active || !b.active)
                continue;

            const dx = b.x - a.x;
            const dy = b.y - a.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            const minDistance =
                a.radius +
                b.radius;

            if (
                distance < minDistance &&
                distance > 0
            ) {

                const nx =
                    dx / distance;

                const ny =
                    dy / distance;

                const impulse =
                    (a.vx - b.vx) * nx +
                    (a.vy - b.vy) * ny;

                if (impulse > 0) {

                    a.vx -=
                        impulse * nx;

                    a.vy -=
                        impulse * ny;

                    b.vx +=
                        impulse * nx;

                    b.vy +=
                        impulse * ny;
                }
            }
        }
    }
}


function checkTargetCount() {

    const activeCount =
        marbles.filter(
            marble => marble.active
        ).length;

    if (
        activeCount === 0 &&
        gameRunning
    ) {

        targetsRemaining = 0;

        updateHUD();

        endGame(true);
    }
}


function nextTurn() {

    if (!gameRunning) return;

    turn =
        turn === "player"
            ? "computer"
            : "player";

    updateHUD();

    computerTimer = 0;
}


function shoot(targetX, targetY) {

    if (
        !gameRunning ||
        turn !== "player" ||
        shotInProgress
    ) return;


    const dx =
        shooter.x - targetX;

    const dy =
        shooter.y - targetY;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance < 15) return;


    const maxPower = 850;

    const power =
        Math.min(
            distance,
            170
        );


    const angle =
        Math.atan2(
            dy,
            dx
        );


    shooter.vx =
        Math.cos(angle) *
        power *
        3.4;

    shooter.vy =
        Math.sin(angle) *
        power *
        3.4;


    shotInProgress = true;

    powerFill.style.width =
        Math.min(
            100,
            (power / 170) * 100
        ) + "%";

    setTimeout(() => {

        powerFill.style.width =
            "0%";

    }, 250);
}


function computerShoot() {

    if (
        turn !== "computer" ||
        shotInProgress
    ) return;


    const active =
        marbles.filter(
            marble => marble.active
        );

    if (active.length === 0) return;


    let target;

    if (difficulty === "easy") {

        target =
            active[
                Math.floor(
                    Math.random() *
                    active.length
                )
            ];

    } else {

        target =
            active.reduce(
                (closest, marble) => {

                    const d1 =
                        distanceBetween(
                            shooter,
                            closest
                        );

                    const d2 =
                        distanceBetween(
                            shooter,
                            marble
                        );

                    return d2 < d1
                        ? marble
                        : closest;
                }
            );
    }


    const accuracy =
        difficulty === "easy"
            ? 90
            : difficulty === "medium"
                ? 45
                : 20;


    const targetX =
        target.x +
        (Math.random() * accuracy -
            accuracy / 2);

    const targetY =
        target.y +
        (Math.random() * accuracy -
            accuracy / 2);


    const dx =
        shooter.x - targetX;

    const dy =
        shooter.y - targetY;

    const angle =
        Math.atan2(dy, dx);


    const power =
        difficulty === "easy"
            ? 430
            : difficulty === "medium"
                ? 600
                : 760;


    shooter.vx =
        Math.cos(angle) *
        power;

    shooter.vy =
        Math.sin(angle) *
        power;


    shotInProgress = true;

    setTimeout(() => {

        if (gameRunning) {
            powerFill.style.width = "0%";
        }

    }, 250);
}


function distanceBetween(a, b) {

    return Math.sqrt(
        (a.x - b.x) ** 2 +
        (a.y - b.y) ** 2
    );
}


function getPointerPosition(event) {

    const rect =
        canvas.getBoundingClientRect();

    let clientX;
    let clientY;


    if (
        event.touches &&
        event.touches.length
    ) {

        clientX =
            event.touches[0].clientX;

        clientY =
            event.touches[0].clientY;

    } else {

        clientX = event.clientX;
        clientY = event.clientY;
    }


    return {
        x:
            clientX - rect.left,

        y:
            clientY - rect.top
    };
}


function pointerDown(event) {

    if (
        !gameRunning ||
        turn !== "player" ||
        shotInProgress
    ) return;


    const pos =
        getPointerPosition(event);


    const distance =
        Math.sqrt(
            (pos.x - shooter.x) ** 2 +
            (pos.y - shooter.y) ** 2
        );


    if (distance < 50) {

        mouseDown = true;

        aimX = pos.x;
        aimY = pos.y;
    }
}


function pointerMove(event) {

    if (!mouseDown) return;


    const pos =
        getPointerPosition(event);

    aimX = pos.x;
    aimY = pos.y;


    const dx =
        shooter.x - aimX;

    const dy =
        shooter.y - aimY;

    const distance =
        Math.min(
            170,
            Math.sqrt(
                dx * dx +
                dy * dy
            )
        );


    powerFill.style.width =
        (distance / 170 * 100) + "%";
}


function pointerUp(event) {

    if (!mouseDown) return;

    mouseDown = false;

    const pos =
        getPointerPosition(event);

    shoot(
        pos.x,
        pos.y
    );
}


canvas.addEventListener(
    "pointerdown",
    pointerDown
);

canvas.addEventListener(
    "pointermove",
    pointerMove
);

canvas.addEventListener(
    "pointerup",
    pointerUp
);

canvas.addEventListener(
    "pointercancel",
    () => {
        mouseDown = false;
    }
);


function draw() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );

    drawGround();

    drawCircle();

    drawAim();

    drawMarbles();

    drawShooter();
}


function drawGround() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(
        0,
        "#d9b87c"
    );

    gradient.addColorStop(
        1,
        "#b98b50"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    for (
        let i = 0;
        i < 80;
        i++
    ) {

        const x =
            (i * 113) % W;

        const y =
            (i * 71) % H;

        ctx.fillStyle =
            "rgba(80,55,25,.12)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            1.5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


function drawCircle() {

    ctx.beginPath();

    ctx.arc(
        W / 2,
        H * .45,
        Math.min(
            W,
            H
        ) * .29,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "rgba(91,58,26,.7)";

    ctx.lineWidth = 5;

    ctx.stroke();

    ctx.strokeStyle =
        "rgba(255,240,200,.35)";

    ctx.lineWidth = 2;

    ctx.stroke();
}


function drawMarbles() {

    marbles.forEach(
        marble => {

            if (!marble.active)
                return;

            drawMarble(
                marble.x,
                marble.y,
                marble.radius,
                marble.id
            );
        }
    );
}


function drawMarble(
    x,
    y,
    radius,
    id
) {

    const colors = [
        "#8e5632",
        "#286b59",
        "#c84d32",
        "#d59b3d",
        "#624b83",
        "#376c9b",
        "#a83f68",
        "#5f7c45"
    ];


    const gradient =
        ctx.createRadialGradient(
            x - 4,
            y - 5,
            2,
            x,
            y,
            radius
        );

    gradient.addColorStop(
        0,
        "#ffffff"
    );

    gradient.addColorStop(
        .18,
        colors[id % colors.length]
    );

    gradient.addColorStop(
        1,
        "#3b3028"
    );


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        gradient;

    ctx.fill();


    ctx.strokeStyle =
        "rgba(255,255,255,.45)";

    ctx.lineWidth = 1;

    ctx.stroke();
}


function drawShooter() {

    drawMarble(
        shooter.x,
        shooter.y,
        shooter.radius,
        3
    );


    if (
        mouseDown &&
        turn === "player"
    ) {

        ctx.beginPath();

        ctx.moveTo(
            shooter.x,
            shooter.y
        );

        ctx.lineTo(
            aimX,
            aimY
        );

        ctx.strokeStyle =
            "rgba(23,75,59,.7)";

        ctx.lineWidth = 2;

        ctx.setLineDash([
            7,
            6
        ]);

        ctx.stroke();

        ctx.setLineDash([]);
    }
}


function drawAim() {

    if (
        !mouseDown ||
        turn !== "player"
    ) return;


    const dx =
        shooter.x - aimX;

    const dy =
        shooter.y - aimY;

    const distance =
        Math.min(
            170,
            Math.sqrt(
                dx * dx +
                dy * dy
            )
        );


    if (distance < 10)
        return;


    const angle =
        Math.atan2(
            dy,
            dx
        );


    const endX =
        shooter.x +
        Math.cos(angle) *
        distance;

    const endY =
        shooter.y +
        Math.sin(angle) *
        distance;


    ctx.beginPath();

    ctx.moveTo(
        shooter.x,
        shooter.y
    );

    ctx.lineTo(
        endX,
        endY
    );

    ctx.strokeStyle =
        "rgba(231,111,36,.8)";

    ctx.lineWidth = 3;

    ctx.stroke();
}


startBtn.addEventListener(
    "click",
    startGame
);

restartBtn.addEventListener(
    "click",
    startGame
);


difficultySelect.addEventListener(
    "change",
    () => {

        if (!gameRunning) {
            difficulty =
                difficultySelect.value;
        }

    }
);


resetPositions();

updateHUD();

draw();