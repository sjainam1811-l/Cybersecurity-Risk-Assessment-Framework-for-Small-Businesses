"""
Security Risk Assessment Dashboard - Stop All Services
Stops MongoDB, FastAPI backend, and React frontend processes.
Usage:
    python stop.py
    or
    stop.bat
"""

import os
import subprocess

def main():
    print("Stopping Security Risk Assessment Dashboard services...")

    # Stop mongod
    try:
        subprocess.run(["taskkill", "/F", "/IM", "mongod.exe"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("Stopped MongoDB.")
    except Exception:
        pass

    # Stop uvicorn / python processes running the backend
    try:
        # Stop process listening on 8000
        output = subprocess.check_output('netstat -ano | findstr :8000', shell=True).decode()
        for line in output.strip().splitlines():
            parts = line.split()
            if len(parts) >= 5 and "LISTENING" in line:
                pid = parts[-1]
                subprocess.run(["taskkill", "/F", "/PID", pid], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("Stopped Backend.")
    except Exception:
        pass

    # Stop node processes listening on 3000
    try:
        output = subprocess.check_output('netstat -ano | findstr :3000', shell=True).decode()
        for line in output.strip().splitlines():
            parts = line.split()
            if len(parts) >= 5 and "LISTENING" in line:
                pid = parts[-1]
                subprocess.run(["taskkill", "/F", "/PID", pid], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("Stopped Frontend.")
    except Exception:
        pass

    print("All services stopped.")

if __name__ == "__main__":
    main()
