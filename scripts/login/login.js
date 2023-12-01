import redirect from "../utils/redirect.js";


// form
const loginForm = document.querySelector(".login__form");

// Fields
const emailField = document.querySelector(".login__email-input");
const passwordField = document.querySelector(".login__password-input");

function handleTogglePassword() {
  // toggle the type attribute
  const icon = document.querySelector(".fa-solid");

  const type =
    passwordField.getAttribute("type") === "password" ? "text" : "password";
  const title = type === "password" ? "Show Password" : "Hide Password";

  passwordField.setAttribute("type", type);
  icon.setAttribute("title", title);

  // toggle the icon
  icon.classList.toggle("fa-eye-slash");
  icon.classList.toggle("fa-eye");
}

function createErrorElement(msg) {
  //  Create elements
  const errorElement = document.createElement("div");
  const errorParagraph = document.createElement("p");
  const errorIcon = document.createElement("i");

  //  assigning values
  errorElement.classList.add("error");
  errorParagraph.innerText = msg;
  errorIcon.classList.add("fa", "fa-exclamation-triangle");

  // appending to the div element
  errorElement.appendChild(errorIcon);
  errorElement.appendChild(errorParagraph);
  loginForm.insertBefore(errorElement, loginForm.lastElementChild);
}

function handleValidateForm(email, password) {
  // patterns for validation
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  // Test on values
  const isEmailValid = emailPattern.test(email);
  const isPasswordValid = passwordPattern.test(password);

  if (!isEmailValid) {
    emailField.classList.add("input--invalid");
    return "Invalid email format";
  }

  if (!isPasswordValid) {
    passwordField.classList.add("input--invalid");
    return "Password must be at least 8 characters long and include at least one digit, one lowercase, and one uppercase letter.";
  }

  return "valid";
}

// onSubmit
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Toggle the input error borders
  emailField.classList.remove("input--invalid");
  passwordField.classList.remove("input--invalid");

  // Remove the error element
  const errorElement = loginForm.querySelector(".error");
  if (errorElement) {
    loginForm.removeChild(errorElement);
  }
  // Fetching the users and check for login
  try {
    // Check for validation
    const validation = handleValidateForm(
      emailField.value,
      passwordField.value
    );

    if (validation !== "valid") {
      return createErrorElement(validation);
    }

    const response = await fetch("https://pheonix-backend-385c2453f5c2.herokuapp.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailField.value,
        password: passwordField.value,
      }),
    });
    if (response.ok) {
      const { token } = await response.json();

      // User maching
      if (token) {
        alert("Login successful");
        localStorage.setItem("token", `bearer ${token}`);
        redirect("/pages/dashboard");
      } else {
        emailField.classList.add("input--invalid");
        passwordField.classList.add("input--invalid");
        createErrorElement("Invalid username or password");
        passwordField.focus();
      }
    } else {
      const { message } = await response.json();

      createErrorElement(message);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});


// Event listener for eye icon
document
  .querySelector(".login__password > i")
  .addEventListener("click", () => handleTogglePassword());