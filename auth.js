// login
// server-side login
async function login() {
  try {
    const emailEl = document.getElementById("email");
    const passwordEl = document.getElementById("password");
    const email = emailEl ? emailEl.value : '';
    const password = passwordEl ? passwordEl.value : '';

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    const clientHash = await hashPassword(password);
    try { console.log('clientHash (login):', clientHash); } catch (e) {}
    const res = await fetch('http://127.0.0.1:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: clientHash })
    });
    if (res.ok) {
      try { localStorage.setItem('ph_current', email); localStorage.setItem('ph_session', '1'); } catch (e) {}
      setUser({ email });
      console.log('Login success for', email);
      console.log('ph_users after login:', localStorage.getItem('ph_users'));
      return true;
    } else {
      const err = await res.json().catch(() => ({}));
      console.log('Login failed response', res.status, err);
      alert('Invalid email or password.');
      return false;
    }
  } catch (err) {
    console.error('Unexpected error during login:', err);
    alert('An unexpected error occurred — check the console for details.');
    return false;
  }
}

window.login = login;

// set and get for user
function setUser(user) {
  try {
    // Multi-user support: maintain an array `ph_users` and current user `ph_current`.
    if (!user || !user.email) return;
    const raw = localStorage.getItem('ph_users');
    let users = [];
    try { users = raw ? JSON.parse(raw) : []; } catch (e) { users = []; }
    const idx = users.findIndex(u => u.email === user.email);
    if (idx >= 0) {
      users[idx] = Object.assign({}, users[idx], user);
    } else {
      users.push(user);
    }
    localStorage.setItem('ph_users', JSON.stringify(users));
    // keep a convenience copy for legacy code and debugging
    try { localStorage.setItem('ph_user', JSON.stringify(user)); } catch (e) {}
    try { console.log('setUser: saved ph_user for', user && user.email); } catch (e) {}
    try { localStorage.setItem('ph_debug_ph_user', JSON.stringify(user)); } catch (e) {}
    // mark this user as current
    try { localStorage.setItem('ph_current', user.email); } catch (e) {}
  } catch (err) {
    console.error('setUser: failed to save user', err);
    try { localStorage.setItem('ph_user', JSON.stringify(user)); } catch (e) {}
  }
}

function getUsers() {
  const raw = localStorage.getItem('ph_users');
  if (!raw) return [];
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : []; } catch (err) { return []; }
}

function saveUsers(users) {
  try { localStorage.setItem('ph_users', JSON.stringify(users)); } catch (e) {}
}

function getUser() {
  // Return the currently-signed-in user (ph_current -> ph_users)
  try {
    const current = localStorage.getItem('ph_current');
    if (current) {
      const users = getUsers();
      const found = users.find(u => u.email === current);
      if (found) return found;
    }
    // fallback to legacy single `ph_user`
    const raw = localStorage.getItem('ph_user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (err) {
    console.warn('getUser: error reading stored user', err);
    return null;
  }
}

// Remove a user from local `ph_users` (or remove the current user if no email provided).
// Returns true if a user was removed.
function deregister(email) {
  try {
    const target = email || localStorage.getItem('ph_current');
    if (!target) return false;
    const users = getUsers();
    const filtered = users.filter(u => u.email !== target);
    saveUsers(filtered);
    // clear current/session if it was the same user
    try {
      const current = localStorage.getItem('ph_current');
      if (current === target) {
        localStorage.removeItem('ph_current');
        localStorage.removeItem('ph_session');
      }
    } catch (e) {}
    // remove legacy/debug copies
    try { localStorage.removeItem('ph_user'); } catch (e) {}
    try { localStorage.removeItem('ph_debug_ph_user'); } catch (e) {}
    try { localStorage.removeItem('ph_debug'); } catch (e) {}
    return users.length !== filtered.length;
  } catch (err) {
    console.error('deregister: error', err);
    return false;
  }
}

window.deregister = deregister;


// register
function register() {
  // server-side registration
  return (async () => {
    try {
      const email = (document.getElementById("email") || {}).value;
      const password = (document.getElementById("password") || {}).value;
      const confirmPassword = (document.getElementById("cnfPassword") || {}).value;

      if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return false;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
      }

      const clientHash = await hashPassword(password);
      try { console.log('clientHash (register):', clientHash); } catch (e) {}
      const res = await fetch('http://127.0.0.1:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: clientHash })
      });
      if (res.status === 201) {
        // mark session locally and save user to ph_users
        console.log('Register 201 response for', email);
        try { localStorage.setItem('ph_current', email); localStorage.setItem('ph_session', '1'); } catch (e) {}
        setUser({ email });
        console.log('Register success for', email);
        console.log('ph_users after setUser:', localStorage.getItem('ph_users'));
        return true;
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err && err.error ? err.error : 'Registration failed');
        return false;
      }
    } catch (err) {
      console.error('Unexpected error in register():', err);
      alert('An unexpected error occurred during registration. See console for details.');
      return false;
    }
  })();
}


// logout
function logout() {
  // Clear session flag but keep stored user data; redirect to home page
  try { localStorage.removeItem('ph_session'); } catch (e) {}
  window.location.href = "index.html";
}

// check auth
function checkAuth() {
  const user = getUser();
  const session = localStorage.getItem('ph_session');
  if (!user || !session) {
    window.location.href = "login.html";
  }
}

// update header auth state
function updateHeaderAuth() {
  const user = getUser();
  const session = localStorage.getItem('ph_session');

  const guestLinks = document.getElementById("guestLinks");
  const userLinks = document.getElementById("userLinks");
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!guestLinks || !userLinks) return;

  if (user && session) {
    guestLinks.classList.add("hidden");
    userLinks.classList.remove("hidden");
    userEmail.textContent = user.email;
    logoutBtn.onclick = logout;
    const deregisterBtn = document.getElementById("deregisterBtn");
    if (deregisterBtn) {
      deregisterBtn.onclick = async function () {
        if (!user) return;
        const conf = confirm(`Delete account ${user.email}? This cannot be undone.`);
        if (!conf) return;
        try {
          const removed = deregister(user.email);
          if (removed) {
            alert('Account deleted.');
            updateHeaderAuth();
            window.location.href = 'index.html';
          } else {
            alert('Failed to delete account.');
          }
        } catch (err) {
          console.error('Error deleting account:', err);
          alert('An error occurred while deleting the account.');
        }
      };
    }
  } else {
    guestLinks.classList.remove("hidden");
    userLinks.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", updateHeaderAuth);

// Validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(String(email).toLowerCase());
}

// Hash password in browser using SHA-256 and return hex string
async function hashPassword(password) {
  if (!password) return '';
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

window.hashPassword = hashPassword;

// expose for inline use if needed
window.isValidEmail = isValidEmail;