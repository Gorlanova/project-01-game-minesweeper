// ================================
// - WEBPAGE "SPA" CONFIGURATION
// ================================
let homePage = document.getElementById("homePage");
let rulesPage = document.getElementById("rulesPage");
let aboutPage = document.getElementById("aboutPage");
let gamePage = document.getElementById("gamePage");

function show(section) {
    section.classList.remove("hidden")
};

function hide(section1, section2, section3) {
    section1.classList.add("hidden");
    section2.classList.add("hidden");
    section3.classList.add("hidden");
};

window.onload = () => {
    document.getElementById("homeLink").onclick = function () {
        show(homePage);
        hide(rulesPage, aboutPage, gamePage);
    };
    document.getElementById("rulesLink").onclick = function () {
        show(rulesPage);
        hide(homePage, aboutPage, gamePage);
    };
    document.getElementById("aboutLink").onclick = function () {
        show(aboutPage);
        hide(homePage, rulesPage, gamePage);
    };
    document.getElementById("gameEasyLink").onclick = function () {
        show(gamePage);
        hide(homePage, rulesPage, aboutPage);
        levelDisplay.innerHTML = "Difficulty : Easy";
        timerStat.innerHTML = `00'00"`;
        boardSize = [10, 10];
        minesAmount = 15;
        minesStat.innerHTML = minesAmount;
    };
    document.getElementById("gameMediumLink").onclick = function () {
        show(gamePage);
        hide(homePage, rulesPage, aboutPage);
        levelDisplay.innerHTML = "Difficulty : Medium";
        timerStat.innerHTML = `00'00"`;
        boardSize = [10, 10];
        minesAmount = 25;
        minesStat.innerHTML = minesAmount;

    };
    document.getElementById("gameHardLink").onclick = function () {
        show(gamePage);
        hide(homePage, rulesPage, aboutPage);
        levelDisplay.innerHTML = "Difficulty : Hard";
        timerStat.innerHTML = `00'00"`;
        boardSize = [10, 10];
        minesAmount = 35;
        minesStat.innerHTML = minesAmount;
    };
};

// ================
// - TO DO LIST
// ================
// Click = Check if mine + Reveal tile + Check if over
// Mine = GAME OVER
// Number = Continue (expand if Clear)
// WIN = POP UP (+noise +animation ?)
// LOSE = POP UP (+noise +animation ?)

// ================
// - VARIABLES
// ================
const levelDisplay = document.getElementById("levelChosen");
const button = document.getElementById("button");
const grid = document.getElementById("board");
const minesStat = document.getElementById("mines");
const timerStat = document.getElementById("timer");
const modalWin = document.getElementById("modalWin");
const modalLose = document.getElementById("modalLose");
const closeWin = document.getElementById("closeWin");
const closeLose = document.getElementById("closeLose");

let boardSize = [0, 0];
let minesAmount = 0;

let newGame = [];
let cellsCount = 0;
let unrevealed = 0;
let time = 0;
let timer = null;
let correctFlags = 0;


// ================
// - CREATE MAP
// ================
function createMap(array, n1, n2) {
    for (let i = 0; i < n1; i++) {
        array.push([]);
        for (let j = 0; j < n2; j++) {
            array[i].push(0);
            let cell = document.createElement('div');
            grid.appendChild(cell);
            cell.classList.add("cell", "cell-back");
            cell.setAttribute(`X`, `${i}`);
            cell.setAttribute(`Y`, `${j}`);
        };
    };
};

// ================
// - PLACE MINES
// ================
function placeMines(array, n) {
    let remaining = n;
    while (remaining !== 0) {
        let x = Math.floor(Math.random() * boardSize[0]);
        let y = Math.floor(Math.random() * boardSize[1]);
        if (array[x][y] === 0) {
            array[x][y] = 9;
            remaining -= 1;
        };
    };
};

// ================
// - CALCULATE NUMBER
// ================
function calcNumbers(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            let neighbours = [];
            if (array[i][j] !== 9) {
                if (array[i - 1]) {
                    array[i - 1][j - 1] && neighbours.push(array[i - 1][j - 1]);
                    array[i - 1][j] && neighbours.push(array[i - 1][j]);
                    array[i - 1][j + 1] && neighbours.push(array[i - 1][j + 1]);
                }
                array[i][j - 1] && neighbours.push(array[i][j - 1]);
                array[i][j + 1] && neighbours.push(array[i][j + 1]);
                if (array[i + 1]) {
                    array[i + 1][j - 1] && neighbours.push(array[i + 1][j - 1]);
                    array[i + 1][j] && neighbours.push(array[i + 1][j]);
                    array[i + 1][j + 1] && neighbours.push(array[i + 1][j + 1]);
                }
                let sum = neighbours.reduce(function (acc, neighbour) {
                    return acc + (neighbour === 9 ? 1 : 0);
                }, 0);
                array[i][j] = sum;
            };
        };
    };
};

// ================
// - COUNT CELLS
// ================
function countCells() {
    cellsCount = boardSize[0] * boardSize[1];
    unrevealed = cellsCount - minesAmount;
};

// ================
// - LAUNCH TIMER
// ================
function makeItTwo(number) {
    if (number > 9) return number.toString();
    else return `0${number.toString()}`;
};

function updateTimer() {
    time += 1;
    let min = Math.floor(time / 60);
    let minutes = makeItTwo(min);
    let min10 = minutes[0];
    let min01 = minutes[1];

    let sec = Math.floor(time % 60);
    let seconds = makeItTwo(sec);
    let sec10 = seconds[0];
    let sec01 = seconds[1];

    timerStat.innerHTML = `${min10}${min01}'${sec10}${sec01}"`;
};

function launchTimer() {
    timer = setInterval(updateTimer, 1000);
};

// ================
// - STOP TIMER
// ================
function stopTimer() {
    clearInterval(timer);
    timerStat.innerHTML = `00'00"`
    time = 0;
};

// ================
// - LAUNCH GAME
// ================
function launchGame() {
    createMap(newGame, boardSize[0], boardSize[1]);
    placeMines(newGame, minesAmount);
    calcNumbers(newGame);
    countCells();
    launchTimer();
};

// ================
// - RESET GAME
// ================
function resetGame() {
    newGame = [];
    cellsCount = 0;
    unrevealed = 0;
    correctFlags = 0;
    grid.innerHTML = '';
    stopTimer();
};

// ================
// - CHECK BUTTON
// ================
function checkButton() {
    if (button.classList == "game-button start-button") {
        launchGame();
        button.classList.remove("start-button");
        button.classList.add("reset-button");
    } else if (button.classList == "game-button reset-button") {
        resetGame();
        button.classList.remove("reset-button");
        button.classList.add("start-button");
    };
};

// ================
// - REVEAL MAP
// ================
function revealMap() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        findValue(cell);
    });
};

// ================
// - CHECK IF OVER
// ================
function checkOver(cell) {
    if (correctFlags === minesAmount) {
        endGame("WIN");
    } else if (unrevealed === 0) {
        endGame("WIN");
    } else if (cell.classList == "cell cell-9") {
        endGame("LOSE");
    };
};

// ================
// - REVEAL CELL
// ================
function findValue(cell) {
    let x = cell.getAttribute("x");
    let y = cell.getAttribute("y");
    cell.classList.remove("cell-back");
    cell.classList.add(`cell-${newGame[x][y]}`);
};

function revealCell(cell) {
    findValue(cell);
    unrevealed -= 1;
};

// ================
// - FLAG & MINE COUNT
// ================
function checkFlag(cell) {
    let x = cell.getAttribute("x");
    let y = cell.getAttribute("y");
    if (newGame[x][y] === 9) {
        correctFlags += 1;
    };
};

function flagCell(cell) {
    if (cell.classList == "cell cell-back") {
        cell.classList.remove("cell-back");
        cell.classList.add("cell-flag");
        minesStat.innerHTML -= 1;
        checkFlag(cell);
    } else if (cell.classList == "cell cell-flag") {
        cell.classList.remove("cell-flag");
        cell.classList.add("cell-back");
        minesStat.innerHTML = Number(minesStat.innerHTML) + 1;
    };
};

// ================
// - END GAME WIN / LOSE
// ================
function endGame(value) {
    if (value === "LOSE") {
        document.getElementById("audioLose").play();
        modalLose.classList.remove("hidden");
        revealMap();
        stopTimer();
    } else if (value === "WIN") {
        document.getElementById("audioWin").play();
        modalWin.classList.remove("hidden");
        revealMap();
        stopTimer();
    };
};

// ================
// - EVENTS
// ================
button.addEventListener('click', () => {
    checkButton();
});

closeWin.addEventListener('click', ()=>{
    modalWin.classList.add("hidden")
});

closeLose.addEventListener('click', ()=>{
    modalLose.classList.add("hidden")
});

board.addEventListener('click', (e) => {
    let cell = e.target;
    revealCell(cell);
    checkOver(cell);
});

board.addEventListener('contextmenu', (e) => {
    let cell = e.target;
    e.preventDefault();
    flagCell(cell);
    checkOver(cell);
});