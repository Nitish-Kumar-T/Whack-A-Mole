const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const timeLeftElement = document.getElementById('time-left');
const highScoreElement = document.getElementById('high-score');
const startButton = document.getElementById('start-button');
const difficultySelect = document.getElementById('difficulty');
const freezeTimeButton = document.getElementById('freeze-time');
const doublePointsButton = document.getElementById('double-points');

let score = 0;
let timeLeft = 60;
let highScore = 0;
let gameInterval;
let countdownInterval;
let moleInterval;
let currentMole;
let isFreezePowerUpActive = false;
let isDoublePointsPowerUpActive = false;

const difficulties = {
    easy: { interval: 1500, duration: 1200 },
    medium: { interval: 1000, duration: 800 },
    hard: { interval: 750, duration: 600 }
};

function startGame() {
    score = 0;
    timeLeft = 60;
    updateScore();
    timeLeftElement.textContent = timeLeft;
    startButton.disabled = true;
    difficultySelect.disabled = true;
    freezeTimeButton.disabled = false;
    doublePointsButton.disabled = false;

    const difficulty = difficulties[difficultySelect.value];
    gameInterval = setInterval(showRandomMole, difficulty.interval);
    countdownInterval = setInterval(updateCountdown, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    clearInterval(moleInterval);
    startButton.disabled = false;
    difficultySelect.disabled = false;
    freezeTimeButton.disabled = true;
    doublePointsButton.disabled = true;
    if (currentMole) {
        currentMole.classList.remove('visible', 'normal', 'golden', 'bomb');
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
        currentMole.classList.remove('visible', 'normal', 'golden', 'bomb');
    }
    const moles = document.querySelectorAll('.mole');
    const randomIndex = Math.floor(Math.random() * moles.length);
    currentMole = moles[randomIndex];
    currentMole.classList.add('visible');

    // Randomly make the mole golden (10% chance) or a bomb (5% chance)
    const randomValue = Math.random();
    if (randomValue < 0.1) {
        currentMole.classList.add('golden');
    } else if (randomValue < 0.15) {
        currentMole.classList.add('bomb');
    } else {
        currentMole.classList.add('normal');
    }

    const difficulty = difficulties[difficultySelect.value];
    clearInterval(moleInterval);
    moleInterval = setInterval(() => {
        if (currentMole) {
            currentMole.classList.remove('visible', 'normal', 'golden', 'bomb');
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
}

gameContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('mole') && e.target.classList.contains('visible')) {
        if (e.target.classList.contains('bomb')) {
            score = Math.max(0, score - 5);
        } else {
            let points = e.target.classList.contains('golden') ? 5 : 1;
            if (isDoublePointsPowerUpActive) {
                points *= 2;
            }
            score += points;
        }
        updateScore();
        e.target.classList.remove('visible', 'normal', 'golden', 'bomb');
    }
});

startButton.addEventListener('click', startGame);

freezeTimeButton.addEventListener('click', () => {
    if (!isFreezePowerUpActive) {
        isFreezePowerUpActive = true;
        freezeTimeButton.disabled = true;
        setTimeout(() => {
            isFreezePowerUpActive = false;
        }, 5000);
    }
});

doublePointsButton.addEventListener('click', () => {
    if (!isDoublePointsPowerUpActive) {
        isDoublePointsPowerUpActive = true;
        doublePointsButton.disabled = true;
        setTimeout(() => {
            isDoublePointsPowerUpActive = false;
        }, 10000);
    }
});

// Initialize high score from localStorage
highScore = parseInt(localStorage.getItem('highScore')) || 0;
highScoreElement.textContent = highScore;

// Save high score to localStorage when the window is closed
window.addEventListener('beforeunload', () => {
    localStorage.setItem('highScore', highScore);
});