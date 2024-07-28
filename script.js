const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const timeLeftElement = document.getElementById('time-left');
const highScoreElement = document.getElementById('high-score');
const startButton = document.getElementById('start-button');
const difficultySelect = document.getElementById('difficulty');
const soundToggle = document.getElementById('sound-toggle');

let score = 0;
let timeLeft = 30;
let highScore = 0;
let gameInterval;
let countdownInterval;
let moleInterval;
let currentMole;

const difficulties = {
    easy: { interval: 1500, duration: 1200 },
    medium: { interval: 1000, duration: 800 },
    hard: { interval: 750, duration: 600 }
};


function startGame() {
    score = 0;
    timeLeft = 30;
    updateScore();
    timeLeftElement.textContent = timeLeft;
    startButton.disabled = true;
    difficultySelect.disabled = true;

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
    if (currentMole) {
        currentMole.classList.remove('visible');
    }
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
    }
    alert(`Game Over! Your score: ${score}`);
}

function showRandomMole() {
    if (currentMole) {
        currentMole.classList.remove('visible');
    }
    const moles = document.querySelectorAll('.mole');
    const randomIndex = Math.floor(Math.random() * moles.length);
    currentMole = moles[randomIndex];
    currentMole.classList.add('visible');

    const difficulty = difficulties[difficultySelect.value];
    clearInterval(moleInterval);
    moleInterval = setInterval(() => {
        if (currentMole) {
            currentMole.classList.remove('visible');
            currentMole = null;
            if (soundToggle.checked) {
                missSound.play();
            }
        }
    }, difficulty.duration);
}

function updateCountdown() {
    timeLeft--;
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
        score++;
        updateScore();
        e.target.classList.remove('visible');
    }
});

startButton.addEventListener('click', startGame);

highScore = parseInt(localStorage.getItem('highScore')) || 0;
highScoreElement.textContent = highScore;

window.addEventListener('beforeunload', () => {
    localStorage.setItem('highScore', highScore);
});