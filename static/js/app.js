// Import modules for dynamic components
// import { renderLogin, renderFeed, renderCreatePost, renderMessages } from './components.js';
import { loginPage } from "./first_page.js";
const app = document.getElementById("main-content");

// Manage navigation
export function NavigateTo(page) {
    switch (page) {
        case 'login':
            app.innerHTML = '';
            loginPage();
            break;
        case 'feed':
            app.innerHTML = '';
            app.innerHTML = '<h2>feed page</h2>';
            break;
        default:
            app.innerHTML = '<h2>404 - Page Not Found</h2>';
    }
}
document.getElementById("navbar").addEventListener("click", (e) => {
    const button = e.target;
    const page = button.dataset.page;
    if (page) {
        NavigateTo(page);
    }
});



NavigateTo('login');

// const btnfed = document.querySelector(".navFed")
// btnfed.addEventListener("click",{
//     na
// })

// Logout functionality
// function logout() {
//     fetch('/api/logout', { method: 'POST', credentials: 'include' })
//         .then(() => navigateTo('login'))
//         .catch(console.error);
// }

// Initial load
