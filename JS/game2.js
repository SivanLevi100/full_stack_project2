const gameArea = document.getElementById("game-area");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const gameOverMessage = document.createElement("div"); // Create the game-over message container
let score = 0;
let timeLeft = 30; // Game duration in seconds
let gameInterval, timerInterval;

// Initialize the game-over message
gameOverMessage.id = "game-over-message";
gameOverMessage.style.display = "none"; // Hide initially
gameOverMessage.innerHTML = `
    <h2>Time's Up!</h2>
    <p>Your score: <span id="final-score"></span></p>
    <button id="restart-button">Play Again</button>
`;
document.body.appendChild(gameOverMessage); // Add to the body

function createFallingObject() {
    const object = document.createElement("div");
    object.classList.add("falling-object");

    // Set a random horizontal position
    object.style.left = Math.random() * (gameArea.offsetWidth - 50) + "px";

    // Start the object at the top
    object.style.top = "0px";

    // Append the object to the game area
    gameArea.appendChild(object);

    let position = 0;
    const fallSpeed = Math.random() * 3 + 2; // Random fall speed

    // Animate the object
    const fallInterval = setInterval(() => {
        position += fallSpeed;
        object.style.top = position + "px";

        if (position >= gameArea.offsetHeight - 50) {
            clearInterval(fallInterval);
            gameArea.removeChild(object); // Remove the object if it falls out of bounds
        }
    }, 20);

    // Add click event to remove the object and increase the score
    object.addEventListener("click", () => {
        clearInterval(fallInterval);
        gameArea.removeChild(object); // Remove the object
        score++; // Increase the score
        scoreElement.textContent = score; // Update the score display
    });
}

function startTimer() {
    timerElement.textContent = timeLeft; // Initialize the timer display
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft; // Update the timer display
        if (timeLeft <= 0) {
            clearInterval(timerInterval); // Stop the timer
            endGame(); // Trigger the game over logic
        }
    }, 1000); // Decrease the time every second
}

function startGame() {
    // Reset game state
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    gameOverMessage.style.display = "none"; // Hide the game-over message
    gameArea.innerHTML = ""; // Clear the game area

    // Start generating falling objects
    gameInterval = setInterval(createFallingObject, 1000);

    // Start the timer
    startTimer();
}

function endGame() {
    clearInterval(gameInterval); // Stop creating objects
    gameArea.innerHTML = ""; // Clear remaining objects
    document.getElementById("final-score").textContent = score; // Update the final score in the overlay
    gameOverMessage.style.display = "flex"; // Show the game-over message
}

// Restart button functionality
document.addEventListener("click", (e) => {
    if (e.target.id === "restart-button") {
        startGame(); // Restart the game
    }
});

// Start the game initially
startGame();
