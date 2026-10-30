if (!localStorage.getItem('users')) {
     localStorage.setItem('users', JSON.stringify([
          {
               fullname: 'demo',
               email: 'demo@example.com',
               password: 'Password123!'
          }
     ]));
}

function getUsers() {
     try {
          return JSON.parse(localStorage.getItem('users')) || [];
     } catch {
          return [];
     }
}

const form = document.getElementById('loginForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = form.querySelector('.auth__submit-btn');
const oauthButtons = document.querySelectorAll('.auth__oauth-btn');

const fields = {
     username: document.getElementById('username'),
     password: document.getElementById('password')
};

const errors = {
     username: document.getElementById('usernameError'),
     password: document.getElementById('passwordError')
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
}

function clearError(name) {
     errors[name].textContent = '';
     fields[name].classList.remove('auth__input--error');
     fields[name].setAttribute('aria-invalid', 'false');
}

function validateUsername() {
     const value = fields.username.value.trim();
     if (!value) {
          showError('username', 'Full name or Email is required');
          return false;
     }
     clearError('username');
     return true;
}

function validatePassword() {
     const value = fields.password.value;
     if (!value) {
          showError('password', 'Password is required');
          return false;
     }
     clearError('password');
     return true;
}

fields.username.addEventListener('blur', validateUsername);
fields.password.addEventListener('blur', validatePassword);

Object.keys(fields).forEach(name => {
     fields[name].addEventListener('input', () => {
          clearError(name);
          formMessage.textContent = '';
          formMessage.className = 'auth__message';
     });
});

form.addEventListener('submit', (e) => {
     e.preventDefault();
     formMessage.textContent = '';
     formMessage.className = 'auth__message';

     const results = [validateUsername(), validatePassword()];

     if (results.every(Boolean)) {
          const users = getUsers();
          const inputUser = fields.username.value.trim().toLowerCase();
          const inputPass = fields.password.value;

          const matchedUser = users.find(
               u => (u.fullname.toLowerCase() === inputUser || u.email.toLowerCase() === inputUser) &&
                    u.password === inputPass
          );

          if (!matchedUser) {
               formMessage.textContent = 'Invalid full name, email or password';
               formMessage.classList.add('auth__message--error');
               return;
          }

          setFormDisabled(true);
          formMessage.textContent = 'Logging in...';
          formMessage.classList.add('auth__message--success');

          setTimeout(() => {
               localStorage.setItem('isAuth', 'true');
               localStorage.setItem('userName', matchedUser.fullname);
               window.location.href = '../dashboard/dashboard.html';
          }, 800);
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