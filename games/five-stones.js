/* =========================================
   CURIOS GAMES
   FIVE STONES / GUTTE
========================================= */

const state = {

    round: 1,

    score: 0,

    lives: 3,

    phase: "ready",

    difficulty: "medium",

    selectedStone: null,

    requiredPickups: 1,

    pickedUp: 0,

    timer: null,

    busy: false,

    gameOver: false

};


/* =========================================
   DOM
========================================= */

const stones =
    document.getElementById("stones");

const airStone =
    document.getElementById("airStone");

const timer =
    document.getElementById("timer");

const startButton =
    document.getElementById("startButton");

const pickupButton =
    document.getElementById("pickupButton");

const restartButton =
    document.getElementById("restartButton");

const difficulty =
    document.getElementById("difficulty");

const roundNumber =
    document.getElementById("roundNumber");

const score =
    document.getElementById("score");

const lives =
    document.getElementById("lives");

const phase =
    document.getElementById("phase");

const phaseDescription =
    document.getElementById(
        "phaseDescription"
    );

const message =
    document.getElementById("message");

const instructionTitle =
    document.getElementById(
        "instructionTitle"
    );

const instructionText =
    document.getElementById(
        "instructionText"
    );

const progress =
    document.getElementById("progress");

const progressText =
    document.getElementById(
        "progressText"
    );

const resultModal =
    document.getElementById(
        "resultModal"
    );

const resultIcon =
    document.getElementById(
        "resultIcon"
    );

const resultTitle =
    document.getElementById(
        "resultTitle"
    );

const resultText =
    document.getElementById(
        "resultText"
    );

const playAgain =
    document.getElementById(
        "playAgain"
    );


/* =========================================
   CREATE STONES
========================================= */

function createStones() {

    stones.innerHTML = "";


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const stone =
            document.createElement("button");

        stone.className =
            "stone";

        stone.textContent =
            "🪨";

        stone.dataset.index =
            i;


        stone.addEventListener(
            "click",
            () => selectStone(i)
        );


        stones.appendChild(stone);

    }

}


/* =========================================
   START ROUND
========================================= */

function startRound() {

    if (
        state.busy ||
        state.gameOver
    ) {
        return;
    }


    state.busy = true;

    state.phase = "toss";

    state.requiredPickups =
        Math.min(
            state.round,
            5
        );

    state.pickedUp = 0;

    state.selectedStone = null;


    updateUI();


    instructionTitle.textContent =
        "Toss!";

    instructionText.textContent =
        `Pick up ${
            state.requiredPickups
        } stone${
            state.requiredPickups > 1
                ? "s"
                : ""
        } before catching the tossed stone.`;


    message.textContent =
        "Watch the airborne stone and choose quickly.";


    /*
     * Pick one stone to become
     * the airborne stone.
     */

    state.selectedStone =
        Math.floor(
            Math.random() * 5
        );


    const stoneElements =
        document.querySelectorAll(
            ".stone"
        );


    stoneElements.forEach(
        (stone, index) => {

            stone.classList.remove(
                "collected"
            );

            stone.classList.remove(
                "pickable"
            );

            if (
                index ===
                state.selectedStone
            ) {

                stone.style.opacity =
                    "0.25";

            } else {

                stone.style.opacity =
                    "1";

            }

        }
    );


    airStone.classList.add(
        "active"
    );


    const throwTime =
        getThrowTime();


    airStone.style
        .setProperty(
            "--throw-time",
            `${throwTime}ms`
        );


    /*
     * Allow pickup during the
     * airborne animation.
     */

    setTimeout(
        () => {

            enablePickup();

        },
        throwTime * 0.28
    );


    setTimeout(
        () => {

            finishToss();

        },
        throwTime
    );

}


/* =========================================
   ENABLE PICKUP
========================================= */

function enablePickup() {

    if (
        state.phase !== "toss"
    ) {
        return;
    }


    const stoneElements =
        document.querySelectorAll(
            ".stone"
        );


    stoneElements.forEach(
        (stone, index) => {

            if (
                index !==
                state.selectedStone
            ) {

                stone.classList.add(
                    "pickable"
                );

            }

        }
    );


    pickupButton.disabled =
        false;


    state.phase =
        "pickup";


    phase.textContent =
        "Pick Up";


    phaseDescription.textContent =
        `Collect ${
            state.requiredPickups
        } stone${
            state.requiredPickups > 1
                ? "s"
                : ""
        }.`;

}


/* =========================================
   SELECT STONE
========================================= */

function selectStone(index) {

    if (
        state.phase !== "pickup" ||
        state.busy === false
    ) {
        return;
    }


    if (
        index === state.selectedStone
    ) {
        return;
    }


    const stoneElements =
        document.querySelectorAll(
            ".stone"
        );


    const selected =
        stoneElements[index];


    if (
        selected.classList.contains(
            "collected"
        )
    ) {
        return;
    }


    selected.classList.add(
        "collected"
    );


    state.pickedUp++;

    score.textContent =
        state.score + state.pickedUp;


    progressText.textContent =
        `${state.pickedUp} / ${
            state.requiredPickups
        }`;


    progress.style.width =
        `${
            (
                state.pickedUp /
                state.requiredPickups
            ) * 100
        }%`;


    message.textContent =
        `Picked up ${
            state.pickedUp
        } stone${
            state.pickedUp > 1
                ? "s"
                : ""
        }.`;

}


/* =========================================
   FINISH TOSS
========================================= */

function finishToss() {

    airStone.classList.remove(
        "active"
    );


    clearInterval(
        state.timer
    );


    pickupButton.disabled =
        true;


    const stoneElements =
        document.querySelectorAll(
            ".stone"
        );


    stoneElements.forEach(
        stone =>
            stone.classList.remove(
                "pickable"
            )
    );


    /*
     * Success only when the
     * required number was collected.
     */

    if (
        state.pickedUp >=
        state.requiredPickups
    ) {

        successRound();

    } else {

        failRound(
            "You were too slow. The stone landed before you completed the pickup."
        );

    }

}


/* =========================================
   SUCCESS
========================================= */

function successRound() {

    state.phase =
        "success";

    state.score +=
        state.requiredPickups * 10;


    score.textContent =
        state.score;


    message.textContent =
        `Great! Round ${
            state.round
        } completed.`;


    instructionTitle.textContent =
        "Excellent!";


    instructionText.textContent =
        "Get ready for the next challenge.";


    state.busy = false;


    if (
        state.round >= 5
    ) {

        finishGame();

        return;

    }


    state.round++;


    setTimeout(
        () => {

            startRound();

        },
        900
    );

}


/* =========================================
   FAIL
========================================= */

function failRound(
    reason
) {

    state.lives--;


    lives.textContent =
        state.lives;


    message.textContent =
        reason;


    instructionTitle.textContent =
        "Missed!";


    instructionText.textContent =
        "Keep your timing steady.";


    state.busy = false;


    if (
        state.lives <= 0
    ) {

        finishGame();

        return;

    }


    setTimeout(
        () => {

            startRound();

        },
        900
    );

}


/* =========================================
   FINISH GAME
========================================= */

function finishGame() {

    state.gameOver = true;

    state.busy = false;


    clearInterval(
        state.timer
    );


    pickupButton.disabled =
        true;


    if (
        state.round >= 5 &&
        state.lives > 0
    ) {

        resultIcon.textContent =
            "🏆";

        resultTitle.textContent =
            "You Did It!";

        resultText.textContent =
            `You completed all five rounds with ${
                state.score
            } points.`;

    } else {

        resultIcon.textContent =
            "🪨";

        resultTitle.textContent =
            "Game Over";

        resultText.textContent =
            `Final score: ${
                state.score
            }. Try again and improve your timing.`;

    }


    resultModal.hidden =
        false;

}


/* =========================================
   THROW TIME
========================================= */

function getThrowTime() {

    if (
        state.difficulty === "easy"
    ) {

        return 1900;

    }


    if (
        state.difficulty === "hard"
    ) {

        return 1050;

    }


    return 1450;

}


/* =========================================
   UPDATE UI
========================================= */

function updateUI() {

    roundNumber.textContent =
        state.round;

    lives.textContent =
        state.lives;

    score.textContent =
        state.score;

    phase.textContent =
        state.phase === "ready"
            ? "Ready"
            : state.phase;


    progressText.textContent =
        `${state.pickedUp} / ${
            state.requiredPickups
        }`;

}


/* =========================================
   RESTART
========================================= */

function restartGame() {

    clearInterval(
        state.timer
    );


    state.round = 1;

    state.score = 0;

    state.lives = 3;

    state.phase = "ready";

    state.selectedStone = null;

    state.requiredPickups = 1;

    state.pickedUp = 0;

    state.busy = false;

    state.gameOver = false;


    resultModal.hidden =
        true;


    airStone.classList.remove(
        "active"
    );


    pickupButton.disabled =
        true;


    instructionTitle.textContent =
        "Ready?";


    instructionText.textContent =
        "Toss the stone and pick up the required stones.";


    message.textContent =
        "Press Start Round to begin.";


    progress.style.width =
        "0%";


    createStones();

    updateUI();

}


/* =========================================
   DIFFICULTY
========================================= */

difficulty.addEventListener(
    "change",
    () => {

        state.difficulty =
            difficulty.value;

        restartGame();

    }
);


/* =========================================
   BUTTONS
========================================= */

startButton.addEventListener(
    "click",
    startRound
);


pickupButton.addEventListener(
    "click",
    () => {

        if (
            state.phase !== "pickup"
        ) {
            return;
        }


        message.textContent =
            "Click the stones on the field to pick them up.";

    }
);


restartButton.addEventListener(
    "click",
    restartGame
);


playAgain.addEventListener(
    "click",
    restartGame
);


/* =========================================
   INITIALIZE
========================================= */

createStones();

updateUI();
