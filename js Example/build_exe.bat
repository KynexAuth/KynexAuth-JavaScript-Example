@echo off
title KynexAuth JavaScript EXE Builder
cls
echo ===================================================
echo     KynexAuth JavaScript Standalone EXE Builder
echo ===================================================
echo.

echo [*] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js is not found in PATH!
    echo [*] Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [*] Compiling standalone Windows .EXE...
call npx --yes pkg -t node16-win-x64 index.js -o dist/KynexAuth_Console.exe

if %errorlevel% equ 0 (
    echo.
    echo ===================================================
    echo [✓] Build Successful!
    echo [*] Output file: dist\KynexAuth_Console.exe
    echo ===================================================
) else (
    echo.
    echo [!] Build Failed. Please check the error above.
)

echo.
pause
