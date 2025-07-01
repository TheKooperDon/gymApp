// signup.js
// This script handles local user account creation and saving for the signup form.
// It saves user data to localStorage and prevents duplicate accounts by email.
// All logic is explained in comments for easy understanding and future updates.

// Wait for the DOM to be fully loaded before running the script
window.addEventListener('DOMContentLoaded', () => {
  // Get the signup form element by its action attribute or by tag
  const form = document.querySelector('form[action="/submit-signup"]');
  if (!form) return; // If the form is not found, exit

  // Listen for the form submission event
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission (page reload)

    // Get form field values
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const birthday = form.birthday.value;
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Validate that all fields are filled (HTML5 required does this, but double-check)
    if (!firstName || !lastName || !birthday || !email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    // Validate that password and confirm password match
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Retrieve existing users from localStorage (or start with an empty array)
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('users')) || [];
    } catch (err) {
      users = [];
    }

    // Check if the email is already registered
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      alert('An account with this email already exists. Please log in or use a different email.');
      return;
    }

    // Create a new user object (in a real app, never store plain passwords!)
    const newUser = {
      firstName,
      lastName,
      birthday,
      email,
      password // In production, hash passwords! This is for demo/local only.
    };

    // Add the new user to the users array
    users.push(newUser);

    // Save the updated users array back to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Optionally, clear the form
    form.reset();

    // Show a success message
    alert('Account created successfully! You can now log in.');

    // Optionally, redirect to login page
    window.location.href = 'login.html';
  });
});

/*
How this works:
- On form submit, the script checks that all fields are filled and passwords match.
- It loads the current users from localStorage (or starts with an empty array).
- It checks for duplicate emails to prevent multiple accounts with the same email.
- If all checks pass, it adds the new user to the array and saves it back to localStorage.
- The password is stored in plain text for demo purposes ONLY. In a real app, always hash passwords and never store them in localStorage.
- After signup, the user is redirected to the login page.
- All logic is wrapped in DOMContentLoaded to ensure the form exists before running.
*/ 