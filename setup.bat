@echo off
REM NanoPure App - Quick Setup Script for Windows
REM This script helps you get started with the NanoPure application

echo ========================================
echo NanoPure Uganda Water Purification System
echo Quick Setup Script for Windows
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please download and install Node.js from https://nodejs.org/
    echo Required version: 18.x or later
    pause
    exit /b 1
) else (
    echo ✓ Node.js is installed
    node --version
)

echo.
echo [2/6] Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please download and install Git from https://git-scm.com/
    pause
    exit /b 1
) else (
    echo ✓ Git is installed
    git --version
)

echo.
echo [3/6] Installing dependencies...
echo This may take a few minutes...
call npm run install:all
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    echo Please check your internet connection and try again
    pause
    exit /b 1
)
echo ✓ Dependencies installed successfully

echo.
echo [4/6] Setting up environment files...
if not exist "nanopure-backend\.env" (
    copy "nanopure-backend\.env.template" "nanopure-backend\.env"
    echo ✓ Created nanopure-backend\.env from template
    echo ⚠️  Please edit nanopure-backend\.env with your database credentials
) else (
    echo ✓ nanopure-backend\.env already exists
)

if not exist "nanopure-frontend\.env" (
    copy "nanopure-frontend\.env.template" "nanopure-frontend\.env"
    echo ✓ Created nanopure-frontend\.env from template
) else (
    echo ✓ nanopure-frontend\.env already exists
)

echo.
echo [5/6] Checking if this is a Git repository...
if not exist ".git" (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit"
    echo ✓ Git repository initialized
) else (
    echo ✓ Git repository already exists
)

echo.
echo [6/6] Setup Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Configure your database:
echo    - Edit nanopure-backend\.env with your MySQL credentials
echo    - Make sure MySQL server is running
echo.
echo 2. Initialize the database:
echo    cd nanopure-backend
echo    npm run setup
echo.
echo 3. Start the development servers:
echo    npm run dev
echo.
echo 4. For deployment to Azure:
echo    - Read GITHUB_SETUP.md for GitHub repository setup
echo    - Read AZURE_DEPLOYMENT.md for Azure deployment
echo    - Use DEPLOYMENT_CHECKLIST.md as a reference
echo.
echo ========================================
echo Documentation Files:
echo ========================================
echo - README.md                 - Main project documentation
echo - GITHUB_SETUP.md          - GitHub repository setup guide
echo - AZURE_DEPLOYMENT.md      - Azure deployment guide
echo - DEPLOYMENT_CHECKLIST.md  - Step-by-step deployment checklist
echo.
echo Happy coding! 🚀
echo.
pause
