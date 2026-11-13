
// SEARCH GAMES

const search = document.getElementById("search");
const cards = document.querySelectorAll(".game-card");

search.addEventListener("input", () => {
    const value = search.value.toLowerCase();

    cards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        card.style.display = name.includes(value) ? "block" : "none";
    });

    checkResults();
});


// FILTER GAMES

function filterGames(category, button) {

    document.querySelectorAll(".category").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    cards.forEach(card => {
        card.style.display =
            category === "all" ||
            card.dataset.category === category
            ? "block" : "none";
    });

    search.value = "";
    checkResults();
}

function checkResults() {
    const visible = [...cards].some(card => card.style.display !== "none");

    document.getElementById("noResults").style.display =
        visible ? "none" : "block";
}


// GAME MODAL

function openGame(title, content) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("gameArea").innerHTML = content;
    document.getElementById("gameModal").style.display = "flex";
}

function closeGame() {
    document.getElementById("gameModal").style.display = "none";
    document.getElementById("gameArea").innerHTML = "";
}

document.getElementById("gameModal").addEventListener("click", e => {
    if (e.target.id === "gameModal") closeGame();
});


// SELECT GAME

function playGame(game) {

    if (game === "click") clickGame();
    if (game === "memory") memoryGame();
    if (game === "number") numberGame();
    if (game === "tic") ticGame();
    if (game === "penalty") penaltyGame();
    if (game === "reaction") reactionGame();

}


// 1. CLICK CHALLENGE

function clickGame() {

    let score = 0;
    let time = 10;
    let active = true;

    openGame("🎯 CLICK CHALLENGE", `
        <h3>Click as fast as you can!</h3>
        <h2 id="clickScore">Score: 0</h2>
        <h3 id="clickTime">Time: 10</h3>
        <button class="game-button" id="clickButton">CLICK ME!</button>
        <p id="clickResult"></p>
    `);

    document.getElementById("clickButton").onclick = () => {
        if (!active) return;

        score++;
        document.getElementById("clickScore").innerText = "Score: " + score;
    };

    const timer = setInterval(() => {

        if (!document.getElementById("clickTime")) {
            clearInterval(timer);
            return;
        }

        time--;

        document.getElementById("clickTime").innerText = "Time: " + time;

        if (time <= 0) {
            active = false;
            clearInterval(timer);

            document.getElementById("clickResult").innerText =
                "🏆 Your final score: " + score;
        }

    }, 1000);
}


// 2. MEMORY GAME

function memoryGame() {

    let icons = ["🍎","🍌","🍇","🍓","🍎","🍌","🍇","🍓"];

    icons.sort(() => Math.random() - 0.5);

    let first = null;
    let locked = false;
    let matches = 0;

    openGame("🧠 MEMORY GAME", `
        <p>Find all matching pairs!</p>
        <div class="memory-grid" id="memoryGrid"></div>
        <h3 id="memoryScore">Matches: 0 / 4</h3>
    `);

    const grid = document.getElementById("memoryGrid");

    icons.forEach(icon => {

        const btn = document.createElement("button");
        btn.innerText = "?";

        btn.onclick = () => {

            if (locked || btn.innerText !== "?") return;

            btn.innerText = icon;

            if (!first) {
                first = { btn, icon };
                return;
            }

            locked = true;

            if (first.icon === icon) {

                matches++;
                first = null;
                locked = false;

                document.getElementById("memoryScore").innerText =
                    "Matches: " + matches + " / 4";

                if (matches === 4) {
                    document.getElementById("memoryScore").innerText =
                        "🏆 YOU WON!";
                }

            } else {

                let previous = first.btn;
                first = null;

                setTimeout(() => {
                    if (!document.getElementById("memoryGrid")) return;

                    previous.innerText = "?";
                    btn.innerText = "?";
                    locked = false;
                }, 700);

            }
        };

        grid.appendChild(btn);

    });
}


// 3. NUMBER GUESS

function numberGame() {

    const answer = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    openGame("🔢 NUMBER GUESS", `
        <p>Guess a number between 1 and 100!</p>
        <input type="number" id="guessInput" placeholder="Your number" min="1" max="100">
        <button class="game-button" onclick="checkNumber()">GUESS</button>
        <h3 id="guessResult">Good luck!</h3>
        <p id="attempts">Attempts: 0</p>
    `);

    window.checkNumber = () => {

        const value = Number(document.getElementById("guessInput").value);
        const result = document.getElementById("guessResult");

        if (!Number.isInteger(value) || value < 1 || value > 100) {
            result.innerText = "Enter a number from 1 to 100!";
            return;
        }

        attempts++;

        document.getElementById("attempts").innerText =
            "Attempts: " + attempts;

        if (value < answer) result.innerText = "⬆ Too low!";
        else if (value > answer) result.innerText = "⬇ Too high!";
        else result.innerText = "🏆 CORRECT! You won!";
    };
}


// 4. TIC TAC TOE

function ticGame() {

    let board = ["","","","","","","","",""];
    let player = "X";
    let finished = false;

    const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    openGame("❌ TIC TAC TOE", `
        <h3 id="ticStatus">Player X turn</h3>
        <div class="tic-grid" id="ticGrid"></div>
        <button class="game-button" onclick="ticGame()">RESTART</button>
    `);

    const grid = document.getElementById("ticGrid");

    board.forEach((_, i) => {

        const cell = document.createElement("button");

        cell.onclick = () => {

            if (board[i] || finished) return;

            board[i] = player;
            cell.innerText = player;

            if (wins.some(line => line.every(n => board[n] === player))) {

                document.getElementById("ticStatus").innerText =
                    "🏆 Player " + player + " wins!";

                finished = true;
                return;
            }

            if (board.every(Boolean)) {
                document.getElementById("ticStatus").innerText = "DRAW!";
                finished = true;
                return;
            }

            player = player === "X" ? "O" : "X";

            document.getElementById("ticStatus").innerText =
                "Player " + player + " turn";
        };

        grid.appendChild(cell);

    });
}


// 5. PENALTY SHOOTOUT

function penaltyGame() {

    let score = 0;
    let shots = 0;

    openGame("⚽ PENALTY SHOOTOUT", `
        <h3>Choose where to shoot!</h3>
        <div class="shoot-options">
            <button class="game-button" onclick="shoot('Left')">⬅ LEFT</button>
            <button class="game-button" onclick="shoot('Center')">⬆ CENTER</button>
            <button class="game-button" onclick="shoot('Right')">RIGHT ➡</button>
        </div>
        <h3 id="shootResult">Goals: 0 / 5</h3>
        <p id="shootMessage">Take your shot!</p>
    `);

    window.shoot = (direction) => {

        if (shots >= 5) return;

        shots++;

        const goalkeeper = ["Left", "Center", "Right"][
            Math.floor(Math.random() * 3)
        ];

        const result = document.getElementById("shootMessage");

        if (direction !== goalkeeper) {
            score++;
            result.innerText = "⚽ GOAL!";
        } else {
            result.innerText = "🧤 SAVED!";
        }

        document.getElementById("shootResult").innerText =
            "Goals: " + score + " / 5";

        if (shots === 5) {
            result.innerText += " Final score: " + score;
        }
    };
}


// 6. REACTION TEST

function reactionGame() {

    let startTime;
    let timeout;
    let state = "waiting";

    openGame("⚡ REACTION TEST", `
        <p>Wait until the screen turns green, then click!</p>
        <button id="reactionButton" class="game-button">
            START TEST
        </button>
        <h3 id="reactionResult">Ready?</h3>
    `);

    const btn = document.getElementById("reactionButton");
    const result = document.getElementById("reactionResult");

    btn.onclick = () => {

        if (state === "waiting") {

            state = "started";
            btn.innerText = "WAIT...";

            timeout = setTimeout(() => {

                if (!document.getElementById("reactionButton")) return;

                state = "ready";
                startTime = performance.now();

                btn.style.background = "#16a34a";
                btn.innerText = "CLICK NOW!";
                result.innerText = "GO!";

            }, 1500 + Math.random() * 3000);

        } else if (state === "started") {

            clearTimeout(timeout);
            state = "finished";
            result.innerText = "Too early! Try again.";

        } else if (state === "ready") {

            const reaction = Math.round(performance.now() - startTime);

            state = "finished";
            result.innerText = "Your reaction: " + reaction + " ms";

        } else {

            reactionGame();

        }
    };
}


// LOGIN / REGISTER DEMO

function showAccount(type) {

    openGame(type.toUpperCase(), `
        <form onsubmit="accountDemo(event)">
            <input type="text" placeholder="Username" required>
            <br>
            <input type="email" placeholder="Email" required>
            <br>
            <input type="password" placeholder="Password" required>
            <br>
            <button class="game-button" type="submit">${type}</button>
        </form>
        <p id="accountMessage"></p>
    `);
}

function accountDemo(event) {
    event.preventDefault();

    document.getElementById("accountMessage").innerText =
        "Demo only! Backend authentication is not connected yet.";
}
