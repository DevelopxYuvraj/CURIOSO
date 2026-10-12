/* =========================================
   CURIOS GAMES
   PACHISI / CHAUPAR
   Digital Adaptation Engine
========================================= */


/* =========================================
   GAME CONSTANTS
========================================= */

const PIECES_PER_PLAYER = 4;

const TRACK_LENGTH = 52;

const HOME_LENGTH = 6;


/*
 * Entry requires a 6 in this digital
 * adaptation.
 */

const ENTRY_ROLL = 6;


/*
 * These are safe positions on the
 * shared track.
 *
 * The exact traditional safe-square
 * arrangement varies by historical/
 * regional rule set, so this digital
 * version uses a clearly defined
 * simplified layout.
 */

const SAFE_SQUARES = [
    0,
    8,
    13,
    21,
    26,
    34,
    39,
    47
];


/* =========================================
   GAME STATE
========================================= */

const state = {

    player: {
        pieces: [ -1, -1, -1, -1 ]
    },

    computer: {
        pieces: [ -1, -1, -1, -1 ]
    },

    turn: "player",

    dice: 1,

    difficulty: "medium",

    gameOver: false,

    rolling: false,

    selectablePieces: []

};


/* =========================================
   DOM
========================================= */

const board =
    document.getElementById("pachisiBoard");

const rollButton =
    document.getElementById("rollButton");

const restartButton =
    document.getElementById("restartButton");

const rulesButton =
    document.getElementById("rulesButton");

const difficulty =
    document.getElementById("difficulty");

const dice =
    document.getElementById("dice");

const statusText =
    document.getElementById("statusText");

const turnLabel =
    document.getElementById("turnLabel");

const playerScore =
    document.getElementById("playerScore");

const computerScore =
    document.getElementById("computerScore");

const playerOnBoard =
    document.getElementById("playerOnBoard");

const computerOnBoard =
    document.getElementById("computerOnBoard");

const thinking =
    document.getElementById("thinking");

const movePanel =
    document.getElementById("movePanel");

const moveButtons =
    document.getElementById("moveButtons");

const resultModal =
    document.getElementById("resultModal");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const playAgain =
    document.getElementById("playAgain");


/* =========================================
   BOARD ROUTE
========================================= */


/*
 * 52 shared-track positions.
 *
 * This is represented visually on a
 * cross-shaped board.
 */

const routeCoordinates = [
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],

    [4, 6],
    [5, 6],
    [6, 6],
    [6, 5],
    [6, 4],
    [6, 3],

    [5, 3],
    [4, 3],
    [3, 3],

    [2, 3],
    [1, 3],
    [0, 3],

    [0, 2],
    [0, 1],
    [0, 0],

    [1, 0],
    [2, 0],

    [3, 0],

    [4, 0],
    [5, 0],
    [6, 0],

    [6, 1],
    [6, 2],

    [5, 3],

    [4, 3],
    [3, 3],

    [2, 3],
    [1, 3],
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

    [5, 3],

    [4, 3],
    [3, 3]
];


/*
 * Because the traditional board is
 * cross-shaped, some coordinates overlap.
 *
 * The game engine itself remains based
 * on a logical 52-position route.
 */


/* =========================================
   CREATE VISUAL BOARD
========================================= */

function createBoard() {

    board.innerHTML = "";


    /*
     * Create 7 x 7 visual grid.
     */

    for (
        let row = 0;
        row < 7;
        row++
    ) {

        for (
            let col = 0;
            col < 7;
            col++
        ) {

            const cell =
                document.createElement("div");

            cell.className = "board-cell";


            /*
             * Main cross.
             */

            const inVertical =
                col >= 2 && col <= 4;

            const inHorizontal =
                row >= 2 && row <= 4;

            if (
                inVertical ||
                inHorizontal
            ) {

                cell.classList.add("route");

            }


            /*
             * Centre.
             */

            if (
                row === 3 &&
                col === 3
            ) {

                cell.classList.add("center");

                cell.innerHTML =
                    `<span>✦</span>`;

            }


            /*
             * Safe squares.
             */

            const routeIndex =
                findCoordinateIndex(
                    row,
                    col
                );


            if (
                routeIndex !== -1 &&
                SAFE_SQUARES.includes(
                    routeIndex
                )
            ) {

                cell.classList.add("safe");

                if (
                    row !== 3 ||
                    col !== 3
                ) {

                    cell.innerHTML =
                        `<span class="safe-symbol">✦</span>`;

                }

            }


            board.appendChild(cell);

        }

    }


    createHomeAreas();

    renderPieces();

}


/* =========================================
   HOME AREAS
========================================= */

function createHomeAreas() {

    const playerHome =
        document.createElement("div");

    playerHome.className =
        "home-area home-player";

    playerHome.innerHTML = `
        <span class="home-title">
            YOU
        </span>

        <div class="home-slot"></div>
        <div class="home-slot"></div>
        <div class="home-slot"></div>
        <div class="home-slot"></div>
    `;


    const computerHome =
        document.createElement("div");

    computerHome.className =
        "home-area home-computer";

    computerHome.innerHTML = `
        <span class="home-title">
            COMPUTER
        </span>

        <div class="home-slot"></div>
        <div class="home-slot"></div>
        <div class="home-slot"></div>
        <div class="home-slot"></div>
    `;


    board.appendChild(playerHome);

    board.appendChild(computerHome);

}


/* =========================================
   FIND VISUAL COORDINATE
========================================= */

function findCoordinateIndex(
    row,
    col
) {

    return routeCoordinates.findIndex(
        ([r, c]) =>
            r === row &&
            c === col
    );

}


/* =========================================
   RENDER PIECES
========================================= */

function renderPieces() {

    document
        .querySelectorAll(".piece")
        .forEach(
            piece => piece.remove()
        );


    state.player.pieces.forEach(
        (position, index) => {

            renderPiece(
                "player",
                index,
                position
            );

        }
    );


    state.computer.pieces.forEach(
        (position, index) => {

            renderPiece(
                "computer",
                index,
                position
            );

        }
    );

}


/* =========================================
   RENDER ONE PIECE
========================================= */

function renderPiece(
    owner,
    pieceIndex,
    position
) {

    const piece =
        document.createElement("button");

    piece.className =
        `piece ${
            owner === "player"
                ? "player-piece"
                : "computer-piece"
        }`;


    piece.textContent =
        pieceIndex + 1;


    piece.dataset.owner =
        owner;

    piece.dataset.piece =
        pieceIndex;


    if (
        owner === "player" &&
        state.selectablePieces.includes(
            pieceIndex
        )
    ) {

        piece.classList.add(
            "selectable"
        );

        piece.addEventListener(
            "click",
            () => choosePiece(pieceIndex)
        );

    }


    /*
     * Piece at home.
     */

    if (position === -1) {

        const slots =
            document.querySelectorAll(
                ".home-player .home-slot"
            );

        if (owner === "computer") {

            const aiSlots =
                document.querySelectorAll(
                    ".home-computer .home-slot"
                );

            positionPieceInHome(
                piece,
                aiSlots[pieceIndex]
            );

        } else {

            positionPieceInHome(
                piece,
                slots[pieceIndex]
            );

        }

        return;

    }


    /*
     * Finished piece.
     */

    if (
        position >= TRACK_LENGTH +
        HOME_LENGTH
    ) {

        piece.style.display =
            "none";

        return;

    }


    const coordinate =
        getPieceCoordinate(
            owner,
            position
        );


    if (!coordinate) {
        return;
    }


    const [
        row,
        col
    ] = coordinate;


    const cells =
        board.querySelectorAll(
            ".board-cell"
        );


    /*
     * Convert row/column into
     * visual grid index.
     */

    const cellIndex =
        row * 7 + col;


    const cell =
        cells[cellIndex];


    if (!cell) {
        return;
    }


    cell.appendChild(piece);

}


/* =========================================
   HOME PIECE POSITION
========================================= */

function positionPieceInHome(
    piece,
    slot
) {

    if (!slot) {
        return;
    }

    slot.appendChild(piece);

}


/* =========================================
   PIECE COORDINATE
========================================= */

function getPieceCoordinate(
    owner,
    position
) {

    /*
     * Main shared route.
     */

    if (
        position >= 0 &&
        position < TRACK_LENGTH
    ) {

        const index =
            owner === "player"
                ? position
                : (
                    position + 26
                ) % TRACK_LENGTH;


        return routeCoordinates[index];

    }


    /*
     * Home lane.

     * Home lane is visually represented
     * toward the center.
     */

    const homeStep =
        position - TRACK_LENGTH;


    if (homeStep >= 0) {

        if (owner === "player") {

            return [
                3,
                2 + Math.min(
                    homeStep,
                    2
                )
            ];

        }

        return [
            3,
            4 - Math.min(
                homeStep,
                2
            )
        ];

    }


    return null;

}


/* =========================================
   ROLL DICE
========================================= */

function rollDice() {

    return Math.floor(
        Math.random() * 6
    ) + 1;

}


/* =========================================
   DICE ANIMATION
========================================= */

function animateDice() {

    return new Promise(
        resolve => {

            dice.classList.remove(
                "rolling"
            );

            void dice.offsetWidth;

            dice.classList.add(
                "rolling"
            );


            let count = 0;


            const interval =
                setInterval(
                    () => {

                        dice.textContent =
                            rollDice();

                        count++;


                        if (count >= 7) {

                            clearInterval(
                                interval
                            );

                            const value =
                                rollDice();

                            dice.textContent =
                                value;

                            resolve(value);

                        }

                    },
                    80
                );

        }
    );

}


/* =========================================
   LEGAL MOVES
========================================= */

function getLegalMoves(
    owner,
    diceValue
) {

    const pieces =
        state[owner].pieces;


    const legal = [];


    pieces.forEach(
        (position, index) => {

            /*
             * Piece at home.
             */

            if (position === -1) {

                if (
                    diceValue === ENTRY_ROLL
                ) {

                    legal.push(index);

                }

                return;

            }


            /*
             * Already finished.
             */

            if (
                position >=
                TRACK_LENGTH +
                HOME_LENGTH
            ) {

                return;

            }


            const target =
                position + diceValue;


            /*
             * Cannot overshoot finish.
             */

            if (
                target <=
                TRACK_LENGTH +
                HOME_LENGTH
            ) {

                legal.push(index);

            }

        }
    );


    return legal;

}


/* =========================================
   PLAYER TURN
========================================= */

async function playerTurn() {

    if (
        state.turn !== "player" ||
        state.gameOver ||
        state.rolling
    ) {

        return;

    }


    state.rolling = true;

    rollButton.disabled = true;


    hideMovePanel();


    statusText.textContent =
        "Rolling...";


    const value =
        await animateDice();


    state.dice =
        value;


    statusText.textContent =
        `You rolled ${value}.`;


    const legal =
        getLegalMoves(
            "player",
            value
        );


    state.selectablePieces =
        legal;


    if (legal.length === 0) {

        statusText.textContent =
            "No legal move. Computer's turn.";


        await wait(700);


        switchToComputer();

        return;

    }


    showMovePanel(
        legal
    );


    state.rolling = false;

}


/* =========================================
   SHOW MOVE PANEL
========================================= */

function showMovePanel(
    legalMoves
) {

    movePanel.hidden = false;

    moveButtons.innerHTML = "";


    legalMoves.forEach(
        pieceIndex => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "move-piece-button";

            button.textContent =
                `Move Piece ${
                    pieceIndex + 1
                }`;


            button.addEventListener(
                "click",
                () =>
                    choosePiece(
                        pieceIndex
                    )
            );


            moveButtons.appendChild(
                button
            );

        }
    );


    renderPieces();

}


/* =========================================
   CHOOSE PLAYER PIECE
========================================= */

async function choosePiece(
    pieceIndex
) {

    if (
        !state.selectablePieces.includes(
            pieceIndex
        )
    ) {

        return;

    }


    state.selectablePieces = [];

    hideMovePanel();

    state.rolling = true;


    await movePiece(
        "player",
        pieceIndex,
        state.dice
    );


    if (
        checkWinner("player")
    ) {

        state.rolling = false;

        return;

    }


    state.rolling = false;

    switchToComputer();

}


/* =========================================
   SWITCH TO COMPUTER
========================================= */

function switchToComputer() {

    state.turn = "computer";

    state.selectablePieces = [];

    hideMovePanel();

    updateTurnUI();

    thinking.hidden = false;

    rollButton.disabled = true;


    setTimeout(
        computerTurn,
        900
    );

}


/* =========================================
   COMPUTER TURN
========================================= */

async function computerTurn() {

    if (state.gameOver) {
        return;
    }


    const value =
        await animateDice();


    state.dice =
        value;


    statusText.textContent =
        `Computer rolled ${value}.`;


    const legal =
        getLegalMoves(
            "computer",
            value
        );


    if (legal.length === 0) {

        await wait(700);

        thinking.hidden = true;

        switchToPlayer();

        return;

    }


    /*
     * REAL AI DECISION
     */

    const selectedPiece =
        chooseComputerMove(
            legal,
            value
        );


    await wait(
        state.difficulty === "hard"
            ? 950
            : 650
    );


    await movePiece(
        "computer",
        selectedPiece,
        value
    );


    if (
        checkWinner("computer")
    ) {

        return;

    }


    thinking.hidden = true;

    switchToPlayer();

}


/* =========================================
   AI DECISION MAKER
========================================= */

function chooseComputerMove(
    legalMoves,
    diceValue
) {

    const scoredMoves =
        legalMoves.map(
            pieceIndex => {

                const score =
                    evaluateMove(
                        "computer",
                        pieceIndex,
                        diceValue
                    );


                return {
                    pieceIndex,
                    score
                };

            }
        );


    scoredMoves.sort(
        (a, b) =>
            b.score - a.score
    );


    /*
     * EASY:
     * sometimes chooses randomly.
     */

    if (
        state.difficulty === "easy"
    ) {

        if (
            Math.random() < 0.55
        ) {

            return randomItem(
                legalMoves
            );

        }

    }


    /*
     * MEDIUM:
     * choose best move most of the time.
     */

    if (
        state.difficulty === "medium"
    ) {

        if (
            Math.random() < 0.2
        ) {

            return randomItem(
                legalMoves
            );

        }

    }


    /*
     * HARD:
     * highest evaluated move.
     */

    return scoredMoves[0].pieceIndex;

}


/* =========================================
   MOVE EVALUATION
========================================= */

function evaluateMove(
    owner,
    pieceIndex,
    diceValue
) {

    const position =
        state[owner].pieces[
            pieceIndex
        ];


    const target =
        position === -1
            ? 0
            : position + diceValue;


    let score = 0;


    /*
     * Entering the board.
     */

    if (
        position === -1 &&
        diceValue === ENTRY_ROLL
    ) {

        score += 35;

    }


    /*
     * Progress.
     */

    score += target * 1.4;


    /*
     * Finishing.
     */

    if (
        target >=
        TRACK_LENGTH +
        HOME_LENGTH
    ) {

        score += 100;

    }


    /*
     * Capture opponent.
     */

    const opponent =
        owner === "computer"
            ? "player"
            : "computer";


    const opponentPositions =
        state[opponent].pieces;


    if (
        target >= 0 &&
        target < TRACK_LENGTH
    ) {

        const capture =
            canCapture(
                owner,
                target
            );


        if (capture) {

            score += 50;

        }

    }


    /*
     * Safe-square bonus.
     */

    if (
        SAFE_SQUARES.includes(
            target %
            TRACK_LENGTH
        )
    ) {

        score += 15;

    }


    /*
     * Protect pieces that are
     * already advanced.
     */

    if (
        position > 20
    ) {

        score += 8;

    }


    return score;

}


/* =========================================
   MOVE PIECE
========================================= */

async function movePiece(
    owner,
    pieceIndex,
    diceValue
) {

    const pieces =
        state[owner].pieces;


    let position =
        pieces[pieceIndex];


    /*
     * Enter board.
     */

    if (
        position === -1
    ) {

        if (
            diceValue !== ENTRY_ROLL
        ) {

            return;

        }


        position = 0;

        pieces[pieceIndex] =
            position;

        renderPieces();

        await wait(350);

    } else {

        /*
         * Move one step at a time.
         */

        for (
            let step = 0;
            step < diceValue;
            step++
        ) {

            position++;

            pieces[pieceIndex] =
                position;

            renderPieces();

            await wait(110);

        }

    }


    /*
     * Capture.
     */

    if (
        position < TRACK_LENGTH
    ) {

        captureOpponent(
            owner,
            position
        );

    }


    updateScores();

}


/* =========================================
   CAPTURE
========================================= */

function captureOpponent(
    owner,
    position
) {

    /*
     * Safe squares cannot be captured.
     */

    if (
        SAFE_SQUARES.includes(
            position %
            TRACK_LENGTH
        )
    ) {

        return;

    }


    const opponent =
        owner === "player"
            ? "computer"
            : "player";


    const opponentPieces =
        state[opponent].pieces;


    opponentPieces.forEach(
        (opponentPosition, index) => {

            if (
                opponentPosition ===
                position
            ) {

                opponentPieces[index] =
                    -1;

            }

        }
    );


    renderPieces();

}


/* =========================================
   CAN CAPTURE
========================================= */

function canCapture(
    owner,
    position
) {

    if (
        SAFE_SQUARES.includes(
            position %
            TRACK_LENGTH
        )
    ) {

        return false;

    }


    const opponent =
        owner === "player"
            ? "computer"
            : "player";


    return state[opponent].pieces.some(
        piecePosition =>
            piecePosition === position
    );

}


/* =========================================
   WINNER
========================================= */

function checkWinner(
    owner
) {

    const finished =
        state[owner].pieces.filter(
            position =>
                position >=
                TRACK_LENGTH +
                HOME_LENGTH
        ).length;


    if (
        finished === PIECES_PER_PLAYER
    ) {

        state.gameOver = true;

        rollButton.disabled = true;

        thinking.hidden = true;

        showResult(owner);

        return true;

    }


    return false;

}


/* =========================================
   RESULT
========================================= */

function showResult(
    winner
) {

    if (winner === "player") {

        resultIcon.textContent =
            "🏆";

        resultTitle.textContent =
            "You Win!";

        resultMessage.textContent =
            "You successfully brought all four pieces home.";

    } else {

        resultIcon.textContent =
            "🤖";

        resultTitle.textContent =
            "Computer Wins";

        resultMessage.textContent =
            "The computer brought all four pieces home first.";

    }


    setTimeout(
        () => {
            resultModal.hidden = false;
        },
        400
    );

}


/* =========================================
   TURN UI
========================================= */

function updateTurnUI() {

    if (
        state.turn === "player"
    ) {

        turnLabel.textContent =
            "Your Turn";

        statusText.textContent =
            "Roll the dice.";

        rollButton.disabled =
            false;

    } else {

        turnLabel.textContent =
            "Computer's Turn";

        rollButton.disabled =
            true;

    }

}


/* =========================================
   SWITCH TO PLAYER
========================================= */

function switchToPlayer() {

    state.turn =
        "player";

    state.rolling =
        false;

    thinking.hidden =
        true;

    updateTurnUI();

}


/* =========================================
   UPDATE SCORES
========================================= */

function updateScores() {

    const playerFinished =
        state.player.pieces.filter(
            position =>
                position >=
                TRACK_LENGTH +
                HOME_LENGTH
        ).length;


    const computerFinished =
        state.computer.pieces.filter(
            position =>
                position >=
                TRACK_LENGTH +
                HOME_LENGTH
        ).length;


    playerScore.textContent =
        playerFinished;

    computerScore.textContent =
        computerFinished;


    playerOnBoard.textContent =
        PIECES_PER_PLAYER -
        playerFinished;


    computerOnBoard.textContent =
        PIECES_PER_PLAYER -
        computerFinished;

}


/* =========================================
   HIDE MOVE PANEL
========================================= */

function hideMovePanel() {

    movePanel.hidden =
        true;

    moveButtons.innerHTML =
        "";

}


/* =========================================
   RESTART
========================================= */

function restartGame() {

    state.player.pieces =
        [ -1, -1, -1, -1 ];

    state.computer.pieces =
        [ -1, -1, -1, -1 ];

    state.turn =
        "player";

    state.dice =
        1;

    state.gameOver =
        false;

    state.rolling =
        false;

    state.selectablePieces =
        [];


    resultModal.hidden =
        true;

    thinking.hidden =
        true;

    dice.textContent =
        "1";


    hideMovePanel();

    updateScores();

    updateTurnUI();

    renderPieces();

}


/* =========================================
   RULES
========================================= */

rulesButton.addEventListener(
    "click",
    () => {

        document
            .querySelector(".culture-section")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =========================================
   EVENTS
========================================= */

rollButton.addEventListener(
    "click",
    playerTurn
);


restartButton.addEventListener(
    "click",
    restartGame
);


playAgain.addEventListener(
    "click",
    restartGame
);


difficulty.addEventListener(
    "change",
    () => {

        state.difficulty =
            difficulty.value;

        restartGame();

    }
);


/* =========================================
   HELPERS
========================================= */

function wait(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


function randomItem(array) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


/* =========================================
   INITIALIZE
========================================= */

createBoard();

updateScores();

updateTurnUI();