const sessionKey = "secureauth_session";
let session = null;
try {
  session = JSON.parse(sessionStorage.getItem(sessionKey) || "null");
} catch {
  session = null;
}

// Protect direct access: no valid browser session means return to login.
if (!session || !session.username || !session.email) {
  window.location.replace("index.html");
} else {
  document.getElementById("welcome-name").textContent = session.username;
  document.getElementById("account-email").textContent = session.email;
}

document.getElementById("logout-button").addEventListener("click", () => {
  sessionStorage.removeItem(sessionKey);
  window.location.replace("index.html");
});
