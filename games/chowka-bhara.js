const PATH_LENGTH = 24;
const PIECES = 4;

const state = {
    player: [-1, -1, -1, -1],
    computer: [-1, -1, -1, -1],

    playerHome: 0,
    computerHome: 0,

    turn: "player",
    dice: 0,

    canMove: false,
    busy: false,
    gameOver: false,

    difficulty: "medium"
};


/* DOM */

const board =
    document.getElementById("gameBoard");

const dice =
    document.getElementById("dice");

const diceResult =
    document.getElementById("diceResult");

const rollButton =
    document.getElementById("rollButton");

const restartButton =
    document.getElementById("restartButton");

const turnLabel =
    document.getElementById("turnLabel");

const message =
    document.getElementById("message");

const statusIcon =
    document.getElementById("statusIcon");

const statusText =
    document.getElementById("statusText");

const playerHome =
    document.getElementById("playerHome");

const computerHome =
    document.getElementById("computerHome");

const playerProgress =
    document.getElementById("playerProgress");

const computerProgress =
    document.getElementById("computerProgress");

const difficulty =
    document.getElementById("difficulty");

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


/* 5x5 visual board path */

const path = [
    [0,0], [0,1], [0,2], [0,3], [0,4],
    [1,4], [2,4], [3,4],
    [4,4], [4,3], [4,2], [4,1], [4,0],
    [3,0], [2,0], [1,0],

    [1,1], [1,2], [1,3],
    [2,3], [3,3],
    [3,2], [3,1],
    [2,1]
];


const safeCells = [0, 6, 12, 18];


/* BOARD */

function renderBoard() {

    board.innerHTML = "";

    const cells = [];

    for (let row = 0; row < 5; row++) {

        for (let col = 0; col < 5; col++) {

            const cell =
                document.createElement("div");

            cell.className = "board-cell";

            const index =
                path.findIndex(
                    p =>
                        p[0] === row &&
                        p[1] === col
                );

            if (index !== -1) {

                cell.classList.add("path");

                cell.dataset.path = index;

                if (safeCells.includes(index)) {
                    cell.classList.add("safe");
                }

            } else {

                cell.classList.add("center");

                if (row === 2 && col === 2) {
                    cell.textContent = "CHOWKA";
                }

            }

            board.appendChild(cell);
            cells.push(cell);
        }
    }


    state.player.forEach(
        (position, index) => {

            if (
                position >= 0 &&
                position < PATH_LENGTH
            ) {
                addPiece(
                    cells,
                    position,
                    "player",
                    index
                );
            }
        }
    );


    state.computer.forEach(
        (position, index) => {

            if (
                position >= 0 &&
                position < PATH_LENGTH
            ) {
                addPiece(
                    cells,
                    position,
                    "computer",
                    index
                );
            }
        }
    );


    /*
     * Pieces waiting at home.
     */

    if (
        state.turn === "player" &&
        state.canMove
    ) {

        state.player.forEach(
            (position, index) => {

                if (
                    position === -1 &&
                    legalMove(index)
                ) {

                    addHomePiece(
                        cells,
                        index
                    );
                }
            }
        );
    }
}


function addPiece(
    cells,
    position,
    owner,
    index
) {

    const cell =
        cells.find(
            c =>
                Number(c.dataset.path) ===
                position
        );

    if (!cell) return;


    const piece =
        document.createElement("button");

    piece.className =
        `piece ${owner}`;

    piece.textContent =
        index + 1;


    if (
        owner === "player" &&
        state.turn === "player" &&
        state.canMove &&
        legalMove(index)
    ) {

        piece.classList.add("movable");

        piece.addEventListener(
            "click",
            () => movePlayer(index)
        );
    }


    cell.appendChild(piece);
}


function addHomePiece(
    cells,
    index
) {

    const homeCells = [
        6, 8, 16, 18
    ];

    const cell =
        cells[homeCells[index]];

    if (!cell) return;


    const piece =
        document.createElement("button");

    piece.className =
        "piece player movable";

    piece.textContent =
        index + 1;

    piece.addEventListener(
        "click",
        () => movePlayer(index)
    );

    cell.appendChild(piece);
}


/* LEGAL MOVE */

function legalMove(index) {

    const position =
        state.player[index];

    if (position === -1) {
        return state.dice === 6;
    }

    if (position >= PATH_LENGTH) {
        return false;
    }

    return (
        position + state.dice
    ) <= PATH_LENGTH;
}


function computerLegal(index) {

    const position =
        state.computer[index];

    if (position === -1) {
        return state.dice === 6;
    }

    if (position >= PATH_LENGTH) {
        return false;
    }

    return (
        position + state.dice
    ) <= PATH_LENGTH;
}


/* ROLL */

function rollDice() {

    if (
        state.busy ||
        state.gameOver ||
        state.turn !== "player"
    ) {
        return;
    }

    state.busy = true;
    rollButton.disabled = true;

    dice.classList.add("rolling");

    setTimeout(() => {

        state.dice =
            Math.floor(
                Math.random() * 6
            ) + 1;

        dice.textContent =
            state.dice;

        diceResult.textContent =
            `You rolled ${state.dice}`;

        dice.classList.remove("rolling");

        state.canMove = true;
        state.busy = false;

        renderBoard();

        const moves =
            state.player
                .map((_, i) => i)
                .filter(legalMove);

        if (!moves.length) {

            message.textContent =
                "No legal move. Turn passes.";

            state.canMove = false;

            setTimeout(
                computerTurn,
                700
            );

            return;
        }

        message.textContent =
            "Select a highlighted piece.";

        statusIcon.textContent = "🪙";
        statusText.textContent =
            "Choose a piece to move.";

    }, 500);
}


/* PLAYER */

function movePlayer(index) {

    if (
        state.busy ||
        !state.canMove ||
        !legalMove(index)
    ) {
        return;
    }


    state.busy = true;
    state.canMove = false;


    let position =
        state.player[index];


    if (position === -1) {
        position = 0;
    } else {
        position += state.dice;
    }


    if (position >= PATH_LENGTH) {

        state.player[index] =
            PATH_LENGTH;

        state.playerHome++;

        message.textContent =
            "Your piece reached home!";

    } else {

        state.player[index] =
            position;

        capture(
            position,
            "player"
        );

        message.textContent =
            `Piece ${index + 1} moved ${state.dice} spaces.`;
    }


    updateStats();
    renderBoard();


    if (checkWinner()) return;


    if (state.dice === 6) {

        state.busy = false;
        rollButton.disabled = false;

        message.textContent +=
            " You rolled 6 — roll again.";

        return;
    }


    state.turn = "computer";
    state.busy = false;

    updateTurn();

    setTimeout(
        computerTurn,
        800
    );
}


/* COMPUTER */

async function computerTurn() {

    if (state.gameOver) return;

    state.turn = "computer";
    state.busy = true;

    thinking.hidden = false;

    updateTurn();

    await wait(700);


    state.dice =
        Math.floor(
            Math.random() * 6
        ) + 1;


    dice.textContent =
        state.dice;

    diceResult.textContent =
        `Computer rolled ${state.dice}`;


    const moves =
        state.computer
            .map((_, i) => i)
            .filter(computerLegal);


    if (!moves.length) {

        await wait(500);

        state.turn = "player";
        state.busy = false;

        thinking.hidden = true;

        updateTurn();

        return;
    }


    const selected =
        chooseComputerMove(moves);


    await wait(500);


    let position =
        state.computer[selected];


    if (position === -1) {
        position = 0;
    } else {
        position += state.dice;
    }


    if (position >= PATH_LENGTH) {

        state.computer[selected] =
            PATH_LENGTH;

        state.computerHome++;

    } else {

        state.computer[selected] =
            position;

        capture(
            position,
            "computer"
        );
    }


    updateStats();
    renderBoard();


    if (checkWinner()) return;


    if (state.dice === 6) {

        thinking.hidden = true;
        state.busy = false;

        message.textContent =
            "Computer rolled 6 and gets another turn.";

        setTimeout(
            computerTurn,
            700
        );

        return;
    }


    state.turn = "player";
    state.busy = false;

    thinking.hidden = true;

    updateTurn();
}


/* AI */

function chooseComputerMove(
    moves
) {

    if (
        state.difficulty === "easy"
    ) {

        return randomItem(moves);
    }


    let best = moves[0];
    let bestScore = -Infinity;


    moves.forEach(index => {

        let position =
            state.computer[index];

        position =
            position === -1
                ? 0
                : position + state.dice;


        let value =
            Math.random() * 3;


        if (
            canCapture(
                position,
                "computer"
            )
        ) {
            value += 12;
        }


        if (
            state.difficulty === "hard"
        ) {
            value += position * 1.5;
        } else {
            value += position * .6;
        }


        if (
            state.dice === 6 &&
            state.computer[index] === -1
        ) {
            value += 8;
        }


        if (value > bestScore) {

            bestScore = value;
            best = index;
        }

    });


    return best;
}


/* CAPTURE */

function canCapture(
    position,
    owner
) {

    const opponent =
        owner === "player"
            ? state.computer
            : state.player;

    return opponent.some(
        p => p === position
    );
}


function capture(
    position,
    owner
) {

    if (
        safeCells.includes(position)
    ) {
        return;
    }


    const opponent =
        owner === "player"
            ? state.computer
            : state.player;


    const index =
        opponent.findIndex(
            p => p === position
        );


    if (index === -1) return;


    opponent[index] = -1;


    message.textContent =
        owner === "player"
            ? "You captured a computer piece!"
            : "Computer captured your piece!";
}


/* WINNER */

function checkWinner() {

    if (
        state.playerHome >= PIECES
    ) {

        finishGame("player");
        return true;
    }


    if (
        state.computerHome >= PIECES
    ) {

        finishGame("computer");
        return true;
    }


    return false;
}


/* RESULT */

function finishGame(
    winner
) {

    state.gameOver = true;
    state.busy = false;
    state.canMove = false;

    rollButton.disabled = true;

    thinking.hidden = true;


    if (winner === "player") {

        resultIcon.textContent = "🏆";
        resultTitle.textContent = "You Win!";
        resultText.textContent =
            "All four of your pieces reached home.";

    } else {

        resultIcon.textContent = "🤖";
        resultTitle.textContent =
            "Computer Wins";
        resultText.textContent =
            "The computer reached home first.";
    }


    setTimeout(() => {
        resultModal.hidden = false;
    }, 400);
}


/* UI */

function updateTurn() {

    if (
        state.turn === "player"
    ) {

        turnLabel.textContent =
            "Your Turn";

        statusIcon.textContent =
            "🪙";

        statusText.textContent =
            "Roll the dice.";

        rollButton.disabled =
            state.busy ||
            state.gameOver;

    } else {

        turnLabel.textContent =
            "Computer's Turn";

        statusIcon.textContent =
            "🤖";

        statusText.textContent =
            "Computer is playing.";

        rollButton.disabled = true;
    }


    renderBoard();
}


function updateStats() {

    playerHome.textContent =
        state.playerHome;

    computerHome.textContent =
        state.computerHome;

    playerProgress.textContent =
        `${state.playerHome} / ${PIECES}`;

    computerProgress.textContent =
        `${state.computerHome} / ${PIECES}`;
}


/* RESTART */

function restartGame() {

    state.player =
        [-1, -1, -1, -1];

    state.computer =
        [-1, -1, -1, -1];

    state.playerHome = 0;
    state.computerHome = 0;

    state.turn = "player";
    state.dice = 0;

    state.canMove = false;
    state.busy = false;
    state.gameOver = false;


    dice.textContent = "?";
    diceResult.textContent =
        "Roll to begin";

    message.textContent =
        "Roll the dice to start.";

    resultModal.hidden = true;
    thinking.hidden = true;

    rollButton.disabled = false;


    updateStats();
    updateTurn();
}


/* DIFFICULTY */

difficulty.addEventListener(
    "change",
    () => {

        state.difficulty =
            difficulty.value;

        restartGame();
    }
);


/* BUTTONS */

rollButton.addEventListener(
    "click",
    rollDice
);

restartButton.addEventListener(
    "click",
    restartGame
);

playAgain.addEventListener(
    "click",
    restartGame
);


/* HELPERS */

function randomItem(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}


function wait(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );
}


/* INIT */

updateStats();
renderBoard();
updateTurn();