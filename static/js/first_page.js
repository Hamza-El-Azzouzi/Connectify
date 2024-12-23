export function loginPage() {
    const app = document.getElementById("main-content");
    const container = document.createElement('div');
    container.className = 'container';
    container.id = 'container';

    // Create sign-up form
    const signUpForm = document.createElement('div');
    signUpForm.className = 'form-container sign-up';

    const signUpFormContent = `
        <form class="singUpForm">
            <h1>Create Account</h1>
            <input type="text" name = "first_name" placeholder="First Name">
             <p id="firstNameErr"></p>
            <input type="text" name = "last_name" placeholder="Last Name">
             <p id="lastNameErr"></p>
            <input type="text" name = "user_name" placeholder="User Name">
             <p id="nameErr"></p>
            <input type="email" name = "email" placeholder="Email">
             <p id="emailErr"></p>
            <input type="text" name = "age" placeholder="Age">
             <p id="ageErr"></p>
            <div class="radio-group">
                <label>
                    <input type="radio" name="gender" value="Male"> Male
                </label>
                <label>
                    <input type="radio" name="gender" value="Female"> Female
                </label>
            </div>
             <p id="genderErr"></p>
            <input type="password" name="password" placeholder="Password">
             <p id="passwdErr1st"></p>
             <input type="password" name="confirmepassword" placeholder="Confirme Password">
              <p id="confirmPasswdErr"></p>
               <input type="submit" value="Continue">
  
        </form>
    `;
    // <button class="singUpbtn" type="submit">Sign Up</button>
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





const Err = document.getElementById("otherErr")

const ExpUserName = /^[a-zA-Z0-9_.]{3,20}$/
const ExpName = /^[a-zA-Z]{3,20}$/
const ExpAge = /^[1-9]{1,3}$/
const ExpEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const ExpPasswd = /^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[0-9]))(?=(.*[^a-zA-Z0-9]))(.{8,20})$/

const InvalidPsswd = () => {
    ErrMessagePasswd1st.innerHTML = `<h4 style="text-align: center">--------Password Requirements--------</h4>
    <ul>
        <li>At least one <strong>lowercase letter</strong> (a-z)</li>
        <li>At least one <strong>uppercase letter</strong> (A-Z)</li>
        <li>At least one <strong>digit</strong> (0-9)</li>
        <li>At least one <strong>special character</strong> (anything not a letter or a digit)</li>
        <li>Password must be at least <strong>8 characters long</strong></li>
    </ul>`
    ErrMessagePasswd1st.style.textAlign = "left"
    ErrMessagePasswd1st.style.color = "red"
    ErrMessagePasswd1st.style.marginTop = "0px"
}
const InvalidFirstName = "Invalid First Name!!"
const InvalidLastName = "Invalid Last Name!!"
const InvalidEmail = "Invalid Email!!"
const InvalidAge = "Invalid Age!!"
const InvalidGender = "Invalid Gender!!"
const InvalidName = "Invalid Name!!"
const NotMatch = "Password Confirmation doesn't match!!"
const VerifyData = () => {
    let exist = false
    document.addEventListener("DOMContentLoaded", () => {
        const ErrMessageFistName = document.getElementById("firstNameErr")
        const ErrMessageLastName = document.getElementById("lastNameErr")
        const ErrMessageName = document.getElementById("nameErr")

        const ErrMessageEmail = document.getElementById("emailErr")
        const ErrMessageAge = document.getElementById("ageErr")
        const ErrMessageGender = document.getElementById('genderErr')

        const ErrMessagePasswd1st = document.getElementById("passwdErr1st")
        const ErrMessageConfirmPasswd = document.getElementById('confirmPasswdErr')
        ErrMessageFistName.textContent = ""
        ErrMessageLastName.textContent = ""
        ErrMessageName.textContent = ""
        ErrMessageEmail.textContent = ""
        ErrMessageAge.textContent = ""
        ErrMessageGender.textContent = ""
        ErrMessageConfirmPasswd.textContent = ""
        ErrMessagePasswd1st.textContent = ""
        Err.textContent = ""

        switch (true) {
            case (!ExpName.test(first_name.value)):
                Error(ErrMessageFistName, InvalidFirstName)
                exist = true
                break
            case (!ExpName.test(last_name.value)):
                Error(ErrMessageName, InvalidLastName)
                exist = true
                break

            case (gender.value !== "Male" || gender.value !== "Female"):
                Error(ErrMessageName, InvalidGender)
                exist = true
                break
            case (!ExpAge.test(age.value)):
                Error(ErrMessageName, InvalidAge)
                exist = true
                break
            case (!ExpUserName.test(user_name.value)):
                Error(ErrMessageName, InvalidName)
                exist = true
                break
            case (!ExpEmail.test(email.value)):
                Error(ErrMessageEmail, InvalidEmail)
                exist = true
                break
            case (!ExpPasswd.test(password.value)):
                InvalidPsswd()
                exist = true
                break
            case (password.value !== confirmepassword.value):
                Error(ErrMessageConfirmPasswd, NotMatch)
                exist = true
        }
        return exist
    })

}
document.addEventListener("DOMContentLoaded", () => {
    const first_name = document.querySelector("input[name='first_name']")
    const last_name = document.querySelector("input[name='last_name']")
    const user_name = document.querySelector("input[name='user_name']")
    const age = document.querySelector("input[name='age']")
    const email = document.querySelector("input[name='email']")
    const gender = document.querySelector("input[name='gender']")
    const password = document.querySelector("input[name='password']")
    const confirmepassword = document.querySelector("input[name='confirmepassword']")
    const form = document.querySelector(".singUpForm");

    form.action = "/api/register";

    // Attach submit event listener
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!VerifyData()) {
            fetch("/api/register", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    username: user_name.value,
                    age: age.value,
                    gender: gender.value,
                    first_name: first_name.value,
                    last_name: last_name.value,
                    email:email.value,
                    password:password.value,
                    confirmPassword: confirmepassword.value,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to submit data");
                    }
                    return response.json();
                })
                .then((reply) => {
                    switch (true) {
                        case reply.REplyMssg === "session":
                            Error(Err, "You already have an active session");
                            break;
                        case reply.REplyMssg === "Done":
                            console.log("Registered successfully");
                            // Uncomment to redirect
                            // window.location.href = "/login";
                            break;
                        case reply.REplyMssg === "email":
                            Error(ErrMessageEmail, "Email already exists!");
                            break;
                        case reply.REplyMssg === "user":
                            Error(ErrMessageName, "Username already exists!");
                            break;
                        case reply.REplyMssg === "passwd":
                            Error(ErrMessagePasswd1st, "Password too long!");
                            break;
                        case reply.REplyMssg === "notMatch":
                            Error(ErrMessageConfirmPasswd, NotMatch);
                            break;
                        case reply.REplyMssg === "password":
                            Error(ErrMessagePasswd1st, "Password too long!");
                            break;
                        default:
                            Error(Err, "An unknown error occurred.");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    Error(Err, "Failed to register. Please try again later.");
                });
        }
    });
});
