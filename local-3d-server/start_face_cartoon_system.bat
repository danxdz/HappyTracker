@echo off
echo 🎭 Starting Face Cartoon System...
echo ================================================
echo 🌐 UI Server: http://localhost:8003/face_cartoon_ui.html
echo 🔧 API Server: http://localhost:8002
echo ================================================

echo 🔪 Cleaning up existing processes...
taskkill /F /IM python.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 🌐 Starting UI Server...
start "Face Cartoon UI" cmd /k "venv\Scripts\python.exe ui_server.py"

timeout /t 3 /nobreak >nul

echo 🔧 Starting API Server...
start "Face Analysis API" cmd /k "venv\Scripts\python.exe face_3d_server.py"

timeout /t 3 /nobreak >nul

echo ✅ Both servers started!
echo ================================================
echo 🌐 Open: http://localhost:8003/face_cartoon_ui.html
echo 🔧 API: http://localhost:8002
echo ================================================
echo 🛑 Close the server windows to stop the servers
echo ================================================

pause
