// Import modules for dynamic components
// import { renderLogin, renderFeed, renderCreatePost, renderMessages } from './components.js';
import { loginPage } from "./first_page.js";
const app = document.getElementById("main-content");

// Manage navigation
function navigateTo(page) {
    switch (page) {
        case 'login':
            app.innerHTML = '';
            loginPage();
            break;
        // case 'feed':
        //     app.innerHTML = '';
        //     renderFeed();
        //     break;
        // case 'create-post':
        //     app.innerHTML = '';
        //     renderCreatePost();
        //     break;
        // case 'private-messages':
        //     app.innerHTML = '';
        //     renderMessages();
        //     break;
        default:
            app.innerHTML = '<h2>404 - Page Not Found</h2>';
    }
}

// Logout functionality
// function logout() {
//     fetch('/api/logout', { method: 'POST', credentials: 'include' })
//         .then(() => navigateTo('login'))
//         .catch(console.error);
// }

// Initial load
navigateTo('login');
