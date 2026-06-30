const USERNAME = "admin";
const PASSWORD = "12345";

document.getElementById("loginBtn").addEventListener("click", () => {

    const user = document.getElementById("username").value;

    const pass = document.getElementById("password").value;

    if (user === USERNAME && pass === PASSWORD) {

        localStorage.setItem("adminLoggedIn", "true");

        window.location = "dashboard.html";

    } else {

        document.getElementById("error").textContent = "Invalid Username or Password";

    }

});