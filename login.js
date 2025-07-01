// login.js
// Handles local login for the login form using localStorage

window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[action="/submit-login"]');
    if (!form) return;
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const email = form.email.value.trim().toLowerCase();
      const password = form.password.value;
  
      // Get users from localStorage
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('users')) || [];
      } catch (err) {
        users = [];
      }
  
      // Find user with matching email and password
      const user = users.find(u => u.email === email && u.password === password);
  
      if (!user) {
        alert('Invalid email or password.');
        return;
      }
  
      // Save the logged-in user (for session)
      localStorage.setItem('currentUser', JSON.stringify(user));
  
      alert('Login successful!');
  
      // Redirect to profile page (or wherever you want)
      window.location.href = 'profile.html';
    });
  });
  
  /*
  How this works:
  - Prevents default form submission (no 404 error).
  - Checks credentials against localStorage.
  - If valid, saves the user as 'currentUser' and redirects.
  - If invalid, shows an error.
  */