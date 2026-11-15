@echo off
title Stop SME Risk Framework
cd /d "%~dp0"

echo ==========================================================
echo   Stopping SME Risk Framework Services...
echo ==========================================================

if exist "backend\venv\Scripts\python.exe" (
    backend\venv\Scripts\python.exe stop.py
) else (
    python stop.py
)
