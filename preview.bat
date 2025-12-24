@echo off
echo ========================================
echo   Letta Code Website Preview
echo ========================================
echo.
echo Starting local server...
echo.
echo Website will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% == 0 (
    python -m http.server 8000
    goto :end
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Installing http-server...
    call npm install -g http-server
    echo.
    echo Starting http-server...
    http-server -p 8000 -o
    goto :end
)

REM If neither is available, try to open the file directly
echo No Python or Node.js found. Opening in default browser...
start index.html
echo.
echo Note: Some features may not work correctly without a local server.
echo For the best experience, please install Python or Node.js.
echo.

:end
pause
