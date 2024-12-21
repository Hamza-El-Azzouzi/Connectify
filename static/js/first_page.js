export function loginPage(){
    const app = document.getElementById("main-content");
    const container = document.createElement('div');
    container.className = 'container';
    container.id = 'container';
    
    // Create sign-up form
    const signUpForm = document.createElement('div');
    signUpForm.className = 'form-container sign-up';
    
    const signUpFormContent = `
        <form>
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name">
            <input type="email" placeholder="Email">
            <input type="password" placeholder="Password">
            <button>Sign Up</button>
        </form>
    `;
    signUpForm.innerHTML = signUpFormContent;
    
    // Create sign-in form
    const signInForm = document.createElement('div');
    signInForm.className = 'form-container sign-in';
    
    const signInFormContent = `
        <form>
            <h1>Sign In</h1>
            <span>or use your email password</span>
            <input type="email" placeholder="Email">
            <input type="password" placeholder="Password">
            <a href="#">Forget Your Password?</a>
            <button>Sign In</button>
        </form>
    `;
    signInForm.innerHTML = signInFormContent;
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'toggle-container';
    
    const toggleContent = `
        <div class="toggle">    
            <div class="toggle-panel toggle-left">
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all of site features</p>
                <button class="hidden" id="login">Sign In</button>
            </div>
            <div class="toggle-panel toggle-right">
                <h1>Hello, Friend!</h1>
                <p>Register with your personal details to use all of site features</p>
                <button class="hidden" id="register">Sign Up</button>
            </div>
        </div>
    `;
    toggleContainer.innerHTML = toggleContent;
    
    // Append forms and toggle to container
    container.appendChild(signUpForm);
    container.appendChild(signInForm);
    container.appendChild(toggleContainer);
    
    // Append container to body
    app.appendChild(container);    

    
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
    
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
}
