@echo off
title THERMOSAFE Launcher
echo ===================================================
echo 🔥 THERMOSAFE — Vercel Serverless Architecture
echo ===================================================
echo.
echo Architecture: Vercel Hosting + Vercel Serverless Functions
echo Data Source:  Open-Meteo API (via Vercel Cron every 3 hours)
echo Database:     Supabase (managed, no local server needed)
echo.

echo Starting React Frontend (Local Dev)...
start "THERMOSAFE Frontend" /d "%~dp0frontend" cmd /k "npm run dev"

echo.
echo Waiting for server to start...
timeout /t 3 >nul

echo Opening THERMOSAFE in your browser...
start http://localhost:5173

echo.
echo ===================================================
echo ✅ THERMOSAFE is running!
echo 🌐 Local:      http://localhost:5173
echo 📡 API:        /api/htss  /api/weather  /api/refresh
echo.
echo NOTE: For local API testing, use Vercel CLI:
echo   cd frontend ^& npx vercel dev
echo.
echo In PRODUCTION: Deploy to Vercel — no server needed!
echo ===================================================
echo.
echo The Python FastAPI backend is no longer required.
echo All server-side logic runs as Vercel Serverless Functions.
echo.
