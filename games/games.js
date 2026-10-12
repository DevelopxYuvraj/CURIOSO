/* =========================================
   CURIOS GAMES
   Game Hub Logic
========================================= */


/* =========================================
   GAME DATA
========================================= */

const games = [

    {
        id: "pachisi",
        name: "Pachisi / Chaupar",
        icon: "🎲",
        category: ["strategy", "board"],
        categoryLabel: "Strategy • Board",
        difficulty: "Medium",
        mode: "🤖 vs Computer",
        description:
            "A traditional Indian strategy board-game experience reimagined for digital play."
    },

    {
        id: "snakes-ladders",
        name: "Snakes & Ladders",
        icon: "🐍",
        category: ["board", "strategy"],
        categoryLabel: "Board • Strategy",
        difficulty: "Easy",
        mode: "🤖 vs Computer",
        description:
            "Race across the board, climb ladders, avoid snakes and reach the finish first."
    },

    {
        id: "pallanguzhi",
        name: "Pallanguzhi",
        icon: "🟤",
        category: ["puzzle", "strategy"],
        categoryLabel: "Puzzle • Strategy",
        difficulty: "Medium",
        mode: "🤖 vs Computer",
        description:
            "A traditional seed-and-pit strategy game transformed into an interactive challenge."
    },

    {
        id: "five-stones",
        name: "Five Stones / Gutte",
        icon: "🪨",
        category: ["skill", "puzzle"],
        categoryLabel: "Skill • Puzzle",
        difficulty: "Hard",
        mode: "🤖 vs Computer",
        description:
            "Test timing, accuracy and coordination in a digital skill challenge inspired by Gutte."
    },

    {
        id: "ashta-chamma",
        name: "Ashta Chamma",
        icon: "🧩",
        category: ["strategy", "board"],
        categoryLabel: "Strategy • Board",
        difficulty: "Medium",
        mode: "🤖 vs Computer",
        description:
            "Navigate the board, make strategic moves and challenge a computer opponent."
    },

    {
        id: "chowka-bhara",
        name: "Chowka Bhara",
        icon: "🪙",
        category: ["strategy", "board"],
        categoryLabel: "Strategy • Board",
        difficulty: "Medium",
        mode: "🤖 vs Computer",
        description:
            "Experience a traditional Indian board-game format through strategic digital play."
    },

    {
        id: "patang",
        name: "Patang",
        icon: "🪁",
        category: ["skill", "reflex"],
        categoryLabel: "Skill • Reflex",
        difficulty: "Hard",
        mode: "🤖 vs Computer",
        description:
            "Control your kite, react to changing wind and compete in a fast-paced challenge."
    },

{
    id: "kancha",
    name: "Kancha",
    icon: "🟤",
    category: ["aim", "skill"],
    categoryLabel: "Aim • Skill",
    difficulty: "Medium",
    mode: "🤖 vs Computer",
    description:
        "Aim carefully, control your shot and knock target marbles out of the circle."
},

];


/* =========================================
   DOM ELEMENTS
========================================= */

const gamesGrid =
    document.getElementById("gamesGrid");

const gameSearch =
    document.getElementById("gameSearch");

const categoryFilters =
    document.getElementById("categoryFilters");

const noResults =
    document.getElementById("noResults");

const exploreGamesButton =
    document.getElementById("exploreGamesButton");


/* =========================================
   CURRENT FILTER STATE
========================================= */

let activeCategory = "all";

let searchTerm = "";


/* =========================================
   RENDER GAME CARDS
========================================= */

function renderGames() {

    const filteredGames =
        games.filter((game) => {

            const matchesCategory =
                activeCategory === "all" ||
                game.category.includes(
                    activeCategory
                );


            const searchText =
                `${game.name} ${game.categoryLabel} ${game.description}`
                    .toLowerCase();


            const matchesSearch =
                searchText.includes(
                    searchTerm.toLowerCase()
                );


            return (
                matchesCategory &&
                matchesSearch
            );

        });


    gamesGrid.innerHTML = "";


    if (filteredGames.length === 0) {

        noResults.hidden = false;

        return;
    }


    noResults.hidden = true;


    filteredGames.forEach((game) => {

        const card =
            createGameCard(game);

        gamesGrid.appendChild(card);

    });

}


/* =========================================
   CREATE GAME CARD
========================================= */

function createGameCard(game) {

    const article =
        document.createElement("article");


    article.className =
        "game-card";


    article.innerHTML = `

       <div class="game-card-image">

    <img
        src="images/${game.id}.jpg"
        alt="${game.name}"
        class="game-card-img"
    >

    <div class="game-icon">
        ${game.icon}
    </div>

    <span class="game-difficulty">
        ${game.difficulty}
    </span>

</div>


        <div class="game-card-body">

            <span class="game-card-category">
                ${game.categoryLabel}
            </span>

            <h3>
                ${game.name}
            </h3>

            <p class="game-card-description">
                ${game.description}
            </p>


            <div class="game-card-info">

                <span class="game-mode">
                    ${game.mode}
                </span>


                <button
                    class="game-play"
                    type="button"
                    data-game="${game.id}"
                >
                    Play Now →
                </button>

            </div>

        </div>

    `;


    return article;

}


/* =========================================
   CATEGORY FILTER
========================================= */

categoryFilters.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                ".filter-button"
            );


        if (!button) {
            return;
        }


        document
            .querySelectorAll(
                ".filter-button"
            )
            .forEach((item) => {

                item.classList.remove(
                    "active"
                );

            });


        button.classList.add(
            "active"
        );


        activeCategory =
            button.dataset.category;


        renderGames();

    }
);


/* =========================================
   SEARCH
========================================= */

gameSearch.addEventListener(
    "input",
    (event) => {

        searchTerm =
            event.target.value.trim();


        renderGames();

    }
);


/* =========================================
   EXPLORE BUTTON
========================================= */

exploreGamesButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("games")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =========================================
   GAME BUTTONS
========================================= */

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                "[data-game]"
            );


        if (!button) {
            return;
        }


        const gameId =
            button.dataset.game;


        handleGameSelection(
            gameId
        );

    }
);


/* =========================================
   GAME SELECTION
========================================= */

function handleGameSelection(
    gameId
) {

    const selectedGame =
        games.find(
            (game) =>
                game.id === gameId
        );


    if (!selectedGame) {
        return;
    }


    /*
     * Individual game routes.
     *
     * games.js is already inside
     * the /games/ folder, therefore
     * these paths are relative.
     */

const gameRoutes = {
    "pachisi": "pachisi.html",
    "snakes-ladders": "snakes-ladders.html",
    "pallanguzhi": "pallanguzhi.html",
    "five-stones": "five-stones.html",
    "ashta-chamma": "ashta-chamma.html",
    "chowka-bhara": "chowka-bhara.html",
    "patang": "patang.html",
    "kancha": "kancha.html"
};


    const selectedRoute =
        gameRoutes[gameId];


    /*
     * If the game has a real page,
     * open that page.
     */

    if (selectedRoute) {

        window.location.href =
            selectedRoute;

        return;
    }


    /*
     * Games whose engines are
     * not built yet.
     */

    alert(
        `${selectedGame.name}\n\n` +
        `This game is coming next in CURIOS GAMES.\n\n` +
        `CURIOS GAMES → ${selectedGame.categoryLabel}`
    );

}


/* =========================================
   INITIALIZE
========================================= */

renderGames();