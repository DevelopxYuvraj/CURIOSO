/* =========================================
   CURIOS GAMES
   ASHTA CHAMMA
   Simplified Digital Adaptation
========================================= */

const PATH_LENGTH = 28;
const PIECES = 4;

const state = {
    player: [ -1, -1, -1, -1 ],
    computer: [ -1, -1, -1, -1 ],

    playerHome: 0,
    computerHome: 0,

    turn: "player",

    dice: 0,

    canMove: false,

    busy: false,

    gameOver: false,

    difficulty: "medium"
};


/* =========================================
   DOM
========================================= */

const gameBoard =
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


/* =========================================
   BOARD PATH
========================================= */

const pathCoordinates = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],

    [1, 6],
    [2, 6],
    [3, 6],

    [4, 6],
    [5, 6],
    [6, 6],

    [6, 5],
    [6, 4],
    [6, 3],
    [6, 2],
    [6, 1],
    [6, 0],

    [5, 0],
    [4, 0],
    [3, 0],

    [2, 0],
    [1, 0]
];


/*
 * We use a circular shared track.
 * The remaining cells form visual
 * home/center areas.
 */

function renderBoard() {

    gameBoard.innerHTML = "";


    const cells = [];


    for (let row = 0; row < 7; row++) {

        for (let col = 0; col < 7; col++) {

            const cell =
                document.createElement("div");

            cell.className =
                "board-cell";


            const pathIndex =
                pathCoordinates.findIndex(
                    coordinate =>
                        coordinate[0] === row &&
                        coordinate[1] === col
                );


            if (pathIndex !== -1) {

                cell.classList.add("path");

                cell.dataset.path =
                    pathIndex;

            }


            /*
             * Safe positions.
             */

            if (
                pathIndex === 0 ||
                pathIndex === 7 ||
                pathIndex === 14 ||
                pathIndex === 21
            ) {

                cell.classList.add("safe");

            }


            /*
             * Center.
             */

            if (
                row >= 2 &&
                row <= 4 &&
                col >= 2 &&
                col <= 4 &&
                pathIndex === -1
            ) {

                cell.classList.add("center");

                if (
                    row === 3 &&
                    col === 3
                ) {

                    cell.textContent =
                        "ASHTA";

                }

            }


            gameBoard.appendChild(cell);

            cells.push(cell);

        }

    }


    /*
     * Pieces.
     */

    state.player.forEach(
        (position, index) => {

            if (position >= 0) {

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

            if (position >= 0) {

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
     * Player pieces still at home
     * can be selected after rolling.
     */

    if (
        state.turn === "player" &&
        state.canMove &&
        !state.busy
    ) {

        state.player.forEach(
            (position, index) => {

                if (
                    position === -1 &&
                    isLegalMove(
                        "player",
                        index
                    )
                ) {

                    highlightHomePiece(
                        index
                    );

                }

            }
        );

    }

}


/* =========================================
   ADD PIECE
========================================= */

function addPiece(
    cells,
    position,
    owner,
    pieceIndex
) {

    if (
        position >= PATH_LENGTH
    ) {

        return;

    }


    const coordinate =
        pathCoordinates[position];


    const cell =
        cells.find(
            current =>
                current.dataset.path ==
                position
        );


    if (!cell) {
        return;
    }


    const piece =
        document.createElement("button");

    piece.className =
        `piece ${owner}`;


    piece.textContent =
        pieceIndex + 1;


    /*
     * Only player pieces can be
     * selected manually.
     */

    if (
        owner === "player" &&
        state.turn === "player" &&
        state.canMove &&
        isLegalMove(
            "player",
            pieceIndex
        )
    ) {

        piece.classList.add(
            "movable"
        );


        piece.addEventListener(
            "click",
            () =>
                movePlayerPiece(
                    pieceIndex
                )
        );

    }


    cell.appendChild(piece);

}


/* =========================================
   HOME PIECE HIGHLIGHT
========================================= */

function highlightHomePiece(
    pieceIndex
) {

    /*
     * Use an empty visual home
     * indicator near the board.
     */

    const cells =
        document.querySelectorAll(
            ".board-cell"
        );


    const homeCells = [
        cells[16],
        cells[18],
        cells[30],
        cells[32]
    ];


    const target =
        homeCells[pieceIndex];


    if (!target) {
        return;
    }


    const piece =
        document.createElement("button");

    piece.className =
        "piece player movable";

    piece.textContent =
        pieceIndex + 1;


    piece.addEventListener(
        "click",
        () =>
            movePlayerPiece(
                pieceIndex
            )
    );


    target.appendChild(piece);

}


/* =========================================
   LEGAL MOVE
========================================= */

function isLegalMove(
    owner,
    pieceIndex
) {

    const pieces =
        owner === "player"
            ? state.player
            : state.computer;


    const position =
        pieces[pieceIndex];


    /*
     * A piece at home can only enter
     * with a 6 in this simplified version.
     */

    if (
        position === -1
    ) {

        return state.dice === 6;

    }


    /*
     * Already finished.
     */

    if (
        position >= PATH_LENGTH
    ) {

        return false;

    }


    return (
        position +
        state.dice
    ) <= PATH_LENGTH;

}


/* =========================================
   ROLL DICE
========================================= */

function rollDice() {

    if (
        state.busy ||
        state.gameOver ||
        state.turn !== "player"
    ) {

        return;

    }


    state.busy = true;

    rollButton.disabled =
        true;


    dice.classList.add(
        "rolling"
    );


    setTimeout(
        () => {

            state.dice =
                Math.floor(
                    Math.random() * 6
                ) + 1;


            dice.textContent =
                state.dice;

            diceResult.textContent =
                `You rolled ${
                    state.dice
                }`;


            dice.classList.remove(
                "rolling"
            );


            state.canMove =
                true;

            state.busy =
                false;


            renderBoard();


            const legal =
                getLegalMoves(
                    "player"
                );


            if (
                legal.length === 0
            ) {

                message.textContent =
                    "No legal move. Turn passes to the computer.";

                state.canMove =
                    false;

                setTimeout(
                    computerTurn,
                    900
                );

                return;

            }


            message.textContent =
                "Select a highlighted piece.";

            statusText.textContent =
                "Choose a piece to move.";

            statusIcon.textContent =
                "🟠";

        },
        500
    );

}


/* =========================================
   PLAYER MOVE
========================================= */

function movePlayerPiece(
    pieceIndex
) {

    if (
        state.busy ||
        !state.canMove
    ) {

        return;

    }


    if (
        !isLegalMove(
            "player",
            pieceIndex
        )
    ) {

        return;

    }


    state.busy =
        true;

    state.canMove =
        false;


    let newPosition;


    if (
        state.player[pieceIndex] === -1
    ) {

        newPosition =
            0;

    } else {

        newPosition =
            state.player[pieceIndex] +
            state.dice;

    }


    state.player[pieceIndex] =
        newPosition;


    if (
        newPosition >= PATH_LENGTH
    ) {

        state.playerHome++;

        state.player[pieceIndex] =
            PATH_LENGTH;

        message.textContent =
            "Your piece reached home!";

    } else {

        captureOpponents(
            newPosition,
            "player"
        );

        message.textContent =
            `Piece ${
                pieceIndex + 1
            } moved ${
                state.dice
            } spaces.`;

    }


    updateStats();

    renderBoard();


    if (
        checkWinner()
    ) {

        return;

    }


    /*
     * Rolling a 6 gives another
     * turn in this simplified version.
     */

    if (
        state.dice === 6
    ) {

        state.busy =
            false;

        state.canMove =
            false;

        rollButton.disabled =
            false;

        message.textContent +=
            " You rolled a 6 — roll again.";

        return;

    }


    state.turn =
        "computer";

    state.busy =
        false;

    updateTurn();


    setTimeout(
        computerTurn,
        800
    );

}


/* =========================================
   COMPUTER TURN
========================================= */

async function computerTurn() {

    if (
        state.gameOver
    ) {

        return;

    }


    state.turn =
        "computer";

    state.busy =
        true;

    thinking.hidden =
        false;

    rollButton.disabled =
        true;


    updateTurn();


    await wait(800);


    state.dice =
        Math.floor(
            Math.random() * 6
        ) + 1;


    dice.textContent =
        state.dice;

    diceResult.textContent =
        `Computer rolled ${
            state.dice
        }`;


    const legal =
        getLegalMoves(
            "computer"
        );


    if (
        legal.length === 0
    ) {

        await wait(700);

        state.turn =
            "player";

        state.busy =
            false;

        thinking.hidden =
            true;

        updateTurn();

        return;

    }


    const selected =
        chooseComputerMove(
            legal
        );


    await wait(700);


    let newPosition;


    if (
        state.computer[selected] === -1
    ) {

        newPosition =
            0;

    } else {

        newPosition =
            state.computer[selected] +
            state.dice;

    }


    state.computer[selected] =
        newPosition;


    if (
        newPosition >= PATH_LENGTH
    ) {

        state.computerHome++;

    } else {

        captureOpponents(
            newPosition,
            "computer"
        );

    }


    updateStats();

    renderBoard();


    if (
        checkWinner()
    ) {

        thinking.hidden =
            true;

        return;

    }


    if (
        state.dice === 6
    ) {

        thinking.hidden =
            true;

        state.busy =
            false;

        message.textContent =
            "Computer rolled a 6 and gets another turn.";

        setTimeout(
            computerTurn,
            800
        );

        return;

    }


    state.turn =
        "player";

    state.busy =
        false;

    thinking.hidden =
        true;

    updateTurn();

}


/* =========================================
   LEGAL MOVES
========================================= */

function getLegalMoves(
    owner
) {

    const pieces =
        owner === "player"
            ? state.player
            : state.computer;


    const result = [];


    pieces.forEach(
        (position, index) => {

            if (
                isLegalMove(
                    owner,
                    index
                )
            ) {

                result.push(index);

            }

        }
    );


    return result;

}


/* =========================================
   COMPUTER AI
========================================= */

function chooseComputerMove(
    legalMoves
) {

    if (
        state.difficulty === "easy"
    ) {

        return randomItem(
            legalMoves
        );

    }


    const scored =
        legalMoves.map(
            index => {

                let value =
                    Math.random() * 3;


                const position =
                    state.computer[index];


                /*
                 * Prefer entering the board.
                 */

                if (
                    position === -1 &&
                    state.dice === 6
                ) {

                    value += 8;

                }


                /*
                 * Prefer capture.
                 */

                const target =
                    position === -1
                        ? 0
                        : position + state.dice;


                if (
                    target < PATH_LENGTH &&
                    canCapture(
                        target,
                        "computer"
                    )
                ) {

                    value += 12;

                }


                /*
                 * Hard AI prioritizes
                 * pieces close to home.
                 */

                if (
                    state.difficulty === "hard"
                ) {

                    value +=
                        target * 1.5;

                } else {

                    value +=
                        target * 0.5;

                }


                return {
                    index,
                    value
                };

            }
        );


    scored.sort(
        (a, b) =>
            b.value - a.value
    );


    return scored[0].index;

}


/* =========================================
   CAPTURE
========================================= */

function canCapture(
    position,
    owner
) {

    const opponents =
        owner === "player"
            ? state.computer
            : state.player;


    return opponents.some(
        opponentPosition =>
            opponentPosition === position
    );

}


function captureOpponents(
    position,
    owner
) {

    const opponents =
        owner === "player"
            ? state.computer
            : state.player;


    const captured =
        opponents.findIndex(
            opponentPosition =>
                opponentPosition === position
        );


    if (
        captured === -1
    ) {

        return;

    }


    /*
     * Simple safe-cell protection.
     */

    const safePositions =
        [0, 7, 14, 21];


    if (
        safePositions.includes(
            position
        )
    ) {

        return;

    }


    opponents[captured] =
        -1;


    if (
        owner === "player"
    ) {

        message.textContent =
            "Captured a computer piece!";

    } else {

        message.textContent =
            "Computer captured one of your pieces.";

    }

}


/* =========================================
   WINNER
========================================= */

function checkWinner() {

    if (
        state.playerHome >= PIECES
    ) {

        finishGame(
            "player"
        );

        return true;

    }


    if (
        state.computerHome >= PIECES
    ) {

        finishGame(
            "computer"
        );

        return true;

    }


    return false;

}


/* =========================================
   FINISH GAME
========================================= */

function finishGame(
    winner
) {

    state.gameOver =
        true;

    state.busy =
        false;

    state.canMove =
        false;

    rollButton.disabled =
        true;

    thinking.hidden =
        true;


    if (
        winner === "player"
    ) {

        resultIcon.textContent =
            "🏆";

        resultTitle.textContent =
            "You Win!";

        resultText.textContent =
            "All four of your pieces reached home.";

    } else {

        resultIcon.textContent =
            "🤖";

        resultTitle.textContent =
            "Computer Wins";

        resultText.textContent =
            "The computer got all four pieces home first.";

    }


    setTimeout(
        () => {

            resultModal.hidden =
                false;

        },
        500
    );

}


/* =========================================
   TURN UI
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

        rollButton.disabled =
            true;

    }


    renderBoard();

}


/* =========================================
   STATS
========================================= */

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


/* =========================================
   RESTART
========================================= */

function restartGame() {

    state.player =
        [-1, -1, -1, -1];

    state.computer =
        [-1, -1, -1, -1];

    state.playerHome =
        0;

    state.computerHome =
        0;

    state.turn =
        "player";

    state.dice =
        0;

    state.canMove =
        false;

    state.busy =
        false;

    state.gameOver =
        false;


    dice.textContent =
        "?";

    diceResult.textContent =
        "Roll to begin";

    message.textContent =
        "Roll the dice to start your turn.";

    resultModal.hidden =
        true;

    thinking.hidden =
        true;

    rollButton.disabled =
        false;


    updateStats();

    updateTurn();

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


/* =========================================
   HELPERS
========================================= */

function randomItem(
    array
) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


function wait(
    milliseconds
) {

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

updateStats();

renderBoard();

updateTurn();