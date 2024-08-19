let rocket = document.getElementById('rocket');
let startBtn = document.getElementById('startBtn');
let restartBtn = document.getElementById('restartBtn');
let retreatBtn = document.getElementById('retreatBtn');
let scoreDisplay = document.getElementById('score');
let levelDisplay = document.getElementById('level');
let shootSound = document.getElementById('shootSound');  // Reference to the audio element
let score = 0;  // Number of hits
let level = 1;
let stones = [];
let bullets = [];
let gameInterval;
let stoneIntervals = [];  // Array to hold intervals for all stones
let isRunning = false;
function startGame() {
    console.log("Starting game...");
    score = 0;
    level = 1;
    updateScore();
    updateLevel();
    restartBtn.style.display = 'inline';
    retreatBtn.style.display = 'inline';
    startBtn.style.display = 'none';
    clearGame();
    isRunning = true;
    gameInterval = setInterval(updateGame, 20);
    createStones(6);  // Create 6 stones
}
function restartGame() {
    clearGame();
    startGame();
}
function retreatGame() {
    isRunning = false;
    clearInterval(gameInterval);
    stoneIntervals.forEach(clearInterval);  // Stop all stone intervals
    retreatBtn.style.display = 'none';
    startBtn.style.display = 'inline';
}
function clearGame() {
    clearInterval(gameInterval);
    stoneIntervals.forEach(clearInterval);  // Clear all stone intervals
    stoneIntervals = [];  // Reset the stone intervals array
    document.querySelectorAll('.stone').forEach(stone => stone.remove());
    stones = [];
    bullets.forEach(bullet => bullet.remove());
    bullets = [];
}
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}
function updateLevel() {
    levelDisplay.textContent = `Level: ${level}`;
}
function shoot() {
    console.log("Shoot function called");  // Debugging
    // Play the shooting sound
    if (shootSound) {
        shootSound.currentTime = 0;  // Reset sound to start
        shootSound.play();
    }
    let bullet = document.createElement('div');
    bullet.className = 'bullet';
    document.body.appendChild(bullet);
    let rocketRect = rocket.getBoundingClientRect();
    bullet.style.left = `${rocketRect.left + rocketRect.width / 2 - 5}px`;
    bullet.style.bottom = `${window.innerHeight - rocketRect.height - 20}px`; // Position just above the rocket
    let bulletInterval = setInterval(() => {
        let bulletRect = bullet.getBoundingClientRect();
        if (bulletRect.top <= 0) {
            clearInterval(bulletInterval);
            bullet.remove();
        } else {
            bullet.style.top = `${bulletRect.top - 10}px`;
            stones.forEach((stone, index) => {
                let stoneRect = stone.getBoundingClientRect();
                if (collision(bulletRect, stoneRect)) {
                    clearInterval(bulletInterval);
                    bullet.remove();
                    stone.remove();
                    stones.splice(index, 1);
                    score += 1;
                    updateScore();
                }
            });
        }
    }, 20);
    bullets.push(bullet);
}
function createStones(num) {
    for (let i = 0; i < num; i++) {
        createStone();
    }
}
function createStone() {
    let stone = document.createElement('div');
    stone.className = 'stone';
    document.body.appendChild(stone);
    // Calculate the middle third of the screen width
    let minLeft = window.innerWidth / 3;
    let maxLeft = window.innerWidth * 2 / 3;
    let left = Math.random() * (maxLeft - minLeft) + minLeft;
    stone.style.left = `${left}px`;
    stone.style.top = `-60px`;
    let fallInterval = setInterval(() => {
        let stoneRect = stone.getBoundingClientRect();
        if (stoneRect.top >= window.innerHeight) {
            clearInterval(fallInterval);
            stone.remove();
            stones = stones.filter(st => st !== stone);
            checkGameOver();
        } else {
            stone.style.top = `${stoneRect.top + 2}px`;  // Slower falling speed
        }
    }, 30);  // Slower fall interval
    stones.push(stone);
    stoneIntervals.push(fallInterval);
}
function checkGameOver() {
    if (stones.some(stone => stone.getBoundingClientRect().top >= window.innerHeight)) {
        isRunning = false;
        clearInterval(gameInterval);
        stoneIntervals.forEach(clearInterval);
        alert("Game Over! You got hit by a stone.");
        startBtn.style.display = 'inline';
        restartBtn.style.display = 'inline';
        retreatBtn.style.display = 'none';
    }
}
function updateGame() {
    if (!isRunning) return;
    checkGameOver();
    if (score >= level * 100) {
        level++;
        updateLevel();
        stoneIntervals.forEach(clearInterval);
        stoneIntervals = [];
        createStones(6);  // Create new stones for the new level
    }
}
function collision(rect1, rect2) {
    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
retreatBtn.addEventListener('click', retreatGame);
document.addEventListener('mousemove', function(event) {
    let rocketRect = rocket.getBoundingClientRect();
    let newX = event.clientX - rocketRect.width / 2;
    // Ensure the rocket stays within the screen bounds
    if (newX < 0) {
        newX = 0;
    } else if (newX + rocketRect.width > window.innerWidth) {
        newX = window.innerWidth - rocketRect.width;
    }
    rocket.style.left = `${newX}px`;
});
// Add event listener for shooting on the entire document
document.addEventListener('click', function() {
    console.log("Screen clicked");  // Debugging
    shoot();
});
restartBtn.style.display = 'none';
retreatBtn.style.display = 'none';