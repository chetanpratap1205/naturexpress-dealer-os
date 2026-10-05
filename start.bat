@echo off
title NatureXpress Tata Dealership OS
echo ===============================================================================
echo                NATUREXPRESS ENTERPRISE DEALERSHIP OS
echo      Connected Workshop & High-Margin Revenue Engine for Tata Motors
echo ===============================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH! Please install Node.js.
    pause
    exit /b 1
)

echo [2/3] Launching NatureXpress Backend Server on http://localhost:5000 ...
start "NatureXpress Backend Server" cmd /k "cd server && node index.js"

echo [3/3] Launching NatureXpress Frontend Client on http://localhost:3000 ...
start "NatureXpress Frontend Client" cmd /k "cd client && npm run dev"

echo.
echo ===============================================================================
echo  NatureXpress Dealership OS is starting!
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:5000
echo ===============================================================================
echo.
timeout /t 3 >nul
start http://localhost:3000
