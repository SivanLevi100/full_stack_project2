

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
        this.lastLogin = new Date();
        this.loginCount = 0;
        this.game1_Scores_arr = [];
        this.game2_Scores_arr = [];
        this.highScore_1 = 0;
        this.highScore_2 = 0;
        this.totalScore = 0;
        this.gameCounter = 0;
        

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


/*לחיצה על הירשם כאן */

// טיפול במעבר לטאב ההרשמה
document.getElementById('switchToRegister').addEventListener('click', (e) => {
    e.preventDefault();

    // הסרת הפעילות מכל הטאבים
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

    // הצגת טאב ההרשמה והסתרת שאר הטאבים
    const registerTab = document.querySelector('[data-tab="register"]');
    if (registerTab) {
        registerTab.classList.add('active');
        registerTab.style.display = 'block'; // להציג את הטאב
    }

    // הסתרת טופס ההתחברות והצגת טופס ההרשמה
    document.querySelectorAll('.auth-form').forEach(form => form.classList.add('hidden'));
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.classList.remove('hidden'); // להציג את טופס ההרשמה
    }
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
    
     // Name validation
     if (name.trim() === '') {
        alert('Name cannot be empty');
        return;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email');
        return;
    }

    // Password validation
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // Password confirmation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const users = getUsers();
    if (users[email]) {
        alert('A user with this email already exists');
        return;
    }


    const newUser = new User(name, email, password);
    users[email] = newUser;
    saveUsers(users);
    setCurrentUser(newUser);
    window.location.href = "../HTML/home_page.html";
});



/*סרגלי ניווט */
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

