import { NavigateTo, setIntegrity } from "./app.js";

export function loginPage() {
    // var link = document.querySelector('link[rel="stylesheet"]');
    // link.href = '/static/css/style.css';
    const app = document.getElementById("main-content");

    // Create the main container
    const mainDiv = document.createElement('div');
    mainDiv.className = 'main';

    // Checkbox input for toggling
    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.id = 'chk';
    checkboxInput.setAttribute('aria-hidden', 'true');
    mainDiv.appendChild(checkboxInput);

    // Signup container
    const signupDiv = document.createElement('div');
    signupDiv.className = 'signup';

    const signupForm = document.createElement('form');
    signupForm.name = "SignUp"
    signupForm.id = "SignUp"
    const signupLabel = document.createElement('label');
    signupLabel.setAttribute('for', 'chk');
    signupLabel.setAttribute('aria-hidden', 'true');
    signupLabel.textContent = 'Sign up';
    signupForm.appendChild(signupLabel);

    const signupInputs = [
        { type: 'text', name: 'first_name', placeholder: 'First Name', required: false },
        { type: 'text', name: 'last_name', placeholder: 'Last Name', required: false },
        { type: 'text', name: 'user_name', placeholder: 'User name', required: false },
        { type: '', name: 'gender', placeholder: 'Select your gender', required: false },
        { type: 'text', name: 'email', placeholder: 'Email', required: false },
        { type: 'text', name: 'age', placeholder: 'age', required: false },
        { type: 'password', name: 'pswd', placeholder: 'Password', required: false },
        { type: 'password', name: 'confpswd', placeholder: 'Confirme Password', required: false },
    ];
    let element = new Map()
    signupInputs.forEach(inputData => {
        const input = document.createElement('input');
        const errParagraph = document.createElement("p")
        errParagraph.id = inputData.name + "Err"
        Object.assign(input, inputData);
        if (inputData.name === "email"){
            const selectElemnt = document.createElement('select')
            selectElemnt.placeholder = "test"
            const optionMale = document.createElement('option')
            optionMale.value = "Male"
            optionMale.textContent= "Male"
            const optionFemale = document.createElement('option')
            optionFemale.value = "Female"
            optionFemale.textContent= "Female"
            selectElemnt.appendChild(optionMale)
            selectElemnt.appendChild(optionFemale)
            element["gender"] = selectElemnt
            signupForm.append(selectElemnt)
            
        }
        element[inputData.name] = input
            signupForm.appendChild(input);
        signupForm.appendChild(errParagraph)
    });
    console.log(element)
    const signupButton = document.createElement('button');
    signupButton.textContent = 'Sign up';
    signupForm.appendChild(signupButton);

    signupDiv.appendChild(signupForm);
    mainDiv.appendChild(signupDiv);

    // Login container
    const loginDiv = document.createElement('div');
    loginDiv.className = 'login';

    const loginForm = document.createElement('form');
    loginForm.name = "logIn"
    const loginLabel = document.createElement('label');
    loginLabel.setAttribute('for', 'chk');
    loginLabel.setAttribute('aria-hidden', 'true');
    loginLabel.textContent = 'Login';
    loginForm.appendChild(loginLabel);

    const loginInputs = [
        { type: 'text', name: 'emailOrUSername', placeholder: 'Ememail Or Usernameail', required: false },
        { type: 'password', name: 'pswdSignIn', placeholder: 'Password', required: false },
    ];

    loginInputs.forEach(inputData => {
        const input = document.createElement('input');
        Object.assign(input, inputData);
        loginForm.appendChild(input);
    });

    const loginButton = document.createElement('button');
    loginButton.textContent = 'Login';
    loginForm.appendChild(loginButton);

    loginDiv.appendChild(loginForm);
    mainDiv.appendChild(loginDiv);

    // Append the main container to the app
    app.appendChild(mainDiv);

    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // if (!VerifyData()) {
        fetch("/api/register", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                username: element["user_name"].value,
                age: element["age"].value,
                // gender: element["gender"].value,
                first_name: element["first_name"].value,
                last_name: element["last_name"].value,
                email: element["email"].value,
                password: element["pswd"].value,
                confirmPassword: element["confpswd"].value,
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
        // }
    });

    loginForm.addEventListener("submit", (event) => {

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




var ErrMessageFistName = null
var ErrMessageLastName = null
var ErrMessageName = null
var ErrMessageEmail = null
var ErrMessageAge = null
var ErrMessageEmailSignIn = null
var ErrMessageGender = null
var ErrMessagePasswd1st = null
var ErrMessagePasswd1stSignIn = null
var ErrMessageConfirmPasswd = null
var first_name = null
var last_name = null
var user_name = null
var age = null
var email = null
var emailOrUSername = null
var gender = null
var password = null
var passwordSignIn = null
var confirmepassword = null




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
    document.addEventListener("DOMContentLoaded", () => {



        ErrMessageFistName = document.getElementById("first_nameErr")
        ErrMessageLastName = document.getElementById("last_nameErr")
        ErrMessageName = document.getElementById("user_nameErr")
        ErrMessageEmail = document.getElementById("emailErr")
        ErrMessageAge = document.getElementById("ageErr")
        ErrMessageGender = document.getElementById('genderErr')
        ErrMessagePasswd1st = document.getElementById('pswdErr')
        ErrMessageConfirmPasswd = document.getElementById('confpswdErr')

        ErrMessageEmailSignIn = document.getElementById("emailErrSignIn")
        ErrMessagePasswd1stSignIn = document.getElementById('passwdErr1stSigIn')
        first_name = document.querySelector("input[name='first_name']")
        last_name = document.querySelector("input[name='last_name']")
        user_name = document.querySelector("input[name='user_name']")
        age = document.querySelector("input[name='age']")
        email = document.querySelector("input[name='email']")
        emailOrUSername = document.querySelector("input[name='emailOrUSername']")
        gender = document.querySelector("input[name='gender']")
        password = document.querySelector("input[name='pswd']")
        passwordSignIn = document.querySelector("input[name='pswdSignIn']")
        confirmepassword = document.querySelector("input[name='confpswd']")
    })
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
// console.log(ErrMessageFistName)
// document.addEventListener("DOMContentLoaded", () => {
//     var form = document.getElementById("SignUp");
//     console.log(form)

// })