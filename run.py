"""
Security Risk Assessment Dashboard - Single Unified Launcher
Runs MongoDB, FastAPI Backend, and React Frontend with a single command.
Usage:
    python run.py
    or
    npm start
    or
    run.bat
"""

import os
import sys
import time
import socket
import subprocess
import webbrowser
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"
DB_DIR = BACKEND_DIR / "data" / "db"

def is_port_in_use(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.6)
        return s.connect_ex((host, port)) == 0

def find_executable(name: str, fallback_paths: list[Path]) -> str:
    # 1. Check system PATH
    import shutil
    found = shutil.which(name)
    if found:
        return found
    # 2. Check fallback locations
    for p in fallback_paths:
        if p.is_file():
            return str(p)
    return name

def main():
    print("=" * 64)
    print("  Security Risk Assessment Dashboard - Starting All Services")
    print("=" * 64)

    local_app_data = os.environ.get("LOCALAPPDATA", "")
    
    # Executable paths
    mongo_fallback = [
        Path(local_app_data) / "Programs" / "mongodb" / "bin" / "mongod.exe",
        Path("C:/Program Files/MongoDB/Server/7.0/bin/mongod.exe"),
        Path("C:/Program Files/MongoDB/Server/6.0/bin/mongod.exe"),
    ]
    mongod_exe = find_executable("mongod", mongo_fallback)

    node_fallback = [
        Path(local_app_data) / "Programs" / "nodejs" / "npm.cmd",
        Path("C:/Program Files/nodejs/npm.cmd"),
    ]
    npm_cmd = find_executable("npm.cmd", node_fallback)

    backend_python = BACKEND_DIR / "venv" / "Scripts" / "python.exe"
    if not backend_python.is_file():
        backend_python = Path(sys.executable)

    # 1. MongoDB (Port 27017)
    if is_port_in_use(27017):
        print("[1/3] MongoDB is already running on port 27017.")
    else:
        print("[1/3] Starting MongoDB on port 27017...")
        DB_DIR.mkdir(parents=True, exist_ok=True)
        try:
            subprocess.Popen(
                [mongod_exe, "--dbpath", str(DB_DIR), "--bind_ip", "127.0.0.1", "--port", "27017"],
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            # Wait for MongoDB to listen
            for _ in range(10):
                if is_port_in_use(27017):
                    break
                time.sleep(0.5)
            print("      MongoDB started successfully.")
        except Exception as e:
            print(f"      Warning: Could not start mongod automatically: {e}")

    # 2. FastAPI Backend (Port 8000)
    if is_port_in_use(8000):
        print("[2/3] FastAPI backend is already running on http://127.0.0.1:8000.")
    else:
        print("[2/3] Starting FastAPI backend on http://127.0.0.1:8000...")
        try:
            subprocess.Popen(
                [str(backend_python), "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
                cwd=str(BACKEND_DIR),
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            # Wait for Backend to listen
            for _ in range(10):
                if is_port_in_use(8000):
                    break
                time.sleep(0.5)
            print("      FastAPI backend started successfully.")
        except Exception as e:
            print(f"      Warning: Could not start FastAPI backend: {e}")

    # 3. React Frontend (Port 3000)
    if is_port_in_use(3000):
        print("[3/3] React frontend is already running on http://localhost:3000.")
    else:
        print("[3/3] Starting React frontend on http://localhost:3000...")
        env = os.environ.copy()
        # Ensure node is in PATH for npm
        node_dir = Path(local_app_data) / "Programs" / "nodejs"
        if node_dir.is_dir():
            env["PATH"] = f"{node_dir};{env.get('PATH', '')}"

        try:
            subprocess.Popen(
                [str(npm_cmd), "start"],
                cwd=str(FRONTEND_DIR),
                env=env,
                shell=True
            )
            print("      React frontend launched.")
        except Exception as e:
            print(f"      Warning: Could not start React frontend: {e}")

    print("=" * 64)
    print("  All services are active!")
    print("  - Web Application : http://localhost:3000")
    print("  - Backend API Docs: http://127.0.0.1:8000/docs")
    print("=" * 64)
    print("Tip: To stop all services, run 'stop.bat' or type 'stop'.")

if __name__ == "__main__":
    main()
