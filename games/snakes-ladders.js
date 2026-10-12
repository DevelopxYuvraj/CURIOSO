/* =========================================
   CURIOS GAMES
   SNAKES & LADDERS ENGINE
========================================= */


/* =========================================
   BOARD DATA
========================================= */

const snakes = {
    99: 54,
    95: 72,
    92: 51,
    87: 24,
    64: 36,
    62: 19,
    56: 35,
    49: 11,
    47: 26,
    16: 6
};


const ladders = {
    2: 23,
    8: 34,
    20: 77,
    32: 68,
    41: 79,
    50: 91,
    71: 92,
    80: 99
};


/* =========================================
   GAME STATE
========================================= */

const state = {

    playerPosition: 0,

    computerPosition: 0,

    currentTurn: "player",

    gameOver: false,

    rolling: false,

    difficulty: "medium"

};


/* =========================================
   DOM
========================================= */

const board =
    document.getElementById("gameBoard");

const dice =
    document.getElementById("dice");

const rollButton =
    document.getElementById("rollButton");

const restartButton =
    document.getElementById("restartButton");

const howToPlayButton =
    document.getElementById("howToPlayButton");

const playAgainButton =
    document.getElementById("playAgainButton");

const difficultySelect =
    document.getElementById("difficultySelect");

const playerPosition =
    document.getElementById("playerPosition");

const computerPosition =
    document.getElementById("computerPosition");

const turnMessage =
    document.getElementById("turnMessage");

const diceMessage =
    document.getElementById("diceMessage");

const thinkingBox =
    document.getElementById("thinkingBox");

const resultModal =
    document.getElementById("resultModal");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const resultIcon =
    document.getElementById("resultIcon");


/* =========================================
   CREATE BOARD
========================================= */

function createBoard() {

    board.innerHTML = "";


    /*
     * Board is rendered from 100 down to 1
     * and every alternate row is reversed.
     */

    for (let row = 9; row >= 0; row--) {

        const start =
            row * 10 + 1;

        const end =
            start + 9;


        const numbers = [];

        for (
            let number = start;
            number <= end;
            number++
        ) {
            numbers.push(number);
        }


        if ((9 - row) % 2 === 1) {
            numbers.reverse();
        }


        numbers.forEach((number) => {

            const cell =
                document.createElement("div");

            cell.className = "board-cell";

            cell.dataset.position = number;


            const numberLabel =
                document.createElement("span");

            numberLabel.className =
                "cell-number";

            numberLabel.textContent =
                number;


            cell.appendChild(numberLabel);


            /*
             * Show snakes and ladders.
             */

            if (ladders[number]) {

                const special =
                    document.createElement("span");

                special.className =
                    "cell-special";

                special.textContent = "🪜";

                cell.appendChild(special);

            }


            if (snakes[number]) {

                const special =
                    document.createElement("span");

                special.className =
                    "cell-special";

                special.textContent = "🐍";

                cell.appendChild(special);

            }


            board.appendChild(cell);

        });

    }


    renderTokens();
}


/* =========================================
   RENDER TOKENS
========================================= */

function renderTokens() {

    document
        .querySelectorAll(".token")
        .forEach((token) => token.remove());


    if (state.playerPosition > 0) {

        addToken(
            state.playerPosition,
            "player-token",
            "YOU"
        );

    }


    if (state.computerPosition > 0) {

        addToken(
            state.computerPosition,
            "computer-token",
            "AI"
        );

    }

}


/* =========================================
   ADD TOKEN
========================================= */

function addToken(
    position,
    className,
    text
) {

    const cell =
        board.querySelector(
            `[data-position="${position}"]`
        );


    if (!cell) {
        return;
    }


    const token =
        document.createElement("div");

    token.className =
        `token ${className}`;

    token.textContent = text;


    cell.appendChild(token);
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
   ANIMATE DICE
========================================= */

function animateDice() {

    return new Promise((resolve) => {

        dice.classList.remove("rolling");

        void dice.offsetWidth;

        dice.classList.add("rolling");


        let animationCount = 0;


        const interval =
            setInterval(() => {

                dice.textContent =
                    rollDice();

                animationCount++;


                if (animationCount >= 7) {

                    clearInterval(interval);

                    const finalValue =
                        rollDice();

                    dice.textContent =
                        finalValue;

                    resolve(finalValue);

                }

            }, 80);

    });

}


/* =========================================
   PLAYER TURN
========================================= */

async function playerTurn() {

    if (
        state.gameOver ||
        state.rolling ||
        state.currentTurn !== "player"
    ) {
        return;
    }


    state.rolling = true;

    rollButton.disabled = true;

    diceMessage.textContent =
        "Rolling...";


    const value =
        await animateDice();


    diceMessage.textContent =
        `You rolled ${value}.`;


    await movePlayer(value);


    state.rolling = false;


    if (state.gameOver) {
        return;
    }


    state.currentTurn =
        "computer";


    updateTurn();


    setTimeout(
        computerTurn,
        850
    );

}


/* =========================================
   COMPUTER TURN
========================================= */

async function computerTurn() {

    if (state.gameOver) {
        return;
    }


    thinkingBox.hidden = false;

    rollButton.disabled = true;

    turnMessage.textContent =
        "Computer's turn";


    await wait(
        getThinkingTime()
    );


    const value =
        await animateDice();


    diceMessage.textContent =
        `Computer rolled ${value}.`;


    await moveComputer(value);


    thinkingBox.hidden = true;


    if (state.gameOver) {
        return;
    }


    state.currentTurn =
        "player";


    updateTurn();

}


/* =========================================
   THINKING TIME
========================================= */

function getThinkingTime() {

    if (
        state.difficulty === "easy"
    ) {
        return 500;
    }

    if (
        state.difficulty === "hard"
    ) {
        return 1100;
    }

    return 800;

}


/* =========================================
   PLAYER MOVE
========================================= */

async function movePlayer(value) {

    const target =
        calculateTarget(
            state.playerPosition,
            value
        );


    await moveToken(
        "player",
        target
    );


    updateScores();


    if (state.playerPosition === 100) {

        endGame("player");

        return;

    }


    /*
     * Landing on a ladder or snake.
     */

    const special =
        getSpecialPosition(
            state.playerPosition
        );


    if (special) {

        await wait(450);


        await moveToken(
            "player",
            special
        );


        updateScores();


        if (
            state.playerPosition === 100
        ) {

            endGame("player");

        }

    }

}


/* =========================================
   COMPUTER MOVE
========================================= */

async function moveComputer(value) {

    const target =
        calculateComputerTarget(
            value
        );


    await moveToken(
        "computer",
        target
    );


    updateScores();


    if (
        state.computerPosition === 100
    ) {

        endGame("computer");

        return;

    }


    const special =
        getSpecialPosition(
            state.computerPosition
        );


    if (special) {

        await wait(450);


        await moveToken(
            "computer",
            special
        );


        updateScores();


        if (
            state.computerPosition === 100
        ) {

            endGame("computer");

        }

    }

}


/* =========================================
   CALCULATE TARGET
========================================= */

function calculateTarget(
    position,
    diceValue
) {

    const target =
        position + diceValue;


    if (target > 100) {
        return position;
    }


    return target;

}


/* =========================================
   COMPUTER TARGET
========================================= */

function calculateComputerTarget(
    diceValue
) {

    const current =
        state.computerPosition;


    const normalTarget =
        calculateTarget(
            current,
            diceValue
        );


    /*
     * The AI uses the same legal movement
     * rules as the player.
     *
     * Difficulty changes how it evaluates
     * the result.
     */

    if (
        state.difficulty === "easy"
    ) {

        return normalTarget;

    }


    /*
     * Medium:
     * normal move is used, but the AI
     * prioritizes a ladder if one is
     * available after the dice roll.
     */

    if (
        state.difficulty === "medium"
    ) {

        if (
            ladders[normalTarget]
        ) {
            return ladders[normalTarget];
        }

        return normalTarget;

    }


    /*
     * Hard:
     * prioritize ladders and avoid
     * obvious snake destinations where
     * the rules allow a choice.
     *
     * In this game the dice determines
     * the movement, so strategy is limited.
     */

    if (
        state.difficulty === "hard"
    ) {

        if (
            ladders[normalTarget]
        ) {
            return ladders[normalTarget];
        }

        return normalTarget;

    }


    return normalTarget;

}


/* =========================================
   SPECIAL POSITION
========================================= */

function getSpecialPosition(
    position
) {

    if (ladders[position]) {
        return ladders[position];
    }


    if (snakes[position]) {
        return snakes[position];
    }


    return null;

}


/* =========================================
   MOVE TOKEN
========================================= */

async function moveToken(
    player,
    target
) {

    const start =
        player === "player"
            ? state.playerPosition
            : state.computerPosition;


    /*
     * Move one square at a time.
     */

    if (target === start) {

        renderTokens();

        return;

    }


    const direction =
        target > start
            ? 1
            : -1;


    let current = start;


    while (
        current !== target
    ) {

        current += direction;


        if (player === "player") {

            state.playerPosition =
                current;

        } else {

            state.computerPosition =
                current;

        }


        renderTokens();

        updateScores();


        await wait(90);

    }

}


/* =========================================
   UPDATE SCORES
========================================= */

function updateScores() {

    playerPosition.textContent =
        state.playerPosition;

    computerPosition.textContent =
        state.computerPosition;

}


/* =========================================
   UPDATE TURN
========================================= */

function updateTurn() {

    if (
        state.currentTurn === "player"
    ) {

        turnMessage.textContent =
            "Your turn";

        rollButton.disabled =
            false;

        diceMessage.textContent =
            "Roll the dice.";

    } else {

        turnMessage.textContent =
            "Computer's turn";

        rollButton.disabled =
            true;

    }

}


/* =========================================
   END GAME
========================================= */

function endGame(winner) {

    state.gameOver = true;

    rollButton.disabled = true;


    if (winner === "player") {

        resultIcon.textContent = "🏆";

        resultTitle.textContent =
            "You Win!";

        resultText.textContent =
            `You reached square 100 before the computer.`;

    } else {

        resultIcon.textContent = "🤖";

        resultTitle.textContent =
            "Computer Wins";

        resultText.textContent =
            `The computer reached square 100 first.`;

    }


    setTimeout(() => {

        resultModal.hidden = false;

    }, 500);

}


/* =========================================
   RESTART
========================================= */

function restartGame() {

    state.playerPosition = 0;

    state.computerPosition = 0;

    state.currentTurn = "player";

    state.gameOver = false;

    state.rolling = false;


    resultModal.hidden = true;

    thinkingBox.hidden = true;


    dice.textContent = "1";

    diceMessage.textContent =
        "Roll the dice to begin.";


    updateScores();

    updateTurn();

    renderTokens();

}


/* =========================================
   DIFFICULTY
========================================= */

difficultySelect.addEventListener(
    "change",
    () => {

        state.difficulty =
            difficultySelect.value;

        restartGame();

    }
);


/* =========================================
   HOW TO PLAY
========================================= */

howToPlayButton.addEventListener(
    "click",
    () => {

        document
            .querySelector(".information-section")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =========================================
   BUTTON EVENTS
========================================= */

rollButton.addEventListener(
    "click",
    playerTurn
);


restartButton.addEventListener(
    "click",
    restartGame
);


playAgainButton.addEventListener(
    "click",
    restartGame
);


/* =========================================
   UTILITY
========================================= */

function wait(milliseconds) {

    return new Promise(
        (resolve) =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


/* =========================================
   INITIALIZE
========================================= */

createBoard();

updateScores();

updateTurn();
