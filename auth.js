const $ = (id) => document.getElementById(id);
const loginForm = $("login-form");
const registerForm = $("register-form");
const messageBox = $("message");

function showMessage(text, type = "error") {
  messageBox.textContent = text;
  messageBox.className = `message show ${type}`;
}
function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "message";
}
function getUsers() {
  try { return JSON.parse(localStorage.getItem("secureauth_users") || "[]"); }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem("secureauth_users", JSON.stringify(users));
}
function switchMode(mode) {
  const registering = mode === "register";
  loginForm.classList.toggle("hidden", registering);
  registerForm.classList.toggle("hidden", !registering);
  $("login-tab").classList.toggle("active", !registering);
  $("register-tab").classList.toggle("active", registering);
  $("login-tab").setAttribute("aria-selected", String(!registering));
  $("register-tab").setAttribute("aria-selected", String(registering));
  $("form-title").textContent = registering ? "Create your account" : "Welcome back";
  $("form-subtitle").textContent = registering ? "Fill in your details to get started." : "Sign in to continue to your dashboard.";
  clearMessage();
}
$("login-tab").addEventListener("click", () => switchMode("login"));
$("register-tab").addEventListener("click", () => switchMode("register"));

function passwordIsValid(password) {
  return password.length >= 8 && /\d/.test(password);
}
function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}
async function hashPassword(password, salt) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Secure hashing is unavailable. Open this project using VS Code Live Server or localhost.");
  }
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(digest);
}
function createSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();
  const username = $("reg-username").value.trim();
  const email = $("reg-email").value.trim().toLowerCase();
  const password = $("reg-password").value;
  const confirm = $("reg-confirm").value;

  if (!username || !email || !password || !confirm) return showMessage("Please fill in every field.");
  if (username.length < 3) return showMessage("Username must contain at least 3 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage("Please enter a valid email address.");
  if (!passwordIsValid(password)) return showMessage("Password must be at least 8 characters and contain at least one number.");
  if (password !== confirm) return showMessage("Passwords do not match.");

  const users = getUsers();
  const duplicate = users.some(user =>
    user.username.toLowerCase() === username.toLowerCase() ||
    user.email.toLowerCase() === email
  );
  if (duplicate) return showMessage("An account with that username or email already exists.");

  try {
    const salt = createSalt();
    const passwordHash = await hashPassword(password, salt);
    users.push({ username, email, salt, passwordHash });
    saveUsers(users);
    registerForm.reset();
    switchMode("login");
    $("login-identity").value = email;
    showMessage("Account created successfully. You can now log in.", "success");
  } catch (error) {
    showMessage(error.message || "Registration failed. Please try again.");
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();
  const identity = $("login-identity").value.trim().toLowerCase();
  const password = $("login-password").value;
  if (!identity || !password) return showMessage("Please enter your username/email and password.");

  try {
    const users = getUsers();
    const user = users.find(item =>
      item.username.toLowerCase() === identity || item.email.toLowerCase() === identity
    );
    // Keep the error generic so the page does not reveal which credential was incorrect.
    if (!user) return showMessage("Invalid username/email or password.");
    const attemptedHash = await hashPassword(password, user.salt);
    if (attemptedHash !== user.passwordHash) return showMessage("Invalid username/email or password.");

    sessionStorage.setItem("secureauth_session", JSON.stringify({
      username: user.username,
      email: user.email,
      loggedInAt: Date.now()
    }));
    window.location.href = "dashboard.html";
  } catch (error) {
    showMessage(error.message || "Login failed. Please try again.");
  }
});

// A previously authenticated session should go straight to the protected dashboard.
if (sessionStorage.getItem("secureauth_session")) {
  window.location.replace("dashboard.html");
}
