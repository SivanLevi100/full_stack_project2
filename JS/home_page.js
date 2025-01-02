// בדיקת התחברות
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        return null;
    }
    return currentUser;
}


function getUsers() {
    const users = localStorage.getItem('gameUsers');
    return users ? JSON.parse(users) : {};
}

function saveUsers(users) {
    localStorage.setItem('gameUsers', JSON.stringify(users));
}


function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// עדכון פרטי משתמש בדף
function updateUserInfo(user) {
    document.getElementById('userName').textContent = `Hello, ${user.name}`;
    displayStatistics(user);
}

// עדכון סטטיסטיקות
function displayStatistics(user) {
    // חישוב סטטיסטיקות למשתמש הנוכחי
    const gamesPlayed = user.gameCounter || 0;
    const totalScore = user.totalScore || 0;
    const highScore = user.highScore || 0;

    // עדכון אלמנטים ב-HTML
    document.getElementById('gamesPlayed').textContent = gamesPlayed;
    document.getElementById('totalScore').textContent = totalScore;
    document.getElementById('highScore').textContent = highScore;

    // לוח מובילים (leaderboard)
    const users = getUsers();
    const otherUsers = Object.values(users).filter(u => u.email !== user.email);

    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = otherUsers
        .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0)) // סידור לפי ניקוד יורד
        .map(u => `<li>${u.name}: ${u.totalScore || 0} נקודות</li>`)
        .join('');
}

// טיפול בהתנתקות
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    document.cookie = 'userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '../index.html';
});

// אתחול הדף
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = checkAuth();
    if (currentUser) {
        updateUserInfo(currentUser);
    }
});


