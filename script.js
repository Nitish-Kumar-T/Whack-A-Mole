const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const timeLeftElement = document.getElementById('time-left');
const highScoreElement = document.getElementById('high-score');
const levelElement = document.getElementById('level');
const startButton = document.getElementById('start-button');
const difficultySelect = document.getElementById('difficulty');
const freezeTimeButton = document.getElementById('freeze-time');
const doublePointsButton = document.getElementById('double-points');
const multiWhackButton = document.getElementById('multi-whack');
const moleVisionButton = document.getElementById('mole-vision');
const tutorialModal = document.getElementById('tutorial-modal');
const closeTutorialButton = document.getElementById('close-tutorial');
const levelUpModal = document.getElementById('level-up-modal');
const newLevelElement = document.getElementById('new-level');
const continueGameButton = document.getElementById('continue-game');

let score = 0;
let timeLeft = 60;
let highScore = 0;
let level = 1;
let gameInterval;
let countdownInterval;
let moleInterval;
let currentMole;
let isFreezePowerUpActive = false;
let isDoublePointsPowerUpActive = false;
let isMoleVisionActive = false;
let multiWhackCount = 0;

const difficulties = {
    easy: { interval: 1500, duration: 1200, moleTypes: ['normal', 'golden'] },
    medium: { interval: 1200, duration: 1000, moleTypes: ['normal', 'golden', 'ninja'] },
    hard: { interval: 1000, duration: 800, moleTypes: ['normal', 'golden', 'ninja', 'bomb'] },
    extreme: { interval: 800, duration: 600, moleTypes: ['normal', 'golden', 'ninja', 'bomb'] }
};

function createGameBoard() {
    gameContainer.innerHTML = '';
    const holeCount = 16;
    for (let i = 0; i < holeCount; i++) {
        const hole = document.createElement('div');
        hole.classList.add('hole');
        const mole = document.createElement('div');
        mole.classList.add('mole');
        hole.appendChild(mole);
        gameContainer.appendChild(hole);
    }
}

function startGame() {
    createGameBoard();
    score = 0;
    timeLeft = 60;
    level = 1;
    updateScore();
    updateLevel();
    timeLeftElement.textContent = timeLeft;
    startButton.disabled = true;
    difficultySelect.disabled = true;
    enablePowerUps();

    const difficulty = getDifficultySettings();
    gameInterval = setInterval(showRandomMole, difficulty.interval);
    countdownInterval = setInterval(updateCountdown, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    clearInterval(moleInterval);
    startButton.disabled = false;
    difficultySelect.disabled = false;
    disablePowerUps();
    if (currentMole) {
        currentMole.classList.remove('visible', 'normal', 'golden', 'ninja', 'bomb');
    }
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('highScore', highScore);
    }
    alert(`Game Over! Your score: ${score}`);
}

function showRandomMole() {
    if (currentMole) {
        currentMole.classList.remove('visible', 'normal', 'golden', 'ninja', 'bomb');
    }
    const moles = document.querySelectorAll('.mole');
    const randomIndex = Math.floor(Math.random() * moles.length);
    currentMole = moles[randomIndex];
    currentMole.classList.add('visible');

    const difficulty = getDifficultySettings();
    const moleType = difficulty.moleTypes[Math.floor(Math.random() * difficulty.moleTypes.length)];
    currentMole.classList.add(moleType);

    if (isMoleVisionActive) {
        currentMole.style.transition = 'top 1s';
    } else {
        currentMole.style.transition = 'top 0.1s';
    }

    clearInterval(moleInterval);
    moleInterval = setInterval(() => {
        if (currentMole) {
            currentMole.classList.remove('visible', 'normal', 'golden', 'ninja', 'bomb');
            currentMole = null;
        }
    }, difficulty.duration);
}

function updateCountdown() {
    if (!isFreezePowerUpActive) {
        timeLeft--;
    }
    timeLeftElement.textContent = timeLeft;
    if (timeLeft === 0) {
        endGame();
    }
}

function updateScore() {
    scoreElement.textContent = score;
    checkLevelUp();
}

function updateLevel() {
    levelElement.textContent = level;
}

function checkLevelUp() {
    if (score >= level * 50) {
        level++;
        updateLevel();
        showLevelUpModal();
    }
}

function showLevelUpModal() {
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    newLevelElement.textContent = level;
    levelUpModal.style.display = 'block';
}


function getDifficultySettings() {
    return difficulties[difficultySelect.value];
}

function enablePowerUps() {
    freezeTimeButton.disabled = false;
    doublePointsButton.disabled = false;
    multiWhackButton.disabled = false;
    moleVisionButton.disabled = false;
}

function disablePowerUps() {
    freezeTimeButton.disabled = true;
    doublePointsButton.disabled = true;
    multiWhackButton.disabled = true;
    moleVisionButton.disabled = true;
}

function activateFreezeTime() {
    isFreezePowerUpActive = true;
    freezeTimeButton.disabled = true;
    setTimeout(() => {
        isFreezePowerUpActive = false;
    }, 5000);
}

function activateDoublePoints() {
    isDoublePointsPowerUpActive = true;
    doublePointsButton.disabled = true;
    setTimeout(() => {
        isDoublePointsPowerUpActive = false;
    }, 10000);
}

function activateMultiWhack() {
    multiWhackCount = 3;
    multiWhackButton.disabled = true;
}

function activateMoleVision() {
    isMoleVisionActive = true;
    moleVisionButton.disabled = true;
    setTimeout(() => {
        isMoleVisionActive = false;
    }, 5000);
}

function whackMole(event) {
    if (!event.target.classList.contains('visible')) return;

    const moleType = event.target.classList.contains('golden') ? 'golden' :
                     event.target.classList.contains('ninja') ? 'ninja' :
                     event.target.classList.contains('bomb') ? 'bomb' : 'normal';

    let points = 0;
    switch (moleType) {
        case 'golden':
            points = 5;
            break;
        case 'ninja':
            points = 10;
            break;
        case 'bomb':
            points = -10;
            break;
        default:
            points = 1;
    }

    if (isDoublePointsPowerUpActive) {
        points *= 2;
    }

    score += points;
    updateScore();

    event.target.classList.remove('visible', 'normal', 'golden', 'ninja', 'bomb');
    
    if (multiWhackCount > 0) {
        multiWhackCount--;
        setTimeout(showRandomMole, 100);
    }
}

function continueGame() {
    levelUpModal.style.display = 'none';
    const difficulty = getDifficultySettings();
    gameInterval = setInterval(showRandomMole, difficulty.interval);
    countdownInterval = setInterval(updateCountdown, 1000);
}

function showTutorial() {
    tutorialModal.style.display = 'block';
}

function closeTutorial() {
    tutorialModal.style.display = 'none';
}

startButton.addEventListener('click', startGame);
gameContainer.addEventListener('click', whackMole);
freezeTimeButton.addEventListener('click', activateFreezeTime);
doublePointsButton.addEventListener('click', activateDoublePoints);
multiWhackButton.addEventListener('click', activateMultiWhack);
moleVisionButton.addEventListener('click', activateMoleVision);
continueGameButton.addEventListener('click', continueGame);
closeTutorialButton.addEventListener('click', closeTutorial);

const savedHighScore = localStorage.getItem('highScore');
if (savedHighScore) {
    highScore = parseInt(savedHighScore);
    highScoreElement.textContent = highScore;
}

showTutorial();