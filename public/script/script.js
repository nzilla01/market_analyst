// fixing the bar nav 
const navBar = document.getElementById('bar');
const nav = document.querySelector('.nav_header');

navBar.addEventListener('click', () => {
    nav.classList.toggle('show');
    navBar.classList.toggle('active');
});
