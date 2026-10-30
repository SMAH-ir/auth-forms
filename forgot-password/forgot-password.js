const form = document.getElementById('forgotForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = form.querySelector('.auth__submit-btn');

const fields = {
     email: document.getElementById('email')
};

const errors = {
     email: document.getElementById('emailError')
};

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

function validateEmail() {
     const value = fields.email.value.trim();
     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!value) return showError('email', 'Email is required');
     if (!emailPattern.test(value)) return showError('email', 'Please enter a valid email address');
     clearError('email');
     return true;
}

fields.email.addEventListener('blur', validateEmail);

fields.email.addEventListener('input', () => {
     clearError('email');
     formMessage.textContent = '';
     formMessage.className = 'auth__message';
});

form.addEventListener('submit', (e) => {
     e.preventDefault();
     formMessage.textContent = '';
     formMessage.className = 'auth__message';

     if (validateEmail()) {
          submitBtn.disabled = true;
          formMessage.textContent = 'Demo only: no email is sent. Redirecting to login...';
          formMessage.classList.add('auth__message--success');

          setTimeout(() => {
               window.location.href = '../login/login.html';
          }, 2500);
     } else {
          fields.email.focus();
     }
});