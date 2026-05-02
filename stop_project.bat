@echo off
title TradePulse AI Stopper
echo 🛑 Shutting down TradePulse AI...

:: Kill Python (Backend) process
taskkill /F /IM python.exe /T >nul 2>&1
:: Kill Node/Uvicorn processes
taskkill /F /IM node.exe /T >nul 2>&1

echo.
echo ✅ All services stopped successfully!
pause