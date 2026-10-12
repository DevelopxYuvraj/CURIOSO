/* =========================================
   CURIOS GAMES
   PALLANGUZHI
   Simplified Digital Adaptation
========================================= */


/* =========================================
   CONSTANTS
========================================= */

const INITIAL_SEEDS = 5;

const PIT_COUNT = 14;

const PITS_PER_PLAYER = 7;


/* =========================================
   GAME STATE
========================================= */

const state = {

    board: Array(PIT_COUNT)
        .fill(INITIAL_SEEDS),

    playerScore: 0,

    computerScore: 0,

    turn: "player",

    difficulty: "medium",

    busy: false,

    gameOver: false

};


/* =========================================
   DOM
========================================= */

const playerRow =
    document.getElementById("playerRow");

const computerRow =
    document.getElementById("computerRow");

const playerScore =
    document.getElementById("playerScore");

const computerScore =
    document.getElementById("computerScore");

const playerSeeds =
    document.getElementById("playerSeeds");

const computerSeeds =
    document.getElementById("computerSeeds");

const turnLabel =
    document.getElementById("turnLabel");

const statusText =
    document.getElementById("statusText");

const statusIcon =
    document.getElementById("statusIcon");

const difficulty =
    document.getElementById("difficulty");

const restartButton =
    document.getElementById("restartButton");

const thinking =
    document.getElementById("thinking");

const resultModal =
    document.getElementById("resultModal");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const playAgain =
    document.getElementById("playAgain");


/* =========================================
   RENDER
========================================= */

function renderBoard() {

    playerRow.innerHTML = "";

    computerRow.innerHTML = "";


    /*
     * Player pits:
     * 0 → 6
     */

    for (
        let i = 0;
        i < PITS_PER_PLAYER;
        i++
    ) {

        const pit =
            createPit(
                i,
                "player"
            );

        playerRow.appendChild(pit);

    }


    /*
     * Computer pits:
     * 7 → 13
     *
     * Display reversed so the board
     * reads naturally from both sides.
     */

    for (
        let i = 13;
        i >= 7;
        i--
    ) {

        const pit =
            createPit(
                i,
                "computer"
            );

        computerRow.appendChild(pit);

    }


    updateScores();

}


/* =========================================
   CREATE PIT
========================================= */

function createPit(
    index,
    owner
) {

    const pit =
        document.createElement("button");

    pit.className = "pit";


    if (
        owner === "player" &&
        state.turn === "player" &&
        !state.busy &&
        !state.gameOver &&
        state.board[index] > 0
    ) {

        pit.classList.add(
            "selectable"
        );


        pit.addEventListener(
            "click",
            () => playerMove(index)
        );

    }


    pit.innerHTML = `

        <span class="pit-number">
            Pit ${getDisplayPitNumber(index)}
        </span>

        <span class="seed-count">
            ${state.board[index]}
        </span>

        <span class="seed-label">
            Seeds
        </span>

        <span class="seed-display">
            ${createSeedDots(
                state.board[index]
            )}
        </span>

    `;


    return pit;

}


/* =========================================
   DISPLAY PIT NUMBER
========================================= */

function getDisplayPitNumber(
    index
) {

    if (index < 7) {

        return index + 1;

    }


    return index - 6;

}


/* =========================================
   SEED DOTS
========================================= */

function createSeedDots(
    count
) {

    const visible =
        Math.min(count, 12);

    let html = "";


    for (
        let i = 0;
        i < visible;
        i++
    ) {

        const angle =
            (i / visible) *
            Math.PI *
            2;


        const radius =
            22;


        const x =
            50 +
            Math.cos(angle) *
            radius;


        const y =
            50 +
            Math.sin(angle) *
            radius;


        html += `
            <i
                class="seed"
                style="
                    left:${x}%;
                    top:${y}%;
                "
            ></i>
        `;

    }


    return html;

}


/* =========================================
   PLAYER MOVE
========================================= */

async function playerMove(
    pitIndex
) {

    if (
        state.busy ||
        state.gameOver ||
        state.turn !== "player"
    ) {

        return;

    }


    if (
        state.board[pitIndex] <= 0
    ) {

        return;

    }


    state.busy = true;

    statusIcon.textContent = "🟠";

    statusText.textContent =
        `You selected Pit ${
            getDisplayPitNumber(pitIndex)
        }.`;


    const result =
        await sow(
            pitIndex,
            "player"
        );


    applyCapture(
        result.lastIndex,
        "player"
    );


    renderBoard();


    if (
        checkGameEnd()
    ) {

        state.busy = false;

        return;

    }


    await wait(700);


    state.turn = "computer";

    state.busy = false;

    updateTurn();


    setTimeout(
        computerMove,
        800
    );

}


/* =========================================
   COMPUTER MOVE
========================================= */

async function computerMove() {

    if (
        state.gameOver
    ) {

        return;

    }


    state.busy = true;

    thinking.hidden = false;

    statusIcon.textContent = "🤖";

    statusText.textContent =
        "Computer is choosing a pit...";


    const legalMoves =
        getComputerMoves();


    if (
        legalMoves.length === 0
    ) {

        finishTurn();

        return;

    }


    const selected =
        chooseComputerPit(
            legalMoves
        );


    await wait(
        getThinkingTime()
    );


    statusText.textContent =
        `Computer selected Pit ${
            getDisplayPitNumber(selected)
        }.`;


    const result =
        await sow(
            selected,
            "computer"
        );


    applyCapture(
        result.lastIndex,
        "computer"
    );


    renderBoard();


    if (
        checkGameEnd()
    ) {

        thinking.hidden = true;

        state.busy = false;

        return;

    }


    thinking.hidden = true;

    state.turn = "player";

    state.busy = false;

    updateTurn();

}


/* =========================================
   SOW
========================================= */

async function sow(
    startIndex,
    owner
) {

    let seeds =
        state.board[startIndex];


    state.board[startIndex] = 0;

    renderBoard();


    let current =
        startIndex;


    let lastIndex =
        startIndex;


    /*
     * Seeds are distributed clockwise
     * around all 14 pits.
     */

    while (
        seeds > 0
    ) {

        current =
            (current + 1) %
            PIT_COUNT;


        state.board[current]++;

        seeds--;

        lastIndex =
            current;


        renderBoard();

        await wait(90);

    }


    /*
     * Continue sowing if the last pit
     * contained seeds before the final
     * placement.
     *
     * This is a simplified digital
     * adaptation of relay sowing.
     */

    while (
        state.board[lastIndex] > 1
    ) {

        await wait(180);


        seeds =
            state.board[lastIndex];


        state.board[lastIndex] = 0;


        current =
            lastIndex;


        while (
            seeds > 0
        ) {

            current =
                (current + 1) %
                PIT_COUNT;


            state.board[current]++;

            seeds--;

            lastIndex =
                current;


            renderBoard();

            await wait(80);

        }

    }


    return {
        lastIndex
    };

}


/* =========================================
   CAPTURE
========================================= */

function applyCapture(
    lastIndex,
    owner
) {

    /*
     * Simplified capture rule:
     *
     * If the last seed lands in an
     * empty pit on the mover's side,
     * collect seeds from the opposite pit.
     */

    const isPlayerPit =
        lastIndex >= 0 &&
        lastIndex < 7;


    const moverOwnsPit =
        owner === "player"
            ? isPlayerPit
            : !isPlayerPit;


    if (!moverOwnsPit) {
        return;
    }


    if (
        state.board[lastIndex] !== 1
    ) {

        return;

    }


    const opposite =
        13 - lastIndex;


    const captured =
        state.board[opposite];


    if (
        captured <= 0
    ) {

        return;

    }


    state.board[opposite] = 0;

    state.board[lastIndex] = 0;


    if (
        owner === "player"
    ) {

        state.playerScore +=
            captured + 1;

        statusText.textContent =
            `You captured ${
                captured + 1
            } seeds!`;

    } else {

        state.computerScore +=
            captured + 1;

        statusText.textContent =
            `Computer captured ${
                captured + 1
            } seeds.`;

    }

}


/* =========================================
   COMPUTER LEGAL MOVES
========================================= */

function getComputerMoves() {

    const moves = [];


    for (
        let i = 7;
        i < 14;
        i++
    ) {

        if (
            state.board[i] > 0
        ) {

            moves.push(i);

        }

    }


    return moves;

}


/* =========================================
   AI
========================================= */

function chooseComputerPit(
    moves
) {

    const scored =
        moves.map(
            index => {

                return {
                    index,

                    score:
                        evaluateComputerMove(
                            index
                        )

                };

            }
        );


    scored.sort(
        (a, b) =>
            b.score - a.score
    );


    /*
     * EASY:
     * mostly random.
     */

    if (
        state.difficulty === "easy"
    ) {

        if (
            Math.random() < 0.7
        ) {

            return randomItem(
                moves
            );

        }

    }


    /*
     * MEDIUM:
     * occasionally random.
     */

    if (
        state.difficulty === "medium"
    ) {

        if (
            Math.random() < 0.2
        ) {

            return randomItem(
                moves
            );

        }

    }


    return scored[0].index;

}


/* =========================================
   AI EVALUATION
========================================= */

function evaluateComputerMove(
    index
) {

    const seeds =
        state.board[index];


    let score =
        seeds * 2;


    /*
     * Prefer moves that can potentially
     * end near the computer side.
     */

    const last =
        (
            index + seeds
        ) %
        PIT_COUNT;


    const lastIsComputer =
        last >= 7;


    if (
        lastIsComputer
    ) {

        score += 10;

    }


    /*
     * Estimate capture.
     */

    if (
        lastIsComputer &&
        state.board[last] === 0
    ) {

        const opposite =
            13 - last;


        if (
            state.board[opposite] > 0
        ) {

            score +=
                state.board[opposite] * 6;

        }

    }


    /*
     * Larger seed distribution
     * gets a moderate bonus.
     */

    if (
        seeds >= 5
    ) {

        score += 4;

    }


    return score;

}


/* =========================================
   TURN
========================================= */

function updateTurn() {

    if (
        state.turn === "player"
    ) {

        turnLabel.textContent =
            "Your Turn";

        statusIcon.textContent =
            "🟠";

        statusText.textContent =
            "Choose one of your pits.";

    } else {

        turnLabel.textContent =
            "Computer's Turn";

        statusIcon.textContent =
            "🤖";

    }


    renderBoard();

}


/* =========================================
   GAME END
========================================= */

function checkGameEnd() {

    const playerAvailable =
        state.board
            .slice(0, 7)
            .some(
                seeds =>
                    seeds > 0
            );


    const computerAvailable =
        state.board
            .slice(7, 14)
            .some(
                seeds =>
                    seeds > 0
            );


    if (
        playerAvailable &&
        computerAvailable
    ) {

        return false;

    }


    finishGame();

    return true;

}


/* =========================================
   FINISH GAME
========================================= */

function finishGame() {

    state.gameOver = true;

    state.busy = false;

    thinking.hidden = true;


    /*
     * Remaining seeds are added
     * to the respective scores.
     */

    state.playerScore +=
        state.board
            .slice(0, 7)
            .reduce(
                (sum, value) =>
                    sum + value,
                0
            );


    state.computerScore +=
        state.board
            .slice(7, 14)
            .reduce(
                (sum, value) =>
                    sum + value,
                0
            );


    state.board =
        Array(PIT_COUNT)
            .fill(0);


    renderBoard();


    if (
        state.playerScore >
        state.computerScore
    ) {

        resultIcon.textContent =
            "🏆";

        resultTitle.textContent =
            "You Win!";

        resultText.textContent =
            `You collected ${
                state.playerScore
            } seeds against ${
                state.computerScore
            }.`;

    } else if (
        state.computerScore >
        state.playerScore
    ) {

        resultIcon.textContent =
            "🤖";

        resultTitle.textContent =
            "Computer Wins";

        resultText.textContent =
            `Computer collected ${
                state.computerScore
            } seeds against ${
                state.playerScore
            }.`;

    } else {

        resultIcon.textContent =
            "🤝";

        resultTitle.textContent =
            "It's a Draw";

        resultText.textContent =
            `Both players collected ${
                state.playerScore
            } seeds.`;

    }


    setTimeout(
        () => {

            resultModal.hidden =
                false;

        },
        400
    );

}


/* =========================================
   RESTART
========================================= */

function restartGame() {

    state.board =
        Array(PIT_COUNT)
            .fill(INITIAL_SEEDS);

    state.playerScore = 0;

    state.computerScore = 0;

    state.turn = "player";

    state.busy = false;

    state.gameOver = false;

    thinking.hidden = true;

    resultModal.hidden = true;

    updateScores();

    updateTurn();

}


/* =========================================
   SCORE UPDATE
========================================= */

function updateScores() {

    playerScore.textContent =
        state.playerScore;

    computerScore.textContent =
        state.computerScore;


    playerSeeds.textContent =
        state.board
            .slice(0, 7)
            .reduce(
                (sum, value) =>
                    sum + value,
                0
            );


    computerSeeds.textContent =
        state.board
            .slice(7, 14)
            .reduce(
                (sum, value) =>
                    sum + value,
                0
            );

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
   RESTART BUTTON
========================================= */

restartButton.addEventListener(
    "click",
    restartGame
);


/* =========================================
   PLAY AGAIN
========================================= */

playAgain.addEventListener(
    "click",
    restartGame
);


/* =========================================
   COMPUTER THINKING TIME
========================================= */

function getThinkingTime() {

    if (
        state.difficulty === "easy"
    ) {

        return 450;

    }


    if (
        state.difficulty === "hard"
    ) {

        return 1100;

    }


    return 750;

}


/* =========================================
   FINISH TURN
========================================= */

function finishTurn() {

    thinking.hidden = true;

    state.turn = "player";

    state.busy = false;

    updateTurn();

}


/* =========================================
   HELPERS
========================================= */

function randomItem(array) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


function wait(milliseconds) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


/* =========================================
   INITIALIZE
========================================= */

renderBoard();

updateScores();

updateTurn();