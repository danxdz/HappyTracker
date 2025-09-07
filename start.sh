#!/bin/bash

echo "🎨 Starting DrawTogether - The Viral Drawing App! 🚀"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🚀 Starting the development servers..."
echo ""

# Start the Next.js app in the background
echo "Starting Next.js app on http://localhost:3000"
npm run dev &
NEXT_PID=$!

# Wait a moment for Next.js to start
sleep 3

# Start the WebSocket server in the background
echo "Starting WebSocket server on http://localhost:3001"
node server.js &
SOCKET_PID=$!

echo ""
echo "✅ DrawTogether is now running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 WebSocket: http://localhost:3001"
echo "🎨 Drawing App: http://localhost:3000/draw"
echo ""
echo "🔥 Ready to go viral! Start drawing and sharing!"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $NEXT_PID 2>/dev/null
    kill $SOCKET_PID 2>/dev/null
    echo "✅ Servers stopped. Thanks for using DrawTogether!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait