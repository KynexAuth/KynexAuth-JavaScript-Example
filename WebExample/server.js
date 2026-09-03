/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                      KYNEXAUTH JS WEB APPLICATION SERVER                   ║
 * ║               Zero-Dependency Pure Node.js Web Portal Server               ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { KynexAuth } = require('./kynexauth');

const PORT = process.env.PORT || 3000;

// -------------------------------------------------------------
// CONFIGURE YOUR APPLICATION CREDENTIALS
// -------------------------------------------------------------
const kynexAuth = new KynexAuth({
    name: 'testerr',             // Application Name from dashboard
    ownerId: 'Z2zapMIjyB2nkw7ahr', // Application Key (Owner ID)
    version: '1.1',              // Application Version
    url: 'https://kynexauth.com/api/v1/client',
});

// Active user session store
let currentSession = null;

/**
 * Read request JSON body helper
 */
function readBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
    });
}

/**
 * Send JSON response helper
 */
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(data));
}

// Create HTTP Web Server
const server = http.createServer(async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        return res.end();
    }

    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = parsedUrl.pathname;

    // 1. Serve HTML Web UI
    if (pathname === '/' || pathname === '/index.html') {
        const htmlPath = path.join(__dirname, 'index.html');
        if (fs.existsSync(htmlPath)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return fs.createReadStream(htmlPath).pipe(res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('index.html not found');
        }
    }

    // 2. API Routes
    if (pathname === '/api/login' && req.method === 'POST') {
        const { username, password } = await readBody(req);
        if (!kynexAuth.initialized) await kynexAuth.init();

        const ok = await kynexAuth.login(username, password);
        if (ok) {
            currentSession = {
                username: kynexAuth.user_data.username,
                ip: kynexAuth.user_data.ip,
                hwid: kynexAuth.user_data.hwid,
                createdate: kynexAuth.user_data.createdate,
                lastlogin: kynexAuth.user_data.lastlogin,
                subscriptions: kynexAuth.user_data.subscriptions,
            };
            return sendJson(res, 200, { success: true, message: kynexAuth.response.message, user: currentSession });
        } else {
            return sendJson(res, 400, { success: false, message: kynexAuth.response.message });
        }
    }

    if (pathname === '/api/register' && req.method === 'POST') {
        const { username, password, licenseKey, email } = await readBody(req);
        if (!kynexAuth.initialized) await kynexAuth.init();

        const ok = await kynexAuth.register(username, password, licenseKey, email);
        return sendJson(res, ok ? 200 : 400, {
            success: ok,
            message: kynexAuth.response.message,
        });
    }

    if (pathname === '/api/license' && req.method === 'POST') {
        const { licenseKey } = await readBody(req);
        if (!kynexAuth.initialized) await kynexAuth.init();

        const ok = await kynexAuth.license(licenseKey);
        if (ok) {
            currentSession = {
                username: kynexAuth.user_data.username,
                ip: kynexAuth.user_data.ip,
                hwid: kynexAuth.user_data.hwid,
                createdate: kynexAuth.user_data.createdate,
                lastlogin: kynexAuth.user_data.lastlogin,
                subscriptions: kynexAuth.user_data.subscriptions,
            };
            return sendJson(res, 200, { success: true, message: kynexAuth.response.message, user: currentSession });
        } else {
            return sendJson(res, 400, { success: false, message: kynexAuth.response.message });
        }
    }

    if (pathname === '/api/upgrade' && req.method === 'POST') {
        const { username, licenseKey } = await readBody(req);
        if (!kynexAuth.initialized) await kynexAuth.init();

        const ok = await kynexAuth.upgrade(username, licenseKey);
        return sendJson(res, ok ? 200 : 400, {
            success: ok,
            message: kynexAuth.response.message,
        });
    }

    if (pathname === '/api/session' && req.method === 'GET') {
        if (currentSession) {
            return sendJson(res, 200, { success: true, user: currentSession });
        } else {
            return sendJson(res, 401, { success: false, message: 'No active session' });
        }
    }

    if (pathname === '/api/logout' && req.method === 'POST') {
        currentSession = null;
        if (kynexAuth.initialized) await kynexAuth.logout();
        return sendJson(res, 200, { success: true, message: 'Logged out successfully' });
    }

    // Default 404
    sendJson(res, 404, { success: false, message: 'Endpoint not found' });
});

// Start Server
server.listen(PORT, async () => {
    console.log(`\n  ======================================================`);
    console.log(`  🚀 KynexAuth JavaScript Web Server Running!`);
    console.log(`  🌐 URL: http://localhost:${PORT}`);
    console.log(`  ======================================================\n`);

    console.log(`  [*] Initializing KynexAuth API handshake...`);
    const ok = await kynexAuth.init();
    if (ok) {
        console.log(`  [✓] Handshake Established. Cloud session active!`);
    } else {
        console.log(`  [!] Handshake Notice: ${kynexAuth.response.message}`);
    }
});
