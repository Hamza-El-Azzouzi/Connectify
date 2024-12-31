// Import modules for dynamic components
// import { renderLogin, renderFeed, renderCreatePost, renderMessages } from './components.js';
import { loginPage } from "./first_page.js";
import { feedPage } from "./feed.js";
let hasIntegrity = false;

export function setIntegrity(val) {
    hasIntegrity = val;
}

const app = document.getElementById("main-content");

async function checkIntegrity() {
    const cookie = document.cookie;
    if (cookie.includes("sessionId")) {
        try {
            const response = await fetch("/api/integrity", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "GET",
            });
            const reply = await response.json();
            if (reply.REplyMssg === "Done") {
                setIntegrity(true);
                return true;
            } else {
                setIntegrity(false);
                return false;
            }
        } catch (error) {
            console.error("Error checking integrity:", error);
            setIntegrity(false);
            return false;
        }
    } else {
        setIntegrity(false);
        return false;
    }
}

export function NavigateTo(page) {
    switch (page) {
        case "login":
            app.innerHTML = '';
            loginPage();
            break;
        case "feed":
            app.innerHTML = '';
            feedPage();
            break;
        default:
            app.innerHTML = '<h2>404 - Page Not Found</h2>';
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    
    const isLoggedIn = await checkIntegrity();
    if (isLoggedIn) {
        NavigateTo("feed");
    } else {
        NavigateTo("login");
    }
});

document.getElementById("navbar").addEventListener("click", async (e) => {
    const button = e.target;
    const page = button.dataset.page;
    if (page) {
        const isLoggedIn = hasIntegrity || (await checkIntegrity());
        if (page === "feed" && !isLoggedIn) {
            NavigateTo("login");
        } else {
            NavigateTo(page);
        }
    }
});

// Logout functionality
// function logout() {
//     fetch('/api/logout', { method: 'POST', credentials: 'include' })
//         .then(() => navigateTo('login'))
//         .catch(console.error);
// }

// Initial load
