@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Dholakpur Python Hero Lab

echo ==================================================
echo   DHOLAKPUR PYTHON HERO LAB - STARTING...
echo ==================================================
echo.

echo [1/4] Checking Python...
py --version
if errorlevel 1 (
    echo.
    echo [ERROR] Python Launcher was not found.
    echo Please check that Python 3.14 is installed.
    pause
    exit /b 1
)

echo.
echo [2/4] Creating virtual environment (first run only)...
if not exist ".venv\Scripts\python.exe" (
    py -3.14 -m venv .venv
    if errorlevel 1 (
        echo.
        echo [ERROR] Virtual environment creation failed.
        pause
        exit /b 1
    )
) else (
    echo Virtual environment already exists.
)

echo.
if not exist ".env" if exist ".env.example" copy /Y ".env.example" ".env" >nul
echo [3/4] Installing/checking packages...
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo [ERROR] Package installation failed.
    pause
    exit /b 1
)

findstr /C:"yourgmail@gmail.com" /C:"your_16_character_app_password" ".env" >nul
if not errorlevel 1 (
    echo.
    echo ==================================================
    echo [SETUP] Gmail OTP is not configured yet.
    echo ==================================================
    echo.
    echo A one-time Gmail setup window will open now.
    echo You need a Google App Password for the sender Gmail.
    echo.
    call "%~dp0setup_email.bat"
    if errorlevel 1 (
        echo.
        echo [ERROR] Gmail OTP setup was not completed.
        pause
        exit /b 1
    )
)

echo.
echo [4/4] Starting website server...
echo.
echo Keep this black window OPEN while using the website.
echo Website: http://127.0.0.1:5000/login
echo.
echo IMPORTANT: To enable student email verification, login as Admin and use the "OTP Email Setup" panel to configure SMTP.
echo For Gmail, use a Google App Password rather than your normal Gmail password.
echo.

start "" "http://127.0.0.1:5000/login"
".venv\Scripts\python.exe" app.py

if errorlevel 1 (
    echo.
    echo ==================================================
    echo [ERROR] The Flask server stopped with an error.
    echo ==================================================
    pause
)
