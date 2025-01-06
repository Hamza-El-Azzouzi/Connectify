import { loginPage } from "./first_page.js";
import { feedPage , getCookieByName } from "./feed.js";
let hasIntegrity = false;

export function setIntegrity(val) {
    hasIntegrity = val;
}

const app = document.getElementById("main-content");

async function checkIntegrity() {
    const cookie = getCookieByName("sessionId");

    if (cookie) {
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

function logout() {
    fetch('/api/logout',)
        .then(() => NavigateTo('login'))
        .catch(console.error);
}

