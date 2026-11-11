# SecureAuth – Login Authentication System

**Internship:** Oasis Infobyte – Web Development  
**Task:** Task 4 – Login Authentication System  
**Approach:** Front-end only (HTML, CSS and JavaScript)

## 1. Project overview
SecureAuth is a client-side demonstration of user registration, login validation and a protected dashboard. It uses browser `localStorage` to retain registered demo accounts and `sessionStorage` to maintain the current login session.

## 2. Features
- Registration with username, email, password and confirmation.
- Required-field and email validation.
- Password rule: minimum 8 characters and at least one number.
- Duplicate username/email detection (case-insensitive).
- Password hashing with SHA-256 and a random per-user salt using the Web Crypto API.
- Login using username or email.
- Generic invalid-credentials message.
- Protected dashboard: unauthenticated direct access redirects to login.
- Logout clears the current session and redirects to login.
- Responsive layout for desktop and mobile.

## 3. Folder structure
```text
Chandini_Task4/
├── index.html
├── dashboard.html
├── style.css
├── auth.js
├── dashboard.js
├── README.md
└── .gitignore
```

## 4. How to run
1. Extract the ZIP file.
2. Open the `Chandini_Task4` folder in Visual Studio Code.
3. Install the **Live Server** extension if it is not already installed.
4. Right-click `index.html` and select **Open with Live Server**.
5. The app opens in your browser (usually at a localhost address).
6. Register a new account, then log in using its username or email.

**Important:** Run through Live Server or another localhost/HTTPS origin. Do not open the HTML file directly with `file://`, because browser Web Crypto support may be unavailable there.

## 5. Test cases
| Test | Action | Expected result |
|---|---|---|
| Empty registration | Submit blank form | Required-field error |
| Short password | Enter fewer than 8 characters | Password validation error |
| No number | Enter 8+ characters without a digit | Password validation error |
| Duplicate account | Register same username/email again | Duplicate account error |
| Valid registration | Enter valid unique details | Success message; switches to login |
| Wrong password | Enter an incorrect password | Generic invalid-credentials error |
| Valid login | Enter correct username/email and password | Dashboard opens |
| Direct dashboard access | Open dashboard without a session | Redirects to login |
| Logout | Click Log out | Session cleared; returns to login |

## 6. Security note and limitations
This is a **front-end educational demo**, not a production authentication service. Browser storage is controlled by the user and JavaScript running on the same origin can access it. A client-side dashboard check can be bypassed by a technically capable user. SHA-256 is included to demonstrate hashing, but it is not a password-specific key derivation function. Production systems should authenticate on a server, use HTTPS, store passwords with Argon2id or bcrypt (with appropriate parameters), apply rate limiting, and use secure server-managed sessions or cookies.

Do not use a real or reused password for this demonstration. Use a test account only.

## 7. Technologies
- HTML5
- CSS3
- JavaScript (ES6)
- Web Crypto API (SHA-256)
- localStorage and sessionStorage

## 8. Repository
Create a GitHub repository named `OIBSIP` as instructed by the internship guidelines. Upload this project in a folder named `Chandini_Task4` and include the repository URL in the official submission form.

## 9. Submission filename
`Chandini_Task4.zip`
