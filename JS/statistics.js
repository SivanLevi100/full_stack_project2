


// שליפת משתמשים מ-localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('gameUsers')) || {};
}

// יצירת לוח מובילים
function populateLeaderboard() {
    const users = getUsers();
    const leaderboard = document.getElementById('leaderboard');

    // סידור משתמשים לפי הניקוד הכולל בסדר יורד
    const sortedUsers = Object.values(users).sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

    // מילוי לוח המובילים
    leaderboard.innerHTML = sortedUsers
        .map(user => `<li>${user.name}: ${user.totalScore || 0} נקודות</li>`)
        .join('');
}

// אתחול הדף
document.addEventListener('DOMContentLoaded', populateLeaderboard);
