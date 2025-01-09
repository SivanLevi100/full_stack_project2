const currentUser = JSON.parse(localStorage.getItem('currentUser'));  
document.getElementById('userName').textContent = `${currentUser.name}`;

/*Handles user logout by removing session data from localStorage and cookies, then redirects to the login page.*/
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    document.cookie = 'userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '../HTML/index.html';
});

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
   .map(user => `
       <tr>
           <td>${user.totalScore || 0}</td>
           <td>${user.name}</td>
       </tr>
   `)
   .join('');
}

// אתחול הדף
document.addEventListener('DOMContentLoaded', populateLeaderboard);
