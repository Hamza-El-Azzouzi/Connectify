// Import modules for dynamic components
// import { renderLogin, renderFeed, renderCreatePost, renderMessages } from './components.js';
import { loginPage } from "./first_page.js";
import { feedPage } from "./feed.js";
var cookie = document.cookie
const app = document.getElementById("main-content");

// Manage navigation
export function NavigateTo(page) {
    // const cookie = document.cookie
    // console.log(cookie)
    switch (page) {
        case 'login':
            app.innerHTML = '';
            loginPage()

            break;
        case 'feed':
            console.log(cookie)
            app.innerHTML = '';
            feedPage();
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



// console.log(cookie)
if (cookie.includes("sessionId")) {
    NavigateTo('feed');
} else {
    NavigateTo('login');
}


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
