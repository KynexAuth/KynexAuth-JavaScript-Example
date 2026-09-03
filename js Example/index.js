/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                         KYNEXAUTH SECURITY LOADER                          ║
 * ║                  Premium JavaScript (Node.js) Console Auth                 ║
 * ║                      v3.0 - With Real Animations                           ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

const readline = require('readline');

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                    ADVANCED COLOR DEFINITIONS                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝
const Colors = {
    RESET: '\x1b[0m',
    BOLD: '\x1b[1m',
    DIM: '\x1b[2m',
    ITALIC: '\x1b[3m',
    UNDERLINE: '\x1b[4m',
    BLINK: '\x1b[5m',
    REVERSE: '\x1b[7m',

    // RGB-like Colors
    CYAN: '\x1b[36m',
    LIGHT_CYAN: '\x1b[96m',
    MAGENTA: '\x1b[35m',
    LIGHT_MAGENTA: '\x1b[95m',
    BLUE: '\x1b[34m',
    LIGHT_BLUE: '\x1b[94m',
    GREEN: '\x1b[32m',
    LIGHT_GREEN: '\x1b[92m',
    RED: '\x1b[31m',
    LIGHT_RED: '\x1b[91m',
    YELLOW: '\x1b[33m',
    LIGHT_YELLOW: '\x1b[93m',
    WHITE: '\x1b[37m',
    LIGHT_WHITE: '\x1b[97m',

    // 256 Color Palette
    PRIMARY: '\x1b[38;5;51m',      // Bright Cyan
    SECONDARY: '\x1b[38;5;226m',   // Bright Yellow
    SUCCESS: '\x1b[38;5;46m',      // Bright Green
    ERROR: '\x1b[38;5;196m',       // Bright Red
    WARNING: '\x1b[38;5;208m',     // Orange
    ACCENT: '\x1b[38;5;201m',      // Hot Pink/Magenta
    INFO: '\x1b[38;5;45m',         // Bright Turquoise
    PURPLE: '\x1b[38;5;135m',      // Purple
    GOLD: '\x1b[38;5;220m',        // Gold
    MUTED: '\x1b[38;5;244m',       // Gray
};

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                    GLOBAL READLINE INTERFACE                              ║
// ╚════════════════════════════════════════════════════════════════════════════╝
let rl = null;

function getReadlineInterface() {
    if (!rl) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
        });
    }
    return rl;
}

function closeReadlineInterface() {
    return new Promise((resolve) => {
        if (rl) {
            rl.close();
            rl = null;
        }
        setTimeout(resolve, 50);
    });
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                    ANIMATION FUNCTIONS                                    ║
// ╚════════════════════════════════════════════════════════════════════════════╝

async function fadeInText(text, delayMs = 10) {
    for (const char of text) {
        process.stdout.write(char);
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }
}

function rainbowText(text) {
    const colors = [Colors.PRIMARY, Colors.ACCENT, Colors.SECONDARY, Colors.SUCCESS, Colors.ACCENT];
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += colors[i % colors.length] + text[i];
    }
    return result + Colors.RESET;
}

function pulsingText(text, color) {
    return `${Colors.BOLD}${color}${text}${Colors.RESET}`;
}

function glitchText(text, color) {
    const glitch = ['█', '▓', '▒', '░'];
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += color + text[i] + Colors.RESET + Colors.MUTED + glitch[i % glitch.length] + Colors.RESET;
    }
    return result;
}

async function typewriterBanner() {
    const banner = `
${Colors.PRIMARY}${Colors.BOLD}
  ██╗  ██╗██╗   ██╗███╗   ██╗███████╗██╗  ██╗ █████╗ ██╗   ██╗████████╗██╗  ██╗
  ██║ ██╔╝╚██╗ ██╔╝████╗  ██║██╔════╝╚██╗██╔╝██╔══██╗██║   ██║╚══██╔╝╚██╗██╔╝██╔══██║
  █████╔╝  ╚████╔╝ ██╔██╗ ██║█████╗   ╚███╔╝ ███████║██║   ██║   ██║   ███████║
  ██╔═██╗   ╚██╔╝  ██║╚██╗██║██╔══╝   ██╔██╗ ██╔══██║██║   ██║   ██║   ██╔══██║
  ██║  ██╗   ██║   ██║ ╚████║███████╗██╔╝ ██╗██║  ██║╚██████╔╝   ██║   ██║  ██║
  ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝
${Colors.RESET}`;

    await fadeInText(banner, 2);
}

async function animatedDivider(char = '─', length = 74) {
    const colors = [Colors.PRIMARY, Colors.ACCENT, Colors.SECONDARY];
    for (let i = 0; i < length; i++) {
        const color = colors[i % colors.length];
        process.stdout.write(`${color}${char}${Colors.RESET}`);
        await new Promise(resolve => setTimeout(resolve, 5));
    }
    console.log();
}

function animatedSection(title) {
    const colors = [Colors.SECONDARY, Colors.GOLD, Colors.SECONDARY];
    const coloredTitle = colors[0] + Colors.BOLD + title + Colors.RESET;
    console.log(`\n  ${Colors.PRIMARY}┌─── ${coloredTitle} ${Colors.PRIMARY}${'─'.repeat(Math.max(50 - title.length, 4))}┐${Colors.RESET}\n`);
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                    ENHANCED PRINT FUNCTIONS                               ║
// ╚════════════════════════════════════════════════════════════════════════════╝

function printInfo(message, icon = 'ℹ') {
    console.log(`  ${Colors.PRIMARY}[${icon}]${Colors.RESET} ${Colors.INFO}${message}${Colors.RESET}`);
}

function printSuccess(message) {
    console.log(`  ${Colors.SUCCESS}${Colors.BOLD}[✓]${Colors.RESET} ${Colors.SUCCESS}${Colors.BOLD}${message}${Colors.RESET}`);
}

function printError(message) {
    console.log(`  ${Colors.ERROR}${Colors.BOLD}[✗]${Colors.RESET} ${Colors.ERROR}${message}${Colors.RESET}`);
}

function printWarning(message) {
    console.log(`  ${Colors.WARNING}${Colors.BOLD}[!]${Colors.RESET} ${Colors.WARNING}${message}${Colors.RESET}`);
}

async function askInput(promptText) {
    const interface = getReadlineInterface();
    const formattedPrompt = `  ${Colors.PRIMARY}[›]${Colors.RESET} ${Colors.SECONDARY}${promptText.padEnd(18, ' ')}${Colors.RESET} ${Colors.ACCENT}➜${Colors.RESET} `;

    return new Promise((resolve) => {
        interface.question(formattedPrompt, (ans) => {
            resolve(ans.trim());
        });
    });
}

async function loadingAnimationAdvanced(message, durationSec = 1.5) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const colors = [Colors.PRIMARY, Colors.ACCENT, Colors.SECONDARY, Colors.SUCCESS];
    let i = 0;
    const start = Date.now();

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const color = colors[(i / 2) % colors.length];
            process.stdout.write(`\r  ${color}${frames[i]}${Colors.RESET} ${Colors.INFO}${message}${Colors.RESET}${' '.repeat(30)}`);
            i = (i + 1) % frames.length;

            if (Date.now() - start >= durationSec * 1000) {
                clearInterval(interval);
                process.stdout.write(`\r  ${Colors.SUCCESS}✓${Colors.RESET} ${Colors.SUCCESS}${message}${Colors.RESET}${' '.repeat(30)}\n`);
                resolve();
            }
        }, 80);
    });
}

function printAnimatedMenu() {
    animatedSection('AUTHENTICATION OPTIONS');

    const options = [
        { num: '1', title: '➤ LOGIN', desc: 'Access with Username & Password', color: Colors.SECONDARY },
        { num: '2', title: '➤ REGISTER', desc: 'Create account with License Key', color: Colors.ACCENT },
        { num: '3', title: '➤ UPGRADE', desc: 'Extend account using License Key', color: Colors.GOLD },
        { num: '4', title: '➤ LICENSE', desc: 'Fast instant access via License Key', color: Colors.SUCCESS },
    ];

    options.forEach(({ num, title, desc, color }, idx) => {
        const button = `${Colors.PRIMARY}[${num}]${Colors.RESET} ${Colors.BOLD}${color}${title}${Colors.RESET}`;
        const descText = `${Colors.MUTED}${desc}${Colors.RESET}`;
        const line = idx < options.length - 1 ? '├─' : '└─';

        console.log(`  ${Colors.PRIMARY}${line}${Colors.RESET} ${button} ${Colors.MUTED}│${Colors.RESET} ${descText}`);
    });
    console.log();
}

function printUserDataAnimated(app) {
    const user = app.user_data;

    animatedSection('USER PROFILE INFORMATION');

    const info = [
        ['Username', user.username || 'N/A'],
        ['IP Address', user.ip || '127.0.0.1'],
        ['Hardware ID', user.hwid || 'N/A'],
        ['Created At', user.createdate || 'N/A'],
        ['Last Login', user.lastlogin || 'Just Now'],
    ];

    for (const [label, val] of info) {
        const coloredLabel = Colors.SECONDARY + Colors.BOLD + label.padEnd(16, ' ') + Colors.RESET;
        const coloredVal = Colors.INFO + val + Colors.RESET;
        console.log(`  ${Colors.PRIMARY}├─${Colors.RESET} ${coloredLabel} ${Colors.PRIMARY}::${Colors.RESET} ${coloredVal}`);
    }

    animatedSection('SUBSCRIPTION STATUS');

    if (user.subscriptions && user.subscriptions.length > 0) {
        user.subscriptions.forEach((sub) => {
            console.log(`  ${Colors.PRIMARY}├─${Colors.RESET} Plan: ${Colors.ACCENT}${Colors.BOLD}${sub.name}${Colors.RESET}`);
            console.log(`  ${Colors.PRIMARY}│  └─${Colors.RESET} Status: ${Colors.SUCCESS}${Colors.BOLD}[ACTIVE]${Colors.RESET} ${Colors.MUTED}|${Colors.RESET} Expiry: ${Colors.WARNING}${sub.expiry}${Colors.RESET}`);
        });
    } else {
        console.log(`  ${Colors.PRIMARY}├─${Colors.RESET} Plan: ${Colors.ACCENT}${Colors.BOLD}Default${Colors.RESET} ${Colors.MUTED}|${Colors.RESET} Status: ${Colors.SUCCESS}${Colors.BOLD}[ACTIVE]${Colors.RESET} ${Colors.MUTED}|${Colors.RESET} Expiry: ${Colors.LIGHT_YELLOW}${Colors.BOLD}Lifetime${Colors.RESET}`);
    }
}

function clearScreen() {
    if (process.platform === 'win32') {
        process.stdout.write('\x1Bc');
    } else {
        process.stdout.write('\x1b[2J\x1b[3J\x1b[H');
    }
}

function setTitle(title) {
    if (process.platform === 'win32') {
        process.stdout.write(`\x1b]0;${title}\x07`);
    }
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                         CONFIGURATION SECTION                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝
const { KynexAuth, api } = require('./kynexauth');

const kynexAuth = new KynexAuth({
    name: 'YOUR_APP_NAME',       // Application Name from dashboard
    ownerId: 'YOUR_APP_KEY',     // Application Key (Owner ID)
    version: '1.0',              // Application Version
    url: 'https://kynexauth.com/api/v1/client',
});

const KynexAuthApp = kynexAuth;

function startSessionWatchdog() {
    setInterval(async () => {
        const client = typeof kynexAuth !== 'undefined' ? kynexAuth : KynexAuthApp;
        const valid = await client.check();
        if (!valid) {
            console.log();
            printError('Session expired or revoked by server. Exiting...');
            await closeReadlineInterface();
            process.exit(1);
        }
    }, 30000);
}

async function main() {
    try {
        const client = typeof kynexAuth !== 'undefined' ? kynexAuth : KynexAuthApp;

        clearScreen();
        setTitle(`KynexAuth - ${new Date().toLocaleDateString()}`);

        // Animated Banner
        await typewriterBanner();

        console.log();
        await animatedDivider('═', 80);
        console.log(`  ${Colors.ACCENT}${Colors.BOLD}AUTHENTICATION & LICENSING ENGINE${Colors.RESET}`);
        await animatedDivider('═', 80);
        console.log();

        printInfo('Connecting to secure authentication server...', '>>');
        await loadingAnimationAdvanced('Establishing secure connection', 1.5);

        // Initialize API Session
        const initOk = await client.init();
        if (!initOk) {
            printError(`Initialization Failed: ${client.response.message}`);
            if (client.app_data.downloadLink) {
                printWarning(`Update available at: ${client.app_data.downloadLink}`);
            }
            await closeReadlineInterface();
            process.exit(1);
        }

        printSuccess('Connected and session secured!\n');

        printAnimatedMenu();

        const choice = await askInput('Select option (1-4)');

        let authOk = false;
        let authType = '';

        if (choice === '1') {
            authType = 'USER LOGIN';
            animatedSection(authType);
            const u = await askInput('Username');
            const p = await askInput('Password');
            await loadingAnimationAdvanced('Verifying credentials', 1.5);
            authOk = await client.login(u, p);
        } else if (choice === '2') {
            authType = 'NEW ACCOUNT REGISTRATION';
            animatedSection(authType);
            const u = await askInput('Username');
            const p = await askInput('Password');
            const k = await askInput('License Key');
            const e = await askInput('Email [Optional]');
            await loadingAnimationAdvanced('Creating new account', 1.5);
            authOk = await client.register(u, p, k, e);
        } else if (choice === '3') {
            authType = 'ACCOUNT UPGRADE';
            animatedSection(authType);
            const u = await askInput('Username');
            const k = await askInput('License Key');
            await loadingAnimationAdvanced('Processing upgrade', 1.5);
            authOk = await client.upgrade(u, k);
        } else if (choice === '4') {
            authType = 'LICENSE KEY VERIFICATION';
            animatedSection(authType);
            const k = await askInput('License Key');
            await loadingAnimationAdvanced('Verifying license key', 1.5);
            authOk = await client.license(k);
        } else {
            printError('Invalid selection! Please choose 1, 2, 3, or 4.');
            await closeReadlineInterface();
            process.exit(1);
        }

        if (!authOk) {
            console.log();
            printError(`${authType} Failed: ${client.response.message}`);
            await closeReadlineInterface();
            process.exit(1);
        }

        console.log();
        printSuccess(`${authType} Successful: ${client.response.message}`);

        printUserDataAnimated(client);

        startSessionWatchdog();

        // Animated Payload Section
        console.log();
        await animatedDivider('═', 80);
        console.log(`${Colors.SECONDARY}${Colors.BOLD}`);
        console.log('  ╔════════════════════════════════════════════════════════════════════════╗');
        console.log('  ║  WELCOME TO PROTECTED APPLICATION PAYLOAD                              ║');
        console.log('  ║  You can now execute your main application / script here!              ║');
        console.log('  ║                                                                        ║');
        console.log(`  ║  ${Colors.SUCCESS}::${Colors.RESET}${Colors.SECONDARY}${Colors.BOLD} All security validations passed${Colors.RESET}${Colors.SECONDARY}${Colors.BOLD}${' '.repeat(23)}║${Colors.RESET}`);
        console.log(`  ║  ${Colors.SUCCESS}::${Colors.RESET}${Colors.SECONDARY}${Colors.BOLD} Session monitoring active${Colors.RESET}${Colors.SECONDARY}${Colors.BOLD}${' '.repeat(35)}║${Colors.RESET}`);
        console.log(`  ║  ${Colors.SUCCESS}::${Colors.RESET}${Colors.SECONDARY}${Colors.BOLD} Ready for execution${Colors.RESET}${Colors.SECONDARY}${Colors.BOLD}${' '.repeat(42)}║${Colors.RESET}`);
        console.log('  ╚════════════════════════════════════════════════════════════════════════╝');
        console.log(`${Colors.RESET}`);
        await animatedDivider('═', 80);
        console.log();

        await askInput('Press ENTER to exit...');
        await closeReadlineInterface();
        process.exit(0);
    } catch (err) {
        printError(`Unexpected error: ${err.message}`);
        await closeReadlineInterface();
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    console.log(`\n\n  ${Colors.ERROR}${Colors.BOLD}[!!] Program terminated by user.${Colors.RESET}`);
    await closeReadlineInterface();
    process.exit(0);
});

main().catch(async (err) => {
    printError(`Fatal error: ${err.message}`);
    await closeReadlineInterface();
    process.exit(1);
});