// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        
        // Toggle hamburger animation
        const spans = this.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu-btn') && !event.target.closest('.main-nav')) {
            mainNav.classList.remove('active');
            mobileMenuBtn.querySelectorAll('span').forEach(span => span.classList.remove('active'));
        }
    });

    // Update user name if logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('userName').textContent = `שלום, ${currentUser.name}`;
    }

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        document.cookie = 'userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/index.html';
    });

    // User stats link
    document.getElementById('userStats').addEventListener('click', function(e) {
        e.preventDefault();
        // Implement your stats viewing logic here
        alert('הסטטיסטיקות שלך יוצגו כאן בקרוב!');
    });
});