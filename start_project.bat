@echo off
title TradePulse AI Starter
echo  Starting TradePulse AI System...

:: 1. Backend Start karein (Dhyan rakhein ki 'Backend' folder ka B capital hai)
echo 🛠️ Starting Backend (FastAPI)...
start "Backend_Server" cmd /k "cd /d %~dp0Backend && python -m uvicorn main:app --reload"

:: 2. Frontend Start karein
echo 🖥️ Starting Frontend (React)...
start "Frontend_React" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ✅ Commands sent! Check the two new terminal windows.
pause