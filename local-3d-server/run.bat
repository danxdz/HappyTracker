@echo off
echo 🎮 Local 3D Generation Server
echo ================================

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Virtual environment not found. Running setup...
    python setup.py
    if errorlevel 1 (
        echo ❌ Setup failed
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if dependencies are installed
python -c "import torch, gradio, point_e" 2>nul
if errorlevel 1 (
    echo 📦 Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Create outputs directory
if not exist "outputs" mkdir outputs

REM Start the server
echo 🚀 Starting 3D Generation Server...
echo 📱 Open browser to: http://localhost:7860
echo.
python server.py

pause
