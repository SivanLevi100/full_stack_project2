//document.getElementById('userName').textContent = `Hello, ${user.name}`;
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

    /*פונקצית אתחול */
    initializeSetup() {
        this.setupEventListeners();
        this.selectedDifficulty = null;

        // Load counter and score from localStorage
        this.loadGameStats();
    }
    
    /*אתחול סטטיסטקות */
    loadGameStats() {
        // Load counter and score from localStorage
        this.gameCounter = parseInt(localStorage.getItem(user.gameCounter)) || 0; //מספר משחקים
        this.highScore = parseInt(localStorage.getItem(user.highScore)) || 0;  //ציון הכי גבוה
        this.totalScore = parseInt(localStorage.getItem(user.totalScore)) || 0;  //כל הציונים
        this.scores = JSON.parse(localStorage.getItem(user.gameScore_arr)) || []; //מערך הציונים

        // Display the counter and score
        /*document.getElementById('game-counter').textContent = `משחקים שוחקו: ${this.gameCounter}`;
        document.getElementById('high-score').textContent = `הניקוד הגבוה ביותר: ${this.highScore}`;*/
        

        //current_User = JSON.parse(localStorage.getItem('currentUser'));
        
    }

    setupEventListeners() {
        // מאזינים לכפתורי רמת הקושי
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => this.selectDifficulty(button));
        });

        // מאזין לכפתור התחלת המשחק
        const startButton = document.getElementById('start-game');
        startButton.addEventListener('click', () => this.startNewGame());
    }

    selectDifficulty(button) {
        // הסרת הבחירה הקודמת
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // בחירת רמת הקושי החדשה
        button.classList.add('selected');
        this.selectedDifficulty = button.dataset.difficulty;
        
        // הפעלת כפתור ההתחלה
        document.getElementById('start-game').disabled = false;
    }

    startNewGame() {
        if (!this.selectedDifficulty) return;

        // הסתרת מסך ההגדרות והצגת המשחק
        document.getElementById('setup-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';

        // אתחול משתני המשחק
        this.cards = [];
        this.score = 0;
        this.flippedCards = [];
        this.matchedPairs = new Set();
        this.gameActive = true;

        // הגדרת זמן לפי רמת הקושי
        this.timeLeft = this.difficultySettings[this.selectedDifficulty].time;

        // בחירת מספר מטרה רנדומלי לפי רמת הקושי
        const range = this.difficultySettings[this.selectedDifficulty].targetRange;
        this.targetNumber = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

        // עדכון התצוגה
        document.getElementById('current-difficulty').textContent = this.getDifficultyInHebrew();
        document.getElementById('target-number').textContent = this.targetNumber;
        document.getElementById('score').textContent = '0';
        document.getElementById('timer').textContent = this.timeLeft;

        this.initializeGame();
        this.startTimer();
    }

    getDifficultyInHebrew() {
        const difficulties = {
            easy: 'קל',
            medium: 'בינוני',
            hard: 'קשה'
        };
        return difficulties[this.selectedDifficulty];
    }

    initializeGame() {
        const numbers = [];
        for(let i = 1; i <= 8; i++) {
            // יצירת מספרים שסכומם שווה למספר המטרה
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
        this.createEndGameMessage();
    }

    createEndGameMessage() {
        const gameInfo = document.querySelector('.game-info');
        let endMessage = document.getElementById('end-message');
        
        if (!endMessage) {
            endMessage = document.createElement('div');
            endMessage.id = 'end-message';
            endMessage.style.display = 'none';
            gameInfo.appendChild(endMessage);
        }

        let restartButton = document.getElementById('restart-button');
        if (!restartButton) {
            restartButton = document.createElement('button');
            restartButton.id = 'restart-button';
            restartButton.textContent = 'משחק חדש';
            restartButton.style.display = 'none';
            restartButton.addEventListener('click', () => {
                document.getElementById('setup-screen').style.display = 'block';
                document.getElementById('game-container').style.display = 'none';
                document.getElementById('end-message').style.display = 'none';
                restartButton.style.display = 'none';
            });
            gameInfo.appendChild(restartButton);
        }
    }

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

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const sum = card1.value + card2.value;
        
        if (sum === this.targetNumber) {
            this.score += 10;
          
            document.getElementById('score').textContent = this.score;

            
            // הוספת הקלאס החדש לקלפים שהותאמו
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
            this.endGame('ניצחת! ');
        }

        
        
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame('נגמר הזמן! ');
            }
        }, 1000);
    }



    endGame(message) {
        this.gameActive = false;
        clearInterval(this.timer);
        user.gameCounter
        user.highScore
        user.totalScore
        user.gameScore_arr

        // חישוב הציון הכי גבוה
        this.scores.push(this.score);  // הכנסת ציון המשחק הנוכחי למערך הציונים
        localStorage.setItem('gameScores_arr', JSON.stringify(this.scores));  // שמירה של מערך הציונים
        let highScore = Math.max(...this.scores);  // חישוב הציון הגבוה ביותר
        localStorage.setItem('highScore', highScore);  // שמירה של הציון הכי גבוה
    
        // חישוב הציון הכולל
        let totalScore = this.scores.reduce((acc, score) => acc + score, 0); 
        localStorage.setItem('totalScore', this.totalScore); 
    
        // עדכון מספר המשחקים
        localStorage.setItem('gameCounter', this.gameCounter + 1);  

    
        // יצירת אלמנט הודעת הסיום
        const overlay = document.createElement('div');
        overlay.className = 'game-end-overlay';
    
        overlay.innerHTML = `
            <h2>${message}</h2>
            <div class="score">הניקוד הסופי שלך: ${this.score}</div>
            <button id="new-game-btn">משחק חדש</button>
        `;
    
        // הוספת ההודעה ללוח המשחק
        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(overlay);
    
        // הוספת מאזין לחיצה לכפתור המשחק החדש
        document.getElementById('new-game-btn').addEventListener('click', () => {
            // מחיקת המעטפת של סיום המשחק
            overlay.remove();
    
            // איפוס אלמנטים ובחירת רמת קושי מחדש
            document.getElementById('setup-screen').style.display = 'block';
            document.getElementById('game-container').style.display = 'none';
    
            // אפס את משתני המשחק
            this.selectedDifficulty = null;
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
    
            // איפוס זמן ניקוד
            this.score = 0;
            document.getElementById('score').textContent = this.score;
            document.getElementById('timer').textContent = '';
    
            // איפוס כפתור התחלת משחק
            document.getElementById('start-game').disabled = true;
        });
    }
    
}

// יצירת המשחק
new MemoryGame();
