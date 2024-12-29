// ניהול משתמשים ב-localStorage
const USERS_KEY = 'gameUsers';
const CURRENT_USER_KEY = 'currentUser';
let loginAttempts = {};

// מחלקה למשתמש
class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.scores = {};
        this.lastLogin = new Date();
        this.loginCount = 0;
    }
}

// פונקציות עזר
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    
    // הגדרת קוקי תמידי
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 10); // קביעת תפוגה ל-10 שנים קדימה
    document.cookie = `userSession=${user.email};expires=${expiryDate.toUTCString()};path=/`;
}


// טיפול בטאבים
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const formType = tab.dataset.tab;
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.add('hidden');
        });
        document.getElementById(`${formType}Form`).classList.remove('hidden');
    });
});

// טיפול בהתחברות
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = getUsers();
    const user = users[email];

    // בדיקת ניסיונות כניסה כושלים
    if (loginAttempts[email] && loginAttempts[email] >= 3) {
        alert('החשבון נחסם עקב ניסיונות כניסה מרובים. נסה שוב מאוחר יותר.');
        return;
    }

    if (user && user.password === password) {
        user.lastLogin = new Date();
        user.loginCount++;
        users[email] = user;
        saveUsers(users);
        setCurrentUser(user);
        loginAttempts[email] = 0;
        window.location.href = "../HTML/home_page.html";
    } else {
        loginAttempts[email] = (loginAttempts[email] || 0) + 1;
        alert('אימייל או סיסמה שגויים');
    }
});

// טיפול בהרשמה
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('הסיסמאות אינן תואמות');
        return;
    }

    const users = getUsers();
    if (users[email]) {
        alert('משתמש עם אימייל זה כבר קיים');
        return;
    }

    const newUser = new User(name, email, password);
    users[email] = newUser;
    saveUsers(users);
    setCurrentUser(newUser);
    window.location.href = "../HTML/home_page.html";
});



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
});