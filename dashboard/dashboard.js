const userNameDisplay = document.getElementById('userNameDisplay');
const storedName = localStorage.getItem('userName');
if (storedName) {
     userNameDisplay.textContent = storedName;
}

document.getElementById('logoutBtn').addEventListener('click', () => {
     localStorage.removeItem('isAuth');
     localStorage.removeItem('userName');
     window.location.replace('../login/login.html');
});