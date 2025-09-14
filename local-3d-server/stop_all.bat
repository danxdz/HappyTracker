@echo off
echo 🛑 Stopping Face Cartoon System...
echo ================================================

echo 🔍 Finding Python processes...
tasklist /FI "IMAGENAME eq python.exe" /FO TABLE

echo.
echo 🛑 Stopping all Python processes...
taskkill /F /IM python.exe

echo.
echo ✅ All servers stopped!
echo ================================================

pause
