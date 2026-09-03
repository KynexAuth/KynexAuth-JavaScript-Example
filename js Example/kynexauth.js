/**
 * KynexAuth JavaScript / Node.js Client SDK
 * ─────────────────────────────────────────────────────────────────────────────
 * Zero-dependency, lightweight, official Node.js SDK for KynexAuth API.
 * 100% compatible with C#, C++, and Python specification.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const https = require('https');
const http = require('http');
const crypto = require('crypto');
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

class Subscription {
    constructor(data = {}) {
        this.name = data.subscription || data.name || 'default';
        this.expiry = data.expiry || 'Lifetime / Active';
    }
}

class UserData {
    constructor(data = {}) {
        this.username = data.username || '';
        this.ip = data.ip || '';
        this.hwid = data.hwid || '';
        this.createdate = data.createdate || '';
        this.lastlogin = data.lastlogin || '';
        this.area = data.area || '';
        this.rank = data.rank || '';
        this.role = data.role || '';
        this.owner = data.owner || '';
        this.subscriptions = (data.subscriptions || []).map(s => new Subscription(s));
    }
}

class AppData {
    constructor(data = {}) {
        this.numUsers = data.numUsers || '0';
        this.numOnlineUsers = data.numOnlineUsers || '0';
        this.numKeys = data.numKeys || '0';
        this.version = data.version || '1.0';
        this.customerPanelLink = data.customerPanelLink || '';
        this.downloadLink = data.downloadLink || '';
        this.serverTime = data.serverTime || '';
    }
}

class ResponseData {
    constructor(success = false, message = '') {
        this.success = Boolean(success);
        this.message = String(message || '');
    }
}

class KynexAuth {
    /**
     * Initialize KynexAuth API Client
     * @param {Object} config
     * @param {string} config.name - Application Name from dashboard
     * @param {string} config.ownerid - App Key / Owner ID from dashboard
     * @param {string} [config.version="1.0"] - Application Version
     * @param {string} [config.url="https://kynexauth.com/api/v1/client"] - API Endpoint
     * @param {boolean} [config.debug=false] - Print raw request/response logs
     */
    constructor({ name, ownerid, ownerId, version = '1.0', url, apiUrl, debug = false }) {
        this.name = name || '';
        this.ownerid = ownerid || ownerId || '';
        this.version = version;
        this.url = (url || apiUrl || 'https://kynexauth.com/api/v1/client').replace(/\/+$/, '');
        this.debug = debug;

        this.sessionid = '';
        this.initialized = false;
        this.user_data = new UserData();
        this.app_data = new AppData();
        this.response = new ResponseData();
        this._hwidCache = '';
    }

    /**
     * Retrieve unique Windows User SID as HWID
     * @returns {string}
     */
    get_hwid() {
        if (this._hwidCache) return this._hwidCache;

        if (process.platform === 'win32') {
            try {
                const output = execSync('whoami /user', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 3000 });
                const match = output.match(/S-1-5-21-[\d-]+/);
                if (match) {
                    this._hwidCache = match[0];
                    return this._hwidCache;
                }
            } catch (e) {}

            try {
                const username = process.env.USERNAME || '';
                const output = execSync(`wmic useraccount where name="${username}" get sid`, {
                    encoding: 'utf8',
                    stdio: ['pipe', 'pipe', 'ignore'],
                    timeout: 3000,
                });
                const match = output.match(/S-1-5-21-[\d-]+/);
                if (match) {
                    this._hwidCache = match[0];
                    return this._hwidCache;
                }
            } catch (e) {}
        }

        const fallback = `${os.hostname()}-${os.platform()}-${os.arch()}-${os.userInfo().username}`;
        this._hwidCache = crypto.createHash('sha256').update(fallback).digest('hex').substring(0, 32);
        return this._hwidCache;
    }

    /**
     * Generate MD5 checksum of running file
     * @returns {string}
     */
    get_checksum() {
        try {
            const file = process.argv[1];
            if (file && fs.existsSync(file)) {
                const buf = fs.readFileSync(file);
                return crypto.createHash('md5').update(buf).digest('hex');
            }
        } catch (e) {}
        return '';
    }

    /**
     * Send HTTP POST request to API endpoint
     * @param {string} endpoint
     * @param {Object} payload
     * @returns {Promise<string>}
     */
    async _req(endpoint, payload = {}) {
        const fullUrl = `${this.url}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
        const postData = JSON.stringify(payload);

        if (this.debug) {
            console.log(`[DEBUG >>] POST ${fullUrl} | Payload: ${postData}`);
        }

        return new Promise((resolve) => {
            try {
                const urlObj = new URL(fullUrl);
                const isHttps = urlObj.protocol === 'https:';
                const client = isHttps ? https : http;

                const req = client.request(
                    {
                        hostname: urlObj.hostname,
                        port: urlObj.port || (isHttps ? 443 : 80),
                        path: urlObj.pathname + urlObj.search,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(postData),
                            'User-Agent': 'KynexAuth-NodeJS/1.0',
                        },
                        timeout: 15000,
                    },
                    (res) => {
                        let responseBody = '';
                        res.on('data', (chunk) => {
                            responseBody += chunk;
                        });
                        res.on('end', () => {
                            if (this.debug) {
                                console.log(`[DEBUG <<] Status ${res.statusCode} | Raw: ${responseBody}`);
                            }
                            resolve(responseBody);
                        });
                    }
                );

                req.on('error', (err) => {
                    if (this.debug) {
                        console.error(`[DEBUG !!] Network error: ${err.message}`);
                    }
                    resolve(JSON.stringify({ success: false, message: `Network error: ${err.message}` }));
                });

                req.on('timeout', () => {
                    req.destroy();
                    resolve(JSON.stringify({ success: false, message: 'Request timed out' }));
                });

                req.write(postData);
                req.end();
            } catch (err) {
                resolve(JSON.stringify({ success: false, message: err.message }));
            }
        });
    }

    _parseLoginResponse(resStr, defaultUsername = '', caller = 'login') {
        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || (this.response.success ? 'Success' : 'Failed'));

            if (this.response.success) {
                const info = data.userInfo || data.user || data.info || data.userData || {};

                const formatDate = (ts) => {
                    if (!ts || ts === '0') return 'Lifetime / Active';
                    const num = parseInt(ts, 10);
                    if (isNaN(num) || num <= 0) return ts;
                    const d = num > 10000000000 ? new Date(num) : new Date(num * 1000);
                    return isNaN(d.getTime()) ? ts : d.toLocaleString();
                };

                const expiryFormatted = formatDate(info.expiresAt || info.expiry);
                const createdFormatted = formatDate(info.createdAt || info.createdate);

                const subsList = Array.isArray(info.subscriptions) && info.subscriptions.length > 0
                    ? info.subscriptions.map(s => new Subscription({
                        subscription: s.subscription || s.name || 'Premium Plan',
                        expiry: formatDate(s.expiry || s.expiresAt || expiryFormatted),
                    }))
                    : [
                        new Subscription({
                            subscription: info.subscription || (data.subscription ? data.subscription.name : 'Premium Plan'),
                            expiry: expiryFormatted,
                        }),
                    ];

                this.user_data = new UserData({
                    username: info.username || defaultUsername,
                    ip: info.ip || data.ip || '127.0.0.1',
                    hwid: info.hwid || this.get_hwid(),
                    createdate: createdFormatted,
                    lastlogin: info.lastLogin || info.lastlogin || 'Just now',
                    area: info.area || '',
                    rank: info.rank || '',
                    role: info.role || '',
                    owner: info.owner || '',
                    subscriptions: subsList,
                });
                return true;
            }
            return false;
        } catch (e) {
            this.response.success = false;
            this.response.message = resStr || 'Invalid server response';
            return false;
        }
    }

    /**
     * Initialize connection with KynexAuth server
     * @returns {Promise<boolean>}
     */
    async init() {
        const payload = {
            name: this.name,
            appKey: this.ownerid,
            version: this.version,
            hash: this.get_checksum(),
        };

        const resStr = await this._req('/init', payload);

        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || '');

            if (this.response.success) {
                this.initialized = true;
                this.sessionid = String(data.sessionToken || '');
                const appInfo = data.appInfo || {};
                this.app_data.version = String(appInfo.version || this.version);
                if (appInfo.name && !this.name) {
                    this.name = String(appInfo.name);
                }
            }

            if (data.downloadLink) {
                this.app_data.downloadLink = String(data.downloadLink);
            }

            return this.response.success;
        } catch (e) {
            this.response.success = false;
            this.response.message = resStr || 'Failed to initialize connection';
            return false;
        }
    }

    /**
     * Authenticate with username and password
     * @param {string} username
     * @param {string} password
     * @returns {Promise<boolean>}
     */
    async login(username, password) {
        const payload = {
            username,
            password,
            hwid: this.get_hwid(),
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/login', payload);
        return this._parseLoginResponse(resStr, username, 'login');
    }

    /**
     * Register a new account with a license key
     * @param {string} username
     * @param {string} password
     * @param {string} key
     * @param {string} [email=""]
     * @returns {Promise<boolean>}
     */
    async register(username, password, key, email = '') {
        const payload = {
            username,
            password,
            licenseKey: key,
            email,
            hwid: this.get_hwid(),
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/register', payload);
        return this._parseLoginResponse(resStr, username, 'register');
    }

    /**
     * Instant authentication using license key only
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async license(key) {
        const payload = {
            licenseKey: key,
            hwid: this.get_hwid(),
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/license', payload);
        return this._parseLoginResponse(resStr, `Key_${key.substring(0, 6)}`, 'license');
    }

    /**
     * Extend/upgrade subscription for an existing user
     * @param {string} username
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async upgrade(username, key) {
        const payload = {
            username,
            licenseKey: key,
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/upgrade', payload);
        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || '');
            return this.response.success;
        } catch (e) {
            return false;
        }
    }

    /**
     * Verify that active session token is still valid
     * @returns {Promise<boolean>}
     */
    async check() {
        const payload = {
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/check', payload);
        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || '');
            return this.response.success;
        } catch (e) {
            return false;
        }
    }

    /**
     * Fetch a secure server-side secret variable
     * @param {string} var_name
     * @returns {Promise<string>}
     */
    async getvar(var_name) {
        const payload = {
            varid: var_name,
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/var', payload);
        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || '');
            if (this.response.success) {
                return String(data.response || data.value || '');
            }
            return '';
        } catch (e) {
            return '';
        }
    }

    /**
     * Set a server-side variable
     * @param {string} var_name
     * @param {string} var_data
     * @returns {Promise<boolean>}
     */
    async setvar(var_name, var_data) {
        const payload = {
            varid: var_name,
            vardata: var_data,
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/setvar', payload);
        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || '');
            return this.response.success;
        } catch (e) {
            return false;
        }
    }

    /**
     * Transmit activity / security log to dashboard
     * @param {string} message
     * @returns {Promise<boolean>}
     */
    async log(message) {
        const payload = {
            message,
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/log', payload);
        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || '');
            return this.response.success;
        } catch (e) {
            return false;
        }
    }

    /**
     * Instantly ban current user & HWID
     * @param {string} [reason="Security violation detected"]
     * @returns {Promise<boolean>}
     */
    async ban(reason = 'Security violation detected') {
        const payload = {
            reason,
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/ban', payload);
        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || '');
            return this.response.success;
        } catch (e) {
            return false;
        }
    }

    /**
     * Trigger a server-side webhook securely
     * @param {string} id
     * @param {string} [params=""]
     * @returns {Promise<string>}
     */
    async webhook(id, params = '') {
        const payload = {
            webid: id,
            params,
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/webhook', payload);
        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || '');
            if (this.response.success) {
                return String(data.response || '');
            }
            return '';
        } catch (e) {
            return '';
        }
    }

    /**
     * Fetch messages from a chat channel
     * @param {string} channel
     * @returns {Promise<Array>}
     */
    async chatget(channel) {
        const payload = {
            channel,
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/chat/get', payload);
        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || '');
            if (this.response.success && Array.isArray(data.messages)) {
                return data.messages;
            }
            return [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Send message to a chat channel
     * @param {string} message
     * @param {string} channel
     * @returns {Promise<boolean>}
     */
    async chatsend(message, channel) {
        const payload = {
            message,
            channel,
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/chat/send', payload);
        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || '');
            return this.response.success;
        } catch (e) {
            return false;
        }
    }

    /**
     * Invalidate active session
     * @returns {Promise<boolean>}
     */
    async logout() {
        const payload = {
            sessionToken: this.sessionid,
        };

        const resStr = await this._req('/logout', payload);
        this.sessionid = '';
        this.initialized = false;
        this.user_data = new UserData();

        try {
            const data = JSON.parse(resStr);
            this.response.success = Boolean(data.success);
            this.response.message = String(data.message || '');
            return this.response.success;
        } catch (e) {
            return false;
        }
    }
}

module.exports = {
    KynexAuth,
    api: KynexAuth,
};
