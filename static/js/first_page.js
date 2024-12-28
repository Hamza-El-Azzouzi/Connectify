import { NavigateTo, setIntegrity } from "./app.js";

export function loginPage() {
    var link  = document.querySelector('link[rel="stylesheet"]');
    link.href = '/static/css/style.css';
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
             <p id="firstNameErr" class="err"></p>
            <input type="text" name = "last_name" placeholder="Last Name">
             <p id="lastNameErr" class="err"></p>
            <input type="text" name = "user_name" placeholder="User Name">
             <p id="nameErr" class="err"></p>
            <input type="text" name = "email" placeholder="Email">
             <p id="emailErr" class="err"></p>
            <input type="text" name = "age" placeholder="Age">
             <p id="ageErr" class="err"></p>
            <div class="radio-group">
                <label>
                    <input type="radio" name="gender" value="Male"> Male
                </label>
                <label>
                    <input type="radio" name="gender" value="Female"> Female
                </label>
            </div>
             <p id="genderErr" class="err"></p>
            <input type="password" name="password" placeholder="Password">
             <p id="passwdErr1st" class="err"></p>
             <input type="password" name="confirmepassword" placeholder="Confirme Password">
              <p id="confirmPasswdErr" class="err"></p>
               <input type="submit" value="Continue">
  
        </form>
    `;
    // <button class="singUpbtn" type="submit">Sign Up</button>
    signUpForm.innerHTML = signUpFormContent;

    // Create sign-in form
    const signInForm = document.createElement('div');
    signInForm.className = 'form-container sign-in';

    const signInFormContent = `
        <form class="singInForm">
            <h1>Sign In</h1>
            <span>or use your email password</span>
             <input type="text" name ="emailOrUSername" placeholder="Email Or Username">
              <p id="emailErrSignIn" class="err"></p>
           <input type="password" name="passwordSigne" placeholder="Password">
           <p id="passwdErr1stSigIn" class="err"></p>
           <input type="submit" value="Sign In">
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



let ErrMessageFistName = null
let ErrMessageLastName = null
let ErrMessageName = null
let ErrMessageEmail = null
let ErrMessageAge = null
let ErrMessageEmailSignIn= null
let ErrMessageGender = null
let ErrMessagePasswd1st = null
let ErrMessagePasswd1stSignIn = null
let ErrMessageConfirmPasswd = null
let first_name = null
let last_name = null
let user_name = null
let age = null
let email = null
let emailOrUSername = null
let gender = null
let password = null
let passwordSignIn= null
let confirmepassword = null



document.addEventListener("DOMContentLoaded", () => {
    ErrMessageFistName = document.getElementById("firstNameErr")
    ErrMessageLastName = document.getElementById("lastNameErr")
    ErrMessageName = document.getElementById("nameErr")

    ErrMessageEmail = document.getElementById("emailErr")
    ErrMessageEmailSignIn = document.getElementById("emailErrSignIn")
    ErrMessageAge = document.getElementById("ageErr")
    ErrMessageGender = document.getElementById('genderErr')
    ErrMessagePasswd1st = document.getElementById('passwdErr1st')
    ErrMessagePasswd1stSignIn  = document.getElementById('passwdErr1stSigIn')
    ErrMessageConfirmPasswd = document.getElementById('confirmPasswdErr')
    first_name = document.querySelector("input[name='first_name']")
    last_name = document.querySelector("input[name='last_name']")
    user_name = document.querySelector("input[name='user_name']")
    age = document.querySelector("input[name='age']")
    email = document.querySelector("input[name='email']")
    emailOrUSername = document.querySelector("input[name='emailOrUSername']")
    gender = document.querySelector("input[name='gender']")
    password = document.querySelector("input[name='password']")
    passwordSignIn = document.querySelector("input[name='passwordSigne']")
    confirmepassword = document.querySelector("input[name='confirmepassword']")
})

const Err = document.getElementById("otherErr")

const ExpUserName = /^[a-zA-Z0-9_.]{3,20}$/
const ExpName = /^[a-zA-Z]{3,20}$/
const ExpAge = /^(1[6-9]|[2-9][0-9]|1[01][0-9]|120)$/;
const ExpEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const ExpPasswd = /^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[0-9]))(?=(.*[^a-zA-Z0-9]))(.{8,20})$/

const InvalidFirstName = "Invalid First Name!!"
const InvalidLastName = "Invalid Last Name!!"
const InvalidEmail = "Invalid Email!!"
const InvalidAge = "Invalid Age!!"
const InvalidGender = "Invalid Gender!!"
const InvalidName = "Invalid Name!!"
const InvalidPassWord = "Inavli Password!!"
const NotMatch = "Password Confirmation doesn't match!!"
const VerifyData = () => {
    let exist = false
    ErrMessageFistName.textContent = ""
    ErrMessageLastName.textContent = ""
    ErrMessageName.textContent = ""
    ErrMessageEmail.textContent = ""
    ErrMessageAge.textContent = ""
    ErrMessageGender.textContent = ""
    ErrMessageConfirmPasswd.textContent = ""
    ErrMessagePasswd1st.textContent = ""

    if (!ExpName.test(first_name.value)) {
        ErrMessageFistName.textContent = InvalidFirstName

        exist = true
    }

    if (!ExpName.test(last_name.value)) {
        ErrMessageLastName.textContent = InvalidLastName

        exist = true
    }

    if (gender.value !== "Male" && gender.value !== "Female") {
        ErrMessageGender.textContent = InvalidGender

        exist = true
    }

    if (!ExpAge.test(age.value)) {
        ErrMessageAge.textContent = InvalidAge
        exist = true
    }


    if (!ExpUserName.test(user_name.value)) {
        ErrMessageName.textContent = InvalidName

        exist = true
    }


    if (!ExpEmail.test(email.value)) {
        console.log("email")
        ErrMessageEmail.textContent = InvalidEmail

        exist = true
    }


    if (!ExpPasswd.test(password.value)) {
        console.log("password")
        ErrMessagePasswd1st.textContent = InvalidPassWord
        exist = true
    }


    if (password.value !== confirmepassword.value) {
        console.log("confirm")
        ErrMessagePasswd1st.textContent = NotMatch
        //
        exist = true
    }

    return exist


}
function VerifyLogin() {

    let exist = false
    let emailOrUSernameValue = emailOrUSername.value
    let passwordValue = passwordSignIn.value
    ErrMessageEmailSignIn.textContent = ""
    ErrMessagePasswd1stSignIn.textContent = ""
    if (emailOrUSernameValue.length === 0) {
        ErrMessageEmailSignIn.textContent = "Invalid Email Or User Name"
        console.log("f")
        exist = true
    }
    console.log(passwordValue)
    if (passwordValue.length === 0) {
        ErrMessagePasswd1stSignIn.textContent = "Invalid PassWord"
        exist = true
    }
    return exist
}
document.addEventListener("DOMContentLoaded", () => {
    let form = document.querySelector(".singUpForm");
    let formSignIn = document.querySelector(".singInForm");
    if (form) {
        form.action = "/api/register";
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
                        email: email.value,
                        password: password.value,
                        confirmPassword: confirmepassword.value,
                    }),
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((reply) => {
                        console.log(reply)

                        if (reply.REplyMssg === "Done") {
                            console.log("Registered successfully");
                            NavigateTo("feed")
                        }
                        if (reply.REplyMssg === "email") {

                            ErrMessageEmail.textContent = "Email already exists!"
                        }
                        if (reply.REplyMssg === "user") {

                            ErrMessageName.textContent = "Username already exists!"
                        }
                        if (reply.REplyMssg === "passwd") {

                            ErrMessagePasswd1st.textContent = "Password too long!"
                        }

                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        Error(Err, "Failed to register. Please try again later.");
                    });
            }
        });
    } 
    if (formSignIn) {
        console.log(formSignIn)
        formSignIn.action = "/api/login"
        formSignIn.addEventListener("submit", (event) => {

            event.preventDefault()
            console.log(formSignIn)
            if (!VerifyLogin()) {
                fetch("/api/login", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({ emailOrUSername: emailOrUSername.value, password: passwordSignIn.value, })
                }).then(response => response.json())
                    .then(reply => {
                        switch (true) {
                            case (reply.REplyMssg == "Done"):
                                setIntegrity(true)
                                NavigateTo("feed")
                                break
                            case (reply.REplyMssg == "email"):

                                ErrMessageEmail.textContent = "email not found!!, create an account"
                                break
                            case (reply.REplyMssg == "passwd"):
                                ErrMessagePasswd1st.textContent = "incorrect Password!!, Try Again"
                        }
                    })
            }


        })
    }
});
