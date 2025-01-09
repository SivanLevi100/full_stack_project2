const currentUser = JSON.parse(localStorage.getItem('currentUser'));  
document.getElementById('userName').textContent = `${currentUser.name}`;

/*Verifies if the current user is logged in by checking the `currentUser` key in localStorage.*/
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        return null;
    }
    return currentUser;
}

/*Fetches the list of users from localStorage.*/
function getUsers() {
    const users = localStorage.getItem('gameUsers');
    return users ? JSON.parse(users) : {};
}

/*Saves the provided users object to localStorage.*/
function saveUsers(users) {
    localStorage.setItem('gameUsers', JSON.stringify(users));
}

/*Fetches the current logged-in user from localStorage. */
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

/*Updates the user information displayed on the page.*/
function updateUserInfo(user) {
    document.getElementById('userName').textContent = `${user.name}`;
    displayStatistics(user);
}

/*Calculates and displays user statistics on the page.*/
function displayStatistics(user) {
    // Calculate statistics for the current user
    const gamesPlayed = user.gameCounter || 0;
    const totalScore = user.totalScore || 0;
    const highScore = Math.max(user.highScore_1 || 0, user.highScore_2 || 0);

    // Update HTML elements with statistics
    document.getElementById('gamesPlayed').textContent = gamesPlayed;
    document.getElementById('totalScore').textContent = totalScore;
    document.getElementById('highScore').textContent = highScore;
}

/*Handles user logout by removing session data from localStorage and cookies, then redirects to the login page.*/
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    document.cookie = 'userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '../HTML/index.html';
});


/*Initialize Page */
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = checkAuth();
    if (currentUser) {
        updateUserInfo(currentUser);
    }
});


