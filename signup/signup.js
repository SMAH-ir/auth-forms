if (!localStorage.getItem('users')) {
     localStorage.setItem('users', JSON.stringify([
          {
               fullname: 'demo',
               email: 'demo@example.com',
               password: 'Password123!'
          }
     ]));
}

const form = document.getElementById('signupForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = form.querySelector('.auth__submit-btn');
const oauthButtons = document.querySelectorAll('.auth__oauth-btn');

const strengthContainer = document.getElementById('passwordStrength');
const strengthText = document.getElementById('strengthText');

function getUsers() {
     try {
          return JSON.parse(localStorage.getItem('users')) || [];
     } catch {
          return [];
     }
}

const fields = {
     fullname: document.getElementById('fullname'),
     email: document.getElementById('email'),
     password: document.getElementById('password'),
     confirmPassword: document.getElementById('confirmPassword')
};

const errors = {
     fullname: document.getElementById('fullnameError'),
     email: document.getElementById('emailError'),
     password: document.getElementById('passwordError'),
     confirmPassword: document.getElementById('confirmPasswordError')
};

function setFormDisabled(disabled) {
     submitBtn.disabled = disabled;
     oauthButtons.forEach(btn => {
          btn.disabled = disabled;
     });
}

function showError(name, message) {
     errors[name].textContent = message;
     fields[name].classList.add('auth__input--error');
     fields[name].setAttribute('aria-invalid', 'true');
     return false;
}

function clearError(name) {
     errors[name].textContent = '';
     fields[name].classList.remove('auth__input--error');
     fields[name].setAttribute('aria-invalid', 'false');
}

function checkPasswordStrength(value) {
     if (!value) {
          strengthContainer.className = 'pwd-strength';
          strengthText.textContent = '';
          return;
     }

     if (value.length < 8 || /\s/.test(value)) {
          strengthContainer.className = 'pwd-strength pwd-strength--visible pwd-strength--weak';
          strengthText.textContent = 'Weak';
          return;
     }

     let score = 0;
     if (value.length >= 8) score += 1;
     if (/[A-Z]/.test(value)) score += 1;
     if (/[a-z]/.test(value)) score += 1;
     if (/[0-9]/.test(value)) score += 1;
     if (/[^\w\s]/.test(value)) score += 1;

     if (score <= 2) {
          strengthContainer.className = 'pwd-strength pwd-strength--visible pwd-strength--weak';
          strengthText.textContent = 'Weak';
     } else if (score <= 4) {
          strengthContainer.className = 'pwd-strength pwd-strength--visible pwd-strength--medium';
          strengthText.textContent = 'Medium';
     } else {
          strengthContainer.className = 'pwd-strength pwd-strength--visible pwd-strength--strong';
          strengthText.textContent = 'Strong';
     }
}

function validateFullname() {
     const value = fields.fullname.value.trim();
     if (!value) return showError('fullname', 'Full name is required');
     if (value.length < 3) return showError('fullname', 'Full name must be at least 3 characters');
     clearError('fullname');
     return true;
}

function validateEmail() {
     const value = fields.email.value.trim();
     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!value) return showError('email', 'Email is required');
     if (!emailPattern.test(value)) return showError('email', 'Please enter a valid email address');
     clearError('email');
     return true;
}

function validatePassword() {
     const value = fields.password.value;
     if (!value) return showError('password', 'Password is required');
     if (/\s/.test(value)) return showError('password', 'Password cannot contain spaces');
     if (value.length < 8) return showError('password', 'Must be at least 8 characters');
     clearError('password');
     return true;
}

function validateConfirmPassword() {
     const value = fields.confirmPassword.value;
     if (!value) return showError('confirmPassword', 'Please confirm your password');
     if (value !== fields.password.value) return showError('confirmPassword', 'Passwords do not match');
     clearError('confirmPassword');
     return true;
}

fields.password.addEventListener('input', (e) => {
     checkPasswordStrength(e.target.value);
     clearError('password');
     formMessage.textContent = '';
     formMessage.className = 'auth__message';
     if (fields.confirmPassword.value) validateConfirmPassword();
});

['fullname', 'email', 'confirmPassword'].forEach(name => {
     fields[name].addEventListener('input', () => {
          clearError(name);
          formMessage.textContent = '';
          formMessage.className = 'auth__message';
     });
});

fields.fullname.addEventListener('blur', validateFullname);
fields.email.addEventListener('blur', validateEmail);
fields.password.addEventListener('blur', validatePassword);
fields.confirmPassword.addEventListener('blur', validateConfirmPassword);

form.addEventListener('submit', (e) => {
     e.preventDefault();
     formMessage.textContent = '';
     formMessage.className = 'auth__message';

     const results = [validateFullname(), validateEmail(), validatePassword(), validateConfirmPassword()];

     if (results.every(Boolean)) {
          const users = getUsers();
          const fullnameValue = fields.fullname.value.trim();
          const emailValue = fields.email.value.trim();

          const userExists = users.some(
               u => u.email.toLowerCase() === emailValue.toLowerCase() ||
                    u.fullname.toLowerCase() === fullnameValue.toLowerCase()
          );

          if (userExists) {
               formMessage.textContent = 'An account with this name or email already exists.';
               formMessage.classList.add('auth__message--error');
               return;
          }

          users.push({
               fullname: fullnameValue,
               email: emailValue,
               password: fields.password.value
          });
          localStorage.setItem('users', JSON.stringify(users));

          setFormDisabled(true);
          formMessage.textContent = 'Account created successfully! Redirecting...';
          formMessage.classList.add('auth__message--success');

          setTimeout(() => {
               window.location.href = '../login/login.html';
          }, 1500);
     } else {
          const firstInvalid = document.querySelector('[aria-invalid="true"]');
          if (firstInvalid) firstInvalid.focus();
     }
});

oauthButtons.forEach(btn => {
     btn.addEventListener('click', () => {
          const provider = btn.dataset.provider;
          Object.keys(fields).forEach(clearError);

          setFormDisabled(true);
          formMessage.textContent = `Connecting to ${provider}...`;
          formMessage.className = 'auth__message auth__message--success';

          setTimeout(() => {
               localStorage.setItem('isAuth', 'true');
               localStorage.setItem('userName', `${provider} User`);
               window.location.href = '../dashboard/dashboard.html';
          }, 800);
     });
});

document.querySelectorAll('.auth__toggle-pwd').forEach(btn => {
     btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-toggle');
          const input = document.getElementById(targetId);
          if (!input) return;

          const isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
          btn.classList.toggle('auth__toggle-pwd--visible');
     });
});