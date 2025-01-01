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
    /*const gamesPlayed = Object.keys(user.scores).length;
    const totalScore = Object.values(user.scores).reduce((sum, score) => sum + score, 0);
    const highScore = Math.max(...Object.values(user.scores), 0);

    document.getElementById('gamesPlayed').textContent = gamesPlayed;
    document.getElementById('totalScore').textContent = totalScore;
    document.getElementById('highScore').textContent = highScore;*/

    // אתחול קונטור משחקים וסטטיסטיקות מהlocalStorage אם יש
    this.gameCounter = localStorage.getItem('gameCounter') ? parseInt(localStorage.getItem('gameCounter')) : 0;
    this.highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
    this.totalScore = localStorage.getItem('totalScore') ? parseInt(localStorage.getItem('totalScore')) : 0;
    
    // עדכון המידע בסטטיסטיקות
    document.getElementById('gamesPlayed').textContent = this.gameCounter;
    document.getElementById('totalScore').textContent = this.totalScore;
    document.getElementById('highScore').textContent = this.highScore;



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
