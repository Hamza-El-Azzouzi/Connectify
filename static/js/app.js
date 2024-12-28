// Import modules for dynamic components
// import { renderLogin, renderFeed, renderCreatePost, renderMessages } from './components.js';
import { loginPage } from "./first_page.js";
var cookie = document.cookie
var hasIntegrity = false
export function setIntegrity(val){
    hasIntegrity =  val
}
const app = document.getElementById("main-content");
function checkIntegrity(){
    
    if (cookie.includes("sessionId")) {
        fetch("/api/integrity", {
            headers: {
                "Content-Type": "application/json",
            }, method: "GET"
        }).then(response => { return response.json() }).then((reply) => {
            if (reply.REplyMssg === "Done") {
                NavigateTo('feed')
                return true
            } else {
                NavigateTo('login')
                return false
            }
        })
    }else{
        NavigateTo("login")
       return false
    }
}

hasIntegrity = checkIntegrity()
export function NavigateTo(page) {

    switch (page) {
        case "login":
            if (!hasIntegrity){
                console.log("login", hasIntegrity)
                app.innerHTML = '';
                loginPage()
                break;
            }else{
                NavigateTo("feed")
            }
            
        case 'feed':
            if (!hasIntegrity) {
                NavigateTo('login')
                return
            }
            console.log("feed", hasIntegrity)
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



// console.log(cookie)



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
