# 🛡️ KynexAuth JavaScript (Node.js) SDK & Console Example

[![Node.js](https://img.shields.io/badge/Node.js-16.0%2B%20%7C%2018.0%2B%20%7C%2020.0%2B%20%7C%2022.0%2B-green.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey.svg)](https://microsoft.com/windows)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Standard%20Library)-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Official, zero-dependency JavaScript / Node.js implementation for the **[KynexAuth](https://kynexauth.com)** authentication and licensing API. 100% compatible with the C#, C++, and Python specification.

---

## 📁 Repository Structure

```
js Example/
├── 📄 kynexauth.js     # Core JavaScript SDK Client Library (Zero external dependencies)
├── 📄 index.js         # Cyberpunk-styled Console Loader application
├── 📄 build_exe.bat    # 1-Click Standalone .EXE Compiler
├── 📄 package.json     # Node.js project manifest
├── 📄 .gitignore       # Standard git ignore file
└── 📄 README.md        # Setup & Integration Documentation
```

---

## 🔑 Step 1: Obtain Credentials from KynexAuth Dashboard

1. Sign in to your **[KynexAuth Developer Dashboard](https://kynexauth.com)**.
2. Navigate to the **Applications** page.
3. Retrieve your application credentials:
   * **Application Name** (e.g., `MyApplication`)
   * **Application Key / Owner ID** (e.g., `Z2zapMIjyB2nkw7ahr`)
   * **Application Version** (e.g., `1.0`)

---

## ⚙️ Step 2: Configure Credentials in Code

Open `index.js` and set your credentials:

```javascript
const { KynexAuth } = require('./kynexauth');

// -------------------------------------------------------------
// CONFIGURE YOUR APPLICATION CREDENTIALS
// -------------------------------------------------------------
const kynexAuth = new KynexAuth({
    name: 'YOUR_APP_NAME',       // Application Name from dashboard
    ownerId: 'YOUR_APP_KEY',     // Application Key (Owner ID)
    version: '1.0',              // Application Version
    url: 'https://kynexauth.com/api/v1/client',
});
```

---

## 🖥️ Running the Console Example

1. Open your terminal in the `js Example` directory:
   ```bash
   cd "js Example"
   ```
2. Start the loader:
   ```bash
   npm start
   # or
   node index.js
   ```
3. **Features:**
   * Cyberpunk ANSI styling with rotating braille loading animation.
   * `[1] LOGIN` — Authenticate using username and password.
   * `[2] REGISTER` — Create a new account with a license key.
   * `[3] UPGRADE` — Extend an existing user's subscription.
   * `[4] LICENSE KEY ONLY` — Fast instant access via license key.
   * Automatic **Windows User SID** (`S-1-5-21-...`) hardware ID detection.
   * Background session watchdog monitoring.

---

## 📦 Compiling to Standalone Windows `.EXE`

To convert your JavaScript / Node.js loader into a standalone single `.exe` binary that runs on any Windows PC without needing Node.js installed:

1. Double-click **`build_exe.bat`** in the `js Example` folder.
2. The compilation will complete and output the single executable to the **`dist/`** directory:
   * **Console Binary:** `dist/KynexAuth_Console.exe`

Alternatively, build manually using npx:
```bash
npx pkg -t node16-win-x64 index.js -o dist/KynexAuth_Console.exe
```

---

## 📚 Complete SDK API Reference

| Method | Description | Example Usage |
| :--- | :--- | :--- |
| `app.init()` | Initializes connection with server and retrieves session token. | `await app.init()` |
| `app.login(username, password)` | Authenticates user credentials and binds HWID. | `await app.login("john", "pass123")` |
| `app.register(username, password, key, email="")` | Creates new user account by redeeming license key. | `await app.register("john", "pass123", "KEY-XXXX")` |
| `app.license(key)` | Authenticates using license key only. | `await app.license("KEY-XXXX")` |
| `app.upgrade(username, key)` | Extends subscription duration for existing user. | `await app.upgrade("john", "KEY-XXXX")` |
| `app.check()` | Verifies that session token is still valid. | `if (!await app.check()) process.exit(1)` |
| `app.getvar(var_name)` | Fetches a secure server-side secret variable. | `const secret = await app.getvar("cheat_offset")` |
| `app.setvar(var_name, var_data)` | Sets a server-side variable. | `await app.setvar("user_config", "data")` |
| `app.log(message)` | Sends a security or activity log directly to the dashboard. | `await app.log("User initialized cheat")` |
| `app.ban(reason)` | Instantly bans the current user and HWID. | `await app.ban("Memory tamper detected")` |
| `app.webhook(id, params)` | Executes a server-side webhook securely. | `await app.webhook("12345", "arg=val")` |
| `app.chatget(channel)` | Fetches messages from a chat channel. | `const msgs = await app.chatget("general")` |
| `app.chatsend(message, channel)` | Sends a chat message to a channel. | `await app.chatsend("Hello!", "general")` |
| `app.get_hwid()` | Returns the real Windows User SID (`S-1-5-...`). | `const sid = app.get_hwid()` |
| `app.logout()` | Invalids and revokes the active session token. | `await app.logout()` |

---

## 🔒 Implementing Your Protected Application Payload

Execute your protected code immediately after authentication validation:

```javascript
if (KynexAuthApp.response.success) {
    console.log("[+] Authentication Successful! Initializing protected payload...");
    
    // -------------------------------------------------------------
    // PLACE YOUR MAIN SCRIPT / AUTOMATION / PAYLOAD HERE:
    // -------------------------------------------------------------
    // const cheat = require('./protectedModule');
    // cheat.start();
}
```

---

## 🛡️ Security Best Practices

1. **Native HWID Binding**: Hardware IDs are automatically generated using native Win32 security APIs, matching the C#, C++, and Python authentication security model.
2. **Session Heartbeat**: Keep the background session interval active to detect real-time user bans and license revocations.
