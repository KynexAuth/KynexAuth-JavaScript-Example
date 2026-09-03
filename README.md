# 🛡️ KynexAuth JavaScript (Node.js & Web) SDK & Examples

[![Node.js](https://img.shields.io/badge/Node.js-16.0%2B%20%7C%2018.0%20%7C%2020.0%20%7C%2022.0%2B-green.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey.svg)](https://microsoft.com/windows)
[![Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Native%20JS)-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Official, zero-dependency JavaScript SDK, Cyberpunk Node.js CLI loader, and standalone 3D Web Authentication portal for the **[KynexAuth](https://kynexauth.com)** security API. 100% compatible with C#, C++, Python, and PHP SDK specifications.

---

## 📁 Repository Structure

```
js Example/
├── 📂 ConsoleExample/       # Cyberpunk Node.js CLI Loader & Standalone .EXE
│   ├── 📄 kynexauth.js     # Core JavaScript SDK Client Library (Zero external dependencies)
│   ├── 📄 index.js         # Cyberpunk-styled Console Loader application
│   ├── 📄 build_exe.bat    # 1-Click Standalone Windows .EXE Compiler
│   └── 📄 package.json     # Node.js project manifest
│
├── 📂 WebExample/           # 3D Holographic Web Application (Node.js Web Server)
│   ├── 📄 kynexauth.js     # Core JavaScript SDK Client Library
│   ├── 📄 server.js        # Zero-Dependency Node.js Web Server
│   ├── 📄 index.html       # 3D Canvas Particle Web Portal UI
│   └── 📄 start_web.bat    # 1-Click Web Application Launcher
│
├── 📄 package.json         # Root Node.js manifest
├── 📄 .gitignore           # Standard git ignore file
└── 📄 README.md            # Integration Documentation
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

## 🖥️ Option A: Running the Console Example

1. Open your terminal in `ConsoleExample/`:
   ```bash
   cd "js Example/ConsoleExample"
   ```
2. Start the loader:
   ```bash
   node index.js
   ```
3. **Build to Standalone Windows `.EXE`:**
   * Double-click **`build_exe.bat`** in `ConsoleExample/` to generate `dist/KynexAuth_Console.exe` which runs on any Windows machine without Node.js installed!

---

## 🌐 Option B: Running the 3D Web Application Example

1. Open `WebExample/` directory:
   ```bash
   cd "js Example/WebExample"
   ```
2. Launch the web server:
   * Double-click **`start_web.bat`** on Windows (starts Node.js web server and opens browser at `http://localhost:3000`).
   * Or run manually:
     ```bash
     node server.js
     ```
3. **Features:**
   * **Pure Node.js Backend Server (`server.js`)**: Powered by `kynexauth.js` with zero CORS restrictions.
   * Interactive **3D Canvas Particle Network** reacting to mouse movements.
   * Holographic Glassmorphism card with multi-tab interface (Login, Register, License Key, Upgrade).
   * Real-time user HUD dashboard with real public IP and hardware ID.

---

## 📚 Complete SDK API Reference

| Method | Description | Example Usage |
| :--- | :--- | :--- |
| `init()` | Establishes secure connection & session handshake | `await app.init();` |
| `login(user, pass)` | Authenticates user and locks machine HWID | `await app.login("user", "pass");` |
| `register(user, pass, key, email)` | Registers new account with a license key | `await app.register("user", "pass", "KEY", "email");` |
| `license(key)` | Instant fast access via license key | `await app.license("KEY-XXXX");` |
| `upgrade(user, key)` | Extends account subscription duration | `await app.upgrade("user", "KEY");` |
| `check()` | Validates that current session token is alive | `await app.check();` |
| `getvar(varId)` | Fetches a protected server-side secret variable | `const val = await app.getvar("secret");` |
| `setvar(varId, val)` | Updates server-side variable value | `await app.setvar("key", "val");` |
| `log(message)` | Transmits security log to dashboard | `await app.log("Sensitive area accessed");` |
| `ban(reason)` | Bans current user and machine HWID | `await app.ban("Tampering detected");` |
| `webhook(webId, params)` | Triggers server-side webhook | `await app.webhook("WH_ID", "param=1");` |
| `get_hwid()` | Returns unique hardware ID (SID on Windows) | `const hwid = app.get_hwid();` |
| `logout()` | Destroys active session token | `await app.logout();` |

---

## 📄 License
This SDK is released under the [MIT License](LICENSE).
