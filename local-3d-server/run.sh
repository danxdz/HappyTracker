#!/bin/bash

echo "🎮 Local 3D Generation Server"
echo "================================"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Virtual environment not found. Running setup..."
    python3 setup.py
    if [ $? -ne 0 ]; then
        echo "❌ Setup failed"
        exit 1
    fi
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
python -c "import torch, gradio, point_e" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Create outputs directory
mkdir -p outputs

# Start the server
echo "🚀 Starting 3D Generation Server..."
echo "📱 Open browser to: http://localhost:7860"
echo ""
python server.py
