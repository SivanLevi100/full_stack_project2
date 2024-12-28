let boardSize;
let timer;
let words = ["חתול", "כלב", "פרח", "עיר", "ים", "שמש"];
let foundWords = [];

document.getElementById('startGame').addEventListener('click', startGame);

function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    boardSize = difficulty === 'small' ? 5 : (difficulty === 'medium' ? 10 : 15);
    
    foundWords = [];
    document.getElementById('foundList').innerHTML = '';

    // אתחול זמן
    let time = 30;
    document.getElementById('time').textContent = time;
    clearInterval(timer);
    timer = setInterval(function() {
        time--;
        document.getElementById('time').textContent = time;
        if (time <= 0) {
            clearInterval(timer);
            alert('הזמן נגמר!');
        }
    }, 1000);

    createBoard();
}

function createBoard() {
    const board = document.getElementById('wordSearchBoard');
    board.innerHTML = '';

    let grid = generateGrid(boardSize);
    grid = hideWords(grid);
    
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            const div = document.createElement('div');
            div.textContent = cell;
            div.classList.add('cell');
            div.dataset.row = rowIndex;
            div.dataset.cell = cellIndex;
            div.addEventListener('click', handleCellClick);
            board.appendChild(div);
        });
    });
}

function generateGrid(size) {
    const grid = Array.from({ length: size }, () => Array(size).fill(' '));
    return grid;
}

function hideWords(grid) {
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const startRow = Math.floor(Math.random() * grid.length);
            const startCell = Math.floor(Math.random() * grid[0].length);
            placed = tryPlaceWord(grid, word, startRow, startCell, direction);
        }
    });
    return grid;
}

function tryPlaceWord(grid, word, startRow, startCell, direction) {
    const wordLength = word.length;
    let endRow = startRow;
    let endCell = startCell;

    if (direction === 'horizontal') {
        endCell = startCell + wordLength - 1;
        if (endCell >= grid[0].length) return false;
    } else if (direction === 'vertical') {
        endRow = startRow + wordLength - 1;
        if (endRow >= grid.length) return false;
    }

    for (let i = 0; i < wordLength; i++) {
        const row = direction === 'horizontal' ? startRow : startRow + i;
        const cell = direction === 'horizontal' ? startCell + i : startCell;
        if (grid[row][cell] !== ' ') return false;
    }

    for (let i = 0; i < wordLength; i++) {
        const row = direction === 'horizontal' ? startRow : startRow + i;
        const cell = direction === 'horizontal' ? startCell + i : startCell;
        grid[row][cell] = word[i];
    }

    return true;
}

function handleCellClick(event) {
    const cell = event.target;
    const row = cell.dataset.row;
    const cellIndex = cell.dataset.cell;

    let wordFound = checkWord(row, cellIndex);
    if (wordFound) {
        cell.classList.add('found');
        foundWords.push(wordFound);
        document.getElementById('foundList').innerHTML = foundWords.join('<br>');
    }
}

function checkWord(row, cell) {
    // כאן נוכל לבדוק אם המילה נמצאת במיקום שנבחר
    // לצורך הפשטות, נניח כל קליק מוסיף את המילה שנמצאה לרשימה
    return words[Math.floor(Math.random() * words.length)];
}
