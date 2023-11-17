let boardGame = document.querySelector('.board-game');
let scoreElement = document.querySelector('.all-scores .score span');
let highScoreElement = document.querySelector('.all-scores .high-score span');
let arrowControls = document.querySelectorAll('.controls i');

let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerHTML = highScore;

let headX = 5, headY = 10;
let foodX, foodY;
let dirX = 0, dirY = 0;
let snakeBody = [];
let gameOver = false;
let setIntervalId;
let score = 0;
let speed = 125;

let countPixelsX, countPixelsY;

window.addEventListener('resize', () => {
    countPixelsX = getStyleFromCss('--countPixelsX');
    countPixelsY = getStyleFromCss('--countPixelsY');
})

countPixelsX = getStyleFromCss('--countPixelsX');
countPixelsY = getStyleFromCss('--countPixelsY');

// Move the snake with press keys [ not phone mode ]
document.addEventListener('keydown', snakDiraction);

// Move the snake with press keys [ phone mode ] 
arrowControls.forEach(key => {
    key.addEventListener('click', () => snakDiraction({ key: key.dataset.key }));
})

// Random position snake food value [ 0 - 30 ]
function changeFoodposition() {
    foodX = Math.floor(Math.random() * countPixelsX) + 1;
    foodY = Math.floor(Math.random() * countPixelsY) + 1;
}

// Chanhe diraction snake with press keys
function snakDiraction(e) {
    if (e.key === 'ArrowUp' && dirY != 1) {
        dirX = 0, dirY = -1
    } else if (e.key === 'ArrowLeft' && dirX != 1) {
        dirX = -1, dirY = 0;
    } else if (e.key === 'ArrowRight' && dirX != -1) {
        dirX = 1, dirY = 0;
    } else if (e.key === 'ArrowDown' && dirY != -1) {
        dirX = 0, dirY = 1;
    }
    // initGame();
}

function initGame() {
    let htmlMurkup = `<div class="snakeFood" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (gameOver) return handleGameOver();

    // Ckecking if the snake hit food
    if (headX === foodX && headY === foodY) {

        // Random position snake food value [ 0 - 30 ]
        changeFoodposition();

        // Play sound effect when hit food one
        new Audio('./sounds/point.mp3').play();

        snakeBody.push([foodX, foodY]); // Pushing food position to body array

        score++; // Increment score by 1

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem('high-score', highScore);

        scoreElement.innerHTML = score;
        highScoreElement.innerHTML = highScore;

    }

    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [headX, headY]; // Setting first element of snake body

    // Update the position snake and increment long
    headX += dirX;
    headY += dirY;

    // Checking if the snake's body head position based on the wall
    if (headX <= 0 || headX > countPixelsX || headY <= 0 || headY > countPixelsY) {
        gameOver = true;
    }

    // Adding a div for each part of the snake's body
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMurkup += `<div class="snakeHead" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // Checking if the snake head hit the body, if so set gmeOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    boardGame.innerHTML = htmlMurkup;
}

changeFoodposition();

setIntervalId = setInterval(initGame, speed);

// Change snake speed
function changeSpeed() {
    const option = speedOption.value;
    speed = option * speed;
    console.log(speed)
}

// Clearing the timer and reloading the page on game over
function handleGameOver() {
    clearInterval(setIntervalId);

    // Play sound effect when game over
    new Audio('./sounds/wrong.mp3').play();

    setTimeout(() => {
        alert('Game Over! Press Ok to replay...');
        location.reload();
    }, 500)

}

// Get style :root from style css file
function getStyleFromCss(prop) {
    return getComputedStyle(document.documentElement).getPropertyValue(prop);
}

// let plus = document.getElementById('plus'), minus = document.getElementById('minus');
// plus.addEventListener('click', () => {
//     speed = speed * 1.25;
//     setIntervalId = setInterval(initGame, speed);
// })
// minus.addEventListener('click', () => {
//     speed = speed * 0.75;
//     setIntervalId = setInterval(initGame, speed);
// })
