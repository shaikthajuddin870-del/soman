@echo off
setlocal
cd /d "%~dp0"
if not exist ".venv\Scripts\python.exe" (
  echo First run run.bat so the virtual environment can be created.
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup_email.ps1"
if errorlevel 1 (
  echo.
  echo Email setup did not complete.
  pause
)
