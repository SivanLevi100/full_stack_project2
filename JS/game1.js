
const currentUser = JSON.parse(localStorage.getItem('currentUser'));  
document.getElementById('userName').textContent = `${currentUser.name}`;

class MemoryGame {
    constructor() {
        this.difficultySettings = {
            easy: {
                targetRange: { min: 5, max: 15 },
                time: 30
            },
            medium: {
                targetRange: { min: 10, max: 25 },
                time: 80
            },
            hard: {
                targetRange: { min: 20, max: 40 },
                time: 60
            }
        };
        this.initializeSetup();
    }

   /*Initialization function */
    initializeSetup() {
        this.setupEventListeners();
        this.selectedDifficulty = null;
    }
    
    /*Sets up event listeners for the game.*/
    setupEventListeners() {
        //Listening to the difficulty level buttons
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => this.selectDifficulty(button));
        });

        //Listening to the start game button
        const startButton = document.getElementById('start-game');
        startButton.addEventListener('click', () => this.startNewGame());
    }

    /*Handles the selection of a difficulty level. */
    selectDifficulty(button) {
        // Remove previous selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Choosing a new difficulty level
        button.classList.add('selected');
        this.selectedDifficulty = button.dataset.difficulty;
        
        // Activating the start button
        document.getElementById('start-game').disabled = false;
    }

    /*Starts a new game session. */
    startNewGame() {
        if (!this.selectedDifficulty) return;

        // Hiding the settings screen and showing the game
        document.getElementById('setup-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';

        // Initializing game variables
        this.cards = [];
        this.score = 0;
        this.flippedCards = [];
        this.matchedPairs = new Set();
        this.gameActive = true;

        // Setting time according to difficulty level
        this.timeLeft = this.difficultySettings[this.selectedDifficulty].time;

        // Selecting a random target number according to difficulty level
        const range = this.difficultySettings[this.selectedDifficulty].targetRange;
        this.targetNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

        // Display update
        document.getElementById('current-difficulty').textContent = this.getDifficulty();
        document.getElementById('target-number').textContent = this.targetNumber;
        document.getElementById('score').textContent = '0';
        document.getElementById('timer').textContent = this.timeLeft;

        this.initializeGame();
        this.startTimer();
    }

    /*Returns the selected difficulty level as a string. */
    getDifficulty() {
        const difficulties = {
            easy: 'easy',
            medium: 'medium',
            hard: 'hard'
        };
        return difficulties[this.selectedDifficulty];
    }
    
    /*Initializes the game by preparing the cards and setting up the game state. */
    initializeGame() {
        const numbers = [];
        for(let i = 1; i <= 8; i++) {
            // Generating numbers whose sum equals the target number
            const num1 = i;
            const num2 = this.targetNumber - i;
            if (num2 > 0 && num1 !== num2) {
                numbers.push(num1);
                numbers.push(num2);
            }
        }
        
        this.cards = numbers.sort(() => Math.random() - 0.5);
        this.matchedPairs.clear();
        this.gameActive = true;
        
        this.renderBoard();
    }
 
    /*Renders the game board with cards for the current game. */    
    renderBoard() {
        const board = document.getElementById('board');
        board.innerHTML = '';
        
        this.cards.forEach((number, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.style.transform = 'scaleX(-1)';
            card.addEventListener('click', () => this.flipCard(index));
            board.appendChild(card);
        });
    }

    /*Handles the logic for flipping a card on the game board. */
    flipCard(index) {
        if (!this.gameActive || this.flippedCards.length === 2) return;
        
        const card = document.querySelector(`[data-index="${index}"]`);
        if (card.classList.contains('flipped')) return;
        if (this.matchedPairs.has(index)) return;
        
        card.textContent = this.cards[index];
        card.classList.add('flipped');
        card.style.transform = 'scaleX(1)';
        this.flippedCards.push({index, value: this.cards[index]});
        
        if (this.flippedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    /*Checks if the two flipped cards for a valid pair that matches the target number. */
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const sum = card1.value + card2.value;
        
        if (sum === this.targetNumber) {
            this.score += 10;
          
            document.getElementById('score').textContent = this.score;
            
            // Adding the new class to the adapted cards
            const card1Element = document.querySelector(`[data-index="${card1.index}"]`);
            const card2Element = document.querySelector(`[data-index="${card2.index}"]`);
            
            card1Element.classList.remove('flipped');
            card2Element.classList.remove('flipped');
            card1Element.classList.add('matched');
            card2Element.classList.add('matched');
            
            this.matchedPairs.add(card1.index);
            this.matchedPairs.add(card2.index);
        } else {
            const card1Element = document.querySelector(`[data-index="${card1.index}"]`);
            const card2Element = document.querySelector(`[data-index="${card2.index}"]`);
            
            card1Element.classList.remove('flipped');
            card2Element.classList.remove('flipped');
            card1Element.textContent = '';
            card2Element.textContent = '';
            card1Element.style.transform = 'scaleX(-1)';
            card2Element.style.transform = 'scaleX(-1)';
        }
        
        this.flippedCards = [];
        
        if (this.matchedPairs.size === this.cards.length) {
            this.endGame('!You won');
        }
    }

    /*Starts the game timer and updates the countdown every second. */
    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame("!Time's Up");
            }
        }, 1000);
    }

    /*Ends the game, displays the final score, and handles user score  */
    endGame(message) {
        this.gameActive = false;
        clearInterval(this.timer);
    
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));  
        if (!currentUser) {
            console.error("No user is currently logged in.");
            return;
        }
    
        // Ensure `gameScore_arr` exists and is defined as an array
        if (!Array.isArray(currentUser.gameScore_arr)) {
           currentUser.gameScore_arr = [];  // If not an array, initialize as an empty array
        }
    
        // Calculate the highest score
        currentUser.gameScore_arr.push(this.score);  // Add the current game score to the score array
        let high_Score = Math.max(...currentUser.gameScore_arr);  // Calculate the highest score
        currentUser.highScore = high_Score; // Store the highest score
    
        // Calculate the total score
        let total_Score = currentUser.gameScore_arr.reduce((acc, score) => acc + score, 0); 
        currentUser.totalScore = total_Score;
    
        // Update the game count
        currentUser.gameCounter = currentUser.gameCounter + 1;
    
        // Update the current user fields in `localStorage`
        const users = JSON.parse(localStorage.getItem('gameUsers')) || {};
        users[currentUser.email] = currentUser; 
        localStorage.setItem('gameUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
        // Create end game message overlay
        const overlay = document.createElement('div');
        overlay.className = 'game-end-overlay';
    
        overlay.innerHTML = `
            <h2>${message}</h2>
            <div class="score">Your final score: ${this.score}</div>
            <button id="new-game-btn">New game</button>
        `;  
    
        // Add the end game overlay to the game container
        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(overlay);
    
        // Add event listener for the "New game" button
        document.getElementById('new-game-btn').addEventListener('click', () => {
            // Remove the end game overlay
            overlay.remove();
    
            // Reset the setup screen and choose difficulty again
            document.getElementById('setup-screen').style.display = 'block';
            document.getElementById('game-container').style.display = 'none';
    
            // Reset game variables
            this.selectedDifficulty = null;
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
    
            // Reset score and timer display
            this.score = 0;
            document.getElementById('score').textContent = this.score;
            document.getElementById('timer').textContent = '';
    
            // Disable start game button
            document.getElementById('start-game').disabled = true;
        });
    }

  }

// Create the game
new MemoryGame();
