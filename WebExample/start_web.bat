@echo off
title KynexAuth JavaScript Web Server
cls
echo ===================================================
echo        KynexAuth Node.js Web Server
echo ===================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js is not found in your PATH!
    echo [*] Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [*] Starting Node.js Web Server at http://localhost:3000 ...
echo [*] Opening browser...
start http://localhost:3000
echo.
echo [✓] Web Server is RUNNING. Press Ctrl+C to stop.
echo ===================================================
echo.

node server.js
pause
