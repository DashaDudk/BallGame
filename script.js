const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let paddle = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    width: 100,
    height: 10,
    speed: 7,
};

let ball = {
    x: Math.random() * canvas.width,
    y: 100,
    radius: 10,
    speedX: 2,
    speedY: 2,
};

let score = 0;
let gameOver = false;
let isPaused = false;
let gameLoop;

function drawPaddle() {
    ctx.fillStyle = "green";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawGameOver() {
    ctx.fillStyle = "black";
    ctx.fillText(`Гру закінчено! Ваш рахунок: ${score}`, canvas.width / 2 - 100, canvas.height / 2);
    ctx.fillText("Натисніть R, щоб почати заново", canvas.width / 2 - 150, canvas.height / 2 + 30);
}

function drawPause() {
    ctx.fillStyle = "black";
    ctx.fillText("Гра на паузі", canvas.width / 2 - 30, canvas.height / 2);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    if (!isPaused && !gameOver) {
        clearCanvas();
        drawPaddle();
        drawBall();

        ball.x += ball.speedX;
        ball.y += ball.speedY;

        if (
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width &&
            ball.y + ball.radius > paddle.y
        ) {
            score++;
            ball.speedY = -ball.speedY; 
            ball.y = paddle.y - ball.radius; 

            ball.speedY *= 1.1;
            ball.speedX *= 1.1;
        }

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.speedX = -ball.speedX; 
        }

        if (ball.y > canvas.height) {
            gameOver = true; 
        }

        if (ball.y - ball.radius < 0) {
            ball.speedY = -ball.speedY; 
        }

        ctx.fillStyle = "black";
        ctx.fillText(`Score: ${score}`, 10, 20);
    } else if (gameOver) {
        clearCanvas();
        drawPaddle();
        drawBall();
        drawGameOver();
    } else if (isPaused) {
        drawPause();
    }
}

function movePaddle(event) {
    if (!gameOver) {
        switch (event.key) {
            case "ArrowLeft":
                paddle.x -= paddle.speed;
                if (paddle.x < 0) paddle.x = 0;
                break;
            case "ArrowRight":
                paddle.x += paddle.speed;
                if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
                break;
            case "p":
                isPaused = !isPaused; 
                break;
        }
    }
}

window.addEventListener("keydown", (event) => {
    if (event.key === "r" || event.key === "R") {
        if (gameOver) {
            restartGame();
        }
    }
});

function restartGame() {
    paddle.x = canvas.width / 2 - 50;
    paddle.y = canvas.height - 20;
    ball.x = Math.random() * canvas.width;
    ball.y = 100;
    ball.speedX = 2;
    ball.speedY = 2;
    score = 0;
    gameOver = false;
    isPaused = false;

    clearInterval(gameLoop); 
    gameLoop = setInterval(update, 1000 / 60); 
}

gameLoop = setInterval(update, 1000 / 60);
window.addEventListener("keydown", movePaddle);