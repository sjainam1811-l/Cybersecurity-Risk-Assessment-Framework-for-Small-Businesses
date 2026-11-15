@echo off
title SME Risk Framework Launcher
cd /d "%~dp0"

echo ==========================================================
echo   SME Risk Framework - Starting All Services
echo   (MongoDB + FastAPI Backend + React Frontend)
echo ==========================================================

if exist "backend\venv\Scripts\python.exe" (
    backend\venv\Scripts\python.exe run.py
) else (
    python run.py
)
