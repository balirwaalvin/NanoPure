# NanoPure App - Quick Setup Script for Windows PowerShell
# This script helps you get started with the NanoPure application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NanoPure Uganda Water Purification System" -ForegroundColor Green
Write-Host "Quick Setup Script for Windows PowerShell" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check Node.js
Write-Host "[1/6] Checking Node.js installation..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please download and install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "Required version: 18.x or later" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Git
Write-Host "`n[2/6] Checking Git installation..." -ForegroundColor Yellow
if (Test-Command "git") {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please download and install Git from https://git-scm.com/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host "`n[3/6] Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

try {
    & npm run install:all
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
    } else {
        throw "npm install failed"
    }
} catch {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Write-Host "Please check your internet connection and try again" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Set up environment files
Write-Host "`n[4/6] Setting up environment files..." -ForegroundColor Yellow

if (-not (Test-Path "nanopure-backend\.env")) {
    Copy-Item "nanopure-backend\.env.template" "nanopure-backend\.env"
    Write-Host "✓ Created nanopure-backend\.env from template" -ForegroundColor Green
    Write-Host "⚠️  Please edit nanopure-backend\.env with your database credentials" -ForegroundColor Yellow
} else {
    Write-Host "✓ nanopure-backend\.env already exists" -ForegroundColor Green
}

if (-not (Test-Path "nanopure-frontend\.env")) {
    Copy-Item "nanopure-frontend\.env.template" "nanopure-frontend\.env"
    Write-Host "✓ Created nanopure-frontend\.env from template" -ForegroundColor Green
} else {
    Write-Host "✓ nanopure-frontend\.env already exists" -ForegroundColor Green
}

# Check Git repository
Write-Host "`n[5/6] Checking if this is a Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit"
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already exists" -ForegroundColor Green
}

# Setup complete
Write-Host "`n[6/6] Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configure your database:" -ForegroundColor White
Write-Host "   - Edit nanopure-backend\.env with your MySQL credentials" -ForegroundColor Gray
Write-Host "   - Make sure MySQL server is running" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Initialize the database:" -ForegroundColor White
Write-Host "   cd nanopure-backend" -ForegroundColor Gray
Write-Host "   npm run setup" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the development servers:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. For deployment to Azure:" -ForegroundColor White
Write-Host "   - Read GITHUB_SETUP.md for GitHub repository setup" -ForegroundColor Gray
Write-Host "   - Read AZURE_DEPLOYMENT.md for Azure deployment" -ForegroundColor Gray
Write-Host "   - Use DEPLOYMENT_CHECKLIST.md as a reference" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Documentation Files:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "- README.md                 - Main project documentation" -ForegroundColor White
Write-Host "- GITHUB_SETUP.md          - GitHub repository setup guide" -ForegroundColor White
Write-Host "- AZURE_DEPLOYMENT.md      - Azure deployment guide" -ForegroundColor White
Write-Host "- DEPLOYMENT_CHECKLIST.md  - Step-by-step deployment checklist" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to continue"
