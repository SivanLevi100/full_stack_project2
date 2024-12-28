// בדיקת התחברות
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        return null;
    }
    return currentUser;
}

// עדכון פרטי משתמש בדף
function updateUserInfo(user) {
    document.getElementById('userName').textContent = `Hello, ${user.name}`;
    
    // עדכון סטטיסטיקות
    const gamesPlayed = Object.keys(user.scores).length;
    const totalScore = Object.values(user.scores).reduce((sum, score) => sum + score, 0);
    const highScore = Math.max(...Object.values(user.scores), 0);

    document.getElementById('gamesPlayed').textContent = gamesPlayed;
    document.getElementById('totalScore').textContent = totalScore;
    document.getElementById('highScore').textContent = highScore;
}

// טיפול בהתנתקות
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    document.cookie = 'userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '../HTML/index.html';
}); 

// אתחול הדף
const currentUser = checkAuth();
if (currentUser) {
    updateUserInfo(currentUser);
}

/*
document.addEventListener('DOMContentLoaded', function () {
    // Load the header and footer in parallel
    Promise.all([
        fetch("../HTML/top_navigation.html").then(response => response.text()),
        fetch("../HTML/bottom_navigation.html").then(response => response.text())
    ])
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data[0];  // top_navigation.html
        document.getElementById('footer-placeholder').innerHTML = data[1];  // bottom_navigation.html
    })
    .catch(error => console.error('Error loading content:', error));
});*/