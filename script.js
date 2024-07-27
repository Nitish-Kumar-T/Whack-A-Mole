const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const timeLeftElement = document.getElementById('time-left');
const startButton = document.getElementById('start-button');

let score = 0;
let timeLeft = 30;
let gameInterval;
let countdownInterval;

function startGame() {
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = score;
    timeLeftElement.textContent = timeLeft;
    startButton.disabled = true;

    gameInterval = setInterval(showRandomMole, 1000);
    countdownInterval = setInterval(updateCountdown, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    startButton.disabled = false;
    const moles = document.querySelectorAll('.mole');
    moles.forEach(mole => mole.style.display = 'none');
    alert(`Game Over! Your score: ${score}`);
}

function showRandomMole() {
    const moles = document.querySelectorAll('.mole');
    moles.forEach(mole => mole.style.display = 'none');

    const randomIndex = Math.floor(Math.random() * moles.length);
    moles[randomIndex].style.display = 'block';

    setTimeout(() => {
        moles[randomIndex].style.display = 'none';
    }, 800);
}

function updateCountdown() {
    timeLeft--;
    timeLeftElement.textContent = timeLeft;
    if (timeLeft === 0) {
        endGame();
    }
}

gameContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('mole')) {
        score++;
        scoreElement.textContent = score;
        e.target.style.display = 'none';
    }
});

startButton.addEventListener('click', startGame);
