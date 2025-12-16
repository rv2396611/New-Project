// login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // Add your authentication logic here
  console.log(`Logging in with email: ${email} and password: ${password}`);
  if(email === "admin@example.com" && password === "password") { 
    // alert("Login successful!");
    setUser({ email });
  } else {
        alert("Invalid email or password.");
        return;
  }
  
}

// set and get for user
function setUser(user) {
  localStorage.setItem("ph_user", JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem("ph_user");
  return user ? JSON.parse(user) : null;
}


// register
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("cnfPassword").value;
    // Add your registration logic here
    if(password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    console.log(`Registering with email: ${email} and password: ${password}`);
    // alert("Registration successful!");
    setUser({ email });
}


// logout
function logout() {
  localStorage.removeItem("ph_user");
  window.location.href = "login.html";
}

// check auth
function checkAuth() {
  const user = getUser();
    if (!user) {
        window.location.href = "login.html";
    }
}

// update header auth state
function updateHeaderAuth() {
  const user = getUser();

  const guestLinks = document.getElementById("guestLinks");
  const userLinks = document.getElementById("userLinks");
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!guestLinks || !userLinks) return;

  if (user) {
    guestLinks.classList.add("hidden");
    userLinks.classList.remove("hidden");
    userEmail.textContent = user.email;
    logoutBtn.onclick = logout;
  } else {
    guestLinks.classList.remove("hidden");
    userLinks.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", updateHeaderAuth);