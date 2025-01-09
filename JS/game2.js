const gameArea = document.getElementById("game-area");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const difficultyButtons = document.querySelectorAll(".difficulty-button");
const difficultySelection = document.getElementById("difficulty-selection");
const secondsScore = document.querySelector(".seconds_score");

const currentUser = JSON.parse(localStorage.getItem('currentUser'));  
document.getElementById('userName').textContent = `${currentUser.name}`;

let score = 0;
let timeLeft = 30;
let gameInterval, timerInterval;
let fallSpeedMultiplier = 1; // Default fall speed multiplier

// Initialize the game-over message
const gameOverMessage = document.createElement("div");
gameOverMessage.id = "game-over-message";
gameOverMessage.style.display = "none"; // Hide initially
gameOverMessage.innerHTML = `
    <h2>!Time's up</h2>
    <p>your score: <span id="final-score"></span></p>
    <button id="restart-button">play again</button>
`;
document.getElementById("game-area").appendChild(gameOverMessage); // Append to the game area

// Add event listeners to difficulty buttons
difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const difficulty = button.getAttribute("data-difficulty");
        setDifficulty(difficulty);
        startGame();
    });
});


function updateUserPoints(points) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));  
    if (!currentUser) {
        console.error("No user is currently logged in.");
        return;
    }

    // Ensure `game2_Scores_arr` exists and is defined as an array
    if (!Array.isArray(currentUser.game2_Scores_arr)) {
       currentUser.game2_Scores_arr = [];  // If not an array, initialize as an empty array
    }

    // Calculate the highest score
    currentUser.game2_Scores_arr.push(points);  // Add the current game score to the score array
    let high_Score = Math.max(...currentUser.game2_Scores_arr);  // Calculate the highest score
    currentUser.highScore_2 = high_Score; // Store the highest score

    // Calculate the total score
    let total_Score_1 = currentUser.game1_Scores_arr.reduce((acc, score) => acc + score, 0); 
    let total_Score_2 = currentUser.game2_Scores_arr.reduce((acc, score) => acc + score, 0); 
    currentUser.totalScore = total_Score_1 + total_Score_2;

    // Update the game count
    currentUser.gameCounter = currentUser.gameCounter + 1;

    // Update the current user fields in `localStorage`
    const users = JSON.parse(localStorage.getItem('gameUsers')) || {};
    users[currentUser.email] = currentUser; 
    localStorage.setItem('gameUsers', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

}


// Adjust fall speed multiplier based on difficulty
function setDifficulty(difficulty) {
    if (difficulty === "low") {
        fallSpeedMultiplier = 0.5; // Slow falling speed
    } else if (difficulty === "medium") {
        fallSpeedMultiplier = 1; // Normal falling speed
    } else if (difficulty === "high") {
        fallSpeedMultiplier = 1.5; // Fast falling speed
    }
}

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
    const fallSpeed = (Math.random() * 3 + 2) * fallSpeedMultiplier; // Adjust speed based on difficulty

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
    // Hide the difficulty selector and show the game UI
    difficultySelection.style.display = "none";
    secondsScore.style.display = "flex";

    // Reset game state
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    gameArea.innerHTML = ""; // Clear the game area
    gameArea.appendChild(gameOverMessage); // Ensure game-over message stays in the DOM
    gameOverMessage.style.display = "none"; // Hide the game-over message
    gameArea.appendChild(difficultySelection); // Add difficulty selector for persistence
    

    // Start generating falling objects
    gameInterval = setInterval(createFallingObject, 1000);

    // Start the timer
    startTimer();
}



function endGame() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); 

    clearInterval(gameInterval); // Stop creating objects
    gameArea.querySelectorAll(".falling-object").forEach((obj) => obj.remove()); // Remove only falling objects

    document.getElementById("final-score").textContent = score; // Update the final score
    gameOverMessage.style.display = "flex"; // Show the game-over message

    updateUserPoints(score); // Update total score at the end of the game

    // Reset UI for new game
    const restartButton = document.getElementById("restart-button");
    restartButton.onclick = () => {
        gameOverMessage.style.display = "none"; // Hide the game-over message
        difficultySelection.style.display = "flex"; // Show difficulty selection
        secondsScore.style.display = "none"; // Hide the timer and score display
    };
}

