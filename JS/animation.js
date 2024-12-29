const gameArea = document.getElementById("game-area");
const scoreElement = document.getElementById("score"); // Ensure this element exists in HTML
let score = 0;

// Function to create a falling object
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

        // Check if the object has reached the bottom
        if (position >= gameArea.offsetHeight - 50) {
            clearInterval(fallInterval);
            gameArea.removeChild(object); // Remove the object if it falls out of bounds
        }
    }, 20);

    // Add click event to remove the object and decrease the score
    object.addEventListener("click", () => {
        clearInterval(fallInterval);
        gameArea.removeChild(object); // Remove the object
        score++; // Decrease the score
        scoreElement.textContent = score; // Update the score display
    });
}

// Generate a new falling object every second
setInterval(createFallingObject, 1000);
