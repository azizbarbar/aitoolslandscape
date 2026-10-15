@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0server-launcher.ps1" -Action start
if errorlevel 1 (
  echo.
  pause
  exit /b 1
)
endlocal
